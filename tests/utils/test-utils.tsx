import React, { ReactElement } from 'react'
import { render, RenderOptions } from '@testing-library/react'
import { SessionProvider } from 'next-auth/react'

// Mock session data for testing
export const mockSession = {
  user: {
    id: '1',
    email: 'test@example.com',
    name: 'Test User',
    role: 'PHOTOGRAPHER' as const,
  },
  expires: '2024-12-31',
}

export const mockAdminSession = {
  user: {
    id: '2',
    email: 'admin@example.com',
    name: 'Admin User',
    role: 'ADMIN' as const,
  },
  expires: '2024-12-31',
}

// Custom render function that includes providers
interface CustomRenderOptions extends Omit<RenderOptions, 'wrapper'> {
  session?: any
}

const AllTheProviders = ({
  children,
  session = null,
}: {
  children: React.ReactNode
  session?: any
}) => {
  return <SessionProvider session={session}>{children}</SessionProvider>
}

export const renderWithProviders = (
  ui: ReactElement,
  { session = null, ...renderOptions }: CustomRenderOptions = {}
) => {
  const Wrapper = ({ children }: { children: React.ReactNode }) => (
    <AllTheProviders session={session}>{children}</AllTheProviders>
  )

  return render(ui, { wrapper: Wrapper, ...renderOptions })
}

// Re-export everything from testing library
export * from '@testing-library/react'
export { renderWithProviders as render }
