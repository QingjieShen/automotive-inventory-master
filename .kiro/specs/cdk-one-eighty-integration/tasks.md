# Implementation Plan: CDK One-Eighty Integration

## Overview

This implementation plan breaks down the CDK One-Eighty integration into discrete coding tasks. The plan follows an incremental approach: database schema updates → image validation → Google Cloud Storage integration → AI processing → CSV feed generation → authentication → testing.

## Tasks

- [x] 1. Update database schema and run migrations
  - Add `vin` field to Vehicle model (String, required, 17 characters)
  - Add `optimizedUrl` field to VehicleImage model (String, optional)
  - Add `isOptimized` field to VehicleImage model (Boolean, default false)
  - Add `processedAt` field to VehicleImage model (DateTime, optional)
  - Add `updatedAt` field to VehicleImage model (DateTime, auto-update)
  - Add index on `vin` field in Vehicle model
  - Add index on `isOptimized` field in VehicleImage model
  - Generate and run Prisma migration
  - _Requirements: 1.1, 9.1, 9.2, 9.3, 9.4_

- [x] 1.1 Write property test for VIN validation

  - **Property 1: VIN Validation Rejects Invalid Inputs**
  - **Validates: Requirements 1.2, 1.3, 1.4**

- [x] 2. Create VIN validation utility
  - [x] 2.1 Implement VIN validator function
    - Create `src/lib/validators/vin-validator.ts`
    - Implement validation logic for 17-character alphanumeric format
    - Exclude I, O, Q characters from valid VINs
    - Return validation result with descriptive error messages
    - _Requirements: 1.2, 1.3, 1.4_

- [ ]* 2.2 Write unit tests for VIN validator edge cases
  - Test empty string, 16 chars, 18 chars, invalid characters
  - _Requirements: 1.2, 1.3, 1.4_

- [x] 3. Create image validation service
  - [x] 3.1 Implement ImageValidator class
    - Create `src/lib/services/image-validator.ts`
    - Validate MIME type (image/jpeg, image/png only)
    - Validate file size (max 4MB)
    - Return validation result with descriptive errors
    - _Requirements: 2.1, 2.2, 2.3, 2.4, 2.5_

- [ ]* 3.2 Write property tests for image validation
  - **Property 2: Image Format Validation**
  - **Property 3: Image Size Validation**
  - **Property 4: Valid Images Are Accepted**
  - **Validates: Requirements 2.1, 2.2, 2.3, 2.4, 2.5**

- [x] 4. Checkpoint - Ensure validation tests pass
  - Ensure all tests pass, ask the user if questions arise.

- [x] 5. Set up Google Cloud Storage service
  - [x] 5.1 Install and configure GCS dependencies
    - Install `@google-cloud/storage` package
    - Add GCS environment variables to `.env.example`
    - Create GCS configuration type definitions
    - _Requirements: 3.2_


  - [x] 5.2 Implement GoogleCloudStorageService class
    - Create `src/lib/services/gcs-service.ts`
    - Implement constructor with credentials configuration
    - Implement `uploadImage()` method for storing images
    - Implement `getPublicUrl()` method for retrieving URLs
    - Implement `deleteImage()` method for cleanup
    - Implement `generateUniqueFilename()` helper
    - _Requirements: 3.2_

- [ ]* 5.3 Write unit tests for GCS service
  - Mock GCS client for testing
  - Test upload, retrieval, and deletion operations
  - _Requirements: 3.2_

- [-] 6. Create background template management
  - [ ] 6.1 Upload background templates to GCS
    - Create `backgrounds/` folder in GCS bucket
    - Upload pre-designed background images
    - Document background template naming convention
    - _Requirements: 3.3_

  - [ ] 6.2 Implement background template selector
    - Create `src/lib/services/background-template-service.ts`
    - Map ImageType to background template URLs
    - Implement `selectBackgroundTemplate()` method
    - _Requirements: 3.3_

