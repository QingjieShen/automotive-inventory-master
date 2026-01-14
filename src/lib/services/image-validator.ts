/**
 * Image Validator Service
 * 
 * Validates uploaded images for format and size requirements.
 * Requirements: 2.1, 2.2, 2.3, 2.4, 2.5
 */

import { createLogger } from '../utils/logger';

export interface ImageValidationResult {
  valid: boolean;
  error?: string;
  fileSize?: number;
  mimeType?: string;
}

export class ImageValidator {
  private readonly MAX_SIZE = 4 * 1024 * 1024; // 4MB in bytes
  private readonly ALLOWED_TYPES = ['image/jpeg', 'image/png'];
  private logger = createLogger('ImageValidator');

  /**
   * Validates an uploaded image file
   * @param file - The file to validate
   * @returns Validation result with error details if invalid
   */
  validate(file: File): ImageValidationResult {
    const mimeType = file.type;
    const fileSize = file.size;

    this.logger.debug('Validating image', {
      operation: 'image-validation',
      mimeType,
      fileSize,
    });

    // Validate MIME type first
    if (!this.validateMimeType(mimeType)) {
      // Requirement 11.6: Log validation errors with file details
      this.logger.warn('Image validation failed: Invalid format', {
        operation: 'image-validation',
        mimeType,
        fileSize,
        reason: 'invalid-format',
      });
      
      return {
        valid: false,
        error: 'Invalid image format. Only JPG and PNG formats are accepted.',
        fileSize,
        mimeType,
      };
    }

    // Validate file size
    if (!this.validateFileSize(fileSize)) {
      // Requirement 11.6: Log validation errors with file details
      this.logger.warn('Image validation failed: Size exceeds limit', {
        operation: 'image-validation',
        mimeType,
        fileSize,
        maxSize: this.MAX_SIZE,
        reason: 'size-exceeded',
      });
      
      return {
        valid: false,
        error: `Image size exceeds the maximum limit. Maximum size is 4MB (${this.MAX_SIZE} bytes).`,
        fileSize,
        mimeType,
      };
    }

    // All validations passed
    this.logger.debug('Image validation passed', {
      operation: 'image-validation',
      mimeType,
      fileSize,
    });
    
    return {
      valid: true,
      fileSize,
      mimeType,
    };
  }

  /**
   * Validates the MIME type of an image
   * @param mimeType - The MIME type to validate
   * @returns True if MIME type is allowed
   */
  validateMimeType(mimeType: string): boolean {
    return this.ALLOWED_TYPES.includes(mimeType);
  }

  /**
   * Validates the file size
   * @param size - The file size in bytes
   * @returns True if size is within limits
   */
  validateFileSize(size: number): boolean {
    return size > 0 && size <= this.MAX_SIZE;
  }
}
