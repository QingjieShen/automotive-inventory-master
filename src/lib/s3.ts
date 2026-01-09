import { S3Client, PutObjectCommand, DeleteObjectCommand, PutObjectCommandInput, DeleteObjectCommandInput } from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'
import { v4 as uuidv4 } from 'uuid'

// Configure AWS SDK v3
const s3Client = new S3Client({
  region: process.env.AWS_REGION || 'us-east-1',
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || '',
  },
})

const BUCKET_NAME = process.env.AWS_S3_BUCKET || 'mmg-vehicle-inventory'
const CLOUDFRONT_DOMAIN = process.env.AWS_CLOUDFRONT_DOMAIN

export interface UploadResult {
  originalUrl: string
  thumbnailUrl: string
  key: string
  size: number
  contentType: string
}

export interface S3UploadOptions {
  vehicleId: string
  storeId: string
  imageType: 'original' | 'processed' | 'thumbnail'
  contentType: string
  buffer: Buffer
  originalName?: string
}

/**
 * Generate S3 key for organized file storage
 */
export function generateS3Key(
  storeId: string,
  vehicleId: string,
  imageType: 'original' | 'processed' | 'thumbnail',
  extension: string
): string {
  const imageId = uuidv4()
  const timestamp = Date.now()
  
  return `stores/${storeId}/vehicles/${vehicleId}/${imageType}/${imageId}_${timestamp}.${extension}`
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
  }
  
  return extensions[contentType] || 'jpg'
}

/**
 * Generate CloudFront URL from S3 key
 */
export function getCloudFrontUrl(key: string): string {
  if (CLOUDFRONT_DOMAIN) {
    return `https://${CLOUDFRONT_DOMAIN}/${key}`
  }
  
  // Fallback to S3 direct URL
  return `https://${BUCKET_NAME}.s3.${process.env.AWS_REGION || 'us-east-1'}.amazonaws.com/${key}`
}

/**
 * Upload file to S3
 */
export async function uploadToS3(options: S3UploadOptions): Promise<UploadResult> {
  const { vehicleId, storeId, imageType, contentType, buffer, originalName } = options
  
  const extension = getExtensionFromContentType(contentType)
  const key = generateS3Key(storeId, vehicleId, imageType, extension)
  
  const uploadParams: PutObjectCommandInput = {
    Bucket: BUCKET_NAME,
    Key: key,
    Body: buffer,
    ContentType: contentType,
    CacheControl: 'max-age=31536000', // 1 year cache
    Metadata: {
      vehicleId,
      storeId,
      imageType,
      originalName: originalName || 'unknown',
      uploadedAt: new Date().toISOString(),
    },
  }
  
  try {
    const command = new PutObjectCommand(uploadParams)
    await s3Client.send(command)
    
    const originalUrl = getCloudFrontUrl(key)
    
    return {
      originalUrl,
      thumbnailUrl: originalUrl, // For now, same as original. Thumbnail generation can be added later
      key,
      size: buffer.length,
      contentType,
    }
  } catch (error) {
    console.error('S3 upload error:', error)
    throw new Error(`Failed to upload file to S3: ${error instanceof Error ? error.message : 'Unknown error'}`)
  }
}

/**
 * Delete file from S3
 */
export async function deleteFromS3(key: string): Promise<void> {
  const deleteParams: DeleteObjectCommandInput = {
    Bucket: BUCKET_NAME,
    Key: key,
  }
  
  try {
    const command = new DeleteObjectCommand(deleteParams)
    await s3Client.send(command)
  } catch (error) {
    console.error('S3 delete error:', error)
    throw new Error(`Failed to delete file from S3: ${error instanceof Error ? error.message : 'Unknown error'}`)
  }
}

/**
 * Generate presigned URL for direct upload (alternative approach)
 */
export async function generatePresignedUrl(
  storeId: string,
  vehicleId: string,
  contentType: string,
  expiresIn: number = 3600 // 1 hour
): Promise<{ url: string; key: string }> {
  const extension = getExtensionFromContentType(contentType)
  const key = generateS3Key(storeId, vehicleId, 'original', extension)
  
  try {
    const command = new PutObjectCommand({
      Bucket: BUCKET_NAME,
      Key: key,
      ContentType: contentType,
    })
    
    const url = await getSignedUrl(s3Client, command, { expiresIn })
    
    return { url, key }
  } catch (error) {
    console.error('Presigned URL generation error:', error)
    throw new Error(`Failed to generate presigned URL: ${error instanceof Error ? error.message : 'Unknown error'}`)
  }
}

/**
 * Create thumbnail from image buffer (basic implementation)
 * In production, this could use AWS Lambda or a more sophisticated image processing service
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
  return originalBuffer
}

/**
 * Batch upload multiple files
 */
export async function batchUploadToS3(
  files: Array<{
    buffer: Buffer
    contentType: string
    originalName: string
    imageType?: 'original' | 'processed' | 'thumbnail'
  }>,
  vehicleId: string,
  storeId: string
): Promise<UploadResult[]> {
  const uploadPromises = files.map(async (file) => {
    const originalResult = await uploadToS3({
      vehicleId,
      storeId,
      imageType: file.imageType || 'original',
      contentType: file.contentType,
      buffer: file.buffer,
      originalName: file.originalName,
    })
    
    // Create thumbnail
    try {
      const thumbnailBuffer = await createThumbnail(file.buffer, file.contentType)
      const thumbnailResult = await uploadToS3({
        vehicleId,
        storeId,
        imageType: 'thumbnail',
        contentType: file.contentType,
        buffer: thumbnailBuffer,
        originalName: `thumb_${file.originalName}`,
      })
      
      return {
        ...originalResult,
        thumbnailUrl: thumbnailResult.originalUrl,
      }
    } catch (thumbnailError) {
      console.warn('Failed to create thumbnail, using original:', thumbnailError)
      return originalResult
    }
  })
  
  return Promise.all(uploadPromises)
}