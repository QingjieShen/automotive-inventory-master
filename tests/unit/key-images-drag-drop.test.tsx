/**
 * Unit tests for KeyImagesUploader drag-and-drop functionality
 * Tests the drag-and-drop file upload feature
 */

import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import KeyImagesUploader from '@/components/vehicles/KeyImagesUploader'

// Mock Next.js Image component
jest.mock('next/image', () => ({
  __esModule: true,
  default: (props: any) => {
    // eslint-disable-next-line @next/next/no-img-element, jsx-a11y/alt-text
    return <img {...props} />
  },
}))

describe('KeyImagesUploader Drag and Drop', () => {
  const mockOnFilesChange = jest.fn()

  beforeEach(() => {
    jest.clearAllMocks()
  })

  test('shows drag-and-drop instructions', () => {
    render(<KeyImagesUploader onFilesChange={mockOnFilesChange} />)

    const instructions = screen.getAllByText(/Click or drag to upload/)
    expect(instructions.length).toBeGreaterThan(0)
  })

  test('handles drag enter event', () => {
    render(<KeyImagesUploader onFilesChange={mockOnFilesChange} />)

    // Find the first upload area
    const uploadAreas = screen.getAllByText(/Click or drag to upload/)
    const uploadArea = uploadAreas[0].closest('div')

    expect(uploadArea).toBeInTheDocument()

    // Simulate drag enter
    fireEvent.dragEnter(uploadArea!, {
      dataTransfer: {
        files: [new File(['test'], 'test.jpg', { type: 'image/jpeg' })],
      },
    })

    // Should show "Drop image here" text
    expect(screen.getByText('Drop image here')).toBeInTheDocument()
  })

  test('handles drag leave event', () => {
    render(<KeyImagesUploader onFilesChange={mockOnFilesChange} />)

    const uploadAreas = screen.getAllByText(/Click or drag to upload/)
    const uploadArea = uploadAreas[0].closest('div')

    // Drag enter
    fireEvent.dragEnter(uploadArea!, {
      dataTransfer: {
        files: [new File(['test'], 'test.jpg', { type: 'image/jpeg' })],
      },
    })

    expect(screen.getByText('Drop image here')).toBeInTheDocument()

    // Drag leave
    fireEvent.dragLeave(uploadArea!, {})

    // Should go back to normal text
    expect(screen.queryByText('Drop image here')).not.toBeInTheDocument()
  })

  test('handles file drop', async () => {
    render(<KeyImagesUploader onFilesChange={mockOnFilesChange} />)

    const uploadAreas = screen.getAllByText(/Click or drag to upload/)
    const uploadArea = uploadAreas[0].closest('div')

    const file = new File(['test'], 'test.jpg', { type: 'image/jpeg' })

    // Create a mock FileReader
    const mockFileReader = {
      readAsDataURL: jest.fn(),
      onload: null as any,
      result: 'data:image/jpeg;base64,test',
    }

    global.FileReader = jest.fn(() => mockFileReader) as any

    // Simulate drop
    fireEvent.drop(uploadArea!, {
      dataTransfer: {
        files: [file],
      },
    })

    // Trigger the FileReader onload
    if (mockFileReader.onload) {
      mockFileReader.onload({ target: { result: mockFileReader.result } } as any)
    }

    // Should call onFilesChange
    expect(mockOnFilesChange).toHaveBeenCalled()
  })

  test('filters non-image files on drop', () => {
    render(<KeyImagesUploader onFilesChange={mockOnFilesChange} />)

    const uploadAreas = screen.getAllByText(/Click or drag to upload/)
    const uploadArea = uploadAreas[0].closest('div')

    const textFile = new File(['test'], 'test.txt', { type: 'text/plain' })

    // Simulate drop with non-image file
    fireEvent.drop(uploadArea!, {
      dataTransfer: {
        files: [textFile],
      },
    })

    // Should not call onFilesChange for non-image files
    expect(mockOnFilesChange).not.toHaveBeenCalled()
  })

  test('takes only first file when multiple files dropped', async () => {
    render(<KeyImagesUploader onFilesChange={mockOnFilesChange} />)

    const uploadAreas = screen.getAllByText(/Click or drag to upload/)
    const uploadArea = uploadAreas[0].closest('div')

    const file1 = new File(['test1'], 'test1.jpg', { type: 'image/jpeg' })
    const file2 = new File(['test2'], 'test2.jpg', { type: 'image/jpeg' })

    // Create a mock FileReader
    const mockFileReader = {
      readAsDataURL: jest.fn(),
      onload: null as any,
      result: 'data:image/jpeg;base64,test',
    }

    global.FileReader = jest.fn(() => mockFileReader) as any

    // Simulate drop with multiple files
    fireEvent.drop(uploadArea!, {
      dataTransfer: {
        files: [file1, file2],
      },
    })

    // Trigger the FileReader onload
    if (mockFileReader.onload) {
      mockFileReader.onload({ target: { result: mockFileReader.result } } as any)
    }

    // Should only process first file
    expect(mockOnFilesChange).toHaveBeenCalledTimes(1)
  })

  test('all 6 slots support drag-and-drop', () => {
    render(<KeyImagesUploader onFilesChange={mockOnFilesChange} />)

    // Should have 6 upload areas
    const uploadAreas = screen.getAllByText(/Click or drag to upload/)
    expect(uploadAreas).toHaveLength(6)

    // Each should support drag-and-drop
    uploadAreas.forEach((area) => {
      const uploadArea = area.closest('div')
      expect(uploadArea).toBeInTheDocument()

      // Test drag enter on each
      fireEvent.dragEnter(uploadArea!, {
        dataTransfer: {
          files: [new File(['test'], 'test.jpg', { type: 'image/jpeg' })],
        },
      })
    })
  })

  test('shows correct slot labels', () => {
    render(<KeyImagesUploader onFilesChange={mockOnFilesChange} />)

    expect(screen.getByText('Front Quarter')).toBeInTheDocument()
    expect(screen.getByText('Front')).toBeInTheDocument()
    expect(screen.getByText('Driver Side Profile')).toBeInTheDocument()
    expect(screen.getByText('Back Quarter')).toBeInTheDocument()
    expect(screen.getByText('Back')).toBeInTheDocument()
    expect(screen.getByText('Passenger Side Profile')).toBeInTheDocument()
  })

  test('prevents default drag behavior', () => {
    render(<KeyImagesUploader onFilesChange={mockOnFilesChange} />)

    const uploadAreas = screen.getAllByText(/Click or drag to upload/)
    const uploadArea = uploadAreas[0].closest('div')

    const dragEnterEvent = new Event('dragenter', { bubbles: true })
    const preventDefaultSpy = jest.spyOn(dragEnterEvent, 'preventDefault')

    fireEvent(uploadArea!, dragEnterEvent)

    expect(preventDefaultSpy).toHaveBeenCalled()
  })
})
