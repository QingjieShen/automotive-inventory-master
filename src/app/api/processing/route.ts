import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { geminiClient, DEFAULT_TARGET_BACKGROUND } from '@/lib/gemini'
import { JobStatus, ProcessingStatus, ImageType } from '@/generated/prisma'

// POST /api/processing - Start processing job for vehicle images
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { vehicleId, imageIds, targetBackground = DEFAULT_TARGET_BACKGROUND } = body

    if (!vehicleId || !imageIds || !Array.isArray(imageIds) || imageIds.length === 0) {
      return NextResponse.json(
        { error: 'Vehicle ID and image IDs are required' },
        { status: 400 }
      )
    }

    // Verify vehicle exists and user has access
    const vehicle = await prisma.vehicle.findUnique({
      where: { id: vehicleId },
      include: {
        images: {
          where: {
            id: { in: imageIds },
            // Only process key images, not gallery images
            imageType: {
              in: [
                ImageType.FRONT_QUARTER,
                ImageType.FRONT,
                ImageType.BACK_QUARTER,
                ImageType.BACK,
                ImageType.DRIVER_SIDE,
                ImageType.PASSENGER_SIDE,
              ],
            },
          },
        },
      },
    })

    if (!vehicle) {
      return NextResponse.json({ error: 'Vehicle not found' }, { status: 404 })
    }

    if (vehicle.images.length === 0) {
      return NextResponse.json(
        { error: 'No valid key images found for processing' },
        { status: 400 }
      )
    }

    // Create processing job
    const processingJob = await prisma.processingJob.create({
      data: {
        vehicleId,
        imageIds: vehicle.images.map(img => img.id),
        status: JobStatus.QUEUED,
      },
    })

    // Update vehicle processing status
    await prisma.vehicle.update({
      where: { id: vehicleId },
      data: { processingStatus: ProcessingStatus.IN_PROGRESS },
    })

    // Start processing images with Gemini API
    const processingRequests = vehicle.images.map(image => ({
      imageUrl: image.originalUrl,
      targetBackground,
      vehicleId,
      imageId: image.id,
    }))

    // Process images (this could be done asynchronously in a real implementation)
    const processingResults = await geminiClient.processBatch(processingRequests)

    // Check if any processing succeeded
    const hasSuccessfulProcessing = processingResults.some(result => result.success)
    const hasFailures = processingResults.some(result => !result.success)

    if (hasSuccessfulProcessing) {
      // Update successful images
      for (let i = 0; i < processingResults.length; i++) {
        const result = processingResults[i]
        const image = vehicle.images[i]
        
        if (result.success && result.processedImageUrl) {
          await prisma.vehicleImage.update({
            where: { id: image.id },
            data: {
              processedUrl: result.processedImageUrl,
              isProcessed: true,
            },
          })
        }
      }

      // Update job and vehicle status
      const finalJobStatus = hasFailures ? JobStatus.COMPLETED : JobStatus.COMPLETED
      const finalVehicleStatus = hasFailures ? ProcessingStatus.ERROR : ProcessingStatus.COMPLETED

      await prisma.processingJob.update({
        where: { id: processingJob.id },
        data: {
          status: finalJobStatus,
          completedAt: new Date(),
          errorMessage: hasFailures ? 'Some images failed to process' : null,
        },
      })

      await prisma.vehicle.update({
        where: { id: vehicleId },
        data: { processingStatus: finalVehicleStatus },
      })
    } else {
      // All processing failed
      await prisma.processingJob.update({
        where: { id: processingJob.id },
        data: {
          status: JobStatus.FAILED,
          completedAt: new Date(),
          errorMessage: 'All images failed to process',
        },
      })

      await prisma.vehicle.update({
        where: { id: vehicleId },
        data: { processingStatus: ProcessingStatus.ERROR },
      })
    }

    // Return updated vehicle with processing results
    const updatedVehicle = await prisma.vehicle.findUnique({
      where: { id: vehicleId },
      include: {
        images: {
          orderBy: [{ imageType: 'asc' }, { sortOrder: 'asc' }],
        },
        processingJobs: {
          orderBy: { createdAt: 'desc' },
          take: 1,
        },
      },
    })

    return NextResponse.json({
      success: true,
      vehicle: updatedVehicle,
      processingJob: processingJob,
      results: processingResults,
    })
  } catch (error) {
    console.error('Processing error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// GET /api/processing?vehicleId=xxx - Get processing status for vehicle
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const vehicleId = searchParams.get('vehicleId')

    if (!vehicleId) {
      return NextResponse.json(
        { error: 'Vehicle ID is required' },
        { status: 400 }
      )
    }

    // Get vehicle with latest processing job
    const vehicle = await prisma.vehicle.findUnique({
      where: { id: vehicleId },
      include: {
        processingJobs: {
          orderBy: { createdAt: 'desc' },
          take: 1,
        },
        images: {
          where: {
            imageType: {
              in: [
                ImageType.FRONT_QUARTER,
                ImageType.FRONT,
                ImageType.BACK_QUARTER,
                ImageType.BACK,
                ImageType.DRIVER_SIDE,
                ImageType.PASSENGER_SIDE,
              ],
            },
          },
          orderBy: [{ imageType: 'asc' }, { sortOrder: 'asc' }],
        },
      },
    })

    if (!vehicle) {
      return NextResponse.json({ error: 'Vehicle not found' }, { status: 404 })
    }

    return NextResponse.json({
      vehicle,
      latestJob: vehicle.processingJobs[0] || null,
    })
  } catch (error) {
    console.error('Error fetching processing status:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}