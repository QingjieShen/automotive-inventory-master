# Implementation Plan: shadcn/ui Integration

## Overview

This implementation plan outlines the step-by-step process for integrating shadcn/ui into the automotive inventory management application. The migration will be performed incrementally, starting with setup and core components, then migrating existing components one by one while maintaining functionality and adding comprehensive tests.

## Tasks

- [x] 1. Setup and Configuration
  - Install Tailwind CSS v4 and configure PostCSS
  - Update globals.css with shadcn/ui theme variables and @theme directive
  - Create lib/utils.ts with cn() utility function
  - Verify TypeScript path aliases are configured for @/components/ui
  - _Requirements: 1.1, 1.2, 1.3, 1.4, 1.5_

- [ ] 2. Install Core shadcn/ui Components
  - [ ] 2.1 Install Button component
    - Copy Button component to src/components/ui/button.tsx
    - Install class-variance-authority and @radix-ui/react-slot dependencies
    - Create example usage in a test file to verify installation
    - _Requirements: 2.1_

  - [ ] 2.2 Install Card component
    - Copy Card component to src/components/ui/card.tsx
    - Verify Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter exports
    - _Requirements: 2.2_

  - [ ] 2.3 Install Input component
    - Copy Input component to src/components/ui/input.tsx
    - Test with different input types (text, email, password)
    - _Requirements: 2.3_

  - [ ] 2.4 Install Badge component
    - Copy Badge component to src/components/ui/badge.tsx
    - Add custom "success" and "warning" variants for status indicators
    - _Requirements: 2.4_

  - [ ] 2.5 Install Dialog component
    - Copy Dialog component to src/components/ui/dialog.tsx
    - Install @radix-ui/react-dialog dependency
    - Install lucide-react for icons
    - _Requirements: 2.5_

  - [ ] 2.6 Install Select component
    - Copy Select component to src/components/ui/select.tsx
    - Install @radix-ui/react-select dependency
    - _Requirements: 2.6_

  - [ ] 2.7 Install Checkbox component
    - Copy Checkbox component to src/components/ui/checkbox.tsx
    - Install @radix-ui/react-checkbox dependency
    - _Requirements: 2.8_

  - [ ] 2.8 Install Skeleton component
    - Copy Skeleton component to src/components/ui/skeleton.tsx
    - _Requirements: 2.9_

  - [ ] 2.9 Install Toast/Sonner component
    - Copy Toast/Sonner component to src/components/ui/sonner.tsx
    - Install sonner dependency for toast notifications
    - Add Toaster provider to root layout
    - _Requirements: 2.10_

- [ ] 2.10 Write property test for core components
  - **Property 1: Component Accessibility**
  - **Validates: Requirements 11.1, 11.2, 11.4, 11.5**
  - Test that all shadcn components include proper ARIA attributes
  - Test that focus indicators are visible
  - Test that error announcements work with screen readers

- [ ] 3. Migrate VehicleCard Component
  - [ ] 3.1 Update VehicleCard to use shadcn components
    - Replace div container with Card component
    - Replace status span with Badge component
    - Replace button with Button component
    - Replace checkbox input with Checkbox component
    - Maintain existing layout and responsive behavior
    - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.5_

  - [ ] 3.2 Write unit tests for VehicleCard
    - Test rendering with vehicle data
    - Test checkbox selection
    - Test button click navigation
    - Test status badge variants
    - _Requirements: 3.1, 3.2, 3.3, 3.4_

  - [ ] 3.3 Write property test for VehicleCard
    - **Property 4: Functional Preservation**
    - **Property 5: Hover State Consistency**
    - **Validates: Requirements 3.5, 3.6**
    - Test that all vehicle data is displayed correctly
    - Test that hover states work consistently

