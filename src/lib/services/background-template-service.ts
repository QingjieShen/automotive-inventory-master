import { ImageType } from '@/types';

/**
 * Configuration for background template service
 */
export interface BackgroundTemplateConfig {
  bucketName: string;
  baseUrl?: string; // Optional custom base URL, defaults to GCS standard URL
}

/**
 * Result of selecting a background template
 */
export interface BackgroundTemplateResult {
  templateUrl: string;
  templateName: string;
  imageType: ImageType;
}

/**
 * Background Template Service for CDK One-Eighty Integration
 * 
 * This service manages the selection and retrieval of background templates
 * for AI-powered image processing. It maps vehicle image types to appropriate
 * background templates stored in Google Cloud Storage.
 * 
 * Only key image types (6 types) are processed with backgrounds:
 * - FRONT_QUARTER, FRONT, BACK_QUARTER, BACK, DRIVER_SIDE, PASSENGER_SIDE
 * 
 * Gallery images are NOT processed and will return null.
 */
export class BackgroundTemplateService {
  private config: BackgroundTemplateConfig;
  
  /**
   * Mapping of image types to background template filenames
   * 
   * This mapping defines which background template should be used
   * for each key image type during AI processing.
   */
  private readonly TEMPLATE_MAPPING: Record<string, string> = {
    // Front views use clean white studio background
    FRONT_QUARTER: 'studio-white.jpg',
    FRONT: 'studio-white.jpg',
    
    // Rear views use neutral gray studio background
    BACK_QUARTER: 'studio-gray.jpg',
    BACK: 'studio-gray.jpg',
    
    // Side views use professional blue gradient background
    DRIVER_SIDE: 'gradient-blue.jpg',
    PASSENGER_SIDE: 'gradient-blue.jpg',
  };

  /**
   * Key image types that should be processed with background replacement
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
   * Initialize the background template service
   * 
   * @param config - Configuration including bucket name and optional base URL
   */
  constructor(config: BackgroundTemplateConfig) {
    this.config = config;
  }

  /**
   * Select the appropriate background template for a given image type
   * 
   * This method determines which background template should be used based on
   * the vehicle image type. Gallery images return null as they are not processed.
   * 
   * @param imageType - The type of vehicle image (e.g., FRONT, DRIVER_SIDE)
   * @returns Background template result with URL and metadata, or null for gallery images
   * 
   * @example
   * ```typescript
   * const service = new BackgroundTemplateService({ bucketName: 'my-bucket' });
   * const result = await service.selectBackgroundTemplate('FRONT_QUARTER');
   * // Returns: {
   * //   templateUrl: 'https://storage.googleapis.com/my-bucket/backgrounds/studio-white.jpg',
   * //   templateName: 'studio-white.jpg',
   * //   imageType: 'FRONT_QUARTER'
   * // }
   * ```
   */
  async selectBackgroundTemplate(
    imageType: ImageType
  ): Promise<BackgroundTemplateResult | null> {
    // Gallery images are not processed - return null
    if (!this.isKeyImageType(imageType)) {
      return null;
    }

    // Get the template filename for this image type
    const templateName = this.TEMPLATE_MAPPING[imageType];
    
    if (!templateName) {
      throw new Error(
        `No background template mapping found for image type: ${imageType}`
      );
    }

    // Build the full template URL
    const templateUrl = this.buildTemplateUrl(templateName);

    return {
      templateUrl,
      templateName,
      imageType,
    };
  }

  /**
   * Check if an image type is a key image that should be processed
   * 
   * @param imageType - The image type to check
   * @returns True if this is a key image type, false for gallery images
   */
  isKeyImageType(imageType: ImageType): boolean {
    return this.KEY_IMAGE_TYPES.includes(imageType);
  }

  /**
   * Get all available background templates
   * 
   * @returns Array of all template names and their associated image types
   */
  getAvailableTemplates(): Array<{ templateName: string; imageTypes: ImageType[] }> {
    const templateMap = new Map<string, ImageType[]>();

    // Group image types by template
    for (const [imageType, templateName] of Object.entries(this.TEMPLATE_MAPPING)) {
      if (!templateMap.has(templateName)) {
        templateMap.set(templateName, []);
      }
      templateMap.get(templateName)!.push(imageType as ImageType);
    }

    // Convert to array format
    return Array.from(templateMap.entries()).map(([templateName, imageTypes]) => ({
      templateName,
      imageTypes,
    }));
  }

  /**
   * Build the full URL for a background template
   * 
   * @param templateName - Name of the template file
   * @returns Full URL to the template in GCS
   */
  private buildTemplateUrl(templateName: string): string {
    const baseUrl = this.config.baseUrl || 
      `https://storage.googleapis.com/${this.config.bucketName}`;
    
    return `${baseUrl}/backgrounds/${templateName}`;
  }

  /**
   * Update the template mapping for a specific image type
   * 
   * This method allows runtime customization of which background template
   * is used for a specific image type. Useful for A/B testing or per-store
   * customization.
   * 
   * @param imageType - The image type to update
   * @param templateName - The new template filename to use
   * 
   * @example
   * ```typescript
   * service.updateTemplateMapping('FRONT', 'custom-white.jpg');
   * ```
   */
  updateTemplateMapping(imageType: ImageType, templateName: string): void {
    if (!this.isKeyImageType(imageType)) {
      throw new Error(
        `Cannot update template mapping for gallery image type: ${imageType}`
      );
    }

    this.TEMPLATE_MAPPING[imageType] = templateName;
  }

  /**
   * Get the template name for a specific image type
   * 
   * @param imageType - The image type to query
   * @returns Template filename, or null for gallery images
   */
  getTemplateName(imageType: ImageType): string | null {
    if (!this.isKeyImageType(imageType)) {
      return null;
    }

    return this.TEMPLATE_MAPPING[imageType] || null;
  }
}

/**
 * Create a background template service instance from environment variables
 * 
 * @returns Configured BackgroundTemplateService instance
 */
export function createBackgroundTemplateServiceFromEnv(): BackgroundTemplateService {
  const bucketName = process.env.GOOGLE_CLOUD_STORAGE_BUCKET || process.env.GCS_BUCKET_NAME;

  if (!bucketName) {
    throw new Error(
      'GCS bucket name not configured. Set GOOGLE_CLOUD_STORAGE_BUCKET or GCS_BUCKET_NAME environment variable.'
    );
  }

  return new BackgroundTemplateService({
    bucketName,
  });
}

// Lazy-loaded singleton instance
let _templateServiceInstance: BackgroundTemplateService | null = null;

/**
 * Get or create the singleton background template service instance
 * 
 * @returns Singleton BackgroundTemplateService instance
 */
export function getBackgroundTemplateService(): BackgroundTemplateService {
  if (!_templateServiceInstance) {
    _templateServiceInstance = createBackgroundTemplateServiceFromEnv();
  }
  return _templateServiceInstance;
}
