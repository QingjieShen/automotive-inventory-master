import React from 'react'
import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import ImageGallery from '@/components/vehicles/ImageGallery'
import { Vehicle, VehicleImage } from '@/types'

// Mock Next.js Image component
jest.mock('next/image', () => ({
  __esModule: true,
  default: (props: any) => {
    // eslint-disable-next-line @next/next/no-img-element, jsx-a11y/alt-text
    return <img {...props} />
  },
}))

// Mock @dnd-kit modules
jest.mock('@dnd-kit/core', () => ({
  DndContext: ({ children }: any) => <div data-testid="dnd-context">{children}</div>,
  closestCenter: jest.fn(),
  KeyboardSensor: jest.fn(),
  PointerSensor: jest.fn(),
  useSensor: jest.fn(),
  useSensors: jest.fn(() => []),
  DragOverlay: ({ children }: any) => <div data-testid="drag-overlay">{children}</div>,
}))

jest.mock('@dnd-kit/sortable', () => ({
  SortableContext: ({ children }: any) => <div data-testid="sortable-context">{children}</div>,
  sortableKeyboardCoordinates: jest.fn(),
  arrayMove: jest.fn((arr, from, to) => {
    const newArr = [...arr]
    const item = newArr.splice(from, 1)[0]
    newArr.splice(to, 0, item)
    return newArr
  }),
  useSortable: jest.fn(() => ({
    attributes: {},
    listeners: {},
    setNodeRef: jest.fn(),
    transform: null,
    transition: null,
    isDragging: false,
    isOver: false,
  })),
  horizontalListSortingStrategy: jest.fn(),
  verticalListSortingStrategy: jest.fn(),
}))

jest.mock('@dnd-kit/utilities', () => ({
  CSS: {
    Transform: {
      toString: jest.fn(() => ''),
    },
  },
}))

// Mock ProcessingButton component
jest.mock('@/components/vehicles/ProcessingButton', () => ({
  __esModule: true,
  default: () => <div data-testid="processing-button">Processing Button</div>,
}))

// Mock DeleteImageModal component
jest.mock('@/components/vehicles/DeleteImageModal', () => ({
  __esModule: true,
  default: () => <div data-testid="delete-modal">Delete Modal</div>,
}))

