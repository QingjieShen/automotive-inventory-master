import { ImageType } from '@/types';
import { GoogleCloudStorageService } from './gcs-service';
import { BackgroundTemplateService } from './background-template-service';
import { prisma } from '@/lib/prisma';

/**
 * Result of image processing operation
 */
export interface ProcessingResult {
  success: boolean;
  optimizedUrl?: string;
  error?: string;
  processedAt?: Date;
  skipped?: boolean;  // True for gallery images
}

/**
 * Configuration for AI processor
 */
export interface AIProcessorConfig {
  apiKey: string;
  apiEndpoint: string;
}

/**
 * Options for background processing
 */
export interface BackgroundProcessingOptions {
  preserveVehicleDetails: boolean;
  adjustColorTemperature: boolean;
  blendMode: 'natural' | 'studio' | 'dramatic';
}

/**
 * Image Processor Service for CDK One-Eighty Integration
 * 
 * This service orchestrates the AI-powered image processing workflow for vehicle images.
 * It handles downloading raw images, processing them with AI for background removal and
 * replacement, uploading optimized images to GCS, and updating the database.
 * 
 * Only key image types (6 types) are processed:
 * - FRONT_QUARTER, FRONT, BACK_QUARTER, BACK, DRIVER_SIDE, PASSENGER_SIDE
 * 
 * Gallery images (GALLERY, GALLERY_EXTERIOR, GALLERY_INTERIOR) are NOT processed.
 * 
 * @example
 * ```typescript
 * const processor = new ImageProcessorService(gcsService, templateService, aiConfig);
 * const result = await processor.processImage('img123', 'https://...', 'FRONT_QUARTER');
 * if (result.success) {
 *   console.log('Optimized URL:', result.optimizedUrl);
 * }
 * ```
 */
export class ImageProcessorService {
  private gcsService: GoogleCloudStorageService;
  private templateService: BackgroundTemplateService;
  private aiConfig: AIProcessorConfig;

  /**
   * Key image types that should be processed with AI
   * Gallery images are excluded from processing
   */
  private readonly KEY_IMAGE_TYPES: ImageType[] = [
    'FRONT_QUARTER',
    'FRONT',
    'BACK_QUARTER',
    'BACK',
    'DRIVER_SIDE',
    'PASSENGER_SIDE',
  ];

  /**
   * Initialize the image processor service
   * 
   * @param gcsService - Google Cloud Storage service for image storage
   * @param templateService - Background template service for template selection
   * @param aiConfig - Configuration for AI API (Gemini/Vertex AI)
   */
  constructor(
    gcsService: GoogleCloudStorageService,
    templateService: BackgroundTemplateService,
    aiConfig: AIProcessorConfig
  ) {
    this.gcsService = gcsService;
    this.templateService = templateService;
    this.aiConfig = aiConfig;
  }

