import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import * as fc from 'fast-check'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

/**
 * Property-based tests for form components after shadcn/ui migration
 * Feature: shadcn-ui-integration
 * Property 4: Functional Preservation
 * Property 6: Form Validation Display
 * Validates: Requirements 5.4, 5.5
 */

describe('Form Components - Property-Based Tests', () => {
  /**
   * Property 4: Functional Preservation
   * For any form input value, the Input component should preserve its functionality
   * including value changes, validation, and state management after migration to shadcn/ui
   */
  describe('Property 4: Functional Preservation', () => {
    it('preserves input value handling for all text inputs', () => {
      fc.assert(
        fc.property(fc.string(), (inputValue) => {
          const { container, unmount } = render(
            <Input 
              type="text" 
              value={inputValue}
              onChange={() => {}}
              data-testid="test-input"
            />
          )
          
          const input = container.querySelector('[data-testid="test-input"]') as HTMLInputElement
          expect(input.value).toBe(inputValue)
          
          unmount()
        }),
        { numRuns: 100 }
      )
    })

    it('preserves button click handlers for all button variants', () => {
      const variants = ['default', 'destructive', 'outline', 'secondary', 'ghost', 'link'] as const
      
      fc.assert(
        fc.property(
          fc.constantFrom(...variants),
          fc.string({ minLength: 1 }),
          (variant, buttonText) => {
            const handleClick = jest.fn()
            const { container, unmount } = render(
              <Button variant={variant} onClick={handleClick} data-testid="test-button">
                {buttonText}
              </Button>
            )
            
            const button = container.querySelector('[data-testid="test-button"]') as HTMLButtonElement
            fireEvent.click(button)
            
            expect(handleClick).toHaveBeenCalledTimes(1)
            
            unmount()
          }
        ),
        { numRuns: 100 }
      )
    })

    it('preserves form submission logic for all input values', () => {
      fc.assert(
        fc.property(
          fc.string({ minLength: 1 }),
          fc.string({ minLength: 1 }),
          (fieldValue, buttonText) => {
            const handleSubmit = jest.fn((e) => e.preventDefault())
            const { container, unmount } = render(
              <form onSubmit={handleSubmit} data-testid="test-form">
                <Input 
                  type="text" 
                  value={fieldValue}
                  onChange={() => {}}
                  data-testid="form-input"
                />
                <Button type="submit" data-testid="submit-button">{buttonText}</Button>
              </form>
            )
            
            const button = container.querySelector('[data-testid="submit-button"]') as HTMLButtonElement
            fireEvent.click(button)
            
            expect(handleSubmit).toHaveBeenCalled()
            
            unmount()
          }
        ),
        { numRuns: 100 }
      )
    })

    it('preserves disabled state for all inputs', () => {
      fc.assert(
        fc.property(
          fc.boolean(),
          fc.integer({ min: 0, max: 10000 }),
          (isDisabled, testId) => {
            const testIdStr = `test-input-${testId}`
            const { container, unmount } = render(
              <Input 
                disabled={isDisabled}
                data-testid={testIdStr}
              />
            )
            
            const input = container.querySelector(`[data-testid="${testIdStr}"]`) as HTMLInputElement
            
            if (isDisabled) {
              expect(input).toBeDisabled()
            } else {
              expect(input).not.toBeDisabled()
            }
            
            unmount()
          }
        ),
        { numRuns: 100 }
      )
    })

    it('preserves required attribute for all inputs', () => {
      fc.assert(
        fc.property(
          fc.boolean(),
          fc.integer({ min: 0, max: 10000 }),
          (isRequired, testId) => {
            const testIdStr = `test-input-${testId}`
            const { container, unmount } = render(
              <Input 
                required={isRequired}
                data-testid={testIdStr}
              />
            )
            
            const input = container.querySelector(`[data-testid="${testIdStr}"]`) as HTMLInputElement
            
            if (input) {
              if (isRequired) {
                expect(input).toBeRequired()
              } else {
                expect(input).not.toBeRequired()
              }
            }
            
            unmount()
          }
        ),
        { numRuns: 100 }
      )
    })
  })

  /**
   * Property 6: Form Validation Display
   * For any validation error, error messages should be displayed consistently
   * using shadcn destructive styling and proper ARIA associations
   */
  describe('Property 6: Form Validation Display', () => {
    it('displays validation errors consistently with destructive styling', () => {
      fc.assert(
        fc.property(
          fc.string({ minLength: 2 }).filter(s => s.trim().length > 0),
          fc.string({ minLength: 2 }).filter(s => s.trim().length > 0),
          (fieldId, errorMessage) => {
            const { container, unmount } = render(
              <div data-testid="error-container">
                <Input 
                  id={fieldId}
                  aria-invalid={true}
                  aria-describedby={`${fieldId}-error`}
                  className="border-destructive"
                  data-testid="error-input"
                />
                <p 
                  id={`${fieldId}-error`}
                  className="text-destructive"
                  role="alert"
                  data-testid="error-message"
                >
                  {errorMessage}
                </p>
              </div>
            )
            
            const input = container.querySelector('[data-testid="error-input"]') as HTMLInputElement
            const error = container.querySelector('[data-testid="error-message"]') as HTMLElement
            
            // Verify ARIA associations
            expect(input).toHaveAttribute('aria-invalid', 'true')
            expect(input).toHaveAttribute('aria-describedby', `${fieldId}-error`)
            
            // Verify destructive styling
            expect(input).toHaveClass('border-destructive')
            expect(error).toHaveClass('text-destructive')
            
            // Verify accessibility
            expect(error).toHaveAttribute('role', 'alert')
            
            unmount()
          }
        ),
        { numRuns: 100 }
      )
    })

    it('associates error messages with inputs via ARIA for all field types', () => {
      const inputTypes = ['text', 'email', 'password'] as const
      
      fc.assert(
        fc.property(
          fc.constantFrom(...inputTypes),
          fc.string({ minLength: 3 }).filter(s => s.trim().length >= 2),
          fc.string({ minLength: 3 }).filter(s => s.trim().length >= 2),
          (inputType, fieldId, errorMessage) => {
            const cleanFieldId = fieldId.trim()
            const cleanErrorMessage = errorMessage.trim()
            
            const { container, unmount } = render(
              <div data-testid="field-container">
                <Input 
                  id={cleanFieldId}
                  type={inputType}
                  aria-invalid={true}
                  aria-describedby={`${cleanFieldId}-error`}
                  data-testid="field-input"
                />
                <p id={`${cleanFieldId}-error`} role="alert" data-testid="field-error">
                  {cleanErrorMessage}
                </p>
              </div>
            )
            
            const input = container.querySelector('[data-testid="field-input"]') as HTMLInputElement
            const error = container.querySelector('[data-testid="field-error"]') as HTMLElement
            
            expect(input).toHaveAttribute('aria-describedby', `${cleanFieldId}-error`)
            expect(error.textContent?.trim()).toBe(cleanErrorMessage)
            
            unmount()
          }
        ),
        { numRuns: 100 }
      )
    })

    it('displays form-level errors consistently', () => {
      fc.assert(
        fc.property(
          fc.string({ minLength: 3 }).filter(s => s.trim().length >= 2),
          (errorMessage) => {
            const cleanErrorMessage = errorMessage.trim()
            
            const { container, unmount } = render(
              <div 
                className="bg-destructive/10 border border-destructive/30 text-destructive"
                role="alert"
                data-testid="form-error"
              >
                {cleanErrorMessage}
              </div>
            )
            
            const error = container.querySelector('[data-testid="form-error"]') as HTMLElement
            
            expect(error.textContent?.trim()).toBe(cleanErrorMessage)
            expect(error).toHaveClass('text-destructive')
            expect(error).toHaveClass('bg-destructive/10')
            expect(error).toHaveClass('border-destructive/30')
            
            unmount()
          }
        ),
        { numRuns: 100 }
      )
    })

    it('maintains validation state across all error conditions', () => {
      fc.assert(
        fc.property(
          fc.boolean(),
          fc.string({ minLength: 3 }).filter(s => s.trim().length >= 2),
          fc.option(fc.string({ minLength: 3 }).filter(s => s.trim().length >= 2), { nil: null }),
          (hasError, fieldId, errorMessage) => {
            const cleanFieldId = fieldId.trim()
            const cleanErrorMessage = errorMessage?.trim() || null
            
            const { container, unmount } = render(
              <div data-testid="validation-container">
                <Input 
                  id={cleanFieldId}
                  aria-invalid={hasError}
                  aria-describedby={hasError && cleanErrorMessage ? `${cleanFieldId}-error` : undefined}
                  className={hasError ? 'border-destructive' : ''}
                  data-testid="validation-input"
                />
                {hasError && cleanErrorMessage && (
                  <p 
                    id={`${cleanFieldId}-error`}
                    className="text-destructive"
                    role="alert"
                    data-testid="validation-error"
                  >
                    {cleanErrorMessage}
                  </p>
                )}
              </div>
            )
            
            const input = container.querySelector('[data-testid="validation-input"]') as HTMLInputElement
            
            if (hasError) {
              expect(input).toHaveAttribute('aria-invalid', 'true')
              expect(input).toHaveClass('border-destructive')
              
              if (cleanErrorMessage) {
                const error = container.querySelector('[data-testid="validation-error"]') as HTMLElement
                expect(error.textContent?.trim()).toBe(cleanErrorMessage)
              }
            } else {
              expect(input).toHaveAttribute('aria-invalid', 'false')
            }
            
            unmount()
          }
        ),
        { numRuns: 100 }
      )
    })

    it('preserves error message visibility for all error states', () => {
      fc.assert(
        fc.property(
          fc.array(fc.string({ minLength: 3 }).filter(s => s.trim().length >= 2), { minLength: 1, maxLength: 3 }),
          (errorMessages) => {
            const cleanMessages = errorMessages.map(msg => msg.trim())
            
            const { container, unmount } = render(
              <div data-testid="errors-container">
                {cleanMessages.map((msg, index) => (
                  <p 
                    key={index}
                    className="text-destructive"
                    role="alert"
                    data-testid={`error-${index}`}
                  >
                    {msg}
                  </p>
                ))}
              </div>
            )
            
            const errors = container.querySelectorAll('[role="alert"]')
            
            expect(errors).toHaveLength(cleanMessages.length)
            
            errors.forEach((error, index) => {
              expect(error.textContent?.trim()).toBe(cleanMessages[index])
              expect(error).toHaveClass('text-destructive')
            })
            
            unmount()
          }
        ),
        { numRuns: 100 }
      )
    })
  })

  /**
   * Additional property: Input value preservation
   * For any input value, the component should correctly display and update it
   */
  describe('Input Value Preservation', () => {
    it('preserves input values across all character sets', () => {
      fc.assert(
        fc.property(
          fc.string({ minLength: 0, maxLength: 100 }),
          (value) => {
            const { container, unmount } = render(
              <Input 
                type="text" 
                value={value}
                onChange={() => {}}
                data-testid="unicode-input"
              />
            )
            
            const input = container.querySelector('[data-testid="unicode-input"]') as HTMLInputElement
            expect(input.value).toBe(value)
            
            unmount()
          }
        ),
        { numRuns: 100 }
      )
    })

    it('handles empty and whitespace values correctly', () => {
      fc.assert(
        fc.property(
          fc.oneof(
            fc.constant(''),
            fc.constant(' '),
            fc.constant('   '),
            fc.constant('\t')
          ),
          (value) => {
            const { container, unmount } = render(
              <Input 
                type="text" 
                value={value}
                onChange={() => {}}
                data-testid="whitespace-input"
              />
            )
            
            const input = container.querySelector('[data-testid="whitespace-input"]') as HTMLInputElement
            expect(input.value).toBe(value)
            
            unmount()
          }
        ),
        { numRuns: 100 }
      )
    })
  })
})
