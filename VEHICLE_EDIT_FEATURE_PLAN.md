# Vehicle Edit Feature Implementation Plan

## Overview
This document outlines the implementation of comprehensive vehicle editing features including:
1. Edit mode on vehicle detail page
2. Gallery image classification (Exterior/Interior)
3. Drag-and-drop reordering for all images
4. Stock number uniqueness enforcement

## Current Status
✅ Stock number uniqueness - Already implemented in schema (`@@unique([stockNumber, storeId])`)
✅ Gallery image drag-and-drop - Already implemented
✅ ImageType enum updated - Added GALLERY_EXTERIOR and GALLERY_INTERIOR

## Implementation Tasks

### 1. Database Migration
**Status:** Schema updated, migration created
- Added GALLERY_EXTERIOR and GALLERY_INTERIOR to ImageType enum
- Stock number uniqueness already enforced per store

**Migration Command:**
```bash
npx prisma migrate deploy
npx prisma generate
```

### 2. Update SimplePhotoUploader Component
**File:** `src/components/vehicles/SimplePhotoUploader.tsx`
**Changes:**
- Add gallery category selection (Exterior/Interior)
- Update default imageType based on category
- Add category filter/tabs

### 3. Update KeyImagesUploader Component  
**File:** `src/components/vehicles/KeyImagesUploader.tsx`
**Changes:**
- Add drag-and-drop functionality using @dnd-kit
- Allow reordering of key image slots
- Persist order to backend

### 4. Update ImageGallery Component
**File:** `src/components/vehicles/ImageGallery.tsx`
**Changes:**
- Separate gallery images into Exterior and Interior sections
- Add drag-and-drop within each category
- Support cross-category dragging
- Add category labels and counts

### 5. Add Edit Mode to Vehicle Detail Page
**File:** `src/app/vehicles/[id]/page.tsx`
**Changes:**
- Add "Edit" button in header
- Toggle between view and edit modes
- In edit mode:
  - Allow stock number editing
  - Show photo upload areas
  - Enable image deletion
  - Show save/cancel buttons

### 6. Create Vehicle Edit API Endpoint
**File:** `src/app/api/vehicles/[id]/route.ts`
**Changes:**
- Add PATCH endpoint for updating vehicle
- Validate stock number uniqueness
- Update vehicle metadata

### 7. Update Add Vehicle Page
**File:** `src/app/vehicles/new/page.tsx`
**Changes:**
- Update SimplePhotoUploader to support gallery categories
- Add category selection UI
- Validate stock number uniqueness on submit

### 8. API Validation
**Files:** 
- `src/app/api/vehicles/route.ts` (POST)
- `src/app/api/vehicles/[id]/route.ts` (PATCH)

**Changes:**
- Add stock number uniqueness validation
- Return appropriate error messages
- Handle duplicate stock number errors

## UI/UX Design

### Edit Mode Layout
```
┌─────────────────────────────────────────────────────────┐
│ [Back] Vehicle ABC123        [Edit] [Processing Status] │
├─────────────────────────────────────────────────────────┤
│                                                          │
│ Stock Number: [ABC123_____]  [Save] [Cancel]           │
│                                                          │
│ Key Images (Drag to reorder)                           │
│ ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐│
│ │Front │ │Front │ │Driver│ │Back  │ │Back  │ │Pass. ││
│ │Qtr   │ │      │ │Side  │ │Qtr   │ │      │ │Side  ││
│ └──────┘ └──────┘ └──────┘ └──────┘ └──────┘ └──────┘│
│                                                          │
│ Gallery Images - Exterior (12)                          │
│ [+ Add Exterior Photos]                                 │
│ ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐                  │
│ │      │ │      │ │      │ │      │ (Drag to reorder) │
│ └──────┘ └──────┘ └──────┘ └──────┘                  │
│                                                          │
│ Gallery Images - Interior (8)                           │
│ [+ Add Interior Photos]                                 │
│ ┌──────┐ ┌──────┐ ┌──────┐                           │
│ │      │ │      │ │      │ (Drag to reorder)          │
│ └──────┘ └──────┘ └──────┘                           │
└─────────────────────────────────────────────────────────┘
```

