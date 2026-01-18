# Fix Google Cloud Storage Permissions

**Issue:** Store images showing placeholder instead of uploaded images  
**Cause:** Service account lacks permissions to access GCS bucket  
**Service Account:** `mark-motors-group-inventory-ph@auto-ads-465719.iam.gserviceaccount.com`

---

## 🔍 Problem Detected

The test shows:
```
❌ Cannot access bucket
Error: mark-motors-group-inventory-ph@auto-ads-465719.iam.gserviceaccount.com 
does not have storage.buckets.get access to the Google Cloud Storage bucket.
```

**This means:** Your service account exists, but it doesn't have permission to access the bucket.

---

## ✅ Solution: Grant Storage Permissions

### Option 1: Grant Permissions via Google Cloud Console (Recommended)

#### Step 1: Go to IAM & Admin

1. Visit: https://console.cloud.google.com/iam-admin/iam
2. Make sure project `auto-ads-465719` is selected (top left)

#### Step 2: Find Your Service Account

Look for:
```
mark-motors-group-inventory-ph@auto-ads-465719.iam.gserviceaccount.com
```

#### Step 3: Grant Storage Object Admin Role

1. Click the **pencil icon** (Edit) next to the service account
2. Click **ADD ANOTHER ROLE**
3. Search for: `Storage Object Admin`
4. Select: **Storage Object Admin**
5. Click **SAVE**

**Alternative: Storage Admin (More Permissions)**
- If you want full storage control, use `Storage Admin` instead
- This includes bucket management permissions

---

### Option 2: Grant Permissions via Bucket Settings

#### Step 1: Go to Cloud Storage

1. Visit: https://console.cloud.google.com/storage/browser
2. Find bucket: `mmg-vehicle-inventory`
3. Click on the bucket name

#### Step 2: Go to Permissions Tab

1. Click **PERMISSIONS** tab
2. Click **GRANT ACCESS**

#### Step 3: Add Service Account

1. **New principals:** 
   ```
   mark-motors-group-inventory-ph@auto-ads-465719.iam.gserviceaccount.com
   ```

2. **Select a role:** 
   - Choose: `Storage Object Admin`
   - Or: `Storage Admin` (for full control)

3. Click **SAVE**

---

### Option 3: Using gcloud CLI (Advanced)

```bash
# Set project
gcloud config set project auto-ads-465719

# Grant Storage Object Admin role
gcloud projects add-iam-policy-binding auto-ads-465719 \
  --member="serviceAccount:mark-motors-group-inventory-ph@auto-ads-465719.iam.gserviceaccount.com" \
  --role="roles/storage.objectAdmin"

# Or grant at bucket level
gsutil iam ch \
  serviceAccount:mark-motors-group-inventory-ph@auto-ads-465719.iam.gserviceaccount.com:roles/storage.objectAdmin \
  gs://mmg-vehicle-inventory
```

---

## 🧪 Verify the Fix

After granting permissions, test again:

```bash
node test-gcs-upload.js
```

**Expected output:**
```
✅ Google Cloud Storage is configured correctly!
```

---

## 🔐 Required Permissions

Your service account needs these permissions:

**Minimum (Storage Object Admin):**
- `storage.objects.create` - Upload files
- `storage.objects.delete` - Delete files
- `storage.objects.get` - Read files
- `storage.objects.list` - List files
- `storage.buckets.get` - Access bucket info

**Recommended Role:** `Storage Object Admin`
- Allows full control over objects (files)
- Does NOT allow bucket deletion or configuration changes

**Alternative Role:** `Storage Admin`
- Full control over buckets and objects
- Use if you need to manage bucket settings

---

## 📋 Step-by-Step Visual Guide

### Quick Fix (5 minutes):

1. **Open IAM Console**
   ```
   https://console.cloud.google.com/iam-admin/iam?project=auto-ads-465719
   ```

2. **Find Service Account**
   - Look for: `mark-motors-group-inventory-ph@...`
   - Click the pencil icon (Edit)

3. **Add Role**
   - Click "ADD ANOTHER ROLE"
   - Type: "Storage Object Admin"
   - Select it from dropdown
   - Click "SAVE"

4. **Wait 1-2 minutes** for permissions to propagate

5. **Test**
   ```bash
   node test-gcs-upload.js
   ```

6. **Restart your app**
   ```bash
   # Stop existing server
   # Then start again
   npm run start
   ```

7. **Try uploading store image again** - Should work now! ✅

---

## 🆘 Troubleshooting

### "Service account not found"

**Solution:** Create the service account first
1. Go to: https://console.cloud.google.com/iam-admin/serviceaccounts
2. Click "CREATE SERVICE ACCOUNT"
3. Name: `mark-motors-group-inventory-ph`
4. Grant role: `Storage Object Admin`
5. Download JSON key
6. Update `.env` with new key file path

### "Bucket does not exist"

**Solution:** Create the bucket
1. Go to: https://console.cloud.google.com/storage/browser
2. Click "CREATE BUCKET"
3. Name: `mmg-vehicle-inventory`
4. Region: Same as your database (e.g., `northamerica-northeast2`)
5. Click "CREATE"

### "Permission denied after granting role"

**Solution:** Wait and retry
- Permissions can take 1-2 minutes to propagate
- Try logging out and back into Google Cloud Console
- Clear browser cache
- Wait 5 minutes and test again

### "Still showing placeholder after fix"

**Solution:** Clear cache and restart
1. Restart your application server
2. Clear browser cache (Ctrl+Shift+Delete)
3. Try uploading a new image
4. Check browser console for errors (F12)

---

## 🎯 After Fixing

Once permissions are granted:

1. **Test GCS:**
   ```bash
   node test-gcs-upload.js
   ```
   Should show: ✅ All checks passed

2. **Restart app:**
   ```bash
   npm run start
   ```

3. **Upload store image:**
   - Login as Super Admin
   - Go to Stores
   - Edit a store
   - Upload an image
   - Should see actual image, not placeholder! ✅

4. **Check database:**
   ```bash
   node check-db-status.js
   ```

---

## 📞 Quick Reference

**Service Account:**
```
mark-motors-group-inventory-ph@auto-ads-465719.iam.gserviceaccount.com
```

**Required Role:**
```
Storage Object Admin
```

**IAM Console:**
```
https://console.cloud.google.com/iam-admin/iam?project=auto-ads-465719
```

**Storage Console:**
```
https://console.cloud.google.com/storage/browser?project=auto-ads-465719
```

**Test Command:**
```bash
node test-gcs-upload.js
```

---

## ✅ Success Checklist

- [ ] Opened IAM console
- [ ] Found service account
- [ ] Granted "Storage Object Admin" role
- [ ] Waited 1-2 minutes
- [ ] Ran `node test-gcs-upload.js` - passed ✅
- [ ] Restarted application
- [ ] Uploaded store image
- [ ] Image displays correctly (not placeholder)

---

**Estimated Time:** 5 minutes  
**Difficulty:** Easy  
**Impact:** Fixes all image uploads (stores and vehicles)
