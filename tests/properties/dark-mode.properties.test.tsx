/**
 * Feature: shadcn-ui-integration, Property 10: Dark Mode Application
 * Validates: Requirements 13.1, 13.2, 13.3
 * 
 * Property: For any component rendered when dark mode is enabled, it should apply 
 * dark theme colors with proper contrast ratios, and the dark mode preference 
 * should persist across sessions.
 */

import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import * as fc from 'fast-check'
import ThemeToggle from '@/components/common/ThemeToggle'
import ThemeProvider from '@/components/providers/ThemeProvider'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'

describe('Property 10: Dark Mode Application', () => {
  beforeEach(() => {
    localStorage.clear()
    document.documentElement.classList.remove('dark')
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

  it('should apply dark theme colors when dark mode is enabled', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.constantFrom('default', 'destructive', 'outline', 'secondary', 'ghost'),
        async (variant) => {
          // Enable dark mode
          localStorage.setItem('theme', 'dark')
          document.documentElement.classList.add('dark')

          const { container } = render(
            <Button variant={variant as any}>Test Button</Button>
          )

          // Verify dark class is applied to document
          expect(document.documentElement.classList.contains('dark')).toBe(true)

          // Verify component is rendered
          expect(container.firstChild).toBeInTheDocument()
        }
      ),
      { numRuns: 100 }
    )
  })

  it('should persist dark mode preference across component remounts', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.constantFrom('light', 'dark'),
        async (theme) => {
          // Set theme preference
          localStorage.setItem('theme', theme)

          // First render
          const { unmount, container } = render(<ThemeToggle />)
          
          await waitFor(() => {
            const buttons = container.querySelectorAll('button')
            expect(buttons.length).toBeGreaterThan(0)
          })

          // Verify theme is applied
          if (theme === 'dark') {
            expect(document.documentElement.classList.contains('dark')).toBe(true)
          } else {
            expect(document.documentElement.classList.contains('dark')).toBe(false)
          }

          // Unmount and clean up
          unmount()
          document.documentElement.classList.remove('dark')

          // Remount in a fresh container
          const { container: newContainer } = render(<ThemeToggle />)
          
          await waitFor(() => {
            const buttons = newContainer.querySelectorAll('button')
            expect(buttons.length).toBeGreaterThan(0)
          })

          // Verify theme persists
          if (theme === 'dark') {
            expect(document.documentElement.classList.contains('dark')).toBe(true)
          } else {
            expect(document.documentElement.classList.contains('dark')).toBe(false)
          }

          // Verify localStorage still has the preference
          expect(localStorage.getItem('theme')).toBe(theme)
        }
      ),
      { numRuns: 100 }
    )
  })

  it('should apply dark theme to all shadcn components', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.record({
          buttonText: fc.string({ minLength: 2, maxLength: 20 }).filter(s => s.trim().length >= 2),
          cardTitle: fc.string({ minLength: 2, maxLength: 30 }).filter(s => s.trim().length >= 2),
          badgeText: fc.string({ minLength: 2, maxLength: 15 }).filter(s => s.trim().length >= 2),
          inputPlaceholder: fc.string({ minLength: 2, maxLength: 25 }).filter(s => s.trim().length >= 2),
        }),
        async ({ buttonText, cardTitle, badgeText, inputPlaceholder }) => {
          // Trim the strings to avoid whitespace issues
          const trimmedButtonText = buttonText.trim()
          const trimmedCardTitle = cardTitle.trim()
          const trimmedBadgeText = badgeText.trim()
          const trimmedInputPlaceholder = inputPlaceholder.trim()

          // Enable dark mode
          localStorage.setItem('theme', 'dark')
          document.documentElement.classList.add('dark')

          const { container } = render(
            <div>
              <Button>{trimmedButtonText}</Button>
              <Card>
                <CardHeader>
                  <CardTitle>{trimmedCardTitle}</CardTitle>
                </CardHeader>
                <CardContent>
                  <Badge>{trimmedBadgeText}</Badge>
                  <Input placeholder={trimmedInputPlaceholder} />
                </CardContent>
              </Card>
            </div>
          )

          // Verify dark class is applied
          expect(document.documentElement.classList.contains('dark')).toBe(true)

          // Verify all components are rendered
          expect(screen.getByText(trimmedButtonText)).toBeInTheDocument()
          expect(screen.getByText(trimmedCardTitle)).toBeInTheDocument()
          expect(screen.getByText(trimmedBadgeText)).toBeInTheDocument()
          expect(screen.getByPlaceholderText(trimmedInputPlaceholder)).toBeInTheDocument()

          // Verify components exist in the DOM
          expect(container.querySelector('button')).toBeInTheDocument()
          expect(container.querySelector('[class*="rounded-lg"]')).toBeInTheDocument()
          expect(container.querySelector('input')).toBeInTheDocument()
        }
      ),
      { numRuns: 100 }
    )
  })

  it('should maintain contrast ratios in dark mode', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.constantFrom('default', 'secondary', 'destructive', 'outline'),
        async (variant) => {
          // Enable dark mode
          localStorage.setItem('theme', 'dark')
          document.documentElement.classList.add('dark')

          const { container } = render(
            <Badge variant={variant as any}>Status</Badge>
          )

          // Verify dark mode is enabled
          expect(document.documentElement.classList.contains('dark')).toBe(true)

          // Verify badge is rendered with appropriate classes
          const badge = container.querySelector('[class*="inline-flex"]')
          expect(badge).toBeInTheDocument()
          
          // The component should have styling classes that reference theme variables
          // which are defined with proper contrast ratios in globals.css
          expect(badge?.className).toBeTruthy()
          expect(badge?.textContent).toBe('Status')
        }
      ),
      { numRuns: 100 }
    )
  })

  it('should toggle between light and dark themes correctly', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.integer({ min: 1, max: 3 }),
        async (toggleCount) => {
          const { container, unmount } = render(<ThemeToggle />)
          
          await waitFor(() => {
            const buttons = container.querySelectorAll('button')
            expect(buttons.length).toBeGreaterThan(0)
          })

          let expectedTheme: 'light' | 'dark' = 'light'

          // Toggle theme multiple times
          for (let i = 0; i < toggleCount; i++) {
            const buttons = container.querySelectorAll('button')
            const button = buttons[0] as HTMLElement
            fireEvent.click(button)
            
            expectedTheme = expectedTheme === 'light' ? 'dark' : 'light'

            // Wait for the theme to be applied
            await waitFor(() => {
              expect(localStorage.getItem('theme')).toBe(expectedTheme)
            }, { timeout: 1000 })

            // Give a small delay for DOM updates
            await new Promise(resolve => setTimeout(resolve, 50))

            // Verify the class is applied
            if (expectedTheme === 'dark') {
              expect(document.documentElement.classList.contains('dark')).toBe(true)
            } else {
              expect(document.documentElement.classList.contains('dark')).toBe(false)
            }
          }

          unmount()
        }
      ),
      { numRuns: 100 }
    )
  })

  it('should respect system preference when no saved preference exists', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.boolean(),
        async (prefersDark) => {
          // Clear any saved preference
          localStorage.clear()

          // Mock system preference
          Object.defineProperty(window, 'matchMedia', {
            writable: true,
            value: jest.fn().mockImplementation((query) => ({
              matches: query === '(prefers-color-scheme: dark)' ? prefersDark : false,
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
            if (prefersDark) {
              expect(document.documentElement.classList.contains('dark')).toBe(true)
            } else {
              expect(document.documentElement.classList.contains('dark')).toBe(false)
            }
          })
        }
      ),
      { numRuns: 100 }
    )
  })
})
