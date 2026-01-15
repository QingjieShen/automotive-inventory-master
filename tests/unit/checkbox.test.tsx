import React from 'react'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Checkbox } from '@/components/ui/checkbox'

describe('Checkbox Component', () => {
  it('renders checkbox', () => {
    render(<Checkbox aria-label="Accept terms" />)
    const checkbox = screen.getByRole('checkbox')
    expect(checkbox).toBeInTheDocument()
  })

  it('handles checked state', async () => {
    const user = userEvent.setup()
    const handleChange = jest.fn()
    render(<Checkbox onCheckedChange={handleChange} aria-label="Check me" />)

    const checkbox = screen.getByRole('checkbox')
    await user.click(checkbox)
    expect(handleChange).toHaveBeenCalled()
  })

  it('renders with default checked state', () => {
    render(<Checkbox defaultChecked aria-label="Default checked" />)
    const checkbox = screen.getByRole('checkbox')
    expect(checkbox).toHaveAttribute('data-state', 'checked')
  })

  it('renders disabled state', () => {
    render(<Checkbox disabled aria-label="Disabled checkbox" />)
    const checkbox = screen.getByRole('checkbox')
    expect(checkbox).toBeDisabled()
  })

  it('applies custom className', () => {
    render(<Checkbox className="custom-checkbox" aria-label="Custom" />)
    const checkbox = screen.getByRole('checkbox')
    expect(checkbox).toHaveClass('custom-checkbox')
  })
})
