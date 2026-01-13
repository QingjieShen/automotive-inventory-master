# Store Image Upload Fix

## Issues Fixed

### Issue 1: Navigation Access Denied
**Problem:** Super Admin users were redirected when trying to access `/admin/stores`

**Root Cause:** Middleware only allowed `ADMIN` role, not `SUPER_ADMIN`

**Solution:** Updated `src/middleware.ts` to allow both `ADMIN` and `SUPER_ADMIN` roles

### Issue 2: Store Image Upload 500 Error
**Problem:** POST to `/api/stores/[id]/image` returned 500 error

**Root Cause:** Google Cloud Storage not configured, causing upload to fail

**Solution:** Added fallback to placeholder URLs when GCS is not configured

### Issue 3: Store Placeholder Image 404 Error
**Problem:** GET to `/api/placeholder/store/[id]` returned 404 error

**Root Cause:** Placeholder API endpoint didn't exist

**Solution:** Created placeholder endpoint that returns SVG images

### Issue 4: Vehicle Image Upload 500 Error
**Problem:** POST to `/api/vehicles/[id]/images` returned 500 error

**Root Cause:** Google Cloud Storage not configured, causing upload to fail

**Solution:** Added fallback to placeholder URLs when GCS is not configured

### Issue 5: Vehicle Placeholder Image 404 Error
**Problem:** GET to `/api/placeholder/vehicle/[vehicleId]/[imageIndex]` returned 404 error

**Root Cause:** Placeholder API endpoint didn't exist

**Solution:** Created placeholder endpoint that returns SVG images

## Files Modified

1. **src/middleware.ts**
   - Allow both ADMIN and SUPER_ADMIN to access `/admin/*` routes

2. **src/app/stores/page.tsx**
   - Added NavigationBanner component for "Manage Stores" button

3. **src/app/api/stores/[id]/image/route.ts**
   - Added GCS configuration check
   - Falls back to placeholder URL if GCS not configured
   - Returns warning message when using placeholder

4. **src/app/api/placeholder/store/[id]/route.ts** (NEW)
   - Returns SVG placeholder image for stores
   - Shows "Configure Google Cloud Storage" message
   - Displays store ID for debugging

5. **src/app/api/vehicles/[id]/images/route.ts**
   - Added GCS configuration check
   - Falls back to placeholder URLs if GCS not configured
   - Returns warning message when using placeholders

6. **src/app/api/placeholder/vehicle/[vehicleId]/[imageIndex]/route.ts** (NEW)
   - Returns SVG placeholder image for vehicles
   - Shows "Configure Google Cloud Storage" message
   - Displays vehicle ID and image index for debugging

## Current Behavior

### Without GCS Configured (Current State)
1. Super Admin can access store management page
2. Can add, edit, and delete stores
3. Can "upload" store images (saves placeholder URL)
4. Store cards show blue gradient placeholder with message
5. Can create vehicles with images (saves placeholder URLs)
6. Vehicle images show indigo gradient placeholder with message
7. Warning messages indicate GCS needs configuration

### With GCS Configured (Future)
1. All above functionality works
2. Actual images are uploaded to Google Cloud Storage
3. Store cards and vehicle images show real uploaded images
4. No warning messages

## Testing

1. **Access Store Management:**
   - Log in as Super Admin (`superadmin@markmotors.com`)
   - Click "Manage Stores" button
   - Should navigate to `/admin/stores` successfully

2. **Upload Store Image:**
   - Click "Edit" on any store
   - Select an image file
   - Click "Update Store"
   - Should succeed with warning about GCS
   - Store should show placeholder image

3. **Create Vehicle with Images:**
   - Navigate to "New Vehicle" page
   - Fill in vehicle details
   - Upload key images and gallery images
   - Click "Create Vehicle"
   - Should succeed with warning about GCS
   - Vehicle should show placeholder images

4. **View Images:**
   - Store cards show blue placeholder images
   - Vehicle images show indigo placeholder images
   - All placeholders display "Configure Google Cloud Storage" message

## Google Cloud Storage Setup (Optional)

To enable actual image uploads:

1. **Create GCS Bucket:**
   ```bash
   # In Google Cloud Console
   # 1. Go to Cloud Storage > Buckets
   # 2. Create bucket named "mmg-vehicle-inventory"
   # 3. Set public access for read
   ```

2. **Create Service Account:**
   ```bash
   # In Google Cloud Console
   # 1. Go to IAM & Admin > Service Accounts
   # 2. Create service account
   # 3. Grant "Storage Object Admin" role
   # 4. Download JSON key file
   ```

3. **Configure Environment Variables:**
   ```env
   GOOGLE_CLOUD_PROJECT_ID="your-project-id"
   GOOGLE_CLOUD_STORAGE_BUCKET="mmg-vehicle-inventory"
   GOOGLE_APPLICATION_CREDENTIALS="path/to/service-account-key.json"
   ```

4. **Restart Application:**
   ```bash
   npm run dev
   ```

## Related Documentation
- `.env.example` - Full GCS configuration guide
- `NAVIGATION_FIX_SUMMARY.md` - Navigation access fix details
- `STORE_IMAGE_UPLOAD_GUIDE.md` - Original feature documentation
