# Key Images Drag-and-Drop Reordering Feature

## Overview
Added drag-and-drop functionality to the KeyImagesUploader component, allowing users to reorder images between slots by dragging and dropping them.

## Implementation Details

### Components Updated
- **src/components/vehicles/KeyImagesUploader.tsx**
  - Added `@dnd-kit` library integration for drag-and-drop
  - Created `SortableKeyImageSlot` component that wraps slots with sortable functionality
  - Updated `KeyImageSlot` to support both file upload and image reordering

### Key Features

#### 1. Drag-and-Drop Image Reordering
- Users can drag an image from one slot and drop it into another slot to swap positions
- Visual feedback during drag operation (opacity change, drag overlay)
- Drag handle icon appears in slot header when an image is present
- Only slots with images can be dragged (empty slots cannot be dragged)

#### 2. File Upload (Preserved)
- Click to upload: Users can still click on empty slots to select files
- Drag-and-drop files: Users can drag image files from their computer and drop them into empty slots
- Visual feedback when dragging files over slots (blue border/background)
- File validation (type and size) still works

#### 3. Smart Drag Detection
- Component distinguishes between:
  - Dragging files from computer (for upload)
  - Dragging images between slots (for reordering)
- Uses `e.dataTransfer.types.includes('Files')` to detect file drops
- Prevents conflicts between the two drag operations

### Technical Implementation

#### Libraries Used
- `@dnd-kit/core`: Core drag-and-drop functionality
- `@dnd-kit/sortable`: Sortable list functionality
- `@dnd-kit/utilities`: CSS transform utilities

#### Drag Sensors
- **PointerSensor**: Handles mouse/touch drag operations
  - Activation constraint: 8px movement required before drag starts (prevents accidental drags)
- **KeyboardSensor**: Handles keyboard-based drag operations for accessibility

#### Component Structure
```
KeyImagesUploader
├── DndContext (drag-and-drop context)
│   ├── SortableContext (sortable items context)
│   │   └── SortableKeyImageSlot (6 slots)
│   │       └── KeyImageSlot (slot UI with upload/preview)
│   └── DragOverlay (visual feedback during drag)
```

#### State Management
- `slots`: Map of ImageType to UploadFile (tracks which images are in which slots)
- `activeId`: Currently dragging slot ID (for visual feedback)

#### Drag Handlers
- `handleDragStart`: Sets active drag ID for visual feedback
- `handleDragEnd`: Swaps images between source and target slots, updates file imageType

### User Experience

#### Visual Indicators
- **Drag Handle**: Six-dot icon appears in slot header when image is present
- **Drag Overlay**: Shows slot label during drag operation
- **Opacity Change**: Dragging slot becomes semi-transparent
- **Info Text**: "Drag images between slots to reorder"
- **Filled Slots Counter**: "X of 6 slots filled"

#### Interaction Flow
1. User uploads images to slots (click or drag files)
2. Drag handle appears in slot header
3. User grabs drag handle or image area
4. Drags to another slot
5. Images swap positions
6. File imageType properties are updated to match new slots

### Testing

#### Test Coverage
Created comprehensive test suite: `tests/unit/key-images-reorder.test.tsx`

**11 tests, all passing:**
1. Renders all 6 key image slots
2. Shows drag and drop info text
3. Shows filled slots count
4. Renders DndContext for drag and drop
5. Renders SortableContext for sortable items
6. Allows file upload to empty slot
7. Shows drag handle when slot has an image
8. Allows removing uploaded image
9. Supports drag and drop file upload to empty slot
10. Validates file type on upload
11. Validates file size on upload

### Benefits

1. **Improved UX**: Users can easily reorder images without re-uploading
2. **Flexibility**: Supports both upload and reorder operations
3. **Accessibility**: Keyboard navigation support via KeyboardSensor
4. **Visual Feedback**: Clear indicators for drag operations
5. **No Conflicts**: Smart detection prevents upload/reorder conflicts

### Next Steps

This implementation serves as a foundation for:
- Gallery images drag-and-drop reordering (exterior/interior categories)
- Vehicle detail page edit mode with image management
- Consistent drag-and-drop patterns across the application

## Files Modified
- `src/components/vehicles/KeyImagesUploader.tsx`

## Files Created
- `tests/unit/key-images-reorder.test.tsx`
- `KEY_IMAGES_REORDER_FEATURE.md` (this file)

## Dependencies Added
- `@dnd-kit/core`
- `@dnd-kit/sortable`
- `@dnd-kit/utilities`

(Note: These dependencies were already in package.json from previous features)
