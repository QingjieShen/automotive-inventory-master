# Manual End-to-End Testing Guide

## Overview
This guide provides step-by-step instructions for manually testing the shadcn/ui integration to verify that all user workflows function correctly and no regressions have been introduced.

## Prerequisites
- Application running locally (`npm run dev`)
- Test database seeded with sample data
- Multiple browsers available for cross-browser testing

## Test Workflows

### 1. Photographer Workflow

#### 1.1 Login and Store Selection
- [ ] Navigate to the application
- [ ] Log in with photographer credentials
- [ ] Verify NavigationBanner displays correctly
- [ ] Verify theme toggle is visible and functional
- [ ] Select a store from the store selection page
- [ ] Verify StoreCard components display correctly with:
  - Background images
  - Store names
  - Brand logos as badges
  - Hover effects
  - Button interactions

#### 1.2 Vehicle Management
- [ ] Navigate to vehicles page
- [ ] Verify VehicleCard components display correctly with:
  - Vehicle information (stock number, VIN, etc.)
  - Status badges with correct variants
  - Checkboxes for selection
  - Action buttons
  - Hover effects
- [ ] Verify VehicleCardSkeleton displays during loading
- [ ] Test vehicle filtering and search functionality
- [ ] Test sorting functionality

#### 1.3 Add New Vehicle
- [ ] Click "Add Vehicle" button
- [ ] Verify AddVehicleModal opens with Dialog component
- [ ] Test form inputs:
  - Stock Number input (required)
  - VIN input with validation (17 characters)
  - Store selection (pre-filled)
  - Photo uploader
- [ ] Test VIN validation:
  - Enter invalid VIN (too short)
  - Verify error message displays with destructive styling
  - Verify error is announced to screen readers (check with dev tools)
- [ ] Enter valid vehicle data
- [ ] Upload vehicle photos
- [ ] Submit form
- [ ] Verify success toast notification appears
- [ ] Verify new vehicle appears in list

#### 1.4 Edit Vehicle
- [ ] Click on a vehicle card to view details
- [ ] Click "Edit" button
- [ ] Verify form pre-fills with vehicle data
- [ ] Modify vehicle information
- [ ] Test image management:
  - Upload new images
  - Reorder images with drag-and-drop
  - Delete images
  - Verify DeleteImageModal uses Dialog component
- [ ] Save changes
- [ ] Verify success toast notification
- [ ] Verify changes are reflected

#### 1.5 Delete Vehicle
- [ ] Click delete button on a vehicle
- [ ] Verify DeleteVehicleModal opens with Dialog component
- [ ] Verify modal shows:
  - Vehicle information
  - Warning message
  - Destructive button variant for delete action
- [ ] Test keyboard navigation:
  - Tab through modal elements
  - Press Escape to close
  - Press Enter to confirm
- [ ] Confirm deletion
- [ ] Verify success toast notification
- [ ] Verify vehicle is removed from list

#### 1.6 Bulk Operations
- [ ] Select multiple vehicles using checkboxes
- [ ] Click "Bulk Delete" button
- [ ] Verify BulkDeleteModal opens with Dialog component
- [ ] Verify modal shows:
  - Count of selected vehicles
  - Warning styling
  - Destructive button variant
- [ ] Confirm bulk deletion
- [ ] Verify success toast notification
- [ ] Verify all selected vehicles are removed

### 2. Admin Workflow

#### 2.1 Login and Navigation
- [ ] Log in with admin credentials
- [ ] Verify admin-specific navigation options
- [ ] Verify theme toggle works
- [ ] Test navigation between pages

#### 2.2 Store Management
- [ ] Navigate to stores management page
- [ ] Verify store list displays with Table component
- [ ] Test table features:
  - Sorting by columns
  - Pagination
  - Search/filter
- [ ] Click "Add Store" button
- [ ] Verify form uses shadcn Input and Select components
- [ ] Fill in store information
- [ ] Upload store image
- [ ] Submit form
- [ ] Verify success toast notification
- [ ] Verify new store appears in list

#### 2.3 Edit Store
- [ ] Click edit button on a store
- [ ] Verify form pre-fills with store data
- [ ] Modify store information
- [ ] Update store image
- [ ] Save changes
- [ ] Verify success toast notification
- [ ] Verify changes are reflected

#### 2.4 Delete Store
- [ ] Click delete button on a store
- [ ] Verify confirmation dialog appears
- [ ] Confirm deletion
- [ ] Verify success toast notification
- [ ] Verify store is removed from list

#### 2.5 User Management (if applicable)
- [ ] Navigate to user management
- [ ] Test user creation, editing, deletion
- [ ] Verify all forms use shadcn components
- [ ] Verify proper validation and error handling

### 3. Accessibility Testing

#### 3.1 Keyboard Navigation
- [ ] Test Tab navigation through all pages
- [ ] Verify focus indicators are visible on all interactive elements
- [ ] Test Enter/Space activation of buttons
- [ ] Test Escape key for closing modals
- [ ] Verify focus trap in modals
- [ ] Verify focus returns to trigger element after modal closes

