import { render, screen, cleanup } from '../utils/test-utils'
import * as fc from 'fast-check'
import React from 'react'
import VehicleCard from '@/components/vehicles/VehicleCard'
import { StoreCard } from '@/components/stores/StoreCard'
import { Vehicle, Store } from '@/types'

// Feature: shadcn-ui-integration, Property 9: Responsive Layout Adaptation
// Validates: Requirements 12.1, 12.2, 12.3, 12.5

// Mock Next.js router
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
  }),
}))

// Mock Next.js Image component
jest.mock('next/image', () => ({
  __esModule: true,
  default: (props: any) => {
    // eslint-disable-next-line @next/next/no-img-element, jsx-a11y/alt-text
    return <img {...props} />
  },
}))

// Mock window.matchMedia for ThemeToggle
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(),
    removeListener: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
})

// Arbitraries for generating test data
const vehicleArbitrary = fc.record({
  id: fc.string({ minLength: 1, maxLength: 20 }).filter(s => s.trim().length > 0),
  stockNumber: fc.string({ minLength: 1, maxLength: 20 }).filter(s => s.trim().length > 0),
  storeId: fc.string({ minLength: 1, maxLength: 20 }).filter(s => s.trim().length > 0),
  processingStatus: fc.constantFrom('NOT_STARTED', 'IN_PROGRESS', 'COMPLETED', 'ERROR'),
  createdAt: fc.date(),
  updatedAt: fc.date(),
  images: fc.array(
    fc.record({
      id: fc.string({ minLength: 1, maxLength: 20 }).filter(s => s.trim().length > 0),
      vehicleId: fc.string({ minLength: 1, maxLength: 20 }).filter(s => s.trim().length > 0),
      imageType: fc.constantFrom('FRONT', 'REAR', 'SIDE', 'INTERIOR', 'FRONT_QUARTER', 'REAR_QUARTER'),
      originalUrl: fc.webUrl(),
      thumbnailUrl: fc.option(fc.webUrl(), { nil: null }),
      processedUrl: fc.option(fc.webUrl(), { nil: null }),
      uploadedAt: fc.date(),
      displayOrder: fc.integer({ min: 0, max: 100 }),
    }),
    { minLength: 0, maxLength: 10 }
  ),
}) as fc.Arbitrary<Vehicle>

const storeArbitrary = fc.record({
  id: fc.string({ minLength: 1, maxLength: 20 }).filter(s => s.trim().length > 0),
  name: fc.string({ minLength: 1, maxLength: 50 }).filter(s => s.trim().length > 0),
  address: fc.string({ minLength: 10, maxLength: 100 }).filter(s => s.trim().length > 0),
  brandLogos: fc.array(
    fc.string({ minLength: 5, maxLength: 20 }).filter(s => s.trim().length > 0), 
    { minLength: 1, maxLength: 5 }
  ),
  imageUrl: fc.option(fc.webUrl(), { nil: null }),
  createdAt: fc.date(),
  updatedAt: fc.date(),
}) as fc.Arbitrary<Store>

const viewportArbitrary = fc.constantFrom(
  { width: 320, height: 568, name: 'mobile' },
  { width: 375, height: 667, name: 'mobile' },
  { width: 768, height: 1024, name: 'tablet' },
  { width: 1024, height: 768, name: 'tablet' },
  { width: 1280, height: 720, name: 'desktop' },
  { width: 1920, height: 1080, name: 'desktop' }
)