- [ ] 4. Migrate StoreCard Component
  - [ ] 4.1 Update StoreCard to use shadcn components
    - Replace div container with Card component
    - Use CardHeader and CardTitle for store name
    - Replace brand logo spans with Badge components
    - Replace button with Button component
    - Maintain background image and gradient overlay styling
    - _Requirements: 4.1, 4.2, 4.3, 4.4, 4.5_

  - [ ] 4.2 Write unit tests for StoreCard
    - Test rendering with store data
    - Test button click callback
    - Test keyboard navigation
    - Test background image styling
    - _Requirements: 4.1, 4.2, 4.3_

  - [ ] 4.3 Write property test for StoreCard
    - **Property 4: Functional Preservation**
    - **Validates: Requirements 4.4, 4.5**
    - Test that background styling is preserved
    - Test that gradient overlay is maintained

- [ ] 5. Checkpoint - Verify Card Components
  - Ensure all tests pass for VehicleCard and StoreCard
  - Manually test responsive behavior on mobile, tablet, desktop
  - Verify accessibility with keyboard navigation
  - Ask the user if questions arise

- [ ] 6. Migrate Modal Components
  - [ ] 6.1 Update AddVehicleModal to use Dialog
    - Replace custom modal with Dialog component
    - Use DialogHeader, DialogTitle, DialogContent, DialogFooter
    - Maintain existing form state and submission logic
    - _Requirements: 6.1, 6.2, 6.5_

  - [ ] 6.2 Update DeleteVehicleModal to use Dialog
    - Replace custom modal with Dialog component
    - Use destructive Button variant for delete action
    - Maintain existing delete callback
    - _Requirements: 6.1, 6.3, 6.5_

  - [ ] 6.3 Update BulkDeleteModal to use Dialog
    - Replace custom modal with Dialog component
    - Add warning styling to DialogDescription
    - Maintain existing bulk delete logic
    - _Requirements: 6.1, 6.4, 6.5_

  - [ ] 6.4 Write unit tests for modal components
    - Test modal open/close behavior
    - Test callback execution
    - Test form submission in AddVehicleModal
    - Test delete confirmation in DeleteVehicleModal
    - _Requirements: 6.1, 6.2, 6.3, 6.4_

  - [ ] 6.5 Write property test for modals
    - **Property 2: Modal Focus Management**
    - **Property 4: Functional Preservation**
    - **Validates: Requirements 11.3, 6.5**
    - Test that focus is trapped in modals
    - Test that focus returns to trigger on close
    - Test that callbacks are preserved

- [ ] 7. Migrate Form Components
  - [ ] 7.1 Update form inputs to use shadcn Input
    - Replace all text inputs with Input component
    - Replace all select dropdowns with Select component
    - Replace all form buttons with Button component
    - Maintain existing form validation logic
    - _Requirements: 5.1, 5.2, 5.3, 5.5_

  - [ ] 7.2 Update form error display
    - Style validation errors using shadcn text-destructive classes
    - Ensure error messages are associated with inputs via ARIA
    - _Requirements: 5.4_

  - [ ] 7.3 Write unit tests for form components
    - Test input rendering and value changes
    - Test select dropdown options
    - Test form submission
    - Test validation error display
    - _Requirements: 5.1, 5.2, 5.3, 5.4_

  - [ ] 7.4 Write property test for forms
    - **Property 4: Functional Preservation**
    - **Property 6: Form Validation Display**
    - **Validates: Requirements 5.4, 5.5**
    - Test that validation logic is preserved
    - Test that error messages are displayed consistently

- [ ] 8. Migrate Table Components (if applicable)
  - [ ] 8.1 Install Table component
    - Copy Table component to src/components/ui/table.tsx
    - Verify Table, TableHeader, TableBody, TableRow, TableCell exports
    - _Requirements: 2.7_

  - [ ] 8.2 Update VehicleList to use Table (if using table layout)
    - Replace table elements with shadcn Table components
    - Maintain existing sort functionality
    - Maintain existing pagination controls
    - _Requirements: 7.1, 7.2, 7.3, 7.4, 7.5_

  - [ ] 8.3 Write property test for tables
    - **Property 4: Functional Preservation**
    - **Validates: Requirements 7.4, 7.5**
    - Test that sorting is preserved
    - Test that pagination is preserved

