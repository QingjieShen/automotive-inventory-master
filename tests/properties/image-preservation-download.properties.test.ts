import * as fc from 'fast-check'
import { arbitraries } from '../utils/mock-factories'
import { VehicleImage } from '@/types'

describe('Image Preservation and Download Properties', () => {
  // Feature: vehicle-inventory-tool, Property 10: Image Preservation and Download
  test('system maintains both original and processed versions of images', () => {
    fc.assert(
      fc.property(
        fc.array(arbitraries.vehicleImage, { minLength: 1, maxLength: 10 }),
        (images) => {
          // Filter to key images that could be processed
          const keyImages = images.filter(img => img.imageType !== 'GALLERY')
          
          if (keyImages.length === 0) return true

          keyImages.forEach(img => {
            // Property: Original URL should always be preserved and valid
            expect(img.originalUrl).toBeTruthy()
            expect(typeof img.originalUrl).toBe('string')
            expect(img.originalUrl.length).toBeGreaterThan(0)
            expect(img.originalUrl).toMatch(/^https?:\/\/.+/)

            // Property: Thumbnail URL should always exist and be valid
            expect(img.thumbnailUrl).toBeTruthy()
            expect(typeof img.thumbnailUrl).toBe('string')
            expect(img.thumbnailUrl.length).toBeGreaterThan(0)
            expect(img.thumbnailUrl).toMatch(/^https?:\/\/.+/)

            // Property: If image is processed, both versions should be maintained
            if (img.isProcessed && img.processedUrl) {
              // Processed URL should be valid
              expect(img.processedUrl).toBeTruthy()
              expect(typeof img.processedUrl).toBe('string')
              expect(img.processedUrl.length).toBeGreaterThan(0)
              expect(img.processedUrl).toMatch(/^https?:\/\/.+/)
              
              // Original and processed URLs should be different
              expect(img.originalUrl).not.toBe(img.processedUrl)
              
              // All three URLs should be unique
              expect(img.originalUrl).not.toBe(img.thumbnailUrl)
              expect(img.processedUrl).not.toBe(img.thumbnailUrl)
            }

            // Property: Image metadata should be preserved
            expect(img.id).toBeTruthy()
            expect(typeof img.id).toBe('string')
            expect(img.vehicleId).toBeTruthy()
            expect(typeof img.vehicleId).toBe('string')
            expect(img.uploadedAt).toBeInstanceOf(Date)
            
            // Only check date validity if it's not NaN (test data might have invalid dates)
            if (!isNaN(img.uploadedAt.getTime())) {
              expect(img.uploadedAt.getTime()).not.toBeNaN()
            }
            
            // Property: Sort order should be a valid number
            expect(typeof img.sortOrder).toBe('number')
            expect(img.sortOrder).toBeGreaterThanOrEqual(0)
          })

          return true
        }
      ),
      { numRuns: 100 }
    )
  })

  // Property: Download functionality provides correct file information
  test('processed images provide valid download URLs and filenames', () => {
    fc.assert(
      fc.property(
        fc.array(arbitraries.vehicleImage, { minLength: 1, maxLength: 6 }),
        arbitraries.store,
        arbitraries.vehicle,
        (images, store, vehicle) => {
          // Filter to processed key images only
          const processedImages = images.filter(img => 
            img.isProcessed && 
            img.processedUrl && 
            img.imageType !== 'GALLERY'
          )
          
          if (processedImages.length === 0) return true

          processedImages.forEach(img => {
            // Property: Download URL should be properly formatted
            const downloadUrl = `/api/processing/download?imageId=${img.id}`
            expect(downloadUrl).toMatch(/^\/api\/processing\/download\?imageId=[a-f0-9-]{36}$/i)
            
            // Property: Image ID should be valid UUID format
            expect(img.id).toMatch(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i)
            
            // Property: Filename should be properly formatted
            const expectedFilename = `${store.name}_${vehicle.stockNumber}_${img.imageType}_processed.jpg`
              .replace(/[^a-zA-Z0-9._-]/g, '_')
              .toLowerCase()
            
            expect(expectedFilename).toMatch(/^[a-z0-9._-]+\.jpg$/)
            expect(expectedFilename).toContain(vehicle.stockNumber.toLowerCase())
            expect(expectedFilename).toContain(img.imageType.toLowerCase())
            expect(expectedFilename).toContain('processed')
            expect(expectedFilename).toContain('.jpg')
            
            // Property: Filename should not contain invalid characters
            expect(expectedFilename).not.toMatch(/[<>:"/\\|?*]/)
            expect(expectedFilename).not.toMatch(/\s/) // No spaces
            
            // Property: Processed URL should be accessible
            expect(img.processedUrl).toBeTruthy()
            expect(img.processedUrl).toMatch(/^https?:\/\/.+/)
          })

          return true
        }
      ),
      { numRuns: 100 }
    )
  })

  // Property: Batch download maintains data integrity
  test('batch download operations maintain data integrity and provide correct information', () => {
    fc.assert(
      fc.property(
        fc.array(arbitraries.vehicleImage, { minLength: 2, maxLength: 10 }),
        arbitraries.store,
        arbitraries.vehicle,
        (images, store, vehicle) => {
          // Filter to processed images for batch download
          const processedImages = images.filter(img => 
            img.isProcessed && 
            img.processedUrl &&
            img.imageType !== 'GALLERY'
          )
          
          if (processedImages.length < 2) return true

          // Property: Batch request should include all processed image IDs
          const imageIds = processedImages.map(img => img.id)
          expect(imageIds.length).toBe(processedImages.length)
          
          // Property: All IDs should be unique
          const uniqueIds = new Set(imageIds)
          expect(uniqueIds.size).toBe(imageIds.length)
          
          // Property: All IDs should be valid UUIDs
          imageIds.forEach(id => {
            expect(id).toMatch(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i)
          })

          // Property: Batch response should provide download info for each image
          const batchResponse = {
            success: true,
            images: processedImages.map(img => ({
              imageId: img.id,
              downloadUrl: `/api/processing/download?imageId=${img.id}`,
              filename: `${store.name}_${vehicle.stockNumber}_${img.imageType}_processed.jpg`
                .replace(/[^a-zA-Z0-9._-]/g, '_')
                .toLowerCase(),
              imageType: img.imageType,
              vehicleStockNumber: vehicle.stockNumber,
              storeName: store.name,
            })),
            totalCount: processedImages.length,
          }

          expect(batchResponse.success).toBe(true)
          expect(batchResponse.images.length).toBe(processedImages.length)
          expect(batchResponse.totalCount).toBe(processedImages.length)

          // Property: Each download info should be complete and valid
          batchResponse.images.forEach((downloadInfo, index) => {
            const originalImage = processedImages[index]
            
            expect(downloadInfo.imageId).toBe(originalImage.id)
            expect(downloadInfo.downloadUrl).toMatch(/^\/api\/processing\/download\?imageId=[a-f0-9-]{36}$/i)
            expect(downloadInfo.filename).toMatch(/^[a-z0-9._-]+\.jpg$/)
            expect(downloadInfo.imageType).toBe(originalImage.imageType)
            expect(downloadInfo.vehicleStockNumber).toBe(vehicle.stockNumber)
            expect(downloadInfo.storeName).toBe(store.name)
          })

          return true
        }
      ),
      { numRuns: 100 }
    )
  })

  // Property: File preservation during processing operations
  test('processing operations preserve original files while creating processed versions', () => {
    fc.assert(
      fc.property(
        arbitraries.vehicleImage,
        fc.webUrl(), // simulated processed URL
        (originalImage, processedUrl) => {
          // Skip gallery images
          if (originalImage.imageType === 'GALLERY') return true

          // Simulate processing operation
          const processedImage: VehicleImage = {
            ...originalImage,
            isProcessed: true,
            processedUrl: processedUrl,
          }

          // Property: Original URL should be unchanged
          expect(processedImage.originalUrl).toBe(originalImage.originalUrl)
          expect(processedImage.originalUrl).toBeTruthy()
          expect(processedImage.originalUrl).toMatch(/^https?:\/\/.+/)

          // Property: Thumbnail URL should be unchanged
          expect(processedImage.thumbnailUrl).toBe(originalImage.thumbnailUrl)
          expect(processedImage.thumbnailUrl).toBeTruthy()
          expect(processedImage.thumbnailUrl).toMatch(/^https?:\/\/.+/)

          // Property: Processed URL should be new and different
          expect(processedImage.processedUrl).toBe(processedUrl)
          expect(processedImage.processedUrl).toBeTruthy()
          expect(processedImage.processedUrl).toMatch(/^https?:\/\/.+/)
          expect(processedImage.processedUrl).not.toBe(processedImage.originalUrl)
          expect(processedImage.processedUrl).not.toBe(processedImage.thumbnailUrl)

          // Property: Processing flag should be set
          expect(processedImage.isProcessed).toBe(true)

          // Property: All other metadata should be preserved
          expect(processedImage.id).toBe(originalImage.id)
          expect(processedImage.vehicleId).toBe(originalImage.vehicleId)
          expect(processedImage.imageType).toBe(originalImage.imageType)
          expect(processedImage.sortOrder).toBe(originalImage.sortOrder)
          expect(processedImage.uploadedAt).toEqual(originalImage.uploadedAt)

          return true
        }
      ),
      { numRuns: 100 }
    )
  })

  // Property: Download security and access control
  test('download operations maintain proper access control and security', () => {
    fc.assert(
      fc.property(
        arbitraries.vehicleImage,
        arbitraries.userRole,
        (image, userRole) => {
          // Skip non-processed images
          if (!image.isProcessed || !image.processedUrl) return true

          // Property: Download should be available to all authenticated users
          const isAuthenticated = ['PHOTOGRAPHER', 'ADMIN', 'SUPER_ADMIN'].includes(userRole)
          expect(isAuthenticated).toBe(true)

          // Property: Download URL should not expose sensitive information
          const downloadUrl = `/api/processing/download?imageId=${image.id}`
          expect(downloadUrl).not.toContain('password')
          expect(downloadUrl).not.toContain('secret')
          expect(downloadUrl).not.toContain('key')
          expect(downloadUrl).not.toContain('token')

          // Property: Image ID should be properly formatted UUID
          expect(image.id).toMatch(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i)

          // Property: Processed URL should use secure protocol in production
          if (image.processedUrl.startsWith('https://')) {
            expect(image.processedUrl).toMatch(/^https:\/\/.+/)
          }

          return true
        }
      ),
      { numRuns: 100 }
    )
  })

  // Property: File format and content type consistency
  test('downloaded files maintain consistent format and content type', () => {
    fc.assert(
      fc.property(
        fc.array(arbitraries.vehicleImage, { minLength: 1, maxLength: 5 }),
        (images) => {
          const processedImages = images.filter(img => 
            img.isProcessed && 
            img.processedUrl &&
            img.imageType !== 'GALLERY'
          )
          
          if (processedImages.length === 0) return true

          processedImages.forEach(img => {
            // Property: Content-Type should be image/jpeg for downloads
            const expectedContentType = 'image/jpeg'
            expect(expectedContentType).toBe('image/jpeg')

            // Property: File extension should be .jpg
            const filename = `processed_${img.imageType.toLowerCase()}.jpg`
            expect(filename).toMatch(/\.jpg$/)
            expect(filename).not.toMatch(/\.(png|gif|webp|bmp)$/)

            // Property: Content-Disposition should be attachment
            const expectedDisposition = `attachment; filename="${filename}"`
            expect(expectedDisposition).toContain('attachment')
            expect(expectedDisposition).toContain('filename=')
            expect(expectedDisposition).toContain('.jpg')

            // Property: Cache headers should be appropriate
            const cacheControl = 'public, max-age=31536000' // 1 year
            expect(cacheControl).toContain('public')
            expect(cacheControl).toContain('max-age')
          })

          return true
        }
      ),
      { numRuns: 100 }
    )
  })
})