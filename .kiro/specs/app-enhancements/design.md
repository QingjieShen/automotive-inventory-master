# Design Document: App Enhancements

## Overview

This design document outlines the technical approach for enhancing the MMG Vehicle Inventory Tool with five major improvements: migrating from AWS to Google Cloud infrastructure, adding visual backgrounds to store cards, implementing a navigation banner, converting the add vehicle modal to a dedicated page, and introducing a Super Admin role for store management.

The enhancements maintain backward compatibility with existing functionality while improving user experience and administrative capabilities. The migration to Google Cloud will leverage Cloud SQL for database operations and Cloud Storage for image management, replacing the current AWS RDS and S3 implementation.

## Architecture

### High-Level Architecture

The application maintains its Next.js 16 architecture with the following infrastructure changes:

```
┌─────────────────────────────────────────────────────────┐
│                    Next.js Frontend                      │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐ │
│  │ Store Cards  │  │ Nav Banner   │  │ Add Vehicle  │ │
│  │ (w/ images)  │  │              │  │ Page         │ │
│  └──────────────┘  └──────────────┘  └──────────────┘ │
└─────────────────────────────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────┐
│                   Next.js API Routes                     │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐ │
│  │ /api/stores  │  │ /api/vehicles│  │ /api/storage │ │
│  │ (CRUD)       │  │              │  │              │ │
│  └──────────────┘  └──────────────┘  └──────────────┘ │
└─────────────────────────────────────────────────────────┘
                          │
          ┌───────────────┴───────────────┐
          ▼                               ▼
┌──────────────────────┐      ┌──────────────────────┐
│  Google Cloud SQL    │      │ Google Cloud Storage │
│  (PostgreSQL)        │      │  (Image Buckets)     │
│  - Users             │      │  - Vehicle Images    │
│  - Stores            │      │  - Store Images      │
│  - Vehicles          │      │  - Thumbnails        │
│  - Images metadata   │      └──────────────────────┘
└──────────────────────┘
```

### Technology Stack Updates

**Current Stack (Unchanged):**
- Next.js 16.1.1 with App Router
- React 19.2.3
- TypeScript 5
- Prisma 6.19.1 ORM
- NextAuth 4.24.13 for authentication
- TailwindCSS 4 for styling

**Infrastructure Changes:**
- **Database:** AWS RDS PostgreSQL → Google Cloud SQL PostgreSQL
- **Storage:** AWS S3 + CloudFront → Google Cloud Storage + Cloud CDN
- **SDK:** @aws-sdk → @google-cloud/storage

## Components and Interfaces

### 1. Google Cloud Storage Service

Replace the existing `src/lib/s3.ts` with a new `src/lib/gcs.ts` (Google Cloud Storage) module.

**Interface:**

```typescript
// src/lib/gcs.ts

import { Storage, Bucket } from '@google-cloud/storage';

interface UploadResult {
  publicUrl: string;
  thumbnailUrl: string;
  path: string;
  size: number;
  contentType: string;
}

interface GCSUploadOptions {
  vehicleId: string;
  storeId: string;
  imageType: 'original' | 'processed' | 'thumbnail' | 'store';
  contentType: string;
  buffer: Buffer;
  originalName?: string;
}

class GoogleCloudStorageService {
  private storage: Storage;
  private bucket: Bucket;
  private cdnDomain?: string;

  constructor();
  
  // Core upload/delete operations
  uploadFile(options: GCSUploadOptions): Promise<UploadResult>;
  deleteFile(path: string): Promise<void>;
  
  // Helper methods
  generatePath(storeId: string, vehicleId: string, imageType: string, extension: string): string;
  getPublicUrl(path: string): string;
  createThumbnail(buffer: Buffer, contentType: string, maxWidth: number, maxHeight: number): Promise<Buffer>;
  
  // Batch operations
  batchUpload(files: Array<{buffer: Buffer, contentType: string, originalName: string}>, vehicleId: string, storeId: string): Promise<UploadResult[]>;
}

export const gcsService = new GoogleCloudStorageService();
```

