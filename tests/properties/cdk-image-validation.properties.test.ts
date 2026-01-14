import * as fc from 'fast-check';
import { ImageValidator } from '@/lib/services/image-validator';

describe('Image Validation Property Tests', () => {
  let validator: ImageValidator;

  beforeEach(() => {
    validator = new ImageValidator();
  });

  // Feature: cdk-one-eighty-integration, Property 2: Image Format Validation
  // Validates: Requirements 2.1, 2.3
  describe('Property 2: Image Format Validation', () => {
    test('rejects files with invalid MIME types', () => {
      fc.assert(
        fc.property(
          fc.oneof(
            fc.constantFrom(
              'image/gif',
              'image/bmp',
              'image/webp',
              'image/svg+xml',
              'image/tiff',
              'application/pdf',
              'text/plain',
              'video/mp4',
              'audio/mpeg',
              'application/octet-stream',
              'text/html',
              'application/json'
            ),
            fc.string().filter(s => s !== 'image/jpeg' && s !== 'image/png')
          ),
          fc.integer({ min: 1, max: 4 * 1024 * 1024 }), // Valid size
          (invalidMimeType, fileSize) => {
            const mockFile = new File(
              [new ArrayBuffer(fileSize)],
              'test.file',
              { type: invalidMimeType }
            );

            const result = validator.validate(mockFile);
            
            expect(result.valid).toBe(false);
            expect(result.error).toBeDefined();
            expect(result.error).toMatch(/format|JPG|PNG|accepted/i);
            // Note: File constructor normalizes MIME types to lowercase
            expect(result.mimeType).toBe(mockFile.type);
          }
        ),
        { numRuns: 100 }
      );
    });

    test('validateMimeType returns false for non-JPG/PNG types', () => {
      fc.assert(
        fc.property(
          fc.string().filter(s => s !== 'image/jpeg' && s !== 'image/png'),
          (invalidMimeType) => {
            const result = validator.validateMimeType(invalidMimeType);
            expect(result).toBe(false);
          }
        ),
        { numRuns: 100 }
      );
    });
  });

  // Feature: cdk-one-eighty-integration, Property 3: Image Size Validation
  // Validates: Requirements 2.2, 2.4
  describe('Property 3: Image Size Validation', () => {
    test('rejects files exceeding 4MB size limit', () => {
      fc.assert(
        fc.property(
          fc.integer({ min: 4 * 1024 * 1024 + 1, max: 100 * 1024 * 1024 }), // > 4MB
          fc.constantFrom('image/jpeg', 'image/png'),
          (oversizedFileSize, mimeType) => {
            const mockFile = new File(
              [new ArrayBuffer(oversizedFileSize)],
              'test.jpg',
              { type: mimeType }
            );

            const result = validator.validate(mockFile);
            
            expect(result.valid).toBe(false);
            expect(result.error).toBeDefined();
            expect(result.error).toMatch(/size|4MB|maximum|limit|exceeds/i);
            expect(result.fileSize).toBe(oversizedFileSize);
          }
        ),
        { numRuns: 100 }
      );
    });

    test('rejects files with zero or negative size', () => {
      fc.assert(
        fc.property(
          fc.constantFrom('image/jpeg', 'image/png'),
          (mimeType) => {
            const mockFile = new File(
              [],
              'empty.jpg',
              { type: mimeType }
            );

            const result = validator.validate(mockFile);
            
            // Zero-size files should be rejected
            expect(result.valid).toBe(false);
          }
        ),
        { numRuns: 100 }
      );
    });

    test('validateFileSize returns false for sizes exceeding 4MB', () => {
      fc.assert(
        fc.property(
          fc.integer({ min: 4 * 1024 * 1024 + 1, max: 100 * 1024 * 1024 }),
          (oversizedFileSize) => {
            const result = validator.validateFileSize(oversizedFileSize);
            expect(result).toBe(false);
          }
        ),
        { numRuns: 100 }
      );
    });

    test('validateFileSize returns false for zero or negative sizes', () => {
      fc.assert(
        fc.property(
          fc.integer({ min: -1000, max: 0 }),
          (invalidSize) => {
            const result = validator.validateFileSize(invalidSize);
            expect(result).toBe(false);
          }
        ),
        { numRuns: 100 }
      );
    });
  });

  // Feature: cdk-one-eighty-integration, Property 4: Valid Images Are Accepted
  // Validates: Requirements 2.5
  describe('Property 4: Valid Images Are Accepted', () => {
    test('accepts files with valid MIME type (JPG/PNG) and size ≤4MB', () => {
      fc.assert(
        fc.property(
          fc.constantFrom('image/jpeg', 'image/png'),
          fc.integer({ min: 1, max: 4 * 1024 * 1024 }), // 1 byte to 4MB
          (validMimeType, validFileSize) => {
            const mockFile = new File(
              [new ArrayBuffer(validFileSize)],
              validMimeType === 'image/jpeg' ? 'test.jpg' : 'test.png',
              { type: validMimeType }
            );

            const result = validator.validate(mockFile);
            
            expect(result.valid).toBe(true);
            expect(result.error).toBeUndefined();
            expect(result.fileSize).toBe(validFileSize);
            expect(result.mimeType).toBe(validMimeType);
          }
        ),
        { numRuns: 100 }
      );
    });

    test('accepts files at exactly 4MB boundary', () => {
      fc.assert(
        fc.property(
          fc.constantFrom('image/jpeg', 'image/png'),
          (mimeType) => {
            const exactlyFourMB = 4 * 1024 * 1024;
            const mockFile = new File(
              [new ArrayBuffer(exactlyFourMB)],
              'test.jpg',
              { type: mimeType }
            );

            const result = validator.validate(mockFile);
            
            expect(result.valid).toBe(true);
            expect(result.error).toBeUndefined();
            expect(result.fileSize).toBe(exactlyFourMB);
          }
        ),
        { numRuns: 100 }
      );
    });

    test('validateMimeType returns true for JPG and PNG', () => {
      fc.assert(
        fc.property(
          fc.constantFrom('image/jpeg', 'image/png'),
          (validMimeType) => {
            const result = validator.validateMimeType(validMimeType);
            expect(result).toBe(true);
          }
        ),
        { numRuns: 100 }
      );
    });

    test('validateFileSize returns true for sizes between 1 byte and 4MB', () => {
      fc.assert(
        fc.property(
          fc.integer({ min: 1, max: 4 * 1024 * 1024 }),
          (validSize) => {
            const result = validator.validateFileSize(validSize);
            expect(result).toBe(true);
          }
        ),
        { numRuns: 100 }
      );
    });
  });

  // Combined property: All validation results have consistent structure
  describe('Validation Result Consistency', () => {
    test('all validation results include fileSize and mimeType', () => {
      fc.assert(
        fc.property(
          fc.constantFrom('image/jpeg', 'image/png', 'image/gif', 'application/pdf'),
          fc.integer({ min: 0, max: 10 * 1024 * 1024 }),
          (mimeType, fileSize) => {
            const mockFile = new File(
              [new ArrayBuffer(fileSize)],
              'test.file',
              { type: mimeType }
            );

            const result = validator.validate(mockFile);
            
            expect(result).toHaveProperty('valid');
            expect(result).toHaveProperty('fileSize');
            expect(result).toHaveProperty('mimeType');
            expect(typeof result.valid).toBe('boolean');
            expect(result.fileSize).toBe(fileSize);
            expect(result.mimeType).toBe(mimeType);
            
            if (!result.valid) {
              expect(result.error).toBeDefined();
              expect(typeof result.error).toBe('string');
              expect(result.error!.length).toBeGreaterThan(0);
            }
          }
        ),
        { numRuns: 100 }
      );
    });
  });
});