- [ ] 9. Implement Loading States
  - [ ] 9.1 Create skeleton components for VehicleCard
    - Create VehicleCardSkeleton using Skeleton component
    - Match dimensions and layout of actual VehicleCard
    - _Requirements: 8.1, 8.2_

  - [ ] 9.2 Create skeleton components for StoreCard
    - Create StoreCardSkeleton using Skeleton component
    - Match dimensions and layout of actual StoreCard
    - _Requirements: 8.1, 8.3_

  - [ ] 9.3 Update loading states throughout application
    - Replace LoadingSpinner with Skeleton where appropriate
    - Use Skeleton for list loading states
    - _Requirements: 8.1_

  - [ ] 9.4 Write property test for loading states
    - **Property 7: Loading State Representation**
    - **Validates: Requirements 8.2, 8.3**
    - Test that skeleton dimensions match actual components

- [ ] 10. Checkpoint - Verify All Component Migrations
  - Ensure all tests pass
  - Manually test all user workflows
  - Verify no regressions in functionality
  - Ask the user if questions arise

- [ ] 11. Implement Toast Notifications
  - [ ] 11.1 Create toast notification utility
    - Create utility functions for success, error, info toasts
    - Use sonner toast with appropriate variants
    - _Requirements: 9.1, 9.2, 9.3_

  - [ ] 11.2 Replace existing notification system
    - Update all success messages to use toast
    - Update all error messages to use toast
    - Update all info messages to use toast
    - _Requirements: 9.1, 9.2, 9.3_

  - [ ] 11.3 Write property test for toasts
    - **Property 8: Toast Notification Behavior**
    - **Validates: Requirements 9.4, 9.5**
    - Test that toasts auto-dismiss
    - Test that toasts are positioned consistently

- [ ] 12. Implement Dark Mode Support
  - [ ] 12.1 Add dark mode theme variables to globals.css
    - Define dark mode color tokens in :root with .dark selector
    - Ensure proper contrast ratios for dark mode
    - _Requirements: 13.1, 13.3_

  - [ ] 12.2 Create theme toggle component
    - Create ThemeToggle component using Button
    - Implement theme switching logic
    - Persist theme preference to localStorage
    - Add ThemeToggle to navigation banner
    - _Requirements: 13.2, 13.5_

  - [ ] 12.3 Add theme provider
    - Create ThemeProvider component
    - Wrap application in ThemeProvider
    - Detect system preference on initial load
    - _Requirements: 13.4_

  - [ ] 12.4 Write unit tests for dark mode
    - Test theme toggle functionality
    - Test theme persistence
    - Test system preference detection
    - _Requirements: 13.2, 13.4, 13.5_

  - [ ] 12.5 Write property test for dark mode
    - **Property 10: Dark Mode Application**
    - **Validates: Requirements 13.1, 13.2, 13.3**
    - Test that dark theme colors are applied
    - Test that contrast ratios are maintained
    - Test that preference persists

- [ ] 13. Theme Consistency and Styling
  - [ ] 13.1 Audit all components for theme token usage
    - Replace hardcoded colors with theme tokens
    - Replace hardcoded spacing with theme tokens
    - Replace hardcoded typography with theme tokens
    - _Requirements: 10.1, 10.2, 10.3, 10.4_

  - [ ] 13.2 Ensure consistent hover and focus states
    - Verify all interactive elements have hover states
    - Verify all focusable elements have focus indicators
    - _Requirements: 10.2_

  - [ ] 13.3 Write property test for theme consistency
    - **Property 3: Theme Token Consistency**
    - **Property 5: Hover State Consistency**
    - **Validates: Requirements 10.1, 10.2, 10.3, 10.4, 3.6**
    - Test that components use theme tokens
    - Test that hover states are consistent

