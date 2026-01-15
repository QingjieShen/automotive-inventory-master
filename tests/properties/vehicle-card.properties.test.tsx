/**
 * Property-Based Tests for VehicleCard Component
 * Feature: shadcn-ui-integration
 * 
 * Property 4: Functional Preservation
 * Property 5: Hover State Consistency
 * Validates: Requirements 3.5, 3.6
 */

import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import { useRouter } from 'next/navigation'
import * as fc from 'fast-check'
import VehicleCard from '@/components/vehicles/VehicleCard'
import { arbitraries } from '../utils/mock-factories'

// Mock next/navigation
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}))

// Mock next/image
jest.mock('next/image', () => ({
  __esModule: true,
  default: (props: any) => {
    // eslint-disable-next-line @next/next/no-img-element, jsx-a11y/alt-text
    return <img {...props} />
  },
}))

describe('VehicleCard Property-Based Tests', () => {
  const mockPush = jest.fn()

  beforeEach(() => {
    jest.clearAllMocks()
    ;(useRouter as jest.Mock).mockReturnValue({
      push: mockPush,
    })
  })

  /**
   * Property 4: Functional Preservation
   * Feature: shadcn-ui-integration, Property 4: Functional Preservation
   * 
   * For any vehicle data, the VehicleCard should display all vehicle information correctly,
   * maintain click handlers, state management, and callbacks after migration to shadcn/ui.
   */
  describe('Property 4: Functional Preservation', () => {
    it('should display all vehicle data correctly for any vehicle', () => {
      fc.assert(
        fc.property(
          arbitraries.vehicle,
          fc.array(arbitraries.vehicleImage, { minLength: 0, maxLength: 10 }),
          (vehicle, images) => {
            const vehicleWithImages = {
              ...vehicle,
              images,
              store: {
                id: vehicle.storeId,
                name: 'Test Store',
                address: '123 Test St',
                brandLogos: [],
              },
            }

            const { container, unmount } = render(<VehicleCard vehicle={vehicleWithImages} />)

            try {
              // Verify stock number is displayed
              const stockNumbers = screen.getAllByText(vehicle.stockNumber)
              expect(stockNumbers.length).toBeGreaterThan(0)

              // Verify photo count is displayed (use regex to be flexible)
              const photoCountRegex = new RegExp(`${images.length}\\s+photo`)
              const photoCounts = screen.getAllByText(photoCountRegex)
              expect(photoCounts.length).toBeGreaterThan(0)

              // Verify status badge is displayed
              const statusMap: Record<string, string> = {
                NOT_STARTED: 'Not Started',
                IN_PROGRESS: 'In Progress',
                COMPLETED: 'Completed',
                ERROR: 'Error',
              }
              const statusText = statusMap[vehicle.processingStatus] || 'Not Started'
              const statusBadges = screen.getAllByText(statusText)
              expect(statusBadges.length).toBeGreaterThan(0)

              // Verify view button is present
              const viewButtons = screen.getAllByRole('button', { name: /view details/i })
              expect(viewButtons.length).toBeGreaterThan(0)
            } finally {
              unmount()
            }
          }
        ),
        { numRuns: 100 }
      )
    })

    it('should maintain click handler functionality for any vehicle', () => {
      fc.assert(
        fc.property(arbitraries.vehicle, (vehicle) => {
          const vehicleWithStore = {
            ...vehicle,
            images: [],
            store: {
              id: vehicle.storeId,
              name: 'Test Store',
              address: '123 Test St',
              brandLogos: [],
            },
          }

          mockPush.mockClear()
          const { unmount } = render(<VehicleCard vehicle={vehicleWithStore} />)

          try {
            const viewButtons = screen.getAllByRole('button', { name: /view details/i })
            fireEvent.click(viewButtons[0])

            // Verify navigation was called with correct vehicle ID
            expect(mockPush).toHaveBeenCalledTimes(1)
            expect(mockPush).toHaveBeenCalledWith(`/vehicles/${vehicleWithStore.id}`)
          } finally {
            unmount()
          }
        }),
        { numRuns: 100 }
      )
    })

    it('should maintain checkbox state management for any vehicle', () => {
      fc.assert(
        fc.property(
          arbitraries.vehicle,
          fc.boolean(),
          fc.boolean(),
          (vehicle, showCheckbox, isSelected) => {
            const vehicleWithStore = {
              ...vehicle,
              images: [],
              store: {
                id: vehicle.storeId,
                name: 'Test Store',
                address: '123 Test St',
                brandLogos: [],
              },
            }

            const onSelectionChange = jest.fn()
            const { unmount } = render(
              <VehicleCard
                vehicle={vehicleWithStore}
                showCheckbox={showCheckbox}
                isSelected={isSelected}
                onSelectionChange={onSelectionChange}
              />
            )

            try {
              if (showCheckbox) {
                const checkboxes = screen.getAllByRole('checkbox')
                expect(checkboxes.length).toBeGreaterThan(0)

                // Verify checkbox reflects isSelected state
                checkboxes.forEach((checkbox) => {
                  if (isSelected) {
                    expect(checkbox).toBeChecked()
                  } else {
                    expect(checkbox).not.toBeChecked()
                  }
                })

                // Verify callback is called when checkbox is clicked
                onSelectionChange.mockClear()
                fireEvent.click(checkboxes[0])
                expect(onSelectionChange).toHaveBeenCalled()
              } else {
                const checkboxes = screen.queryAllByRole('checkbox')
                expect(checkboxes).toHaveLength(0)
              }
            } finally {
              unmount()
            }
          }
        ),
        { numRuns: 100 }
      )
    })

    it('should correctly map processing status to badge variants for any status', () => {
      fc.assert(
        fc.property(arbitraries.vehicle, (vehicle) => {
          const vehicleWithStore = {
            ...vehicle,
            images: [],
            store: {
              id: vehicle.storeId,
              name: 'Test Store',
              address: '123 Test St',
              brandLogos: [],
            },
          }

          const { unmount } = render(<VehicleCard vehicle={vehicleWithStore} />)

          try {
            // Verify status badge text is correct
            const statusMap: Record<string, string> = {
              NOT_STARTED: 'Not Started',
              IN_PROGRESS: 'In Progress',
              COMPLETED: 'Completed',
              ERROR: 'Error',
            }
            const expectedText = statusMap[vehicle.processingStatus] || 'Not Started'
            const badges = screen.getAllByText(expectedText)
            expect(badges.length).toBeGreaterThan(0)
          } finally {
            unmount()
          }
        }),
        { numRuns: 100 }
      )
    })

    it('should handle vehicles with and without images correctly', () => {
      fc.assert(
        fc.property(
          arbitraries.vehicle,
          fc.array(arbitraries.vehicleImage, { minLength: 0, maxLength: 10 }),
          (vehicle, images) => {
            const vehicleWithImages = {
              ...vehicle,
              images,
              store: {
                id: vehicle.storeId,
                name: 'Test Store',
                address: '123 Test St',
                brandLogos: [],
              },
            }

            const { container, unmount } = render(<VehicleCard vehicle={vehicleWithImages} />)

            try {
              // Use regex to match photo count flexibly
              const photoCountRegex = new RegExp(`${images.length}\\s+photo`)
              expect(screen.getAllByText(photoCountRegex).length).toBeGreaterThan(0)
            } finally {
              unmount()
            }
          }
        ),
        { numRuns: 100 }
      )
    })
  })

  /**
   * Property 5: Hover State Consistency
   * Feature: shadcn-ui-integration, Property 5: Hover State Consistency
   * 
   * For any interactive element in VehicleCard, hover states should provide visual feedback
   * consistent with shadcn styling patterns.
   */
  describe('Property 5: Hover State Consistency', () => {
    it('should apply hover classes to Card component for any vehicle', () => {
      fc.assert(
        fc.property(arbitraries.vehicle, (vehicle) => {
          const vehicleWithStore = {
            ...vehicle,
            images: [],
            store: {
              id: vehicle.storeId,
              name: 'Test Store',
              address: '123 Test St',
              brandLogos: [],
            },
          }

          const { container, unmount } = render(<VehicleCard vehicle={vehicleWithStore} />)

          try {
            // Verify Card has hover classes
            const card = container.querySelector('[role="row"]')
            expect(card).toBeTruthy()
            expect(card?.className).toContain('hover:bg-accent/50')
            expect(card?.className).toContain('transition-colors')
          } finally {
            unmount()
          }
        }),
        { numRuns: 100 }
      )
    })

    it('should apply hover classes to Button components for any vehicle', () => {
      fc.assert(
        fc.property(arbitraries.vehicle, (vehicle) => {
          const vehicleWithStore = {
            ...vehicle,
            images: [],
            store: {
              id: vehicle.storeId,
              name: 'Test Store',
              address: '123 Test St',
              brandLogos: [],
            },
          }

          const { unmount } = render(<VehicleCard vehicle={vehicleWithStore} />)

          try {
            // Verify buttons have hover classes (ghost variant)
            const buttons = screen.getAllByRole('button', { name: /view details/i })
            buttons.forEach((button) => {
              expect(button.className).toContain('hover:bg-accent')
              expect(button.className).toContain('hover:text-accent-foreground')
              expect(button.className).toContain('transition-colors')
            })
          } finally {
            unmount()
          }
        }),
        { numRuns: 100 }
      )
    })

    it('should maintain consistent hover behavior across responsive layouts', () => {
      fc.assert(
        fc.property(arbitraries.vehicle, (vehicle) => {
          const vehicleWithStore = {
            ...vehicle,
            images: [],
            store: {
              id: vehicle.storeId,
              name: 'Test Store',
              address: '123 Test St',
              brandLogos: [],
            },
          }

          const { container, unmount } = render(<VehicleCard vehicle={vehicleWithStore} />)

          try {
            // Verify both mobile and desktop layouts have consistent hover classes
            const card = container.querySelector('[role="row"]')
            expect(card?.className).toContain('hover:bg-accent/50')

            // Verify buttons in both layouts have consistent hover classes
            const buttons = screen.getAllByRole('button', { name: /view details/i })
            expect(buttons.length).toBeGreaterThanOrEqual(2) // Mobile and desktop

            buttons.forEach((button) => {
              expect(button.className).toContain('hover:bg-accent')
              expect(button.className).toContain('transition-colors')
            })
          } finally {
            unmount()
          }
        }),
        { numRuns: 100 }
      )
    })
  })
})
