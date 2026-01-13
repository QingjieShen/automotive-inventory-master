# Requirements Document

## Introduction

This document specifies the requirements for integrating with CDK One-Eighty DMS (Dealer Management System) by providing a CSV feed that One-Eighty can poll to retrieve vehicle inventory data with optimized image URLs. The system must handle image processing workflows, generate dynamic CSV feeds, implement URL versioning for cache invalidation, and secure the feed with API key authentication.

## Glossary

- **CDK_One_Eighty**: A third-party automotive Dealer Management System that polls CSV feeds to retrieve vehicle inventory data
- **CSV_Feed**: A dynamically generated comma-separated values file containing vehicle inventory data and image URLs
- **Optimized_Image**: A processed vehicle image that has undergone background removal and enhancement via AI
- **Raw_Image**: An unprocessed JPG or PNG vehicle photo uploaded by a photographer (not RAW camera format)
- **Image_Processor**: The system component responsible for processing raw images into optimized images using AI services
- **Image_Processor**: The system component responsible for processing raw images into optimized images
- **Feed_Generator**: The system component that generates the CSV feed for CDK One-Eighty
- **Cache_Buster**: A timestamp-based query parameter appended to image URLs to force re-downloading
- **API_Key**: A secret token used to authenticate requests to the CSV feed endpoint
- **VIN**: Vehicle Identification Number, a unique 17-character identifier for vehicles
- **Stock_Number**: A dealer-assigned identifier for a vehicle in inventory

## Requirements

### Requirement 1: VIN Field Addition

**User Story:** As a system administrator, I want VIN to be a mandatory field for all vehicles, so that we can uniquely identify vehicles in the CDK One-Eighty feed.

#### Acceptance Criteria

1. THE Vehicle_Model SHALL include a VIN field as a required string property
2. WHEN creating a new vehicle, THE System SHALL validate that the VIN field is not empty
3. WHEN creating a new vehicle, THE System SHALL validate that the VIN is exactly 17 characters
4. WHEN a VIN validation fails, THE System SHALL return a descriptive error message
5. THE Database_Schema SHALL be updated to include the VIN column with NOT NULL constraint

### Requirement 2: Image Upload Validation

**User Story:** As a system administrator, I want to restrict image uploads to specific formats and sizes, so that we maintain system performance and compatibility.

#### Acceptance Criteria

1. WHEN an image is uploaded, THE System SHALL validate that the file format is JPG or PNG
2. WHEN an image is uploaded, THE System SHALL validate that the file size does not exceed 4MB
3. WHEN an image fails format validation, THE System SHALL return an error message indicating accepted formats
4. WHEN an image fails size validation, THE System SHALL return an error message indicating the maximum size
5. WHEN validation passes, THE System SHALL accept the image for storage

### Requirement 3: Image Processing Workflow

**User Story:** As a photographer, I want my uploaded images to be automatically processed with AI, so that optimized images with background removal and enhancements are available for the DMS feed.

#### Acceptance Criteria

1. WHEN a validated image is uploaded, THE Image_Processor SHALL accept the image file and vehicle identifier
2. WHEN processing an image, THE Image_Processor SHALL use Google Cloud Storage to store the image
3. WHEN processing an image, THE Image_Processor SHALL use an AI API for background removal and enhancement
4. WHEN processing completes successfully, THE Image_Processor SHALL store the optimized image URL in the database
5. WHEN processing completes successfully, THE Image_Processor SHALL record a processing timestamp
6. IF processing fails, THEN THE Image_Processor SHALL log the error and return a failure status
7. THE Image_Processor SHALL be implemented as either a Server Action or Route Handler
8. WHEN the AI API is unavailable, THE Image_Processor SHALL handle the error gracefully

### Requirement 4: Image Metadata Tracking

**User Story:** As a developer, I want to track which images are processed and ready for the DMS feed, so that the CSV feed can include only optimized vehicles.

#### Acceptance Criteria

1. THE System SHALL distinguish between raw uploaded images and AI-processed optimized images
2. WHEN an image is first uploaded, THE System SHALL mark it as unprocessed
3. WHEN AI processing completes, THE System SHALL mark the image as optimized
4. THE System SHALL store both raw and optimized image URLs
5. THE System SHALL track processing timestamps for debugging and monitoring

### Requirement 5: CSV Feed Generation

**User Story:** As CDK One-Eighty, I want to poll a CSV feed endpoint, so that I can retrieve current vehicle inventory with optimized image URLs.

#### Acceptance Criteria

