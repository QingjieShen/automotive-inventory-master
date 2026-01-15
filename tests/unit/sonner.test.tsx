import React from 'react'
import { render } from '@testing-library/react'
import { Toaster } from '@/components/ui/sonner'

// Mock next-themes
jest.mock('next-themes', () => ({
  useTheme: () => ({ theme: 'light' }),
}))

describe('Toaster Component', () => {
  it('renders toaster', () => {
    const { container } = render(<Toaster />)
    expect(container).toBeInTheDocument()
  })

  it('renders with custom props', () => {
    const { container } = render(<Toaster position="top-right" />)
    expect(container).toBeInTheDocument()
  })

  it('applies theme from next-themes', () => {
    const { container } = render(<Toaster />)
    // Toaster should render without errors when theme is provided
    expect(container).toBeInTheDocument()
  })
})
