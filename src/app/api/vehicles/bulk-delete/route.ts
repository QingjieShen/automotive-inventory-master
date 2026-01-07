import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Only admins can perform bulk delete operations
    if (session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Forbidden: Admin access required' }, { status: 403 })
    }

    const body = await request.json()
    const { vehicleIds } = body

    if (!vehicleIds || !Array.isArray(vehicleIds) || vehicleIds.length === 0) {
      return NextResponse.json(
        { error: 'Vehicle IDs array is required' },
        { status: 400 }
      )
    }

    // Validate that all IDs are strings
    if (!vehicleIds.every(id => typeof id === 'string')) {
      return NextResponse.json(
        { error: 'All vehicle IDs must be strings' },
        { status: 400 }
      )
    }

    // Delete vehicles and their associated data (images, processing jobs)
    // Prisma will handle cascade deletes based on the schema
    const deleteResult = await prisma.vehicle.deleteMany({
      where: {
        id: {
          in: vehicleIds
        }
      }
    })

    return NextResponse.json({
      message: `Successfully deleted ${deleteResult.count} vehicles`,
      deletedCount: deleteResult.count
    })
  } catch (error) {
    console.error('Error deleting vehicles:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}