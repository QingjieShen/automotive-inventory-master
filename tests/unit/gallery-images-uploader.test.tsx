import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import '@testing-library/jest-dom'
import GalleryImagesUploader from '@/components/vehicles/GalleryImagesUploader'

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
  verticalListSortingStrategy: jest.fn(),
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

describe('GalleryImagesUploader', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('renders exterior and interior containers', () => {
    render(<GalleryImagesUploader />)
    
    expect(screen.getByText('Exterior Images')).toBeInTheDocument()
    expect(screen.getByText('Interior Images')).toBeInTheDocument()
  })

  it('shows image count for each container', () => {
    render(<GalleryImagesUploader />)
    
    const imageCounts = screen.getAllByText('0 images')
    expect(imageCounts).toHaveLength(2) // One for exterior, one for interior
  })

  it('shows total images count', () => {
    render(<GalleryImagesUploader />)
    
    expect(screen.getByText(/0 of 60 images/i)).toBeInTheDocument()
  })

  it('shows drag info text', () => {
    render(<GalleryImagesUploader />)
    
    expect(screen.getByText(/Drag images between categories to reclassify/i)).toBeInTheDocument()
  })

  it('renders DndContext for drag and drop', () => {
    render(<GalleryImagesUploader />)
    
    expect(screen.getByTestId('dnd-context')).toBeInTheDocument()
  })

  it('has upload areas for both containers', () => {
    render(<GalleryImagesUploader />)
    
    const uploadTexts = screen.getAllByText(/Drop images here or click to upload/i)
    expect(uploadTexts).toHaveLength(2) // One for exterior, one for interior
  })

  it('allows file upload to exterior container', async () => {
    const mockOnFilesChange = jest.fn()
    render(<GalleryImagesUploader onFilesChange={mockOnFilesChange} />)
    
    const file = new File(['test'], 'test.jpg', { type: 'image/jpeg' })
    const input = document.querySelector('#GALLERY_EXTERIOR-upload') as HTMLInputElement
    
    if (input) {
      fireEvent.change(input, { target: { files: [file] } })
      
      await waitFor(() => {
        expect(mockOnFilesChange).toHaveBeenCalled()
        const callArgs = mockOnFilesChange.mock.calls[0][0]
        expect(callArgs).toHaveLength(1)
        expect(callArgs[0].imageType).toBe('GALLERY_EXTERIOR')
      })
    }
  })

  it('allows file upload to interior container', async () => {
    const mockOnFilesChange = jest.fn()
    render(<GalleryImagesUploader onFilesChange={mockOnFilesChange} />)
    
    const file = new File(['test'], 'test.jpg', { type: 'image/jpeg' })
    const input = document.querySelector('#GALLERY_INTERIOR-upload') as HTMLInputElement
    
    if (input) {
      fireEvent.change(input, { target: { files: [file] } })
      
      await waitFor(() => {
        expect(mockOnFilesChange).toHaveBeenCalled()
        const callArgs = mockOnFilesChange.mock.calls[0][0]
        expect(callArgs).toHaveLength(1)
        expect(callArgs[0].imageType).toBe('GALLERY_INTERIOR')
      })
    }
  })

  it('supports drag and drop file upload to exterior container', async () => {
    const mockOnFilesChange = jest.fn()
    render(<GalleryImagesUploader onFilesChange={mockOnFilesChange} />)
    
    const file = new File(['test'], 'test.jpg', { type: 'image/jpeg' })
    const dropZones = screen.getAllByText(/Drop images here or click to upload/i)
    const exteriorDropZone = dropZones[0].closest('div')
    
    if (exteriorDropZone) {
      fireEvent.dragEnter(exteriorDropZone, {
        dataTransfer: {
          types: ['Files'],
          files: [file],
        },
      })
      
      expect(screen.getByText('Drop images here')).toBeInTheDocument()
      
      fireEvent.drop(exteriorDropZone, {
        dataTransfer: {
          types: ['Files'],
          files: [file],
        },
      })
      
      await waitFor(() => {
        expect(mockOnFilesChange).toHaveBeenCalled()
      })
    }
  })

  it('validates file type on upload', async () => {
    const alertSpy = jest.spyOn(window, 'alert').mockImplementation(() => {})
    render(<GalleryImagesUploader />)
    
    const file = new File(['test'], 'test.txt', { type: 'text/plain' })
    const input = document.querySelector('#GALLERY_EXTERIOR-upload') as HTMLInputElement
    
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
    render(<GalleryImagesUploader />)
    
    // Create a file larger than 10MB
    const largeFile = new File(['x'.repeat(11 * 1024 * 1024)], 'large.jpg', { type: 'image/jpeg' })
    Object.defineProperty(largeFile, 'size', { value: 11 * 1024 * 1024 })
    
    const input = document.querySelector('#GALLERY_EXTERIOR-upload') as HTMLInputElement
    
    if (input) {
      fireEvent.change(input, { target: { files: [largeFile] } })
      
      await waitFor(() => {
        expect(alertSpy).toHaveBeenCalledWith(expect.stringContaining('File too large'))
      })
    }
    
    alertSpy.mockRestore()
  })

  it('enforces maximum file limit', async () => {
    const alertSpy = jest.spyOn(window, 'alert').mockImplementation(() => {})
    render(<GalleryImagesUploader maxFiles={2} />)
    
    const files = [
      new File(['test1'], 'test1.jpg', { type: 'image/jpeg' }),
      new File(['test2'], 'test2.jpg', { type: 'image/jpeg' }),
      new File(['test3'], 'test3.jpg', { type: 'image/jpeg' }),
    ]
    
    const input = document.querySelector('#GALLERY_EXTERIOR-upload') as HTMLInputElement
    
    if (input) {
      fireEvent.change(input, { target: { files } })
      
      await waitFor(() => {
        expect(alertSpy).toHaveBeenCalledWith(expect.stringContaining('Cannot add more than 2 files'))
      })
    }
    
    alertSpy.mockRestore()
  })

  it('shows empty state when no images uploaded', () => {
    render(<GalleryImagesUploader />)
    
    expect(screen.getByText('No exterior images yet')).toBeInTheDocument()
    expect(screen.getByText('No interior images yet')).toBeInTheDocument()
  })
})
