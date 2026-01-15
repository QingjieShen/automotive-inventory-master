/**
 * Property-Based Tests for shadcn/ui Core Components
 * Feature: shadcn-ui-integration, Property 1: Component Accessibility
 * Validates: Requirements 11.1, 11.2, 11.4, 11.5
 */

import React from 'react'
import { render, screen } from '@testing-library/react'
import * as fc from 'fast-check'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Checkbox } from '@/components/ui/checkbox'

describe('Property 1: Component Accessibility', () => {
  /**
   * Property: All Button components should have proper ARIA attributes and focus indicators
   * Validates: Requirements 11.1, 11.2, 11.5
   */
  it('Button components include proper ARIA attributes and are focusable', () => {
    fc.assert(
      fc.property(
        fc.string({ minLength: 1, maxLength: 50 }),
        fc.constantFrom('default', 'destructive', 'outline', 'secondary', 'ghost', 'link'),
        fc.boolean(),
        (buttonText, variant, disabled) => {
          const { container } = render(
            <Button variant={variant as any} disabled={disabled}>
              {buttonText}
            </Button>
          )

          const button = screen.getByRole('button', { name: buttonText })
          
          // Requirement 11.1: Proper ARIA roles
          expect(button).toBeInTheDocument()
          expect(button.tagName).toBe('BUTTON')
          
          // Requirement 11.2: Focus indicators
          expect(button).toHaveClass('focus-visible:outline-none')
          expect(button).toHaveClass('focus-visible:ring-2')
          
          // Requirement 11.5: Descriptive accessible names
          expect(button).toHaveAccessibleName(buttonText)
          
          // Disabled state should be properly indicated
          if (disabled) {
            expect(button).toBeDisabled()
            expect(button).toHaveClass('disabled:opacity-50')
          }
        }
      ),
      { numRuns: 100 }
    )
  })

  /**
   * Property: All Input components should have proper focus indicators
   * Validates: Requirements 11.2
   */
  it('Input components have visible focus indicators', () => {
    fc.assert(
      fc.property(
        fc.string({ minLength: 1, maxLength: 30 }),
        fc.constantFrom('text', 'email', 'password', 'number'),
        fc.boolean(),
        (placeholder, inputType, disabled) => {
          const { container } = render(
            <Input
              type={inputType as any}
              placeholder={placeholder}
              disabled={disabled}
              aria-label={placeholder}
            />
          )

          const input = screen.getByPlaceholderText(placeholder)
          
          // Requirement 11.2: Focus indicators are visible
          expect(input).toHaveClass('focus-visible:outline-none')
          expect(input).toHaveClass('focus-visible:ring-2')
          expect(input).toHaveClass('focus-visible:ring-ring')
          
          // Requirement 11.1: Proper ARIA labels
          expect(input).toHaveAttribute('aria-label', placeholder)
          
          // Disabled state
          if (disabled) {
            expect(input).toBeDisabled()
            expect(input).toHaveClass('disabled:cursor-not-allowed')
          }
        }
      ),
      { numRuns: 100 }
    )
  })

  /**
   * Property: All Checkbox components should have proper ARIA attributes and focus indicators
   * Validates: Requirements 11.1, 11.2
   */
  it('Checkbox components include proper ARIA attributes and focus indicators', () => {
    fc.assert(
      fc.property(
        fc.string({ minLength: 1, maxLength: 30 }),
        fc.boolean(),
        fc.boolean(),
        (label, checked, disabled) => {
          const { container } = render(
            <Checkbox
              aria-label={label}
              defaultChecked={checked}
              disabled={disabled}
            />
          )

          const checkbox = screen.getByRole('checkbox', { name: label })
          
          // Requirement 11.1: Proper ARIA roles and labels
          expect(checkbox).toBeInTheDocument()
          expect(checkbox).toHaveAttribute('aria-label', label)
          
          // Requirement 11.2: Focus indicators
          expect(checkbox).toHaveClass('focus-visible:outline-none')
          expect(checkbox).toHaveClass('focus-visible:ring-2')
          
          // Checked state
          if (checked) {
            expect(checkbox).toHaveAttribute('data-state', 'checked')
          }
          
          // Disabled state
          if (disabled) {
            expect(checkbox).toBeDisabled()
            expect(checkbox).toHaveClass('disabled:cursor-not-allowed')
          }
        }
      ),
      { numRuns: 100 }
    )
  })

  /**
   * Property: All Badge components should have proper text content
   * Validates: Requirements 11.5
   */
  it('Badge components have accessible text content', () => {
    fc.assert(
      fc.property(
        fc.string({ minLength: 1, maxLength: 20 }),
        fc.constantFrom('default', 'secondary', 'destructive', 'outline', 'success', 'warning'),
        (badgeText, variant) => {
          const { container } = render(
            <Badge variant={variant as any}>{badgeText}</Badge>
          )

          // Requirement 11.5: Descriptive accessible names
          expect(screen.getByText(badgeText)).toBeInTheDocument()
          
          // Badge should be visible and have proper styling
          const badge = screen.getByText(badgeText)
          expect(badge).toHaveClass('inline-flex')
          expect(badge).toHaveClass('items-center')
        }
      ),
      { numRuns: 100 }
    )
  })

  /**
   * Property: All Card components should have proper semantic structure
   * Validates: Requirements 11.1
   */
  it('Card components have proper semantic structure', () => {
    fc.assert(
      fc.property(
        fc.string({ minLength: 1, maxLength: 50 }),
        fc.string({ minLength: 1, maxLength: 100 }),
        (title, content) => {
          const { container } = render(
            <Card>
              <CardHeader>
                <CardTitle>{title}</CardTitle>
              </CardHeader>
              <CardContent>{content}</CardContent>
            </Card>
          )

          // Requirement 11.1: Proper semantic structure
          expect(screen.getByText(title)).toBeInTheDocument()
          expect(screen.getByText(content)).toBeInTheDocument()
          
          // CardTitle should be an h3 element
          const titleElement = screen.getByText(title)
          expect(titleElement.tagName).toBe('H3')
        }
      ),
      { numRuns: 100 }
    )
  })

  /**
   * Property: Interactive elements should have consistent focus ring styling
   * Validates: Requirements 11.2
   */
  it('All interactive components have consistent focus ring styling', () => {
    fc.assert(
      fc.property(
        fc.string({ minLength: 1, maxLength: 30 }).filter(s => s.trim().length > 0),
        (text) => {
          // Test Button - render and cleanup
          const { unmount: unmountButton } = render(<Button>{text}</Button>)
          const button = screen.getByRole('button', { name: text })
          expect(button).toHaveClass('focus-visible:ring-2')
          expect(button).toHaveClass('focus-visible:ring-ring')
          unmountButton()
          
          // Test Input - render and cleanup
          const { unmount: unmountInput } = render(
            <Input placeholder={text} aria-label={text} />
          )
          const input = screen.getByPlaceholderText(text)
          expect(input).toHaveClass('focus-visible:ring-2')
          expect(input).toHaveClass('focus-visible:ring-ring')
          unmountInput()
          
          // Test Checkbox - render and cleanup
          const { unmount: unmountCheckbox } = render(
            <Checkbox aria-label={text} />
          )
          const checkbox = screen.getByRole('checkbox', { name: text })
          expect(checkbox).toHaveClass('focus-visible:ring-2')
          expect(checkbox).toHaveClass('focus-visible:ring-ring')
          unmountCheckbox()
        }
      ),
      { numRuns: 100 }
    )
  })
})
