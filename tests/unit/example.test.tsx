import { render, screen } from '../utils/test-utils'
import { mockSession, mockAdminSession } from '../utils/test-utils'

// Simple component for testing setup
const TestComponent = ({ role }: { role?: string }) => {
  return (
    <div>
      <h1>Test Component</h1>
      {role && <p data-testid="role">Role: {role}</p>}
    </div>
  )
}

describe('Testing Setup Validation', () => {
  test('renders test component correctly', () => {
    render(<TestComponent />)

    expect(screen.getByText('Test Component')).toBeInTheDocument()
  })

  test('renders with session provider', () => {
    render(<TestComponent role="PHOTOGRAPHER" />, { session: mockSession })

    expect(screen.getByTestId('role')).toHaveTextContent('Role: PHOTOGRAPHER')
  })

  test('mock factories provide correct data', () => {
    expect(mockSession.user.role).toBe('PHOTOGRAPHER')
    expect(mockAdminSession.user.role).toBe('ADMIN')
  })
})
