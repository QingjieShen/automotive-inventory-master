import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../../../../lib/auth';
import { prisma } from '../../../../../lib/prisma';
import { getExtensionFromContentType } from '../../../../../lib/gcs';
import { Storage } from '@google-cloud/storage';

/**
 * GET /api/stores/[id]/backgrounds
 * Get store background images configuration
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (session.user.role !== 'SUPER_ADMIN') {
      return NextResponse.json(
        { error: 'Forbidden: Super Admin access required' },
        { status: 403 }
      );
    }

    const { id: storeId } = await params;

    const store = await prisma.store.findUnique({
      where: { id: storeId },
      select: {
        id: true,
        name: true,
        bgFrontQuarter: true,
        bgFront: true,
        bgBackQuarter: true,
        bgBack: true,
        bgDriverSide: true,
        bgPassengerSide: true,
      },
    });

    if (!store) {
      return NextResponse.json({ error: 'Store not found' }, { status: 404 });
    }

    return NextResponse.json(store);
  } catch (error) {
    console.error('Error fetching store backgrounds:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/stores/[id]/backgrounds
 * Upload a background image for a specific key image type
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

    if (session.user.role !== 'SUPER_ADMIN') {
      return NextResponse.json(
        { error: 'Forbidden: Super Admin access required' },
        { status: 403 }
      );
    }

    const { id: storeId } = await params;

    const store = await prisma.store.findUnique({
      where: { id: storeId },
    });

    if (!store) {
      return NextResponse.json({ error: 'Store not found' }, { status: 404 });
    }

    const formData = await request.formData();
    const file = formData.get('image') as File;
    const imageType = formData.get('imageType') as string;

    if (!file) {
      return NextResponse.json(
        { error: 'No image file provided' },
        { status: 400 }
      );
    }

    if (!imageType) {
      return NextResponse.json(
        { error: 'Image type is required' },
        { status: 400 }
      );
    }

    const validImageTypes = [
      'FRONT_QUARTER',
      'FRONT',
      'BACK_QUARTER',
      'BACK',
      'DRIVER_SIDE',
      'PASSENGER_SIDE',
    ];

    if (!validImageTypes.includes(imageType)) {
      return NextResponse.json(
        { error: 'Invalid image type' },
        { status: 400 }
      );
    }

    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      return NextResponse.json(
        {
          error: 'Invalid file type. Only JPG, PNG, and WebP images are supported',
        },
        { status: 400 }
      );
    }

    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
      return NextResponse.json(
        { error: 'File size exceeds 10MB limit' },
        { status: 400 }
      );
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const extension = getExtensionFromContentType(file.type);
    const fileName = `bg-${imageType.toLowerCase()}.${extension}`;
    const gcsPath = `stores/${storeId}/backgrounds/${fileName}`;

    // Upload directly to GCS with custom path
    let imageUrl: string;
    try {
      const storage = new Storage({
        projectId: process.env.GOOGLE_CLOUD_PROJECT_ID,
        keyFilename: process.env.GOOGLE_APPLICATION_CREDENTIALS,
      });
      
      const bucketName = process.env.GOOGLE_CLOUD_STORAGE_BUCKET || 'mmg-vehicle-inventory';
      const bucket = storage.bucket(bucketName);
      const gcsFile = bucket.file(gcsPath);
      
      await gcsFile.save(buffer, {
        contentType: file.type,
        metadata: {
          cacheControl: 'public, max-age=31536000',
          metadata: {
            storeId,
            imageType,
            uploadedAt: new Date().toISOString(),
          },
        },
      });

      // Get public URL
      const cdnDomain = process.env.GOOGLE_CLOUD_CDN_DOMAIN;
      imageUrl = cdnDomain 
        ? `https://${cdnDomain}/${gcsPath}`
        : `https://storage.googleapis.com/${bucketName}/${gcsPath}`;
    } catch (uploadError) {
      console.error('GCS upload error:', uploadError);
      throw new Error('Failed to upload background image to storage');
    }

    const fieldMap: Record<string, string> = {
      FRONT_QUARTER: 'bgFrontQuarter',
      FRONT: 'bgFront',
      BACK_QUARTER: 'bgBackQuarter',
      BACK: 'bgBack',
      DRIVER_SIDE: 'bgDriverSide',
      PASSENGER_SIDE: 'bgPassengerSide',
    };

    const updateData: any = {};
    updateData[fieldMap[imageType]] = imageUrl;

    const updatedStore = await prisma.store.update({
      where: { id: storeId },
      data: updateData,
      select: {
        id: true,
        name: true,
        bgFrontQuarter: true,
        bgFront: true,
        bgBackQuarter: true,
        bgBack: true,
        bgDriverSide: true,
        bgPassengerSide: true,
      },
    });

    return NextResponse.json({
      message: 'Background image uploaded successfully',
      store: updatedStore,
      imageUrl,
    });
  } catch (error) {
    console.error('Error uploading background image:', error);
    return NextResponse.json(
      { error: 'Failed to upload background image' },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/stores/[id]/backgrounds
 * Remove a background image for a specific key image type
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (session.user.role !== 'SUPER_ADMIN') {
      return NextResponse.json(
        { error: 'Forbidden: Super Admin access required' },
        { status: 403 }
      );
    }

    const { id: storeId } = await params;
    const { searchParams } = new URL(request.url);
    const imageType = searchParams.get('imageType');

    if (!imageType) {
      return NextResponse.json(
        { error: 'Image type is required' },
        { status: 400 }
      );
    }

    const fieldMap: Record<string, string> = {
      FRONT_QUARTER: 'bgFrontQuarter',
      FRONT: 'bgFront',
      BACK_QUARTER: 'bgBackQuarter',
      BACK: 'bgBack',
      DRIVER_SIDE: 'bgDriverSide',
      PASSENGER_SIDE: 'bgPassengerSide',
    };

    if (!fieldMap[imageType]) {
      return NextResponse.json(
        { error: 'Invalid image type' },
        { status: 400 }
      );
    }

    const updateData: any = {};
    updateData[fieldMap[imageType]] = null;

    const updatedStore = await prisma.store.update({
      where: { id: storeId },
      data: updateData,
      select: {
        id: true,
        name: true,
        bgFrontQuarter: true,
        bgFront: true,
        bgBackQuarter: true,
        bgBack: true,
        bgDriverSide: true,
        bgPassengerSide: true,
      },
    });

    return NextResponse.json({
      message: 'Background image removed successfully',
      store: updatedStore,
    });
  } catch (error) {
    console.error('Error removing background image:', error);
    return NextResponse.json(
      { error: 'Failed to remove background image' },
      { status: 500 }
    );
  }
}
