import React from 'react'
import { render, screen } from '@testing-library/react'
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from '@/components/ui/card'

describe('Card Component', () => {
  it('renders Card with all subcomponents', () => {
    render(
      <Card>
        <CardHeader>
          <CardTitle>Card Title</CardTitle>
          <CardDescription>Card Description</CardDescription>
        </CardHeader>
        <CardContent>Card Content</CardContent>
        <CardFooter>Card Footer</CardFooter>
      </Card>
    )

    expect(screen.getByText('Card Title')).toBeInTheDocument()
    expect(screen.getByText('Card Description')).toBeInTheDocument()
    expect(screen.getByText('Card Content')).toBeInTheDocument()
    expect(screen.getByText('Card Footer')).toBeInTheDocument()
  })

  it('applies custom className to Card', () => {
    const { container } = render(
      <Card className="custom-class">Content</Card>
    )
    const card = container.firstChild as HTMLElement
    expect(card).toHaveClass('custom-class')
  })

  it('renders CardHeader with custom className', () => {
    const { container } = render(
      <CardHeader className="custom-header">Header</CardHeader>
    )
    const header = container.firstChild as HTMLElement
    expect(header).toHaveClass('custom-header')
  })

  it('renders CardTitle as h3 element', () => {
    render(<CardTitle>Title</CardTitle>)
    const title = screen.getByText('Title')
    expect(title.tagName).toBe('H3')
  })
})