- [ ] 14. Responsive Design Verification
  - [ ] 14.1 Test mobile layouts
    - Verify all components work on mobile viewports
    - Verify touch targets are appropriately sized
    - Test mobile navigation
    - _Requirements: 12.1, 12.5_

  - [ ] 14.2 Test tablet layouts
    - Verify all components work on tablet viewports
    - Test tablet-specific breakpoints
    - _Requirements: 12.2_

  - [ ] 14.3 Test desktop layouts
    - Verify all components work on desktop viewports
    - Test desktop-specific features
    - _Requirements: 12.3_

  - [ ] 14.4 Write property test for responsive design
    - **Property 9: Responsive Layout Adaptation**
    - **Validates: Requirements 12.1, 12.2, 12.3, 12.5**
    - Test that responsive classes are applied correctly
    - Test that touch targets meet minimum sizes on mobile

- [ ] 15. Accessibility Testing and Improvements
  - [ ] 15.1 Run automated accessibility tests
    - Use jest-axe or similar tool to test accessibility
    - Fix any accessibility violations found
    - _Requirements: 11.1, 11.2, 11.3, 11.4, 11.5_

  - [ ] 15.2 Manual keyboard navigation testing
    - Test tab navigation through all pages
    - Test Enter/Space activation of interactive elements
    - Test Escape key for closing modals
    - _Requirements: 11.2, 11.3_

  - [ ] 15.3 Screen reader testing
    - Test with screen reader (NVDA, JAWS, or VoiceOver)
    - Verify all content is announced correctly
    - Verify form errors are announced
    - _Requirements: 11.1, 11.4_

  - [ ] 15.4 Write comprehensive accessibility property test
    - **Property 1: Component Accessibility**
    - **Validates: Requirements 11.1, 11.2, 11.4, 11.5**
    - Test ARIA attributes across all components
    - Test focus indicators across all interactive elements
    - Test screen reader announcements

- [ ] 16. Performance Testing and Optimization
  - [ ] 16.1 Measure bundle size
    - Compare bundle size before and after migration
    - Ensure bundle size has not increased significantly
    - _Requirements: 14.1_

  - [ ] 16.2 Measure page load performance
    - Measure initial page load time
    - Compare with pre-migration baseline
    - _Requirements: 14.2_

  - [ ] 16.3 Measure component render performance
    - Measure render times for key components
    - Compare with pre-migration baseline
    - _Requirements: 14.3_

  - [ ] 16.4 Write property test for performance
    - **Property 11: Performance Preservation**
    - **Validates: Requirements 14.2, 14.3**
    - Test that load times are within acceptable range
    - Test that render times are within acceptable range

- [ ] 17. Final Integration Testing
  - [ ] 17.1 Run full test suite
    - Run all unit tests
    - Run all property-based tests
    - Run all integration tests
    - Ensure all tests pass
    - _Requirements: 15.1, 15.2, 15.3_

  - [ ] 17.2 Manual end-to-end testing
    - Test complete user workflows
    - Test photographer workflow
    - Test admin workflow
    - Verify no regressions
    - _Requirements: 15.4_

  - [ ] 17.3 Cross-browser testing
    - Test in Chrome, Firefox, Safari, Edge
    - Verify consistent behavior across browsers
    - Fix any browser-specific issues

- [ ] 18. Final Checkpoint and Documentation
  - Ensure all tests pass
  - Update README with shadcn/ui information
  - Document any custom theme modifications
  - Document dark mode usage
  - Ask the user for final approval

## Notes

- Each task references specific requirements for traceability
- Checkpoints ensure incremental validation
- Property tests validate universal correctness properties
- Unit tests validate specific examples and edge cases
- Migration is performed incrementally to minimize risk
- Existing functionality must be preserved throughout migration
