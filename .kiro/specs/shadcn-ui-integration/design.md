# Design Document: shadcn/ui Integration

## Overview

This design outlines the integration of shadcn/ui into the automotive inventory management application. shadcn/ui is a collection of accessible, customizable React components built on Radix UI primitives and styled with Tailwind CSS. Unlike traditional component libraries, shadcn/ui components are copied directly into the project, giving full ownership and customization control.

The integration will modernize the UI while maintaining existing functionality, visual consistency, and adding enhanced accessibility features. Since the project uses Tailwind CSS v4, we'll use a CSS-first configuration approach without a JavaScript config file.

**Key Design Principles:**
- Maintain existing functionality and user workflows
- Preserve the current visual aesthetic and brand identity
- Enhance accessibility through Radix UI primitives
- Ensure full component ownership and customization
- Optimize for performance and bundle size
- Support responsive design across all devices
- Enable dark mode support

## Architecture

### Component Structure

```
src/
├── components/
│   ├── ui/                    # shadcn/ui components (owned by project)
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   ├── input.tsx
│   │   ├── badge.tsx
│   │   ├── dialog.tsx
│   │   ├── select.tsx
│   │   ├── table.tsx
│   │   ├── checkbox.tsx
│   │   ├── skeleton.tsx
│   │   ├── toast.tsx
│   │   └── ...
│   ├── vehicles/              # Feature components (migrated)
│   │   ├── VehicleCard.tsx
│   │   ├── VehicleList.tsx
│   │   ├── AddVehicleModal.tsx
│   │   └── ...
│   ├── stores/                # Feature components (migrated)
│   │   ├── StoreCard.tsx
│   │   ├── StoreGrid.tsx
│   │   └── ...
│   └── common/                # Shared components (migrated)
│       ├── LoadingSpinner.tsx
│       ├── NavigationBanner.tsx
│       └── ...
├── app/
│   └── globals.css            # Tailwind v4 + shadcn theme config
└── lib/
    └── utils.ts               # cn() utility for class merging
```

### Configuration Approach

**Tailwind CSS v4 Configuration:**
- Use CSS-first approach with `@import` and `@theme` directives
- Define theme variables in `globals.css`
- No `tailwind.config.js` file needed
- CSS variables for shadcn/ui theme tokens

**Component Installation:**
- Manual copy-paste approach (shadcn CLI not compatible with Tailwind v4 yet)
- Components stored in `src/components/ui/`
- Full ownership and customization control
- Install Radix UI dependencies as needed

## Components and Interfaces

### Core UI Components

#### Button Component
```typescript
// src/components/ui/button.tsx
import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline: "border border-input hover:bg-accent hover:text-accent-foreground",
        secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "underline-offset-4 hover:underline text-primary",
      },
      size: {
        default: "h-10 py-2 px-4",
        sm: "h-9 px-3 rounded-md",
        lg: "h-11 px-8 rounded-md",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
```

**Usage in existing components:**
- Replace all `<button>` elements with `<Button>`
- Use variants: `default`, `destructive`, `outline`, `secondary`, `ghost`
- Maintain existing onClick handlers and functionality

#### Card Component
```typescript
// src/components/ui/card.tsx
import * as React from "react"
import { cn } from "@/lib/utils"

const Card = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "rounded-lg border bg-card text-card-foreground shadow-sm",
      className
    )}
    {...props}
  />
))
Card.displayName = "Card"

const CardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex flex-col space-y-1.5 p-6", className)}
    {...props}
  />
))
CardHeader.displayName = "CardHeader"

const CardTitle = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h3
    ref={ref}
    className={cn(
      "text-2xl font-semibold leading-none tracking-tight",
      className
    )}
    {...props}
  />
))
CardTitle.displayName = "CardTitle"

const CardDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn("text-sm text-muted-foreground", className)}
    {...props}
  />
))
CardDescription.displayName = "CardDescription"

const CardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("p-6 pt-0", className)} {...props} />
))
CardContent.displayName = "CardContent"

const CardFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex items-center p-6 pt-0", className)}
    {...props}
  />
))
CardFooter.displayName = "CardFooter"

export { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent }
```