  /**
   * Process a vehicle image with AI background removal and replacement
   * 
   * This is the main orchestration method that:
   * 1. Checks if the image type should be processed (skips gallery images)
   * 2. Downloads the original image
   * 3. Selects appropriate background template
   * 4. Calls AI API for background processing
   * 5. Uploads optimized image to GCS
   * 6. Updates database with optimized URL and timestamps
   * 
   * @param vehicleImageId - Database ID of the vehicle image record
   * @param originalUrl - URL of the original/raw image
   * @param imageType - Type of the image (e.g., FRONT_QUARTER, GALLERY)
   * @returns Processing result with success status and optimized URL
   * 
   * @example
   * ```typescript
   * const result = await processor.processImage(
   *   'img_abc123',
   *   'https://storage.googleapis.com/bucket/raw/vehicle1/img1.jpg',
   *   'FRONT_QUARTER'
   * );
   * ```
   */
  async processImage(
    vehicleImageId: string,
    originalUrl: string,
    imageType: ImageType
  ): Promise<ProcessingResult> {
    try {
      // Step 1: Check if this image type should be processed
      if (!this.shouldProcessImage(imageType)) {
        console.log(`Skipping gallery image: ${vehicleImageId} (${imageType})`);
        return {
          success: true,
          skipped: true,
        };
      }

      console.log(`Processing image: ${vehicleImageId} (${imageType})`);

      // Step 2: Get the vehicle image record to access vehicleId
      const vehicleImage = await prisma.vehicleImage.findUnique({
        where: { id: vehicleImageId },
        select: { vehicleId: true },
      });

      if (!vehicleImage) {
        throw new Error(`Vehicle image not found: ${vehicleImageId}`);
      }

      // Step 3: Download the original image
      const imageBuffer = await this.downloadImage(originalUrl);

      // Step 4: Select background template for this image type
      const templateResult = await this.templateService.selectBackgroundTemplate(imageType);
      
      if (!templateResult) {
        throw new Error(`No background template found for image type: ${imageType}`);
      }

      // Step 5: Process image with AI (background removal and replacement)
      const processedBuffer = await this.removeAndReplaceBackground(
        imageBuffer,
        imageType,
        templateResult.templateUrl
      );

      // Step 6: Upload optimized image to GCS
      const optimizedUrl = await this.uploadOptimized(
        processedBuffer,
        vehicleImage.vehicleId,
        vehicleImageId
      );

      // Step 7: Update database with optimized URL and timestamps
      const processedAt = new Date();
      await prisma.vehicleImage.update({
        where: { id: vehicleImageId },
        data: {
          optimizedUrl,
          isOptimized: true,
          processedAt,
          updatedAt: processedAt, // Ensure updatedAt is set for cache busting
        },
      });

      console.log(`Successfully processed image: ${vehicleImageId}`);

      return {
        success: true,
        optimizedUrl,
        processedAt,
      };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown processing error';
      console.error(`Image processing failed for ${vehicleImageId}:`, errorMessage);

      // Log error to database (optional - could be added to a separate error log table)
      console.error({
        operation: 'image-processing',
        vehicleImageId,
        imageType,
        error: errorMessage,
        timestamp: new Date().toISOString(),
      });

      return {
        success: false,
        error: errorMessage,
      };
    }
  }

  /**
   * Check if an image type should be processed with AI
   * 
   * Only key image types (6 types) are processed. Gallery images are skipped.
   * 
   * @param imageType - The image type to check
   * @returns True if this is a key image type that should be processed
   */
  shouldProcessImage(imageType: ImageType): boolean {
    return this.KEY_IMAGE_TYPES.includes(imageType);
  }

  /**
   * Download an image from a URL
   * 
   * @param url - URL of the image to download
   * @returns Image data as a Buffer
   * @throws Error if download fails
   */
  private async downloadImage(url: string): Promise<Buffer> {
    try {
      const response = await fetch(url);

      if (!response.ok) {
        throw new Error(`Failed to download image: ${response.status} ${response.statusText}`);
      }

      const arrayBuffer = await response.arrayBuffer();
      return Buffer.from(arrayBuffer);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown download error';
      throw new Error(`Image download failed: ${errorMessage}`);
    }
  }

  /**
   * Remove background from vehicle image and replace with template using AI
   * 
   * This method uses Google AI API (Gemini/Vertex AI) to:
   * 1. Remove the background from the vehicle image
   * 2. Composite the vehicle onto the provided background template
   * 3. Adjust lighting and color temperature for natural blending
   * 
   * @param imageBuffer - Original image data
   * @param imageType - Type of the image
   * @param backgroundTemplate - URL of the background template to use
   * @returns Processed image data as a Buffer
   * @throws Error if AI API call fails
   */
  private async removeAndReplaceBackground(
    imageBuffer: Buffer,
    imageType: ImageType,
    backgroundTemplate: string
  ): Promise<Buffer> {
    try {
      // Convert image buffer to base64 for API transmission
      const base64Image = imageBuffer.toString('base64');

      // Build the prompt for AI processing
      const prompt = this.buildProcessingPrompt(imageType);

      // Prepare the API request
      const requestBody = {
        image: base64Image,
        backgroundTemplate: backgroundTemplate,
        prompt: prompt,
        parameters: {
          preserveVehicleDetails: true,
          adjustColorTemperature: true,
          blendMode: 'natural',
        },
      };

      // Call the AI API
      const response = await fetch(this.aiConfig.apiEndpoint, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.aiConfig.apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        const errorText = await response.text().catch(() => 'Unknown error');
        throw new Error(
          `AI API request failed: ${response.status} ${response.statusText} - ${errorText}`
        );
      }

      // Parse the response
      const result = await response.json();

      // Extract the processed image from the response
      if (!result.processedImage) {
        throw new Error('AI API response missing processedImage field');
      }

      // Convert base64 response back to Buffer
      return Buffer.from(result.processedImage, 'base64');
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown AI processing error';
      console.error('AI background processing failed:', errorMessage);
      throw new Error(`Background processing failed: ${errorMessage}`);
    }
  }