- [ ] 7. Implement Google AI image processor service
  - [ ] 7.1 Create ImageProcessorService class
    - Create `src/lib/services/image-processor-service.ts`
    - Define key image types constant (6 types)
    - Implement `shouldProcessImage()` to filter key images only
    - Implement `processImage()` orchestration method
    - _Requirements: 3.1, 3.3, 3.4, 3.5, 3.6, 4.1, 4.2, 4.3_

  - [ ] 7.2 Implement Google AI integration
    - Implement `removeAndReplaceBackground()` method
    - Configure Google AI API client (Vertex AI or Gemini)
    - Build prompt for background removal and replacement
    - Handle AI API responses and errors
    - _Requirements: 3.3, 3.8_

  - [ ] 7.3 Implement image processing workflow
    - Implement `downloadImage()` from original URL
    - Call Google AI for background processing
    - Upload optimized image to GCS
    - Update database with optimized URL and timestamps
    - _Requirements: 3.2, 3.4, 3.5, 4.3, 4.4, 4.5_

- [ ]* 7.4 Write property tests for image processing
  - **Property 5: Image State Transitions**
  - **Property 6: Dual URL Storage**
  - **Property 7: Processing Timestamp Consistency**
  - **Property 22: Processing Failure Handling**
  - **Property 23: GCS Storage Verification**
  - **Validates: Requirements 3.4, 3.5, 3.6, 4.1, 4.2, 4.3, 4.4, 4.5**

- [ ] 8. Checkpoint - Ensure image processing works
  - Ensure all tests pass, ask the user if questions arise.

- [ ] 9. Create image processing API endpoint
  - [ ] 9.1 Create POST /api/images/process route handler
    - Create `src/app/api/images/process/route.ts`
    - Accept vehicleImageId and imageType in request body
    - Validate request parameters
    - Call ImageProcessorService
    - Return processing result
    - _Requirements: 3.1, 3.6, 3.7_

- [ ]* 9.2 Write integration tests for processing endpoint
  - Test successful processing flow
  - Test error handling for invalid inputs
  - Test gallery image skipping
  - _Requirements: 3.1, 3.6, 3.7_

- [ ] 10. Implement CSV generator service
  - [ ] 10.1 Create CSVGeneratorService class
    - Create `src/lib/services/csv-generator-service.ts`
    - Implement `generateFeed()` main method
    - Implement `fetchVehiclesWithOptimizedImages()` query
    - Implement `buildImageUrlWithCacheBuster()` for versioning
    - Implement `escapeCSVField()` for proper CSV formatting
    - Implement `formatCSVRow()` for row generation
    - _Requirements: 5.2, 5.3, 5.4, 5.5, 6.1, 6.2, 6.3, 8.1, 8.2, 8.3, 8.5_

- [ ]* 10.2 Write property tests for CSV generation
  - **Property 8: CSV Feed Includes Only Optimized Vehicles**
  - **Property 9: CSV Structure Compliance**
  - **Property 10: Multiple Image URL Concatenation**
  - **Property 11: Absolute URL Format**
  - **Property 12: CSV Field Escaping**
  - **Property 13: CSV Line Terminator Format**
  - **Property 14: Cache Buster URL Format**
  - **Property 15: Timestamp Update on Image Modification**
  - **Property 16: Feed URL Idempotence**
  - **Validates: Requirements 5.2, 5.3, 5.4, 5.5, 6.1, 6.2, 6.3, 6.4, 6.5, 8.1, 8.2, 8.3, 8.4, 8.5**

- [ ] 11. Create API key authenticator
  - [ ] 11.1 Implement APIKeyAuthenticator class
    - Create `src/lib/services/api-key-authenticator.ts`
    - Implement `authenticate()` method
    - Implement `constantTimeCompare()` for secure comparison
    - Return authentication result with error messages
    - _Requirements: 7.1, 7.2, 7.3, 7.4, 7.6, 7.7_

- [ ]* 11.2 Write property tests for authentication
  - **Property 17: API Key Authentication Requirement**
  - **Property 18: Valid API Key Grants Access**
  - **Property 19: Authentication Error Response Format**
  - **Validates: Requirements 7.1, 7.4, 7.7**

- [ ]* 11.3 Write unit tests for authentication edge cases
  - Test missing API key (401)
  - Test invalid API key (403)
  - Test valid API key (200)
  - _Requirements: 7.2, 7.3_

- [ ] 12. Create CSV feed API endpoint
  - [ ] 12.1 Create GET /api/inventory/feed.csv route handler
    - Create `src/app/api/inventory/feed.csv/route.ts`
    - Extract API key from query parameter
    - Call APIKeyAuthenticator
    - Call CSVGeneratorService on successful auth
    - Set proper response headers (Content-Type, Content-Disposition)
    - Return CSV content or error response
    - _Requirements: 5.1, 5.6, 5.7, 5.8, 7.1, 7.2, 7.3, 7.4, 7.7_

