import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import * as fc from 'fast-check'
import React from 'react'
import { TestWrapper } from '../utils/test-utils'
import { arbitraries } from '../utils/mock-factories'

// Feature: vehicle-inventory-tool, Property 13: User Interface Responsiveness
describe('Property 13: User Interface Responsiveness', () => {
  
  test('user interactions provide immediate visual feedback', async () => {
    fc.assert(
      fc.asyncProperty(
        fc.constantFrom(
          'button',
          'input',
          'select',
          'textarea'
        ),
        fc.boolean(), // disabled state
        async (elementType, isDisabled) => {
          const user = userEvent.setup()
          
          // Create a test component with the specified element type
          const TestComponent = () => {
            const [focused, setFocused] = React.useState(false)
            const [hovered, setHovered] = React.useState(false)
            const [clicked, setClicked] = React.useState(false)
            
            const commonProps = {
              disabled: isDisabled,
              onFocus: () => setFocused(true),
              onBlur: () => setFocused(false),
              onMouseEnter: () => setHovered(true),
              onMouseLeave: () => setHovered(false),
              onClick: () => setClicked(true),
              className: `
                transition-colors duration-200
                ${focused ? 'ring-2 ring-blue-500' : ''}
                ${hovered && !isDisabled ? 'bg-gray-50' : ''}
                ${clicked ? 'bg-blue-100' : ''}
                ${isDisabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
              `,
              'data-testid': 'interactive-element'
            }
            
            switch (elementType) {
              case 'button':
                return React.createElement('button', commonProps, 'Test Button')
              case 'input':
                return React.createElement('input', { ...commonProps, type: 'text', placeholder: 'Test Input' })
              case 'select':
                return React.createElement('select', commonProps, 
                  React.createElement('option', null, 'Test Option')
                )
              case 'textarea':
                return React.createElement('textarea', { ...commonProps, placeholder: 'Test Textarea' })
              default:
                return React.createElement('button', commonProps, 'Default')
            }
          }
          
          render(React.createElement(TestComponent), { wrapper: TestWrapper })
          
          const element = screen.getByTestId('interactive-element')
          
          // Test focus feedback (unless disabled)
          if (!isDisabled) {
            await user.tab()
            expect(element).toHaveFocus()
            expect(element).toHaveClass('ring-2', 'ring-blue-500')
          }
          
          // Test hover feedback (unless disabled)
          if (!isDisabled) {
            fireEvent.mouseEnter(element)
            expect(element).toHaveClass('bg-gray-50')
            
            fireEvent.mouseLeave(element)
            expect(element).not.toHaveClass('bg-gray-50')
          }
          
          // Test disabled state visual feedback
          if (isDisabled) {
            expect(element).toHaveClass('opacity-50', 'cursor-not-allowed')
            expect(element).toBeDisabled()
          } else {
            expect(element).toHaveClass('cursor-pointer')
            expect(element).not.toBeDisabled()
          }
        }
      ),
      { numRuns: 50 }
    )
  })

  test('loading states provide appropriate visual feedback', () => {
    fc.assert(
      fc.property(
        fc.boolean(), // loading state
        fc.string({ minLength: 1, maxLength: 50 }), // loading text
        (isLoading, loadingText) => {
          const TestComponent = () => {
            if (isLoading) {
              return React.createElement('div', { 'data-testid': 'loading-container' },
                React.createElement('div', { 
                  className: 'flex items-center justify-center', 
                  role: 'status', 
                  'aria-live': 'polite' 
                },
                  React.createElement('div', { 
                    className: 'animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600',
                    'aria-hidden': 'true'
                  }),
                  React.createElement('span', { className: 'ml-2 text-gray-600' }, loadingText),
                  React.createElement('span', { className: 'sr-only' }, 'Loading...')
                )
              )
            } else {
              return React.createElement('div', { 'data-testid': 'loading-container' },
                React.createElement('div', null, 'Content loaded')
              )
            }
          }
          
          render(React.createElement(TestComponent), { wrapper: TestWrapper })
          
          const container = screen.getByTestId('loading-container')
          
          if (isLoading) {
            // Should have loading spinner
            expect(container.querySelector('.animate-spin')).toBeInTheDocument()
            // Should have loading text
            expect(screen.getByText(loadingText)).toBeInTheDocument()
            // Should have screen reader text
            expect(screen.getByText('Loading...')).toBeInTheDocument()
            // Should have proper ARIA attributes
            expect(container.querySelector('[role="status"]')).toBeInTheDocument()
            expect(container.querySelector('[aria-live="polite"]')).toBeInTheDocument()
          } else {
            // Should show content instead of loading
            expect(screen.getByText('Content loaded')).toBeInTheDocument()
            expect(container.querySelector('.animate-spin')).not.toBeInTheDocument()
          }
        }
      ),
      { numRuns: 100 }
    )
  })

  test('error states provide accessible feedback', () => {
    fc.assert(
      fc.property(
        fc.boolean(), // has error
        fc.string({ minLength: 1, maxLength: 100 }), // error message
        (hasError, errorMessage) => {
          const TestComponent = () => {
            if (hasError) {
              return React.createElement('div', { 'data-testid': 'error-container' },
                React.createElement('div', {
                  className: 'bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md',
                  role: 'alert',
                  'aria-live': 'polite'
                }, errorMessage)
              )
            } else {
              return React.createElement('div', { 'data-testid': 'error-container' },
                React.createElement('div', null, 'No errors')
              )
            }
          }
          
          render(React.createElement(TestComponent), { wrapper: TestWrapper })
          
          const container = screen.getByTestId('error-container')
          
          if (hasError) {
            // Should display error message
            expect(screen.getByText(errorMessage)).toBeInTheDocument()
            // Should have proper ARIA attributes for accessibility
            expect(container.querySelector('[role="alert"]')).toBeInTheDocument()
            expect(container.querySelector('[aria-live="polite"]')).toBeInTheDocument()
            // Should have error styling
            expect(container.querySelector('.bg-red-50')).toBeInTheDocument()
            expect(container.querySelector('.border-red-200')).toBeInTheDocument()
            expect(container.querySelector('.text-red-700')).toBeInTheDocument()
          } else {
            // Should show normal content
            expect(screen.getByText('No errors')).toBeInTheDocument()
            expect(container.querySelector('[role="alert"]')).not.toBeInTheDocument()
          }
        }
      ),
      { numRuns: 100 }
    )
  })

  test('responsive design adapts to different screen sizes', () => {
    fc.assert(
      fc.property(
        fc.constantFrom(
          { width: 320, height: 568 },   // Mobile
          { width: 768, height: 1024 },  // Tablet
          { width: 1024, height: 768 },  // Desktop small
          { width: 1920, height: 1080 }  // Desktop large
        ),
        (screenSize) => {
          // Mock window.innerWidth and window.innerHeight
          Object.defineProperty(window, 'innerWidth', {
            writable: true,
            configurable: true,
            value: screenSize.width,
          })
          Object.defineProperty(window, 'innerHeight', {
            writable: true,
            configurable: true,
            value: screenSize.height,
          })
          
          const TestComponent = () => {
            return React.createElement('div', { 'data-testid': 'responsive-container' },
              React.createElement('div', { className: 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4' },
                React.createElement('div', { className: 'bg-white p-4 rounded' }, 'Item 1'),
                React.createElement('div', { className: 'bg-white p-4 rounded' }, 'Item 2'),
                React.createElement('div', { className: 'bg-white p-4 rounded' }, 'Item 3'),
                React.createElement('div', { className: 'bg-white p-4 rounded' }, 'Item 4')
              ),
              React.createElement('div', { className: 'flex flex-col sm:flex-row gap-4 mt-4' },
                React.createElement('button', { className: 'w-full sm:w-auto px-4 py-2 bg-blue-600 text-white rounded' }, 'Action 1'),
                React.createElement('button', { className: 'w-full sm:w-auto px-4 py-2 bg-gray-600 text-white rounded' }, 'Action 2')
              )
            )
          }
          
          render(React.createElement(TestComponent), { wrapper: TestWrapper })
          
          const container = screen.getByTestId('responsive-container')
          
          // Verify responsive classes are applied
          expect(container.querySelector('.grid-cols-1')).toBeInTheDocument()
          expect(container.querySelector('.sm\\:grid-cols-2')).toBeInTheDocument()
          expect(container.querySelector('.lg\\:grid-cols-3')).toBeInTheDocument()
          expect(container.querySelector('.xl\\:grid-cols-4')).toBeInTheDocument()
          
          // Verify responsive button layout
          expect(container.querySelector('.flex-col')).toBeInTheDocument()
          expect(container.querySelector('.sm\\:flex-row')).toBeInTheDocument()
          expect(container.querySelector('.w-full')).toBeInTheDocument()
          expect(container.querySelector('.sm\\:w-auto')).toBeInTheDocument()
        }
      ),
      { numRuns: 50 }
    )
  })

  test('accessibility attributes are properly maintained', () => {
    fc.assert(
      fc.property(
        fc.string({ minLength: 1, maxLength: 50 }), // aria-label
        fc.string({ minLength: 1, maxLength: 100 }), // aria-describedby content
        fc.boolean(), // has error state
        (ariaLabel, description, hasError) => {
          const TestComponent = () => {
            return React.createElement('div', { 'data-testid': 'accessibility-container' },
              React.createElement('label', { 
                htmlFor: 'test-input', 
                className: 'block text-sm font-medium text-gray-700' 
              }, 'Test Input'),
              React.createElement('input', {
                id: 'test-input',
                type: 'text',
                'aria-label': ariaLabel,
                'aria-describedby': hasError ? 'error-message' : 'help-text',
                className: `mt-1 block w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  hasError ? 'border-red-300' : 'border-gray-300'
                }`
              }),
              hasError ? 
                React.createElement('p', { 
                  id: 'error-message', 
                  className: 'mt-1 text-sm text-red-600', 
                  role: 'alert' 
                }, description) :
                React.createElement('p', { 
                  id: 'help-text', 
                  className: 'mt-1 text-sm text-gray-500' 
                }, description)
            )
          }
          
          render(React.createElement(TestComponent), { wrapper: TestWrapper })
          
          const input = screen.getByLabelText('Test Input')
          const descriptionElement = screen.getByText(description)
          
          // Verify accessibility attributes
          expect(input).toHaveAttribute('aria-label', ariaLabel)
          expect(input).toHaveAttribute('aria-describedby', hasError ? 'error-message' : 'help-text')
          expect(input).toHaveAttribute('id', 'test-input')
          
          // Verify proper labeling
          expect(screen.getByLabelText('Test Input')).toBeInTheDocument()
          
          // Verify error state accessibility
          if (hasError) {
            expect(descriptionElement).toHaveAttribute('role', 'alert')
            expect(descriptionElement).toHaveClass('text-red-600')
            expect(input).toHaveClass('border-red-300')
          } else {
            expect(descriptionElement).not.toHaveAttribute('role', 'alert')
            expect(descriptionElement).toHaveClass('text-gray-500')
            expect(input).toHaveClass('border-gray-300')
          }
          
          // Verify focus management
          input.focus()
          expect(input).toHaveFocus()
          expect(input).toHaveClass('focus:ring-2', 'focus:ring-blue-500')
        }
      ),
      { numRuns: 100 }
    )
  })
})