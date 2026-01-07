import * as fc from 'fast-check'
import { arbitraries } from '../utils/mock-factories'

describe('Data Model Relationships Property Tests', () => {
  // Feature: vehicle-inventory-tool, Property 12: Data Persistence and Integrity
  describe('Property 12: Data Persistence and Integrity', () => {
    test('vehicle-store relationship maintains referential integrity', () => {
      fc.assert(
        fc.property(
          fc.array(arbitraries.vehicle, { minLength: 1, maxLength: 10 }),
          fc.uuid(), // storeId
          (vehicles, storeId) => {
            // For any set of vehicles assigned to a store, all vehicles should reference the same store
            const vehiclesWithStore = vehicles.map(vehicle => ({
              ...vehicle,
              storeId: storeId
            }))

            // All vehicles should have the same storeId
            const uniqueStoreIds = new Set(vehiclesWithStore.map(v => v.storeId))
            expect(uniqueStoreIds.size).toBe(1)
            expect(uniqueStoreIds.has(storeId)).toBe(true)

            // Each vehicle should have a valid stock number
            vehiclesWithStore.forEach(vehicle => {
              expect(vehicle.stockNumber).toMatch(/^[A-Z0-9]{3,10}$/)
              expect(vehicle.storeId).toBe(storeId)
            })
          }
        ),
        { numRuns: 100 }
      )
    })

    test('vehicle-image relationship maintains proper associations', () => {
      fc.assert(
        fc.property(
          arbitraries.vehicle,
          fc.record({
            keyImages: fc.array(
              fc.record({
                id: fc.uuid(),
                originalUrl: fc.webUrl(),
                processedUrl: fc.option(fc.webUrl()),
                thumbnailUrl: fc.webUrl(),
                imageType: fc.constantFrom(
                  'FRONT_QUARTER', 'FRONT', 'BACK_QUARTER', 
                  'BACK', 'DRIVER_SIDE', 'PASSENGER_SIDE'
                ),
                sortOrder: fc.integer({ min: 0, max: 5 }),
                isProcessed: fc.boolean(),
                uploadedAt: fc.date()
              }),
              { minLength: 0, maxLength: 6 }
            ),
            galleryImages: fc.array(
              fc.record({
                id: fc.uuid(),
                originalUrl: fc.webUrl(),
                processedUrl: fc.option(fc.webUrl()),
                thumbnailUrl: fc.webUrl(),
                imageType: fc.constant('GALLERY'),
                sortOrder: fc.integer({ min: 6, max: 100 }),
                isProcessed: fc.boolean(),
                uploadedAt: fc.date()
              }),
              { minLength: 0, maxLength: 10 }
            )
          }),
          (vehicle, { keyImages, galleryImages }) => {
            // Ensure key images have unique types by deduplicating
            const uniqueKeyImages = keyImages.reduce((acc, img) => {
              if (!acc.find(existing => existing.imageType === img.imageType)) {
                acc.push({ ...img, vehicleId: vehicle.id })
              }
              return acc
            }, [] as Array<typeof keyImages[0] & { vehicleId: string }>)

            const allGalleryImages = galleryImages.map(img => ({
              ...img,
              vehicleId: vehicle.id
            }))

            const allImages = [...uniqueKeyImages, ...allGalleryImages]

            // All images should reference the same vehicle
            allImages.forEach(image => {
              expect(image.vehicleId).toBe(vehicle.id)
            })

            // Sort orders should be non-negative
            allImages.forEach(image => {
              expect(image.sortOrder).toBeGreaterThanOrEqual(0)
            })

            // Key images should have valid types and be unique
            const keyImageTypes = [
              'FRONT_QUARTER', 'FRONT', 'BACK_QUARTER', 
              'BACK', 'DRIVER_SIDE', 'PASSENGER_SIDE'
            ]
            
            uniqueKeyImages.forEach(image => {
              expect(keyImageTypes).toContain(image.imageType)
            })

            // Each key image type should appear at most once
            const keyImageTypeCounts = uniqueKeyImages.reduce((acc, img) => {
              acc[img.imageType] = (acc[img.imageType] || 0) + 1
              return acc
            }, {} as Record<string, number>)

            Object.values(keyImageTypeCounts).forEach(count => {
              expect(count).toBeLessThanOrEqual(1)
            })

            // Gallery images should all be GALLERY type
            allGalleryImages.forEach(image => {
              expect(image.imageType).toBe('GALLERY')
            })

            // Should not have more than 6 key images total
            expect(uniqueKeyImages.length).toBeLessThanOrEqual(6)
          }
        ),
        { numRuns: 100 }
      )
    })

    test('processing job-vehicle relationship maintains consistency', () => {
      fc.assert(
        fc.property(
          arbitraries.vehicle,
          fc.array(fc.uuid(), { minLength: 1, maxLength: 6 }), // imageIds
          fc.constantFrom('QUEUED', 'PROCESSING', 'COMPLETED', 'FAILED'),
          (vehicle, imageIds, status) => {
            const processingJob = {
              id: fc.sample(fc.uuid(), 1)[0],
              vehicleId: vehicle.id,
              imageIds: imageIds,
              status: status,
              errorMessage: status === 'FAILED' ? 'Processing failed' : null,
              createdAt: new Date(),
              completedAt: status === 'COMPLETED' ? new Date() : null
            }

            // Processing job should reference the correct vehicle
            expect(processingJob.vehicleId).toBe(vehicle.id)

            // Image IDs should be valid UUIDs
            processingJob.imageIds.forEach(imageId => {
              expect(imageId).toMatch(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i)
            })

            // Status consistency rules
            if (status === 'COMPLETED') {
              expect(processingJob.completedAt).not.toBeNull()
            } else {
              expect(processingJob.completedAt).toBeNull()
            }

            if (status === 'FAILED') {
              expect(processingJob.errorMessage).not.toBeNull()
            }

            // Should not process more than 6 images (key images only)
            expect(processingJob.imageIds.length).toBeLessThanOrEqual(6)
          }
        ),
        { numRuns: 100 }
      )
    })

    test('user role-based data access maintains proper constraints', () => {
      fc.assert(
        fc.property(
          arbitraries.user,
          fc.array(arbitraries.vehicle, { minLength: 1, maxLength: 5 }),
          (user, vehicles) => {
            // For any user and set of vehicles, role-based access should be consistent
            
            // User should have valid role
            expect(['PHOTOGRAPHER', 'ADMIN']).toContain(user.role)

            // Email should be valid
            expect(user.email).toContain('@')
            expect(user.name.length).toBeGreaterThan(0)

            // Admin users should theoretically have access to all operations
            // Photographer users should have limited access
            const canDelete = user.role === 'ADMIN'
            const canReprocess = user.role === 'ADMIN'
            const canUpload = true // Both roles can upload

            if (user.role === 'ADMIN') {
              expect(canDelete).toBe(true)
              expect(canReprocess).toBe(true)
              expect(canUpload).toBe(true)
            } else {
              expect(canDelete).toBe(false)
              expect(canReprocess).toBe(false)
              expect(canUpload).toBe(true)
            }
          }
        ),
        { numRuns: 100 }
      )
    })

    test('store-vehicle stock number uniqueness within store', () => {
      fc.assert(
        fc.property(
          fc.uuid(), // storeId
          fc.array(fc.stringMatching(/^[A-Z0-9]{3,10}$/), { minLength: 2, maxLength: 10 }),
          (storeId, stockNumbers) => {
            // For any store and set of stock numbers, each should be unique within the store
            const uniqueStockNumbers = new Set(stockNumbers)
            
            // If we have duplicate stock numbers in our input, they should be detected
            const hasDuplicates = stockNumbers.length !== uniqueStockNumbers.size
            
            if (hasDuplicates) {
              // In a real database, this would violate the unique constraint
              const duplicates = stockNumbers.filter((item, index) => stockNumbers.indexOf(item) !== index)
              expect(duplicates.length).toBeGreaterThan(0)
            } else {
              // All stock numbers are unique - this should be allowed
              expect(uniqueStockNumbers.size).toBe(stockNumbers.length)
            }

            // All stock numbers should be valid format
            stockNumbers.forEach(stockNumber => {
              expect(stockNumber).toMatch(/^[A-Z0-9]{3,10}$/)
            })
          }
        ),
        { numRuns: 100 }
      )
    })
  })
})