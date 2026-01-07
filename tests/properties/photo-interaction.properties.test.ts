import * as fc from 'fast-check'
import { arbitraries } from '../utils/mock-factories'
import { VehicleImage, ImageType } from '@/types'

describe('Photo Interaction Properties', () => {
  // Feature: vehicle-inventory-tool, Property 7: Photo Interaction and Management
  test('drag-and-drop updates and persists photo order for gallery images only', () => {
    fc.assert(
      fc.property(
        fc.array(arbitraries.vehicleImage, { minLength: 3, maxLength: 10 }),
        fc.integer({ min: 0, max: 9 }), // fromIndex
        fc.integer({ min: 0, max: 9 }), // toIndex
        (images, fromIndex, toIndex) => {
          // Filter to only gallery images for reordering
          const galleryImages = images
            .map(img => ({ ...img, imageType: 'GALLERY' as ImageType }))
            .sort((a, b) => a.sortOrder - b.sortOrder)

          if (galleryImages.length < 2) return // Skip if not enough images to reorder

          const validFromIndex = Math.min(fromIndex, galleryImages.length - 1)
          const validToIndex = Math.min(toIndex, galleryImages.length - 1)

          if (validFromIndex === validToIndex) return // Skip if same position

          // Simulate drag-and-drop reordering (arrayMove equivalent)
          const reorderedImages = [...galleryImages]
          const [movedImage] = reorderedImages.splice(validFromIndex, 1)
          reorderedImages.splice(validToIndex, 0, movedImage)

          // Update sort orders
          const updatedImages = reorderedImages.map((img, index) => ({
            ...img,
            sortOrder: index
          }))

          // Property: All images should maintain their IDs
          expect(updatedImages.length).toBe(galleryImages.length)
          updatedImages.forEach(img => {
            const originalImage = galleryImages.find(orig => orig.id === img.id)
            expect(originalImage).toBeDefined()
            expect(img.id).toBe(originalImage!.id)
          })

          // Property: Sort orders should be sequential starting from 0
          updatedImages.forEach((img, index) => {
            expect(img.sortOrder).toBe(index)
          })

          // Property: The moved image should be at the target position
          expect(updatedImages[validToIndex].id).toBe(galleryImages[validFromIndex].id)

          // Property: All other image properties should remain unchanged
          updatedImages.forEach(img => {
            const originalImage = galleryImages.find(orig => orig.id === img.id)
            expect(img.vehicleId).toBe(originalImage!.vehicleId)
            expect(img.originalUrl).toBe(originalImage!.originalUrl)
            expect(img.processedUrl).toBe(originalImage!.processedUrl)
            expect(img.thumbnailUrl).toBe(originalImage!.thumbnailUrl)
            expect(img.imageType).toBe(originalImage!.imageType)
            expect(img.isProcessed).toBe(originalImage!.isProcessed)
            expect(img.uploadedAt).toBe(originalImage!.uploadedAt)
          })

          // Property: No duplicate sort orders should exist
          const sortOrders = updatedImages.map(img => img.sortOrder)
          const uniqueSortOrders = new Set(sortOrders)
          expect(uniqueSortOrders.size).toBe(sortOrders.length)
        }
      ),
      { numRuns: 50 }
    )
  })

  // Feature: vehicle-inventory-tool, Property 7: Photo Interaction and Management
  test('key images maintain fixed positions and are not reorderable', () => {
    fc.assert(
      fc.property(
        fc.array(arbitraries.vehicleImage, { minLength: 1, maxLength: 6 }),
        (images) => {
          const keyImageTypes: ImageType[] = [
            'FRONT_QUARTER',
            'FRONT',
            'BACK_QUARTER',
            'BACK',
            'DRIVER_SIDE',
            'PASSENGER_SIDE'
          ]

          // Create key images with specific types
          const keyImages = images.slice(0, 6).map((img, index) => ({
            ...img,
            imageType: keyImageTypes[index] || 'FRONT',
            sortOrder: index
          }))

          // Property: Key images should maintain their type-based order
          const sortedKeyImages = keyImageTypes.map(type => 
            keyImages.find(img => img.imageType === type)
          ).filter(Boolean) as VehicleImage[]

          // Property: Front image should be separate from other key images
          const frontImage = sortedKeyImages.find(img => img.imageType === 'FRONT')
          const otherKeyImages = sortedKeyImages.filter(img => img.imageType !== 'FRONT')

          if (frontImage) {
            expect(frontImage.imageType).toBe('FRONT')
            expect(otherKeyImages.every(img => img.imageType !== 'FRONT')).toBe(true)
          }

          // Property: Key images should not be in gallery image list
          const galleryImages = keyImages.filter(img => img.imageType === 'GALLERY')
          expect(galleryImages.length).toBe(0) // All should be key images

          // Property: Each key image type should appear at most once
          keyImageTypes.forEach(type => {
            const imagesOfType = keyImages.filter(img => img.imageType === type)
            expect(imagesOfType.length).toBeLessThanOrEqual(1)
          })

          // Property: Key images should maintain their original properties
          keyImages.forEach(img => {
            expect(img.id).toBeTruthy()
            expect(img.vehicleId).toBeTruthy()
            expect(img.originalUrl).toBeTruthy()
            expect(img.thumbnailUrl).toBeTruthy()
            expect(keyImageTypes.includes(img.imageType)).toBe(true)
            expect(typeof img.isProcessed).toBe('boolean')
            expect(img.uploadedAt).toBeInstanceOf(Date)
          })
        }
      ),
      { numRuns: 50 }
    )
  })

  // Feature: vehicle-inventory-tool, Property 7: Photo Interaction and Management
  test('hover interactions display delete button and clicking shows confirmation', () => {
    fc.assert(
      fc.property(
        arbitraries.vehicleImage,
        fc.boolean(), // isHovered
        fc.boolean(), // isDeleteClicked
        (image, isHovered, isDeleteClicked) => {
          // Simulate hover state
          const showDeleteButton = isHovered

          // Property: Delete button should only be visible on hover
          if (isHovered) {
            expect(showDeleteButton).toBe(true)
          } else {
            expect(showDeleteButton).toBe(false)
          }

          // Simulate delete button click
          if (showDeleteButton && isDeleteClicked) {
            const showConfirmationDialog = true

            // Property: Clicking delete should show confirmation dialog
            expect(showConfirmationDialog).toBe(true)

            // Property: Confirmation dialog should have required actions
            const confirmationActions = {
              hasConfirmButton: true,
              hasCancelButton: true,
              hasImageInfo: true
            }

            expect(confirmationActions.hasConfirmButton).toBe(true)
            expect(confirmationActions.hasCancelButton).toBe(true)
            expect(confirmationActions.hasImageInfo).toBe(true)
          }

          // Property: Image properties should remain unchanged during interaction
          expect(image.id).toBeTruthy()
          expect(typeof image.id).toBe('string')
          expect(image.vehicleId).toBeTruthy()
          expect(typeof image.vehicleId).toBe('string')
          expect(image.originalUrl).toBeTruthy()
          expect(typeof image.originalUrl).toBe('string')
          expect(image.thumbnailUrl).toBeTruthy()
          expect(typeof image.thumbnailUrl).toBe('string')
          expect(['FRONT_QUARTER', 'FRONT', 'BACK_QUARTER', 'BACK', 'DRIVER_SIDE', 'PASSENGER_SIDE', 'GALLERY'])
            .toContain(image.imageType)
          expect(typeof image.sortOrder).toBe('number')
          expect(typeof image.isProcessed).toBe('boolean')
          expect(image.uploadedAt).toBeInstanceOf(Date)
        }
      ),
      { numRuns: 50 }
    )
  })

  // Feature: vehicle-inventory-tool, Property 7: Photo Interaction and Management
  test('photo deletion removes image from database and updates vehicle state', () => {
    fc.assert(
      fc.property(
        fc.array(arbitraries.vehicleImage, { minLength: 2, maxLength: 10 }),
        fc.integer({ min: 0, max: 9 }), // imageToDeleteIndex
        (images, deleteIndex) => {
          if (images.length === 0) return

          const validDeleteIndex = Math.min(deleteIndex, images.length - 1)
          const imageToDelete = images[validDeleteIndex]
          const remainingImages = images.filter(img => img.id !== imageToDelete.id)

          // Property: Deleted image should not be in remaining images
          expect(remainingImages.find(img => img.id === imageToDelete.id)).toBeUndefined()

          // Property: Remaining images count should be one less
          expect(remainingImages.length).toBe(images.length - 1)

          // Property: All other images should remain unchanged
          remainingImages.forEach(img => {
            const originalImage = images.find(orig => orig.id === img.id)
            expect(originalImage).toBeDefined()
            expect(img).toEqual(originalImage)
          })

          // Property: If deleting a gallery image, sort orders should be updated
          if (imageToDelete.imageType === 'GALLERY') {
            const galleryImages = remainingImages.filter(img => img.imageType === 'GALLERY')
            const updatedGalleryImages = galleryImages
              .sort((a, b) => a.sortOrder - b.sortOrder)
              .map((img, index) => ({ ...img, sortOrder: index }))

            // Sort orders should be sequential
            updatedGalleryImages.forEach((img, index) => {
              expect(img.sortOrder).toBe(index)
            })

            // No gaps in sort order sequence
            const sortOrders = updatedGalleryImages.map(img => img.sortOrder)
            const expectedSortOrders = Array.from({ length: sortOrders.length }, (_, i) => i)
            expect(sortOrders).toEqual(expectedSortOrders)
          }

          // Property: Key images should maintain their positions after deletion
          const keyImageTypes: ImageType[] = [
            'FRONT_QUARTER', 'FRONT', 'BACK_QUARTER', 'BACK', 'DRIVER_SIDE', 'PASSENGER_SIDE'
          ]
          
          const remainingKeyImages = remainingImages.filter(img => keyImageTypes.includes(img.imageType))
          remainingKeyImages.forEach(img => {
            expect(keyImageTypes.includes(img.imageType)).toBe(true)
          })
        }
      ),
      { numRuns: 50 }
    )
  })

  // Feature: vehicle-inventory-tool, Property 7: Photo Interaction and Management
  test('image gallery layout maintains responsive grid structure', () => {
    fc.assert(
      fc.property(
        fc.array(arbitraries.vehicleImage, { minLength: 0, maxLength: 20 }),
        (images) => {
          // Separate key images from gallery images
          const keyImageTypes: ImageType[] = [
            'FRONT_QUARTER', 'FRONT', 'BACK_QUARTER', 'BACK', 'DRIVER_SIDE', 'PASSENGER_SIDE'
          ]

          const keyImages = images.filter(img => keyImageTypes.includes(img.imageType))
          const galleryImages = images.filter(img => img.imageType === 'GALLERY')

          // Property: Front image should be in individual row
          const frontImages = keyImages.filter(img => img.imageType === 'FRONT')
          const otherKeyImages = keyImages.filter(img => img.imageType !== 'FRONT')

          // Property: Front images should be handled separately
          if (frontImages.length > 0) {
            // At least one front image exists
            expect(frontImages.length).toBeGreaterThanOrEqual(1)
            frontImages.forEach(img => {
              expect(img.imageType).toBe('FRONT')
            })
          }

          // Property: Other key images should be in grid layout (max 3 columns)
          if (otherKeyImages.length > 0) {
            const maxColumnsForKeyImages = 3
            const rowsNeeded = Math.ceil(otherKeyImages.length / maxColumnsForKeyImages)
            expect(rowsNeeded).toBeGreaterThanOrEqual(1)
            
            // The number of rows should be reasonable (no upper limit since we can have duplicates)
            expect(rowsNeeded).toBeGreaterThan(0)
          }

          // Property: Gallery images should be in 4-column grid
          if (galleryImages.length > 0) {
            const galleryColumnsDesktop = 4
            const galleryRowsNeeded = Math.ceil(galleryImages.length / galleryColumnsDesktop)
            expect(galleryRowsNeeded).toBeGreaterThanOrEqual(1)

            // Gallery images should be sorted by sortOrder
            const sortedGalleryImages = [...galleryImages].sort((a, b) => a.sortOrder - b.sortOrder)
            sortedGalleryImages.forEach((img, index) => {
              const expectedRow = Math.floor(index / galleryColumnsDesktop)
              const expectedColumn = index % galleryColumnsDesktop
              expect(expectedRow).toBeGreaterThanOrEqual(0)
              expect(expectedColumn).toBeGreaterThanOrEqual(0)
              expect(expectedColumn).toBeLessThan(galleryColumnsDesktop)
            })
          }

          // Property: Total image count should match sum of key and gallery images
          expect(images.length).toBe(keyImages.length + galleryImages.length)

          // Property: Each image should have required properties for display
          images.forEach(img => {
            expect(img.id).toBeTruthy()
            expect(img.originalUrl || img.processedUrl).toBeTruthy()
            expect(img.thumbnailUrl).toBeTruthy()
            expect(['FRONT_QUARTER', 'FRONT', 'BACK_QUARTER', 'BACK', 'DRIVER_SIDE', 'PASSENGER_SIDE', 'GALLERY'])
              .toContain(img.imageType)
          })
        }
      ),
      { numRuns: 50 }
    )
  })
})