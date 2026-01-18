# Missing Configuration for Production

**Status:** Your `.env` file has been updated with all available information  
**Date:** January 16, 2026

## ✅ Already Configured

These are ready to use:

1. **Google Cloud Storage** ✅
   - Project ID: `auto-ads-465719`
   - Service Account: `auto-ads-465719-e3bf3d627908.json`
   - Bucket: `mmg-vehicle-inventory`

2. **Gemini API** ✅
   - API Key: Configured
   - API URL: `https://api.gemini.com/v1`

3. **NextAuth Secret** ✅
   - Generated secure 32-byte secret

4. **CDK API Key** ✅
   - Generated secure API key for CSV feed

## 🔴 REQUIRED: Information You Need to Provide

### 1. Production Database Connection (CRITICAL)

**Current Status:** Using localhost placeholder

**What You Need:**
- Database host/IP address
- Database username
- Database password
- Database port (usually 5432)

**Options:**

#### Option A: Google Cloud SQL (Recommended)
If you're using Google Cloud SQL:

1. Go to [Google Cloud Console > SQL](https://console.cloud.google.com/sql)
2. Create a PostgreSQL instance (or use existing)
3. Create database named: `vehicle_inventory`
4. Get connection details

**Connection String Format:**
```env
# For Cloud SQL with Unix socket
DATABASE_URL="postgresql://USERNAME:PASSWORD@/vehicle_inventory?host=/cloudsql/auto-ads-465719:REGION:INSTANCE_NAME"

# For Cloud SQL with TCP
DATABASE_URL="postgresql://USERNAME:PASSWORD@PUBLIC_IP:5432/vehicle_inventory?sslmode=require"
```

#### Option B: Other PostgreSQL Service
If using AWS RDS, Azure, DigitalOcean, etc.:

```env
DATABASE_URL="postgresql://USERNAME:PASSWORD@HOST:5432/vehicle_inventory?sslmode=require"
```

**Suggested Password:** `CDssyu1o7LJ0nO3osV3qxWlqRHAvvw`  
(Or generate your own strong password)

### 2. Production Domain/URL (CRITICAL)

**Current Status:** Using localhost

**What You Need:**
Your production domain where the app will be hosted

**Examples:**
- `https://inventory.yourdomain.com`
- `https://vehicles.yourdomain.com`
- `https://yourdomain.com`

**Update These Variables:**
```env
NEXTAUTH_URL="https://your-actual-domain.com"
NEXT_PUBLIC_BASE_URL="https://your-actual-domain.com"
```

**Important:** Must use HTTPS in production!

### 3. Node Environment (Easy Fix)

When deploying to production, change:
```env
NODE_ENV="production"
```

## 📋 Quick Action Checklist

- [ ] **Set up production database**
  - [ ] Create PostgreSQL instance
  - [ ] Create `vehicle_inventory` database
  - [ ] Note connection details
  - [ ] Update `DATABASE_URL` in `.env`

- [ ] **Configure production domain**
  - [ ] Determine your production URL
  - [ ] Update `NEXTAUTH_URL` in `.env`
  - [ ] Update `NEXT_PUBLIC_BASE_URL` in `.env`

- [ ] **Verify Google Cloud Storage**
  - [ ] Confirm bucket `mmg-vehicle-inventory` exists
  - [ ] Check service account has "Storage Object Admin" role
  - [ ] Test bucket is accessible

- [ ] **Verify Gemini API**
  - [ ] Confirm API key is valid
  - [ ] Check API quota/limits
  - [ ] Test API endpoint

- [ ] **Before deployment**
  - [ ] Set `NODE_ENV="production"`
  - [ ] Run validation: `node validate-production-config.js`
  - [ ] Run database migrations: `npm run db:migrate`
  - [ ] Test build: `npm run build`

## 🔍 Verification Steps

### Step 1: Update .env File

Edit `.env` and replace the TODO items:

```env
# Replace with your actual database connection
DATABASE_URL="postgresql://YOUR_USER:YOUR_PASSWORD@YOUR_HOST:5432/vehicle_inventory?sslmode=require"

# Replace with your actual domain
NEXTAUTH_URL="https://your-domain.com"
NEXT_PUBLIC_BASE_URL="https://your-domain.com"

# Set to production when deploying
NODE_ENV="production"
```

### Step 2: Validate Configuration

```bash
node validate-production-config.js
```

Expected output: "Configuration looks good for production!"

### Step 3: Test Database Connection

```bash
node check-db-status.js
```

This will verify your database is accessible.

### Step 4: Verify GCS Access

Create a test file to verify GCS:

```bash
node -e "
const { Storage } = require('@google-cloud/storage');
const storage = new Storage({
  projectId: 'auto-ads-465719',
  keyFilename: 'auto-ads-465719-e3bf3d627908.json'
});
storage.bucket('mmg-vehicle-inventory').exists()
  .then(([exists]) => console.log('Bucket exists:', exists))
  .catch(err => console.error('Error:', err.message));
"
```

## 🚨 Common Issues & Solutions

### Issue: "Cannot connect to database"

**Solutions:**
1. Verify database is running
2. Check firewall rules allow your IP
3. Confirm username/password are correct
4. Ensure SSL is configured if required
5. For Cloud SQL, verify instance is running

### Issue: "GCS authentication failed"

**Solutions:**
1. Verify service account file exists: `auto-ads-465719-e3bf3d627908.json`
2. Check service account has correct permissions
3. Confirm project ID is correct
4. Ensure bucket exists in Google Cloud Console

### Issue: "Gemini API error"

**Solutions:**
1. Verify API key is valid
2. Check API quota hasn't been exceeded
3. Confirm endpoint URL is correct
4. Test API key with a simple curl request

## 📞 Next Steps

1. **Gather Information:**
   - Get your production database connection details
   - Determine your production domain

2. **Update .env:**
   - Fill in `DATABASE_URL`
   - Update `NEXTAUTH_URL` and `NEXT_PUBLIC_BASE_URL`
   - Set `NODE_ENV="production"` when ready to deploy

3. **Validate:**
   ```bash
   node validate-production-config.js
   ```

4. **Deploy:**
   - Run migrations: `npm run db:migrate`
   - Build: `npm run build`
   - Deploy to your hosting platform

## 📚 Additional Help

- **Database Setup:** See [DATABASE_GUIDE.md](./DATABASE_GUIDE.md)
- **Full Checklist:** See [PRODUCTION_READINESS_CHECKLIST.md](./PRODUCTION_READINESS_CHECKLIST.md)
- **Setup Guide:** See [PRODUCTION_SETUP_GUIDE.md](./PRODUCTION_SETUP_GUIDE.md)

---

**Summary:** You need to provide:
1. Production database connection string
2. Production domain URL

Everything else is already configured! ✅
