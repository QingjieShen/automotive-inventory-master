# Ready to Deploy - Final Steps

**Status:** Almost ready! Just 3 things left to configure  
**Date:** January 16, 2026

## ✅ What's Already Done (90% Complete!)

Your `.env` file has been updated with:

1. ✅ **Google Cloud Storage** - Fully configured
   - Project ID: `auto-ads-465719`
   - Service account file: Present and verified
   - Bucket: `mmg-vehicle-inventory`

2. ✅ **Gemini API** - Configured
   - API key set
   - Endpoint configured

3. ✅ **Security Secrets** - Generated
   - NextAuth secret: Secure 32-byte key
   - CDK API key: Secure hex key

4. ✅ **Service Account** - Verified
   - File exists: `auto-ads-465719-e3bf3d627908.json`

## 🔴 3 Things You Need to Complete

### 1. Production Database URL

**Current:** `postgresql://username:password@localhost:5432/vehicle_inventory`  
**Status:** Points to localhost (won't work in production)

**What to do:**
Replace with your actual production database connection string.

**If using Google Cloud SQL:**
```env
DATABASE_URL="postgresql://YOUR_USER:YOUR_PASSWORD@/vehicle_inventory?host=/cloudsql/auto-ads-465719:REGION:INSTANCE"
```

**If using other PostgreSQL:**
```env
DATABASE_URL="postgresql://YOUR_USER:YOUR_PASSWORD@YOUR_HOST:5432/vehicle_inventory?sslmode=require"
```

### 2. Production Domain

**Current:** `http://localhost:3000`  
**Status:** Localhost URLs won't work in production

**What to do:**
Update these two variables with your actual production domain:

```env
NEXTAUTH_URL="https://your-domain.com"
NEXT_PUBLIC_BASE_URL="https://your-domain.com"
```

**Important:** Must use `https://` (not `http://`)

### 3. Node Environment

**Current:** `development`  
**Status:** Should be `production` for deployment

**What to do:**
Change this when you're ready to deploy:

```env
NODE_ENV="production"
```

## 🚀 Quick Deploy Instructions

### Step 1: Update .env File

Open `.env` and update these 3 sections:

```env
# 1. Update database (replace with your actual database)
DATABASE_URL="postgresql://YOUR_USER:YOUR_PASSWORD@YOUR_HOST:5432/vehicle_inventory?sslmode=require"

# 2. Update domain (replace with your actual domain)
NEXTAUTH_URL="https://your-domain.com"
NEXT_PUBLIC_BASE_URL="https://your-domain.com"

# 3. Set to production
NODE_ENV="production"
```

### Step 2: Validate

```bash
node validate-production-config.js
```

You should see: ✅ "Configuration looks good for production!"

### Step 3: Run Migrations

```bash
npm run db:migrate
```

### Step 4: Build

```bash
npm run build
```

### Step 5: Deploy

Deploy to your hosting platform (Vercel, AWS, Google Cloud Run, etc.)

## 📋 Pre-Deployment Checklist

Before deploying, make sure:

- [ ] Production database is created and accessible
- [ ] Database has `vehicle_inventory` database created
- [ ] You know your production domain URL
- [ ] `.env` file is updated with all 3 items above
- [ ] Validation passes: `node validate-production-config.js`
- [ ] Build succeeds: `npm run build`
- [ ] GCS bucket `mmg-vehicle-inventory` exists in Google Cloud
- [ ] Service account has "Storage Object Admin" permissions

## 🔍 Test Before Deploying

### Test Database Connection

```bash
node check-db-status.js
```

### Test Build

```bash
npm run build
```

### Test Production Mode Locally

```bash
# After updating .env with production values
npm run build
npm run start
```

Visit http://localhost:3000 to test locally with production configuration.

## 📞 Need Help?

### Don't have a production database yet?

**Option 1: Google Cloud SQL (Recommended)**
1. Go to https://console.cloud.google.com/sql
2. Click "Create Instance"
3. Choose PostgreSQL
4. Create database: `vehicle_inventory`
5. Get connection string

**Option 2: Quick Development Database**
If you just want to test, you can use your local database temporarily:
```env
DATABASE_URL="postgresql://postgres:password@localhost:5432/vehicle_inventory"
```
But remember to switch to a real production database before going live!

### Don't have a domain yet?

**For Testing:**
You can use localhost temporarily:
```env
NEXTAUTH_URL="http://localhost:3000"
NEXT_PUBLIC_BASE_URL="http://localhost:3000"
```

**For Production:**
You'll need a real domain. Options:
- Use your hosting platform's provided domain (e.g., `your-app.vercel.app`)
- Register a custom domain
- Use a subdomain of your existing domain

## 🎯 Summary

**You're 90% done!** Just need:

1. **Database connection string** - Get from your database provider
2. **Production domain** - Your app's URL
3. **Set NODE_ENV** - Change to "production" when deploying

Everything else (GCS, Gemini API, security keys) is already configured! ✅

---

**Next:** Update the 3 items above, run `node validate-production-config.js`, and you're ready to deploy! 🚀
