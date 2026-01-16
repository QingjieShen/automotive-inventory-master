/**
 * Automated Accessibility Tests using jest-axe
 * Feature: shadcn-ui-integration
 * Validates: Requirements 11.1, 11.2, 11.3, 11.4, 11.5
 */

import React from 'react'
import { render } from '@testing-library/react'
import { axe, toHaveNoViolations } from 'jest-axe'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog'
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'
import { Skeleton } from '@/components/ui/skeleton'
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table'

// Extend Jest matchers
expect.extend(toHaveNoViolations)

describe('Automated Accessibility Tests - Core Components', () => {
  /**
   * Test Button component for accessibility violations
   * Validates: Requirements 11.1, 11.2, 11.5
   */
  describe('Button Component', () => {
    it('should have no accessibility violations - default variant', async () => {
      const { container } = render(<Button>Click me</Button>)
      const results = await axe(container)
      expect(results).toHaveNoViolations()
    })

    it('should have no accessibility violations - destructive variant', async () => {
      const { container } = render(<Button variant="destructive">Delete</Button>)
      const results = await axe(container)
      expect(results).toHaveNoViolations()
    })

    it('should have no accessibility violations - disabled state', async () => {
      const { container } = render(<Button disabled>Disabled Button</Button>)
      const results = await axe(container)
      expect(results).toHaveNoViolations()
    })

    it('should have no accessibility violations - with aria-label', async () => {
      const { container } = render(<Button aria-label="Close dialog">×</Button>)
      const results = await axe(container)
      expect(results).toHaveNoViolations()
    })
  })

  /**
   * Test Card component for accessibility violations
   * Validates: Requirements 11.1
   */
  describe('Card Component', () => {
    it('should have no accessibility violations - basic card', async () => {
      const { container } = render(
        <Card>
          <CardHeader>
            <CardTitle>Card Title</CardTitle>
            <CardDescription>Card description text</CardDescription>
          </CardHeader>
          <CardContent>
            <p>Card content goes here</p>
          </CardContent>
          <CardFooter>
            <Button>Action</Button>
          </CardFooter>
        </Card>
      )
      const results = await axe(container)
      expect(results).toHaveNoViolations()
    })

    it('should have no accessibility violations - card with complex content', async () => {
      const { container } = render(
        <Card>
          <CardHeader>
            <CardTitle>Vehicle Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div>
              <p>Stock Number: ABC123</p>
              <Badge>Available</Badge>
            </div>
          </CardContent>
        </Card>
      )
      const results = await axe(container)
      expect(results).toHaveNoViolations()
    })
  })

  /**
   * Test Input component for accessibility violations
   * Validates: Requirements 11.1, 11.2, 11.4
   */
  describe('Input Component', () => {
    it('should have no accessibility violations - with label', async () => {
      const { container } = render(
        <div>
          <label htmlFor="test-input">Test Input</label>
          <Input id="test-input" type="text" />
        </div>
      )
      const results = await axe(container)
      expect(results).toHaveNoViolations()
    })

    it('should have no accessibility violations - with aria-label', async () => {
      const { container } = render(
        <Input type="email" aria-label="Email address" placeholder="Enter email" />
      )
      const results = await axe(container)
      expect(results).toHaveNoViolations()
    })

    it('should have no accessibility violations - with error state', async () => {
      const { container } = render(
        <div>
          <label htmlFor="error-input">Email</label>
          <Input 
            id="error-input" 
            type="email" 
            aria-invalid="true"
            aria-describedby="error-message"
          />
          <span id="error-message" role="alert">Invalid email address</span>
        </div>
      )
      const results = await axe(container)
      expect(results).toHaveNoViolations()
    })

    it('should have no accessibility violations - disabled state', async () => {
      const { container } = render(
        <div>
          <label htmlFor="disabled-input">Disabled Input</label>
          <Input id="disabled-input" type="text" disabled />
        </div>
      )
      const results = await axe(container)
      expect(results).toHaveNoViolations()
    })
  })

  /**
   * Test Badge component for accessibility violations
   * Validates: Requirements 11.5
   */
  describe('Badge Component', () => {
    it('should have no accessibility violations - default variant', async () => {
      const { container } = render(<Badge>Default</Badge>)
      const results = await axe(container)
      expect(results).toHaveNoViolations()
    })

    it('should have no accessibility violations - all variants', async () => {
      const { container } = render(
        <div>
          <Badge variant="default">Default</Badge>
          <Badge variant="secondary">Secondary</Badge>
          <Badge variant="destructive">Destructive</Badge>
          <Badge variant="outline">Outline</Badge>
          <Badge variant="success">Success</Badge>
          <Badge variant="warning">Warning</Badge>
        </div>
      )
      const results = await axe(container)
      expect(results).toHaveNoViolations()
    })
  })

  /**
   * Test Dialog component for accessibility violations
   * Validates: Requirements 11.1, 11.3
   */
  describe('Dialog Component', () => {
    it('should have no accessibility violations - basic dialog', async () => {
      const { container } = render(
        <Dialog open={true}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Dialog Title</DialogTitle>
              <DialogDescription>Dialog description text</DialogDescription>
            </DialogHeader>
            <div>Dialog content</div>
            <DialogFooter>
              <Button>Cancel</Button>
              <Button>Confirm</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )
      const results = await axe(container)
      expect(results).toHaveNoViolations()
    })

    it('should have no accessibility violations - dialog with form', async () => {
      const { container } = render(
        <Dialog open={true}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add Vehicle</DialogTitle>
              <DialogDescription>Enter vehicle information</DialogDescription>
            </DialogHeader>
            <form>
              <label htmlFor="stock-number">Stock Number</label>
              <Input id="stock-number" type="text" />
            </form>
            <DialogFooter>
              <Button type="submit">Save</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )
      const results = await axe(container)
      expect(results).toHaveNoViolations()
    })
  })

  /**
   * Test Select component for accessibility violations
   * Validates: Requirements 11.1, 11.2
   */
  describe('Select Component', () => {
    it('should have no accessibility violations - basic select', async () => {
      const { container } = render(
        <div>
          <label htmlFor="test-select">Choose option</label>
          <Select>
            <SelectTrigger id="test-select">
              <SelectValue placeholder="Select an option" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="option1">Option 1</SelectItem>
              <SelectItem value="option2">Option 2</SelectItem>
              <SelectItem value="option3">Option 3</SelectItem>
            </SelectContent>
          </Select>
        </div>
      )
      const results = await axe(container)
      expect(results).toHaveNoViolations()
    })
  })

  /**
   * Test Checkbox component for accessibility violations
   * Validates: Requirements 11.1, 11.2
   */
  describe('Checkbox Component', () => {
    it('should have no accessibility violations - with label', async () => {
      const { container } = render(
        <div>
          <label htmlFor="test-checkbox">
            <Checkbox id="test-checkbox" />
            <span>Accept terms</span>
          </label>
        </div>
      )
      const results = await axe(container)
      expect(results).toHaveNoViolations()
    })

    it('should have no accessibility violations - with aria-label', async () => {
      const { container } = render(
        <Checkbox aria-label="Select item" />
      )
      const results = await axe(container)
      expect(results).toHaveNoViolations()
    })

    it('should have no accessibility violations - disabled state', async () => {
      const { container } = render(
        <Checkbox aria-label="Disabled checkbox" disabled />
      )
      const results = await axe(container)
      expect(results).toHaveNoViolations()
    })
  })

  /**
   * Test Skeleton component for accessibility violations
   * Validates: Requirements 11.1
   */
  describe('Skeleton Component', () => {
    it('should have no accessibility violations - basic skeleton', async () => {
      const { container } = render(
        <div>
          <Skeleton className="h-12 w-12 rounded-full" />
          <Skeleton className="h-4 w-[250px]" />
          <Skeleton className="h-4 w-[200px]" />
        </div>
      )
      const results = await axe(container)
      expect(results).toHaveNoViolations()
    })
  })

  /**
   * Test Table component for accessibility violations
   * Validates: Requirements 11.1
   */
  describe('Table Component', () => {
    it('should have no accessibility violations - basic table', async () => {
      const { container } = render(
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell>Vehicle 1</TableCell>
              <TableCell>Available</TableCell>
              <TableCell>
                <Button size="sm">Edit</Button>
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Vehicle 2</TableCell>
              <TableCell>Sold</TableCell>
              <TableCell>
                <Button size="sm">Edit</Button>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      )
      const results = await axe(container)
      expect(results).toHaveNoViolations()
    })

    it('should have no accessibility violations - table with caption', async () => {
      const { container } = render(
        <Table>
          <caption>Vehicle Inventory List</caption>
          <TableHeader>
            <TableRow>
              <TableHead>Stock Number</TableHead>
              <TableHead>Make</TableHead>
              <TableHead>Model</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell>ABC123</TableCell>
              <TableCell>Toyota</TableCell>
              <TableCell>Camry</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      )
      const results = await axe(container)
      expect(results).toHaveNoViolations()
    })
  })
})

