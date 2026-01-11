import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '../../../lib/auth'
import { prisma } from '../../../lib/prisma'

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const stores = await prisma.store.findMany({
      select: {
        id: true,
        name: true,
        address: true,
        brandLogos: true,
        imageUrl: true,
        createdAt: true,
        updatedAt: true,
      },
      orderBy: {
        name: 'asc'
      }
    })

    return NextResponse.json(stores)
  } catch (error) {
    console.error('Error fetching stores:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Check if user is Super Admin
    if (session.user.role !== 'SUPER_ADMIN') {
      console.warn(`Forbidden: User ${session.user.email} (${session.user.role}) attempted to create store`)
      return NextResponse.json(
        { error: 'Forbidden: Super Admin access required' },
        { status: 403 }
      )
    }

    const body = await request.json()
    const { name, address, brandLogos, imageUrl } = body

    // Validate required fields
    if (!name || typeof name !== 'string' || name.trim() === '') {
      return NextResponse.json(
        { error: 'Validation error: name is required' },
        { status: 400 }
      )
    }

    if (!address || typeof address !== 'string' || address.trim() === '') {
      return NextResponse.json(
        { error: 'Validation error: address is required' },
        { status: 400 }
      )
    }

    // Check for duplicate store name
    const existingStore = await prisma.store.findFirst({
      where: {
        name: name.trim()
      }
    })

    if (existingStore) {
      return NextResponse.json(
        { error: 'Conflict: A store with this name already exists' },
        { status: 409 }
      )
    }

    // Create the store
    const store = await prisma.store.create({
      data: {
        name: name.trim(),
        address: address.trim(),
        brandLogos: Array.isArray(brandLogos) ? brandLogos : [],
        imageUrl: imageUrl || null
      }
    })

    // Audit logging
    console.log(`Store created: ${store.id} (${store.name}) by ${session.user.email}`)

    return NextResponse.json(store, { status: 201 })
  } catch (error) {
    console.error('Error creating store:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}