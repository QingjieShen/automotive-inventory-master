import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { deleteFromS3 } from '@/lib/s3'

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

    const vehicle = await prisma.vehicle.findUnique({
      where: { id: vehicleId },
      include: {
        store: true,
        images: {
          orderBy: [
            { imageType: 'asc' },
            { sortOrder: 'asc' }
          ]
        }
      }
    })

    if (!vehicle) {
      return NextResponse.json({ error: 'Vehicle not found' }, { status: 404 })
    }

    return NextResponse.json(vehicle)

  } catch (error) {
    console.error('Error fetching vehicle:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id: vehicleId } = await params
    const body = await request.json()
    const { stockNumber, processingStatus } = body

    // Verify vehicle exists
    const existingVehicle = await prisma.vehicle.findUnique({
      where: { id: vehicleId }
    })

    if (!existingVehicle) {
      return NextResponse.json({ error: 'Vehicle not found' }, { status: 404 })
    }

    // Check if stock number is being changed and if it conflicts
    if (stockNumber && stockNumber !== existingVehicle.stockNumber) {
      const conflictingVehicle = await prisma.vehicle.findUnique({
        where: {
          stockNumber_storeId: {
            stockNumber,
            storeId: existingVehicle.storeId
          }
        }
      })

      if (conflictingVehicle) {
        return NextResponse.json(
          { error: 'Vehicle with this stock number already exists in this store' },
          { status: 409 }
        )
      }
    }

    const updatedVehicle = await prisma.vehicle.update({
      where: { id: vehicleId },
      data: {
        ...(stockNumber && { stockNumber }),
        ...(processingStatus && { processingStatus }),
      },
      include: {
        store: true,
        images: {
          orderBy: [
            { imageType: 'asc' },
            { sortOrder: 'asc' }
          ]
        }
      }
    })

    return NextResponse.json(updatedVehicle)

  } catch (error) {
    console.error('Error updating vehicle:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Only admins can delete vehicles
    if (session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Insufficient permissions' }, { status: 403 })
    }

    const { id: vehicleId } = await params

    // Get vehicle with images to delete from S3
    const vehicle = await prisma.vehicle.findUnique({
      where: { id: vehicleId },
      include: { images: true }
    })

    if (!vehicle) {
      return NextResponse.json({ error: 'Vehicle not found' }, { status: 404 })
    }

    // Delete images from S3
    const s3DeletePromises = vehicle.images.map(async (image) => {
      try {
        // Extract S3 key from URL
        const url = new URL(image.originalUrl)
        const key = url.pathname.substring(1) // Remove leading slash
        await deleteFromS3(key)
        
        // Also delete thumbnail if different
        if (image.thumbnailUrl !== image.originalUrl) {
          const thumbnailUrl = new URL(image.thumbnailUrl)
          const thumbnailKey = thumbnailUrl.pathname.substring(1)
          await deleteFromS3(thumbnailKey)
        }
      } catch (error) {
        console.error(`Failed to delete image ${image.id} from S3:`, error)
        // Continue with deletion even if S3 cleanup fails
      }
    })

    await Promise.allSettled(s3DeletePromises)

    // Delete vehicle (cascade will delete images from database)
    await prisma.vehicle.delete({
      where: { id: vehicleId }
    })

    return NextResponse.json({ message: 'Vehicle deleted successfully' })

  } catch (error) {
    console.error('Error deleting vehicle:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}