  /**
   * Build the AI processing prompt based on image type
   * 
   * Different image types may benefit from slightly different processing instructions.
   * This method generates an appropriate prompt for the AI API.
   * 
   * @param imageType - Type of the vehicle image
   * @returns Prompt string for AI processing
   */
  private buildProcessingPrompt(imageType: ImageType): string {
    const basePrompt = `Remove the background from this vehicle image. 
Then composite the vehicle onto the provided background template.
Adjust lighting and color temperature to blend naturally with the background.
Do not add any elements to the vehicle itself.
Maintain the vehicle's original appearance and details.`;

    // Add image-type-specific instructions
    const typeSpecificInstructions: Record<string, string> = {
      FRONT_QUARTER: 'Ensure the front quarter angle is clearly visible with proper perspective.',
      FRONT: 'Maintain the straight-on front view with symmetrical lighting.',
      BACK_QUARTER: 'Preserve the rear quarter angle with clear visibility of the back.',
      BACK: 'Keep the straight-on rear view with even lighting.',
      DRIVER_SIDE: 'Maintain the full side profile from the driver side.',
      PASSENGER_SIDE: 'Preserve the full side profile from the passenger side.',
    };

    const specificInstruction = typeSpecificInstructions[imageType] || '';

    return specificInstruction 
      ? `${basePrompt}\n\nSpecific requirement: ${specificInstruction}`
      : basePrompt;
  }

  /**
   * Upload optimized image to Google Cloud Storage
   * 
   * @param imageBuffer - Processed image data
   * @param vehicleId - ID of the vehicle
   * @param imageId - ID of the image record
   * @returns Public URL of the uploaded optimized image
   */
  private async uploadOptimized(
    imageBuffer: Buffer,
    vehicleId: string,
    imageId: string
  ): Promise<string> {
    // Generate unique filename for optimized image
    const filename = this.gcsService.generateUniqueFilename(
      `${imageId}_optimized.jpg`,
      vehicleId
    );

    // Upload to GCS with JPEG content type
    const uploadResult = await this.gcsService.uploadImage(
      imageBuffer,
      filename,
      'image/jpeg'
    );

    return uploadResult.publicUrl;
  }
}

/**
 * Create an image processor service instance from environment variables
 * 
 * @param gcsService - Google Cloud Storage service instance
 * @param templateService - Background template service instance
 * @returns Configured ImageProcessorService instance
 */
export function createImageProcessorServiceFromEnv(
  gcsService: GoogleCloudStorageService,
  templateService: BackgroundTemplateService
): ImageProcessorService {
  const apiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_AI_API_KEY;
  const apiEndpoint = process.env.GEMINI_API_URL || process.env.GOOGLE_AI_ENDPOINT;

  if (!apiKey) {
    throw new Error(
      'AI API key not configured. Set GEMINI_API_KEY or GOOGLE_AI_API_KEY environment variable.'
    );
  }

  if (!apiEndpoint) {
    throw new Error(
      'AI API endpoint not configured. Set GEMINI_API_URL or GOOGLE_AI_ENDPOINT environment variable.'
    );
  }

  const aiConfig: AIProcessorConfig = {
    apiKey,
    apiEndpoint,
  };

  return new ImageProcessorService(gcsService, templateService, aiConfig);
}
