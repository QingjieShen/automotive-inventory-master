# Requirements Document

## Introduction

The Mark Motors Group (MMG) Vehicle Inventory Hero Image Background Removal Tool is an internal web application designed to streamline the management and processing of vehicle inventory photos across 9 dealership locations. The system provides role-based access for Photographers and Admins to upload, organize, and process vehicle images with automated background removal capabilities using Gemini Nano Banana 25 flash technology.

## Glossary

- **System**: The Vehicle Inventory Hero Image Background Removal Tool
- **User**: Any authenticated person using the system (Photographer or Admin)
- **Admin**: User with elevated privileges including deletion and reprocessing capabilities
- **Photographer**: Standard user with basic photo management capabilities
- **Vehicle_Record**: A database entry containing vehicle information and associated photos
- **Key_Images**: The 6 standardized vehicle photos (Front Quarter, Front, Back Quarter, Back, Driver Side Profile, Passenger Side Profile)
- **Gallery_Images**: Additional non-standardized vehicle photos beyond the 6 key images
- **Processing_Status**: Current state of background removal processing (In Progress, Finished, Error)
- **Store**: One of the 9 MMG dealership locations
- **Stock_Number**: Unique identifier for each vehicle in inventory

## Requirements

### Requirement 1: User Authentication and Authorization

**User Story:** As a system administrator, I want secure user authentication with role-based access, so that only authorized personnel can access the vehicle inventory management system.

#### Acceptance Criteria

1. WHEN a user visits the application, THE System SHALL display a login page with MMG logo and login form
2. WHEN a user enters valid credentials, THE System SHALL authenticate the user and redirect to store selection
3. WHEN a user enters invalid credentials, THE System SHALL display an error message and remain on login page
4. THE System SHALL support two user roles: Photographer and Admin with different permission levels
5. WHEN an unauthenticated user attempts to access protected pages, THE System SHALL redirect to login page

### Requirement 2: Store Selection and Management

**User Story:** As an authenticated user, I want to select from the 9 MMG store locations, so that I can manage inventory specific to my assigned dealership.

#### Acceptance Criteria

1. WHEN a user successfully logs in, THE System SHALL display a store selection interface showing all 9 MMG locations
2. WHEN a user selects a store, THE System SHALL load the vehicle inventory for that specific location
3. THE System SHALL display store information including name and address for each location
4. WHEN a user switches stores, THE System SHALL update the inventory view to show the selected store's vehicles

### Requirement 3: Vehicle Inventory Display and Management

**User Story:** As a user, I want to view and manage vehicle inventory in a structured list format, so that I can efficiently track photo processing status and vehicle information.

#### Acceptance Criteria

1. WHEN viewing the home page, THE System SHALL display vehicles sorted by stock number in ascending order
2. WHEN displaying vehicle records, THE System SHALL show stock number, hero image thumbnail, photo count, creation date, and processing status
3. WHEN a user clicks the "+" button, THE System SHALL open a form to add new vehicle information
4. WHERE the user is an Admin, THE System SHALL display checkboxes for vehicle selection and bulk delete functionality
5. WHEN Admin selects vehicles and chooses delete, THE System SHALL remove the selected Vehicle_Records and associated photos
6. THE System SHALL provide search functionality to filter vehicles by stock number

### Requirement 4: Vehicle Detail Page and Image Gallery

**User Story:** As a user, I want to view detailed vehicle information with an organized image gallery, so that I can manage individual vehicle photos effectively.

#### Acceptance Criteria

1. WHEN a user clicks on a vehicle record, THE System SHALL display the vehicle detail page with complete information
2. THE System SHALL organize the image gallery with Key_Images in a specific layout: Front shot in individual row, other 5 shots in two rows
3. THE System SHALL display Gallery_Images in a four-column grid layout on desktop
4. WHEN a user drags and drops photos, THE System SHALL update the photo positions and save the new order
5. WHEN a user hovers over a photo, THE System SHALL display a delete button for that image
6. WHEN a user clicks delete on a photo, THE System SHALL show a confirmation popup before deletion
7. WHERE Processing_Status is not finished, THE System SHALL display process buttons under each Key_Image
8. WHEN a user clicks a process button, THE System SHALL send the photo for background removal processing

### Requirement 5: Image Processing and Background Removal

**User Story:** As a user, I want to process vehicle photos with automated background removal using fixed target backgrounds, so that I can create consistent professional inventory images.

#### Acceptance Criteria

1. WHEN a user initiates photo processing for Key_Images, THE System SHALL send images to Gemini Nano Banana 25 flash with a predefined target background
2. WHEN processing begins, THE System SHALL update Processing_Status to "In Progress"
3. WHEN processing completes successfully, THE System SHALL update Processing_Status to "Finished" and display processed images
4. WHERE the user is an Admin and processing is finished, THE System SHALL allow reprocessing of images
5. WHEN processing fails, THE System SHALL update Processing_Status to "Error" and display appropriate error message
6. THE System SHALL maintain both original and processed versions of each image
7. WHEN processed images are ready, THE System SHALL provide download functionality for further operations
8. THE System SHALL apply background replacement only to the 6 Key_Images, not Gallery_Images

### Requirement 6: Photo Upload and Management

**User Story:** As a user, I want to upload and organize vehicle photos, so that I can maintain comprehensive visual inventory records.

#### Acceptance Criteria

1. WHEN adding a new vehicle, THE System SHALL allow users to upload multiple photos
2. THE System SHALL categorize uploaded photos as either Key_Images or Gallery_Images based on user designation
3. WHEN uploading photos, THE System SHALL validate file formats and size limits
4. THE System SHALL generate thumbnails for efficient gallery display
5. WHEN photos are uploaded, THE System SHALL update the photo count for the vehicle record
6. THE System SHALL preserve original photo metadata including upload timestamp

### Requirement 7: Data Persistence and Storage

**User Story:** As a system administrator, I want reliable data storage for vehicle information and photos, so that inventory data is preserved and accessible.

#### Acceptance Criteria

1. THE System SHALL store vehicle information including stock numbers, creation dates, and processing status
2. THE System SHALL store both original and processed image files with appropriate file organization
3. WHEN data is modified, THE System SHALL immediately persist changes to the database
4. THE System SHALL maintain referential integrity between vehicles, stores, and associated photos
5. THE System SHALL implement backup and recovery procedures for critical inventory data

### Requirement 8: User Interface and Responsive Design

**User Story:** As a user, I want an intuitive and responsive interface, so that I can efficiently manage vehicle inventory across different devices.

#### Acceptance Criteria

1. THE System SHALL provide a responsive design that works on desktop and tablet devices
2. WHEN displaying on desktop, THE System SHALL use the specified layout with proper spacing and organization
3. THE System SHALL maintain consistent branding with MMG logo and color scheme
4. WHEN users interact with interface elements, THE System SHALL provide immediate visual feedback
5. THE System SHALL ensure accessibility compliance for users with disabilities