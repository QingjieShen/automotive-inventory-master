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
  { params }: { params: { id: string } }
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

    const storeId = params.id;

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

    // Convert file to buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Upload to GCS with path: stores/{storeId}/store-image.{ext}
    const uploadResult = await uploadFile({
      vehicleId: '', // Not applicable for store images
      storeId,
      imageType: 'store',
      contentType: file.type,
      buffer,
      originalName: file.name,
    });

    // Update store with new imageUrl
    const updatedStore = await prisma.store.update({
      where: { id: storeId },
      data: { imageUrl: uploadResult.publicUrl },
    });

    return NextResponse.json({
      message: 'Store image uploaded successfully',
      store: updatedStore,
      imageUrl: uploadResult.publicUrl,
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