**Usage in existing components:**
- VehicleCard: Wrap content in `<Card>` with `<CardContent>`
- StoreCard: Use `<Card>` with custom background styling
- Maintain existing hover effects and interactions

#### Dialog Component
```typescript
// src/components/ui/dialog.tsx
import * as React from "react"
import * as DialogPrimitive from "@radix-ui/react-dialog"
import { X } from "lucide-react"
import { cn } from "@/lib/utils"

const Dialog = DialogPrimitive.Root
const DialogTrigger = DialogPrimitive.Trigger
const DialogPortal = DialogPrimitive.Portal
const DialogClose = DialogPrimitive.Close

const DialogOverlay = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Overlay>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Overlay>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Overlay
    ref={ref}
    className={cn(
      "fixed inset-0 z-50 bg-background/80 backdrop-blur-sm data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
      className
    )}
    {...props}
  />
))
DialogOverlay.displayName = DialogPrimitive.Overlay.displayName

const DialogContent = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content>
>(({ className, children, ...props }, ref) => (
  <DialogPortal>
    <DialogOverlay />
    <DialogPrimitive.Content
      ref={ref}
      className={cn(
        "fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border bg-background p-6 shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] sm:rounded-lg",
        className
      )}
      {...props}
    >
      {children}
      <DialogPrimitive.Close className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground">
        <X className="h-4 w-4" />
        <span className="sr-only">Close</span>
      </DialogPrimitive.Close>
    </DialogPrimitive.Content>
  </DialogPortal>
))
DialogContent.displayName = DialogPrimitive.Content.displayName

const DialogHeader = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn(
      "flex flex-col space-y-1.5 text-center sm:text-left",
      className
    )}
    {...props}
  />
)
DialogHeader.displayName = "DialogHeader"

const DialogFooter = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn(
      "flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2",
      className
    )}
    {...props}
  />
)
DialogFooter.displayName = "DialogFooter"

const DialogTitle = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Title>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Title>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Title
    ref={ref}
    className={cn(
      "text-lg font-semibold leading-none tracking-tight",
      className
    )}
    {...props}
  />
))
DialogTitle.displayName = DialogPrimitive.Title.displayName

const DialogDescription = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Description>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Description>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Description
    ref={ref}
    className={cn("text-sm text-muted-foreground", className)}
    {...props}
  />
))
DialogDescription.displayName = DialogPrimitive.Description.displayName

export {
  Dialog,
  DialogPortal,
  DialogOverlay,
  DialogClose,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
}
```

**Usage in existing modals:**
- AddVehicleModal: Replace custom modal with `<Dialog>`
- DeleteVehicleModal: Use `<Dialog>` with destructive styling
- BulkDeleteModal: Use `<Dialog>` with warning content
- Maintain existing state management and callbacks

### Migration Strategy for Existing Components

#### VehicleCard Migration
```typescript
// Before
<div className="px-4 sm:px-6 py-4 hover:bg-gray-50">
  <div className="text-sm font-medium">{vehicle.stockNumber}</div>
  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
    {status}
  </span>
  <button className="text-blue-600 hover:text-blue-900">
    View
  </button>
</div>

// After
<Card className="hover:bg-accent/50 transition-colors">
  <CardContent className="p-4 sm:p-6">
    <div className="text-sm font-medium">{vehicle.stockNumber}</div>
    <Badge variant="success">{status}</Badge>
    <Button variant="ghost" size="sm">
      View
    </Button>
  </CardContent>
</Card>
```

