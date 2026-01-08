import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

// GET /api/processing/download?imageId=xxx - Download processed image
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const imageId = searchParams.get('imageId')

    if (!imageId) {
      return NextResponse.json(
        { error: 'Image ID is required' },
        { status: 400 }
      )
    }

    // Get image with processed URL
    const image = await prisma.vehicleImage.findUnique({
      where: { id: imageId },
      include: {
        vehicle: {
          select: {
            stockNumber: true,
            store: {
              select: { name: true },
            },
          },
        },
      },
    })

    if (!image) {
      return NextResponse.json({ error: 'Image not found' }, { status: 404 })
    }

    if (!image.processedUrl) {
      return NextResponse.json(
        { error: 'No processed version available for this image' },
        { status: 400 }
      )
    }

    try {
      // Fetch the processed image from S3/CDN
      const imageResponse = await fetch(image.processedUrl)
      
      if (!imageResponse.ok) {
        throw new Error(`Failed to fetch image: ${imageResponse.status}`)
      }

      const imageBuffer = await imageResponse.arrayBuffer()
      
      // Generate filename based on vehicle and image type
      const filename = `${image.vehicle.store.name}_${image.vehicle.stockNumber}_${image.imageType}_processed.jpg`
        .replace(/[^a-zA-Z0-9._-]/g, '_')
        .toLowerCase()

      // Return image with appropriate headers for download
      return new NextResponse(imageBuffer, {
        status: 200,
        headers: {
          'Content-Type': 'image/jpeg',
          'Content-Disposition': `attachment; filename="${filename}"`,
          'Content-Length': imageBuffer.byteLength.toString(),
          'Cache-Control': 'public, max-age=31536000', // Cache for 1 year
        },
      })
    } catch (fetchError) {
      console.error('Error fetching processed image:', fetchError)
      return NextResponse.json(
        { error: 'Failed to download processed image' },
        { status: 500 }
      )
    }
  } catch (error) {
    console.error('Download error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// POST /api/processing/download/batch - Download multiple processed images as ZIP
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { imageIds } = body

    if (!imageIds || !Array.isArray(imageIds) || imageIds.length === 0) {
      return NextResponse.json(
        { error: 'Image IDs are required' },
        { status: 400 }
      )
    }

    // Get images with processed URLs
    const images = await prisma.vehicleImage.findMany({
      where: {
        id: { in: imageIds },
        processedUrl: { not: null },
      },
      include: {
        vehicle: {
          select: {
            stockNumber: true,
            store: {
              select: { name: true },
            },
          },
        },
      },
    })

    if (images.length === 0) {
      return NextResponse.json(
        { error: 'No processed images found' },
        { status: 404 }
      )
    }

    // For now, return the list of download URLs
    // In a production environment, you might want to create a ZIP file
    const downloadInfo = images.map(image => ({
      imageId: image.id,
      downloadUrl: `/api/processing/download?imageId=${image.id}`,
      filename: `${image.vehicle.store.name}_${image.vehicle.stockNumber}_${image.imageType}_processed.jpg`
        .replace(/[^a-zA-Z0-9._-]/g, '_')
        .toLowerCase(),
      imageType: image.imageType,
      vehicleStockNumber: image.vehicle.stockNumber,
      storeName: image.vehicle.store.name,
    }))

    return NextResponse.json({
      success: true,
      images: downloadInfo,
      totalCount: images.length,
    })
  } catch (error) {
    console.error('Batch download error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}