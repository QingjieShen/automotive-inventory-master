# Requirements Document

## Introduction

This specification defines enhancements to the Mark Motors Group (MMG) Vehicle Inventory Hero Image Background Removal Tool. The enhancements include migrating from AWS to Google Cloud infrastructure, improving the store selection interface with visual backgrounds, adding navigation capabilities, converting the add vehicle modal to a dedicated page, and introducing a Super Admin role for store management.

## Glossary

- **System**: The Vehicle Inventory Hero Image Background Removal Tool
- **User**: Any authenticated person using the system (Photographer, Admin, or Super_Admin)
- **Admin**: User with elevated privileges including deletion and reprocessing capabilities
- **Photographer**: Standard user with basic photo management capabilities
- **Super_Admin**: User with highest privileges including store management (add, edit, delete stores)
- **Store**: One of the MMG dealership locations
- **Store_Card**: Visual representation of a store in the store selection interface
- **Navigation_Banner**: Header component providing navigation controls across the application
- **Database**: Google Cloud SQL database for storing application data
- **Storage**: Google Cloud Storage for storing vehicle images
- **Add_Vehicle_Page**: Dedicated page for creating new vehicle records

## Requirements

### Requirement 1: Google Cloud Infrastructure Migration

**User Story:** As a system administrator, I want to migrate from AWS to Google Cloud infrastructure, so that we can leverage Google's database and storage services.

#### Acceptance Criteria

1. THE System SHALL use Google Cloud SQL as the primary database instead of AWS RDS
2. THE System SHALL use Google Cloud Storage for storing vehicle images instead of AWS S3
3. WHEN the system stores or retrieves data, THE System SHALL use Google Cloud APIs and SDKs
4. THE System SHALL maintain all existing data integrity and relationships during migration
5. THE System SHALL preserve all existing functionality while using Google Cloud services
6. WHEN images are uploaded, THE System SHALL store them in Google Cloud Storage buckets
7. THE System SHALL configure appropriate access controls and permissions for Google Cloud resources

### Requirement 2: Store Card Background Images

**User Story:** As a user, I want to see each store's picture as the background of its store card, so that I can visually identify stores more easily.

#### Acceptance Criteria

1. WHEN displaying the store selection page, THE System SHALL show each Store_Card with its associated store image as the background
2. THE System SHALL overlay store information (name, address) on top of the background image with appropriate contrast
3. WHEN a store image is not available, THE System SHALL display a default placeholder background
4. THE System SHALL ensure text remains readable against all background images using overlay techniques
5. THE System SHALL maintain responsive design so Store_Cards display properly on different screen sizes
6. WHEN a user hovers over a Store_Card, THE System SHALL provide visual feedback indicating interactivity

### Requirement 3: Navigation Banner

**User Story:** As a user, I want a navigation banner that allows me to return to the store list, so that I can easily switch between stores without using browser navigation.

#### Acceptance Criteria

1. THE System SHALL display a Navigation_Banner at the top of all pages after store selection
2. WHEN a user is viewing vehicle inventory or vehicle details, THE Navigation_Banner SHALL include a button to return to store selection
3. WHEN a user clicks the store list button, THE System SHALL navigate to the store selection page
4. THE Navigation_Banner SHALL display the current store name when viewing store-specific content
5. THE Navigation_Banner SHALL include the MMG logo and maintain consistent branding
6. THE Navigation_Banner SHALL remain fixed at the top of the page during scrolling
7. THE Navigation_Banner SHALL be responsive and adapt to different screen sizes

### Requirement 4: Add Vehicle as Dedicated Page

**User Story:** As a user, I want to add new vehicles on a dedicated page instead of a modal popup, so that I have more space to enter information and upload photos.

#### Acceptance Criteria

1. WHEN a user clicks the add vehicle button, THE System SHALL navigate to a dedicated Add_Vehicle_Page
2. THE Add_Vehicle_Page SHALL provide a full-page form with ample space for vehicle information entry
3. THE Add_Vehicle_Page SHALL include expanded photo upload areas for both Key_Images and Gallery_Images
4. WHEN a user submits the form, THE System SHALL create the vehicle record and navigate to the vehicle detail page
5. WHEN a user cancels or clicks back, THE System SHALL return to the vehicle inventory list
6. THE Add_Vehicle_Page SHALL display clear section headers for different types of information
7. THE Add_Vehicle_Page SHALL provide real-time validation feedback for required fields
8. THE Add_Vehicle_Page SHALL allow drag-and-drop photo uploads with preview functionality

### Requirement 5: Super Admin Role and Store Management

**User Story:** As a Super Admin, I want to add, edit, and delete stores, so that I can manage the dealership locations in the system.

#### Acceptance Criteria

1. THE System SHALL support a Super_Admin role with store management privileges
2. WHERE the user is a Super_Admin, THE System SHALL display a store management interface
3. WHEN a Super_Admin accesses store management, THE System SHALL display a list of all existing stores
4. WHEN a Super_Admin clicks add store, THE System SHALL provide a form to create a new store with name, address, and image
5. WHEN a Super_Admin clicks edit on a store, THE System SHALL allow modification of store name, address, and image
6. WHEN a Super_Admin clicks delete on a store, THE System SHALL show a confirmation dialog before deletion
7. IF a store has associated vehicles, THEN THE System SHALL prevent deletion and display an appropriate warning message
8. WHEN a Super_Admin saves store changes, THE System SHALL validate required fields and update the database
9. THE System SHALL log all store management actions for audit purposes
10. WHERE the user is not a Super_Admin, THE System SHALL hide store management functionality

