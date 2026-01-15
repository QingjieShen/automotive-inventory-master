import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import BulkDeleteModal from '@/components/vehicles/BulkDeleteModal'

describe('BulkDeleteModal', () => {
  const mockOnConfirm = jest.fn()
  const mockOnCancel = jest.fn()

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('renders modal with vehicle count', () => {
    render(
      <BulkDeleteModal
        vehicleCount={5}
        open={true}
        onConfirm={mockOnConfirm}
        onCancel={mockOnCancel}
      />
    )

    expect(screen.getByRole('heading', { name: 'Delete Vehicles' })).toBeInTheDocument()
    expect(screen.getByText(/5 vehicles/i)).toBeInTheDocument()
  })

  it('displays singular form for single vehicle', () => {
    render(
      <BulkDeleteModal
        vehicleCount={1}
        open={true}
        onConfirm={mockOnConfirm}
        onCancel={mockOnCancel}
      />
    )

    expect(screen.getByText(/1 vehicle\?/i)).toBeInTheDocument()
  })

  it('displays warning message', () => {
    render(
      <BulkDeleteModal
        vehicleCount={3}
        open={true}
        onConfirm={mockOnConfirm}
        onCancel={mockOnCancel}
      />
    )

    expect(screen.getByText(/This action will permanently remove/i)).toBeInTheDocument()
    expect(screen.getByText(/This action cannot be undone/i)).toBeInTheDocument()
  })

  it('calls onCancel when cancel button is clicked', () => {
    render(
      <BulkDeleteModal
        vehicleCount={3}
        open={true}
        onConfirm={mockOnConfirm}
        onCancel={mockOnCancel}
      />
    )

    const cancelButton = screen.getByText('Cancel')
    fireEvent.click(cancelButton)

    expect(mockOnCancel).toHaveBeenCalledTimes(1)
    expect(mockOnConfirm).not.toHaveBeenCalled()
  })

  it('calls onConfirm when delete button is clicked', async () => {
    mockOnConfirm.mockResolvedValue(undefined)

    render(
      <BulkDeleteModal
        vehicleCount={3}
        open={true}
        onConfirm={mockOnConfirm}
        onCancel={mockOnCancel}
      />
    )

    const deleteButton = screen.getByText('Delete')
    fireEvent.click(deleteButton)

    await waitFor(() => {
      expect(mockOnConfirm).toHaveBeenCalledTimes(1)
    })
    expect(mockOnCancel).not.toHaveBeenCalled()
  })

  it('shows loading state during deletion', async () => {
    let resolveConfirm: () => void
    const confirmPromise = new Promise<void>((resolve) => {
      resolveConfirm = resolve
    })
    mockOnConfirm.mockReturnValue(confirmPromise)

    render(
      <BulkDeleteModal
        vehicleCount={3}
        open={true}
        onConfirm={mockOnConfirm}
        onCancel={mockOnCancel}
      />
    )

    const deleteButton = screen.getByText('Delete')
    fireEvent.click(deleteButton)

    await waitFor(() => {
      expect(screen.getByText('Deleting...')).toBeInTheDocument()
    })

    resolveConfirm!()
  })

  it('disables buttons during deletion', async () => {
    let resolveConfirm: () => void
    const confirmPromise = new Promise<void>((resolve) => {
      resolveConfirm = resolve
    })
    mockOnConfirm.mockReturnValue(confirmPromise)

    render(
      <BulkDeleteModal
        vehicleCount={3}
        open={true}
        onConfirm={mockOnConfirm}
        onCancel={mockOnCancel}
      />
    )

    const deleteButton = screen.getByText('Delete')
    fireEvent.click(deleteButton)

    await waitFor(() => {
      const cancelButton = screen.getByText('Cancel')
      const deletingButton = screen.getByText('Deleting...')
      expect(cancelButton).toBeDisabled()
      expect(deletingButton).toBeDisabled()
    })

    resolveConfirm!()
  })

  it('does not render when open is false', () => {
    render(
      <BulkDeleteModal
        vehicleCount={3}
        open={false}
        onConfirm={mockOnConfirm}
        onCancel={mockOnCancel}
      />
    )

    expect(screen.queryByRole('heading', { name: 'Delete Vehicles' })).not.toBeInTheDocument()
  })
})
