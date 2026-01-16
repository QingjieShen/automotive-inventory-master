/**
 * Screen Reader Tests
 * Feature: shadcn-ui-integration
 * Validates: Requirements 11.1, 11.4
 * 
 * Tests screen reader compatibility including:
 * - Proper ARIA labels and roles
 * - Content announcements
 * - Form error announcements
 * - Live region updates
 */

import React, { useState } from 'react'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog'
import { Checkbox } from '@/components/ui/checkbox'
import { Skeleton } from '@/components/ui/skeleton'

describe('Screen Reader Tests', () => {
  /**
   * Test proper ARIA labels and roles
   * Validates: Requirement 11.1
   */
  describe('ARIA Labels and Roles', () => {
    it('should have proper role for buttons', () => {
      render(<Button>Click me</Button>)
      
      const button = screen.getByRole('button', { name: 'Click me' })
      expect(button).toBeInTheDocument()
      expect(button).toHaveAccessibleName('Click me')
    })

    it('should have proper aria-label when text is not descriptive', () => {
      render(<Button aria-label="Close dialog">×</Button>)
      
      const button = screen.getByRole('button', { name: 'Close dialog' })
      expect(button).toBeInTheDocument()
      expect(button).toHaveAttribute('aria-label', 'Close dialog')
    })

    it('should have proper role for checkboxes', () => {
      render(<Checkbox aria-label="Accept terms" />)
      
      const checkbox = screen.getByRole('checkbox', { name: 'Accept terms' })
      expect(checkbox).toBeInTheDocument()
      expect(checkbox).toHaveAttribute('aria-label', 'Accept terms')
    })

    it('should have proper role for inputs with labels', () => {
      render(
        <div>
          <label htmlFor="email">Email Address</label>
          <Input id="email" type="email" />
        </div>
      )
      
      const input = screen.getByLabelText('Email Address')
      expect(input).toBeInTheDocument()
      expect(input).toHaveAccessibleName('Email Address')
    })

    it('should have proper heading hierarchy in cards', () => {
      render(
        <Card>
          <CardHeader>
            <CardTitle>Card Title</CardTitle>
            <CardDescription>Card description</CardDescription>
          </CardHeader>
          <CardContent>Content</CardContent>
        </Card>
      )
      
      const heading = screen.getByRole('heading', { name: 'Card Title' })
      expect(heading).toBeInTheDocument()
      expect(heading.tagName).toBe('H3')
    })

    it('should have proper dialog role and labels', () => {
      render(
        <Dialog open={true}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Confirm Action</DialogTitle>
              <DialogDescription>Are you sure you want to proceed?</DialogDescription>
            </DialogHeader>
          </DialogContent>
        </Dialog>
      )
      
      const dialog = screen.getByRole('dialog', { name: 'Confirm Action' })
      expect(dialog).toBeInTheDocument()
      expect(screen.getByText('Are you sure you want to proceed?')).toBeInTheDocument()
    })

    it('should have descriptive accessible names for icon buttons', () => {
      render(
        <div>
          <Button aria-label="Edit vehicle" size="icon">
            <span aria-hidden="true">✏️</span>
          </Button>
          <Button aria-label="Delete vehicle" size="icon">
            <span aria-hidden="true">🗑️</span>
          </Button>
        </div>
      )
      
      expect(screen.getByRole('button', { name: 'Edit vehicle' })).toBeInTheDocument()
      expect(screen.getByRole('button', { name: 'Delete vehicle' })).toBeInTheDocument()
    })
  })

  /**
   * Test content announcements
   * Validates: Requirement 11.1
   */
  describe('Content Announcements', () => {
    it('should announce button state changes', () => {
      const TestComponent = () => {
        const [pressed, setPressed] = useState(false)
        
        return (
          <Button 
            aria-pressed={pressed}
            onClick={() => setPressed(!pressed)}
          >
            {pressed ? 'Active' : 'Inactive'}
          </Button>
        )
      }
      
      render(<TestComponent />)
      
      const button = screen.getByRole('button')
      expect(button).toHaveAttribute('aria-pressed', 'false')
      expect(button).toHaveTextContent('Inactive')
    })

    it('should announce checkbox state', () => {
      render(<Checkbox aria-label="Subscribe to newsletter" defaultChecked={true} />)
      
      const checkbox = screen.getByRole('checkbox', { name: 'Subscribe to newsletter' })
      expect(checkbox).toHaveAttribute('data-state', 'checked')
    })

    it('should announce disabled state', () => {
      render(<Button disabled>Disabled Button</Button>)
      
      const button = screen.getByRole('button', { name: 'Disabled Button' })
      expect(button).toBeDisabled()
      expect(button).toHaveAttribute('disabled')
    })

    it('should announce loading state with proper attributes', () => {
      render(
        <div role="status" aria-live="polite" aria-label="Loading content">
          <Skeleton className="h-4 w-[250px]" />
          <span className="sr-only">Loading...</span>
        </div>
      )
      
      const status = screen.getByRole('status')
      expect(status).toHaveAttribute('aria-live', 'polite')
      expect(screen.getByText('Loading...')).toHaveClass('sr-only')
    })

    it('should have screen reader only text for context', () => {
      render(
        <Button>
          Delete
          <span className="sr-only"> vehicle ABC123</span>
        </Button>
      )
      
      const button = screen.getByRole('button')
      expect(button).toHaveTextContent('Delete vehicle ABC123')
      
      // Screen reader only text should be in the DOM but visually hidden
      const srText = button.querySelector('.sr-only')
      expect(srText).toBeInTheDocument()
    })
  })

  /**
   * Test form error announcements
   * Validates: Requirement 11.4
   */
  describe('Form Error Announcements', () => {
    it('should announce form errors with role="alert"', () => {
      render(
        <div>
          <label htmlFor="email">Email</label>
          <Input 
            id="email" 
            type="email" 
            aria-invalid="true"
            aria-describedby="email-error"
          />
          <span id="email-error" role="alert" className="text-destructive">
            Please enter a valid email address
          </span>
        </div>
      )
      
      const input = screen.getByLabelText('Email')
      expect(input).toHaveAttribute('aria-invalid', 'true')
      expect(input).toHaveAttribute('aria-describedby', 'email-error')
      
      const error = screen.getByRole('alert')
      expect(error).toHaveTextContent('Please enter a valid email address')
      expect(error).toHaveAttribute('id', 'email-error')
    })

    it('should associate error messages with inputs', () => {
      render(
        <form>
          <div>
            <label htmlFor="password">Password</label>
            <Input 
              id="password" 
              type="password" 
              aria-invalid="true"
              aria-describedby="password-error"
            />
            <span id="password-error" role="alert">
              Password must be at least 8 characters
            </span>
          </div>
        </form>
      )
      
      const input = screen.getByLabelText('Password')
      const errorId = input.getAttribute('aria-describedby')
      
      expect(errorId).toBe('password-error')
      expect(screen.getByText('Password must be at least 8 characters')).toHaveAttribute('id', errorId)
    })

    it('should announce required fields', () => {
      render(
        <div>
          <label htmlFor="name">
            Name
            <span aria-label="required">*</span>
          </label>
          <Input id="name" required aria-required="true" />
        </div>
      )
      
      const input = screen.getByLabelText(/Name/)
      expect(input).toHaveAttribute('required')
      expect(input).toHaveAttribute('aria-required', 'true')
    })

    it('should announce validation state changes', async () => {
      const user = userEvent.setup()
      
      const TestComponent = () => {
        const [error, setError] = useState('')
        
        const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
          if (!e.target.value.includes('@')) {
            setError('Invalid email format')
          } else {
            setError('')
          }
        }
        
        return (
          <div>
            <label htmlFor="email">Email</label>
            <Input 
              id="email" 
              type="email" 
              onBlur={handleBlur}
              aria-invalid={!!error}
              aria-describedby={error ? 'email-error' : undefined}
            />
            {error && (
              <span id="email-error" role="alert" className="text-destructive">
                {error}
              </span>
            )}
          </div>
        )
      }
      
      render(<TestComponent />)
      
      const input = screen.getByLabelText('Email')
      
      // Type invalid email and blur
      await user.type(input, 'invalid')
      await user.tab()
      
      // Error should be announced
      await waitFor(() => {
        const error = screen.getByRole('alert')
        expect(error).toHaveTextContent('Invalid email format')
        expect(input).toHaveAttribute('aria-invalid', 'true')
      })
    })
  })

  /**
   * Test live region updates
   * Validates: Requirement 11.4
   */
  describe('Live Region Updates', () => {
    it('should announce status updates with aria-live', () => {
      const TestComponent = () => {
        const [status, setStatus] = useState('Idle')
        
        return (
          <div>
            <Button onClick={() => setStatus('Processing...')}>Start</Button>
            <div role="status" aria-live="polite" aria-atomic="true">
              {status}
            </div>
          </div>
        )
      }
      
      render(<TestComponent />)
      
      const statusRegion = screen.getByRole('status')
      expect(statusRegion).toHaveAttribute('aria-live', 'polite')
      expect(statusRegion).toHaveAttribute('aria-atomic', 'true')
      expect(statusRegion).toHaveTextContent('Idle')
    })

    it('should announce success messages', () => {
      render(
        <div role="status" aria-live="polite">
          <Badge variant="success">Vehicle saved successfully</Badge>
        </div>
      )
      
      const status = screen.getByRole('status')
      expect(status).toHaveAttribute('aria-live', 'polite')
      expect(screen.getByText('Vehicle saved successfully')).toBeInTheDocument()
    })

    it('should announce error messages assertively', () => {
      render(
        <div role="alert" aria-live="assertive">
          <Badge variant="destructive">Failed to save vehicle</Badge>
        </div>
      )
      
      const alert = screen.getByRole('alert')
      expect(alert).toHaveAttribute('aria-live', 'assertive')
      expect(screen.getByText('Failed to save vehicle')).toBeInTheDocument()
    })

    it('should announce dynamic content updates', async () => {
      const user = userEvent.setup()
      
      const TestComponent = () => {
        const [count, setCount] = useState(0)
        
        return (
          <div>
            <Button onClick={() => setCount(count + 1)}>Add Item</Button>
            <div role="status" aria-live="polite">
              {count} {count === 1 ? 'item' : 'items'} selected
            </div>
          </div>
        )
      }
      
      render(<TestComponent />)
      
      const button = screen.getByRole('button', { name: 'Add Item' })
      const status = screen.getByRole('status')
      
      expect(status).toHaveTextContent('0 items selected')
      
      await user.click(button)
      
      await waitFor(() => {
        expect(status).toHaveTextContent('1 item selected')
      })
    })
  })

  /**
   * Test complex screen reader scenarios
   * Validates: Requirements 11.1, 11.4
   */
  describe('Complex Screen Reader Scenarios', () => {
    it('should properly announce vehicle card information', () => {
      render(
        <Card role="article" aria-label="Vehicle: 2024 Toyota Camry">
          <CardContent>
            <div className="flex items-center justify-between">
              <Checkbox aria-label="Select 2024 Toyota Camry" />
              <Badge variant="success" aria-label="Status: Available">Available</Badge>
            </div>
            <h3>2024 Toyota Camry</h3>
            <p>
              <span className="sr-only">Stock number:</span>
              ABC123
            </p>
            <Button aria-label="View details for 2024 Toyota Camry">View Details</Button>
          </CardContent>
        </Card>
      )
      
      const card = screen.getByRole('article')
      expect(card).toHaveAttribute('aria-label', 'Vehicle: 2024 Toyota Camry')
      
      const checkbox = screen.getByRole('checkbox')
      expect(checkbox).toHaveAccessibleName('Select 2024 Toyota Camry')
      
      const button = screen.getByRole('button')
      expect(button).toHaveAccessibleName('View details for 2024 Toyota Camry')
    })

    it('should properly announce form with multiple fields and errors', () => {
      render(
        <form aria-label="Add vehicle form">
          <div>
            <label htmlFor="stock">Stock Number</label>
            <Input 
              id="stock" 
              aria-invalid="true"
              aria-describedby="stock-error"
            />
            <span id="stock-error" role="alert">Stock number is required</span>
          </div>
          <div>
            <label htmlFor="make">Make</label>
            <Input id="make" />
          </div>
          <Button type="submit">Save Vehicle</Button>
        </form>
      )
      
      const form = screen.getByRole('form')
      expect(form).toHaveAttribute('aria-label', 'Add vehicle form')
      
      const stockInput = screen.getByLabelText('Stock Number')
      expect(stockInput).toHaveAttribute('aria-invalid', 'true')
      expect(stockInput).toHaveAttribute('aria-describedby', 'stock-error')
      
      const error = screen.getByRole('alert')
      expect(error).toHaveTextContent('Stock number is required')
    })

    it('should properly announce dialog with form', () => {
      render(
        <Dialog open={true}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Vehicle</DialogTitle>
              <DialogDescription>Enter the vehicle information below</DialogDescription>
            </DialogHeader>
            <form>
              <label htmlFor="vin">VIN</label>
              <Input id="vin" aria-required="true" />
            </form>
          </DialogContent>
        </Dialog>
      )
      
      const dialog = screen.getByRole('dialog')
      expect(dialog).toHaveAccessibleName('Add New Vehicle')
      
      const description = screen.getByText('Enter the vehicle information below')
      expect(description).toBeInTheDocument()
      
      const input = screen.getByLabelText('VIN')
      expect(input).toHaveAttribute('aria-required', 'true')
    })
  })
})
