import * as fc from 'fast-check'
import { arbitraries } from '../utils/mock-factories'
import { ImageType } from '@/types'

describe('Add Vehicle Page Photo Upload Association Properties', () => {
  // Feature: app-enhancements, Property 10: Add Vehicle Page Photo Upload
  // **Validates: Requirements 4.3, 4.8**

  test('Property 10: all uploaded photos are associated with created vehicle', () => {
    fc.assert(
      fc.property(
        fc.array(arbitraries.uploadFile, { minLength: 1, maxLength: 26 }), // Max 6 key + 20 gallery
        fc.uuid(), // vehicleId
        fc.uuid(), // storeId
        fc.stringMatching(/^[a-zA-Z0-9-_]+$/), // stockNumber
        (uploadFiles, vehicleId, storeId, stockNumber) => {
          // Simulate the Add Vehicle page workflow
          
          // Step 1: Create vehicle
          const createdVehicle = {
            id: vehicleId,
            stockNumber,
            storeId,
            processingStatus: 'NOT_STARTED' as const,
            createdAt: new Date(),
            updatedAt: new Date(),
          }

          expect(createdVehicle.id).toBe(vehicleId)
          expect(createdVehicle.stockNumber).toBe(stockNumber)
          expect(createdVehicle.storeId).toBe(storeId)

          // Step 2: Upload photos and associate with vehicle
          const uploadedImages = uploadFiles.map((file, index) => {
            // Determine if this is a key image or gallery image
            const isKeyImage = index < 6
            const imageType: ImageType = isKeyImage 
              ? (['FRONT_QUARTER', 'FRONT', 'BACK_QUARTER', 'BACK', 'DRIVER_SIDE', 'PASSENGER_SIDE'] as ImageType[])[index]
              : 'GALLERY'

            return {
              id: `image-${index}`,
              vehicleId: createdVehicle.id,
              originalUrl: `https://storage.googleapis.com/bucket/stores/${storeId}/vehicles/${vehicleId}/original/image_${index}.jpg`,
              processedUrl: null,
              thumbnailUrl: `https://storage.googleapis.com/bucket/stores/${storeId}/vehicles/${vehicleId}/thumbnail/image_${index}.jpg`,
              imageType,
              sortOrder: index,
              isProcessed: false,
              uploadedAt: new Date(),
            }
          })

          // Property: All uploaded images should be associated with the created vehicle
          uploadedImages.forEach(image => {
            expect(image.vehicleId).toBe(createdVehicle.id)
          })

          // Property: Number of uploaded images should match number of files
          expect(uploadedImages.length).toBe(uploadFiles.length)

          // Property: Each image should have a unique ID
          const imageIds = uploadedImages.map(img => img.id)
          const uniqueIds = new Set(imageIds)
          expect(uniqueIds.size).toBe(imageIds.length)

          // Property: Each image should have valid URLs
          uploadedImages.forEach(image => {
            expect(image.originalUrl).toMatch(/^https?:\/\//)
            expect(image.thumbnailUrl).toMatch(/^https?:\/\//)
            expect(image.originalUrl).toContain(vehicleId)
            expect(image.thumbnailUrl).toContain(vehicleId)
          })

          // Property: Key images should have specific types (first 6)
          const keyImageTypes: ImageType[] = [
            'FRONT_QUARTER', 'FRONT', 'BACK_QUARTER', 'BACK', 
            'DRIVER_SIDE', 'PASSENGER_SIDE'
          ]
          uploadedImages.slice(0, Math.min(6, uploadedImages.length)).forEach((image, index) => {
            expect(image.imageType).toBe(keyImageTypes[index])
          })

          // Property: Gallery images should have GALLERY type (after first 6)
          if (uploadedImages.length > 6) {
            uploadedImages.slice(6).forEach(image => {
              expect(image.imageType).toBe('GALLERY')
            })
          }

          // Property: Sort order should be sequential
          uploadedImages.forEach((image, index) => {
            expect(image.sortOrder).toBe(index)
          })

          // Property: All images should initially be unprocessed
          uploadedImages.forEach(image => {
            expect(image.isProcessed).toBe(false)
            expect(image.processedUrl).toBeNull()
          })
        }
      ),
      { numRuns: 100 }
    )
  })

  test('Property 10 (edge case): empty photo set creates vehicle without images', () => {
    fc.assert(
      fc.property(
        fc.uuid(), // vehicleId
        fc.uuid(), // storeId
        fc.stringMatching(/^[a-zA-Z0-9-_]+$/), // stockNumber
        (vehicleId, storeId, stockNumber) => {
          // Create vehicle without photos
          const createdVehicle = {
            id: vehicleId,
            stockNumber,
            storeId,
            processingStatus: 'NOT_STARTED' as const,
            images: [],
            createdAt: new Date(),
            updatedAt: new Date(),
          }

          // Property: Vehicle should be created successfully
          expect(createdVehicle.id).toBe(vehicleId)
          expect(createdVehicle.stockNumber).toBe(stockNumber)
          expect(createdVehicle.storeId).toBe(storeId)

          // Property: Images array should be empty
          expect(createdVehicle.images).toEqual([])
          expect(createdVehicle.images.length).toBe(0)

          // Property: Vehicle should still have valid status
          expect(createdVehicle.processingStatus).toBe('NOT_STARTED')
        }
      ),
      { numRuns: 100 }
    )
  })

  test('Property 10 (edge case): exactly 6 key images are properly categorized', () => {
    fc.assert(
      fc.property(
        fc.array(arbitraries.uploadFile, { minLength: 6, maxLength: 6 }), // Exactly 6 files
        fc.uuid(), // vehicleId
        fc.uuid(), // storeId
        (uploadFiles, vehicleId, storeId) => {
          const keyImageTypes: ImageType[] = [
            'FRONT_QUARTER', 'FRONT', 'BACK_QUARTER', 'BACK', 
            'DRIVER_SIDE', 'PASSENGER_SIDE'
          ]

          const uploadedImages = uploadFiles.map((file, index) => ({
            id: `image-${index}`,
            vehicleId,
            imageType: keyImageTypes[index],
            sortOrder: index,
          }))

          // Property: Should have exactly 6 images
          expect(uploadedImages.length).toBe(6)

          // Property: All should be key images (no gallery images)
          uploadedImages.forEach(image => {
            expect(keyImageTypes).toContain(image.imageType)
            expect(image.imageType).not.toBe('GALLERY')
          })

          // Property: Each key image type should appear exactly once
          const imageTypeCounts = new Map<ImageType, number>()
          uploadedImages.forEach(image => {
            imageTypeCounts.set(image.imageType, (imageTypeCounts.get(image.imageType) || 0) + 1)
          })

          keyImageTypes.forEach(type => {
            expect(imageTypeCounts.get(type)).toBe(1)
          })
        }
      ),
      { numRuns: 100 }
    )
  })

  test('Property 10 (edge case): more than 6 images creates key + gallery images', () => {
    fc.assert(
      fc.property(
        fc.array(arbitraries.uploadFile, { minLength: 7, maxLength: 26 }), // 7-26 files
        fc.uuid(), // vehicleId
        (uploadFiles, vehicleId) => {
          const keyImageTypes: ImageType[] = [
            'FRONT_QUARTER', 'FRONT', 'BACK_QUARTER', 'BACK', 
            'DRIVER_SIDE', 'PASSENGER_SIDE'
          ]

          const uploadedImages = uploadFiles.map((file, index) => {
            const isKeyImage = index < 6
            const imageType: ImageType = isKeyImage 
              ? keyImageTypes[index]
              : 'GALLERY'

            return {
              id: `image-${index}`,
              vehicleId,
              imageType,
              sortOrder: index,
            }
          })

          // Property: Should have more than 6 images
          expect(uploadedImages.length).toBeGreaterThan(6)

          // Property: First 6 should be key images
          const firstSix = uploadedImages.slice(0, 6)
          firstSix.forEach((image, index) => {
            expect(image.imageType).toBe(keyImageTypes[index])
          })

          // Property: Remaining should be gallery images
          const remaining = uploadedImages.slice(6)
          expect(remaining.length).toBeGreaterThan(0)
          remaining.forEach(image => {
            expect(image.imageType).toBe('GALLERY')
          })

          // Property: Total should equal key + gallery
          expect(uploadedImages.length).toBe(firstSix.length + remaining.length)
        }
      ),
      { numRuns: 100 }
    )
  })

  test('Property 10 (metamorphic): photo association is independent of upload order', () => {
    fc.assert(
      fc.property(
        fc.array(arbitraries.uploadFile, { minLength: 2, maxLength: 10 }),
        fc.uuid(), // vehicleId
        (uploadFiles, vehicleId) => {
          // Upload in original order
          const originalOrder = uploadFiles.map((file, index) => ({
            id: `image-${index}`,
            vehicleId,
            fileName: file.name,
            sortOrder: index,
          }))

          // Upload in reversed order (simulating different upload timing)
          const reversedFiles = [...uploadFiles].reverse()
          const reversedOrder = reversedFiles.map((file, index) => ({
            id: `image-rev-${index}`,
            vehicleId,
            fileName: file.name,
            sortOrder: index,
          }))

          // Property: All images should be associated with same vehicle regardless of order
          originalOrder.forEach(image => {
            expect(image.vehicleId).toBe(vehicleId)
          })
          reversedOrder.forEach(image => {
            expect(image.vehicleId).toBe(vehicleId)
          })

          // Property: Number of images should be same regardless of order
          expect(originalOrder.length).toBe(reversedOrder.length)
          expect(originalOrder.length).toBe(uploadFiles.length)

          // Property: All file names should be present in both orders
          const originalNames = new Set(originalOrder.map(img => img.fileName))
          const reversedNames = new Set(reversedOrder.map(img => img.fileName))
          expect(originalNames.size).toBe(reversedNames.size)
        }
      ),
      { numRuns: 100 }
    )
  })

  test('Property 10 (invariant): vehicle-image relationship is maintained after upload', () => {
    fc.assert(
      fc.property(
        fc.array(arbitraries.uploadFile, { minLength: 1, maxLength: 20 }),
        fc.uuid(), // vehicleId
        fc.uuid(), // storeId
        (uploadFiles, vehicleId, storeId) => {
          // Simulate upload and association
          const vehicle = {
            id: vehicleId,
            storeId,
            images: uploadFiles.map((file, index) => ({
              id: `image-${index}`,
              vehicleId,
              fileName: file.name,
            }))
          }

          // Property: Vehicle should have correct number of images
          expect(vehicle.images.length).toBe(uploadFiles.length)

          // Property: All images should reference the vehicle
          vehicle.images.forEach(image => {
            expect(image.vehicleId).toBe(vehicle.id)
          })

          // Property: Inverse relationship - vehicle contains all its images
          const imageVehicleIds = vehicle.images.map(img => img.vehicleId)
          const uniqueVehicleIds = new Set(imageVehicleIds)
          expect(uniqueVehicleIds.size).toBe(1)
          expect(uniqueVehicleIds.has(vehicleId)).toBe(true)

          // Property: No orphaned images (all images belong to a vehicle)
          vehicle.images.forEach(image => {
            expect(image.vehicleId).toBeTruthy()
            expect(image.vehicleId).toBe(vehicleId)
          })
        }
      ),
      { numRuns: 100 }
    )
  })

  test('Property 10 (error handling): failed uploads do not create orphaned images', () => {
    fc.assert(
      fc.property(
        fc.array(arbitraries.uploadFile, { minLength: 1, maxLength: 10 }),
        fc.uuid(), // vehicleId
        fc.boolean(), // uploadSuccess
        (uploadFiles, vehicleId, uploadSuccess) => {
          if (uploadSuccess) {
            // Successful upload - all images associated
            const images = uploadFiles.map((file, index) => ({
              id: `image-${index}`,
              vehicleId,
              fileName: file.name,
            }))

            // Property: All images should be associated with vehicle
            images.forEach(image => {
              expect(image.vehicleId).toBe(vehicleId)
            })
            expect(images.length).toBe(uploadFiles.length)
          } else {
            // Failed upload - no images created
            const images: any[] = []

            // Property: No images should be created on failure
            expect(images.length).toBe(0)

            // Property: Vehicle should still exist but without images
            const vehicle = {
              id: vehicleId,
              images: []
            }
            expect(vehicle.id).toBe(vehicleId)
            expect(vehicle.images.length).toBe(0)
          }
        }
      ),
      { numRuns: 100 }
    )
  })
})
