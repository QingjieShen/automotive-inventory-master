import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { ImageType } from '@/types';
import { getGCSService } from '@/lib/services/gcs-service';
import { getBackgroundTemplateService } from '@/lib/services/background-template-service';
import { createImageProcessorServiceFromEnv } from '@/lib/services/image-processor-service';

/**
 * POST /api/images/process
 * 
 * Process a vehicle image with AI background removal and replacement.
 * This endpoint accepts a vehicle image ID and image type, validates the request,
 * and triggers the image processing workflow.
 * 
 * Requirements: 3.1, 3.6, 3.7
 * 
 * Request Body:
 * {
 *   vehicleImageId: string;  // ID of the vehicle image to process
 *   imageType: ImageType;    // Type of the image (e.g., FRONT_QUARTER, GALLERY)
 * }
 * 
 * Response:
 * {
 *   success: boolean;
 *   optimizedUrl?: string;   // URL of the optimized image (if successful)
 *   skipped?: boolean;       // True if image was skipped (gallery images)
 *   error?: string;          // Error message (if failed)
 *   processedAt?: string;    // ISO timestamp of processing completion
 * }
 */
export async function POST(request: NextRequest) {
  try {
    // Authenticate user
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Parse request body
    const body = await request.json();
    const { vehicleImageId, imageType } = body;

    // Validate required parameters
    if (!vehicleImageId) {
      return NextResponse.json(
        { error: 'vehicleImageId is required' },
        { status: 400 }
      );
    }

    if (!imageType) {
      return NextResponse.json(
        { error: 'imageType is required' },
        { status: 400 }
      );
    }

    // Validate imageType is a valid ImageType enum value
    const validImageTypes: ImageType[] = [
      'FRONT_QUARTER',
      'FRONT',
      'BACK_QUARTER',
      'BACK',
      'DRIVER_SIDE',
      'PASSENGER_SIDE',
      'GALLERY_EXTERIOR',
      'GALLERY_INTERIOR',
      'GALLERY',
    ];

    if (!validImageTypes.includes(imageType)) {
      return NextResponse.json(
        { 
          error: 'Invalid imageType',
          validTypes: validImageTypes,
        },
        { status: 400 }
      );
    }

    // Fetch the vehicle image from database
    const vehicleImage = await prisma.vehicleImage.findUnique({
      where: { id: vehicleImageId },
      select: {
        id: true,
        originalUrl: true,
        imageType: true,
        vehicleId: true,
        vehicle: {
          select: {
            id: true,
            stockNumber: true,
            storeId: true,
          },
        },
      },
    });

    if (!vehicleImage) {
      return NextResponse.json(
        { error: 'Vehicle image not found' },
        { status: 404 }
      );
    }

    // Verify the imageType matches the database record
    if (vehicleImage.imageType !== imageType) {
      return NextResponse.json(
        { 
          error: 'imageType mismatch',
          expected: vehicleImage.imageType,
          provided: imageType,
        },
        { status: 400 }
      );
    }

    // Initialize services
    const gcsService = getGCSService();
    const templateService = getBackgroundTemplateService();
    const processorService = createImageProcessorServiceFromEnv(
      gcsService,
      templateService
    );

    // Process the image
    const result = await processorService.processImage(
      vehicleImageId,
      vehicleImage.originalUrl,
      imageType
    );

    // Return processing result
    if (result.success) {
      return NextResponse.json({
        success: true,
        optimizedUrl: result.optimizedUrl,
        skipped: result.skipped,
        processedAt: result.processedAt?.toISOString(),
      });
    } else {
      // Processing failed - return error with 500 status
      return NextResponse.json(
        {
          success: false,
          error: result.error || 'Image processing failed',
        },
        { status: 500 }
      );
    }
  } catch (error) {
    // Log error for debugging
    console.error('Image processing API error:', error);

    // Return generic error response (don't expose internal details)
    return NextResponse.json(
      { 
        error: 'Internal server error',
        message: 'An unexpected error occurred during image processing',
      },
      { status: 500 }
    );
  }
}
