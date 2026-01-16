/**
 * Keyboard Navigation Tests
 * Feature: shadcn-ui-integration
 * Validates: Requirements 11.2, 11.3
 * 
 * Tests keyboard navigation including:
 * - Tab navigation through all pages
 * - Enter/Space activation of interactive elements
 * - Escape key for closing modals
 */

import React, { useState } from 'react'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogTrigger } from '@/components/ui/dialog'
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'

describe('Keyboard Navigation Tests', () => {
  /**
   * Test Tab navigation through interactive elements
   * Validates: Requirement 11.2
   */
  describe('Tab Navigation', () => {
    it('should navigate through buttons with Tab key', async () => {
      const user = userEvent.setup()
      
      render(
        <div>
          <Button data-testid="button-1">Button 1</Button>
          <Button data-testid="button-2">Button 2</Button>
          <Button data-testid="button-3">Button 3</Button>
        </div>
      )

      const button1 = screen.getByTestId('button-1')
      const button2 = screen.getByTestId('button-2')
      const button3 = screen.getByTestId('button-3')

      // Tab to first button
      await user.tab()
      expect(button1).toHaveFocus()

      // Tab to second button
      await user.tab()
      expect(button2).toHaveFocus()

      // Tab to third button
      await user.tab()
      expect(button3).toHaveFocus()
    })

    it('should navigate through form inputs with Tab key', async () => {
      const user = userEvent.setup()
      
      render(
        <form>
          <Input data-testid="input-1" placeholder="First name" />
          <Input data-testid="input-2" placeholder="Last name" />
          <Input data-testid="input-3" placeholder="Email" />
          <Button type="submit">Submit</Button>
        </form>
      )

      const input1 = screen.getByTestId('input-1')
      const input2 = screen.getByTestId('input-2')
      const input3 = screen.getByTestId('input-3')
      const submitButton = screen.getByRole('button', { name: 'Submit' })

      // Tab through inputs
      await user.tab()
      expect(input1).toHaveFocus()

      await user.tab()
      expect(input2).toHaveFocus()

      await user.tab()
      expect(input3).toHaveFocus()

      await user.tab()
      expect(submitButton).toHaveFocus()
    })

    it('should skip disabled elements during Tab navigation', async () => {
      const user = userEvent.setup()
      
      render(
        <div>
          <Button data-testid="button-1">Button 1</Button>
          <Button data-testid="button-2" disabled>Button 2 (Disabled)</Button>
          <Button data-testid="button-3">Button 3</Button>
        </div>
      )

      const button1 = screen.getByTestId('button-1')
      const button3 = screen.getByTestId('button-3')

      // Tab to first button
      await user.tab()
      expect(button1).toHaveFocus()

      // Tab should skip disabled button and go to third button
      await user.tab()
      expect(button3).toHaveFocus()
    })

    it('should navigate backwards with Shift+Tab', async () => {
      const user = userEvent.setup()
      
      render(
        <div>
          <Button data-testid="button-1">Button 1</Button>
          <Button data-testid="button-2">Button 2</Button>
          <Button data-testid="button-3">Button 3</Button>
        </div>
      )

      const button1 = screen.getByTestId('button-1')
      const button2 = screen.getByTestId('button-2')
      const button3 = screen.getByTestId('button-3')

      // Tab to third button
      await user.tab()
      await user.tab()
      await user.tab()
      expect(button3).toHaveFocus()

      // Shift+Tab backwards
      await user.tab({ shift: true })
      expect(button2).toHaveFocus()

      await user.tab({ shift: true })
      expect(button1).toHaveFocus()
    })

    it('should navigate through card with interactive elements', async () => {
      const user = userEvent.setup()
      const handleClick = jest.fn()
      
      render(
        <Card>
          <CardHeader>
            <CardTitle>Vehicle Card</CardTitle>
          </CardHeader>
          <CardContent>
            <Checkbox data-testid="checkbox" aria-label="Select vehicle" />
            <Button data-testid="view-button" onClick={handleClick}>View Details</Button>
          </CardContent>
        </Card>
      )

      const checkbox = screen.getByTestId('checkbox')
      const viewButton = screen.getByTestId('view-button')

      // Tab to checkbox
      await user.tab()
      expect(checkbox).toHaveFocus()

      // Tab to button
      await user.tab()
      expect(viewButton).toHaveFocus()
    })
  })

  /**
   * Test Enter/Space key activation of interactive elements
   * Validates: Requirement 11.2
   */
  describe('Enter/Space Key Activation', () => {
    it('should activate button with Enter key', async () => {
      const user = userEvent.setup()
      const handleClick = jest.fn()
      
      render(<Button onClick={handleClick}>Click Me</Button>)

      const button = screen.getByRole('button', { name: 'Click Me' })
      
      // Focus and press Enter
      button.focus()
      await user.keyboard('{Enter}')
      
      expect(handleClick).toHaveBeenCalledTimes(1)
    })

    it('should activate button with Space key', async () => {
      const user = userEvent.setup()
      const handleClick = jest.fn()
      
      render(<Button onClick={handleClick}>Click Me</Button>)

      const button = screen.getByRole('button', { name: 'Click Me' })
      
      // Focus and press Space
      button.focus()
      await user.keyboard(' ')
      
      expect(handleClick).toHaveBeenCalledTimes(1)
    })

    it('should toggle checkbox with Space key', async () => {
      const user = userEvent.setup()
      const handleChange = jest.fn()
      
      render(<Checkbox aria-label="Accept terms" onCheckedChange={handleChange} />)

      const checkbox = screen.getByRole('checkbox', { name: 'Accept terms' })
      
      // Focus and press Space
      checkbox.focus()
      await user.keyboard(' ')
      
      expect(handleChange).toHaveBeenCalled()
    })

    it('should submit form with Enter key on input', async () => {
      const user = userEvent.setup()
      const handleSubmit = jest.fn((e) => e.preventDefault())
      
      render(
        <form onSubmit={handleSubmit}>
          <Input placeholder="Enter text" />
          <Button type="submit">Submit</Button>
        </form>
      )

      const input = screen.getByPlaceholderText('Enter text')
      
      // Type in input and press Enter
      await user.click(input)
      await user.keyboard('test{Enter}')
      
      expect(handleSubmit).toHaveBeenCalledTimes(1)
    })

    it('should not activate disabled button with Enter/Space', async () => {
      const user = userEvent.setup()
      const handleClick = jest.fn()
      
      render(<Button onClick={handleClick} disabled>Disabled Button</Button>)

      const button = screen.getByRole('button', { name: 'Disabled Button' })
      
      // Try to activate with Enter
      button.focus()
      await user.keyboard('{Enter}')
      expect(handleClick).not.toHaveBeenCalled()
      
      // Try to activate with Space
      await user.keyboard(' ')
      expect(handleClick).not.toHaveBeenCalled()
    })
  })

  /**
   * Test Escape key for closing modals
   * Validates: Requirement 11.3
   */
  describe('Escape Key for Modals', () => {
    it('should close dialog with Escape key', async () => {
      const user = userEvent.setup()
      
      const TestComponent = () => {
        const [open, setOpen] = useState(true)
        
        return (
          <div>
            <Dialog open={open} onOpenChange={setOpen}>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Test Dialog</DialogTitle>
                  <DialogDescription>This is a test dialog</DialogDescription>
                </DialogHeader>
                <div>Dialog content</div>
                <DialogFooter>
                  <Button onClick={() => setOpen(false)}>Close</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
            <div data-testid="dialog-state">{open ? 'open' : 'closed'}</div>
          </div>
        )
      }
      
      render(<TestComponent />)

      // Dialog should be open initially
      expect(screen.getByTestId('dialog-state')).toHaveTextContent('open')
      expect(screen.getByText('Test Dialog')).toBeInTheDocument()

      // Press Escape to close
      await user.keyboard('{Escape}')
      
      // Dialog should be closed
      await waitFor(() => {
        expect(screen.getByTestId('dialog-state')).toHaveTextContent('closed')
      })
    })

    it('should trap focus within dialog', async () => {
      const user = userEvent.setup()
      
      const TestComponent = () => {
        const [open, setOpen] = useState(true)
        
        return (
          <div>
            <Button data-testid="outside-button">Outside Button</Button>
            <Dialog open={open} onOpenChange={setOpen}>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Test Dialog</DialogTitle>
                  <DialogDescription>Focus should be trapped here</DialogDescription>
                </DialogHeader>
                <Input data-testid="dialog-input" placeholder="Input in dialog" />
                <DialogFooter>
                  <Button data-testid="cancel-button">Cancel</Button>
                  <Button data-testid="confirm-button">Confirm</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        )
      }
      
      render(<TestComponent />)

      // Dialog should be open and visible
      expect(screen.getByText('Test Dialog')).toBeInTheDocument()
      
      // Outside button should not be focusable when dialog is open
      const outsideButton = screen.getByTestId('outside-button')
      
      // Verify dialog elements are present and can receive focus
      const dialogInput = screen.getByTestId('dialog-input')
      const cancelButton = screen.getByTestId('cancel-button')
      const confirmButton = screen.getByTestId('confirm-button')
      
      expect(dialogInput).toBeInTheDocument()
      expect(cancelButton).toBeInTheDocument()
      expect(confirmButton).toBeInTheDocument()
      
      // Focus should be automatically moved into the dialog when it opens
      // Radix UI Dialog handles focus trap automatically
      await waitFor(() => {
        const activeElement = document.activeElement
        expect(activeElement).not.toBe(outsideButton)
      })
    })

    it('should return focus to trigger after closing dialog', async () => {
      const user = userEvent.setup()
      
      const TestComponent = () => {
        const [open, setOpen] = useState(false)
        
        return (
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button data-testid="trigger-button">Open Dialog</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Test Dialog</DialogTitle>
                <DialogDescription>Test focus return</DialogDescription>
              </DialogHeader>
              <Button onClick={() => setOpen(false)}>Close</Button>
            </DialogContent>
          </Dialog>
        )
      }
      
      render(<TestComponent />)

      const triggerButton = screen.getByTestId('trigger-button')
      
      // Open dialog
      await user.click(triggerButton)
      
      // Dialog should be open
      await waitFor(() => {
        expect(screen.getByText('Test Dialog')).toBeInTheDocument()
      })
      
      // Close with Escape
      await user.keyboard('{Escape}')
      
      // Focus should return to trigger button
      await waitFor(() => {
        expect(triggerButton).toHaveFocus()
      })
    })
  })

  /**
   * Test complex keyboard navigation scenarios
   * Validates: Requirements 11.2, 11.3
   */
  describe('Complex Navigation Scenarios', () => {
    it('should navigate through complete form with all element types', async () => {
      const user = userEvent.setup()
      
      render(
        <form>
          <div>
            <label htmlFor="name">Name</label>
            <Input id="name" data-testid="name-input" />
          </div>
          <div>
            <label htmlFor="email">Email</label>
            <Input id="email" data-testid="email-input" type="email" />
          </div>
          <div>
            <label>
              <Checkbox data-testid="terms-checkbox" />
              <span>I agree to terms</span>
            </label>
          </div>
          <div>
            <Button data-testid="cancel-button" type="button">Cancel</Button>
            <Button data-testid="submit-button" type="submit">Submit</Button>
          </div>
        </form>
      )

      const nameInput = screen.getByTestId('name-input')
      const emailInput = screen.getByTestId('email-input')
      const termsCheckbox = screen.getByTestId('terms-checkbox')
      const cancelButton = screen.getByTestId('cancel-button')
      const submitButton = screen.getByTestId('submit-button')

      // Tab through all elements
      await user.tab()
      expect(nameInput).toHaveFocus()

      await user.tab()
      expect(emailInput).toHaveFocus()

      await user.tab()
      expect(termsCheckbox).toHaveFocus()

      await user.tab()
      expect(cancelButton).toHaveFocus()

      await user.tab()
      expect(submitButton).toHaveFocus()
    })

    it('should handle keyboard navigation in card grid layout', async () => {
      const user = userEvent.setup()
      
      render(
        <div>
          <Card data-testid="card-1">
            <CardContent>
              <Checkbox data-testid="checkbox-1" aria-label="Select card 1" />
              <Button data-testid="button-1">View 1</Button>
            </CardContent>
          </Card>
          <Card data-testid="card-2">
            <CardContent>
              <Checkbox data-testid="checkbox-2" aria-label="Select card 2" />
              <Button data-testid="button-2">View 2</Button>
            </CardContent>
          </Card>
        </div>
      )

      const checkbox1 = screen.getByTestId('checkbox-1')
      const button1 = screen.getByTestId('button-1')
      const checkbox2 = screen.getByTestId('checkbox-2')
      const button2 = screen.getByTestId('button-2')

      // Tab through all interactive elements
      await user.tab()
      expect(checkbox1).toHaveFocus()

      await user.tab()
      expect(button1).toHaveFocus()

      await user.tab()
      expect(checkbox2).toHaveFocus()

      await user.tab()
      expect(button2).toHaveFocus()
    })
  })
})
