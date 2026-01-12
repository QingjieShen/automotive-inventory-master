import { render, screen, fireEvent } from '@testing-library/react'
import DeleteVehicleModal from '@/components/vehicles/DeleteVehicleModal'
import { Vehicle } from '@/types'

const mockVehicle: Vehicle = {
  id: 'vehicle-1',
  stockNumber: 'ABC123',
  storeId: 'store-1',
  store: {
    id: 'store-1',
    name: 'Test Store',
    address: '123 Test St',
    brandLogos: [],
  },
  images: [
    {
      id: 'img-1',
      vehicleId: 'vehicle-1',
      originalUrl: 'https://example.com/img1.jpg',
      thumbnailUrl: 'https://example.com/img1-thumb.jpg',
      imageType: 'FRONT',
      sortOrder: 0,
      isProcessed: true,
      uploadedAt: new Date('2024-01-01'),
    },
    {
      id: 'img-2',
      vehicleId: 'vehicle-1',
      originalUrl: 'https://example.com/img2.jpg',
      thumbnailUrl: 'https://example.com/img2-thumb.jpg',
      imageType: 'GALLERY_EXTERIOR',
      sortOrder: 0,
      isProcessed: false,
      uploadedAt: new Date('2024-01-02'),
    },
  ],
  processingStatus: 'COMPLETED',
  createdAt: new Date('2024-01-01'),
  updatedAt: new Date('2024-01-01'),
}

describe('DeleteVehicleModal', () => {
  const mockOnConfirm = jest.fn()
  const mockOnCancel = jest.fn()

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('renders modal with vehicle information', () => {
    render(
      <DeleteVehicleModal
        vehicle={mockVehicle}
        onConfirm={mockOnConfirm}
        onCancel={mockOnCancel}
      />
    )

    expect(screen.getByRole('heading', { name: 'Delete Vehicle' })).toBeInTheDocument()
    expect(screen.getByText('ABC123')).toBeInTheDocument()
    expect(screen.getByText('Test Store')).toBeInTheDocument()
    expect(screen.getByText('2 images')).toBeInTheDocument()
  })

  it('displays warning message', () => {
    render(
      <DeleteVehicleModal
        vehicle={mockVehicle}
        onConfirm={mockOnConfirm}
        onCancel={mockOnCancel}
      />
    )

    expect(screen.getByText(/Are you sure you want to delete this vehicle/i)).toBeInTheDocument()
    expect(screen.getByText(/This action cannot be undone/i)).toBeInTheDocument()
    expect(screen.getByText(/2 associated images will be permanently removed/i)).toBeInTheDocument()
  })

  it('calls onCancel when cancel button is clicked', () => {
    render(
      <DeleteVehicleModal
        vehicle={mockVehicle}
        onConfirm={mockOnConfirm}
        onCancel={mockOnCancel}
      />
    )

    const cancelButton = screen.getByText('Cancel')
    fireEvent.click(cancelButton)

    expect(mockOnCancel).toHaveBeenCalledTimes(1)
    expect(mockOnConfirm).not.toHaveBeenCalled()
  })

  it('calls onCancel when X button is clicked', () => {
    render(
      <DeleteVehicleModal
        vehicle={mockVehicle}
        onConfirm={mockOnConfirm}
        onCancel={mockOnCancel}
      />
    )

    const closeButton = screen.getByRole('button', { name: '' })
    fireEvent.click(closeButton)

    expect(mockOnCancel).toHaveBeenCalledTimes(1)
    expect(mockOnConfirm).not.toHaveBeenCalled()
  })

  it('calls onConfirm when delete button is clicked', () => {
    render(
      <DeleteVehicleModal
        vehicle={mockVehicle}
        onConfirm={mockOnConfirm}
        onCancel={mockOnCancel}
      />
    )

    const deleteButton = screen.getByRole('button', { name: /Delete Vehicle/i })
    fireEvent.click(deleteButton)

    expect(mockOnConfirm).toHaveBeenCalledTimes(1)
    expect(mockOnCancel).not.toHaveBeenCalled()
  })

  it('disables buttons when isDeleting is true', () => {
    render(
      <DeleteVehicleModal
        vehicle={mockVehicle}
        onConfirm={mockOnConfirm}
        onCancel={mockOnCancel}
        isDeleting={true}
      />
    )

    const cancelButton = screen.getByText('Cancel')
    const deleteButton = screen.getByText('Deleting...')

    expect(cancelButton).toBeDisabled()
    expect(deleteButton).toBeDisabled()
  })

  it('shows loading state when isDeleting is true', () => {
    render(
      <DeleteVehicleModal
        vehicle={mockVehicle}
        onConfirm={mockOnConfirm}
        onCancel={mockOnCancel}
        isDeleting={true}
      />
    )

    expect(screen.getByText('Deleting...')).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: /^Delete Vehicle$/i })).not.toBeInTheDocument()
  })

  it('displays correct image count for single image', () => {
    const vehicleWithOneImage = {
      ...mockVehicle,
      images: [mockVehicle.images[0]],
    }

    render(
      <DeleteVehicleModal
        vehicle={vehicleWithOneImage}
        onConfirm={mockOnConfirm}
        onCancel={mockOnCancel}
      />
    )

    expect(screen.getByText('1 image')).toBeInTheDocument()
    expect(screen.getByText(/1 associated image will be permanently removed/i)).toBeInTheDocument()
  })

  it('displays correct image count for no images', () => {
    const vehicleWithNoImages = {
      ...mockVehicle,
      images: [],
    }

    render(
      <DeleteVehicleModal
        vehicle={vehicleWithNoImages}
        onConfirm={mockOnConfirm}
        onCancel={mockOnCancel}
      />
    )

    expect(screen.getByText('0 images')).toBeInTheDocument()
    expect(screen.getByText(/0 associated images will be permanently removed/i)).toBeInTheDocument()
  })

  it('formats creation date correctly', () => {
    render(
      <DeleteVehicleModal
        vehicle={mockVehicle}
        onConfirm={mockOnConfirm}
        onCancel={mockOnCancel}
      />
    )

    const formattedDate = new Date('2024-01-01').toLocaleDateString()
    expect(screen.getByText(formattedDate)).toBeInTheDocument()
  })
})
