import * as fc from 'fast-check'
import { render, cleanup, fireEvent } from '@testing-library/react'
import NavigationBanner from '../../src/components/common/NavigationBanner'
import { Store } from '../../src/types'

// Mock next/navigation
const mockPush = jest.fn()
const mockRouter = {
  push: mockPush,
  replace: jest.fn(),
  prefetch: jest.fn(),
  back: jest.fn(),
  forward: jest.fn(),
  refresh: jest.fn(),
}

jest.mock('next/navigation', () => ({
  useRouter: () => mockRouter,
}))

// Clean up after each test
afterEach(() => {
  cleanup()
  jest.clearAllMocks()
})

describe('Navigation Back Functionality Property-Based Tests', () => {
  // Feature: app-enhancements, Property 9: Navigation Back to Stores
  // **Validates: Requirements 3.3**
  test('clicking back button always navigates to store selection page', () => {
    const storeArbitrary = fc.record({
      id: fc.uuid(),
      name: fc.string({ minLength: 5, maxLength: 50 }),
      address: fc.string({ minLength: 10, maxLength: 100 }),
      brandLogos: fc.array(fc.constantFrom('toyota-logo.png', 'honda-logo.png'), { minLength: 1, maxLength: 3 }),
      imageUrl: fc.option(fc.webUrl(), { nil: undefined })
    })

    fc.assert(
      fc.property(storeArbitrary, (store: Store) => {
        // Reset mock before each property iteration
        mockPush.mockClear()
        
        // Render NavigationBanner with store
        const { container } = render(
          <NavigationBanner 
            currentStore={store}
            showBackToStores={true}
          />
        )
        
        // Find and click the "Back to Stores" button
        const backButton = container.querySelector('button[aria-label="Back to store selection"]')
        expect(backButton).toBeTruthy()
        
        if (backButton) {
          fireEvent.click(backButton)
        }
        
        // Verify router.push was called with '/stores'
        expect(mockPush).toHaveBeenCalledWith('/stores')
        expect(mockPush).toHaveBeenCalledTimes(1)
        
        cleanup()
      }),
      { numRuns: 100 }
    )
  })

  test('custom onBackToStores callback is called when provided', () => {
    const storeArbitrary = fc.record({
      id: fc.uuid(),
      name: fc.string({ minLength: 5, maxLength: 50 }),
      address: fc.string({ minLength: 10, maxLength: 100 }),
      brandLogos: fc.array(fc.constantFrom('toyota-logo.png', 'honda-logo.png'), { minLength: 1, maxLength: 3 }),
      imageUrl: fc.option(fc.webUrl(), { nil: undefined })
    })

    fc.assert(
      fc.property(storeArbitrary, (store: Store) => {
        // Reset mocks
        mockPush.mockClear()
        const customCallback = jest.fn()
        
        // Render with custom callback
        const { container } = render(
          <NavigationBanner 
            currentStore={store}
            showBackToStores={true}
            onBackToStores={customCallback}
          />
        )
        
        // Find and click the button
        const backButton = container.querySelector('button[aria-label="Back to store selection"]')
        if (backButton) {
          fireEvent.click(backButton)
        }
        
        // Verify custom callback was called instead of router.push
        expect(customCallback).toHaveBeenCalledTimes(1)
        expect(mockPush).not.toHaveBeenCalled()
        
        cleanup()
      }),
      { numRuns: 100 }
    )
  })

  test('mobile menu back button navigates to stores', () => {
    const storeArbitrary = fc.record({
      id: fc.uuid(),
      name: fc.string({ minLength: 5, maxLength: 50 }),
      address: fc.string({ minLength: 10, maxLength: 100 }),
      brandLogos: fc.array(fc.constantFrom('toyota-logo.png', 'honda-logo.png'), { minLength: 1, maxLength: 3 }),
      imageUrl: fc.option(fc.webUrl(), { nil: undefined })
    })

    fc.assert(
      fc.property(storeArbitrary, (store: Store) => {
        mockPush.mockClear()
        
        const { container } = render(
          <NavigationBanner 
            currentStore={store}
            showBackToStores={true}
          />
        )
        
        // Open mobile menu
        const mobileMenuButton = container.querySelector('button[aria-label="Toggle navigation menu"]')
        if (mobileMenuButton) {
          fireEvent.click(mobileMenuButton)
        }
        
        // Find mobile back button (should be in the mobile menu)
        const buttons = container.querySelectorAll('button')
        const mobileBackButton = Array.from(buttons).find(btn => 
          btn.textContent?.includes('Back to Stores') && 
          btn.classList.contains('w-full')
        )
        
        if (mobileBackButton) {
          fireEvent.click(mobileBackButton)
          
          // Verify navigation occurred
          expect(mockPush).toHaveBeenCalledWith('/stores')
        }
        
        cleanup()
      }),
      { numRuns: 100 }
    )
  })

  test('navigation works without store context', () => {
    fc.assert(
      fc.property(fc.constant(null), () => {
        mockPush.mockClear()
        
        const { container } = render(
          <NavigationBanner 
            showBackToStores={true}
          />
        )
        
        const backButton = container.querySelector('button[aria-label="Back to store selection"]')
        if (backButton) {
          fireEvent.click(backButton)
        }
        
        // Should still navigate to /stores
        expect(mockPush).toHaveBeenCalledWith('/stores')
        
        cleanup()
      }),
      { numRuns: 100 }
    )
  })
})
