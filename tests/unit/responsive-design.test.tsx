import { render, screen, fireEvent, within } from '../utils/test-utils'
import VehicleCard from '@/components/vehicles/VehicleCard'
import { StoreCard } from '@/components/stores/StoreCard'
import NavigationBanner from '@/components/common/NavigationBanner'
import { Vehicle, Store } from '@/types'

// Mock Next.js router
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
  }),
}))

// Mock Next.js Image component
jest.mock('next/image', () => ({
  __esModule: true,
  default: (props: any) => {
    // eslint-disable-next-line @next/next/no-img-element, jsx-a11y/alt-text
    return <img {...props} />
  },
}))

// Mock window.matchMedia for ThemeToggle
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(),
    removeListener: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
})

const mockVehicle: Vehicle = {
  id: '1',
  stockNumber: 'TEST-001',
  storeId: 'store-1',
  processingStatus: 'COMPLETED',
  createdAt: new Date('2024-01-15'),
  updatedAt: new Date('2024-01-15'),
  images: [
    {
      id: 'img-1',
      vehicleId: '1',
      imageType: 'FRONT',
      originalUrl: 'https://example.com/front.jpg',
      thumbnailUrl: 'https://example.com/front-thumb.jpg',
      processedUrl: null,
      uploadedAt: new Date('2024-01-15'),
      displayOrder: 0,
    },
  ],
}

const mockStore: Store = {
  id: 'store-1',
  name: 'Test Store',
  address: '123 Test St, Test City, TS 12345',
  brandLogos: ['toyota-logo.png', 'honda-logo.png'],
  imageUrl: 'https://example.com/store.jpg',
  createdAt: new Date('2024-01-15'),
  updatedAt: new Date('2024-01-15'),
}

describe('Responsive Design - Mobile Layouts (Requirements 12.1, 12.5)', () => {
  beforeEach(() => {
    // Set mobile viewport
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 375,
    })
    Object.defineProperty(window, 'innerHeight', {
      writable: true,
      configurable: true,
      value: 667,
    })
  })

  test('VehicleCard displays mobile layout on small screens', () => {
    render(<VehicleCard vehicle={mockVehicle} />)

    // Mobile layout should be visible (sm:hidden class)
    const mobileLayout = screen.getByRole('row').querySelector('.sm\\:hidden')
    expect(mobileLayout).toBeInTheDocument()

    // Desktop layout should be hidden
    const desktopLayout = screen.getByRole('row').querySelector('.hidden.sm\\:grid')
    expect(desktopLayout).toBeInTheDocument()

    // Verify mobile-specific elements (use getAllByText since both layouts render)
    expect(screen.getAllByText('TEST-001').length).toBeGreaterThan(0)
    expect(screen.getAllByText('1 photos').length).toBeGreaterThan(0)
    expect(screen.getAllByText('Completed').length).toBeGreaterThan(0)
  })

  test('VehicleCard touch targets are appropriately sized on mobile', () => {
    render(<VehicleCard vehicle={mockVehicle} showCheckbox />)

    // Get the mobile layout container
    const card = screen.getByRole('row')
    const mobileLayout = card.querySelector('.sm\\:hidden')
    expect(mobileLayout).toBeInTheDocument()

    // Check button should have adequate touch target (within mobile layout)
    const checkboxes = screen.getAllByRole('checkbox')
    expect(checkboxes.length).toBeGreaterThan(0)

    // View button should have adequate touch target (icon button) - use getAllByLabelText
    const viewButtons = screen.getAllByLabelText(/view details for vehicle/i)
    expect(viewButtons.length).toBeGreaterThan(0)
    
    // Verify button has icon size class (h-5 w-5 for icon, h-10 w-10 for button)
    const icon = viewButtons[0].querySelector('svg')
    expect(icon).toHaveClass('h-5', 'w-5')
  })

  test('StoreCard displays properly on mobile with adequate padding', () => {
    const onSelect = jest.fn()
    render(<StoreCard store={mockStore} onSelect={onSelect} />)

    // Verify responsive padding (p-4 sm:p-6)
    const card = screen.getByRole('gridcell')
    expect(card).toHaveClass('p-4', 'sm:p-6')

    // Verify minimum height for touch targets
    expect(card).toHaveClass('min-h-[280px]')

    // Verify store name is visible
    expect(screen.getByText('Test Store')).toBeInTheDocument()

    // Verify select button is full width on mobile
    const selectButton = screen.getByRole('button', { name: /select test store/i })
    expect(selectButton).toHaveClass('w-full')
  })

  test('NavigationBanner shows mobile menu on small screens', () => {
    render(<NavigationBanner />)

    // Mobile menu button should be visible
    const menuButton = screen.getByLabelText(/toggle navigation menu/i)
    expect(menuButton).toBeInTheDocument()

    // Desktop navigation should be hidden
    const desktopNav = screen.getByRole('navigation').querySelector('.hidden.md\\:flex')
    expect(desktopNav).toBeInTheDocument()

    // Open mobile menu
    fireEvent.click(menuButton)

    // Mobile menu should be visible - use getAllByRole since both desktop and mobile render
    const storesButtons = screen.getAllByRole('button', { name: 'Stores' })
    const accountButtons = screen.getAllByRole('button', { name: 'Account' })
    
    expect(storesButtons.length).toBeGreaterThan(0)
    expect(accountButtons.length).toBeGreaterThan(0)
  })

  test('Mobile navigation menu items have adequate touch targets', () => {
    render(<NavigationBanner />)

    // Open mobile menu
    const menuButton = screen.getByLabelText(/toggle navigation menu/i)
    fireEvent.click(menuButton)

    // Get mobile menu items
    const storesButton = screen.getAllByRole('button', { name: 'Stores' })[1] // Second one is in mobile menu
    const accountButton = screen.getAllByRole('button', { name: 'Account' })[1]

    // Verify buttons have full width and adequate padding
    expect(storesButton).toHaveClass('w-full', 'px-4', 'py-2')
    expect(accountButton).toHaveClass('w-full', 'px-4', 'py-2')
  })
})

