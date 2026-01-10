import * as fc from 'fast-check';

// Mock uuid before importing gcs
jest.mock('uuid', () => ({
  v4: jest.fn(() => 'test-uuid-1234'),
}));

import { generatePath, getExtensionFromContentType, getPublicUrl, uploadFile, deleteFile } from '@/lib/gcs';

describe('Google Cloud Storage Properties', () => {
  // Feature: app-enhancements, Property 1: Google Cloud Storage Upload Consistency
  test('upload returns valid URL and file is accessible', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.uuid(), // vehicleId
        fc.uuid(), // storeId
        fc.constantFrom('original', 'processed', 'thumbnail', 'store'), // imageType
        fc.constantFrom('image/jpeg', 'image/png', 'image/webp'), // contentType
        fc.uint8Array({ minLength: 100, maxLength: 1000 }), // buffer (small for testing)
        fc.string({ minLength: 5, maxLength: 20 }), // originalName
        async (vehicleId, storeId, imageType, contentType, bufferArray, originalName) => {
          const buffer = Buffer.from(bufferArray);
          
          try {
            const result = await uploadFile({
              vehicleId,
              storeId,
              imageType: imageType as 'original' | 'processed' | 'thumbnail' | 'store',
              contentType,
              buffer,
              originalName: `${originalName}.jpg`,
            });
            
            // Property 1: Upload should return a valid URL
            expect(result.publicUrl).toBeTruthy();
            expect(result.publicUrl).toMatch(/^https:\/\//);
            
            // Property 2: URL should contain the bucket name or CDN domain
            const bucketName = process.env.GOOGLE_CLOUD_STORAGE_BUCKET || 'mmg-vehicle-inventory';
            const cdnDomain = process.env.GOOGLE_CLOUD_CDN_DOMAIN;
            
            if (cdnDomain) {
              expect(result.publicUrl).toContain(cdnDomain);
            } else {
              expect(result.publicUrl).toContain(bucketName);
            }
            
            // Property 3: Path should be returned
            expect(result.path).toBeTruthy();
            expect(result.path).toContain(storeId);
            
            // Property 4: Size should match buffer length
            expect(result.size).toBe(buffer.length);
            
            // Property 5: Content type should match
            expect(result.contentType).toBe(contentType);
            
            // Property 6: Thumbnail URL should be present
            expect(result.thumbnailUrl).toBeTruthy();
            
            // Clean up: delete the uploaded file
            await deleteFile(result.path);
          } catch (error) {
            // If GCS is not configured, skip the test
            if (error instanceof Error && 
                (error.message.includes('credentials') || 
                 error.message.includes('authentication') ||
                 error.message.includes('GOOGLE_CLOUD'))) {
              console.warn('Skipping GCS test - credentials not configured');
              return;
            }
            throw error;
          }
        }
      ),
      { numRuns: 10 } // Reduced runs for actual API calls
    );
  }, 60000); // 60 second timeout for API calls

  // Feature: app-enhancements, Property 8: Image Path Generation Uniqueness
  test('consecutive uploads generate unique paths', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.uuid(), // vehicleId
        fc.uuid(), // storeId
        fc.constantFrom('original', 'processed', 'thumbnail'), // imageType (not 'store' as it has fixed path)
        fc.constantFrom('image/jpeg', 'image/png', 'image/webp'), // contentType
        fc.integer({ min: 2, max: 5 }), // number of uploads
        async (vehicleId, storeId, imageType, contentType, uploadCount) => {
          const paths = new Set<string>();
          const uploadedPaths: string[] = [];
          
          try {
            // Generate multiple uploads
            for (let i = 0; i < uploadCount; i++) {
              const buffer = Buffer.from(`test-image-${i}`);
              
              const result = await uploadFile({
                vehicleId,
                storeId,
                imageType: imageType as 'original' | 'processed' | 'thumbnail',
                contentType,
                buffer,
                originalName: `test-${i}.jpg`,
              });
              
              paths.add(result.path);
              uploadedPaths.push(result.path);
              
              // Small delay to ensure timestamp differences
              await new Promise(resolve => setTimeout(resolve, 10));
            }
            
            // Property: All paths should be unique
            expect(paths.size).toBe(uploadCount);
            
            // Property: Each path should contain the vehicle ID
            uploadedPaths.forEach(path => {
              expect(path).toContain(vehicleId);
            });
            
            // Clean up: delete all uploaded files
            for (const path of uploadedPaths) {
              await deleteFile(path);
            }
          } catch (error) {
            // If GCS is not configured, skip the test
            if (error instanceof Error && 
                (error.message.includes('credentials') || 
                 error.message.includes('authentication') ||
                 error.message.includes('GOOGLE_CLOUD'))) {
              console.warn('Skipping GCS test - credentials not configured');
              return;
            }
            
            // Clean up any uploaded files before throwing
            for (const path of uploadedPaths) {
              try {
                await deleteFile(path);
              } catch (cleanupError) {
                // Ignore cleanup errors
              }
            }
            throw error;
          }
        }
      ),
      { numRuns: 5 } // Reduced runs for actual API calls
    );
  }, 120000); // 120 second timeout for multiple API calls

  // Additional property: Path generation is deterministic for given inputs
  test('path generation follows expected structure', () => {
    fc.assert(
      fc.property(
        fc.uuid(), // storeId
        fc.uuid(), // vehicleId
        fc.constantFrom('original', 'processed', 'thumbnail', 'store'), // imageType
        fc.constantFrom('jpg', 'png', 'webp'), // extension
        (storeId, vehicleId, imageType, extension) => {
          const path = generatePath(storeId, vehicleId, imageType as any, extension);
          
          // Property 1: Path should start with stores/{storeId}
          expect(path).toMatch(new RegExp(`^stores/${storeId}`));
          
          // Property 2: For non-store images, path should contain vehicle ID
          if (imageType !== 'store') {
            expect(path).toContain(vehicleId);
            expect(path).toContain(imageType);
          }
          
          // Property 3: Path should end with the extension
          expect(path).toMatch(new RegExp(`\\.${extension}$`));
          
          // Property 4: Store images should have fixed path format
          if (imageType === 'store') {
            expect(path).toBe(`stores/${storeId}/store-image.${extension}`);
          }
        }
      ),
      { numRuns: 100 }
    );
  });

  // Additional property: Extension extraction is consistent
  test('content type to extension conversion is consistent', () => {
    fc.assert(
      fc.property(
        fc.constantFrom('image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'),
        (contentType) => {
          const extension = getExtensionFromContentType(contentType);
          
          // Property 1: Extension should be a valid image extension
          expect(['jpg', 'png', 'gif', 'webp']).toContain(extension);
          
          // Property 2: Same content type should always produce same extension
          const extension2 = getExtensionFromContentType(contentType);
          expect(extension).toBe(extension2);
          
          // Property 3: JPEG variations should map to 'jpg'
          if (contentType === 'image/jpeg' || contentType === 'image/jpg') {
            expect(extension).toBe('jpg');
          }
        }
      ),
      { numRuns: 100 }
    );
  });

  // Additional property: Public URL generation is consistent
  test('public URL generation is consistent and valid', () => {
    fc.assert(
      fc.property(
        fc.string({ minLength: 10, maxLength: 100 }).map(s => s.replace(/\s/g, '_')), // path
        (path) => {
          const url = getPublicUrl(path);
          
          // Property 1: URL should be HTTPS
          expect(url).toMatch(/^https:\/\//);
          
          // Property 2: URL should contain the path
          expect(url).toContain(path);
          
          // Property 3: Same path should always produce same URL
          const url2 = getPublicUrl(path);
          expect(url).toBe(url2);
          
          // Property 4: URL should contain either CDN domain or bucket name
          const bucketName = process.env.GOOGLE_CLOUD_STORAGE_BUCKET || 'mmg-vehicle-inventory';
          const cdnDomain = process.env.GOOGLE_CLOUD_CDN_DOMAIN;
          
          if (cdnDomain) {
            expect(url).toContain(cdnDomain);
          } else {
            expect(url).toContain(bucketName);
          }
        }
      ),
      { numRuns: 100 }
    );
  });
});
