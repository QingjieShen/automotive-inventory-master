import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import '@testing-library/jest-dom'
import KeyImagesUploader from '@/components/vehicles/KeyImagesUploader'

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
  useSortable: jest.fn(() => ({
    attributes: {},
    listeners: {},
    setNodeRef: jest.fn(),
    transform: null,
    transition: null,
    isDragging: false,
  })),
}))

jest.mock('@dnd-kit/utilities', () => ({
  CSS: {
    Transform: {
      toString: jest.fn(() => ''),
    },
  },
}))

describe('KeyImagesUploader - Drag and Drop Reordering', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('renders all 6 key image slots', () => {
    render(<KeyImagesUploader />)
    
    expect(screen.getByText('Front Quarter')).toBeInTheDocument()
    expect(screen.getByText('Front')).toBeInTheDocument()
    expect(screen.getByText('Driver Side Profile')).toBeInTheDocument()
    expect(screen.getByText('Back Quarter')).toBeInTheDocument()
    expect(screen.getByText('Back')).toBeInTheDocument()
    expect(screen.getByText('Passenger Side Profile')).toBeInTheDocument()
  })

  it('shows drag and drop info text', () => {
    render(<KeyImagesUploader />)
    
    expect(screen.getByText(/Drag images between slots to reorder/i)).toBeInTheDocument()
  })

  it('shows filled slots count', () => {
    render(<KeyImagesUploader />)
    
    expect(screen.getByText(/0 of 6 slots filled/i)).toBeInTheDocument()
  })

  it('renders DndContext for drag and drop', () => {
    render(<KeyImagesUploader />)
    
    expect(screen.getByTestId('dnd-context')).toBeInTheDocument()
  })

  it('renders SortableContext for sortable items', () => {
    render(<KeyImagesUploader />)
    
    expect(screen.getByTestId('sortable-context')).toBeInTheDocument()
  })

  it('allows file upload to empty slot', async () => {
    const mockOnFilesChange = jest.fn()
    render(<KeyImagesUploader onFilesChange={mockOnFilesChange} />)
    
    const file = new File(['test'], 'test.jpg', { type: 'image/jpeg' })
    const input = screen.getAllByLabelText(/Click or drag to upload/i)[0].querySelector('input')
    
    if (input) {
      fireEvent.change(input, { target: { files: [file] } })
      
      await waitFor(() => {
        expect(mockOnFilesChange).toHaveBeenCalled()
      })
    }
  })

  it('shows drag handle when slot has an image', async () => {
    const mockOnFilesChange = jest.fn()
    const { container } = render(<KeyImagesUploader onFilesChange={mockOnFilesChange} />)
    
    const file = new File(['test'], 'test.jpg', { type: 'image/jpeg' })
    const input = screen.getAllByLabelText(/Click or drag to upload/i)[0].querySelector('input')
    
    if (input) {
      fireEvent.change(input, { target: { files: [file] } })
      
      await waitFor(() => {
        // Check for drag handle SVG
        const dragHandles = container.querySelectorAll('svg')
        expect(dragHandles.length).toBeGreaterThan(0)
      })
    }
  })

  it('allows removing uploaded image', async () => {
    const mockOnFilesChange = jest.fn()
    render(<KeyImagesUploader onFilesChange={mockOnFilesChange} />)
    
    const file = new File(['test'], 'test.jpg', { type: 'image/jpeg' })
    const input = screen.getAllByLabelText(/Click or drag to upload/i)[0].querySelector('input')
    
    if (input) {
      fireEvent.change(input, { target: { files: [file] } })
      
      await waitFor(() => {
        const removeButton = screen.getAllByTitle('Remove image')[0]
        expect(removeButton).toBeInTheDocument()
        
        fireEvent.click(removeButton)
        
        // Should call onFilesChange with empty array
        expect(mockOnFilesChange).toHaveBeenLastCalledWith([])
      })
    }
  })

  it('supports drag and drop file upload to empty slot', async () => {
    const mockOnFilesChange = jest.fn()
    render(<KeyImagesUploader onFilesChange={mockOnFilesChange} />)
    
    const file = new File(['test'], 'test.jpg', { type: 'image/jpeg' })
    const dropZone = screen.getAllByLabelText(/Click or drag to upload/i)[0]
    
    // Simulate drag and drop
    fireEvent.dragEnter(dropZone, {
      dataTransfer: {
        types: ['Files'],
        files: [file],
      },
    })
    
    expect(screen.getByText('Drop image here')).toBeInTheDocument()
    
    fireEvent.drop(dropZone, {
      dataTransfer: {
        types: ['Files'],
        files: [file],
      },
    })
    
    await waitFor(() => {
      expect(mockOnFilesChange).toHaveBeenCalled()
    })
  })

  it('validates file type on upload', async () => {
    const alertSpy = jest.spyOn(window, 'alert').mockImplementation(() => {})
    render(<KeyImagesUploader />)
    
    const file = new File(['test'], 'test.txt', { type: 'text/plain' })
    const input = screen.getAllByLabelText(/Click or drag to upload/i)[0].querySelector('input')
    
    if (input) {
      fireEvent.change(input, { target: { files: [file] } })
      
      await waitFor(() => {
        expect(alertSpy).toHaveBeenCalledWith(expect.stringContaining('Invalid file format'))
      })
    }
    
    alertSpy.mockRestore()
  })

  it('validates file size on upload', async () => {
    const alertSpy = jest.spyOn(window, 'alert').mockImplementation(() => {})
    render(<KeyImagesUploader />)
    
    // Create a file larger than 10MB
    const largeFile = new File(['x'.repeat(11 * 1024 * 1024)], 'large.jpg', { type: 'image/jpeg' })
    Object.defineProperty(largeFile, 'size', { value: 11 * 1024 * 1024 })
    
    const input = screen.getAllByLabelText(/Click or drag to upload/i)[0].querySelector('input')
    
    if (input) {
      fireEvent.change(input, { target: { files: [largeFile] } })
      
      await waitFor(() => {
        expect(alertSpy).toHaveBeenCalledWith(expect.stringContaining('File too large'))
      })
    }
    
    alertSpy.mockRestore()
  })
})
