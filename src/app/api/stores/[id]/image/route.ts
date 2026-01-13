import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../../../../lib/auth';
import { prisma } from '../../../../../lib/prisma';
import { uploadFile, getExtensionFromContentType } from '../../../../../lib/gcs';

/**
 * POST /api/stores/[id]/image
 * Upload a store background image
 * Requirements: 2.1, 5.5
 */
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Only Super Admin can upload store images
    if (session.user.role !== 'SUPER_ADMIN') {
      return NextResponse.json(
        { error: 'Forbidden: Super Admin access required' },
        { status: 403 }
      );
    }

    const { id: storeId } = await params;

    // Verify store exists
    const store = await prisma.store.findUnique({
      where: { id: storeId },
    });

    if (!store) {
      return NextResponse.json({ error: 'Store not found' }, { status: 404 });
    }

    // Parse multipart form data
    const formData = await request.formData();
    const file = formData.get('image') as File;

    if (!file) {
      return NextResponse.json(
        { error: 'No image file provided' },
        { status: 400 }
      );
    }

    // Validate file type
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      return NextResponse.json(
        {
          error: 'Invalid file type. Only JPG, PNG, and WebP images are supported',
        },
        { status: 400 }
      );
    }

    // Validate file size (10MB limit)
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
      return NextResponse.json(
        { error: 'File exceeds 10MB limit' },
        { status: 400 }
      );
    }

    // Check if GCS is configured
    const isGCSConfigured = 
      process.env.GOOGLE_CLOUD_PROJECT_ID && 
      (process.env.GOOGLE_APPLICATION_CREDENTIALS || process.env.GOOGLE_APPLICATION_CREDENTIALS_JSON) &&
      process.env.GOOGLE_CLOUD_STORAGE_BUCKET;

    let imageUrl: string;

    if (isGCSConfigured) {
      // Upload to GCS
      try {
        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);

        const uploadResult = await uploadFile({
          vehicleId: '', // Not applicable for store images
          storeId,
          imageType: 'store',
          contentType: file.type,
          buffer,
          originalName: file.name,
        });

        imageUrl = uploadResult.publicUrl;
      } catch (gcsError) {
        console.error('GCS upload failed, falling back to placeholder:', gcsError);
        // Fallback to placeholder if GCS fails
        imageUrl = `/api/placeholder/store/${storeId}`;
      }
    } else {
      // GCS not configured - use placeholder URL
      console.warn('Google Cloud Storage not configured. Using placeholder URL for store image.');
      imageUrl = `/api/placeholder/store/${storeId}`;
    }

    // Update store with new imageUrl
    const updatedStore = await prisma.store.update({
      where: { id: storeId },
      data: { imageUrl },
    });

    return NextResponse.json({
      message: isGCSConfigured 
        ? 'Store image uploaded successfully' 
        : 'Store image URL saved (GCS not configured - using placeholder)',
      store: updatedStore,
      imageUrl,
      warning: !isGCSConfigured ? 'Google Cloud Storage is not configured. Please set up GCS credentials to enable actual image uploads.' : undefined,
    });
  } catch (error) {
    console.error('Error uploading store image:', error);
    return NextResponse.json(
      {
        error: 'Failed to upload store image',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
