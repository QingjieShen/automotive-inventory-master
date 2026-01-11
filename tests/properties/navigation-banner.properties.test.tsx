import * as fc from 'fast-check'
import { render, screen, cleanup } from '@testing-library/react'
import NavigationBanner from '../../src/components/common/NavigationBanner'
import { Store } from '../../src/types'

// Mock next/navigation
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
    prefetch: jest.fn(),
    back: jest.fn(),
    forward: jest.fn(),
    refresh: jest.fn(),
  }),
}))

// Clean up after each test
afterEach(() => {
  cleanup()
})

describe('NavigationBanner Property-Based Tests', () => {
  // Feature: app-enhancements, Property 3: Navigation Banner Visibility
  // **Validates: Requirements 3.1, 3.2**
  test('banner is always rendered and visible on various pages', () => {
    const storeArbitrary = fc.record({
      id: fc.uuid(),
      name: fc.string({ minLength: 5, maxLength: 50 }),
      address: fc.string({ minLength: 10, maxLength: 100 }),
      brandLogos: fc.array(fc.constantFrom('toyota-logo.png', 'honda-logo.png'), { minLength: 1, maxLength: 3 }),
      imageUrl: fc.option(fc.webUrl(), { nil: undefined })
    })

    fc.assert(
      fc.property(storeArbitrary, (store: Store) => {
        // Render the NavigationBanner with a store
        const { container } = render(
          <NavigationBanner 
            currentStore={store}
            showBackToStores={true}
          />
        )
        
        // Verify the banner is rendered
        expect(container).toBeTruthy()
        
        // Verify the navigation element exists with proper role
        const nav = container.querySelector('nav[role="navigation"]')
        expect(nav).toBeTruthy()
        expect(nav).toHaveAttribute('aria-label', 'Main navigation')
        
        // Verify the banner has fixed positioning and correct z-index
        expect(nav).toHaveClass('fixed', 'top-0', 'z-50', 'h-16')
        
        // Verify MMG logo is displayed
        expect(container.textContent).toContain('MMG')
        
        // Verify store name is displayed (on desktop view)
        expect(container.textContent).toContain(store.name)
        
        // Verify "Back to Stores" button is present
        expect(container.textContent).toContain('Back to Stores')
      }),
      { numRuns: 100 }
    )
  })

  test('banner renders without store context', () => {
    fc.assert(
      fc.property(fc.boolean(), (showBackToStores: boolean) => {
        // Render the NavigationBanner without a store
        const { container } = render(
          <NavigationBanner 
            showBackToStores={showBackToStores}
          />
        )
        
        // Verify the banner is still rendered
        expect(container).toBeTruthy()
        
        // Verify the navigation element exists
        const nav = container.querySelector('nav[role="navigation"]')
        expect(nav).toBeTruthy()
        
        // Verify MMG logo is always displayed
        expect(container.textContent).toContain('MMG')
        
        // Verify "Back to Stores" button presence matches the prop
        if (showBackToStores) {
          expect(container.textContent).toContain('Back to Stores')
        }
      }),
      { numRuns: 100 }
    )
  })

  test('banner maintains visibility with various showBackToStores values', () => {
    const storeArbitrary = fc.record({
      id: fc.uuid(),
      name: fc.string({ minLength: 5, maxLength: 50 }),
      address: fc.string({ minLength: 10, maxLength: 100 }),
      brandLogos: fc.array(fc.constantFrom('toyota-logo.png', 'honda-logo.png'), { minLength: 1, maxLength: 3 }),
      imageUrl: fc.option(fc.webUrl(), { nil: undefined })
    })

    fc.assert(
      fc.property(
        fc.option(storeArbitrary, { nil: undefined }),
        fc.boolean(),
        (store: Store | undefined, showBackToStores: boolean) => {
          // Render with various combinations
          const { container } = render(
            <NavigationBanner 
              currentStore={store}
              showBackToStores={showBackToStores}
            />
          )
          
          // Banner should always be present
          const nav = container.querySelector('nav[role="navigation"]')
          expect(nav).toBeTruthy()
          
          // Fixed positioning should always be applied
          expect(nav).toHaveClass('fixed', 'top-0', 'z-50')
          
          // Height should always be 64px (h-16)
          expect(nav).toHaveClass('h-16')
          
          // Logo should always be present
          expect(container.textContent).toContain('MMG')
        }
      ),
      { numRuns: 100 }
    )
  })

  test('banner has proper accessibility attributes', () => {
    const storeArbitrary = fc.record({
      id: fc.uuid(),
      name: fc.string({ minLength: 5, maxLength: 50 }),
      address: fc.string({ minLength: 10, maxLength: 100 }),
      brandLogos: fc.array(fc.constantFrom('toyota-logo.png', 'honda-logo.png'), { minLength: 1, maxLength: 3 }),
      imageUrl: fc.option(fc.webUrl(), { nil: undefined })
    })

    fc.assert(
      fc.property(storeArbitrary, (store: Store) => {
        const { container } = render(
          <NavigationBanner 
            currentStore={store}
            showBackToStores={true}
          />
        )
        
        // Check navigation role and aria-label
        const nav = container.querySelector('nav')
        expect(nav).toHaveAttribute('role', 'navigation')
        expect(nav).toHaveAttribute('aria-label', 'Main navigation')
        
        // Check button has aria-label - use container.querySelector to avoid multiple elements issue
        const backButton = container.querySelector('button[aria-label="Back to store selection"]')
        expect(backButton).toBeTruthy()
        
        // Check mobile menu button has aria attributes
        const mobileMenuButton = container.querySelector('button[aria-label="Toggle navigation menu"]')
        expect(mobileMenuButton).toBeTruthy()
        expect(mobileMenuButton).toHaveAttribute('aria-expanded')
        
        // Clean up after each property test iteration
        cleanup()
      }),
      { numRuns: 100 }
    )
  })
})
