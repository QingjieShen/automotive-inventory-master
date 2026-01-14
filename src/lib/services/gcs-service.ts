import { Storage, Bucket } from '@google-cloud/storage';
import { v4 as uuidv4 } from 'uuid';

/**
 * Configuration for Google Cloud Storage Service
 */
export interface GCSConfig {
  projectId: string;
  bucketName: string;
  keyFilename?: string;  // Path to service account JSON
  credentials?: object;   // Or inline credentials
}

/**
 * Result of uploading an image to GCS
 */
export interface GCSUploadResult {
  publicUrl: string;
  bucket: string;
  filename: string;
}

/**
 * Google Cloud Storage Service for CDK One-Eighty Integration
 * 
 * This service handles image storage and retrieval from Google Cloud Storage
 * for the CDK One-Eighty DMS integration. It provides methods for uploading
 * optimized images, retrieving public URLs, and managing image lifecycle.
 */
export class GoogleCloudStorageService {
  private storage: Storage;
  private bucket: Bucket;
  private bucketName: string;

  /**
   * Initialize the Google Cloud Storage service
   * 
   * @param config - GCS configuration including project ID, bucket name, and credentials
   */
  constructor(config: GCSConfig) {
    this.bucketName = config.bucketName;
    
    // Initialize Storage client with credentials
    const storageConfig: any = {
      projectId: config.projectId,
    };

    // Support both file path and inline credentials
    if (config.keyFilename) {
      storageConfig.keyFilename = config.keyFilename;
    } else if (config.credentials) {
      storageConfig.credentials = config.credentials;
    }

    this.storage = new Storage(storageConfig);
    this.bucket = this.storage.bucket(this.bucketName);
  }

  /**
   * Upload an image to Google Cloud Storage
   * 
   * @param file - Image file buffer
   * @param filename - Unique filename for the image
   * @param contentType - MIME type of the image (e.g., 'image/jpeg')
   * @returns Upload result with public URL, bucket name, and filename
   */
  async uploadImage(
    file: Buffer,
    filename: string,
    contentType: string
  ): Promise<GCSUploadResult> {
    try {
      const gcsFile = this.bucket.file(filename);

      // Upload the file with metadata
      await gcsFile.save(file, {
        contentType,
        metadata: {
          cacheControl: 'public, max-age=31536000', // 1 year cache
          metadata: {
            uploadedAt: new Date().toISOString(),
          },
        },
        public: true, // Make file publicly accessible
      });

      // Get the public URL
      const publicUrl = await this.getPublicUrl(filename);

      return {
        publicUrl,
        bucket: this.bucketName,
        filename,
      };
    } catch (error) {
      console.error('GCS upload error:', error);
      throw new Error(
        `Failed to upload image to GCS: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    }
  }

  /**
   * Get the public URL for a file in GCS
   * 
   * @param filename - Name of the file in the bucket
   * @returns Public URL for accessing the file
   */
  async getPublicUrl(filename: string): Promise<string> {
    // Return the standard GCS public URL format
    return `https://storage.googleapis.com/${this.bucketName}/${filename}`;
  }

  /**
   * Delete an image from Google Cloud Storage
   * 
   * @param filename - Name of the file to delete
   */
  async deleteImage(filename: string): Promise<void> {
    try {
      const file = this.bucket.file(filename);
      await file.delete();
    } catch (error) {
      // If file doesn't exist, log warning but don't throw (idempotent)
      if (error instanceof Error && error.message.includes('No such object')) {
        console.warn(`File not found in GCS: ${filename}`);
        return;
      }

      console.error('GCS delete error:', error);
      throw new Error(
        `Failed to delete image from GCS: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    }
  }

  /**
   * Generate a unique filename for storing images
   * 
   * @param originalName - Original filename from upload
   * @param vehicleId - ID of the vehicle the image belongs to
   * @returns Unique filename with path structure
   */
  generateUniqueFilename(originalName: string, vehicleId: string): string {
    const imageId = uuidv4();
    const timestamp = Date.now();
    const extension = this.getExtension(originalName);
    
    // Structure: optimized/{vehicleId}/{imageId}_{timestamp}.{extension}
    return `optimized/${vehicleId}/${imageId}_${timestamp}.${extension}`;
  }

  /**
   * Extract file extension from filename
   * 
   * @param filename - Original filename
   * @returns File extension (e.g., 'jpg', 'png')
   */
  private getExtension(filename: string): string {
    const parts = filename.split('.');
    return parts.length > 1 ? parts[parts.length - 1].toLowerCase() : 'jpg';
  }
}

/**
 * Create a GCS service instance from environment variables
 * 
 * @returns Configured GoogleCloudStorageService instance
 */
export function createGCSServiceFromEnv(): GoogleCloudStorageService {
  const projectId = process.env.GOOGLE_CLOUD_PROJECT_ID || process.env.GCS_PROJECT_ID;
  const bucketName = process.env.GOOGLE_CLOUD_STORAGE_BUCKET || process.env.GCS_BUCKET_NAME;
  const keyFilename = process.env.GOOGLE_APPLICATION_CREDENTIALS || process.env.GCS_KEY_FILE_PATH;
  const credentialsJson = process.env.GOOGLE_APPLICATION_CREDENTIALS_JSON || process.env.GCS_CREDENTIALS;

  if (!projectId) {
    throw new Error('GCS project ID not configured. Set GOOGLE_CLOUD_PROJECT_ID or GCS_PROJECT_ID environment variable.');
  }

  if (!bucketName) {
    throw new Error('GCS bucket name not configured. Set GOOGLE_CLOUD_STORAGE_BUCKET or GCS_BUCKET_NAME environment variable.');
  }

  const config: GCSConfig = {
    projectId,
    bucketName,
  };

  // Use inline credentials if provided, otherwise use key file path
  if (credentialsJson) {
    try {
      config.credentials = JSON.parse(credentialsJson);
    } catch (error) {
      throw new Error('Failed to parse GCS credentials JSON. Ensure GCS_CREDENTIALS is valid JSON.');
    }
  } else if (keyFilename) {
    config.keyFilename = keyFilename;
  } else {
    throw new Error('GCS credentials not configured. Set either GOOGLE_APPLICATION_CREDENTIALS or GCS_CREDENTIALS environment variable.');
  }

  return new GoogleCloudStorageService(config);
}

// Lazy-loaded singleton instance
let _gcsServiceInstance: GoogleCloudStorageService | null = null;

/**
 * Get or create the singleton GCS service instance
 * 
 * @returns Singleton GoogleCloudStorageService instance
 */
export function getGCSService(): GoogleCloudStorageService {
  if (!_gcsServiceInstance) {
    _gcsServiceInstance = createGCSServiceFromEnv();
  }
  return _gcsServiceInstance;
}