#### StoreCard Migration
```typescript
// Before
<div 
  className="rounded-lg shadow-md hover:shadow-lg border border-gray-200"
  style={backgroundStyle}
>
  <h3 className="text-lg font-semibold">{store.name}</h3>
  <button className="w-full bg-blue-600 text-white py-2 px-4 rounded-md">
    Select Store
  </button>
</div>

// After
<Card 
  className="hover:shadow-lg transition-shadow cursor-pointer"
  style={backgroundStyle}
>
  <CardHeader>
    <CardTitle className="text-white">{store.name}</CardTitle>
  </CardHeader>
  <CardFooter>
    <Button className="w-full">Select Store</Button>
  </CardFooter>
</Card>
```

## Data Models

### Theme Configuration Model

```typescript
// Theme tokens defined in globals.css
interface ThemeTokens {
  colors: {
    background: string
    foreground: string
    card: string
    cardForeground: string
    popover: string
    popoverForeground: string
    primary: string
    primaryForeground: string
    secondary: string
    secondaryForeground: string
    muted: string
    mutedForeground: string
    accent: string
    accentForeground: string
    destructive: string
    destructiveForeground: string
    border: string
    input: string
    ring: string
  }
  radius: {
    sm: string
    md: string
    lg: string
  }
}
```

### Component Variant Model

```typescript
// Button variants
type ButtonVariant = 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link'
type ButtonSize = 'default' | 'sm' | 'lg' | 'icon'

// Badge variants
type BadgeVariant = 'default' | 'secondary' | 'destructive' | 'outline' | 'success' | 'warning'

// Card variants (custom)
type CardVariant = 'default' | 'elevated' | 'outlined'
```

## Correctness Properties

*A property is a characteristic or behavior that should hold true across all valid executions of a system—essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.*

### Property 1: Component Accessibility
*For any* shadcn/ui component rendered in the application, it should include proper ARIA labels and roles, display visible focus indicators when focused, and announce errors to screen readers when applicable.

**Validates: Requirements 11.1, 11.2, 11.4, 11.5**

### Property 2: Modal Focus Management
*For any* Dialog component that is opened, keyboard focus should be trapped within the modal, and focus should return to the trigger element when the modal is closed.

**Validates: Requirements 11.3**

### Property 3: Theme Token Consistency
*For any* component using colors, spacing, or typography, it should reference theme tokens from CSS variables, ensuring consistent visual styling across the application.

**Validates: Requirements 10.1, 10.2, 10.3, 10.4**

### Property 4: Functional Preservation
*For any* migrated component (VehicleCard, StoreCard, forms, modals, tables), all existing functionality including click handlers, state management, data flow, validation logic, and callbacks should remain unchanged after migration to shadcn/ui.

**Validates: Requirements 3.5, 4.4, 4.5, 5.5, 6.5, 7.4, 7.5**

### Property 5: Hover State Consistency
*For any* interactive element (buttons, cards, links), hover states should provide visual feedback consistent with shadcn styling patterns.

**Validates: Requirements 3.6**

### Property 6: Form Validation Display
*For any* form with validation errors, error messages should be displayed using shadcn styling and associated with inputs via ARIA attributes.

**Validates: Requirements 5.4**

### Property 7: Loading State Representation
*For any* loading content (vehicle cards, store cards), Skeleton components should match the layout dimensions and structure of the content they represent.

**Validates: Requirements 8.2, 8.3**

### Property 8: Toast Notification Behavior
*For any* toast notification displayed, it should auto-dismiss after an appropriate duration and be positioned consistently in the same location.

**Validates: Requirements 9.4, 9.5**

### Property 9: Responsive Layout Adaptation
*For any* viewport size (mobile, tablet, desktop), components should display appropriate responsive layouts with proper touch target sizes on mobile devices.

**Validates: Requirements 12.1, 12.2, 12.3, 12.5**

### Property 10: Dark Mode Application
*For any* component rendered when dark mode is enabled, it should apply dark theme colors with proper contrast ratios, and the dark mode preference should persist across sessions.

**Validates: Requirements 13.1, 13.2, 13.3**

### Property 11: Performance Preservation
*For any* page load or component render, the performance metrics (load time, render time) should not significantly degrade compared to the pre-migration baseline.

