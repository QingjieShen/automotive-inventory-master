/**
 * Property-Based Tests for Loading States
 * Feature: shadcn-ui-integration, Property 7: Loading State Representation
 * Validates: Requirements 8.2, 8.3
 */

import { render } from '@testing-library/react'
import * as fc from 'fast-check'
import VehicleCard from '@/components/vehicles/VehicleCard'
import VehicleCardSkeleton from '@/components/vehicles/VehicleCardSkeleton'
import { StoreCard } from '@/components/stores/StoreCard'
import { StoreCardSkeleton } from '@/components/stores/StoreCardSkeleton'
import { Vehicle, Store, VehicleImage, ImageType } from '@/types'

// Mock Next.js router
const mockPush = jest.fn()
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: mockPush,
    back: jest.fn(),
    forward: jest.fn(),
    refresh: jest.fn(),
    replace: jest.fn(),
    prefetch: jest.fn(),
  }),
}))

// Mock Next.js Image component
jest.mock('next/image', () => ({
  __esModule: true,
  default: ({ src, alt, ...props }: any) => {
    return <img src={src} alt={alt} {...props} />
  },
}))

// Arbitraries for generating test data
const imageTypeArb = fc.constantFrom<ImageType>(
  'FRONT_QUARTER',
  'FRONT',
  'BACK_QUARTER',
  'BACK',
  'DRIVER_SIDE',
  'PASSENGER_SIDE',
  'GALLERY_EXTERIOR',
  'GALLERY_INTERIOR',
  'GALLERY'
)

const vehicleImageArb: fc.Arbitrary<VehicleImage> = fc.record({
  id: fc.uuid(),
  vehicleId: fc.uuid(),
  originalUrl: fc.webUrl(),
  processedUrl: fc.option(fc.webUrl(), { nil: undefined }),
  thumbnailUrl: fc.webUrl(),
  imageType: imageTypeArb,
  sortOrder: fc.integer({ min: 0, max: 100 }),
  isProcessed: fc.boolean(),
  uploadedAt: fc.date(),
})

const vehicleArb: fc.Arbitrary<Vehicle> = fc.record({
  id: fc.uuid(),
  stockNumber: fc.string({ minLength: 1, maxLength: 20 }),
  storeId: fc.uuid(),
  images: fc.array(vehicleImageArb, { minLength: 0, maxLength: 10 }),
  processingStatus: fc.constantFrom('NOT_STARTED', 'IN_PROGRESS', 'COMPLETED', 'ERROR'),
  createdAt: fc.date(),
  updatedAt: fc.date(),
})

const storeArb: fc.Arbitrary<Store> = fc.record({
  id: fc.uuid(),
  name: fc.string({ minLength: 1, maxLength: 50 }),
  address: fc.string({ minLength: 10, maxLength: 100 }),
  imageUrl: fc.option(fc.webUrl(), { nil: undefined }),
  brandLogos: fc.array(fc.string({ minLength: 1, maxLength: 20 }), { minLength: 1, maxLength: 5 }),
})

