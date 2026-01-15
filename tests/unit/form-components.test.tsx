import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

/**
 * Unit tests for form components after shadcn/ui migration
 * Feature: shadcn-ui-integration
 * Validates: Requirements 5.1, 5.2, 5.3, 5.4
 */

describe('Form Components - shadcn/ui Migration', () => {
  describe('Input Component', () => {
    it('renders text input correctly', () => {
      render(<Input type="text" placeholder="Enter text" />)
      const input = screen.getByPlaceholderText('Enter text')
      expect(input).toBeInTheDocument()
      expect(input).toHaveAttribute('type', 'text')
    })

    it('handles value changes', async () => {
      const user = userEvent.setup()
      const handleChange = jest.fn()
      
      render(
        <Input 
          type="text" 
          placeholder="Type here" 
          onChange={handleChange}
        />
      )
      
      const input = screen.getByPlaceholderText('Type here')
      await user.type(input, 'test value')
      
      expect(handleChange).toHaveBeenCalled()
    })

    it('renders disabled state', () => {
      render(<Input disabled placeholder="Disabled input" />)
      const input = screen.getByPlaceholderText('Disabled input')
      expect(input).toBeDisabled()
    })

    it('applies custom className', () => {
      render(<Input className="custom-class" placeholder="Custom" />)
      const input = screen.getByPlaceholderText('Custom')
      expect(input).toHaveClass('custom-class')
    })

    it('supports email type', () => {
      render(<Input type="email" placeholder="Enter email" />)
      const input = screen.getByPlaceholderText('Enter email')
      expect(input).toHaveAttribute('type', 'email')
    })

    it('supports password type', () => {
      render(<Input type="password" placeholder="Enter password" />)
      const input = screen.getByPlaceholderText('Enter password')
      expect(input).toHaveAttribute('type', 'password')
    })

    it('supports file type', () => {
      render(<Input type="file" accept="image/*" />)
      const input = document.querySelector('input[type="file"]')
      expect(input).toHaveAttribute('type', 'file')
      expect(input).toHaveAttribute('accept', 'image/*')
    })
  })

  describe('Button Component', () => {
    it('renders with default variant', () => {
      render(<Button>Click me</Button>)
      const button = screen.getByRole('button', { name: /click me/i })
      expect(button).toBeInTheDocument()
    })

    it('handles click events', async () => {
      const handleClick = jest.fn()
      const user = userEvent.setup()
      
      render(<Button onClick={handleClick}>Click me</Button>)
      const button = screen.getByRole('button', { name: /click me/i })
      
      await user.click(button)
      expect(handleClick).toHaveBeenCalledTimes(1)
    })

    it('renders disabled state', () => {
      render(<Button disabled>Disabled</Button>)
      const button = screen.getByRole('button', { name: /disabled/i })
      expect(button).toBeDisabled()
    })

    it('renders outline variant', () => {
      render(<Button variant="outline">Outline</Button>)
      const button = screen.getByRole('button', { name: /outline/i })
      expect(button).toBeInTheDocument()
    })

    it('renders destructive variant', () => {
      render(<Button variant="destructive">Delete</Button>)
      const button = screen.getByRole('button', { name: /delete/i })
      expect(button).toBeInTheDocument()
    })

    it('supports different sizes', () => {
      const { rerender } = render(<Button size="sm">Small</Button>)
      expect(screen.getByRole('button')).toBeInTheDocument()
      
      rerender(<Button size="lg">Large</Button>)
      expect(screen.getByRole('button')).toBeInTheDocument()
    })
  })

  describe('Form Validation Display', () => {
    it('displays validation error with destructive styling', () => {
      render(
        <div>
          <Input 
            id="test-input"
            aria-invalid={true}
            aria-describedby="test-error"
            className="border-destructive"
          />
          <p id="test-error" className="text-destructive" role="alert">
            This field is required
          </p>
        </div>
      )
      
      const input = screen.getByRole('textbox')
      const error = screen.getByText('This field is required')
      
      expect(input).toHaveAttribute('aria-invalid', 'true')
      expect(input).toHaveAttribute('aria-describedby', 'test-error')
      expect(error).toHaveClass('text-destructive')
      expect(error).toHaveAttribute('role', 'alert')
    })

    it('associates error messages with inputs via ARIA', () => {
      render(
        <div>
          <label htmlFor="email-input">Email</label>
          <Input 
            id="email-input"
            type="email"
            aria-invalid={true}
            aria-describedby="email-error"
          />
          <p id="email-error" role="alert">Invalid email format</p>
        </div>
      )
      
      const input = screen.getByLabelText('Email')
      expect(input).toHaveAttribute('aria-describedby', 'email-error')
      expect(screen.getByRole('alert')).toHaveTextContent('Invalid email format')
    })

    it('displays success validation state', () => {
      render(
        <div>
          <Input id="valid-input" />
          <p className="text-green-600">✓ Valid input</p>
        </div>
      )
      
      expect(screen.getByText('✓ Valid input')).toBeInTheDocument()
    })
  })

  describe('Form Submission', () => {
    it('handles form submission with Input and Button', async () => {
      const handleSubmit = jest.fn((e) => e.preventDefault())
      const user = userEvent.setup()
      
      render(
        <form onSubmit={handleSubmit}>
          <Input 
            type="text" 
            placeholder="Enter value"
            required
          />
          <Button type="submit">Submit</Button>
        </form>
      )
      
      const input = screen.getByPlaceholderText('Enter value')
      const button = screen.getByRole('button', { name: /submit/i })
      
      await user.type(input, 'test value')
      await user.click(button)
      
      expect(handleSubmit).toHaveBeenCalled()
    })

    it('prevents submission when button is disabled', async () => {
      const handleSubmit = jest.fn((e) => e.preventDefault())
      const user = userEvent.setup()
      
      render(
        <form onSubmit={handleSubmit}>
          <Input type="text" placeholder="Enter value" />
          <Button type="submit" disabled>Submit</Button>
        </form>
      )
      
      const button = screen.getByRole('button', { name: /submit/i })
      
      await user.click(button)
      
      expect(handleSubmit).not.toHaveBeenCalled()
    })
  })

  describe('Form Error Display', () => {
    it('displays form-level errors with destructive styling', () => {
      render(
        <div 
          className="bg-destructive/10 border border-destructive/30 text-destructive"
          role="alert"
        >
          Form submission failed
        </div>
      )
      
      const error = screen.getByRole('alert')
      expect(error).toHaveTextContent('Form submission failed')
      expect(error).toHaveClass('text-destructive')
    })

    it('displays field-level errors with ARIA live region', () => {
      render(
        <div>
          <Input 
            id="username"
            aria-invalid={true}
            aria-describedby="username-error"
          />
          <p 
            id="username-error" 
            className="text-destructive"
            role="alert"
          >
            Username is required
          </p>
        </div>
      )
      
      const error = screen.getByRole('alert')
      expect(error).toHaveTextContent('Username is required')
    })
  })

  describe('Accessibility', () => {
    it('maintains proper label associations', () => {
      render(
        <div>
          <label htmlFor="test-field">Test Field</label>
          <Input id="test-field" />
        </div>
      )
      
      const input = screen.getByLabelText('Test Field')
      expect(input).toBeInTheDocument()
    })

    it('supports keyboard navigation', async () => {
      const user = userEvent.setup()
      
      render(
        <form>
          <Input placeholder="Field 1" />
          <Input placeholder="Field 2" />
          <Button>Submit</Button>
        </form>
      )
      
      const field1 = screen.getByPlaceholderText('Field 1')
      const field2 = screen.getByPlaceholderText('Field 2')
      const button = screen.getByRole('button')
      
      field1.focus()
      expect(field1).toHaveFocus()
      
      await user.tab()
      expect(field2).toHaveFocus()
      
      await user.tab()
      expect(button).toHaveFocus()
    })

    it('announces errors to screen readers', () => {
      render(
        <div>
          <Input 
            aria-invalid={true}
            aria-describedby="error-msg"
          />
          <p id="error-msg" role="alert" aria-live="polite">
            Error message
          </p>
        </div>
      )
      
      const error = screen.getByRole('alert')
      expect(error).toHaveAttribute('aria-live', 'polite')
    })
  })
})
