import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { id: vehicleId } = await params
    const body = await request.json()
    const { imageUpdates } = body

    if (!Array.isArray(imageUpdates)) {
      return NextResponse.json(
        { error: 'Invalid request body' },
        { status: 400 }
      )
    }

    // Verify the vehicle exists and user has access
    const vehicle = await prisma.vehicle.findUnique({
      where: { id: vehicleId },
      include: { images: true }
    })

    if (!vehicle) {
      return NextResponse.json(
        { error: 'Vehicle not found' },
        { status: 404 }
      )
    }

    // Update image sort orders in a transaction
    await prisma.$transaction(async (tx) => {
      for (const update of imageUpdates) {
        await tx.vehicleImage.update({
          where: { 
            id: update.id,
            vehicleId: vehicleId // Ensure the image belongs to this vehicle
          },
          data: {
            sortOrder: update.sortOrder
          }
        })
      }
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error reordering images:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}