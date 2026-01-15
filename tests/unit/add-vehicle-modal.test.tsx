import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import AddVehicleModal from '@/components/vehicles/AddVehicleModal'
import { useStore } from '@/components/providers/StoreProvider'

// Mock the StoreProvider
jest.mock('@/components/providers/StoreProvider', () => ({
  useStore: jest.fn(),
}))

// Mock SimplePhotoUploader
jest.mock('@/components/vehicles/SimplePhotoUploader', () => {
  return function MockSimplePhotoUploader({ onFilesChange }: any) {
    return (
      <div data-testid="photo-uploader">
        <button onClick={() => onFilesChange([])}>Upload Photos</button>
      </div>
    )
  }
})

// Mock fetch
global.fetch = jest.fn()

const mockStore = {
  id: 'store-1',
  name: 'Test Store',
  address: '123 Test St',
  brandLogos: [],
}

describe('AddVehicleModal', () => {
  const mockOnClose = jest.fn()
  const mockOnVehicleAdded = jest.fn()

  beforeEach(() => {
    jest.clearAllMocks()
    ;(useStore as jest.Mock).mockReturnValue({
      selectedStore: mockStore,
    })
    ;(global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => ({ id: 'vehicle-1', stockNumber: 'ABC123' }),
    })
  })

  it('renders modal with form fields', () => {
    render(
      <AddVehicleModal
        open={true}
        onClose={mockOnClose}
        onVehicleAdded={mockOnVehicleAdded}
      />
    )

    expect(screen.getByRole('heading', { name: 'Add New Vehicle' })).toBeInTheDocument()
    expect(screen.getByLabelText(/Stock Number/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/VIN/i)).toBeInTheDocument()
    expect(screen.getByText('Test Store')).toBeInTheDocument()
  })

  it('validates stock number input', async () => {
    render(
      <AddVehicleModal
        open={true}
        onClose={mockOnClose}
        onVehicleAdded={mockOnVehicleAdded}
      />
    )

    const stockInput = screen.getByPlaceholderText(/Enter stock number/i)
    const vinInput = screen.getByPlaceholderText(/Enter 17-character VIN/i)
    const submitButton = screen.getByText(/Create Vehicle/i)

    // Initially disabled due to empty fields
    expect(submitButton).toBeDisabled()

    // Fill in stock number
    fireEvent.change(stockInput, { target: { value: 'ABC123' } })
    fireEvent.change(vinInput, { target: { value: '1HGBH41JXMN109186' } })

    await waitFor(() => {
      expect(submitButton).not.toBeDisabled()
    })
  })

  it('validates VIN format', async () => {
    render(
      <AddVehicleModal
        open={true}
        onClose={mockOnClose}
        onVehicleAdded={mockOnVehicleAdded}
      />
    )

    const vinInput = screen.getByPlaceholderText(/Enter 17-character VIN/i)

    // Enter invalid VIN
    fireEvent.change(vinInput, { target: { value: 'INVALID' } })

    await waitFor(() => {
      expect(screen.getByText(/Invalid VIN/i)).toBeInTheDocument()
    })

    // Enter valid VIN
    fireEvent.change(vinInput, { target: { value: '1HGBH41JXMN109186' } })

    await waitFor(() => {
      expect(screen.getByText(/✓ Valid VIN/i)).toBeInTheDocument()
    })
  })

  it('submits form with valid data', async () => {
    render(
      <AddVehicleModal
        open={true}
        onClose={mockOnClose}
        onVehicleAdded={mockOnVehicleAdded}
      />
    )

    const stockInput = screen.getByPlaceholderText(/Enter stock number/i)
    const vinInput = screen.getByPlaceholderText(/Enter 17-character VIN/i)
    const submitButton = screen.getByText(/Create Vehicle/i)

    fireEvent.change(stockInput, { target: { value: 'ABC123' } })
    fireEvent.change(vinInput, { target: { value: '1HGBH41JXMN109186' } })

    await waitFor(() => {
      expect(submitButton).not.toBeDisabled()
    })

    fireEvent.click(submitButton)

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(
        '/api/vehicles',
        expect.objectContaining({
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            stockNumber: 'ABC123',
            vin: '1HGBH41JXMN109186',
            storeId: 'store-1',
          }),
        })
      )
    })

    await waitFor(() => {
      expect(mockOnVehicleAdded).toHaveBeenCalled()
      expect(mockOnClose).toHaveBeenCalled()
    })
  })

  it('displays error message on submission failure', async () => {
    ;(global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
      json: async () => ({ error: 'Failed to create vehicle' }),
    })

    render(
      <AddVehicleModal
        open={true}
        onClose={mockOnClose}
        onVehicleAdded={mockOnVehicleAdded}
      />
    )

    const stockInput = screen.getByPlaceholderText(/Enter stock number/i)
    const vinInput = screen.getByPlaceholderText(/Enter 17-character VIN/i)
    const submitButton = screen.getByText(/Create Vehicle/i)

    fireEvent.change(stockInput, { target: { value: 'ABC123' } })
    fireEvent.change(vinInput, { target: { value: '1HGBH41JXMN109186' } })

    await waitFor(() => {
      expect(submitButton).not.toBeDisabled()
    })

    fireEvent.click(submitButton)

    await waitFor(() => {
      expect(screen.getByText('Failed to create vehicle')).toBeInTheDocument()
    })

    expect(mockOnVehicleAdded).not.toHaveBeenCalled()
    expect(mockOnClose).not.toHaveBeenCalled()
  })

  it('calls onClose when cancel button is clicked', () => {
    render(
      <AddVehicleModal
        open={true}
        onClose={mockOnClose}
        onVehicleAdded={mockOnVehicleAdded}
      />
    )

    const cancelButton = screen.getByText('Cancel')
    fireEvent.click(cancelButton)

    expect(mockOnClose).toHaveBeenCalledTimes(1)
    expect(mockOnVehicleAdded).not.toHaveBeenCalled()
  })

  it('converts VIN to uppercase', () => {
    render(
      <AddVehicleModal
        open={true}
        onClose={mockOnClose}
        onVehicleAdded={mockOnVehicleAdded}
      />
    )

    const vinInput = screen.getByPlaceholderText(/Enter 17-character VIN/i) as HTMLInputElement

    fireEvent.change(vinInput, { target: { value: 'abc123' } })

    expect(vinInput.value).toBe('ABC123')
  })

  it('does not render when open is false', () => {
    render(
      <AddVehicleModal
        open={false}
        onClose={mockOnClose}
        onVehicleAdded={mockOnVehicleAdded}
      />
    )

    expect(screen.queryByRole('heading', { name: 'Add New Vehicle' })).not.toBeInTheDocument()
  })
})
