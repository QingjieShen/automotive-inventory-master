# Production Setup Guide - Quick Start

**Status:** Your application is currently configured for **DEVELOPMENT ONLY**  
**Action Required:** Follow this guide to prepare for production deployment

## 🚀 Quick Setup (5 Steps)

### Step 1: Generate Secure Secrets

```bash
node generate-secrets.js
```

This will generate:
- `NEXTAUTH_SECRET` (for session encryption)
- `CDK_API_KEY` (for CSV feed security)
- Suggested database password

**Save these values** - you'll need them in Step 3.

### Step 2: Set Up Production Database

Choose one of these options:

**Option A: Google Cloud SQL (Recommended)**
1. Go to [Google Cloud Console](https://console.cloud.google.com/sql)
2. Create a PostgreSQL instance
3. Create database: `vehicle_inventory`
4. Note the connection details

**Option B: Other Managed PostgreSQL**
- AWS RDS
- Azure Database for PostgreSQL
- DigitalOcean Managed Databases
- Heroku Postgres

**Connection String Format:**
```
postgresql://username:password@host:port/vehicle_inventory?sslmode=require
```

### Step 3: Create Production Environment File

```bash
# Copy the template
cp .env.production.template .env.production

# Edit with your values
# (Use your preferred editor)
```

Fill in these **REQUIRED** values:

```env
# Database (from Step 2)
DATABASE_URL="postgresql://user:password@host:port/vehicle_inventory?sslmode=require"

# NextAuth (from Step 1)
NEXTAUTH_SECRET="[generated-secret-from-step-1]"
NEXTAUTH_URL="https://your-actual-domain.com"

# Google Cloud (already configured)
GOOGLE_CLOUD_PROJECT_ID="auto-ads-465719"
GOOGLE_APPLICATION_CREDENTIALS="auto-ads-465719-e3bf3d627908.json"
GOOGLE_CLOUD_STORAGE_BUCKET="mmg-vehicle-inventory"

# Gemini API (get from https://gemini.com/api)
GEMINI_API_KEY="[your-real-gemini-api-key]"
GEMINI_API_URL="https://api.gemini.com/v1"

# CDK Integration (from Step 1)
CDK_API_KEY="[generated-key-from-step-1]"
NEXT_PUBLIC_BASE_URL="https://your-actual-domain.com"

# Environment
NODE_ENV="production"
```

### Step 4: Validate Configuration

```bash
node validate-production-config.js .env.production
```

This will check:
- ✅ All required variables are set
- ✅ No development placeholders remain
- ✅ URLs are production-ready
- ✅ Service account file exists

**Expected Output:** "Configuration looks good for production!"

### Step 5: Deploy

#### 5a. Run Database Migrations

```bash
# Set environment to production
set DATABASE_URL=postgresql://user:password@host:port/vehicle_inventory

# Run migrations
npm run db:migrate
```

#### 5b. Build Application

```bash
npm run build
```

#### 5c. Test Locally (Optional)

```bash
# Use production environment
set NODE_ENV=production

# Start production server
npm run start
```

Visit http://localhost:3000 to test.

#### 5d. Deploy to Platform

Choose your platform:

**Vercel:**
```bash
vercel --prod
```
Set environment variables in Vercel dashboard.

**Docker:**
```bash
docker build -t vehicle-inventory .
docker run -p 3000:3000 --env-file .env.production vehicle-inventory
```

**Other Platforms:**
- Copy `.env.production` values to platform's environment variables
- Deploy using platform's standard process

## 📋 Pre-Deployment Checklist

Before going live, verify:

- [ ] Production database is accessible
- [ ] Database migrations completed successfully
- [ ] Google Cloud Storage bucket exists and is accessible
- [ ] Service account has correct permissions
- [ ] Gemini API key is valid and has quota
- [ ] All environment variables are set in deployment platform
- [ ] SSL certificate is configured (HTTPS)
- [ ] Domain DNS is pointing to your application
- [ ] Test image upload functionality
- [ ] Test authentication flow
- [ ] Test CDK CSV feed endpoint

## 🔍 Verification Commands

### Test Database Connection
```bash
node check-db-status.js
```

### Test Production Build
```bash
npm run build
```

### Validate Environment
```bash
node validate-production-config.js .env.production
```

## 🆘 Troubleshooting

### "Database connection failed"
- Check `DATABASE_URL` is correct
- Verify database is running and accessible
- Check firewall rules allow your application's IP
- Ensure SSL is configured if required

### "Google Cloud Storage error"
- Verify service account file exists
- Check service account has "Storage Object Admin" role
- Ensure bucket name is correct
- Verify bucket exists in Google Cloud Console

### "Gemini API error"
- Verify API key is valid
- Check API quota/limits
- Ensure endpoint URL is correct

### "NextAuth error"
- Verify `NEXTAUTH_SECRET` is at least 32 characters
- Check `NEXTAUTH_URL` matches your actual domain
- Ensure HTTPS is enabled

## 📚 Additional Resources

- [PRODUCTION_READINESS_CHECKLIST.md](./PRODUCTION_READINESS_CHECKLIST.md) - Detailed checklist
- [.env.production.template](./.env.production.template) - Environment template
- [DATABASE_GUIDE.md](./DATABASE_GUIDE.md) - Database setup guide
- [Next.js Deployment Docs](https://nextjs.org/docs/deployment)

## 🔐 Security Reminders

1. **Never commit** `.env.production` to git
2. **Rotate secrets** regularly (every 90 days)
3. **Use strong passwords** (16+ characters)
4. **Enable 2FA** on all cloud accounts
5. **Monitor logs** for suspicious activity
6. **Set up backups** for database
7. **Use HTTPS only** in production

## 📞 Support

If you encounter issues:
1. Check the troubleshooting section above
2. Review error logs in your deployment platform
3. Verify all environment variables are set correctly
4. Run validation script: `node validate-production-config.js`

---

**Last Updated:** January 16, 2026  
**Application:** Automotive Inventory Management System
