/**
 * Unit tests for Account page
 * Tests user profile display and logout functionality
 */

import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { useSession, signOut } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import AccountPage from '@/app/account/page'

// Mock Next.js hooks
jest.mock('next-auth/react')
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}))

// Mock StoreProvider
jest.mock('@/components/providers/StoreProvider', () => ({
  useStore: () => ({
    selectedStore: {
      id: 'store-1',
      name: 'Test Store',
      address: '123 Main St',
      brandLogos: [],
    },
  }),
}))

// Mock NavigationBanner
jest.mock('@/components/common/NavigationBanner', () => ({
  __esModule: true,
  default: () => <div data-testid="navigation-banner">Navigation Banner</div>,
}))

// Mock ProtectedRoute
jest.mock('@/components/auth/ProtectedRoute', () => ({
  ProtectedRoute: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}))

const mockUseSession = useSession as jest.MockedFunction<typeof useSession>
const mockSignOut = signOut as jest.MockedFunction<typeof signOut>
const mockUseRouter = useRouter as jest.MockedFunction<typeof useRouter>

describe('Account Page', () => {
  const mockPush = jest.fn()
  const mockSession = {
    data: {
      user: {
        id: 'user-1',
        name: 'Test User',
        email: 'test@example.com',
        role: 'PHOTOGRAPHER' as const,
      },
    },
    status: 'authenticated' as const,
  }

  beforeEach(() => {
    jest.clearAllMocks()
    mockUseRouter.mockReturnValue({
      push: mockPush,
      back: jest.fn(),
      forward: jest.fn(),
      refresh: jest.fn(),
      replace: jest.fn(),
      prefetch: jest.fn(),
    } as any)
    mockUseSession.mockReturnValue(mockSession)
  })

  test('renders account page with user information', () => {
    render(<AccountPage />)

    expect(screen.getByText('Account Settings')).toBeInTheDocument()
    expect(screen.getByText('Test User')).toBeInTheDocument()
    expect(screen.getByText('test@example.com')).toBeInTheDocument()
  })

  test('displays user role correctly', () => {
    render(<AccountPage />)

    expect(screen.getByText('Photographer')).toBeInTheDocument()
    expect(screen.getByText('Can upload and manage vehicle photos')).toBeInTheDocument()
  })

  test('displays current store information', () => {
    render(<AccountPage />)

    expect(screen.getByText('Current Store')).toBeInTheDocument()
    expect(screen.getByText('Test Store')).toBeInTheDocument()
    expect(screen.getByText('123 Main St')).toBeInTheDocument()
  })

  test('displays different role badges for different roles', () => {
    // Test Super Admin
    mockUseSession.mockReturnValue({
      ...mockSession,
      data: {
        user: { ...mockSession.data.user, role: 'SUPER_ADMIN' },
      },
    })

    const { rerender } = render(<AccountPage />)
    expect(screen.getByText('Super Admin')).toBeInTheDocument()
    expect(screen.getByText('Full system access including store management')).toBeInTheDocument()

    // Test Admin
    mockUseSession.mockReturnValue({
      ...mockSession,
      data: {
        user: { ...mockSession.data.user, role: 'ADMIN' },
      },
    })

    rerender(<AccountPage />)
    expect(screen.getByText('Admin')).toBeInTheDocument()
    expect(screen.getByText('Can manage vehicles, delete, and reprocess images')).toBeInTheDocument()
  })

  test('logout button calls signOut', async () => {
    mockSignOut.mockResolvedValue(undefined as any)

    render(<AccountPage />)

    const logoutButton = screen.getByText('Log Out')
    fireEvent.click(logoutButton)

    await waitFor(() => {
      expect(mockSignOut).toHaveBeenCalledWith({
        callbackUrl: '/login',
        redirect: true,
      })
    })
  })

  test('logout button shows loading state', async () => {
    mockSignOut.mockImplementation(() => new Promise(() => {})) // Never resolves

    render(<AccountPage />)

    const logoutButton = screen.getByText('Log Out')
    fireEvent.click(logoutButton)

    await waitFor(() => {
      expect(screen.getByText('Logging out...')).toBeInTheDocument()
    })
  })

  test('back to vehicles button navigates correctly', () => {
    render(<AccountPage />)

    const backButton = screen.getByText('Back to Vehicles')
    fireEvent.click(backButton)

    expect(mockPush).toHaveBeenCalledWith('/vehicles')
  })

  test('redirects to login if not authenticated', () => {
    mockUseSession.mockReturnValue({
      data: null,
      status: 'unauthenticated',
    })

    render(<AccountPage />)

    expect(mockPush).toHaveBeenCalledWith('/login')
  })

  test('shows loading spinner while session is loading', () => {
    mockUseSession.mockReturnValue({
      data: null,
      status: 'loading',
    })

    render(<AccountPage />)

    expect(screen.getByText('Loading...')).toBeInTheDocument()
  })

  test('displays user ID for support purposes', () => {
    render(<AccountPage />)

    expect(screen.getByText('User ID')).toBeInTheDocument()
    expect(screen.getByText('user-1')).toBeInTheDocument()
  })

  test('shows help information', () => {
    render(<AccountPage />)

    expect(screen.getByText(/Need help?/)).toBeInTheDocument()
    expect(screen.getByText(/Contact your system administrator/)).toBeInTheDocument()
  })

  test('navigation banner is rendered', () => {
    render(<AccountPage />)

    expect(screen.getByTestId('navigation-banner')).toBeInTheDocument()
  })
})
