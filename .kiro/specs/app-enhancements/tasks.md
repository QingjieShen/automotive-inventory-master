# Implementation Plan: App Enhancements

## Overview

This implementation plan breaks down the app enhancements into discrete, incremental tasks. The tasks are organized to build foundational infrastructure first (Google Cloud migration), then add UI enhancements (store backgrounds, navigation), and finally implement new features (add vehicle page, super admin role). Each task builds on previous work and includes testing to validate functionality.

## Tasks

- [x] 1. Set up Google Cloud infrastructure and migrate storage
  - Install @google-cloud/storage package
  - Create Google Cloud Storage service module (src/lib/gcs.ts)
  - Set up environment variables for GCS credentials and bucket name
  - Implement upload, delete, and URL generation methods
  - _Requirements: 1.1, 1.2, 1.3, 1.6_

- [x] 1.1 Write property test for GCS upload consistency
  - **Property 1: Google Cloud Storage Upload Consistency**
  - **Validates: Requirements 1.3, 1.6**
  - Generate random image buffers and upload parameters
  - Verify upload returns valid URL and file is accessible

- [x] 1.2 Write property test for path generation uniqueness
  - **Property 8: Image Path Generation Uniqueness**
  - **Validates: Requirements 1.6**
  - Generate multiple consecutive uploads
  - Verify all generated paths are unique

- [x] 2. Update database schema for new features
  - Add SUPER_ADMIN to UserRole enum in Prisma schema
  - Add imageUrl field to Store model
  - Create and run Prisma migration
  - Update TypeScript types to reflect schema changes
  - _Requirements: 2.3, 5.1_

- [x] 3. Replace AWS S3 calls with Google Cloud Storage
  - Update all API routes that use s3.ts to use gcs.ts instead
  - Update vehicle image upload endpoint (/api/vehicles/[id]/images)
  - Update vehicle image delete endpoint
  - Update processing download endpoint
  - Test existing vehicle photo upload/delete functionality
  - _Requirements: 1.2, 1.3, 1.5_

- [x] 3.1 Write unit tests for GCS service
  - Test path generation with various parameters
  - Test public URL generation with and without CDN
  - Test error handling for upload failures
  - _Requirements: 1.3, 1.6_

- [x] 4. Implement store image upload functionality
  - Create API endpoint for uploading store images (POST /api/stores/[id]/image)
  - Add store image upload to GCS with path: stores/{storeId}/store-image.{ext}
  - Update Store model queries to include imageUrl
  - _Requirements: 2.1, 5.5_

- [x] 5. Update StoreCard component with background images
  - Modify StoreCard.tsx to use background-image CSS with store imageUrl
  - Add dark overlay (rgba(0, 0, 0, 0.4)) for text readability
  - Implement fallback gradient background when imageUrl is missing
  - Update text styling to white with text-shadow
  - Ensure responsive design and hover states work with backgrounds
  - _Requirements: 2.1, 2.2, 2.4, 2.5_

- [x] 5.1 Write property test for store image fallback
  - **Property 2: Store Image Display Fallback**
  - **Validates: Requirements 2.3**
  - Generate stores with various imageUrl values (valid, invalid, null, undefined)
  - Verify component renders without errors

- [x] 5.2 Write property test for text readability
  - **Property 11: Store Card Text Readability**
  - **Validates: Requirements 2.4**
  - Generate stores with various background images
  - Verify text contrast ratio meets WCAG AA standards (4.5:1)

- [x] 6. Create Navigation Banner component
  - Create src/components/common/NavigationBanner.tsx
  - Implement fixed header with MMG logo, store name, and back button
  - Add responsive design (collapse to hamburger on mobile)
  - Style with Tailwind CSS (fixed position, z-index 50, height 64px)
  - Export from src/components/common/index.ts
  - _Requirements: 3.1, 3.4, 3.5, 3.6, 3.7_

- [x] 6.1 Write property test for navigation banner visibility
  - **Property 3: Navigation Banner Visibility**
  - **Validates: Requirements 3.1, 3.2**
  - Test banner rendering on various pages
  - Verify banner is always present after store selection

- [x] 7. Integrate Navigation Banner into existing pages
  - Add NavigationBanner to vehicles list page (src/app/vehicles/page.tsx)
  - Add NavigationBanner to vehicle detail page (src/app/vehicles/[id]/page.tsx)
  - Implement "Back to Stores" navigation using Next.js router
  - Pass current store from StoreProvider context
  - _Requirements: 3.2, 3.3_

- [x] 7.1 Write property test for navigation back functionality
  - **Property 9: Navigation Back to Stores**
  - **Validates: Requirements 3.3**
  - Test navigation from various pages
  - Verify always navigates to store selection page

- [x] 8. Checkpoint - Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.

- [x] 9. Create Add Vehicle page route
  - Create src/app/vehicles/new/page.tsx
  - Implement full-page layout with NavigationBanner
  - Create two-column layout (vehicle info left, photos right)
  - Add responsive design (single column on mobile)
  - _Requirements: 4.1, 4.2, 4.6_