**Validates: Requirements 14.2, 14.3**

## Error Handling

### Component Error Boundaries
- Wrap shadcn/ui components in existing ErrorBoundary
- Graceful degradation if component fails to render
- Log errors for debugging

### Theme Loading Errors
- Fallback to default theme if CSS variables fail to load
- Validate theme tokens on application start
- Provide console warnings for missing theme variables

### Accessibility Errors
- Validate ARIA attributes in development mode
- Console warnings for missing labels or roles
- Automated accessibility testing in CI/CD

### Migration Errors
- Maintain backward compatibility during migration
- Feature flags for gradual rollout
- Rollback strategy if issues arise

## Testing Strategy

### Dual Testing Approach

The testing strategy combines unit tests for specific scenarios with property-based tests for universal correctness properties. Both approaches are complementary and necessary for comprehensive coverage.

**Unit Tests:**
- Specific component rendering scenarios
- User interaction examples (clicks, keyboard navigation)
- Edge cases (empty states, error states)
- Integration between shadcn components and existing code

**Property-Based Tests:**
- Universal properties across all inputs
- Accessibility compliance across components
- Theme consistency across color schemes
- Responsive behavior across viewport sizes
- Minimum 100 iterations per property test

### Testing Framework

**Property-Based Testing Library:** fast-check (already in project dependencies)

**Test Configuration:**
- Each property test runs minimum 100 iterations
- Tests tagged with feature name and property number
- Tag format: `Feature: shadcn-ui-integration, Property {number}: {property_text}`

### Component Testing

#### Button Component Tests
**Unit Tests:**
- Renders with different variants (default, destructive, outline, etc.)
- Handles click events correctly
- Displays disabled state appropriately
- Renders with different sizes

**Property Tests:**
- Property 8: Button state consistency across all variant/size combinations

#### Card Component Tests
**Unit Tests:**
- Renders with header, content, and footer
- Applies custom className correctly
- Maintains existing hover effects

**Property Tests:**
- Property 2: Visual consistency across all card instances

#### Dialog Component Tests
**Unit Tests:**
- Opens and closes correctly
- Calls onClose callback
- Renders with custom content
- Displays overlay

**Property Tests:**
- Property 7: Focus management in all modal scenarios

#### Form Component Tests
**Unit Tests:**
- Input renders with label
- Validation errors display correctly
- Form submission works
- Select dropdown opens and closes

**Property Tests:**
- Property 9: Form validation display across all input types

### Accessibility Testing

**Unit Tests:**
- Keyboard navigation works (Tab, Enter, Escape)
- Screen reader labels are present
- Focus indicators are visible
- ARIA attributes are correct

**Property Tests:**
- Property 1: Component accessibility across all components

### Visual Regression Testing

**Unit Tests:**
- Snapshot tests for key components
- Compare before/after migration screenshots
- Verify theme application

**Property Tests:**
- Property 2: Visual consistency across theme changes
- Property 6: Dark mode compatibility across all components

### Integration Testing

**Unit Tests:**
- VehicleCard with real vehicle data
- StoreCard with real store data
- Modal workflows (open, interact, close)
- Form submission workflows

**Property Tests:**
- Property 3: Functional preservation across all migrated components
- Property 4: Responsive behavior across viewport sizes

### Performance Testing

**Unit Tests:**
- Bundle size comparison before/after
- Initial load time measurement
- Component render time

**Property Tests:**
- Property 5: Theme token application doesn't impact performance

### Test Execution Strategy

1. Run existing tests to establish baseline
2. Migrate components one at a time
3. Run tests after each component migration
4. Fix any failing tests before proceeding
5. Add new accessibility tests for shadcn components
6. Run full test suite before deployment

### Continuous Integration

- All tests run on every pull request
- Property-based tests run with 100 iterations in CI
- Accessibility tests run automatically
- Visual regression tests on staging environment
- Performance benchmarks tracked over time
