import React from 'react'
import { render } from '@testing-library/react'
import { Skeleton } from '@/components/ui/skeleton'

describe('Skeleton Component', () => {
  it('renders skeleton', () => {
    const { container } = render(<Skeleton />)
    const skeleton = container.firstChild as HTMLElement
    expect(skeleton).toBeInTheDocument()
    expect(skeleton).toHaveClass('animate-pulse')
  })

  it('applies custom className', () => {
    const { container } = render(<Skeleton className="custom-skeleton" />)
    const skeleton = container.firstChild as HTMLElement
    expect(skeleton).toHaveClass('custom-skeleton')
    expect(skeleton).toHaveClass('animate-pulse')
  })

  it('renders with custom dimensions', () => {
    const { container } = render(<Skeleton className="h-10 w-full" />)
    const skeleton = container.firstChild as HTMLElement
    expect(skeleton).toHaveClass('h-10')
    expect(skeleton).toHaveClass('w-full')
  })

  it('renders multiple skeletons', () => {
    const { container } = render(
      <div>
        <Skeleton className="h-4 w-full mb-2" />
        <Skeleton className="h-4 w-3/4" />
      </div>
    )
    const skeletons = container.querySelectorAll('.animate-pulse')
    expect(skeletons).toHaveLength(2)
  })
})
