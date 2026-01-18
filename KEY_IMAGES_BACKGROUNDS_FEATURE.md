# Key Images Background Customization Feature

## Overview
This feature allows Super Admin users to customize background images for each store's key images. These custom backgrounds are used during AI-powered background replacement processing for vehicle images.

## Feature Components

### 1. Database Schema Updates
Added 6 new fields to the `Store` model in `prisma/schema.prisma`:
- `bgFrontQuarter` - Background for FRONT_QUARTER images
- `bgFront` - Background for FRONT images
- `bgBackQuarter` - Background for BACK_QUARTER images
- `bgBack` - Background for BACK images
- `bgDriverSide` - Background for DRIVER_SIDE images
- `bgPassengerSide` - Background for PASSENGER_SIDE images

Migration: `20260118052637_add_store_background_images`

### 2. Admin Page
**Location:** `/admin/backgrounds`
**File:** `src/app/admin/backgrounds/page.tsx`

**Features:**
- Store selector dropdown
- Grid layout showing all 6 key image types
- Image preview for each background type
- Upload functionality (JPG, PNG, WebP, max 10MB)
- Remove background option
- Protected by Super Admin role guard

**Access:** 
- From Store Management page via "Manage Key Images Backgrounds" button
- Direct URL: `/admin/backgrounds`

### 3. API Routes
**Location:** `src/app/api/stores/[id]/backgrounds/route.ts`

**Endpoints:**
- `GET /api/stores/[id]/backgrounds` - Fetch store's background configuration
- `POST /api/stores/[id]/backgrounds` - Upload a background image
  - Form data: `image` (file), `imageType` (string)
  - Validates file type and size
  - Uploads to GCS at `stores/{storeId}/backgrounds/bg-{imageType}.{ext}`
- `DELETE /api/stores/[id]/backgrounds?imageType={type}` - Remove a background image

**Authorization:** All endpoints require Super Admin role

### 4. Background Template Service Updates
**File:** `src/lib/services/background-template-service.ts`

**Changes:**
- Updated `selectBackgroundTemplate()` to accept optional `storeId` parameter
- Added `getStoreBackground()` private method to fetch store-specific backgrounds
- Falls back to default templates if no custom background is configured

**Behavior:**
1. If `storeId` is provided, checks for store-specific background in database
2. If custom background exists, returns the custom background URL
3. If no custom background, falls back to default template mapping:
   - FRONT_QUARTER, FRONT → `studio-white.jpg`
   - BACK_QUARTER, BACK → `studio-gray.jpg`
   - DRIVER_SIDE, PASSENGER_SIDE → `gradient-blue.jpg`

### 5. Image Processor Service Updates
**File:** `src/lib/services/image-processor-service.ts`

**Changes:**
- Updated to fetch vehicle's `storeId` from database
- Passes `storeId` to `selectBackgroundTemplate()` method
- Ensures store-specific backgrounds are used during AI processing

## User Flow

### Setting Up Custom Backgrounds
1. Super Admin logs in
2. Navigates to Store Management (`/admin/stores`)
3. Clicks "Manage Key Images Backgrounds" button
4. Selects a store from dropdown
5. For each key image type:
   - Clicks file input to select an image
   - Image uploads automatically
   - Preview updates to show the new background
6. Can remove backgrounds by clicking "Remove" button

### Background Usage During Processing
1. Photographer uploads vehicle images
2. Processing job is created
3. For each key image:
   - Image Processor Service fetches vehicle's store ID
   - Background Template Service checks for store-specific background
   - If custom background exists, uses it
   - If not, uses default template
   - AI processes image with selected background
4. Optimized image is saved with custom background

## Technical Details

### File Storage
- Custom backgrounds stored in GCS at: `stores/{storeId}/backgrounds/bg-{imageType}.{ext}`
- Naming convention: `bg-front_quarter.jpg`, `bg-front.jpg`, etc.
- Supported formats: JPG, PNG, WebP
- Max file size: 10MB

### Database Fields
All background fields are nullable strings containing GCS URLs:
```typescript
bgFrontQuarter?: string
bgFront?: string
bgBackQuarter?: string
bgBack?: string
bgDriverSide?: string
bgPassengerSide?: string
```

### Type Updates
Updated `Store` interface in `src/types/index.ts` to include new background fields.

## Benefits

1. **Store Branding** - Each dealership can have backgrounds matching their brand
2. **Flexibility** - Different backgrounds for different image angles
3. **Fallback** - Automatic fallback to default templates if not configured
4. **Easy Management** - Simple UI for Super Admins to manage backgrounds
5. **No Breaking Changes** - Existing functionality continues to work with defaults

## Future Enhancements

Potential improvements:
- Bulk upload for all image types at once
- Background preview with sample vehicle image
- Copy backgrounds from one store to another
- Background templates library
- Image cropping/editing before upload
- Analytics on which backgrounds perform best
