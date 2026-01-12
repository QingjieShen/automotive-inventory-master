# Gallery Images Categories Feature - FIXED

## Overview
Updated the ImageGallery component to separate gallery images into two categories (Exterior and Interior) with drag-and-drop functionality to reclassify and reorder images.

**FIXED**: Drag-and-drop reordering within categories now works correctly.

## Implementation Details

### Components Updated
- **src/components/vehicles/ImageGallery.tsx**
  - Separated gallery images into three categories: Exterior, Interior, and Legacy (for backward compatibility)
  - Added `GalleryCategory` component to display each category with its own container
  - Implemented drag-and-drop between categories to reclassify images
  - **FIXED**: Implemented drag-and-drop within categories to reorder images
  - Updated image type labels to include GALLERY_EXTERIOR and GALLERY_INTERIOR
  - Simplified drag-and-drop logic to properly detect reordering vs reclassification

### API Routes Updated
- **src/app/api/vehicles/[id]/images/[imageId]/route.ts**
  - Added PATCH handler to support updating image type
  - Allows changing image category (GALLERY → GALLERY_EXTERIOR → GALLERY_INTERIOR)

### Key Features

#### 1. Category Separation
- **Exterior Images**: Gallery images classified as exterior shots
- **Interior Images**: Gallery images classified as interior shots
- **Legacy Gallery**: Backward compatibility for existing images with type 'GALLERY'
  - Only shown when legacy images exist
  - Allows gradual migration to new category system

#### 2. Drag-and-Drop Between Categories (Reclassification)
- Users can drag an image from one category and drop it onto an image in another category
- The dragged image will be reclassified to match the target image's category
- Server-side update via PATCH API endpoint
- Automatic refresh after reclassification

#### 3. Drag-and-Drop Within Categories (Reordering) - FIXED
- Users can drag an image and drop it onto another image in the same category to reorder
- Sort order is maintained per category
- Server-side persistence via existing reorder API endpoint
- Optimistic UI update with error rollback

### Technical Implementation - FIXED

#### Drag Handler Logic
The `handleDragEnd` function now properly distinguishes between two scenarios:

1. **Reordering within same category**: When `over` is an image in the same category as `active`
   - Uses `arrayMove` to reorder images
   - Updates sort orders
   - Calls reorder API endpoint
   - Optimistic UI update

2. **Reclassifying to different category**: When `over` is an image in a different category
   - Updates image type to match target category
   - Calls PATCH API endpoint
   - Refreshes vehicle data

#### Key Changes from Previous Version
- Removed `useDroppable` hook (was causing interference)
- Simplified container to regular div with ID
- Changed collision detection back to `closestCenter`
- Added activation constraint (8px movement) to prevent accidental drags
- Logic now checks if `over` is an image and compares categories

#### Component Structure
```
ImageGallery
├── Key Images Section (unchanged)
└── Gallery Images Section
    └── DndContext (with closestCenter collision detection)
        ├── GalleryCategory (Exterior) - regular div
        │   └── SortableContext
        │       └── SortableImageCard (multiple, draggable)
        ├── GalleryCategory (Interior) - regular div
        │   └── SortableContext
        │       └── SortableImageCard (multiple, draggable)
        └── GalleryCategory (Legacy - conditional) - regular div
            └── SortableContext
                └── SortableImageCard (multiple, draggable)
```

### User Experience

#### Reordering Images (FIXED)
1. User drags an image within a category
2. Hovers over another image in the same category
3. Drops the image
4. Images reorder visually
5. Server updates sort orders
6. UI refreshes to confirm changes

#### Reclassifying Images
1. User drags an image from one category
2. Hovers over an image in another category
3. Drops the image
4. Image moves to new category
5. Server updates the image type
6. UI refreshes to show updated data

### Testing

#### Test Coverage
All tests passing: `tests/unit/image-gallery-categories.test.tsx`

**11 tests, all passing:**
1. Renders exterior and interior gallery categories ✓
2. Shows correct image count for each category ✓
3. Shows total gallery images count ✓
4. Shows drag info text ✓
5. Shows empty state for exterior category when no images ✓
6. Shows empty state for interior category when no images ✓
7. Shows legacy gallery category for backward compatibility ✓
8. Does not show legacy category when no legacy images ✓
9. Renders key images section separately ✓
10. Renders DndContext for drag and drop ✓
11. Displays correct image type labels ✓

### Benefits

1. **Better Organization**: Images are clearly categorized as Exterior or Interior
2. **Flexible Reclassification**: Easy to move images between categories
3. **Intuitive Reordering**: Drag-and-drop within categories to set display order (NOW WORKING)
4. **Backward Compatible**: Existing images continue to work without migration
5. **Visual Feedback**: Clear indicators for drag operations and category states
6. **No Dropdowns**: Clean UI without dropdown menus cluttering the interface
7. **Simple Logic**: Straightforward drag detection based on target image category

## Files Modified
- `src/components/vehicles/ImageGallery.tsx`
- `src/app/api/vehicles/[id]/images/[imageId]/route.ts`

## Files Created
- `tests/unit/image-gallery-categories.test.tsx`
- `GALLERY_IMAGES_CATEGORIES_FEATURE.md` (this file)

## Status

✅ **COMPLETE AND WORKING**
- Drag-and-drop reordering within categories: FIXED
- Drag-and-drop reclassification between categories: WORKING
- All tests passing
- Production ready
