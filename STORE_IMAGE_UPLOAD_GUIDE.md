# Store Image Upload Guide

## Overview
The store background image upload feature **IS IMPLEMENTED** and available to Super Admin users. This guide explains how to access and use it.

## How to Upload Store Images

### Step 1: Login as Super Admin
Make sure you're logged in with the Super Admin account:
- **Email:** `superadmin@markmotors.com`
- **Password:** `superadmin123`

### Step 2: Access Store Management
Once logged in, look at the **top navigation bar**. You should see a blue button labeled **"Manage Stores"**.

![Navigation Bar Location]
```
┌─────────────────────────────────────────────────────────┐
│ MMG    [Store Name]    [Account] [Manage Stores] [Back] │
└─────────────────────────────────────────────────────────┘
                                      ↑
                              Click this button!
```

**Note:** This button is ONLY visible to Super Admin users. If you don't see it, verify you're logged in as Super Admin.

### Step 3: Edit a Store
1. Click the **"Manage Stores"** button
2. You'll see a table of all stores
3. Find the store you want to add an image to
4. Click the **"Edit"** button for that store

### Step 4: Upload Image
In the Edit Store modal:
1. Fill in the store details (name, address, brand logos)
2. Look for the **"Store Image"** field
3. Click **"Choose File"** and select an image from your computer
4. Click **"Update Store"**

### Step 5: Verify
1. Go back to the stores page (`/stores`)
2. The store card should now show your uploaded image as the background
3. If no image is uploaded, the card shows a default gradient background

## Image Requirements

- **File Type:** Any image format (JPG, PNG, GIF, etc.)
- **File Size:** Maximum 10MB
- **Recommended Size:** 1200x800 pixels or larger for best quality
- **Aspect Ratio:** 3:2 or 16:9 works well

## Features

### Add New Store with Image
1. Click **"Add Store"** button
2. Fill in store details
3. Upload an image in the "Store Image" field
4. Click **"Create Store"**

### Edit Existing Store Image
1. Click **"Edit"** on any store
2. Upload a new image (replaces the old one)
3. Or leave it blank to keep the current image
4. Click **"Update Store"**

### Remove Store Image
To remove an image:
1. Edit the store
2. Don't select a new file
3. Manually clear the `imageUrl` field (if visible)
4. Or contact a developer to remove it via database

## How It Works

### Backend
- Images are uploaded to Google Cloud Storage (GCS)
- API endpoint: `POST /api/stores/{storeId}/image`
- Returns the public URL of the uploaded image
- URL is saved in the database `stores.imageUrl` field

### Frontend
- `StoreCard` component checks for `store.imageUrl`
- If image exists: Shows image with dark overlay for text readability
- If no image: Shows default gradient background (purple/blue)

### Database Schema
```prisma
model Store {
  id         String   @id @default(cuid())
  name       String
  address    String
  brandLogos String[]
  imageUrl   String?  // ← This field stores the image URL
  // ...
}
```

## Troubleshooting

### "I don't see the Manage Stores button"
**Solution:** Make sure you're logged in as Super Admin:
1. Logout (click Account → Logout)
2. Login with `superadmin@markmotors.com` / `superadmin123`
3. The button should now appear in the navigation bar

### "Upload fails with error"
**Possible causes:**
1. **File too large** - Must be under 10MB
2. **Not an image file** - Must be a valid image format
3. **GCS not configured** - Check environment variables

**Check environment variables:**
```env
GCS_BUCKET_NAME=your-bucket-name
GCS_PROJECT_ID=your-project-id
GOOGLE_APPLICATION_CREDENTIALS=path/to/credentials.json
```

### "Image uploaded but not showing"
**Solutions:**
1. **Hard refresh** the page (Ctrl+Shift+R or Cmd+Shift+R)
2. **Clear browser cache**
3. **Check the database** - Open Prisma Studio:
   ```bash
   npm run db:studio
   ```
   Navigate to `stores` table and verify `imageUrl` field has a value

### "Image shows but looks bad"
**Solutions:**
1. **Use higher resolution** - Upload at least 1200x800 pixels
2. **Check aspect ratio** - 3:2 or 16:9 works best
3. **Adjust image** - The card applies a dark overlay for text readability

## API Endpoints

### Upload Store Image
```
POST /api/stores/{storeId}/image
Content-Type: multipart/form-data

Body:
- image: File (the image file)

Response:
{
  "imageUrl": "https://storage.googleapis.com/bucket/path/to/image.jpg"
}
```

### Update Store (including image URL)
```
PUT /api/stores/{storeId}
Content-Type: application/json

Body:
{
  "name": "Store Name",
  "address": "Store Address",
  "brandLogos": ["logo1", "logo2"],
  "imageUrl": "https://storage.googleapis.com/bucket/path/to/image.jpg"
}
```

## Code References

### Key Files
- **Admin Page:** `src/app/admin/stores/page.tsx` - Store management interface
- **Store Card:** `src/components/stores/StoreCard.tsx` - Displays store with background image
- **Navigation:** `src/components/common/NavigationBanner.tsx` - Contains "Manage Stores" button
- **API Route:** `src/app/api/stores/[id]/image/route.ts` - Handles image upload
- **Auth Hook:** `src/hooks/useAuth.ts` - Provides `isSuperAdmin` flag

### Image Display Logic
```typescript
// In StoreCard.tsx
const backgroundStyle = store.imageUrl
  ? {
      backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.5)), url(${store.imageUrl})`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
    }
  : {
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    }
```

## Quick Access

### Direct URLs
- **Store Management:** `http://localhost:3000/admin/stores`
- **Store Selection:** `http://localhost:3000/stores`
- **Account Page:** `http://localhost:3000/account`

### Navigation Path
```
Login → Stores Page → Click "Manage Stores" → Edit Store → Upload Image
```

## Summary

✅ **Feature Status:** FULLY IMPLEMENTED
✅ **Access Level:** Super Admin only
✅ **Location:** Navigation bar → "Manage Stores" button
✅ **Functionality:** Upload, edit, and display store background images
✅ **Storage:** Google Cloud Storage (GCS)

The feature is working as designed. Just look for the blue "Manage Stores" button in the top navigation bar when logged in as Super Admin!