- [ ]* 12.2 Write integration tests for CSV feed endpoint
  - Test successful feed generation with valid API key
  - Test 401 response without API key
  - Test 403 response with invalid API key
  - Test empty feed when no optimized images exist
  - Test proper CSV headers
  - _Requirements: 5.1, 5.6, 5.7, 5.8, 7.2, 7.3, 8.6_

- [ ] 13. Checkpoint - Ensure CSV feed endpoint works
  - Ensure all tests pass, ask the user if questions arise.

- [ ] 14. Implement error logging
  - [ ] 14.1 Create logging utility
    - Create `src/lib/utils/logger.ts`
    - Implement structured logging with context
    - Support different log levels (info, warn, error, debug)
    - Include operation type, IDs, timestamps in logs
    - _Requirements: 11.1, 11.2, 11.3, 11.6, 11.7_

  - [ ] 14.2 Add logging to all services
    - Add error logging to ImageProcessorService
    - Add error logging to CSVGeneratorService
    - Add error logging to APIKeyAuthenticator
    - Add error logging to ImageValidator
    - Ensure no sensitive data in logs
    - _Requirements: 11.1, 11.2, 11.3, 11.5, 11.6, 11.7_

- [ ]* 14.3 Write property tests for error logging
  - **Property 20: Error Logging Contains Context**
  - **Property 21: Error Responses Hide Sensitive Data**
  - **Validates: Requirements 11.1, 11.2, 11.3, 11.5, 11.6, 11.7**

- [ ] 15. Update vehicle creation forms to include VIN
  - [ ] 15.1 Update AddVehicleModal component
    - Add VIN input field to form
    - Add VIN validation on client side
    - Display validation errors
    - _Requirements: 1.2, 1.3, 1.4_

  - [ ] 15.2 Update vehicle creation API
    - Update POST /api/vehicles endpoint to require VIN
    - Validate VIN using VIN validator
    - Return validation errors
    - _Requirements: 1.2, 1.3, 1.4_

  - [ ] 15.3 Update vehicle edit forms
    - Add VIN field to edit page
    - Allow VIN updates with validation
    - _Requirements: 1.2, 1.3, 1.4_

- [ ] 16. Create infrastructure setup documentation
  - [ ] 16.1 Create CLOUD_SETUP_GUIDE.md
    - Document Google Cloud project setup
    - Document GCS bucket creation and configuration
    - Document service account creation and key generation
    - Document Google AI API setup (Vertex AI or Gemini)
    - Document environment variable configuration
    - Include test scripts for verifying setup
    - Include troubleshooting section
    - _Requirements: 10.1, 10.2, 10.3, 10.4, 10.5, 10.6, 10.7_

- [ ] 17. Final integration testing
  - [ ] 17.1 Test end-to-end flow
    - Create vehicle with VIN
    - Upload 6 key images
    - Trigger image processing
    - Verify optimized images in GCS
    - Verify database updates
    - Generate CSV feed with API key
    - Verify CSV contains correct data with cache-busted URLs
    - _Requirements: All_

- [ ]* 17.2 Test error scenarios
  - Test AI API failure handling
  - Test GCS upload failure handling
  - Test database failure handling
  - Test invalid authentication
  - _Requirements: 3.6, 3.8, 7.2, 7.3, 11.4_

- [ ] 18. Final checkpoint - Complete feature
  - Ensure all tests pass, ask the user if questions arise.

## Notes

- Tasks marked with `*` are optional and can be skipped for faster MVP
- Each task references specific requirements for traceability
- Property tests validate universal correctness properties
- Unit tests validate specific examples and edge cases
- Integration tests validate end-to-end flows
- The implementation follows an incremental approach: schema → validation → storage → processing → feed → auth
- Google AI API setup requires careful configuration - refer to CLOUD_SETUP_GUIDE.md
- Only 6 key image types are processed (FRONT_QUARTER, FRONT, BACK_QUARTER, BACK, DRIVER_SIDE, PASSENGER_SIDE)
- Gallery images are NOT processed by AI
