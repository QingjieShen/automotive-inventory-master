import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import ThemeToggle from '@/components/common/ThemeToggle'
import ThemeProvider from '@/components/providers/ThemeProvider'

describe('Dark Mode', () => {
  beforeEach(() => {
    // Clear localStorage before each test
    localStorage.clear()
    // Remove dark class from document
    document.documentElement.classList.remove('dark')
    // Mock matchMedia
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: jest.fn().mockImplementation((query) => ({
        matches: false,
        media: query,
        onchange: null,
        addListener: jest.fn(),
        removeListener: jest.fn(),
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
        dispatchEvent: jest.fn(),
      })),
    })
  })

  afterEach(() => {
    localStorage.clear()
    document.documentElement.classList.remove('dark')
  })

  describe('ThemeToggle', () => {
    it('should render theme toggle button', async () => {
      render(<ThemeToggle />)
      await waitFor(() => {
        const button = screen.getByRole('button', { name: /switch to dark mode/i })
        expect(button).toBeInTheDocument()
      })
    })

    it('should toggle theme when clicked', async () => {
      render(<ThemeToggle />)
      
      await waitFor(() => {
        expect(screen.getByRole('button', { name: /switch to dark mode/i })).toBeInTheDocument()
      })

      const button = screen.getByRole('button', { name: /switch to dark mode/i })
      fireEvent.click(button)

      await waitFor(() => {
        expect(document.documentElement.classList.contains('dark')).toBe(true)
        expect(localStorage.getItem('theme')).toBe('dark')
      })

      // Toggle back to light
      const darkButton = screen.getByRole('button', { name: /switch to light mode/i })
      fireEvent.click(darkButton)

      await waitFor(() => {
        expect(document.documentElement.classList.contains('dark')).toBe(false)
        expect(localStorage.getItem('theme')).toBe('light')
      })
    })

    it('should persist theme preference to localStorage', async () => {
      render(<ThemeToggle />)
      
      await waitFor(() => {
        expect(screen.getByRole('button')).toBeInTheDocument()
      })

      const button = screen.getByRole('button', { name: /switch to dark mode/i })
      fireEvent.click(button)

      await waitFor(() => {
        expect(localStorage.getItem('theme')).toBe('dark')
      })
    })

    it('should load saved theme from localStorage', async () => {
      localStorage.setItem('theme', 'dark')
      
      render(<ThemeToggle />)

      await waitFor(() => {
        expect(document.documentElement.classList.contains('dark')).toBe(true)
        expect(screen.getByRole('button', { name: /switch to light mode/i })).toBeInTheDocument()
      })
    })

    it('should have accessible labels', async () => {
      render(<ThemeToggle />)
      
      await waitFor(() => {
        const button = screen.getByRole('button', { name: /switch to dark mode/i })
        expect(button).toHaveAttribute('aria-label')
      })
    })
  })

  describe('ThemeProvider', () => {
    it('should render children', () => {
      render(
        <ThemeProvider>
          <div>Test Content</div>
        </ThemeProvider>
      )
      expect(screen.getByText('Test Content')).toBeInTheDocument()
    })

    it('should detect system preference when no saved theme', async () => {
      // Mock system preference for dark mode
      Object.defineProperty(window, 'matchMedia', {
        writable: true,
        value: jest.fn().mockImplementation((query) => ({
          matches: query === '(prefers-color-scheme: dark)',
          media: query,
          onchange: null,
          addListener: jest.fn(),
          removeListener: jest.fn(),
          addEventListener: jest.fn(),
          removeEventListener: jest.fn(),
          dispatchEvent: jest.fn(),
        })),
      })

      render(
        <ThemeProvider>
          <div>Test Content</div>
        </ThemeProvider>
      )

      await waitFor(() => {
        expect(document.documentElement.classList.contains('dark')).toBe(true)
      })
    })

    it('should use saved theme over system preference', async () => {
      // Mock system preference for dark mode
      Object.defineProperty(window, 'matchMedia', {
        writable: true,
        value: jest.fn().mockImplementation((query) => ({
          matches: query === '(prefers-color-scheme: dark)',
          media: query,
          onchange: null,
          addListener: jest.fn(),
          removeListener: jest.fn(),
          addEventListener: jest.fn(),
          removeEventListener: jest.fn(),
          dispatchEvent: jest.fn(),
        })),
      })

      // Set saved theme to light
      localStorage.setItem('theme', 'light')

      render(
        <ThemeProvider>
          <div>Test Content</div>
        </ThemeProvider>
      )

      await waitFor(() => {
        expect(document.documentElement.classList.contains('dark')).toBe(false)
      })
    })

    it('should apply light theme by default when no preference', async () => {
      render(
        <ThemeProvider>
          <div>Test Content</div>
        </ThemeProvider>
      )

      await waitFor(() => {
        expect(document.documentElement.classList.contains('dark')).toBe(false)
      })
    })
  })
})