#### 3.2 Screen Reader Testing
- [ ] Use screen reader (NVDA, JAWS, or VoiceOver)
- [ ] Navigate through main pages
- [ ] Verify all content is announced correctly
- [ ] Verify form labels are associated with inputs
- [ ] Verify error messages are announced
- [ ] Verify toast notifications are announced
- [ ] Verify modal titles and descriptions are announced

#### 3.3 Color Contrast
- [ ] Verify text has sufficient contrast in light mode
- [ ] Verify text has sufficient contrast in dark mode
- [ ] Use browser dev tools to check contrast ratios
- [ ] Verify focus indicators are visible in both themes

### 4. Responsive Design Testing

#### 4.1 Mobile (320px - 767px)
- [ ] Test on mobile device or browser dev tools
- [ ] Verify all pages are usable on mobile
- [ ] Verify touch targets are appropriately sized (minimum 44x44px)
- [ ] Test navigation menu on mobile
- [ ] Test forms on mobile
- [ ] Test modals on mobile
- [ ] Verify cards stack vertically
- [ ] Test image upload on mobile

#### 4.2 Tablet (768px - 1023px)
- [ ] Test on tablet device or browser dev tools
- [ ] Verify layouts adapt appropriately
- [ ] Test all interactive elements
- [ ] Verify cards display in grid layout
- [ ] Test forms and modals

#### 4.3 Desktop (1024px+)
- [ ] Test on desktop browser
- [ ] Verify full-width layouts
- [ ] Test all features
- [ ] Verify hover states work correctly
- [ ] Test keyboard shortcuts (if any)

### 5. Dark Mode Testing

#### 5.1 Theme Toggle
- [ ] Click theme toggle button
- [ ] Verify theme switches immediately
- [ ] Verify all components update to dark theme
- [ ] Verify theme preference persists on page reload
- [ ] Test theme toggle on different pages

#### 5.2 Dark Mode Appearance
- [ ] Verify all text is readable in dark mode
- [ ] Verify all buttons have proper contrast
- [ ] Verify all cards have proper styling
- [ ] Verify all modals have proper styling
- [ ] Verify all forms have proper styling
- [ ] Verify images display correctly
- [ ] Verify badges have proper contrast

#### 5.3 System Preference
- [ ] Change system theme preference to dark
- [ ] Open application in new browser tab
- [ ] Verify application defaults to dark theme
- [ ] Change system preference to light
- [ ] Refresh application
- [ ] Verify application switches to light theme

### 6. Performance Testing

#### 6.1 Page Load Performance
- [ ] Open browser dev tools (Network tab)
- [ ] Clear cache
- [ ] Load main pages
- [ ] Verify page load times are acceptable (< 3 seconds)
- [ ] Verify no console errors
- [ ] Verify no console warnings

#### 6.2 Component Render Performance
- [ ] Open browser dev tools (Performance tab)
- [ ] Record performance while navigating
- [ ] Verify no significant performance degradation
- [ ] Check for layout shifts
- [ ] Check for unnecessary re-renders

#### 6.3 Bundle Size
- [ ] Run `npm run build`
- [ ] Check build output for bundle sizes
- [ ] Verify JavaScript bundle size is acceptable
- [ ] Verify CSS bundle size is acceptable
- [ ] Compare with pre-migration baseline (if available)

### 7. Error Handling

#### 7.1 Form Validation Errors
- [ ] Submit forms with invalid data
- [ ] Verify error messages display correctly
- [ ] Verify error styling uses shadcn destructive variant
- [ ] Verify errors are associated with inputs via ARIA

#### 7.2 Network Errors
- [ ] Simulate network failure (offline mode)
- [ ] Attempt to submit forms
- [ ] Verify error toast notifications appear
- [ ] Verify user-friendly error messages

#### 7.3 Server Errors
- [ ] Simulate server errors (if possible)
- [ ] Verify error handling is graceful
- [ ] Verify error messages are user-friendly

## Test Results Summary

### Photographer Workflow
- [ ] All tests passed
- [ ] Issues found: _____________________

### Admin Workflow
- [ ] All tests passed
- [ ] Issues found: _____________________

### Accessibility
- [ ] All tests passed
- [ ] Issues found: _____________________

### Responsive Design
- [ ] All tests passed
- [ ] Issues found: _____________________

### Dark Mode
- [ ] All tests passed
- [ ] Issues found: _____________________

### Performance
- [ ] All tests passed
- [ ] Issues found: _____________________

### Error Handling
- [ ] All tests passed
- [ ] Issues found: _____________________

## Regression Checklist

Verify that the following functionality still works after shadcn/ui integration:

- [ ] User authentication and authorization
- [ ] Store selection and switching
- [ ] Vehicle CRUD operations
- [ ] Image upload and management
- [ ] Image processing workflows
- [ ] Bulk operations
- [ ] Search and filtering
- [ ] Sorting and pagination
- [ ] Form validation
- [ ] Error handling
- [ ] Toast notifications
- [ ] Navigation
- [ ] Responsive layouts
- [ ] Dark mode
- [ ] Accessibility features

## Notes

Document any issues, observations, or recommendations here:

---

## Sign-off

- [ ] All manual tests completed
- [ ] All critical issues resolved
- [ ] No regressions identified
- [ ] Ready for production deployment

Tested by: _____________________
Date: _____________________
