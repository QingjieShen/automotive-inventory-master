import React from 'react'
import { render, screen } from '@testing-library/react'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  SelectGroup,
  SelectLabel,
} from '@/components/ui/select'

describe('Select Component', () => {
  it('renders select with trigger and placeholder', () => {
    render(
      <Select>
        <SelectTrigger>
          <SelectValue placeholder="Select option" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="option1">Option 1</SelectItem>
        </SelectContent>
      </Select>
    )

    expect(screen.getByText('Select option')).toBeInTheDocument()
    expect(screen.getByRole('combobox')).toBeInTheDocument()
  })

  it('renders with default value', () => {
    render(
      <Select defaultValue="default">
        <SelectTrigger>
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="default">Default Option</SelectItem>
          <SelectItem value="other">Other Option</SelectItem>
        </SelectContent>
      </Select>
    )

    expect(screen.getByText('Default Option')).toBeInTheDocument()
  })

  it('renders with SelectGroup and SelectLabel', () => {
    render(
      <Select>
        <SelectTrigger>
          <SelectValue placeholder="Choose" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>Group Label</SelectLabel>
            <SelectItem value="1">Item 1</SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>
    )

    expect(screen.getByRole('combobox')).toBeInTheDocument()
  })

  it('applies custom className to trigger', () => {
    render(
      <Select>
        <SelectTrigger className="custom-trigger">
          <SelectValue placeholder="Test" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="test">Test</SelectItem>
        </SelectContent>
      </Select>
    )

    const trigger = screen.getByRole('combobox')
    expect(trigger).toHaveClass('custom-trigger')
  })
})
