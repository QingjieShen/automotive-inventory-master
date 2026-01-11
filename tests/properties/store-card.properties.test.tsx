import * as fc from 'fast-check'
import { render } from '@testing-library/react'
import { StoreCard } from '../../src/components/stores/StoreCard'
import { Store } from '../../src/types'

describe('StoreCard Property-Based Tests', () => {
  // Feature: app-enhancements, Property 2: Store Image Display Fallback
  // **Validates: Requirements 2.3**
  test('renders without errors for various imageUrl values', () => {
    const storeWithImageUrl = fc.record({
      id: fc.uuid(),
      name: fc.string({ minLength: 5, maxLength: 50 }),
      address: fc.string({ minLength: 10, maxLength: 100 }),
      brandLogos: fc.array(fc.constantFrom('toyota-logo.png', 'honda-logo.png'), { minLength: 1, maxLength: 3 }),
      imageUrl: fc.oneof(
        fc.webUrl(), // valid URL
        fc.constant('invalid-url'), // invalid URL
        fc.constant(null as any), // null
        fc.constant(undefined), // undefined
        fc.constant(''), // empty string
        fc.constant('https://example.com/nonexistent.jpg') // URL that might not exist
      )
    })

    fc.assert(
      fc.property(storeWithImageUrl, (store: Store) => {
        // Render the component
        const mockOnSelect = jest.fn()
        
        // Should not throw an error regardless of imageUrl value
        expect(() => {
          const { container } = render(<StoreCard store={store} onSelect={mockOnSelect} />)
          
          // Verify the component rendered
          expect(container).toBeTruthy()
          
          // Verify store name is displayed
          expect(container.textContent).toContain(store.name)
          
          // Verify address is displayed
          expect(container.textContent).toContain(store.address)
        }).not.toThrow()
      }),
      { numRuns: 100 }
    )
  })

  // Feature: app-enhancements, Property 11: Store Card Text Readability
  // **Validates: Requirements 2.4**
  test('text has sufficient contrast with background', () => {
    const storeArbitrary = fc.record({
      id: fc.uuid(),
      name: fc.string({ minLength: 5, maxLength: 50 }),
      address: fc.string({ minLength: 10, maxLength: 100 }),
      brandLogos: fc.array(fc.constantFrom('toyota-logo.png', 'honda-logo.png'), { minLength: 1, maxLength: 3 }),
      imageUrl: fc.option(fc.webUrl(), { nil: undefined })
    })

    fc.assert(
      fc.property(storeArbitrary, (store: Store) => {
        const mockOnSelect = jest.fn()
        const { container } = render(<StoreCard store={store} onSelect={mockOnSelect} />)
        
        // Get the store name element
        const nameElement = container.querySelector('h3')
        const addressElement = container.querySelector('p')
        
        expect(nameElement).toBeTruthy()
        expect(addressElement).toBeTruthy()
        
        if (nameElement && addressElement) {
          // Check that text has white color class
          expect(nameElement.className).toContain('text-white')
          expect(addressElement.className).toContain('text-white')
          
          // Check that text has shadow style attribute for readability
          const nameStyle = nameElement.getAttribute('style')
          const addressStyle = addressElement.getAttribute('style')
          
          expect(nameStyle).toBeTruthy()
          expect(nameStyle).toContain('text-shadow')
          expect(nameStyle).toContain('rgba(0, 0, 0, 0.8)')
          
          expect(addressStyle).toBeTruthy()
          expect(addressStyle).toContain('text-shadow')
          expect(addressStyle).toContain('rgba(0, 0, 0, 0.8)')
        }
      }),
      { numRuns: 100 }
    )
  })
})
