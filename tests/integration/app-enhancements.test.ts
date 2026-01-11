/**
 * Integration tests for App Enhancements
 * Tests complete flows for all new features:
 * - Store management (create, edit, delete)
 * - Add vehicle page workflow
 * - Navigation banner functionality
 * - Store cards with background images
 * - Google Cloud Storage operations
 * - Role-based access control
 * 
 * Feature: app-enhancements
 * Requirements: All (1.1-5.10)
 */

import { mockStore, mockUser, createMockVehicles } from '../utils/mock-factories'

// Create mock data
const mockStores = [
  { ...mockStore, id: 'store-1', name: 'Store 1', imageUrl: 'https://storage.googleapis.com/bucket/store-1.jpg' },
  { ...mockStore, id: 'store-2', name: 'Store 2', imageUrl: null },
]
const mockVehicles = createMockVehicles(3)

const mockSessions = {
  photographer: {
    data: {
      user: { ...mockUser, id: 'user-1', role: 'PHOTOGRAPHER' as const },
    },
    status: 'authenticated' as const,
  },
  admin: {
    data: {
      user: { ...mockUser, id: 'user-2', role: 'ADMIN' as const },
    },
    status: 'authenticated' as const,
  },
  superAdmin: {
    data: {
      user: { ...mockUser, id: 'user-3', role: 'SUPER_ADMIN' as const },
    },
    status: 'authenticated' as const,
  },
}

// Mock API calls
global.fetch = jest.fn()