const createMockVehicle = (images: Partial<VehicleImage>[] = []): Vehicle => ({
  id: 'vehicle-1',
  stockNumber: 'TEST-001',
  storeId: 'store-1',
  processingStatus: 'NOT_STARTED',
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  store: {
    id: 'store-1',
    name: 'Test Store',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  images: images.map((img, index) => ({
    id: img.id || `image-${index}`,
    vehicleId: 'vehicle-1',
    imageType: img.imageType || 'GALLERY',
    originalUrl: img.originalUrl || `https://example.com/image-${index}.jpg`,
    thumbnailUrl: img.thumbnailUrl || `https://example.com/thumb-${index}.jpg`,
    processedUrl: img.processedUrl || null,
    isProcessed: img.isProcessed || false,
    sortOrder: img.sortOrder !== undefined ? img.sortOrder : index,
    uploadedAt: img.uploadedAt || new Date().toISOString(),
    processedAt: img.processedAt || null,
  })) as VehicleImage[],
})

describe('ImageGallery - Category Separation', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('renders exterior and interior gallery categories', () => {
    const vehicle = createMockVehicle([
      { id: 'ext-1', imageType: 'GALLERY_EXTERIOR' },
      { id: 'int-1', imageType: 'GALLERY_INTERIOR' },
    ])

    render(<ImageGallery vehicle={vehicle} onVehicleUpdate={jest.fn()} />)

    expect(screen.getByText('Exterior Images')).toBeInTheDocument()
    expect(screen.getByText('Interior Images')).toBeInTheDocument()
  })

  it('shows correct image count for each category', () => {
    const vehicle = createMockVehicle([
      { id: 'ext-1', imageType: 'GALLERY_EXTERIOR' },
      { id: 'ext-2', imageType: 'GALLERY_EXTERIOR' },
      { id: 'int-1', imageType: 'GALLERY_INTERIOR' },
    ])

    render(<ImageGallery vehicle={vehicle} onVehicleUpdate={jest.fn()} />)

    const imageCounts = screen.getAllByText(/\d+ images/)
    expect(imageCounts).toHaveLength(2)
    expect(screen.getByText('2 images')).toBeInTheDocument()
    expect(screen.getByText('1 images')).toBeInTheDocument()
  })

  it('shows total gallery images count', () => {
    const vehicle = createMockVehicle([
      { id: 'ext-1', imageType: 'GALLERY_EXTERIOR' },
      { id: 'int-1', imageType: 'GALLERY_INTERIOR' },
    ])

    render(<ImageGallery vehicle={vehicle} onVehicleUpdate={jest.fn()} />)

    expect(screen.getByText(/Gallery Images \(2\)/)).toBeInTheDocument()
  })

  it('shows drag info text', () => {
    const vehicle = createMockVehicle([
      { id: 'ext-1', imageType: 'GALLERY_EXTERIOR' },
    ])

    render(<ImageGallery vehicle={vehicle} onVehicleUpdate={jest.fn()} />)

    expect(screen.getByText(/Drag images between categories to reclassify/i)).toBeInTheDocument()
  })

  it('shows empty state for exterior category when no images', () => {
    const vehicle = createMockVehicle([
      { id: 'int-1', imageType: 'GALLERY_INTERIOR' },
    ])

    render(<ImageGallery vehicle={vehicle} onVehicleUpdate={jest.fn()} />)

    expect(screen.getByText('No exterior images yet')).toBeInTheDocument()
  })

  it('shows empty state for interior category when no images', () => {
    const vehicle = createMockVehicle([
      { id: 'ext-1', imageType: 'GALLERY_EXTERIOR' },
    ])

    render(<ImageGallery vehicle={vehicle} onVehicleUpdate={jest.fn()} />)

    expect(screen.getByText('No interior images yet')).toBeInTheDocument()
  })

  it('shows legacy gallery category for backward compatibility', () => {
    const vehicle = createMockVehicle([
      { id: 'legacy-1', imageType: 'GALLERY' },
    ])

    render(<ImageGallery vehicle={vehicle} onVehicleUpdate={jest.fn()} />)

    expect(screen.getByText('Gallery Images (Uncategorized)')).toBeInTheDocument()
  })

  it('does not show legacy category when no legacy images', () => {
    const vehicle = createMockVehicle([
      { id: 'ext-1', imageType: 'GALLERY_EXTERIOR' },
    ])

    render(<ImageGallery vehicle={vehicle} onVehicleUpdate={jest.fn()} />)

    expect(screen.queryByText('Gallery Images (Uncategorized)')).not.toBeInTheDocument()
  })

  it('renders key images section separately', () => {
    const vehicle = createMockVehicle([
      { id: 'front', imageType: 'FRONT' },
      { id: 'ext-1', imageType: 'GALLERY_EXTERIOR' },
    ])

    render(<ImageGallery vehicle={vehicle} onVehicleUpdate={jest.fn()} />)

    expect(screen.getByText('Key Images')).toBeInTheDocument()
    expect(screen.getByText('Front Shot')).toBeInTheDocument()
  })

  it('renders DndContext for drag and drop', () => {
    const vehicle = createMockVehicle([
      { id: 'ext-1', imageType: 'GALLERY_EXTERIOR' },
    ])

    render(<ImageGallery vehicle={vehicle} onVehicleUpdate={jest.fn()} />)

    expect(screen.getByTestId('dnd-context')).toBeInTheDocument()
  })

  it('displays correct image type labels', () => {
    const vehicle = createMockVehicle([
      { id: 'ext-1', imageType: 'GALLERY_EXTERIOR' },
      { id: 'int-1', imageType: 'GALLERY_INTERIOR' },
    ])

    render(<ImageGallery vehicle={vehicle} onVehicleUpdate={jest.fn()} />)

    // The labels are shown in the image cards
    const exteriorLabels = screen.getAllByText('Exterior')
    const interiorLabels = screen.getAllByText('Interior')
    
    expect(exteriorLabels.length).toBeGreaterThan(0)
    expect(interiorLabels.length).toBeGreaterThan(0)
  })
})
