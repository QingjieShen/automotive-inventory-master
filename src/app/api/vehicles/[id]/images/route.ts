import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { batchUploadToS3 } from '@/lib/s3'
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

    // Convert files to buffers for S3 upload
    const fileData = await Promise.all(
      files.map(async (file, index) => ({
        buffer: Buffer.from(await file.arrayBuffer()),
        contentType: file.type,
        originalName: file.name,
        imageType: imageTypes[index]
      }))
    )

    // Upload to S3
    const uploadResults = await batchUploadToS3(
      fileData.map(f => ({
        buffer: f.buffer,
        contentType: f.contentType,
        originalName: f.originalName
      })),
      vehicleId,
      vehicle.storeId
    )

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
            originalUrl: result.originalUrl,
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
      message: 'Images uploaded successfully',
      images: imageRecords,
      uploadCount: imageRecords.length
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