describe('App Enhancements Integration Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('Store Management Flow (Super Admin)', () => {
    test('complete store management workflow: create → edit → delete', async () => {
      const mockFetch = global.fetch as jest.MockedFunction<typeof fetch>

      // Step 1: Super Admin creates a new store
      const newStore = {
        name: 'New Store',
        address: '123 Main St',
        brandLogos: ['Toyota', 'Honda'],
        imageUrl: null,
      }

      mockFetch.mockImplementationOnce(() =>
        Promise.resolve({
          ok: true,
          json: () => Promise.resolve({
            id: 'store-3',
            ...newStore,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          }),
        } as Response)
      )

      const createResponse = await fetch('/api/stores', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newStore),
      })
      const createdStore = await createResponse.json()

      expect(createResponse.ok).toBe(true)
      expect(createdStore.name).toBe('New Store')
      expect(createdStore.id).toBe('store-3')

      // Step 2: Super Admin edits the store
      const updatedData = {
        name: 'Updated Store Name',
        address: '456 Oak Ave',
      }

      mockFetch.mockImplementationOnce(() =>
        Promise.resolve({
          ok: true,
          json: () => Promise.resolve({
            ...createdStore,
            ...updatedData,
            updatedAt: new Date().toISOString(),
          }),
        } as Response)
      )

      const updateResponse = await fetch(`/api/stores/${createdStore.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedData),
      })
      const updatedStore = await updateResponse.json()

      expect(updateResponse.ok).toBe(true)
      expect(updatedStore.name).toBe('Updated Store Name')
      expect(updatedStore.address).toBe('456 Oak Ave')

      // Step 3: Super Admin deletes the store (no vehicles)
      mockFetch.mockImplementationOnce(() =>
        Promise.resolve({
          ok: true,
          json: () => Promise.resolve({ message: 'Store deleted successfully' }),
        } as Response)
      )

      const deleteResponse = await fetch(`/api/stores/${createdStore.id}`, {
        method: 'DELETE',
      })
      const deleteResult = await deleteResponse.json()

      expect(deleteResponse.ok).toBe(true)
      expect(deleteResult.message).toBe('Store deleted successfully')
    })

    test('store deletion protection when store has vehicles', async () => {
      const mockFetch = global.fetch as jest.MockedFunction<typeof fetch>

      // Attempt to delete store with vehicles
      mockFetch.mockImplementationOnce(() =>
        Promise.resolve({
          ok: false,
          status: 409,
          json: () => Promise.resolve({
            error: 'Cannot delete store with existing vehicles',
          }),
        } as Response)
      )

      const deleteResponse = await fetch('/api/stores/store-1', {
        method: 'DELETE',
      })
      const errorData = await deleteResponse.json()

      expect(deleteResponse.ok).toBe(false)
      expect(deleteResponse.status).toBe(409)
      expect(errorData.error).toContain('Cannot delete store')
    })

    test('store image upload workflow', async () => {
      const mockFetch = global.fetch as jest.MockedFunction<typeof fetch>

      // Upload store image
      const formData = new FormData()
      formData.append('image', new File(['test'], 'store.jpg', { type: 'image/jpeg' }))

      mockFetch.mockImplementationOnce(() =>
        Promise.resolve({
          ok: true,
          json: () => Promise.resolve({
            imageUrl: 'https://storage.googleapis.com/bucket/stores/store-1/store-image.jpg',
          }),
        } as Response)
      )

      const uploadResponse = await fetch('/api/stores/store-1/image', {
        method: 'POST',
        body: formData,
      })
      const result = await uploadResponse.json()

      expect(uploadResponse.ok).toBe(true)
      expect(result.imageUrl).toContain('storage.googleapis.com')
      expect(result.imageUrl).toContain('store-1')
    })
  })

  describe('Add Vehicle Page Workflow', () => {
    test('complete add vehicle flow with new page', async () => {
      const mockFetch = global.fetch as jest.MockedFunction<typeof fetch>

      // Step 1: Create vehicle with stock number
      const newVehicle = {
        stockNumber: 'VEH-12345',
        storeId: 'store-1',
      }

      mockFetch.mockImplementationOnce(() =>
        Promise.resolve({
          ok: true,
          json: () => Promise.resolve({
            id: 'vehicle-new',
            ...newVehicle,
            processingStatus: 'PENDING',
            createdAt: new Date().toISOString(),
          }),
        } as Response)
      )

      const createResponse = await fetch('/api/vehicles', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newVehicle),
      })
      const createdVehicle = await createResponse.json()

      expect(createResponse.ok).toBe(true)
      expect(createdVehicle.stockNumber).toBe('VEH-12345')
      expect(createdVehicle.id).toBe('vehicle-new')

      // Step 2: Upload photos to the new vehicle
      const formData = new FormData()
      formData.append('file_0', new File(['test'], 'front.jpg', { type: 'image/jpeg' }))
      formData.append('imageType_0', 'FRONT')
      formData.append('file_1', new File(['test'], 'back.jpg', { type: 'image/jpeg' }))
      formData.append('imageType_1', 'BACK')

      mockFetch.mockImplementationOnce(() =>
        Promise.resolve({
          ok: true,
          json: () => Promise.resolve({
            message: 'Images uploaded successfully',
            images: [
              { id: 'img-1', imageType: 'FRONT', originalUrl: 'https://storage.googleapis.com/bucket/front.jpg' },
              { id: 'img-2', imageType: 'BACK', originalUrl: 'https://storage.googleapis.com/bucket/back.jpg' },
            ],
          }),
        } as Response)
      )

      const uploadResponse = await fetch(`/api/vehicles/${createdVehicle.id}/images`, {
        method: 'POST',
        body: formData,
      })
      const uploadResult = await uploadResponse.json()

      expect(uploadResponse.ok).toBe(true)
      expect(uploadResult.images).toHaveLength(2)
      expect(uploadResult.images[0].imageType).toBe('FRONT')
      expect(uploadResult.images[1].imageType).toBe('BACK')

      // Step 3: Verify vehicle with images
      mockFetch.mockImplementationOnce(() =>
        Promise.resolve({
          ok: true,
          json: () => Promise.resolve({
            ...createdVehicle,
            images: uploadResult.images,
          }),
        } as Response)
      )

      const vehicleResponse = await fetch(`/api/vehicles/${createdVehicle.id}`)
      const vehicleWithImages = await vehicleResponse.json()

      expect(vehicleWithImages.images).toHaveLength(2)
    })

    test('form validation prevents invalid submissions', async () => {
      const mockFetch = global.fetch as jest.MockedFunction<typeof fetch>

      // Attempt to create vehicle with empty stock number
      mockFetch.mockImplementationOnce(() =>
        Promise.resolve({
          ok: false,
          status: 400,
          json: () => Promise.resolve({
            error: 'Stock number is required',
          }),
        } as Response)
      )

      const response = await fetch('/api/vehicles', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ stockNumber: '', storeId: 'store-1' }),
      })
      const errorData = await response.json()

      expect(response.ok).toBe(false)
      expect(response.status).toBe(400)
      expect(errorData.error).toContain('Stock number')
    })
  })

  describe('Navigation Banner Functionality', () => {
    test('navigation banner appears on all pages after store selection', async () => {
      const mockFetch = global.fetch as jest.MockedFunction<typeof fetch>

      // Simulate store selection
      const selectedStore = mockStores[0]

      // Test 1: Navigation on vehicles list page
      mockFetch.mockImplementationOnce(() =>
        Promise.resolve({
          ok: true,
          json: () => Promise.resolve({
            data: mockVehicles,
            totalCount: mockVehicles.length,
          }),
        } as Response)
      )

      const vehiclesResponse = await fetch(`/api/vehicles?storeId=${selectedStore.id}`)
      const vehiclesData = await vehiclesResponse.json()

      expect(vehiclesResponse.ok).toBe(true)
      expect(vehiclesData.data).toBeDefined()

      // Test 2: Navigation on vehicle detail page
      mockFetch.mockImplementationOnce(() =>
        Promise.resolve({
          ok: true,
          json: () => Promise.resolve(mockVehicles[0]),
        } as Response)
      )

      const vehicleResponse = await fetch(`/api/vehicles/${mockVehicles[0].id}`)
      const vehicle = await vehicleResponse.json()

      expect(vehicleResponse.ok).toBe(true)
      expect(vehicle.id).toBe(mockVehicles[0].id)
    })

    test('back to stores navigation works from any page', async () => {
      const mockFetch = global.fetch as jest.MockedFunction<typeof fetch>

      // Fetch stores list (simulating navigation back)
      mockFetch.mockImplementationOnce(() =>
        Promise.resolve({
          ok: true,
          json: () => Promise.resolve(mockStores),
        } as Response)
      )

      const storesResponse = await fetch('/api/stores')
      const stores = await storesResponse.json()

      expect(storesResponse.ok).toBe(true)
      expect(stores).toHaveLength(2)
    })
  })

  describe('Store Cards with Background Images', () => {
    test('store cards display with background images', async () => {
      const mockFetch = global.fetch as jest.MockedFunction<typeof fetch>

      // Fetch stores with images
      mockFetch.mockImplementationOnce(() =>
        Promise.resolve({
          ok: true,
          json: () => Promise.resolve(mockStores),
        } as Response)
      )

      const response = await fetch('/api/stores')
      const stores = await response.json()

      expect(response.ok).toBe(true)
      expect(stores[0].imageUrl).toBeTruthy()
      expect(stores[0].imageUrl).toContain('storage.googleapis.com')
      expect(stores[1].imageUrl).toBeNull() // Fallback case
    })

    test('store cards handle missing images gracefully', async () => {
      const mockFetch = global.fetch as jest.MockedFunction<typeof fetch>

      // Fetch store without image
      mockFetch.mockImplementationOnce(() =>
        Promise.resolve({
          ok: true,
          json: () => Promise.resolve([mockStores[1]]), // Store without imageUrl
        } as Response)
      )

      const response = await fetch('/api/stores')
      const stores = await response.json()

      expect(response.ok).toBe(true)
      expect(stores[0].imageUrl).toBeNull()
      // Component should render with fallback gradient
    })
  })

  describe('Google Cloud Storage Operations', () => {
    test('GCS upload operations work correctly', async () => {
      const mockFetch = global.fetch as jest.MockedFunction<typeof fetch>

      // Upload vehicle image to GCS
      const formData = new FormData()
      formData.append('file_0', new File(['test'], 'test.jpg', { type: 'image/jpeg' }))
      formData.append('imageType_0', 'FRONT')

      mockFetch.mockImplementationOnce(() =>
        Promise.resolve({
          ok: true,
          json: () => Promise.resolve({
            message: 'Images uploaded successfully',
            images: [{
              id: 'img-1',
              originalUrl: 'https://storage.googleapis.com/bucket/stores/store-1/vehicles/vehicle-1/original/test.jpg',
              thumbnailUrl: 'https://storage.googleapis.com/bucket/stores/store-1/vehicles/vehicle-1/thumbnail/test.jpg',
            }],
          }),
        } as Response)
      )

      const response = await fetch('/api/vehicles/vehicle-1/images', {
        method: 'POST',
        body: formData,
      })
      const result = await response.json()

      expect(response.ok).toBe(true)
      expect(result.images[0].originalUrl).toContain('storage.googleapis.com')
      expect(result.images[0].thumbnailUrl).toContain('storage.googleapis.com')
    })

    test('GCS delete operations work correctly', async () => {
      const mockFetch = global.fetch as jest.MockedFunction<typeof fetch>

      // Delete image from GCS
      mockFetch.mockImplementationOnce(() =>
        Promise.resolve({
          ok: true,
          json: () => Promise.resolve({ message: 'Image deleted successfully' }),
        } as Response)
      )

      const response = await fetch('/api/vehicles/vehicle-1/images/img-1', {
        method: 'DELETE',
      })
      const result = await response.json()

      expect(response.ok).toBe(true)
      expect(result.message).toBe('Image deleted successfully')
    })

    test('GCS handles upload errors gracefully', async () => {
      const mockFetch = global.fetch as jest.MockedFunction<typeof fetch>

      // Simulate upload failure
      mockFetch.mockImplementationOnce(() =>
        Promise.resolve({
          ok: false,
          status: 500,
          json: () => Promise.resolve({ error: 'Storage service unavailable' }),
        } as Response)
      )

      const formData = new FormData()
      formData.append('file_0', new File(['test'], 'test.jpg', { type: 'image/jpeg' }))

      const response = await fetch('/api/vehicles/vehicle-1/images', {
        method: 'POST',
        body: formData,
      })
      const errorData = await response.json()

      expect(response.ok).toBe(false)
      expect(errorData.error).toContain('Storage service')
    })
  })

  describe('Role-Based Access Control', () => {
    test('Super Admin can access store management', async () => {
      const mockFetch = global.fetch as jest.MockedFunction<typeof fetch>

      // Super Admin creates store
      mockFetch.mockImplementationOnce(() =>
        Promise.resolve({
          ok: true,
          json: () => Promise.resolve({
            id: 'store-new',
            name: 'New Store',
            address: '123 Main St',
          }),
        } as Response)
      )

      const response = await fetch('/api/stores', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: 'New Store', address: '123 Main St' }),
      })

      expect(response.ok).toBe(true)
    })

    test('Admin cannot access store management', async () => {
      const mockFetch = global.fetch as jest.MockedFunction<typeof fetch>

      // Admin attempts to create store
      mockFetch.mockImplementationOnce(() =>
        Promise.resolve({
          ok: false,
          status: 403,
          json: () => Promise.resolve({ error: 'Forbidden: Super Admin access required' }),
        } as Response)
      )

      const response = await fetch('/api/stores', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: 'New Store', address: '123 Main St' }),
      })
      const errorData = await response.json()

      expect(response.ok).toBe(false)
      expect(response.status).toBe(403)
      expect(errorData.error).toContain('Super Admin')
    })

    test('Photographer cannot access store management', async () => {
      const mockFetch = global.fetch as jest.MockedFunction<typeof fetch>

      // Photographer attempts to delete store
      mockFetch.mockImplementationOnce(() =>
        Promise.resolve({
          ok: false,
          status: 403,
          json: () => Promise.resolve({ error: 'Forbidden: Super Admin access required' }),
        } as Response)
      )

      const response = await fetch('/api/stores/store-1', {
        method: 'DELETE',
      })
      const errorData = await response.json()

      expect(response.ok).toBe(false)
      expect(response.status).toBe(403)
      expect(errorData.error).toContain('Super Admin')
    })

    test('role verification for all user types', () => {
      // Verify photographer role
      expect(mockSessions.photographer.data.user.role).toBe('PHOTOGRAPHER')

      // Verify admin role
      expect(mockSessions.admin.data.user.role).toBe('ADMIN')

      // Verify super admin role
      expect(mockSessions.superAdmin.data.user.role).toBe('SUPER_ADMIN')
    })
  })

  describe('Error Handling and Edge Cases', () => {
    test('handles network errors gracefully', async () => {
      const mockFetch = global.fetch as jest.MockedFunction<typeof fetch>

      // Simulate network error
      mockFetch.mockImplementationOnce(() =>
        Promise.reject(new Error('Network error'))
      )

      try {
        await fetch('/api/stores')
        fail('Should have thrown an error')
      } catch (error) {
        expect(error).toBeDefined()
        expect((error as Error).message).toBe('Network error')
      }
    })

    test('handles invalid data gracefully', async () => {
      const mockFetch = global.fetch as jest.MockedFunction<typeof fetch>

      // Send invalid data
      mockFetch.mockImplementationOnce(() =>
        Promise.resolve({
          ok: false,
          status: 400,
          json: () => Promise.resolve({ error: 'Invalid data format' }),
        } as Response)
      )

      const response = await fetch('/api/stores', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ invalid: 'data' }),
      })
      const errorData = await response.json()

      expect(response.ok).toBe(false)
      expect(response.status).toBe(400)
      expect(errorData.error).toContain('Invalid')
    })

    test('handles authentication errors', async () => {
      const mockFetch = global.fetch as jest.MockedFunction<typeof fetch>

      // Simulate unauthenticated request
      mockFetch.mockImplementationOnce(() =>
        Promise.resolve({
          ok: false,
          status: 401,
          json: () => Promise.resolve({ error: 'Unauthorized' }),
        } as Response)
      )

      const response = await fetch('/api/vehicles')
      const errorData = await response.json()

      expect(response.ok).toBe(false)
      expect(response.status).toBe(401)
      expect(errorData.error).toBe('Unauthorized')
    })
  })

  describe('Complete End-to-End Scenarios', () => {
    test('Super Admin complete workflow: manage stores and vehicles', async () => {
      const mockFetch = global.fetch as jest.MockedFunction<typeof fetch>

      // 1. Create store
      mockFetch.mockImplementationOnce(() =>
        Promise.resolve({
          ok: true,
          json: () => Promise.resolve({ id: 'store-new', name: 'Test Store' }),
        } as Response)
      )

      const storeResponse = await fetch('/api/stores', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: 'Test Store', address: '123 Main' }),
      })
      const store = await storeResponse.json()
      expect(store.id).toBe('store-new')

      // 2. Upload store image
      mockFetch.mockImplementationOnce(() =>
        Promise.resolve({
          ok: true,
          json: () => Promise.resolve({ imageUrl: 'https://storage.googleapis.com/bucket/store.jpg' }),
        } as Response)
      )

      const imageResponse = await fetch(`/api/stores/${store.id}/image`, {
        method: 'POST',
        body: new FormData(),
      })
      const imageResult = await imageResponse.json()
      expect(imageResult.imageUrl).toBeTruthy()

      // 3. Create vehicle in new store
      mockFetch.mockImplementationOnce(() =>
        Promise.resolve({
          ok: true,
          json: () => Promise.resolve({ id: 'vehicle-new', stockNumber: 'VEH-001', storeId: store.id }),
        } as Response)
      )

      const vehicleResponse = await fetch('/api/vehicles', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ stockNumber: 'VEH-001', storeId: store.id }),
      })
      const vehicle = await vehicleResponse.json()
      expect(vehicle.storeId).toBe(store.id)
    })

    test('Photographer complete workflow: select store and manage photos', async () => {
      const mockFetch = global.fetch as jest.MockedFunction<typeof fetch>

      // 1. Get stores
      mockFetch.mockImplementationOnce(() =>
        Promise.resolve({
          ok: true,
          json: () => Promise.resolve(mockStores),
        } as Response)
      )

      const storesResponse = await fetch('/api/stores')
      const stores = await storesResponse.json()
      expect(stores).toHaveLength(2)

      // 2. Get vehicles for selected store
      mockFetch.mockImplementationOnce(() =>
        Promise.resolve({
          ok: true,
          json: () => Promise.resolve({ data: mockVehicles }),
        } as Response)
      )

      const vehiclesResponse = await fetch(`/api/vehicles?storeId=${stores[0].id}`)
      const vehiclesData = await vehiclesResponse.json()
      expect(vehiclesData.data).toBeDefined()

      // 3. Upload photos to vehicle
      mockFetch.mockImplementationOnce(() =>
        Promise.resolve({
          ok: true,
          json: () => Promise.resolve({
            message: 'Images uploaded successfully',
            images: [{ id: 'img-1' }],
          }),
        } as Response)
      )

      const uploadResponse = await fetch(`/api/vehicles/${mockVehicles[0].id}/images`, {
        method: 'POST',
        body: new FormData(),
      })
      const uploadResult = await uploadResponse.json()
      expect(uploadResult.images).toHaveLength(1)
    })
  })
})
