import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '../../../../lib/auth'
import { prisma } from '../../../../lib/prisma'

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const store = await prisma.store.findUnique({
      where: { id: params.id },
      select: {
        id: true,
        name: true,
        address: true,
        brandLogos: true,
        imageUrl: true,
        createdAt: true,
        updatedAt: true,
      }
    })

    if (!store) {
      return NextResponse.json(
        { error: 'Store not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(store)
  } catch (error) {
    console.error('Error fetching store:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Check if user is Super Admin
    if (session.user.role !== 'SUPER_ADMIN') {
      console.warn(`Forbidden: User ${session.user.email} (${session.user.role}) attempted to update store ${params.id}`)
      return NextResponse.json(
        { error: 'Forbidden: Super Admin access required' },
        { status: 403 }
      )
    }

    // Check if store exists
    const existingStore = await prisma.store.findUnique({
      where: { id: params.id }
    })

    if (!existingStore) {
      return NextResponse.json(
        { error: 'Store not found' },
        { status: 404 }
      )
    }

    const body = await request.json()
    const { name, address, brandLogos, imageUrl } = body

    // Validate required fields if provided
    if (name !== undefined && (typeof name !== 'string' || name.trim() === '')) {
      return NextResponse.json(
        { error: 'Validation error: name must be a non-empty string' },
        { status: 400 }
      )
    }

    if (address !== undefined && (typeof address !== 'string' || address.trim() === '')) {
      return NextResponse.json(
        { error: 'Validation error: address must be a non-empty string' },
        { status: 400 }
      )
    }

    // Check for duplicate store name (if name is being changed)
    if (name && name.trim() !== existingStore.name) {
      const duplicateStore = await prisma.store.findFirst({
        where: {
          name: name.trim(),
          id: { not: params.id }
        }
      })

      if (duplicateStore) {
        return NextResponse.json(
          { error: 'Conflict: A store with this name already exists' },
          { status: 409 }
        )
      }
    }

    // Update the store
    const updateData: any = {}
    if (name !== undefined) updateData.name = name.trim()
    if (address !== undefined) updateData.address = address.trim()
    if (brandLogos !== undefined) updateData.brandLogos = Array.isArray(brandLogos) ? brandLogos : []
    if (imageUrl !== undefined) updateData.imageUrl = imageUrl || null

    const store = await prisma.store.update({
      where: { id: params.id },
      data: updateData
    })

    // Audit logging
    console.log(`Store updated: ${store.id} (${store.name}) by ${session.user.email}`)

    return NextResponse.json(store)
  } catch (error) {
    console.error('Error updating store:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Check if user is Super Admin
    if (session.user.role !== 'SUPER_ADMIN') {
      console.warn(`Forbidden: User ${session.user.email} (${session.user.role}) attempted to delete store ${params.id}`)
      return NextResponse.json(
        { error: 'Forbidden: Super Admin access required' },
        { status: 403 }
      )
    }

    // Check if store exists
    const store = await prisma.store.findUnique({
      where: { id: params.id },
      include: {
        _count: {
          select: { vehicles: true }
        }
      }
    })

    if (!store) {
      return NextResponse.json(
        { error: 'Store not found' },
        { status: 404 }
      )
    }

    // Check if store has vehicles
    if (store._count.vehicles > 0) {
      return NextResponse.json(
        { error: 'Cannot delete store with existing vehicles' },
        { status: 409 }
      )
    }

    // Delete the store
    await prisma.store.delete({
      where: { id: params.id }
    })

    // Audit logging
    console.log(`Store deleted: ${params.id} (${store.name}) by ${session.user.email}`)

    return NextResponse.json({ success: true, message: 'Store deleted successfully' })
  } catch (error) {
    console.error('Error deleting store:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
