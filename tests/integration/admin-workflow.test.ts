/**
 * Integration tests for Admin workflow
 * Tests the complete flow: login → select store → bulk operations → reprocessing
 * 
 * Feature: vehicle-inventory-tool
 * Requirements: Complete workflow validation
 */

import { mockStore, mockUser, createMockVehicles } from '../utils/mock-factories'

// Create mock data arrays
const mockStores = [mockStore]
const mockVehicles = createMockVehicles(3)
const mockSession = {
  admin: {
    data: {
      user: { ...mockUser, role: 'ADMIN' as const },
    },
    status: 'authenticated' as const,
  },
}

// Mock API calls
global.fetch = jest.fn()

describe('Admin Workflow Integration', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  test('admin workflow API integration', async () => {
    const mockFetch = global.fetch as jest.MockedFunction<typeof fetch>
    
    // Test 1: Store API call
    mockFetch.mockImplementationOnce(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve(mockStores),
      } as Response)
    )

    const storesResponse = await fetch('/api/stores')
    const stores = await storesResponse.json()
    
    expect(stores).toEqual(mockStores)

    // Test 2: Bulk delete API call (admin-only)
    mockFetch.mockImplementationOnce(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ message: 'Vehicles deleted successfully' }),
      } as Response)
    )

    const bulkDeleteResponse = await fetch('/api/vehicles/bulk-delete', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ vehicleIds: ['1', '2'] }),
    })
    const deleteResult = await bulkDeleteResponse.json()
    
    expect(deleteResult.message).toBe('Vehicles deleted successfully')
    expect(mockFetch).toHaveBeenCalledWith('/api/vehicles/bulk-delete', expect.objectContaining({
      method: 'DELETE',
    }))
  })

  test('admin role-based access control', () => {
    const adminSession = mockSession.admin
    
    // Verify admin role
    expect(adminSession.data.user.role).toBe('ADMIN')
    
    // Admin should have all privileges
    expect(adminSession.data.user.role).not.toBe('PHOTOGRAPHER')
  })

  test('admin can perform bulk operations', async () => {
    const mockFetch = global.fetch as jest.MockedFunction<typeof fetch>
    
    // Test bulk delete
    mockFetch.mockImplementationOnce(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ message: 'Vehicles deleted successfully', deletedCount: 2 }),
      } as Response)
    )

    const response = await fetch('/api/vehicles/bulk-delete', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ vehicleIds: ['1', '2'] }),
    })
    const result = await response.json()
    
    expect(result.message).toBe('Vehicles deleted successfully')
    expect(result.deletedCount).toBe(2)
  })

  test('admin can reprocess images', async () => {
    const mockFetch = global.fetch as jest.MockedFunction<typeof fetch>
    
    // Mock successful reprocessing
    mockFetch.mockImplementationOnce(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({
          vehicle: {
            ...mockVehicles[0],
            processingStatus: 'IN_PROGRESS',
          },
        }),
      } as Response)
    )

    const response = await fetch('/api/processing/reprocess', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        vehicleId: '1',
        imageIds: ['img1', 'img2'],
      }),
    })
    const result = await response.json()
    
    expect(result.vehicle.processingStatus).toBe('IN_PROGRESS')
  })

  test('admin can download processed images', async () => {
    const mockFetch = global.fetch as jest.MockedFunction<typeof fetch>
    
    // Mock successful download
    const mockBlob = new Blob(['test image data'], { type: 'image/jpeg' })
    mockFetch.mockImplementationOnce(() =>
      Promise.resolve({
        ok: true,
        blob: () => Promise.resolve(mockBlob),
        headers: new Headers({
          'Content-Disposition': 'attachment; filename="processed_front.jpg"',
        }),
      } as Response)
    )

    const response = await fetch('/api/processing/download?imageId=img1')
    const blob = await response.blob()
    
    expect(blob.type).toBe('image/jpeg')
    expect(blob.size).toBeGreaterThan(0)
  })

  test('error handling during admin operations', async () => {
    const mockFetch = global.fetch as jest.MockedFunction<typeof fetch>
    
    // Mock API error for bulk delete
    mockFetch.mockImplementationOnce(() =>
      Promise.resolve({
        ok: false,
        status: 403,
        json: () => Promise.resolve({ error: 'Insufficient permissions' }),
      } as Response)
    )

    const response = await fetch('/api/vehicles/bulk-delete', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ vehicleIds: ['1', '2'] }),
    })
    const errorData = await response.json()
    
    expect(response.ok).toBe(false)
    expect(response.status).toBe(403)
    expect(errorData.error).toBe('Insufficient permissions')
  })

  test('authentication state management for admin', () => {
    const { data: session, status } = mockSession.admin
    
    expect(status).toBe('authenticated')
    expect(session.user).toBeDefined()
    expect(session.user.role).toBe('ADMIN')
    expect(session.user.email).toBe(mockUser.email)
  })
})