describe('Automated Accessibility Tests - Feature Components', () => {
  /**
   * Test form components for accessibility violations
   * Validates: Requirements 11.1, 11.2, 11.4
   */
  describe('Form Components', () => {
    it('should have no accessibility violations - complete form', async () => {
      const { container } = render(
        <form>
          <div>
            <label htmlFor="name">Name</label>
            <Input id="name" type="text" required />
          </div>
          <div>
            <label htmlFor="email">Email</label>
            <Input id="email" type="email" required />
          </div>
          <div>
            <label htmlFor="status">Status</label>
            <Select>
              <SelectTrigger id="status">
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <label>
              <Checkbox />
              <span>I agree to the terms</span>
            </label>
          </div>
          <Button type="submit">Submit</Button>
        </form>
      )
      const results = await axe(container)
      expect(results).toHaveNoViolations()
    })

    it('should have no accessibility violations - form with errors', async () => {
      const { container } = render(
        <form>
          <div>
            <label htmlFor="email-error">Email</label>
            <Input 
              id="email-error" 
              type="email" 
              aria-invalid="true"
              aria-describedby="email-error-message"
            />
            <span id="email-error-message" role="alert" className="text-destructive">
              Please enter a valid email
            </span>
          </div>
          <Button type="submit">Submit</Button>
        </form>
      )
      const results = await axe(container)
      expect(results).toHaveNoViolations()
    })
  })

  /**
   * Test card layouts for accessibility violations
   * Validates: Requirements 11.1
   */
  describe('Card Layouts', () => {
    it('should have no accessibility violations - vehicle card layout', async () => {
      const { container } = render(
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <Checkbox aria-label="Select vehicle" />
              <Badge variant="success">Available</Badge>
            </div>
            <h3 className="text-lg font-semibold">2024 Toyota Camry</h3>
            <p className="text-sm text-muted-foreground">Stock: ABC123</p>
            <Button variant="ghost" size="sm">View Details</Button>
          </CardContent>
        </Card>
      )
      const results = await axe(container)
      expect(results).toHaveNoViolations()
    })

    it('should have no accessibility violations - store card layout', async () => {
      const { container } = render(
        <Card>
          <CardHeader>
            <CardTitle>Downtown Store</CardTitle>
            <CardDescription>123 Main St</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex gap-2">
              <Badge>Toyota</Badge>
              <Badge>Honda</Badge>
            </div>
          </CardContent>
          <CardFooter>
            <Button className="w-full">Select Store</Button>
          </CardFooter>
        </Card>
      )
      const results = await axe(container)
      expect(results).toHaveNoViolations()
    })
  })

  /**
   * Test loading states for accessibility violations
   * Validates: Requirements 11.1
   */
  describe('Loading States', () => {
    it('should have no accessibility violations - skeleton loading', async () => {
      const { container } = render(
        <div role="status" aria-label="Loading content">
          <Card>
            <CardContent className="p-4">
              <Skeleton className="h-4 w-[250px] mb-2" />
              <Skeleton className="h-4 w-[200px] mb-2" />
              <Skeleton className="h-8 w-[100px]" />
            </CardContent>
          </Card>
          <span className="sr-only">Loading...</span>
        </div>
      )
      const results = await axe(container)
      expect(results).toHaveNoViolations()
    })
  })
})
