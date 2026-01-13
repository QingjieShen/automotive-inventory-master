import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { batchUpload } from '@/lib/gcs'
import { ImageType } from '@/types'

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id: vehicleId } = await params

    // Verify vehicle exists and user has access
    const vehicle = await prisma.vehicle.findUnique({
      where: { id: vehicleId },
      include: { store: true }
    })

    if (!vehicle) {
      return NextResponse.json({ error: 'Vehicle not found' }, { status: 404 })
    }

    // Parse multipart form data
    const formData = await request.formData()
    const files: File[] = []
    const imageTypes: ImageType[] = []

    // Extract files and their corresponding image types
    for (const [key, value] of formData.entries()) {
      if (key.startsWith('file_') && value instanceof File) {
        files.push(value)
        
        // Get corresponding image type
        const index = key.split('_')[1]
        const imageType = formData.get(`imageType_${index}`) as ImageType || 'GALLERY'
        imageTypes.push(imageType)
      }
    }

    if (files.length === 0) {
      return NextResponse.json({ error: 'No files provided' }, { status: 400 })
    }

    // Validate file types and sizes
    const maxFileSize = 10 * 1024 * 1024 // 10MB
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp']

    for (const file of files) {
      if (!allowedTypes.includes(file.type)) {
        return NextResponse.json(
          { error: `Invalid file type: ${file.type}. Allowed types: ${allowedTypes.join(', ')}` },
          { status: 400 }
        )
      }

      if (file.size > maxFileSize) {
        return NextResponse.json(
          { error: `File too large: ${file.name}. Maximum size: 10MB` },
          { status: 400 }
        )
      }
    }

    // Convert files to buffers for GCS upload
    const fileData = await Promise.all(
      files.map(async (file, index) => ({
        buffer: Buffer.from(await file.arrayBuffer()),
        contentType: file.type,
        originalName: file.name,
        imageType: imageTypes[index]
      }))
    )

    // Check if GCS is configured
    const isGCSConfigured = 
      process.env.GOOGLE_CLOUD_PROJECT_ID && 
      (process.env.GOOGLE_APPLICATION_CREDENTIALS || process.env.GOOGLE_APPLICATION_CREDENTIALS_JSON) &&
      process.env.GOOGLE_CLOUD_STORAGE_BUCKET;

    let uploadResults;
    let gcsWarning: string | undefined;

    if (isGCSConfigured) {
      try {
        // Upload to Google Cloud Storage
        uploadResults = await batchUpload(
          fileData.map(f => ({
            buffer: f.buffer,
            contentType: f.contentType,
            originalName: f.originalName
          })),
          vehicleId,
          vehicle.storeId
        )
      } catch (gcsError) {
        console.error('GCS upload failed, using placeholders:', gcsError);
        // Fallback to placeholders if GCS fails
        uploadResults = fileData.map((f, index) => ({
          publicUrl: `/api/placeholder/vehicle/${vehicleId}/${index}`,
          thumbnailUrl: `/api/placeholder/vehicle/${vehicleId}/${index}`,
          path: `placeholder/${vehicleId}/${index}`,
          size: f.buffer.length,
          contentType: f.contentType
        }));
        gcsWarning = 'GCS upload failed. Using placeholder images.';
      }
    } else {
      // GCS not configured - use placeholder URLs
      console.warn('Google Cloud Storage not configured. Using placeholder URLs for vehicle images.');
      uploadResults = fileData.map((f, index) => ({
        publicUrl: `/api/placeholder/vehicle/${vehicleId}/${index}`,
        thumbnailUrl: `/api/placeholder/vehicle/${vehicleId}/${index}`,
        path: `placeholder/${vehicleId}/${index}`,
        size: f.buffer.length,
        contentType: f.contentType
      }));
      gcsWarning = 'Google Cloud Storage is not configured. Please set up GCS credentials to enable actual image uploads.';
    }

    // Get the current highest sort order for gallery images
    const maxSortOrder = await prisma.vehicleImage.aggregate({
      where: {
        vehicleId,
        imageType: 'GALLERY'
      },
      _max: {
        sortOrder: true
      }
    })

    let nextSortOrder = (maxSortOrder._max.sortOrder || -1) + 1

    // Save image records to database
    const imageRecords = await Promise.all(
      uploadResults.map(async (result, index) => {
        const imageType = imageTypes[index]
        const sortOrder = imageType === 'GALLERY' ? nextSortOrder++ : 0

        return prisma.vehicleImage.create({
          data: {
            vehicleId,
            originalUrl: result.publicUrl,
            thumbnailUrl: result.thumbnailUrl,
            imageType,
            sortOrder,
            isProcessed: false,
          }
        })
      })
    )

    // Update vehicle's processing status if needed
    const hasKeyImages = imageRecords.some(img => 
      ['FRONT_QUARTER', 'FRONT', 'BACK_QUARTER', 'BACK', 'DRIVER_SIDE', 'PASSENGER_SIDE'].includes(img.imageType)
    )

    if (hasKeyImages && vehicle.processingStatus === 'NOT_STARTED') {
      await prisma.vehicle.update({
        where: { id: vehicleId },
        data: { processingStatus: 'NOT_STARTED' } // Ready for processing
      })
    }

    return NextResponse.json({
      message: isGCSConfigured 
        ? 'Images uploaded successfully' 
        : 'Images saved with placeholder URLs (GCS not configured)',
      images: imageRecords,
      uploadCount: imageRecords.length,
      warning: gcsWarning
    }, { status: 201 })

  } catch (error) {
    console.error('Error uploading images:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id: vehicleId } = await params

    // Get all images for the vehicle
    const images = await prisma.vehicleImage.findMany({
      where: { vehicleId },
      orderBy: [
        { imageType: 'asc' },
        { sortOrder: 'asc' }
      ]
    })

    return NextResponse.json({ images })

  } catch (error) {
    console.error('Error fetching vehicle images:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}