- [x] 10. Implement Add Vehicle form
  - Add stock number input field with validation
  - Add store selection dropdown (or display current store)
  - Implement real-time validation feedback
  - Add Key Images upload section (6 specific shots)
  - Add Gallery Images upload section (additional photos)
  - Implement drag-and-drop photo upload with preview
  - _Requirements: 4.3, 4.7, 4.8_

- [x] 10.1 Write property test for form validation
  - **Property 4: Add Vehicle Page Form Validation**
  - **Validates: Requirements 4.7**
  - Generate various invalid stock numbers (empty, whitespace, special chars)
  - Verify form validation prevents submission

- [x] 10.2 Write property test for photo upload association
  - **Property 10: Add Vehicle Page Photo Upload**
  - **Validates: Requirements 4.3, 4.8**
  - Generate random sets of photos
  - Verify all photos are associated with created vehicle

- [x] 11. Wire Add Vehicle page to API
  - Implement form submission handler
  - Call POST /api/vehicles to create vehicle
  - Upload photos to newly created vehicle
  - Handle success: navigate to vehicle detail page
  - Handle errors: display error messages with retry option
  - Implement cancel button: navigate back to vehicle list
  - _Requirements: 4.4, 4.5_

- [x] 12. Update vehicle list page to use new Add Vehicle page
  - Change "Add Vehicle" button to navigate to /vehicles/new
  - Remove AddVehicleModal component usage
  - Pass storeId as query parameter if needed
  - _Requirements: 4.1_

- [x] 13. Checkpoint - Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.

- [x] 14. Create Super Admin authorization middleware
  - Create requireSuperAdmin function in src/lib/auth.ts
  - Check user session and role
  - Return 403 Forbidden if not Super Admin
  - Add logging for authorization failures
  - _Requirements: 5.1, 5.10_

- [x] 14.1 Write property test for Super Admin authorization
  - **Property 6: Super Admin Authorization**
  - **Validates: Requirements 5.10**
  - Generate requests with various user roles
  - Verify only Super Admin can access store management endpoints

- [x] 14.2 Write property test for role-based access
  - **Property 12: Role-Based Store Management Access**
  - **Validates: Requirements 5.2, 5.10**
  - Generate users with different roles
  - Verify only Super Admin can access store management

- [x] 15. Implement store management API endpoints
  - Create POST /api/stores for creating stores (Super Admin only)
  - Create PUT /api/stores/[id] for updating stores (Super Admin only)
  - Create DELETE /api/stores/[id] for deleting stores (Super Admin only)
  - Add validation for required fields (name, address)
  - Implement check for vehicles before deletion
  - Add audit logging for all store operations
  - _Requirements: 5.4, 5.5, 5.6, 5.7, 5.8, 5.9_

- [x] 15.1 Write property test for store creation
  - **Property 5: Super Admin Store Creation**
  - **Validates: Requirements 5.4, 5.8**
  - Generate random valid store data
  - Verify store is created and retrievable

- [x] 15.2 Write property test for store deletion protection
  - **Property 7: Store Deletion Protection**
  - **Validates: Requirements 5.7**
  - Generate stores with varying numbers of vehicles
  - Verify stores with vehicles cannot be deleted

- [x] 16. Create Store Management page
  - Create src/app/admin/stores/page.tsx
  - Add RoleGuard component to restrict access to Super Admin
  - Display table of all stores with edit/delete actions
  - Add "Add Store" button
  - Implement store form (modal or separate page) with fields: name, address, brand logos, image upload
  - Add delete confirmation dialog
  - Display error if trying to delete store with vehicles
  - _Requirements: 5.2, 5.3, 5.4, 5.5, 5.6, 5.7_

- [x] 16.1 Write unit tests for Store Management page
  - Test Super Admin can access page
  - Test non-Super Admin cannot access page
  - Test store creation form validation
  - Test delete confirmation dialog
  - _Requirements: 5.2, 5.10_

- [x] 17. Add navigation to Store Management for Super Admins
  - Update NavigationBanner to show "Manage Stores" link for Super Admins
  - Add conditional rendering based on user role
  - Ensure link is hidden for Photographers and Admins
  - _Requirements: 5.2, 5.10_

- [x] 18. Final checkpoint - Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.

- [x] 19. Update environment variables documentation
  - Document required Google Cloud environment variables
  - Document GOOGLE_CLOUD_STORAGE_BUCKET
  - Document GOOGLE_APPLICATION_CREDENTIALS or service account JSON
  - Document optional GOOGLE_CLOUD_CDN_DOMAIN
  - Update .env.example file
  - _Requirements: 1.1, 1.7_

- [ ] 20. Integration testing and final validation
  - Test complete store management flow (create, edit, delete)
  - Test complete add vehicle flow with new page
  - Test navigation banner on all pages
  - Test store cards with background images
  - Verify all Google Cloud Storage operations work
  - Test role-based access for all features
  - _Requirements: All_

## Notes

- All tasks including tests are required for comprehensive implementation
- Each task references specific requirements for traceability
- Checkpoints ensure incremental validation
- Property tests validate universal correctness properties
- Unit tests validate specific examples and edge cases
- Google Cloud credentials should be configured before starting implementation
- Consider running a parallel AWS S3 → GCS migration for existing images if needed