**Implementation Details:**
- Initialize Google Cloud Storage client with service account credentials from environment variables
- Use bucket name from `GOOGLE_CLOUD_STORAGE_BUCKET` environment variable
- Generate organized paths: `stores/{storeId}/vehicles/{vehicleId}/{imageType}/{uuid}_{timestamp}.{ext}`
- For store images: `stores/{storeId}/store-image.{ext}`
- Support public URLs with optional Cloud CDN domain
- Implement signed URLs for temporary access if needed

### 2. Store Card with Background Image

Enhance the existing `StoreCard` component to display store images as backgrounds.

**Interface:**

```typescript
// src/components/stores/StoreCard.tsx

interface StoreCardProps {
  store: Store;
  onSelect: (store: Store) => void;
}

interface Store {
  id: string;
  name: string;
  address: string;
  brandLogos: string[];
  imageUrl?: string; // New field for store background image
}
```

**Implementation Details:**
- Use CSS `background-image` with the store's `imageUrl`
- Apply dark overlay (rgba(0, 0, 0, 0.4)) to ensure text readability
- Use white text with text-shadow for better contrast
- Fallback to gradient background if no image is provided
- Maintain existing hover and focus states
- Ensure responsive design with proper image sizing (background-size: cover)

**CSS Structure:**
```css
.store-card {
  background-image: linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.5)), url(store-image);
  background-size: cover;
  background-position: center;
}
```

### 3. Navigation Banner Component

Create a new reusable navigation banner component.

**Interface:**

```typescript
// src/components/common/NavigationBanner.tsx

interface NavigationBannerProps {
  currentStore?: Store;
  showBackToStores?: boolean;
  onBackToStores?: () => void;
}

export function NavigationBanner(props: NavigationBannerProps): JSX.Element;
```

**Implementation Details:**
- Fixed position at top of viewport (sticky header)
- Display MMG logo on the left
- Show current store name in the center (if provided)
- "Back to Stores" button on the right (if showBackToStores is true)
- Responsive design: collapse to hamburger menu on mobile
- Z-index: 50 to stay above other content
- Height: 64px (h-16 in Tailwind)
- Background: white with bottom border shadow

**Layout:**
```
┌────────────────────────────────────────────────────────┐
│ [MMG Logo]    Current Store Name    [Back to Stores]   │
└────────────────────────────────────────────────────────┘
```

### 4. Add Vehicle Page

Convert the modal to a full-page route at `/vehicles/new`.

**Route Structure:**
```
src/app/vehicles/new/page.tsx
```

**Interface:**

```typescript
// src/app/vehicles/new/page.tsx

interface AddVehiclePageProps {
  searchParams: { storeId?: string };
}

export default function AddVehiclePage(props: AddVehiclePageProps): JSX.Element;
```

**Implementation Details:**
- Full-page layout with NavigationBanner at top
- Two-column layout on desktop, single column on mobile
- Left column: Vehicle information form (stock number, store selection)
- Right column: Photo upload sections
  - Key Images section (6 specific shots)
  - Gallery Images section (additional photos)
- Drag-and-drop photo upload with preview
- Real-time validation feedback
- Submit button creates vehicle and uploads all photos
- Cancel button navigates back to vehicle list
- Use Next.js router for navigation
- Preserve form state if user navigates away (optional enhancement)

**Layout Structure:**
```
┌─────────────────────────────────────────────────────┐
│              Navigation Banner                       │
├─────────────────────────────────────────────────────┤
│                                                      │
│  ┌──────────────────┐  ┌──────────────────────┐   │
│  │ Vehicle Info     │  │ Key Images Upload    │   │
│  │ - Stock Number   │  │ (6 specific shots)   │   │
│  │ - Store          │  │                      │   │
│  │                  │  │ Gallery Images       │   │
│  │                  │  │ (additional photos)  │   │
│  └──────────────────┘  └──────────────────────┘   │
│                                                      │
│  [Cancel]                          [Create Vehicle] │
└─────────────────────────────────────────────────────┘
```

### 5. Super Admin Role and Store Management

Extend the authentication system and add store management capabilities.

**Database Schema Changes:**

```prisma
// prisma/schema.prisma

enum UserRole {
  PHOTOGRAPHER
  ADMIN
  SUPER_ADMIN  // New role
}

model Store {
  id         String    @id @default(cuid())
  name       String
  address    String
  brandLogos String[]
  imageUrl   String?   // New field for store background image
  vehicles   Vehicle[]
  createdAt  DateTime  @default(now())
  updatedAt  DateTime  @updatedAt

  @@map("stores")
}
```