### Gallery Category Selection
```
┌─────────────────────────────────────┐
│ Upload Gallery Images               │
│                                     │
│ Category: ○ Exterior  ○ Interior   │
│                                     │
│ [Drop files here or click to upload]│
└─────────────────────────────────────┘
```

## Implementation Priority

### Phase 1: Core Functionality (High Priority)
1. ✅ Update ImageType enum
2. ✅ Create database migration
3. Update SimplePhotoUploader with category selection
4. Update ImageGallery to show categories
5. Add edit mode to vehicle detail page

### Phase 2: Enhanced Features (Medium Priority)
6. Add drag-and-drop to KeyImagesUploader
7. Add photo upload in edit mode
8. Implement stock number validation

### Phase 3: Polish (Low Priority)
9. Add loading states
10. Add success/error notifications
11. Add keyboard shortcuts
12. Add bulk operations

## Technical Considerations

### Drag-and-Drop Library
Using `@dnd-kit` (already installed):
- Supports touch devices
- Accessible
- Performant
- Already used in ImageGallery

### Stock Number Validation
- Client-side: Check format and length
- Server-side: Check uniqueness in database
- Error handling: Show clear error messages
- Consider: Allow same stock number across different stores

### Image Categories
- Default: GALLERY_EXTERIOR for backward compatibility
- Migration: Existing GALLERY images remain as-is
- UI: Clear visual distinction between categories
- Filtering: Allow viewing by category

### State Management
- Use React state for edit mode
- Optimistic updates for better UX
- Revert on error
- Debounce API calls

## Testing Strategy

### Unit Tests
- Stock number validation
- Category selection
- Drag-and-drop functionality
- Edit mode toggle

### Integration Tests
- Complete edit workflow
- Image upload with categories
- Stock number uniqueness
- Image reordering persistence

### Manual Testing
- Test on mobile devices
- Test drag-and-drop on touch screens
- Test with slow network
- Test with large number of images

## Migration Strategy

### Existing Data
- Existing GALLERY images remain unchanged
- No data migration needed
- New uploads use new categories
- Optional: Bulk categorize existing images

### Backward Compatibility
- Keep GALLERY type for legacy support
- API accepts both old and new types
- UI shows all gallery images together if not categorized

## Error Handling

### Stock Number Duplicate
```typescript
{
  error: "Stock number already exists for this store",
  field: "stockNumber",
  code: "DUPLICATE_STOCK_NUMBER"
}
```

### Image Upload Failure
```typescript
{
  error: "Failed to upload image",
  details: "Network error",
  retryable: true
}
```

### Reorder Failure
```typescript
{
  error: "Failed to update image order",
  details: "Server error",
  action: "revert"
}
```

## Performance Considerations

- Lazy load images
- Optimize image sizes
- Debounce reorder API calls
- Use optimistic updates
- Cache vehicle data
- Implement pagination for large galleries

## Accessibility

- Keyboard navigation for drag-and-drop
- Screen reader announcements
- Focus management in edit mode
- ARIA labels for all interactive elements
- High contrast mode support

## Security

- Validate all inputs server-side
- Check user permissions for edit operations
- Sanitize stock numbers
- Validate image types and sizes
- Rate limit API calls

## Next Steps

1. Run database migration
2. Update SimplePhotoUploader component
3. Update ImageGallery component
4. Add edit mode to vehicle detail page
5. Test thoroughly
6. Deploy to staging
7. User acceptance testing
8. Deploy to production

## Notes

- Stock number uniqueness is already enforced at database level
- Gallery drag-and-drop is already implemented
- Focus on adding edit mode and category classification
- Consider user feedback for UI improvements
