import { Storage, Bucket } from '@google-cloud/storage';
import { v4 as uuidv4 } from 'uuid';

// Initialize Google Cloud Storage client
const storage = new Storage({
  projectId: process.env.GOOGLE_CLOUD_PROJECT_ID,
  keyFilename: process.env.GOOGLE_APPLICATION_CREDENTIALS,
});

const BUCKET_NAME = process.env.GOOGLE_CLOUD_STORAGE_BUCKET || 'mmg-vehicle-inventory';
const CDN_DOMAIN = process.env.GOOGLE_CLOUD_CDN_DOMAIN;

let bucket: Bucket;

/**
 * Initialize the GCS bucket
 */
function getBucket(): Bucket {
  if (!bucket) {
    bucket = storage.bucket(BUCKET_NAME);
  }
  return bucket;
}

export interface UploadResult {
  publicUrl: string;
  thumbnailUrl: string;
  path: string;
  size: number;
  contentType: string;
}

export interface GCSUploadOptions {
  vehicleId: string;
  storeId: string;
  imageType: 'original' | 'processed' | 'thumbnail' | 'store';
  contentType: string;
  buffer: Buffer;
  originalName?: string;
}

/**
 * Generate GCS path for organized file storage
 */
export function generatePath(
  storeId: string,
  vehicleId: string,
  imageType: 'original' | 'processed' | 'thumbnail' | 'store',
  extension: string
): string {
  const imageId = uuidv4();
  const timestamp = Date.now();
  
  if (imageType === 'store') {
    return `stores/${storeId}/store-image.${extension}`;
  }
  
  return `stores/${storeId}/vehicles/${vehicleId}/${imageType}/${imageId}_${timestamp}.${extension}`;
}

/**
 * Get file extension from content type
 */
export function getExtensionFromContentType(contentType: string): string {
  const extensions: Record<string, string> = {
    'image/jpeg': 'jpg',
    'image/jpg': 'jpg',
    'image/png': 'png',
    'image/gif': 'gif',
    'image/webp': 'webp',
  };
  
  return extensions[contentType] || 'jpg';
}

/**
 * Get public URL for a GCS file
 */
export function getPublicUrl(path: string): string {
  if (CDN_DOMAIN) {
    return `https://${CDN_DOMAIN}/${path}`;
  }
  
  // Fallback to GCS direct URL
  return `https://storage.googleapis.com/${BUCKET_NAME}/${path}`;
}

/**
 * Upload file to Google Cloud Storage
 */
export async function uploadFile(options: GCSUploadOptions): Promise<UploadResult> {
  const { vehicleId, storeId, imageType, contentType, buffer, originalName } = options;
  
  const extension = getExtensionFromContentType(contentType);
  const path = generatePath(storeId, vehicleId, imageType, extension);
  
  try {
    const bucket = getBucket();
    const file = bucket.file(path);
    
    await file.save(buffer, {
      contentType,
      metadata: {
        cacheControl: 'public, max-age=31536000', // 1 year cache
        metadata: {
          vehicleId,
          storeId,
          imageType,
          originalName: originalName || 'unknown',
          uploadedAt: new Date().toISOString(),
        },
      },
      public: true, // Make file publicly accessible
    });
    
    const publicUrl = getPublicUrl(path);
    
    return {
      publicUrl,
      thumbnailUrl: publicUrl, // For now, same as original. Thumbnail generation can be added later
      path,
      size: buffer.length,
      contentType,
    };
  } catch (error) {
    console.error('GCS upload error:', error);
    throw new Error(`Failed to upload file to GCS: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Delete file from Google Cloud Storage
 */
export async function deleteFile(path: string): Promise<void> {
  try {
    const bucket = getBucket();
    const file = bucket.file(path);
    
    await file.delete();
  } catch (error) {
    // If file doesn't exist, log warning but don't throw (idempotent)
    if (error instanceof Error && error.message.includes('No such object')) {
      console.warn(`File not found in GCS: ${path}`);
      return;
    }
    
    console.error('GCS delete error:', error);
    throw new Error(`Failed to delete file from GCS: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Create thumbnail from image buffer (basic implementation)
 * In production, this could use Cloud Functions or a more sophisticated image processing service
 */
export async function createThumbnail(
  originalBuffer: Buffer,
  contentType: string,
  maxWidth: number = 300,
  maxHeight: number = 200
): Promise<Buffer> {
  // For now, return the original buffer
  // In a real implementation, you would use a library like Sharp or similar
  // to resize the image
  
  // TODO: Implement actual thumbnail generation
  // This is a placeholder that returns the original buffer
  return originalBuffer;
}

/**
 * Batch upload multiple files
 */
export async function batchUpload(
  files: Array<{
    buffer: Buffer;
    contentType: string;
    originalName: string;
    imageType?: 'original' | 'processed' | 'thumbnail' | 'store';
  }>,
  vehicleId: string,
  storeId: string
): Promise<UploadResult[]> {
  const uploadPromises = files.map(async (file) => {
    const originalResult = await uploadFile({
      vehicleId,
      storeId,
      imageType: file.imageType || 'original',
      contentType: file.contentType,
      buffer: file.buffer,
      originalName: file.originalName,
    });
    
    // Create thumbnail
    try {
      const thumbnailBuffer = await createThumbnail(file.buffer, file.contentType);
      const thumbnailResult = await uploadFile({
        vehicleId,
        storeId,
        imageType: 'thumbnail',
        contentType: file.contentType,
        buffer: thumbnailBuffer,
        originalName: `thumb_${file.originalName}`,
      });
      
      return {
        ...originalResult,
        thumbnailUrl: thumbnailResult.publicUrl,
      };
    } catch (thumbnailError) {
      console.warn('Failed to create thumbnail, using original:', thumbnailError);
      return originalResult;
    }
  });
  
  return Promise.all(uploadPromises);
}

/**
 * Google Cloud Storage Service class (alternative OOP approach)
 */
export class GoogleCloudStorageService {
  private storage: Storage;
  private bucket: Bucket;
  private cdnDomain?: string;

  constructor() {
    this.storage = new Storage({
      projectId: process.env.GOOGLE_CLOUD_PROJECT_ID,
      keyFilename: process.env.GOOGLE_APPLICATION_CREDENTIALS,
    });
    this.bucket = this.storage.bucket(BUCKET_NAME);
    this.cdnDomain = CDN_DOMAIN;
  }

  async uploadFile(options: GCSUploadOptions): Promise<UploadResult> {
    return uploadFile(options);
  }

  async deleteFile(path: string): Promise<void> {
    return deleteFile(path);
  }

  generatePath(
    storeId: string,
    vehicleId: string,
    imageType: 'original' | 'processed' | 'thumbnail' | 'store',
    extension: string
  ): string {
    return generatePath(storeId, vehicleId, imageType, extension);
  }

  getPublicUrl(path: string): string {
    return getPublicUrl(path);
  }

  async createThumbnail(
    buffer: Buffer,
    contentType: string,
    maxWidth: number = 300,
    maxHeight: number = 200
  ): Promise<Buffer> {
    return createThumbnail(buffer, contentType, maxWidth, maxHeight);
  }

  async batchUpload(
    files: Array<{
      buffer: Buffer;
      contentType: string;
      originalName: string;
      imageType?: 'original' | 'processed' | 'thumbnail' | 'store';
    }>,
    vehicleId: string,
    storeId: string
  ): Promise<UploadResult[]> {
    return batchUpload(files, vehicleId, storeId);
  }
}

export const gcsService = new GoogleCloudStorageService();
