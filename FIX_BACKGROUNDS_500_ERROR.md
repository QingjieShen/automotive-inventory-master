# Fix for Backgrounds Page 500 Error

## Problem
The `/api/stores/[id]/backgrounds` endpoint is returning a 500 error because the development server needs to be restarted to load the updated Prisma client with the new background fields.

## Solution

### Step 1: Stop the Development Server
Press `Ctrl+C` in the terminal where `npm run dev` is running to stop the server.

### Step 2: Clear any Node processes (if needed)
If the server doesn't stop cleanly, run:
```bash
# Windows
taskkill /F /IM node.exe

# Or close the terminal and open a new one
```

### Step 3: Regenerate Prisma Client (if needed)
The Prisma client should already have the new fields, but if you encounter issues:
```bash
npx prisma generate
```

If you get a file permission error, close all terminals and IDEs, then try again.

### Step 4: Restart the Development Server
```bash
npm run dev
```

### Step 5: Test the Feature
1. Navigate to `http://localhost:3000/admin/stores`
2. Click "Manage Key Images Backgrounds"
3. Select a store from the dropdown
4. The page should now load without errors

## Verification

The database migration has already been applied successfully:
- Migration: `20260118052637_add_store_background_images`
- Added 6 new fields to the `stores` table:
  - `bgFrontQuarter`
  - `bgFront`
  - `bgBackQuarter`
  - `bgBack`
  - `bgDriverSide`
  - `bgPassengerSide`

The Prisma client types have been generated and include these fields.

## What Was Changed

1. **Database Schema** - Added 6 nullable string fields for background images
2. **API Routes** - Created `/api/stores/[id]/backgrounds` with GET, POST, DELETE
3. **Admin Page** - Created `/admin/backgrounds` for managing backgrounds
4. **Services** - Updated `BackgroundTemplateService` to use store-specific backgrounds
5. **Image Processor** - Updated to pass store ID when selecting backgrounds

## If Issues Persist

If you still see errors after restarting:

1. Check the server console for detailed error messages
2. Verify the database has the new columns:
   ```sql
   SELECT column_name FROM information_schema.columns 
   WHERE table_name = 'stores' AND column_name LIKE 'bg%';
   ```
3. Check that Prisma client was generated:
   ```bash
   ls src/generated/prisma/
   ```
4. Try clearing Next.js cache:
   ```bash
   rm -rf .next
   npm run dev
   ```
