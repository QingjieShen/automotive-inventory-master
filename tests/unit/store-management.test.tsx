import { render, screen, waitFor, fireEvent } from '../utils/test-utils'
import { mockSession, mockAdminSession } from '../utils/test-utils'
import StoreManagementPage from '../../src/app/admin/stores/page'

// Mock Super Admin session
const mockSuperAdminSession = {
  user: {
    id: '3',
    email: 'superadmin@example.com',
    name: 'Super Admin',
    role: 'SUPER_ADMIN' as const,
  },
  expires: '2024-12-31',
}

// Mock useSession hook
let mockSessionData: any = mockSuperAdminSession
jest.mock('next-auth/react', () => ({
  useSession: () => ({
    data: mockSessionData,
    status: mockSessionData ? 'authenticated' : 'unauthenticated',
  }),
  SessionProvider: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}))

// Mock Next.js router
const mockPush = jest.fn()
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: mockPush,
  }),
}))

// Mock fetch
global.fetch = jest.fn()

// Mock stores data
const mockStores = [
  {
    id: '1',
    name: 'Downtown Store',
    address: '123 Main St',
    brandLogos: ['Honda', 'Toyota'],
    imageUrl: 'https://example.com/store1.jpg',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: '2',
    name: 'Uptown Store',
    address: '456 Oak Ave',
    brandLogos: ['Ford'],
    imageUrl: null,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
]

describe('Store Management Page', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    mockSessionData = mockSuperAdminSession
    ;(global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => mockStores,
    })
  })

  describe('Access Control', () => {
    test('Super Admin can access page', async () => {
      mockSessionData = mockSuperAdminSession
      render(<StoreManagementPage />)

      await waitFor(() => {
        expect(screen.getByText('Store Management')).toBeInTheDocument()
      })
    })

    test('non-Super Admin cannot access page', async () => {
      mockSessionData = mockAdminSession
      render(<StoreManagementPage />)

      await waitFor(() => {
        expect(screen.queryByText('Store Management')).not.toBeInTheDocument()
        expect(
          screen.getByText("You don't have permission to access this feature.")
        ).toBeInTheDocument()
      })
    })

    test('Photographer cannot access page', async () => {
      mockSessionData = mockSession
      render(<StoreManagementPage />)

      await waitFor(() => {
        expect(screen.queryByText('Store Management')).not.toBeInTheDocument()
        expect(
          screen.getByText("You don't have permission to access this feature.")
        ).toBeInTheDocument()
      })
    })

    test('unauthenticated user cannot access page', async () => {
      mockSessionData = null
      render(<StoreManagementPage />)

      await waitFor(() => {
        expect(screen.queryByText('Store Management')).not.toBeInTheDocument()
      })
    })
  })

  describe('Store List Display', () => {
    test('displays list of stores', async () => {
      mockSessionData = mockSuperAdminSession
      render(<StoreManagementPage />)

      await waitFor(() => {
        expect(screen.getByText('Downtown Store')).toBeInTheDocument()
        expect(screen.getByText('Uptown Store')).toBeInTheDocument()
        expect(screen.getByText('123 Main St')).toBeInTheDocument()
        expect(screen.getByText('456 Oak Ave')).toBeInTheDocument()
      })
    })

    test('displays Add Store button', async () => {
      mockSessionData = mockSuperAdminSession
      render(<StoreManagementPage />)

      await waitFor(() => {
        expect(screen.getByText('Add Store')).toBeInTheDocument()
      })
    })

    test('displays edit and delete actions for each store', async () => {
      mockSessionData = mockSuperAdminSession
      render(<StoreManagementPage />)

      await waitFor(() => {
        const editButtons = screen.getAllByText('Edit')
        const deleteButtons = screen.getAllByText('Delete')
        expect(editButtons).toHaveLength(2)
        expect(deleteButtons).toHaveLength(2)
      })
    })
  })

  describe('Store Creation Form', () => {
    test('opens add store modal when Add Store button is clicked', async () => {
      mockSessionData = mockSuperAdminSession
      render(<StoreManagementPage />)

      await waitFor(() => {
        expect(screen.getByText('Add Store')).toBeInTheDocument()
      })

      fireEvent.click(screen.getByText('Add Store'))

      await waitFor(() => {
        expect(screen.getByText('Add New Store')).toBeInTheDocument()
      })
    })

    test('validates required fields in store creation form', async () => {
      mockSessionData = mockSuperAdminSession
      render(<StoreManagementPage />)

      await waitFor(() => {
        fireEvent.click(screen.getByText('Add Store'))
      })

      await waitFor(() => {
        expect(screen.getByText('Add New Store')).toBeInTheDocument()
      })

      // Try to submit without filling required fields
      const createButton = screen.getByText('Create Store')
      fireEvent.click(createButton)

      // HTML5 validation should prevent submission
      // The form should still be visible
      await waitFor(() => {
        expect(screen.getByText('Add New Store')).toBeInTheDocument()
      })
    })

    test('displays validation error for empty store name', async () => {
      mockSessionData = mockSuperAdminSession
      render(<StoreManagementPage />)

      await waitFor(() => {
        fireEvent.click(screen.getByText('Add Store'))
      })

      await waitFor(() => {
        expect(screen.getByText('Add New Store')).toBeInTheDocument()
      })

      // Fill only address, leave name empty
      const addressInput = screen.getByLabelText(/Address/i)
      fireEvent.change(addressInput, { target: { value: '123 Test St' } })

      // Submit form
      const form = screen.getByText('Create Store').closest('form')
      if (form) {
        fireEvent.submit(form)
      }

      await waitFor(() => {
        expect(screen.getByText('Store name is required')).toBeInTheDocument()
      })
    })

    test('displays validation error for empty address', async () => {
      mockSessionData = mockSuperAdminSession
      render(<StoreManagementPage />)

      await waitFor(() => {
        fireEvent.click(screen.getByText('Add Store'))
      })

      await waitFor(() => {
        expect(screen.getByText('Add New Store')).toBeInTheDocument()
      })

      // Fill only name, leave address empty
      const nameInput = screen.getByLabelText(/Store Name/i)
      fireEvent.change(nameInput, { target: { value: 'Test Store' } })

      // Submit form
      const form = screen.getByText('Create Store').closest('form')
      if (form) {
        fireEvent.submit(form)
      }

      await waitFor(() => {
        expect(screen.getByText('Store address is required')).toBeInTheDocument()
      })
    })

    test('successfully creates store with valid data', async () => {
      mockSessionData = mockSuperAdminSession
      ;(global.fetch as jest.Mock)
        .mockResolvedValueOnce({
          ok: true,
          json: async () => mockStores,
        })
        .mockResolvedValueOnce({
          ok: true,
          json: async () => ({
            id: '3',
            name: 'New Store',
            address: '789 Pine St',
            brandLogos: ['Nissan'],
            imageUrl: null,
          }),
        })
        .mockResolvedValueOnce({
          ok: true,
          json: async () => [...mockStores, { id: '3', name: 'New Store' }],
        })

      render(<StoreManagementPage />)

      await waitFor(() => {
        fireEvent.click(screen.getByText('Add Store'))
      })

      await waitFor(() => {
        expect(screen.getByText('Add New Store')).toBeInTheDocument()
      })

      // Fill form
      const nameInput = screen.getByLabelText(/Store Name/i)
      const addressInput = screen.getByLabelText(/Address/i)
      const brandLogosInput = screen.getByLabelText(/Brand Logos/i)

      fireEvent.change(nameInput, { target: { value: 'New Store' } })
      fireEvent.change(addressInput, { target: { value: '789 Pine St' } })
      fireEvent.change(brandLogosInput, { target: { value: 'Nissan' } })

      // Submit form
      const form = screen.getByText('Create Store').closest('form')
      if (form) {
        fireEvent.submit(form)
      }

      await waitFor(() => {
        expect(global.fetch).toHaveBeenCalledWith(
          '/api/stores',
          expect.objectContaining({
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: expect.stringContaining('New Store'),
          })
        )
      })
    })
  })

  describe('Delete Confirmation Dialog', () => {
    test('opens delete confirmation dialog when Delete button is clicked', async () => {
      mockSessionData = mockSuperAdminSession
      render(<StoreManagementPage />)

      await waitFor(() => {
        expect(screen.getByText('Downtown Store')).toBeInTheDocument()
      })

      const deleteButtons = screen.getAllByText('Delete')
      fireEvent.click(deleteButtons[0])

      await waitFor(() => {
        expect(screen.getByRole('heading', { name: /Delete Store/i })).toBeInTheDocument()
        expect(
          screen.getByText(/Are you sure you want to delete/i)
        ).toBeInTheDocument()
      })
    })

    test('closes delete dialog when Cancel is clicked', async () => {
      mockSessionData = mockSuperAdminSession
      render(<StoreManagementPage />)

      await waitFor(() => {
        expect(screen.getByText('Downtown Store')).toBeInTheDocument()
      })

      const deleteButtons = screen.getAllByText('Delete')
      fireEvent.click(deleteButtons[0])

      await waitFor(() => {
        expect(screen.getByRole('heading', { name: /Delete Store/i })).toBeInTheDocument()
      })

      const cancelButton = screen.getAllByText('Cancel').find(btn => 
        btn.closest('.fixed') !== null
      )
      if (cancelButton) {
        fireEvent.click(cancelButton)
      }

      await waitFor(() => {
        expect(screen.queryByRole('heading', { name: /Delete Store/i })).not.toBeInTheDocument()
      })
    })

    test('displays error when trying to delete store with vehicles', async () => {
      mockSessionData = mockSuperAdminSession
      ;(global.fetch as jest.Mock)
        .mockResolvedValueOnce({
          ok: true,
          json: async () => mockStores,
        })
        .mockResolvedValueOnce({
          ok: false,
          json: async () => ({
            error: 'Cannot delete store with existing vehicles',
          }),
        })

      render(<StoreManagementPage />)

      await waitFor(() => {
        expect(screen.getByText('Downtown Store')).toBeInTheDocument()
      })

      const deleteButtons = screen.getAllByText('Delete')
      fireEvent.click(deleteButtons[0])

      await waitFor(() => {
        expect(screen.getByRole('heading', { name: /Delete Store/i })).toBeInTheDocument()
      })

      const deleteStoreButton = screen.getByRole('button', { name: 'Delete Store' })
      fireEvent.click(deleteStoreButton)

      await waitFor(() => {
        expect(
          screen.getByText('Cannot delete store with existing vehicles')
        ).toBeInTheDocument()
      })
    })

    test('successfully deletes store without vehicles', async () => {
      mockSessionData = mockSuperAdminSession
      ;(global.fetch as jest.Mock)
        .mockResolvedValueOnce({
          ok: true,
          json: async () => mockStores,
        })
        .mockResolvedValueOnce({
          ok: true,
          json: async () => ({}),
        })
        .mockResolvedValueOnce({
          ok: true,
          json: async () => [mockStores[1]],
        })

      render(<StoreManagementPage />)

      await waitFor(() => {
        expect(screen.getByText('Downtown Store')).toBeInTheDocument()
      })

      const deleteButtons = screen.getAllByText('Delete')
      fireEvent.click(deleteButtons[0])

      await waitFor(() => {
        expect(screen.getByRole('heading', { name: /Delete Store/i })).toBeInTheDocument()
      })

      const deleteStoreButton = screen.getByRole('button', { name: 'Delete Store' })
      fireEvent.click(deleteStoreButton)

      await waitFor(() => {
        expect(global.fetch).toHaveBeenCalledWith(
          '/api/stores/1',
          expect.objectContaining({
            method: 'DELETE',
          })
        )
      })
    })
  })

  describe('Store Edit Form', () => {
    test('opens edit modal when Edit button is clicked', async () => {
      mockSessionData = mockSuperAdminSession
      render(<StoreManagementPage />)

      await waitFor(() => {
        expect(screen.getByText('Downtown Store')).toBeInTheDocument()
      })

      const editButtons = screen.getAllByText('Edit')
      fireEvent.click(editButtons[0])

      await waitFor(() => {
        expect(screen.getByText('Edit Store')).toBeInTheDocument()
      })
    })

    test('pre-fills form with existing store data', async () => {
      mockSessionData = mockSuperAdminSession
      render(<StoreManagementPage />)

      await waitFor(() => {
        expect(screen.getByText('Downtown Store')).toBeInTheDocument()
      })

      const editButtons = screen.getAllByText('Edit')
      fireEvent.click(editButtons[0])

      await waitFor(() => {
        expect(screen.getByText('Edit Store')).toBeInTheDocument()
      })

      const nameInput = screen.getByLabelText(/Store Name/i) as HTMLInputElement
      const addressInput = screen.getByLabelText(/Address/i) as HTMLInputElement

      expect(nameInput.value).toBe('Downtown Store')
      expect(addressInput.value).toBe('123 Main St')
    })
  })

  describe('Navigation', () => {
    test('Back to Stores button navigates to stores page', async () => {
      mockSessionData = mockSuperAdminSession
      render(<StoreManagementPage />)

      await waitFor(() => {
        expect(screen.getByText('Back to Stores')).toBeInTheDocument()
      })

      fireEvent.click(screen.getByText('Back to Stores'))

      expect(mockPush).toHaveBeenCalledWith('/stores')
    })
  })
})
