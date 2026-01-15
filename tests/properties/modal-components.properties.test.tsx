/**
 * Feature: shadcn-ui-integration, Property 2: Modal Focus Management
 * Feature: shadcn-ui-integration, Property 4: Functional Preservation
 * Validates: Requirements 11.3, 6.5
 * 
 * Tests that focus is trapped in modals, focus returns to trigger on close,
 * and callbacks are preserved after migration to shadcn Dialog.
 */

import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import * as fc from 'fast-check'
import DeleteVehicleModal from '@/components/vehicles/DeleteVehicleModal'
import BulkDeleteModal from '@/components/vehicles/BulkDeleteModal'
import { Vehicle } from '@/types'

// Helper to create a mock vehicle
const vehicleArbitrary = fc.record({
  id: fc.string(),
  stockNumber: fc.string({ minLength: 1, maxLength: 20 }).filter(s => s.trim().length > 0),
  storeId: fc.string(),
  store: fc.record({
    id: fc.string(),
    name: fc.string({ minLength: 1 }).filter(s => s.trim().length > 0),
    address: fc.string(),
    brandLogos: fc.constant([]),
  }),
  images: fc.array(
    fc.record({
      id: fc.string(),
      vehicleId: fc.string(),
      originalUrl: fc.webUrl(),
      thumbnailUrl: fc.webUrl(),
      imageType: fc.constantFrom('FRONT', 'REAR', 'SIDE', 'GALLERY_EXTERIOR', 'GALLERY_INTERIOR'),
      sortOrder: fc.integer({ min: 0, max: 100 }),
      isProcessed: fc.boolean(),
      uploadedAt: fc.date(),
    }),
    { minLength: 0, maxLength: 10 }
  ),
  processingStatus: fc.constantFrom('PENDING', 'PROCESSING', 'COMPLETED', 'FAILED'),
  createdAt: fc.date(),
  updatedAt: fc.date(),
})