**API Routes:**

```typescript
// src/app/api/stores/route.ts
// GET /api/stores - List all stores (existing)
// POST /api/stores - Create new store (new, Super Admin only)

// src/app/api/stores/[id]/route.ts
// GET /api/stores/[id] - Get store details (existing)
// PUT /api/stores/[id] - Update store (new, Super Admin only)
// DELETE /api/stores/[id] - Delete store (new, Super Admin only)
```

**Store Management Page:**

```typescript
// src/app/admin/stores/page.tsx

interface StoreManagementPageProps {}

export default function StoreManagementPage(): JSX.Element;
```

**Implementation Details:**
- Accessible only to Super Admin users (role guard)
- Table view of all stores with edit/delete actions
- "Add Store" button opens form modal or navigates to new page
- Store form fields:
  - Name (required)
  - Address (required)
  - Brand logos (multi-select or comma-separated)
  - Store image upload (optional)
- Delete confirmation dialog
- Prevent deletion if store has associated vehicles
- Audit logging for all store management actions

**Authorization Middleware:**

```typescript
// src/lib/auth.ts

export function requireSuperAdmin(handler: NextApiHandler): NextApiHandler {
  return async (req, res) => {
    const session = await getServerSession(req, res, authOptions);
    
    if (!session || session.user.role !== 'SUPER_ADMIN') {
      return res.status(403).json({ error: 'Forbidden: Super Admin access required' });
    }
    
    return handler(req, res);
  };
}
```

## Data Models

### Updated Store Model

```typescript
interface Store {
  id: string;
  name: string;
  address: string;
  brandLogos: string[];
  imageUrl?: string;  // New: URL to store background image in GCS
  createdAt: Date;
  updatedAt: Date;
}
```

### Updated User Model

```typescript
interface User {
  id: string;
  email: string;
  passwordHash: string;
  role: 'PHOTOGRAPHER' | 'ADMIN' | 'SUPER_ADMIN';  // Extended enum
  name: string;
  createdAt: Date;
  updatedAt: Date;
}
```

### Storage Path Structure

```
Google Cloud Storage Bucket Structure:
/
├── stores/
│   ├── {storeId}/
│   │   ├── store-image.jpg              # Store background image
│   │   └── vehicles/
│   │       └── {vehicleId}/
│   │           ├── original/
│   │           │   └── {uuid}_{timestamp}.jpg
│   │           ├── processed/
│   │           │   └── {uuid}_{timestamp}.jpg
│   │           └── thumbnail/
│   │               └── {uuid}_{timestamp}.jpg
```

## Correctness Properties

*A property is a characteristic or behavior that should hold true across all valid executions of a system—essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.*

### Property 1: Google Cloud Storage Upload Consistency

*For any* valid image file and upload parameters (vehicleId, storeId, imageType), uploading to Google Cloud Storage should return a valid public URL that can be accessed and the file should be retrievable from that URL.

**Validates: Requirements 1.3, 1.6**

### Property 2: Store Image Display Fallback

*For any* store record, if the store has no imageUrl or the imageUrl is invalid, the StoreCard component should display a default gradient background without throwing errors.

**Validates: Requirements 2.3**

### Property 3: Navigation Banner Visibility

*For any* page after store selection (vehicle list, vehicle detail, add vehicle), the Navigation Banner should be rendered and visible at the top of the page.

**Validates: Requirements 3.1, 3.2**

### Property 4: Add Vehicle Page Form Validation

*For any* form submission on the Add Vehicle Page, if the stock number field is empty or contains only whitespace, the form should not submit and should display a validation error.

**Validates: Requirements 4.7**

### Property 5: Super Admin Store Creation

*For any* valid store data (name, address), when a Super Admin creates a store, the store should be persisted to the database and appear in the store list immediately.

**Validates: Requirements 5.4, 5.8**

### Property 6: Super Admin Authorization

*For any* store management API endpoint (POST, PUT, DELETE /api/stores), if the requesting user is not a Super Admin, the request should be rejected with a 403 Forbidden status.

