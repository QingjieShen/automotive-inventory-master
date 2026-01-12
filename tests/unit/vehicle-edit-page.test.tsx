import { render, screen, waitFor, fireEvent } from '@testing-library/react'
import { useRouter, useParams } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { useStore } from '@/components/providers/StoreProvider'
import EditVehiclePage from '@/app/vehicles/[id]/edit/page'

// Mock dependencies
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
  useParams: jest.fn(),
}))

jest.mock('next-auth/react', () => ({
  useSession: jest.fn(),
}))

jest.mock('@/components/providers/StoreProvider', () => ({
  useStore: jest.fn(),
}))

// Mock child components
jest.mock('@/components/common/NavigationBanner', () => {
  return function MockNavigationBanner() {
    return <div data-testid="navigation-banner">Navigation Banner</div>
  }
})

jest.mock('@/components/vehicles/ImageGallery', () => {
  return function MockImageGallery({ vehicle, onVehicleUpdate }: any) {
    return (
      <div data-testid="image-gallery">
        <div>Vehicle: {vehicle.stockNumber}</div>
        <button onClick={() => onVehicleUpdate({ ...vehicle, stockNumber: 'UPDATED' })}>
          Update Vehicle
        </button>
      </div>
    )
  }
})

jest.mock('@/components/vehicles/KeyImagesUploader', () => {
  return function MockKeyImagesUploader({ onFilesChange }: any) {
    return (
      <div data-testid="key-images-uploader">
        <button onClick={() => onFilesChange([{ id: '1', name: 'test.jpg' }])}>
          Add Key Image
        </button>
      </div>
    )
  }
})

jest.mock('@/components/vehicles/GalleryImagesUploader', () => {
  return function MockGalleryImagesUploader({ onFilesChange }: any) {
    return (
      <div data-testid="gallery-images-uploader">
        <button onClick={() => onFilesChange([{ id: '1', name: 'test.jpg' }])}>
          Add Gallery Image
        </button>
      </div>
    )
  }
})

jest.mock('@/components/vehicles/DeleteVehicleModal', () => {
  return function MockDeleteVehicleModal({ vehicle, onConfirm, onCancel, isDeleting }: any) {
    return (
      <div data-testid="delete-vehicle-modal">
        <div>Delete Vehicle: {vehicle.stockNumber}</div>
        <button onClick={onCancel} disabled={isDeleting}>Cancel Delete</button>
        <button onClick={onConfirm} disabled={isDeleting}>
          {isDeleting ? 'Deleting...' : 'Confirm Delete'}
        </button>
      </div>
    )
  }
})

jest.mock('@/components/common', () => ({
  LoadingSpinner: ({ text }: any) => <div data-testid="loading-spinner">{text}</div>,
}))

jest.mock('@/components/auth/ProtectedRoute', () => ({
  ProtectedRoute: ({ children }: any) => <div>{children}</div>,
}))

const mockVehicle = {
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
  ],
  processingStatus: 'COMPLETED',
  createdAt: new Date('2024-01-01'),
  updatedAt: new Date('2024-01-01'),
}

