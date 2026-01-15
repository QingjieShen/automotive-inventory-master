import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import { StoreCard } from '@/components/stores/StoreCard'
import { mockStore } from '../utils/mock-factories'

describe('StoreCard', () => {
  const mockOnSelect = jest.fn()

  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('Rendering with store data', () => {
    it('should render store name', () => {
      render(<StoreCard store={mockStore} onSelect={mockOnSelect} />)
      expect(screen.getByText('Downtown Toyota')).toBeInTheDocument()
    })

    it('should render store address', () => {
      render(<StoreCard store={mockStore} onSelect={mockOnSelect} />)
      expect(screen.getByText('123 Main St, City, State 12345')).toBeInTheDocument()
    })

    it('should render brand logos as badges', () => {
      const storeWithMultipleBrands = {
        ...mockStore,
        brandLogos: ['toyota-logo.png', 'honda-logo.png', 'lexus-logo.png'],
      }
      render(<StoreCard store={storeWithMultipleBrands} onSelect={mockOnSelect} />)
      
      expect(screen.getByText('TOYOTA')).toBeInTheDocument()
      expect(screen.getByText('HONDA')).toBeInTheDocument()
      expect(screen.getByText('LEXUS')).toBeInTheDocument()
    })

    it('should render select button', () => {
      render(<StoreCard store={mockStore} onSelect={mockOnSelect} />)
      expect(screen.getByText('Select Store')).toBeInTheDocument()
    })

    it('should have proper aria-label on card', () => {
      render(<StoreCard store={mockStore} onSelect={mockOnSelect} />)
      const card = screen.getByRole('gridcell')
      expect(card).toHaveAttribute('aria-label', 'Select Downtown Toyota store')
    })

    it('should have proper aria-label on button', () => {
      render(<StoreCard store={mockStore} onSelect={mockOnSelect} />)
      const button = screen.getByText('Select Store')
      expect(button).toHaveAttribute('aria-label', 'Select Downtown Toyota store')
    })
  })

  describe('Button click callback', () => {
    it('should call onSelect when button is clicked', () => {
      render(<StoreCard store={mockStore} onSelect={mockOnSelect} />)
      const button = screen.getByText('Select Store')
      fireEvent.click(button)
      expect(mockOnSelect).toHaveBeenCalledWith(mockStore)
      expect(mockOnSelect).toHaveBeenCalledTimes(1)
    })

    it('should call onSelect when card is clicked', () => {
      render(<StoreCard store={mockStore} onSelect={mockOnSelect} />)
      const card = screen.getByRole('gridcell')
      fireEvent.click(card)
      expect(mockOnSelect).toHaveBeenCalledWith(mockStore)
      expect(mockOnSelect).toHaveBeenCalledTimes(1)
    })

    it('should not call onSelect twice when button is clicked (event propagation)', () => {
      render(<StoreCard store={mockStore} onSelect={mockOnSelect} />)
      const button = screen.getByText('Select Store')
      fireEvent.click(button)
      // Should only be called once due to stopPropagation
      expect(mockOnSelect).toHaveBeenCalledTimes(1)
    })
  })

  describe('Keyboard navigation', () => {
    it('should call onSelect when Enter key is pressed on card', () => {
      render(<StoreCard store={mockStore} onSelect={mockOnSelect} />)
      const card = screen.getByRole('gridcell')
      fireEvent.keyDown(card, { key: 'Enter' })
      expect(mockOnSelect).toHaveBeenCalledWith(mockStore)
    })

    it('should call onSelect when Space key is pressed on card', () => {
      render(<StoreCard store={mockStore} onSelect={mockOnSelect} />)
      const card = screen.getByRole('gridcell')
      fireEvent.keyDown(card, { key: ' ' })
      expect(mockOnSelect).toHaveBeenCalledWith(mockStore)
    })

    it('should not call onSelect when other keys are pressed', () => {
      render(<StoreCard store={mockStore} onSelect={mockOnSelect} />)
      const card = screen.getByRole('gridcell')
      fireEvent.keyDown(card, { key: 'Tab' })
      fireEvent.keyDown(card, { key: 'Escape' })
      expect(mockOnSelect).not.toHaveBeenCalled()
    })

    it('should have tabIndex for keyboard accessibility', () => {
      render(<StoreCard store={mockStore} onSelect={mockOnSelect} />)
      const card = screen.getByRole('gridcell')
      expect(card).toHaveAttribute('tabIndex', '0')
    })
  })

  describe('Background image styling', () => {
    it('should apply background image when imageUrl is provided', () => {
      const storeWithImage = {
        ...mockStore,
        imageUrl: 'https://example.com/store.jpg',
      }
      const { container } = render(<StoreCard store={storeWithImage} onSelect={mockOnSelect} />)
      const card = container.querySelector('[role="gridcell"]')
      
      expect(card).toHaveStyle({
        backgroundImage: expect.stringContaining('linear-gradient'),
      })
      expect(card).toHaveStyle({
        backgroundImage: expect.stringContaining('https://example.com/store.jpg'),
      })
      expect(card).toHaveStyle({
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      })
    })

    it('should apply gradient background when imageUrl is not provided', () => {
      const storeWithoutImage = {
        ...mockStore,
        imageUrl: undefined,
      }
      const { container } = render(<StoreCard store={storeWithoutImage} onSelect={mockOnSelect} />)
      const card = container.querySelector('[role="gridcell"]')
      
      expect(card).toHaveStyle({
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      })
    })

    it('should maintain gradient overlay with background image', () => {
      const storeWithImage = {
        ...mockStore,
        imageUrl: 'https://example.com/store.jpg',
      }
      const { container } = render(<StoreCard store={storeWithImage} onSelect={mockOnSelect} />)
      const card = container.querySelector('[role="gridcell"]')
      
      // Check that gradient overlay is part of the background image
      expect(card).toHaveStyle({
        backgroundImage: expect.stringContaining('rgba(0, 0, 0, 0.4)'),
      })
      expect(card).toHaveStyle({
        backgroundImage: expect.stringContaining('rgba(0, 0, 0, 0.5)'),
      })
    })
  })
})
