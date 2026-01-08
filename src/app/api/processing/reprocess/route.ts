import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { geminiClient, DEFAULT_TARGET_BACKGROUND } from '@/lib/gemini'
import { JobStatus, ProcessingStatus, UserRole } from '@/generated/prisma'

// POST /api/processing/reprocess - Reprocess already processed images (Admin only)
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Check if user is Admin
    if (session.user.role !== UserRole.ADMIN) {
      return NextResponse.json(
        { error: 'Admin access required for reprocessing' },
        { status: 403 }
      )
    }

    const body = await request.json()
    const { vehicleId, imageIds, targetBackground = DEFAULT_TARGET_BACKGROUND } = body

    if (!vehicleId || !imageIds || !Array.isArray(imageIds) || imageIds.length === 0) {
      return NextResponse.json(
        { error: 'Vehicle ID and image IDs are required' },
        { status: 400 }
      )
    }

    // Verify vehicle exists and get images
    const vehicle = await prisma.vehicle.findUnique({
      where: { id: vehicleId },
      include: {
        images: {
          where: {
            id: { in: imageIds },
            isProcessed: true, // Only reprocess already processed images
          },
        },
      },
    })

    if (!vehicle) {
      return NextResponse.json({ error: 'Vehicle not found' }, { status: 404 })
    }

    if (vehicle.images.length === 0) {
      return NextResponse.json(
        { error: 'No processed images found for reprocessing' },
        { status: 400 }
      )
    }

    // Create new processing job for reprocessing
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

    // Start reprocessing with Gemini API
    const processingRequests = vehicle.images.map(image => ({
      imageUrl: image.originalUrl, // Always use original for reprocessing
      targetBackground,
      vehicleId,
      imageId: image.id,
    }))

    const processingResults = await geminiClient.processBatch(processingRequests)

    // Update images with new processed versions
    const hasSuccessfulProcessing = processingResults.some(result => result.success)
    const hasFailures = processingResults.some(result => !result.success)

    if (hasSuccessfulProcessing) {
      // Update successful reprocessed images
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
          errorMessage: hasFailures ? 'Some images failed to reprocess' : null,
        },
      })

      await prisma.vehicle.update({
        where: { id: vehicleId },
        data: { processingStatus: finalVehicleStatus },
      })
    } else {
      // All reprocessing failed
      await prisma.processingJob.update({
        where: { id: processingJob.id },
        data: {
          status: JobStatus.FAILED,
          completedAt: new Date(),
          errorMessage: 'All images failed to reprocess',
        },
      })

      await prisma.vehicle.update({
        where: { id: vehicleId },
        data: { processingStatus: ProcessingStatus.ERROR },
      })
    }

    // Return updated vehicle
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
    console.error('Reprocessing error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}