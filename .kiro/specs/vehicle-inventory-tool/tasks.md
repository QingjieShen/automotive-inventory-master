# Implementation Plan: Vehicle Inventory Tool

## Overview

This implementation plan converts the vehicle inventory tool design into discrete coding tasks. The approach follows an incremental development strategy, building core authentication and data layers first, then adding vehicle management, image processing, and advanced features. Each task builds on previous work to ensure no orphaned code.

## Tasks

- [ ] 1. Project Setup and Core Infrastructure
  - Initialize Next.js 14 project with TypeScript and Tailwind CSS
  - Configure ESLint, Prettier, and development environment
  - Set up folder structure following Next.js 14 app router conventions
  - Install core dependencies: NextAuth.js, Prisma, AWS SDK, @dnd-kit/core
  - _Requirements: 8.1, 8.2_

- [ ] 1.1 Set up testing framework and configuration
  - Configure Jest and React Testing Library for unit tests
  - Set up fast-check for property-based testing
  - Create test utilities and mock factories
  - _Requirements: Testing Strategy_

- [ ] 2. Database Schema and Models
  - [ ] 2.1 Create Prisma schema with User, Store, Vehicle, VehicleImage, and ProcessingJob models
    - Define all database tables with proper relationships and constraints
    - Include indexes for performance on stock_number and store_id fields
    - _Requirements: 7.1, 7.4_

  - [ ] 2.2 Write property test for data model relationships
    - **Property 12: Data Persistence and Integrity**
    - **Validates: Requirements 7.3, 7.4**

  - [ ] 2.3 Generate Prisma client and run initial migration
    - Set up PostgreSQL connection and run database migrations
    - Seed database with 9 MMG store locations and test data
    - _Requirements: 2.1, 7.1_

- [ ] 3. Authentication System
  - [ ] 3.1 Implement NextAuth.js configuration with JWT strategy
    - Configure JWT tokens with role-based claims
    - Set up login/logout API routes
    - Create custom session and JWT callbacks for role management
    - _Requirements: 1.1, 1.4_

  - [ ] 3.2 Create login page with MMG branding
    - Build responsive login form with email/password fields
    - Add MMG logo and brand styling matching Figma design
    - Implement form validation and error display
    - _Requirements: 1.1, 8.3_

  - [ ] 3.3 Write property tests for authentication flow
    - **Property 1: Authentication and Access Control**
    - **Validates: Requirements 1.2, 1.3, 1.5**

  - [ ] 3.4 Create ProtectedRoute HOC and RoleGuard components
    - Implement route protection middleware
    - Create role-based access control for Admin vs Photographer features
    - _Requirements: 1.5, 3.4_

- [ ] 4. Store Selection and Management
  - [ ] 4.1 Create store selection page with 9 MMG locations
    - Build responsive grid layout for store cards
    - Display store names, addresses, and brand logos
    - Implement store selection navigation
    - _Requirements: 2.1, 2.3_

  - [ ] 4.2 Implement store context and state management
    - Create StoreProvider for managing selected store state
    - Handle store switching and data filtering
    - _Requirements: 2.2, 2.4_

  - [ ] 4.3 Write property tests for store-specific data loading
    - **Property 2: Store-Specific Data Loading**
    - **Validates: Requirements 2.2, 2.4**

- [ ] 5. Vehicle Inventory Management
  - [ ] 5.1 Create vehicle list page with sorting and filtering
    - Build responsive table/grid layout for vehicle records
    - Implement sorting by stock number and search functionality
    - Display vehicle metadata: stock number, thumbnail, photo count, dates, status
    - _Requirements: 3.1, 3.2, 3.6_

  - [ ] 5.2 Add vehicle creation functionality
    - Create AddVehicleModal with form validation
    - Implement vehicle creation API endpoint
    - Handle initial photo upload during vehicle creation
    - _Requirements: 3.3, 6.1_

  - [ ] 5.3 Write property tests for vehicle display and search
    - **Property 3: Vehicle List Sorting and Display**
    - **Property 5: Search and Filtering**
    - **Validates: Requirements 3.1, 3.2, 3.6**

  - [ ] 5.4 Implement Admin bulk operations
    - Add multi-select checkboxes for Admin users only
    - Create bulk delete functionality with confirmation
    - Implement role-based UI rendering
    - _Requirements: 3.4, 3.5_

  - [ ] 5.5 Write property tests for role-based access control
    - **Property 4: Role-Based Access Control**
    - **Validates: Requirements 3.4, 5.4**

