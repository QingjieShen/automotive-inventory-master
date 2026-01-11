# Bug Fix: Key Images and Gallery Images Separation

## Issue
After adding 4 key images in the "Key Images" container, users could not upload more than 2 images to the "Gallery Images" container. The two containers were not properly separated.

## Root Cause
Both Key Images and Gallery Images were using the same `SimplePhotoUploader` component with different `maxFiles` limits. The component was working correctly, but the user experience was confusing because:
1. Key Images didn't have named slots for the 6 specific vehicle shots
2. Users could upload any images to Key Images without guidance
3. Gallery Images limit was too low (20 images)

## Solution

### 1. Created New KeyImagesUploader Component
**File:** `src/components/vehicles/KeyImagesUploader.tsx`

Features:
- **6 Named Slots**: Each slot is labeled with its specific purpose:
  - Front Quarter
  - Front
  - Driver Side Profile
  - Back Quarter
  - Back
  - Passenger Side Profile
- **One Image Per Slot**: Each slot accepts exactly one image
- **Visual Slot Design**: Clear visual indication of which slots are filled
- **Proper Image Type Assignment**: Each uploaded image is automatically tagged with its correct ImageType
- **File Validation**: Validates file type and size (10MB limit)
- **Remove Functionality**: Users can remove images from individual slots

### 2. Updated Add Vehicle Page
**File:** `src/app/vehicles/new/page.tsx`

Changes:
- Replaced `SimplePhotoUploader` with `KeyImagesUploader` for Key Images section
- Increased Gallery Images limit from 20 to 60 images
- Updated descriptions to clarify the purpose of each section
- Maintained proper separation between Key Images and Gallery Images state

### 3. Fixed TypeScript Error
**File:** `src/app/api/stores/[id]/image/route.ts`

Fixed Next.js 16 compatibility issue with async params:
```typescript
// Before
{ params }: { params: { id: string } }

// After
{ params }: { params: Promise<{ id: string }> }
const { id: storeId } = await params;
```

### 4. Added Unit Tests
**File:** `tests/unit/key-images-uploader.test.tsx`

Test coverage:
- ✅ Renders all 6 key image slots
- ✅ Displays correct initial state
- ✅ Each slot has an upload button
- ✅ Accepts file upload for a slot
- ✅ Shows filled slots count after upload
- ✅ Each slot can only hold one image
- ✅ Validates file types
- ✅ Validates file size
- ✅ Component is accessible

All 9 tests pass successfully.

## User Experience Improvements

### Before
- Confusing upload interface with no guidance on which images to upload
- Could upload any 6 images without knowing which shot goes where
- Gallery Images limited to 20 images
- No visual indication of which key images were uploaded

### After
- **Clear 6-slot interface** with labeled slots for each required vehicle shot
- **One image per slot** prevents confusion
- **Gallery Images supports up to 60 images** for comprehensive vehicle documentation
- **Visual feedback** showing which slots are filled (X of 6 slots filled)
- **Easy removal** of images from individual slots
- **Proper separation** between Key Images and Gallery Images

## Technical Details

### Key Images Uploader Architecture
```typescript
interface KeyImageSlot {
  type: ImageType  // FRONT_QUARTER, FRONT, DRIVER_SIDE, etc.
  label: string    // "Front Quarter", "Front", etc.
  file: UploadFile | null
}
```

The component uses a Map to track which slots are filled:
```typescript
const [slots, setSlots] = useState<Map<ImageType, UploadFile | null>>(
  new Map(KEY_IMAGE_SLOTS.map(slot => [slot.type, null]))
)
```

### Image Type Assignment
Each uploaded image is automatically assigned the correct ImageType based on its slot:
- Front Quarter → `FRONT_QUARTER`
- Front → `FRONT`
- Driver Side Profile → `DRIVER_SIDE`
- Back Quarter → `BACK_QUARTER`
- Back → `BACK`
- Passenger Side Profile → `PASSENGER_SIDE`

Gallery images continue to use `GALLERY` type.

## Files Modified
1. `src/components/vehicles/KeyImagesUploader.tsx` (NEW)
2. `src/app/vehicles/new/page.tsx` (MODIFIED)
3. `src/components/vehicles/index.ts` (MODIFIED)
4. `src/app/api/stores/[id]/image/route.ts` (MODIFIED - TypeScript fix)
5. `tests/unit/key-images-uploader.test.tsx` (NEW)

## Testing
- ✅ All unit tests pass (9/9)
- ✅ Component renders correctly
- ✅ File validation works
- ✅ Accessibility requirements met
- ✅ TypeScript compilation successful

## Deployment Notes
No database migrations required. No breaking changes to existing functionality. The change is purely frontend and improves the user experience for vehicle photo uploads.