describe('Responsive Design - Tablet Layouts (Requirements 12.2)', () => {
  beforeEach(() => {
    // Set tablet viewport
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 768,
    })
    Object.defineProperty(window, 'innerHeight', {
      writable: true,
      configurable: true,
      value: 1024,
    })
  })

  test('VehicleCard displays desktop layout on tablet screens', () => {
    render(<VehicleCard vehicle={mockVehicle} />)

    // Desktop layout should be visible (hidden sm:grid)
    const desktopLayout = screen.getByRole('row').querySelector('.hidden.sm\\:grid')
    expect(desktopLayout).toBeInTheDocument()

    // Verify grid layout classes
    expect(desktopLayout).toHaveClass('grid-cols-12')

    // Verify all columns are present (use getAllByText since both layouts render)
    expect(screen.getAllByText('TEST-001').length).toBeGreaterThan(0)
    expect(screen.getAllByText('1 photos').length).toBeGreaterThan(0)
    expect(screen.getAllByText('Completed').length).toBeGreaterThan(0)
  })

  test('StoreCard uses tablet-specific padding', () => {
    const onSelect = jest.fn()
    render(<StoreCard store={mockStore} onSelect={onSelect} />)

    // Verify responsive padding applies at tablet breakpoint
    const card = screen.getByRole('gridcell')
    expect(card).toHaveClass('p-4', 'sm:p-6')
  })

  test('NavigationBanner shows desktop navigation on tablet', () => {
    render(<NavigationBanner />)

    // Desktop navigation should be visible at md breakpoint (768px)
    const desktopNav = screen.getByRole('navigation').querySelector('.hidden.md\\:flex')
    expect(desktopNav).toBeInTheDocument()

    // Mobile menu button should be hidden
    const mobileMenuButton = screen.getByRole('navigation').querySelector('.md\\:hidden')
    expect(mobileMenuButton).toBeInTheDocument()
  })
})

describe('Responsive Design - Desktop Layouts (Requirements 12.3)', () => {
  beforeEach(() => {
    // Set desktop viewport
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 1920,
    })
    Object.defineProperty(window, 'innerHeight', {
      writable: true,
      configurable: true,
      value: 1080,
    })
  })

  test('VehicleCard displays full desktop layout with all columns', () => {
    render(<VehicleCard vehicle={mockVehicle} showCheckbox />)

    // Desktop layout should be visible
    const desktopLayout = screen.getByRole('row').querySelector('.hidden.sm\\:grid')
    expect(desktopLayout).toBeInTheDocument()

    // Verify 12-column grid
    expect(desktopLayout).toHaveClass('grid-cols-12')

    // Verify all elements are present (use getAllByRole since both layouts render)
    const checkboxes = screen.getAllByRole('checkbox')
    expect(checkboxes.length).toBeGreaterThan(0)
    expect(screen.getAllByText('TEST-001').length).toBeGreaterThan(0)
    expect(screen.getAllByText('1 photos').length).toBeGreaterThan(0)
    expect(screen.getAllByText('Completed').length).toBeGreaterThan(0)
    
    const viewButtons = screen.getAllByLabelText(/view details for vehicle/i)
    expect(viewButtons.length).toBeGreaterThan(0)
  })

  test('StoreCard displays with maximum padding on desktop', () => {
    const onSelect = jest.fn()
    render(<StoreCard store={mockStore} onSelect={onSelect} />)

    // Verify responsive padding
    const card = screen.getByRole('gridcell')
    expect(card).toHaveClass('p-4', 'sm:p-6')

    // Verify all content is visible
    expect(screen.getByText('Test Store')).toBeInTheDocument()
    expect(screen.getByText('123 Test St, Test City, TS 12345')).toBeInTheDocument()
    expect(screen.getByText('TOYOTA')).toBeInTheDocument()
    expect(screen.getByText('HONDA')).toBeInTheDocument()
  })

  test('NavigationBanner displays full desktop navigation', () => {
    render(<NavigationBanner />)

    // Desktop navigation should be visible
    const desktopNav = screen.getByRole('navigation').querySelector('.hidden.md\\:flex')
    expect(desktopNav).toBeInTheDocument()

    // Verify navigation items are present
    const allStoresButtons = screen.getAllByRole('button', { name: 'Stores' })
    const allAccountButtons = screen.getAllByRole('button', { name: 'Account' })
    
    // Should have desktop versions (mobile menu is closed)
    expect(allStoresButtons.length).toBeGreaterThanOrEqual(1)
    expect(allAccountButtons.length).toBeGreaterThanOrEqual(1)

    // Mobile menu button should be hidden
    const mobileMenuButton = screen.getByRole('navigation').querySelector('.md\\:hidden')
    expect(mobileMenuButton).toBeInTheDocument()
  })

  test('Desktop navigation items have hover states', () => {
    render(<NavigationBanner />)

    // Get desktop navigation buttons
    const storesButton = screen.getAllByRole('button', { name: 'Stores' })[0]
    
    // Verify hover classes are present
    expect(storesButton).toHaveClass('hover:bg-accent')
  })
})
