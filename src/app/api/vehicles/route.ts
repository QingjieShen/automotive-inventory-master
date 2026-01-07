import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { Vehicle, PaginatedResponse } from '@/types'

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const storeId = searchParams.get('storeId')
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const search = searchParams.get('search') || ''
    const sortBy = searchParams.get('sortBy') || 'stockNumber'
    const sortOrder = searchParams.get('sortOrder') || 'asc'

    if (!storeId) {
      return NextResponse.json({ error: 'Store ID is required' }, { status: 400 })
    }

    const skip = (page - 1) * limit

    // Build where clause for filtering
    const where: any = {
      storeId,
    }

    if (search) {
      where.stockNumber = {
        contains: search,
        mode: 'insensitive'
      }
    }

    // Build orderBy clause
    const orderBy: any = {}
    if (sortBy === 'stockNumber') {
      orderBy.stockNumber = sortOrder
    } else if (sortBy === 'createdAt') {
      orderBy.createdAt = sortOrder
    } else if (sortBy === 'processingStatus') {
      orderBy.processingStatus = sortOrder
    }

    // Get vehicles with pagination
    const [vehicles, totalCount] = await Promise.all([
      prisma.vehicle.findMany({
        where,
        orderBy,
        skip,
        take: limit,
        include: {
          store: true,
          images: {
            orderBy: { sortOrder: 'asc' }
          }
        }
      }),
      prisma.vehicle.count({ where })
    ])

    const totalPages = Math.ceil(totalCount / limit)

    const response: PaginatedResponse<Vehicle> = {
      data: vehicles as Vehicle[],
      totalCount,
      currentPage: page,
      totalPages
    }

    return NextResponse.json(response)
  } catch (error) {
    console.error('Error fetching vehicles:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { stockNumber, storeId } = body

    if (!stockNumber || !storeId) {
      return NextResponse.json(
        { error: 'Stock number and store ID are required' },
        { status: 400 }
      )
    }

    // Check if vehicle with this stock number already exists in this store
    const existingVehicle = await prisma.vehicle.findUnique({
      where: {
        stockNumber_storeId: {
          stockNumber,
          storeId
        }
      }
    })

    if (existingVehicle) {
      return NextResponse.json(
        { error: 'Vehicle with this stock number already exists in this store' },
        { status: 409 }
      )
    }

    const vehicle = await prisma.vehicle.create({
      data: {
        stockNumber,
        storeId,
        processingStatus: 'NOT_STARTED'
      },
      include: {
        store: true,
        images: {
          orderBy: { sortOrder: 'asc' }
        }
      }
    })

    return NextResponse.json(vehicle, { status: 201 })
  } catch (error) {
    console.error('Error creating vehicle:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}