# Upgrade to Storage Admin Role

**Current Issue:** Storage Object Admin role is not enough  
**Solution:** Grant Storage Admin role instead

---

## 🔍 Why Storage Object Admin Isn't Enough

**Storage Object Admin** gives you:
- ✅ Upload files
- ✅ Delete files
- ✅ Read files
- ❌ Access bucket metadata (storage.buckets.get)
- ❌ Create buckets
- ❌ Configure bucket settings

**Storage Admin** gives you:
- ✅ Everything above PLUS
- ✅ Access bucket metadata
- ✅ Create buckets
- ✅ Full bucket management

---

## ✅ Quick Fix (2 minutes)

### Step 1: Go to IAM Console

Visit: https://console.cloud.google.com/iam-admin/iam?project=auto-ads-465719

### Step 2: Find Your Service Account

Look for:
```
mark-motors-group-inventory-ph@auto-ads-465719.iam.gserviceaccount.com
```

You should see it has:
- Cloud SQL Client
- Storage Object Admin ← We need to upgrade this

### Step 3: Edit Permissions

1. Click the **pencil icon** (Edit) next to the service account
2. Find the **Storage Object Admin** role
3. Click the **X** to remove it
4. Click **ADD ANOTHER ROLE**
5. Search for: `Storage Admin`
6. Select: **Storage Admin**
7. Click **SAVE**

### Step 4: Wait & Test

```bash
# Wait 1-2 minutes for permissions to propagate
# Then test:
node check-bucket-exists.js
```

**Expected output:**
```
✅ Bucket exists!
✅ Can access bucket metadata
✅ Upload successful!
✅ Everything is working correctly!
```

---

## 🎯 Alternative: Create Bucket Manually

If you don't want to grant Storage Admin, you can create the bucket manually:

### Step 1: Go to Cloud Storage

Visit: https://console.cloud.google.com/storage/browser?project=auto-ads-465719

### Step 2: Create Bucket

1. Click **CREATE BUCKET**
2. **Name:** `mmg-vehicle-inventory`
3. **Location type:** Region
4. **Location:** `northamerica-northeast2 (Montreal)` ← Same as your database
5. **Storage class:** Standard
6. **Access control:** Uniform
7. Click **CREATE**

### Step 3: Make Bucket Public (Optional)

1. Click on the bucket name
2. Go to **PERMISSIONS** tab
3. Click **GRANT ACCESS**
4. **New principals:** `allUsers`
5. **Role:** Storage Object Viewer
6. Click **SAVE**
7. Click **ALLOW PUBLIC ACCESS**

### Step 4: Test Again

```bash
node check-bucket-exists.js
```

---

## 📋 Recommended Approach

**For Production:** Use **Storage Admin** role

**Why?**
- Full control over your storage
- Can manage buckets and objects
- Easier troubleshooting
- Still secure (scoped to storage only)

**Security Note:**
- Storage Admin only affects Cloud Storage
- It does NOT give access to other Google Cloud services
- It's safe to use for your application

---

## 🔧 After Fixing

Once you've granted Storage Admin or created the bucket:

1. **Test GCS:**
   ```bash
   node check-bucket-exists.js
   ```
   Should show: ✅ Everything is working correctly!

2. **Restart your app:**
   ```bash
   npm run start
   ```

3. **Upload a store image:**
   - Login as Super Admin
   - Go to Stores → Edit a store
   - Upload an image
   - Should see the actual image! ✅

---

## 🆘 Still Having Issues?

### Error: "Bucket already exists"

The bucket might exist but you can't see it due to permissions.

**Solution:**
1. Grant Storage Admin role (as described above)
2. Or ask the bucket owner to grant you access

### Error: "Permission denied"

**Solution:**
1. Make sure you're editing the correct service account
2. Wait 2-3 minutes after granting permissions
3. Try logging out and back into Google Cloud Console
4. Clear browser cache

### Error: "Service account not found"

**Solution:**
1. Verify the service account email is correct
2. Check you're in the right project (auto-ads-465719)
3. The service account should be visible in the IAM page

---

## ✅ Quick Checklist

- [ ] Go to IAM console
- [ ] Find service account: `mark-motors-group-inventory-ph@...`
- [ ] Remove "Storage Object Admin" role
- [ ] Add "Storage Admin" role
- [ ] Click SAVE
- [ ] Wait 1-2 minutes
- [ ] Run: `node check-bucket-exists.js`
- [ ] See: ✅ Everything is working correctly!
- [ ] Restart app
- [ ] Upload store image
- [ ] Image displays correctly!

---

## 📞 Summary

**Current Role:** Storage Object Admin (not enough)  
**Needed Role:** Storage Admin (full access)

**Action:** Replace Storage Object Admin with Storage Admin

**Time:** 2 minutes  
**Difficulty:** Easy  
**Impact:** Fixes all image uploads

---

**Next:** After granting Storage Admin, run `node check-bucket-exists.js` to verify! 🚀