describe('EditVehiclePage', () => {
  const mockPush = jest.fn()
  const mockBack = jest.fn()

  beforeEach(() => {
    jest.clearAllMocks()
    ;(useRouter as jest.Mock).mockReturnValue({
      push: mockPush,
      back: mockBack,
    })
    ;(useParams as jest.Mock).mockReturnValue({
      id: 'vehicle-1',
    })
    ;(useSession as jest.Mock).mockReturnValue({
      data: {
        user: {
          id: 'user-1',
          email: 'test@example.com',
          name: 'Test User',
          role: 'PHOTOGRAPHER',
        },
      },
      status: 'authenticated',
    })
    ;(useStore as jest.Mock).mockReturnValue({
      selectedStore: {
        id: 'store-1',
        name: 'Test Store',
        address: '123 Test St',
        brandLogos: [],
      },
    })

    global.fetch = jest.fn()
  })

  afterEach(() => {
    jest.restoreAllMocks()
  })

  it('renders loading state initially', () => {
    ;(global.fetch as jest.Mock).mockImplementation(() => 
      new Promise(() => {}) // Never resolves
    )

    render(<EditVehiclePage />)
    
    expect(screen.getByTestId('loading-spinner')).toBeInTheDocument()
    expect(screen.getByText('Loading vehicle...')).toBeInTheDocument()
  })

  it('fetches and displays vehicle data', async () => {
    ;(global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => mockVehicle,
    })

    render(<EditVehiclePage />)

    await waitFor(() => {
      expect(screen.getByText('Edit Vehicle')).toBeInTheDocument()
    })

    expect(screen.getByDisplayValue('ABC123')).toBeInTheDocument()
    expect(screen.getByText('Test Store')).toBeInTheDocument()
    expect(screen.getByTestId('image-gallery')).toBeInTheDocument()
  })

  it('validates stock number input', async () => {
    ;(global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => mockVehicle,
    })

    render(<EditVehiclePage />)

    await waitFor(() => {
      expect(screen.getByDisplayValue('ABC123')).toBeInTheDocument()
    })

    const input = screen.getByLabelText(/Stock Number/i)
    
    // Clear the input
    fireEvent.change(input, { target: { value: '' } })
    await waitFor(() => {
      expect(screen.getByText('Stock number is required')).toBeInTheDocument()
    })

    // Invalid characters
    fireEvent.change(input, { target: { value: 'ABC@123' } })
    await waitFor(() => {
      expect(screen.getByText(/can only contain letters, numbers, hyphens, and underscores/i)).toBeInTheDocument()
    })

    // Valid input
    fireEvent.change(input, { target: { value: 'XYZ789' } })
    await waitFor(() => {
      expect(screen.getByText('✓ Valid stock number')).toBeInTheDocument()
    })
  })

  it('handles cancel button click', async () => {
    ;(global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => mockVehicle,
    })

    render(<EditVehiclePage />)

    await waitFor(() => {
      expect(screen.getByText('Edit Vehicle')).toBeInTheDocument()
    })

    const cancelButtons = screen.getAllByText('Cancel')
    fireEvent.click(cancelButtons[0])

    expect(mockPush).toHaveBeenCalledWith('/vehicles/vehicle-1')
  })

  it('submits form with updated stock number', async () => {
    ;(global.fetch as jest.Mock)
      .mockResolvedValueOnce({
        ok: true,
        json: async () => mockVehicle,
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ ...mockVehicle, stockNumber: 'XYZ789' }),
      })

    render(<EditVehiclePage />)

    await waitFor(() => {
      expect(screen.getByDisplayValue('ABC123')).toBeInTheDocument()
    })

    const input = screen.getByLabelText(/Stock Number/i)
    fireEvent.change(input, { target: { value: 'XYZ789' } })

    const submitButtons = screen.getAllByText('Save Changes')
    fireEvent.click(submitButtons[0])

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(
        '/api/vehicles/vehicle-1',
        expect.objectContaining({
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            stockNumber: 'XYZ789',
          }),
        })
      )
    })

    expect(mockPush).toHaveBeenCalledWith('/vehicles/vehicle-1')
  })

  it('uploads new images when added', async () => {
    ;(global.fetch as jest.Mock)
      .mockResolvedValueOnce({
        ok: true,
        json: async () => mockVehicle,
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({}),
      })

    render(<EditVehiclePage />)

    await waitFor(() => {
      expect(screen.getByText('Edit Vehicle')).toBeInTheDocument()
    })

    // Add a new gallery image
    const addGalleryButton = screen.getByText('Add Gallery Image')
    fireEvent.click(addGalleryButton)

    const submitButtons = screen.getAllByText(/Save Changes/i)
    fireEvent.click(submitButtons[0])

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(
        '/api/vehicles/vehicle-1/images',
        expect.objectContaining({
          method: 'POST',
        })
      )
    })
  })

  it('displays error when vehicle fetch fails', async () => {
    ;(global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
      status: 404,
    })

    render(<EditVehiclePage />)

    await waitFor(() => {
      expect(screen.getByText('Vehicle not found')).toBeInTheDocument()
    })

    expect(screen.getByText('Go Back')).toBeInTheDocument()
  })

  it('displays error when update fails', async () => {
    ;(global.fetch as jest.Mock)
      .mockResolvedValueOnce({
        ok: true,
        json: async () => mockVehicle,
      })
      .mockResolvedValueOnce({
        ok: false,
        json: async () => ({ error: 'Stock number already exists' }),
      })

    render(<EditVehiclePage />)

    await waitFor(() => {
      expect(screen.getByDisplayValue('ABC123')).toBeInTheDocument()
    })

    const input = screen.getByLabelText(/Stock Number/i)
    fireEvent.change(input, { target: { value: 'XYZ789' } })

    const submitButtons = screen.getAllByText('Save Changes')
    fireEvent.click(submitButtons[0])

    await waitFor(() => {
      expect(screen.getByText('Stock number already exists')).toBeInTheDocument()
    })

    expect(screen.getByText('Retry')).toBeInTheDocument()
  })

  it('redirects to login if not authenticated', () => {
    ;(useSession as jest.Mock).mockReturnValue({
      data: null,
      status: 'unauthenticated',
    })

    render(<EditVehiclePage />)

    expect(mockPush).toHaveBeenCalledWith('/login')
  })

  it('disables submit button when validation fails', async () => {
    ;(global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => mockVehicle,
    })

    render(<EditVehiclePage />)

    await waitFor(() => {
      expect(screen.getByDisplayValue('ABC123')).toBeInTheDocument()
    })

    const input = screen.getByLabelText(/Stock Number/i)
    fireEvent.change(input, { target: { value: '' } })

    await waitFor(() => {
      const submitButtons = screen.getAllByText('Save Changes')
      submitButtons.forEach(button => {
        expect(button).toBeDisabled()
      })
    })
  })

  it('shows delete confirmation modal when delete button is clicked', async () => {
    ;(global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => mockVehicle,
    })

    render(<EditVehiclePage />)

    await waitFor(() => {
      expect(screen.getByText('Edit Vehicle')).toBeInTheDocument()
    })

    const deleteButtons = screen.getAllByText('Delete Vehicle')
    fireEvent.click(deleteButtons[0])

    await waitFor(() => {
      expect(screen.getByTestId('delete-vehicle-modal')).toBeInTheDocument()
    })

    expect(screen.getByText('Delete Vehicle: ABC123')).toBeInTheDocument()
  })

  it('deletes vehicle when confirmed in modal', async () => {
    ;(global.fetch as jest.Mock)
      .mockResolvedValueOnce({
        ok: true,
        json: async () => mockVehicle,
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ message: 'Vehicle deleted successfully' }),
      })

    render(<EditVehiclePage />)

    await waitFor(() => {
      expect(screen.getByText('Edit Vehicle')).toBeInTheDocument()
    })

    // Click delete button
    const deleteButtons = screen.getAllByText('Delete Vehicle')
    fireEvent.click(deleteButtons[0])

    await waitFor(() => {
      expect(screen.getByTestId('delete-vehicle-modal')).toBeInTheDocument()
    })

    // Confirm deletion
    const confirmButton = screen.getByText('Confirm Delete')
    fireEvent.click(confirmButton)

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(
        '/api/vehicles/vehicle-1',
        expect.objectContaining({
          method: 'DELETE',
        })
      )
    })

    expect(mockPush).toHaveBeenCalledWith('/vehicles')
  })

  it('closes modal when cancel is clicked', async () => {
    ;(global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => mockVehicle,
    })

    render(<EditVehiclePage />)

    await waitFor(() => {
      expect(screen.getByText('Edit Vehicle')).toBeInTheDocument()
    })

    // Click delete button
    const deleteButtons = screen.getAllByText('Delete Vehicle')
    fireEvent.click(deleteButtons[0])

    await waitFor(() => {
      expect(screen.getByTestId('delete-vehicle-modal')).toBeInTheDocument()
    })

    // Cancel deletion
    const cancelButton = screen.getByText('Cancel Delete')
    fireEvent.click(cancelButton)

    await waitFor(() => {
      expect(screen.queryByTestId('delete-vehicle-modal')).not.toBeInTheDocument()
    })
  })

  it('displays error when vehicle deletion fails', async () => {
    ;(global.fetch as jest.Mock)
      .mockResolvedValueOnce({
        ok: true,
        json: async () => mockVehicle,
      })
      .mockResolvedValueOnce({
        ok: false,
        json: async () => ({ error: 'Failed to delete vehicle' }),
      })

    render(<EditVehiclePage />)

    await waitFor(() => {
      expect(screen.getByText('Edit Vehicle')).toBeInTheDocument()
    })

    // Click delete button
    const deleteButtons = screen.getAllByText('Delete Vehicle')
    fireEvent.click(deleteButtons[0])

    await waitFor(() => {
      expect(screen.getByTestId('delete-vehicle-modal')).toBeInTheDocument()
    })

    // Confirm deletion
    const confirmButton = screen.getByText('Confirm Delete')
    fireEvent.click(confirmButton)

    await waitFor(() => {
      expect(screen.getByText('Failed to delete vehicle')).toBeInTheDocument()
    })

    // Modal should be closed
    expect(screen.queryByTestId('delete-vehicle-modal')).not.toBeInTheDocument()
  })
})
