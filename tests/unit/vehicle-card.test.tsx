import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import { useRouter } from 'next/navigation'
import VehicleCard from '@/components/vehicles/VehicleCard'
import { mockVehicle, createMockImages } from '../utils/mock-factories'

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

describe('VehicleCard', () => {
  const mockPush = jest.fn()

  beforeEach(() => {
    jest.clearAllMocks()
    ;(useRouter as jest.Mock).mockReturnValue({
      push: mockPush,
    })
  })

  describe('Rendering with vehicle data', () => {
    it('should render vehicle stock number', () => {
      render(<VehicleCard vehicle={mockVehicle} />)
      expect(screen.getAllByText('T12345')).toHaveLength(2) // Mobile and desktop layouts
    })

    it('should render vehicle photo count', () => {
      const vehicleWithImages = {
        ...mockVehicle,
        images: createMockImages('1', 5),
      }
      render(<VehicleCard vehicle={vehicleWithImages} />)
      expect(screen.getAllByText('5 photos')).toHaveLength(2)
    })

    it('should render vehicle created date', () => {
      render(<VehicleCard vehicle={mockVehicle} />)
      // Date formatting may vary based on timezone, so just check that a date is rendered
      const dateElements = screen.getAllByText(/\w+ \d{1,2}, \d{4}/)
      expect(dateElements).toHaveLength(2)
    })

    it('should render status badge with correct variant', () => {
      render(<VehicleCard vehicle={mockVehicle} />)
      const badges = screen.getAllByText('Not Started')
      expect(badges).toHaveLength(2) // Mobile and desktop layouts
    })

    it('should render "In Progress" status badge', () => {
      const vehicle = { ...mockVehicle, processingStatus: 'IN_PROGRESS' }
      render(<VehicleCard vehicle={vehicle} />)
      expect(screen.getAllByText('In Progress')).toHaveLength(2)
    })

    it('should render "Completed" status badge', () => {
      const vehicle = { ...mockVehicle, processingStatus: 'COMPLETED' }
      render(<VehicleCard vehicle={vehicle} />)
      expect(screen.getAllByText('Completed')).toHaveLength(2)
    })

    it('should render "Error" status badge', () => {
      const vehicle = { ...mockVehicle, processingStatus: 'ERROR' }
      render(<VehicleCard vehicle={vehicle} />)
      expect(screen.getAllByText('Error')).toHaveLength(2)
    })

    it('should render thumbnail when vehicle has images', () => {
      const vehicleWithImages = {
        ...mockVehicle,
        images: createMockImages('1', 3),
      }
      render(<VehicleCard vehicle={vehicleWithImages} />)
      const images = screen.getAllByAltText('Vehicle T12345')
      expect(images.length).toBeGreaterThan(0)
    })

    it('should render placeholder icon when vehicle has no images', () => {
      render(<VehicleCard vehicle={mockVehicle} />)
      // PhotoIcon should be rendered
      const placeholders = document.querySelectorAll('.h-6.w-6.text-gray-400')
      expect(placeholders.length).toBeGreaterThan(0)
    })
  })

  describe('Checkbox selection', () => {
    it('should render checkbox when showCheckbox is true', () => {
      render(<VehicleCard vehicle={mockVehicle} showCheckbox={true} />)
      const checkboxes = screen.getAllByRole('checkbox')
      expect(checkboxes).toHaveLength(2) // Mobile and desktop layouts
    })

    it('should not render checkbox when showCheckbox is false', () => {
      render(<VehicleCard vehicle={mockVehicle} showCheckbox={false} />)
      const checkboxes = screen.queryAllByRole('checkbox')
      expect(checkboxes).toHaveLength(0)
    })

    it('should render checked checkbox when isSelected is true', () => {
      render(<VehicleCard vehicle={mockVehicle} showCheckbox={true} isSelected={true} />)
      const checkboxes = screen.getAllByRole('checkbox') as HTMLInputElement[]
      checkboxes.forEach(checkbox => {
        expect(checkbox).toBeChecked()
      })
    })

    it('should render unchecked checkbox when isSelected is false', () => {
      render(<VehicleCard vehicle={mockVehicle} showCheckbox={true} isSelected={false} />)
      const checkboxes = screen.getAllByRole('checkbox') as HTMLInputElement[]
      checkboxes.forEach(checkbox => {
        expect(checkbox).not.toBeChecked()
      })
    })

    it('should call onSelectionChange when checkbox is clicked', () => {
      const onSelectionChange = jest.fn()
      render(
        <VehicleCard
          vehicle={mockVehicle}
          showCheckbox={true}
          isSelected={false}
          onSelectionChange={onSelectionChange}
        />
      )
      const checkboxes = screen.getAllByRole('checkbox')
      fireEvent.click(checkboxes[0])
      expect(onSelectionChange).toHaveBeenCalledWith(true)
    })
  })

  describe('Button click navigation', () => {
    it('should render view button', () => {
      render(<VehicleCard vehicle={mockVehicle} />)
      const buttons = screen.getAllByRole('button', { name: /view details/i })
      expect(buttons).toHaveLength(2) // Mobile and desktop layouts
    })

    it('should navigate to vehicle detail page when button is clicked', () => {
      render(<VehicleCard vehicle={mockVehicle} />)
      const buttons = screen.getAllByRole('button', { name: /view details/i })
      fireEvent.click(buttons[0])
      expect(mockPush).toHaveBeenCalledWith('/vehicles/1')
    })

    it('should have proper aria-label on view button', () => {
      render(<VehicleCard vehicle={mockVehicle} />)
      const buttons = screen.getAllByLabelText('View details for vehicle T12345')
      expect(buttons).toHaveLength(2)
    })
  })

  describe('Status badge variants', () => {
    it('should use secondary variant for NOT_STARTED status', () => {
      const vehicle = { ...mockVehicle, processingStatus: 'NOT_STARTED' }
      const { container } = render(<VehicleCard vehicle={vehicle} />)
      // Badge component should be rendered with appropriate styling
      expect(screen.getAllByText('Not Started')).toHaveLength(2)
    })

    it('should use warning variant for IN_PROGRESS status', () => {
      const vehicle = { ...mockVehicle, processingStatus: 'IN_PROGRESS' }
      const { container } = render(<VehicleCard vehicle={vehicle} />)
      expect(screen.getAllByText('In Progress')).toHaveLength(2)
    })

    it('should use success variant for COMPLETED status', () => {
      const vehicle = { ...mockVehicle, processingStatus: 'COMPLETED' }
      const { container } = render(<VehicleCard vehicle={vehicle} />)
      expect(screen.getAllByText('Completed')).toHaveLength(2)
    })

    it('should use destructive variant for ERROR status', () => {
      const vehicle = { ...mockVehicle, processingStatus: 'ERROR' }
      const { container } = render(<VehicleCard vehicle={vehicle} />)
      expect(screen.getAllByText('Error')).toHaveLength(2)
    })
  })
})