- [ ] 6. Checkpoint - Core functionality validation
  - Ensure all tests pass, verify authentication and basic vehicle management works
  - Ask the user if questions arise about core functionality

- [ ] 7. Image Gallery and Management
  - [ ] 7.1 Create vehicle detail page with image gallery layout
    - Build responsive layout: Front shot in individual row, other 5 key shots in two rows
    - Implement four-column grid for gallery images
    - Add navigation from vehicle list to detail page
    - _Requirements: 4.1, 4.2, 4.3_

  - [ ] 7.2 Implement drag-and-drop photo reordering
    - Integrate @dnd-kit/core for accessible drag-and-drop
    - Handle photo position updates and persistence
    - Maintain separate ordering for key images vs gallery images
    - _Requirements: 4.4_

  - [ ] 7.3 Write property tests for photo interaction
    - **Property 7: Photo Interaction and Management**
    - **Validates: Requirements 4.4, 4.5, 4.6**

  - [ ] 7.4 Add photo deletion with confirmation
    - Implement hover-to-show delete button
    - Create confirmation modal for photo deletion
    - Handle photo removal from database and S3
    - _Requirements: 4.5, 4.6_

- [ ] 8. File Upload System
  - [ ] 8.1 Create drag-and-drop photo upload component
    - Build file upload interface with progress indicators
    - Implement file validation (format, size limits)
    - Generate thumbnails using Next.js Image optimization
    - _Requirements: 6.1, 6.3, 6.4_

  - [ ] 8.2 Implement S3 integration for file storage
    - Set up AWS S3 client with proper folder structure
    - Handle file uploads with CloudFront CDN integration
    - Preserve original metadata and generate thumbnails
    - _Requirements: 6.6, 7.2_

  - [ ] 8.3 Write property tests for photo upload and categorization
    - **Property 11: Photo Upload and Categorization**
    - **Validates: Requirements 6.1, 6.2, 6.3, 6.4, 6.5**

- [ ] 9. Image Processing Integration
  - [ ] 9.1 Implement Gemini Nano API integration
    - Create API client for background removal service
    - Set up processing job queue and status tracking
    - Handle API authentication and error responses
    - _Requirements: 5.1, 5.8_

  - [ ] 9.2 Add processing buttons and status management
    - Display process buttons under key images when not processed
    - Implement processing status updates (In Progress, Finished, Error)
    - Show processed images when available
    - _Requirements: 4.7, 4.8, 5.2, 5.3_

  - [ ] 9.3 Write property tests for processing workflow
    - **Property 8: Processing Status Management**
    - **Property 9: Key Image Processing Scope**
    - **Validates: Requirements 4.7, 4.8, 5.1, 5.2, 5.3, 5.5, 5.8**

  - [ ] 9.4 Implement Admin reprocessing and download functionality
    - Add reprocess buttons for Admin users on finished images
    - Create download functionality for processed images
    - Maintain both original and processed image versions
    - _Requirements: 5.4, 5.6, 5.7_

  - [ ] 9.5 Write property tests for image preservation and download
    - **Property 10: Image Preservation and Download**
    - **Validates: Requirements 5.6, 5.7**

- [ ] 10. UI Polish and Responsiveness
  - [ ] 10.1 Implement responsive design and accessibility features
    - Ensure proper mobile/tablet layouts
    - Add ARIA labels and keyboard navigation
    - Implement loading states and error boundaries
    - _Requirements: 8.1, 8.4, 8.5_

  - [ ] 10.2 Write property tests for UI responsiveness
    - **Property 13: User Interface Responsiveness**
    - **Validates: Requirements 8.4, 8.5**

- [ ] 11. Final Integration and Testing
  - [ ] 11.1 Wire all components together and test end-to-end workflows
    - Connect authentication → store selection → vehicle management → image processing
    - Ensure proper error handling and user feedback throughout
    - Verify all role-based permissions work correctly
    - _Requirements: All requirements integration_

  - [ ] 11.2 Write integration tests for complete user workflows
    - Test Photographer workflow: login → select store → manage photos
    - Test Admin workflow: login → select store → bulk operations → reprocessing
    - _Requirements: Complete workflow validation_

- [ ] 12. Final checkpoint - Complete system validation
  - Ensure all tests pass, verify complete functionality works end-to-end
  - Ask the user if questions arise about the complete system

## Notes

- All tasks are required for comprehensive development from the start
- Each task references specific requirements for traceability
- Checkpoints ensure incremental validation at major milestones
- Property tests validate universal correctness properties using fast-check
- Unit tests validate specific examples and edge cases
- The implementation follows Next.js 14 app router conventions throughout