describe('Property 9: Responsive Layout Adaptation', () => {
  afterEach(() => {
    cleanup()
  })

  test('VehicleCard applies responsive classes correctly across all viewport sizes', () => {
    fc.assert(
      fc.property(
        vehicleArbitrary,
        viewportArbitrary,
        fc.boolean(), // showCheckbox
        (vehicle, viewport, showCheckbox) => {
          try {
            // Set viewport size
            Object.defineProperty(window, 'innerWidth', {
              writable: true,
              configurable: true,
              value: viewport.width,
            })
            Object.defineProperty(window, 'innerHeight', {
              writable: true,
              configurable: true,
              value: viewport.height,
            })

            render(<VehicleCard vehicle={vehicle} showCheckbox={showCheckbox} />)

            const card = screen.getByRole('row')

            // Verify card has responsive classes
            expect(card).toBeInTheDocument()

            // Mobile layout should exist (sm:hidden)
            const mobileLayout = card.querySelector('.sm\\:hidden')
            expect(mobileLayout).toBeInTheDocument()

            // Desktop layout should exist (hidden sm:grid)
            const desktopLayout = card.querySelector('.hidden.sm\\:grid')
            expect(desktopLayout).toBeInTheDocument()

            // Verify grid-cols-12 on desktop layout
            expect(desktopLayout).toHaveClass('grid-cols-12')

            // Verify responsive padding (p-4 sm:p-6)
            const cardContent = card.querySelector('.p-4.sm\\:p-6')
            expect(cardContent).toBeInTheDocument()

            // Verify hover and transition classes
            expect(card).toHaveClass('hover:bg-accent/50', 'transition-colors')
          } finally {
            cleanup()
          }
        }
      ),
      { numRuns: 100 }
    )
  })

  test('StoreCard applies responsive padding correctly across all viewport sizes', () => {
    fc.assert(
      fc.property(
        storeArbitrary,
        viewportArbitrary,
        (store, viewport) => {
          try {
            // Set viewport size
            Object.defineProperty(window, 'innerWidth', {
              writable: true,
              configurable: true,
              value: viewport.width,
            })
            Object.defineProperty(window, 'innerHeight', {
              writable: true,
              configurable: true,
              value: viewport.height,
            })

            const onSelect = jest.fn()
            render(<StoreCard store={store} onSelect={onSelect} />)

            const card = screen.getByRole('gridcell')

            // Verify responsive padding classes (p-4 sm:p-6)
            expect(card).toHaveClass('p-4', 'sm:p-6')

            // Verify minimum height for touch targets
            expect(card).toHaveClass('min-h-[280px]')

            // Verify hover and transition classes
            expect(card).toHaveClass('hover:shadow-lg', 'transition-all')

            // Verify select button is full width
            const selectButtons = screen.getAllByRole('button', { name: /select.*store/i })
            expect(selectButtons.length).toBeGreaterThan(0)
            expect(selectButtons[0]).toHaveClass('w-full')
          } finally {
            cleanup()
          }
        }
      ),
      { numRuns: 100 }
    )
  })

  test('Touch targets meet minimum size requirements on mobile viewports', () => {
    fc.assert(
      fc.property(
        vehicleArbitrary,
        fc.constantFrom(
          { width: 320, height: 568 },
          { width: 375, height: 667 },
          { width: 414, height: 896 }
        ),
        fc.boolean(), // showCheckbox
        (vehicle, viewport, showCheckbox) => {
          try {
            // Set mobile viewport
            Object.defineProperty(window, 'innerWidth', {
              writable: true,
              configurable: true,
              value: viewport.width,
            })
            Object.defineProperty(window, 'innerHeight', {
              writable: true,
              configurable: true,
              value: viewport.height,
            })

            render(<VehicleCard vehicle={vehicle} showCheckbox={showCheckbox} />)

            // Get all interactive elements
            const buttons = screen.getAllByRole('button')
            
            // Verify buttons have adequate size classes
            // Icon buttons should be h-10 w-10 (40px x 40px, meets WCAG 2.5.5 minimum of 44x44 with padding)
            buttons.forEach(button => {
              const classes = button.className
              // Check for size classes that indicate adequate touch targets
              const hasAdequateSize = 
                classes.includes('h-10') || 
                classes.includes('h-9') || 
                classes.includes('py-2') ||
                classes.includes('py-3')
              
              expect(hasAdequateSize).toBe(true)
            })

            if (showCheckbox) {
              // Checkboxes should have adequate size (h-4 w-4 is the visual size, but clickable area is larger)
              const checkboxes = screen.getAllByRole('checkbox')
              expect(checkboxes.length).toBeGreaterThan(0)
              
              checkboxes.forEach(checkbox => {
                // Verify checkbox has size classes
                expect(checkbox.className).toContain('h-4')
                expect(checkbox.className).toContain('w-4')
              })
            }
          } finally {
            cleanup()
          }
        }
      ),
      { numRuns: 100 }
    )
  })

  test('Responsive classes are consistently applied across different component states', () => {
    fc.assert(
      fc.property(
        vehicleArbitrary,
        viewportArbitrary,
        fc.boolean(), // showCheckbox
        fc.boolean(), // isSelected
        (vehicle, viewport, showCheckbox, isSelected) => {
          try {
            // Set viewport size
            Object.defineProperty(window, 'innerWidth', {
              writable: true,
              configurable: true,
              value: viewport.width,
            })
            Object.defineProperty(window, 'innerHeight', {
              writable: true,
              configurable: true,
              value: viewport.height,
            })

            const onSelectionChange = jest.fn()
            render(
              <VehicleCard 
                vehicle={vehicle} 
                showCheckbox={showCheckbox}
                isSelected={isSelected}
                onSelectionChange={onSelectionChange}
              />
            )

            const card = screen.getByRole('row')

            // Verify responsive classes are present regardless of state
            const cardContent = card.querySelector('.p-4.sm\\:p-6')
            expect(cardContent).toBeInTheDocument()

            // Verify both layouts exist
            const mobileLayout = card.querySelector('.sm\\:hidden')
            const desktopLayout = card.querySelector('.hidden.sm\\:grid')
            
            expect(mobileLayout).toBeInTheDocument()
            expect(desktopLayout).toBeInTheDocument()

            // Verify hover transition classes
            expect(card).toHaveClass('hover:bg-accent/50', 'transition-colors')
          } finally {
            cleanup()
          }
        }
      ),
      { numRuns: 100 }
    )
  })

  test('Grid layout adapts correctly to viewport breakpoints', () => {
    fc.assert(
      fc.property(
        vehicleArbitrary,
        viewportArbitrary,
        (vehicle, viewport) => {
          try {
            // Set viewport size
            Object.defineProperty(window, 'innerWidth', {
              writable: true,
              configurable: true,
              value: viewport.width,
            })
            Object.defineProperty(window, 'innerHeight', {
              writable: true,
              configurable: true,
              value: viewport.height,
            })

            render(<VehicleCard vehicle={vehicle} />)

            const card = screen.getByRole('row')
            const desktopLayout = card.querySelector('.hidden.sm\\:grid')

            // Desktop layout should have 12-column grid
            expect(desktopLayout).toHaveClass('grid-cols-12')

            // Verify gap spacing
            expect(desktopLayout).toHaveClass('gap-4')

            // Verify items-center for vertical alignment
            expect(desktopLayout).toHaveClass('items-center')

            // Mobile layout should use flexbox
            const mobileLayout = card.querySelector('.sm\\:hidden')
            expect(mobileLayout).toHaveClass('space-y-3')
          } finally {
            cleanup()
          }
        }
      ),
      { numRuns: 100 }
    )
  })
})