**Validates: Requirements 5.10**

### Property 7: Store Deletion Protection

*For any* store that has one or more associated vehicles, attempting to delete that store should fail with an appropriate error message indicating the store cannot be deleted.

**Validates: Requirements 5.7**

### Property 8: Image Path Generation Uniqueness

*For any* two consecutive uploads to Google Cloud Storage, the generated paths should be unique (no collisions) even if uploaded for the same vehicle and image type.

**Validates: Requirements 1.6**

### Property 9: Navigation Back to Stores

*For any* page displaying the Navigation Banner with the "Back to Stores" button, clicking that button should navigate the user to the store selection page.

**Validates: Requirements 3.3**

### Property 10: Add Vehicle Page Photo Upload

*For any* set of uploaded photos on the Add Vehicle Page, when the form is submitted successfully, all uploaded photos should be associated with the newly created vehicle record.

**Validates: Requirements 4.3, 4.8**

### Property 11: Store Card Text Readability

*For any* store with a background image, the store name and address text should have sufficient contrast (via overlay and text styling) to remain readable.

**Validates: Requirements 2.4**

### Property 12: Role-Based Store Management Access

*For any* user with role PHOTOGRAPHER or ADMIN (not SUPER_ADMIN), the store management interface should not be accessible or visible in the navigation.

**Validates: Requirements 5.2, 5.10**

## Error Handling

### Google Cloud Storage Errors

**Upload Failures:**
- Network errors: Retry up to 3 times with exponential backoff
- Authentication errors: Log error and return 500 with message "Storage service unavailable"
- Quota exceeded: Return 507 Insufficient Storage with user-friendly message
- Invalid file type: Return 400 Bad Request with supported formats list

**Delete Failures:**
- File not found: Log warning but return success (idempotent)
- Permission errors: Log error and return 500
- Network errors: Retry up to 3 times

### Store Management Errors

**Store Creation:**
- Duplicate store name: Return 409 Conflict with message
- Missing required fields: Return 400 Bad Request with field validation errors
- Image upload failure: Create store without image, log warning

**Store Deletion:**
- Store has vehicles: Return 409 Conflict with message "Cannot delete store with existing vehicles"
- Store not found: Return 404 Not Found
- Database error: Return 500 Internal Server Error

### Authorization Errors

**Super Admin Access:**
- Non-Super Admin attempting store management: Return 403 Forbidden
- Unauthenticated user: Redirect to login page
- Session expired: Clear session and redirect to login

### Navigation Errors

**Back to Stores:**
- No previous store selection: Navigate to store selection page anyway
- Network error during navigation: Show error toast, allow retry

### Add Vehicle Page Errors

**Form Validation:**
- Empty stock number: Display inline error "Stock number is required"
- Duplicate stock number for store: Return 409 Conflict
- No store selected: Display error "Please select a store"

**Photo Upload:**
- File too large: Display error "File exceeds 10MB limit"
- Invalid file type: Display error "Only JPG, PNG, and WebP images are supported"
- Upload failure: Display error with retry option, allow form submission without photos

## Testing Strategy

### Unit Tests

**Google Cloud Storage Service:**
- Test path generation produces unique paths
- Test public URL generation with and without CDN domain
- Test error handling for upload failures
- Test file deletion (mock GCS client)

**Store Card Component:**
- Test rendering with imageUrl
- Test rendering without imageUrl (fallback)
- Test text contrast with various background images
- Test click and keyboard interactions

**Navigation Banner:**
- Test rendering with and without store context
- Test "Back to Stores" button click
- Test responsive behavior
- Test logo display

**Add Vehicle Page:**
- Test form validation (empty stock number)
- Test photo upload preview
- Test form submission
- Test cancel navigation

**Store Management:**
- Test Super Admin can access store management
- Test non-Super Admin cannot access store management
- Test store creation form validation
- Test store deletion with vehicles (should fail)
- Test store deletion without vehicles (should succeed)

### Property-Based Tests

All property-based tests should run with minimum 100 iterations and use the `fast-check` library.

**Property 1: GCS Upload Consistency**
```typescript
// tests/properties/gcs-upload.properties.test.ts
// Feature: app-enhancements, Property 1: Google Cloud Storage Upload Consistency
// Generate random image buffers and upload parameters
// Verify upload returns valid URL and file is accessible
```