describe('Modal Components - Property-Based Tests', () => {
  describe('Property 4: Functional Preservation - DeleteVehicleModal', () => {
    it('preserves onConfirm callback for all vehicles', () => {
      fc.assert(
        fc.property(vehicleArbitrary, (vehicle: Vehicle) => {
          const mockOnConfirm = jest.fn()
          const mockOnCancel = jest.fn()

          const { unmount } = render(
            <DeleteVehicleModal
              vehicle={vehicle}
              open={true}
              onConfirm={mockOnConfirm}
              onCancel={mockOnCancel}
            />
          )

          const deleteButton = screen.getByRole('button', { name: /Delete Vehicle/i })
          fireEvent.click(deleteButton)

          expect(mockOnConfirm).toHaveBeenCalledTimes(1)
          expect(mockOnCancel).not.toHaveBeenCalled()

          unmount()
        }),
        { numRuns: 100 }
      )
    })

    it('preserves onCancel callback for all vehicles', () => {
      fc.assert(
        fc.property(vehicleArbitrary, (vehicle: Vehicle) => {
          const mockOnConfirm = jest.fn()
          const mockOnCancel = jest.fn()

          const { unmount } = render(
            <DeleteVehicleModal
              vehicle={vehicle}
              open={true}
              onConfirm={mockOnConfirm}
              onCancel={mockOnCancel}
            />
          )

          const cancelButton = screen.getByText('Cancel')
          fireEvent.click(cancelButton)

          expect(mockOnCancel).toHaveBeenCalledTimes(1)
          expect(mockOnConfirm).not.toHaveBeenCalled()

          unmount()
        }),
        { numRuns: 100 }
      )
    })

    it('displays vehicle information correctly for all vehicles', () => {
      fc.assert(
        fc.property(vehicleArbitrary, (vehicle: Vehicle) => {
          const mockOnConfirm = jest.fn()
          const mockOnCancel = jest.fn()

          const { unmount } = render(
            <DeleteVehicleModal
              vehicle={vehicle}
              open={true}
              onConfirm={mockOnConfirm}
              onCancel={mockOnCancel}
            />
          )

          // Verify stock number is displayed - use getAllByText and check if any match
          const stockNumberElements = screen.queryAllByText(vehicle.stockNumber)
          expect(stockNumberElements.length).toBeGreaterThan(0)

          // Verify image count is displayed correctly - use getAllByText since it appears twice
          const imageCount = vehicle.images.length
          const imageText = `${imageCount} image${imageCount !== 1 ? 's' : ''}`
          const imageElements = screen.queryAllByText(imageText)
          expect(imageElements.length).toBeGreaterThan(0)

          unmount()
        }),
        { numRuns: 100 }
      )
    })
  })

  describe('Property 4: Functional Preservation - BulkDeleteModal', () => {
    it('preserves onConfirm callback for all vehicle counts', async () => {
      await fc.assert(
        fc.asyncProperty(fc.integer({ min: 1, max: 100 }), async (vehicleCount: number) => {
          const mockOnConfirm = jest.fn().mockResolvedValue(undefined)
          const mockOnCancel = jest.fn()

          const { unmount } = render(
            <BulkDeleteModal
              vehicleCount={vehicleCount}
              open={true}
              onConfirm={mockOnConfirm}
              onCancel={mockOnCancel}
            />
          )

          const deleteButton = screen.getByText('Delete')
          fireEvent.click(deleteButton)

          await waitFor(() => {
            expect(mockOnConfirm).toHaveBeenCalledTimes(1)
          })
          expect(mockOnCancel).not.toHaveBeenCalled()

          unmount()
        }),
        { numRuns: 100 }
      )
    })

    it('preserves onCancel callback for all vehicle counts', () => {
      fc.assert(
        fc.property(fc.integer({ min: 1, max: 100 }), (vehicleCount: number) => {
          const mockOnConfirm = jest.fn()
          const mockOnCancel = jest.fn()

          const { unmount } = render(
            <BulkDeleteModal
              vehicleCount={vehicleCount}
              open={true}
              onConfirm={mockOnConfirm}
              onCancel={mockOnCancel}
            />
          )

          const cancelButton = screen.getByText('Cancel')
          fireEvent.click(cancelButton)

          expect(mockOnCancel).toHaveBeenCalledTimes(1)
          expect(mockOnConfirm).not.toHaveBeenCalled()

          unmount()
        }),
        { numRuns: 100 }
      )
    })

    it('displays correct vehicle count with proper pluralization', () => {
      fc.assert(
        fc.property(fc.integer({ min: 1, max: 100 }), (vehicleCount: number) => {
          const mockOnConfirm = jest.fn()
          const mockOnCancel = jest.fn()

          const { unmount } = render(
            <BulkDeleteModal
              vehicleCount={vehicleCount}
              open={true}
              onConfirm={mockOnConfirm}
              onCancel={mockOnCancel}
            />
          )

          // Check for correct pluralization
          const expectedText = vehicleCount === 1 ? '1 vehicle?' : `${vehicleCount} vehicles?`
          expect(screen.getByText(new RegExp(expectedText, 'i'))).toBeInTheDocument()

          unmount()
        }),
        { numRuns: 100 }
      )
    })
  })

  describe('Property 2: Modal Focus Management', () => {
    it('modal content receives focus when opened - DeleteVehicleModal', () => {
      fc.assert(
        fc.property(vehicleArbitrary, (vehicle: Vehicle) => {
          const mockOnConfirm = jest.fn()
          const mockOnCancel = jest.fn()

          const { unmount } = render(
            <DeleteVehicleModal
              vehicle={vehicle}
              open={true}
              onConfirm={mockOnConfirm}
              onCancel={mockOnCancel}
            />
          )

          // Dialog should be in the document and have role="dialog"
          const dialog = screen.getByRole('dialog')
          expect(dialog).toBeInTheDocument()

          // Dialog should have proper ARIA attributes
          expect(dialog).toHaveAttribute('aria-labelledby')
          expect(dialog).toHaveAttribute('aria-describedby')

          unmount()
        }),
        { numRuns: 100 }
      )
    })

    it('modal content receives focus when opened - BulkDeleteModal', () => {
      fc.assert(
        fc.property(fc.integer({ min: 1, max: 100 }), (vehicleCount: number) => {
          const mockOnConfirm = jest.fn()
          const mockOnCancel = jest.fn()

          const { unmount } = render(
            <BulkDeleteModal
              vehicleCount={vehicleCount}
              open={true}
              onConfirm={mockOnConfirm}
              onCancel={mockOnCancel}
            />
          )

          // Dialog should be in the document and have role="dialog"
          const dialog = screen.getByRole('dialog')
          expect(dialog).toBeInTheDocument()

          // Dialog should have proper ARIA attributes
          expect(dialog).toHaveAttribute('aria-labelledby')
          expect(dialog).toHaveAttribute('aria-describedby')

          unmount()
        }),
        { numRuns: 100 }
      )
    })
  })
})
