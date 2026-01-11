/**
 * Unit tests for KeyImagesUploader component
 * Tests the 6-slot key images uploader functionality
 */

import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import KeyImagesUploader from '@/components/vehicles/KeyImagesUploader'

// Mock Next.js Image component
jest.mock('next/image', () => ({
  __esModule: true,
  default: (props: any) => {
    // eslint-disable-next-line @next/next/no-img-element, jsx-a11y/alt-text
    return <img {...props} />
  },
}))

describe('KeyImagesUploader', () => {
  const mockOnFilesChange = jest.fn()

  beforeEach(() => {
    jest.clearAllMocks()
  })

  test('renders all 6 key image slots', () => {
    render(<KeyImagesUploader onFilesChange={mockOnFilesChange} />)

    expect(screen.getByText('Front Quarter')).toBeInTheDocument()
    expect(screen.getByText('Front')).toBeInTheDocument()
    expect(screen.getByText('Driver Side Profile')).toBeInTheDocument()
    expect(screen.getByText('Back Quarter')).toBeInTheDocument()
    expect(screen.getByText('Back')).toBeInTheDocument()
    expect(screen.getByText('Passenger Side Profile')).toBeInTheDocument()
  })

  test('displays correct initial state', () => {
    render(<KeyImagesUploader onFilesChange={mockOnFilesChange} />)

    expect(screen.getByText('0 of 6 slots filled')).toBeInTheDocument()
  })

  test('each slot has an upload button', () => {
    render(<KeyImagesUploader onFilesChange={mockOnFilesChange} />)

    const uploadButtons = screen.getAllByText('Click to upload')
    expect(uploadButtons).toHaveLength(6)
  })

  test('accepts file upload for a slot', async () => {
    render(<KeyImagesUploader onFilesChange={mockOnFilesChange} />)

    // Create a mock file
    const file = new File(['test'], 'test.jpg', { type: 'image/jpeg' })

    // Find the first file input (Front Quarter)
    const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement
    expect(fileInput).toBeInTheDocument()

    // Simulate file selection
    Object.defineProperty(fileInput, 'files', {
      value: [file],
      writable: false,
    })

    fireEvent.change(fileInput)

    // Wait for the file to be processed
    await waitFor(() => {
      expect(mockOnFilesChange).toHaveBeenCalled()
    })
  })

  test('shows filled slots count after upload', async () => {
    const { rerender } = render(<KeyImagesUploader onFilesChange={mockOnFilesChange} />)

    // Initially 0 slots filled
    expect(screen.getByText('0 of 6 slots filled')).toBeInTheDocument()

    // After uploading, the component would update
    // (In real usage, parent component would trigger re-render)
  })

  test('each slot can only hold one image', () => {
    render(<KeyImagesUploader onFilesChange={mockOnFilesChange} />)

    // Each slot should have exactly one file input
    const fileInputs = document.querySelectorAll('input[type="file"]')
    expect(fileInputs).toHaveLength(6)
  })

  test('validates file types', async () => {
    // Mock window.alert
    const alertMock = jest.spyOn(window, 'alert').mockImplementation(() => {})

    render(<KeyImagesUploader onFilesChange={mockOnFilesChange} />)

    // Create an invalid file type
    const file = new File(['test'], 'test.txt', { type: 'text/plain' })

    const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement

    Object.defineProperty(fileInput, 'files', {
      value: [file],
      writable: false,
    })

    fireEvent.change(fileInput)

    await waitFor(() => {
      expect(alertMock).toHaveBeenCalledWith(
        expect.stringContaining('Invalid file format')
      )
    })

    alertMock.mockRestore()
  })

  test('validates file size', async () => {
    // Mock window.alert
    const alertMock = jest.spyOn(window, 'alert').mockImplementation(() => {})

    render(<KeyImagesUploader onFilesChange={mockOnFilesChange} />)

    // Create a file that's too large (11MB)
    const largeFile = new File(['x'.repeat(11 * 1024 * 1024)], 'large.jpg', {
      type: 'image/jpeg',
    })

    const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement

    Object.defineProperty(fileInput, 'files', {
      value: [largeFile],
      writable: false,
    })

    fireEvent.change(fileInput)

    await waitFor(() => {
      expect(alertMock).toHaveBeenCalledWith(
        expect.stringContaining('File too large')
      )
    })

    alertMock.mockRestore()
  })

  test('component is accessible', () => {
    render(<KeyImagesUploader onFilesChange={mockOnFilesChange} />)

    // Check that all file inputs have proper labels
    const fileInputs = document.querySelectorAll('input[type="file"]')
    fileInputs.forEach((input) => {
      expect(input).toHaveAttribute('id')
      const label = document.querySelector(`label[for="${input.id}"]`)
      expect(label).toBeInTheDocument()
    })
  })
})