describe('Property 7: Loading State Representation', () => {
  describe('VehicleCard skeleton dimensions', () => {
    /**
     * Property: For any vehicle data, the VehicleCardSkeleton should match
     * the structural layout of the actual VehicleCard
     */
    it('should have matching card structure for any vehicle data', () => {
      fc.assert(
        fc.property(
          vehicleArb,
          fc.boolean(),
          (vehicle: Vehicle, showCheckbox: boolean) => {
            // Render actual component
            const { container: actualContainer } = render(
              <VehicleCard 
                vehicle={vehicle} 
                showCheckbox={showCheckbox}
                isSelected={false}
              />
            )

            // Render skeleton component
            const { container: skeletonContainer } = render(
              <VehicleCardSkeleton showCheckbox={showCheckbox} />
            )

            // Both should have Card component
            const actualCard = actualContainer.querySelector('[class*="rounded-lg"][class*="border"]')
            const skeletonCard = skeletonContainer.querySelector('[class*="rounded-lg"][class*="border"]')
            
            expect(actualCard).toBeTruthy()
            expect(skeletonCard).toBeTruthy()

            // Both should have CardContent with same padding
            const actualContent = actualContainer.querySelector('[class*="p-4"][class*="sm:p-6"]')
            const skeletonContent = skeletonContainer.querySelector('[class*="p-4"][class*="sm:p-6"]')
            
            expect(actualContent).toBeTruthy()
            expect(skeletonContent).toBeTruthy()

            // Both should have mobile layout (sm:hidden)
            const actualMobile = actualContainer.querySelector('.sm\\:hidden')
            const skeletonMobile = skeletonContainer.querySelector('.sm\\:hidden')
            
            expect(actualMobile).toBeTruthy()
            expect(skeletonMobile).toBeTruthy()

            // Both should have desktop layout (hidden sm:grid)
            const actualDesktop = actualContainer.querySelector('.hidden.sm\\:grid')
            const skeletonDesktop = skeletonContainer.querySelector('.hidden.sm\\:grid')
            
            expect(actualDesktop).toBeTruthy()
            expect(skeletonDesktop).toBeTruthy()

            // If showCheckbox is true, both should have checkbox elements
            if (showCheckbox) {
              // Radix checkbox renders as a button with role="checkbox"
              const actualCheckboxes = actualContainer.querySelectorAll('[role="checkbox"]')
              // Skeleton uses Skeleton component with h-4 w-4 classes
              const skeletonCheckboxes = skeletonContainer.querySelectorAll('[class*="h-4"][class*="w-4"][class*="rounded"]')
              
              expect(actualCheckboxes.length).toBeGreaterThan(0)
              expect(skeletonCheckboxes.length).toBeGreaterThan(0)
            }
          }
        ),
        { numRuns: 100 }
      )
    })

    /**
     * Property: For any checkbox state, the skeleton should maintain
     * the same grid structure as the actual component
     */
    it('should maintain grid structure with or without checkbox', () => {
      fc.assert(
        fc.property(
          fc.boolean(),
          (showCheckbox: boolean) => {
            const { container: skeletonContainer } = render(
              <VehicleCardSkeleton showCheckbox={showCheckbox} />
            )

            // Desktop grid should have 12 columns
            const desktopGrid = skeletonContainer.querySelector('.grid-cols-12')
            expect(desktopGrid).toBeTruthy()

            // Check column spans match expected layout
            const colSpans = skeletonContainer.querySelectorAll('[class*="col-span-"]')
            expect(colSpans.length).toBeGreaterThan(0)

            // Verify the skeleton has the same number of major sections as the actual card
            // (checkbox, stock number, thumbnail, photo count, date, status, actions)
            const sections = skeletonContainer.querySelectorAll('.col-span-1, .col-span-2, .col-span-3')
            expect(sections.length).toBeGreaterThan(5) // At least 6 sections
          }
        ),
        { numRuns: 100 }
      )
    })
  })

  describe('StoreCard skeleton dimensions', () => {
    /**
     * Property: For any store data, the StoreCardSkeleton should match
     * the structural layout and minimum height of the actual StoreCard
     */
    it('should have matching card structure for any store data', () => {
      fc.assert(
        fc.property(
          storeArb,
          (store: Store) => {
            // Render actual component
            const { container: actualContainer } = render(
              <StoreCard store={store} onSelect={() => {}} />
            )

            // Render skeleton component
            const { container: skeletonContainer } = render(
              <StoreCardSkeleton />
            )

            // Both should have Card component with min-h-[280px]
            const actualCard = actualContainer.querySelector('[class*="min-h-\\[280px\\]"]')
            const skeletonCard = skeletonContainer.querySelector('[class*="min-h-\\[280px\\]"]')
            
            expect(actualCard).toBeTruthy()
            expect(skeletonCard).toBeTruthy()

            // Both should have CardHeader
            const actualHeader = actualContainer.querySelector('[class*="p-0"][class*="mb-2"]')
            const skeletonHeader = skeletonContainer.querySelector('[class*="p-0"][class*="mb-2"]')
            
            expect(actualHeader).toBeTruthy()
            expect(skeletonHeader).toBeTruthy()

            // Both should have CardContent
            const actualContent = actualContainer.querySelector('[class*="p-0"][class*="mb-4"][class*="flex-grow"]')
            const skeletonContent = skeletonContainer.querySelector('[class*="p-0"][class*="mb-4"][class*="flex-grow"]')
            
            expect(actualContent).toBeTruthy()
            expect(skeletonContent).toBeTruthy()

            // Both should have CardFooter with border-t
            const actualFooter = actualContainer.querySelector('[class*="border-t"]')
            const skeletonFooter = skeletonContainer.querySelector('[class*="border-t"]')
            
            expect(actualFooter).toBeTruthy()
            expect(skeletonFooter).toBeTruthy()

            // Both should have flex-col layout
            const actualFlex = actualContainer.querySelector('.flex.flex-col')
            const skeletonFlex = skeletonContainer.querySelector('.flex.flex-col')
            
            expect(actualFlex).toBeTruthy()
            expect(skeletonFlex).toBeTruthy()
          }
        ),
        { numRuns: 100 }
      )
    })

    /**
     * Property: The skeleton should always have a gradient background
     * similar to the fallback gradient used when no image is available
     */
    it('should have gradient background matching fallback style', () => {
      fc.assert(
        fc.property(
          fc.constant(undefined),
          () => {
            const { container } = render(<StoreCardSkeleton />)

            const card = container.querySelector('[style*="background"]')
            expect(card).toBeTruthy()
            
            // Check that it has a gradient background
            const style = card?.getAttribute('style')
            expect(style).toContain('gradient')
          }
        ),
        { numRuns: 100 }
      )
    })

    /**
     * Property: The skeleton should have the same padding structure
     * as the actual StoreCard
     */
    it('should maintain consistent padding structure', () => {
      fc.assert(
        fc.property(
          fc.constant(undefined),
          () => {
            const { container } = render(<StoreCardSkeleton />)

            // Should have p-4 sm:p-6 padding
            const card = container.querySelector('[class*="p-4"][class*="sm:p-6"]')
            expect(card).toBeTruthy()

            // CardHeader should have p-0
            const header = container.querySelector('[class*="p-0"][class*="mb-2"]')
            expect(header).toBeTruthy()

            // CardContent should have p-0
            const content = container.querySelector('[class*="p-0"][class*="mb-4"]')
            expect(content).toBeTruthy()

            // CardFooter should have p-0 and mt-4 pt-4
            const footer = container.querySelector('[class*="p-0"][class*="mt-4"][class*="pt-4"]')
            expect(footer).toBeTruthy()
          }
        ),
        { numRuns: 100 }
      )
    })
  })

  describe('Skeleton visual consistency', () => {
    /**
     * Property: All skeleton elements should have the animate-pulse class
     * for consistent loading animation
     */
    it('VehicleCardSkeleton should have animated skeleton elements', () => {
      fc.assert(
        fc.property(
          fc.constant(undefined),
          () => {
            const { container } = render(<VehicleCardSkeleton />)

            const skeletons = container.querySelectorAll('[class*="animate-pulse"]')
            expect(skeletons.length).toBeGreaterThan(0)
          }
        ),
        { numRuns: 100 }
      )
    })

    it('StoreCardSkeleton should have animated skeleton elements', () => {
      fc.assert(
        fc.property(
          fc.constant(undefined),
          () => {
            const { container } = render(<StoreCardSkeleton />)

            const skeletons = container.querySelectorAll('[class*="animate-pulse"]')
            expect(skeletons.length).toBeGreaterThan(0)
          }
        ),
        { numRuns: 100 }
      )
    })
  })
})