1. THE Feed_Generator SHALL expose a GET endpoint at /api/inventory/feed.csv
2. WHEN the endpoint is requested, THE Feed_Generator SHALL query all vehicles that have optimized images
3. WHEN generating the CSV, THE Feed_Generator SHALL include columns: VIN, StockNumber, ImageURLs
4. WHEN a vehicle has multiple optimized images, THE Feed_Generator SHALL concatenate URLs with pipe (|) separator
5. THE Feed_Generator SHALL return absolute URLs for all optimized images
6. THE Feed_Generator SHALL set Content-Type header to text/csv
7. THE Feed_Generator SHALL set Content-Disposition header to attachment with filename "inventory-feed.csv"
8. WHEN no vehicles have optimized images, THE Feed_Generator SHALL return a CSV with headers only

### Requirement 6: URL Cache Busting

**User Story:** As CDK One-Eighty, I want image URLs to change when images are updated, so that I can detect and re-download updated images.

#### Acceptance Criteria

1. WHEN generating image URLs for the CSV feed, THE Feed_Generator SHALL append a version query parameter
2. THE Feed_Generator SHALL use the image's last updated timestamp as the version value
3. THE Feed_Generator SHALL format the version parameter as ?v={unix_timestamp}
4. WHEN an image is updated, THE System SHALL update the image's timestamp in the database
5. WHEN the same image is included in multiple feed requests without updates, THE Feed_Generator SHALL generate identical URLs

### Requirement 7: API Key Authentication

**User Story:** As a system administrator, I want the CSV feed to require API key authentication, so that unauthorized parties cannot access our inventory data.

#### Acceptance Criteria

1. THE Feed_Generator SHALL require an API key via query parameter named "key"
2. WHEN a request is made without the key parameter, THE Feed_Generator SHALL return HTTP 401 Unauthorized
3. WHEN a request is made with an invalid key, THE Feed_Generator SHALL return HTTP 403 Forbidden
4. WHEN a request is made with a valid key, THE Feed_Generator SHALL process the request normally
5. THE System SHALL store the valid API key in environment variables
6. THE Feed_Generator SHALL compare the provided key with the stored key using constant-time comparison
7. WHEN authentication fails, THE Feed_Generator SHALL return a JSON error response with appropriate message

### Requirement 8: CSV Format Compliance

**User Story:** As CDK One-Eighty, I want the CSV feed to follow standard CSV formatting rules, so that I can reliably parse the data.

#### Acceptance Criteria

1. THE Feed_Generator SHALL use comma (,) as the field delimiter
2. THE Feed_Generator SHALL use double quotes (") to escape fields containing commas or quotes
3. WHEN a field contains a double quote, THE Feed_Generator SHALL escape it by doubling ("")
4. THE Feed_Generator SHALL include a header row with column names
5. THE Feed_Generator SHALL use CRLF (\r\n) as the line terminator
6. THE Feed_Generator SHALL encode the CSV content as UTF-8

### Requirement 9: Database Schema Updates

**User Story:** As a developer, I want the database schema to support optimized image tracking, so that the system can distinguish between raw and processed images.

#### Acceptance Criteria

1. THE Vehicle_Model SHALL include a VIN field as a required string property
2. THE Vehicle_Image_Model SHALL include an isOptimized boolean field
3. THE Vehicle_Image_Model SHALL include a processedAt timestamp field
4. THE Vehicle_Image_Model SHALL include an updatedAt timestamp field for cache busting
5. WHEN an image is first uploaded, THE System SHALL set isOptimized to false
6. WHEN image processing completes, THE System SHALL set isOptimized to true and record processedAt timestamp
7. WHEN an image is updated, THE System SHALL update the updatedAt timestamp

### Requirement 10: Cloud Infrastructure Setup

**User Story:** As a developer, I want clear documentation for setting up Google Cloud Storage and AI API, so that I can configure the required cloud infrastructure.

#### Acceptance Criteria

1. THE System SHALL provide documentation for creating a Google Cloud Platform project
2. THE System SHALL provide documentation for setting up Google Cloud Storage buckets
3. THE System SHALL provide documentation for configuring Google Cloud Storage authentication
4. THE System SHALL provide documentation for selecting and configuring an AI API for image processing
5. THE System SHALL provide documentation for storing API credentials securely in environment variables
6. THE System SHALL provide documentation for testing the cloud infrastructure setup
7. THE Documentation SHALL include step-by-step instructions with screenshots or code examples

### Requirement 11: Error Handling and Logging

**User Story:** As a system administrator, I want comprehensive error handling and logging, so that I can troubleshoot integration issues.

#### Acceptance Criteria

1. WHEN the CSV feed generation fails, THE System SHALL log the error with context
2. WHEN image processing fails, THE System SHALL log the error with vehicle and image identifiers
3. WHEN authentication fails, THE System SHALL log the failed attempt with timestamp
4. IF the database query fails, THEN THE Feed_Generator SHALL return HTTP 500 Internal Server Error
5. THE System SHALL not expose sensitive information in error responses
6. WHEN image validation fails, THE System SHALL log the validation error with file details
7. WHEN cloud storage operations fail, THE System SHALL log the error with operation details
