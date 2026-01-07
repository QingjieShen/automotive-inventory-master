import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

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

    // Delete the image from the database
    await prisma.vehicleImage.delete({
      where: {
        id: imageId
      }
    })

    // TODO: Delete the actual image files from S3 storage
    // This would involve:
    // 1. Delete original image from S3
    // 2. Delete processed image from S3 (if exists)
    // 3. Delete thumbnail from S3
    // For now, we're just removing from database

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