import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { deleteFromS3 } from '@/lib/s3'

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; imageId: string }> }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { id: vehicleId, imageId } = await params

    // Verify the vehicle exists and the image belongs to it
    const image = await prisma.vehicleImage.findFirst({
      where: {
        id: imageId,
        vehicleId: vehicleId
      }
    })

    if (!image) {
      return NextResponse.json(
        { error: 'Image not found' },
        { status: 404 }
      )
    }

    // Delete the image files from S3 storage
    try {
      // Extract S3 key from original URL
      const originalUrl = new URL(image.originalUrl)
      const originalKey = originalUrl.pathname.substring(1) // Remove leading slash
      await deleteFromS3(originalKey)
      
      // Delete thumbnail if different from original
      if (image.thumbnailUrl !== image.originalUrl) {
        const thumbnailUrl = new URL(image.thumbnailUrl)
        const thumbnailKey = thumbnailUrl.pathname.substring(1)
        await deleteFromS3(thumbnailKey)
      }
      
      // Delete processed image if exists
      if (image.processedUrl) {
        const processedUrl = new URL(image.processedUrl)
        const processedKey = processedUrl.pathname.substring(1)
        await deleteFromS3(processedKey)
      }
    } catch (s3Error) {
      console.error('Failed to delete image from S3:', s3Error)
      // Continue with database deletion even if S3 cleanup fails
    }

    // Delete the image from the database
    await prisma.vehicleImage.delete({
      where: {
        id: imageId
      }
    })

    // If it's a gallery image, we should reorder the remaining gallery images
    if (image.imageType === 'GALLERY') {
      const remainingGalleryImages = await prisma.vehicleImage.findMany({
        where: {
          vehicleId: vehicleId,
          imageType: 'GALLERY'
        },
        orderBy: {
          sortOrder: 'asc'
        }
      })

      // Update sort orders to be sequential
      for (let i = 0; i < remainingGalleryImages.length; i++) {
        await prisma.vehicleImage.update({
          where: { id: remainingGalleryImages[i].id },
          data: { sortOrder: i }
        })
      }
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting image:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}