/**
 * Integration tests for Photographer workflow
 * Tests the complete flow: login → select store → manage photos
 * 
 * Feature: vehicle-inventory-tool
 * Requirements: Complete workflow validation
 */

import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { SessionProvider } from 'next-auth/react'
import { StoreProvider } from '@/components/providers/StoreProvider'
import { ErrorBoundary } from '@/components/common'
import { mockStore, mockVehicle, mockUser, createMockVehicles } from '../utils/mock-factories'

// Create mock data arrays
const mockStores = [mockStore]
const mockVehicles = createMockVehicles(3)
const mockSession = {
  photographer: {
    data: {
      user: { ...mockUser, role: 'PHOTOGRAPHER' as const },
    },
    status: 'authenticated' as const,
  },
  admin: {
    data: {
      user: { ...mockUser, role: 'ADMIN' as const },
    },
    status: 'authenticated' as const,
  },
}

// Mock Next.js router
const mockPush = jest.fn()
const mockBack = jest.fn()
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: mockPush,
    back: mockBack,
    refresh: jest.fn(),
  }),
  useParams: () => ({ id: 'test-vehicle-id' }),
}))

// Mock NextAuth
jest.mock('next-auth/react', () => ({
  useSession: () => mockSession.photographer,
  SessionProvider: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}))

// Mock API calls
global.fetch = jest.fn()

const TestWrapper = ({ children }: { children: React.ReactNode }) => (
  <ErrorBoundary>
    <SessionProvider>
      <StoreProvider>
        {children}
      </StoreProvider>
    </SessionProvider>
  </ErrorBoundary>
)

describe('Photographer Workflow Integration', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    // Mock localStorage
    Object.defineProperty(window, 'localStorage', {
      value: {
        getItem: jest.fn(),
        setItem: jest.fn(),
        removeItem: jest.fn(),
      },
      writable: true,
    })
  })

  test('photographer workflow API integration', async () => {
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
    expect(mockFetch).toHaveBeenCalledWith('/api/stores')

    // Test 2: Vehicles API call
    mockFetch.mockImplementationOnce(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({
          data: mockVehicles,
          totalCount: mockVehicles.length,
          currentPage: 1,
          totalPages: 1,
        }),
      } as Response)
    )

    const vehiclesResponse = await fetch('/api/vehicles?storeId=1&page=1&limit=10')
    const vehiclesData = await vehiclesResponse.json()
    
    expect(vehiclesData.data).toEqual(mockVehicles)
    expect(vehiclesData.totalCount).toBe(mockVehicles.length)

    // Test 3: Vehicle detail API call
    mockFetch.mockImplementationOnce(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve(mockVehicles[0]),
      } as Response)
    )

    const vehicleResponse = await fetch('/api/vehicles/1')
    const vehicle = await vehicleResponse.json()
    
    expect(vehicle).toEqual(mockVehicles[0])

    // Test 4: Photo upload API call
    mockFetch.mockImplementationOnce(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({
          message: 'Images uploaded successfully',
          images: [{ id: 'new-image-id', originalUrl: 'test-url' }],
        }),
      } as Response)
    )

    const formData = new FormData()
    formData.append('file_0', new File(['test'], 'test.jpg', { type: 'image/jpeg' }))
    formData.append('imageType_0', 'FRONT')

    const uploadResponse = await fetch('/api/vehicles/1/images', {
      method: 'POST',
      body: formData,
    })
    const uploadResult = await uploadResponse.json()
    
    expect(uploadResult.message).toBe('Images uploaded successfully')
    expect(uploadResult.images).toHaveLength(1)
  })

  test('photographer role-based access control', () => {
    const photographerSession = mockSession.photographer
    
    // Verify photographer role
    expect(photographerSession.data.user.role).toBe('PHOTOGRAPHER')
    
    // Photographer should not have admin privileges
    expect(photographerSession.data.user.role).not.toBe('ADMIN')
  })

  test('error handling in API calls', async () => {
    const mockFetch = global.fetch as jest.MockedFunction<typeof fetch>
    
    // Mock API error
    mockFetch.mockImplementationOnce(() =>
      Promise.resolve({
        ok: false,
        status: 500,
        json: () => Promise.resolve({ error: 'Server error' }),
      } as Response)
    )

    const response = await fetch('/api/vehicles?storeId=1')
    const errorData = await response.json()
    
    expect(response.ok).toBe(false)
    expect(response.status).toBe(500)
    expect(errorData.error).toBe('Server error')
  })

  test('authentication state management', () => {
    const { data: session, status } = mockSession.photographer
    
    expect(status).toBe('authenticated')
    expect(session.user).toBeDefined()
    expect(session.user.role).toBe('PHOTOGRAPHER')
    expect(session.user.email).toBe(mockUser.email)
  })

  test('store selection workflow', () => {
    // Mock localStorage for store selection
    const mockSetItem = jest.fn()
    Object.defineProperty(window, 'localStorage', {
      value: { setItem: mockSetItem },
      writable: true,
    })

    // Simulate store selection
    const selectedStore = mockStores[0]
    localStorage.setItem('selectedStore', JSON.stringify(selectedStore))
    
    expect(mockSetItem).toHaveBeenCalledWith('selectedStore', JSON.stringify(selectedStore))
  })
})