**Property 2: Store Image Fallback**
```typescript
// tests/properties/store-card.properties.test.ts
// Feature: app-enhancements, Property 2: Store Image Display Fallback
// Generate stores with various imageUrl values (valid, invalid, null, undefined)
// Verify component renders without errors
```

**Property 3: Navigation Banner Visibility**
```typescript
// tests/properties/navigation-banner.properties.test.ts
// Feature: app-enhancements, Property 3: Navigation Banner Visibility
// Test banner rendering on various pages
// Verify banner is always present after store selection
```

**Property 4: Form Validation**
```typescript
// tests/properties/add-vehicle-validation.properties.test.ts
// Feature: app-enhancements, Property 4: Add Vehicle Page Form Validation
// Generate various invalid stock numbers (empty, whitespace, special chars)
// Verify form validation prevents submission
```

**Property 5: Super Admin Store Creation**
```typescript
// tests/properties/store-creation.properties.test.ts
// Feature: app-enhancements, Property 5: Super Admin Store Creation
// Generate random valid store data
// Verify store is created and retrievable
```

**Property 6: Super Admin Authorization**
```typescript
// tests/properties/super-admin-auth.properties.test.ts
// Feature: app-enhancements, Property 6: Super Admin Authorization
// Generate requests with various user roles
// Verify only Super Admin can access store management endpoints
```

**Property 7: Store Deletion Protection**
```typescript
// tests/properties/store-deletion.properties.test.ts
// Feature: app-enhancements, Property 7: Store Deletion Protection
// Generate stores with varying numbers of vehicles
// Verify stores with vehicles cannot be deleted
```

**Property 8: Path Uniqueness**
```typescript
// tests/properties/path-generation.properties.test.ts
// Feature: app-enhancements, Property 8: Image Path Generation Uniqueness
// Generate multiple consecutive uploads
// Verify all paths are unique
```

**Property 9: Navigation Functionality**
```typescript
// tests/properties/navigation-back.properties.test.ts
// Feature: app-enhancements, Property 9: Navigation Back to Stores
// Test navigation from various pages
// Verify always navigates to store selection
```

**Property 10: Photo Upload Association**
```typescript
// tests/properties/photo-upload.properties.test.ts
// Feature: app-enhancements, Property 10: Add Vehicle Page Photo Upload
// Generate random sets of photos
// Verify all photos are associated with created vehicle
```

**Property 11: Text Readability**
```typescript
// tests/properties/text-contrast.properties.test.ts
// Feature: app-enhancements, Property 11: Store Card Text Readability
// Generate stores with various background images
// Verify text contrast ratio meets WCAG AA standards (4.5:1)
```

**Property 12: Role-Based Access**
```typescript
// tests/properties/role-based-access.properties.test.ts
// Feature: app-enhancements, Property 12: Role-Based Store Management Access
// Generate users with different roles
// Verify only Super Admin can access store management
```

### Integration Tests

**End-to-End Store Management Flow:**
1. Super Admin logs in
2. Navigates to store management
3. Creates new store with image
4. Verifies store appears in store list with background image
5. Edits store information
6. Attempts to delete store (should fail if has vehicles)
7. Deletes store (should succeed if no vehicles)

**End-to-End Add Vehicle Flow:**
1. User selects store
2. Clicks "Add Vehicle" button
3. Navigates to /vehicles/new page
4. Fills in stock number
5. Uploads photos
6. Submits form
7. Verifies navigation to vehicle detail page
8. Verifies photos are displayed

**Navigation Flow:**
1. User logs in and selects store
2. Verifies Navigation Banner appears
3. Navigates to vehicle detail page
4. Clicks "Back to Stores" in banner
5. Verifies navigation to store selection page

### Migration Testing

**Database Migration:**
- Test Prisma migration applies successfully
- Verify existing data is preserved
- Test new SUPER_ADMIN role can be assigned
- Verify imageUrl field is added to stores

**Storage Migration:**
- Test uploading to Google Cloud Storage
- Verify public URLs are accessible
- Test deleting from Google Cloud Storage
- Verify existing S3 URLs still work during transition period (if applicable)

