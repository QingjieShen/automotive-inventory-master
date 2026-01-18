# Production Readiness Checklist

**Generated:** January 16, 2026  
**Environment:** Production Deployment

## 🔴 CRITICAL ISSUES - Must Fix Before Production

### 1. Environment Variables - Currently Using Development Values

Your `.env` file contains **development placeholder values** that will cause failures in production:

```env
# ❌ CRITICAL: These are development placeholders
DATABASE_URL="postgresql://postgres:password@localhost:5432/vehicle_inventory"
NEXTAUTH_SECRET="development-secret-key-change-in-production"
AWS_ACCESS_KEY_ID="development-key"
AWS_SECRET_ACCESS_KEY="development-secret"
GEMINI_API_KEY="development-gemini-key"
```

### 2. Database Configuration

**Current Issue:** Using local PostgreSQL with weak credentials
- Database: `localhost:5432` (not accessible in production)
- Password: `password` (insecure)

**Required for Production:**
```env
DATABASE_URL="postgresql://[username]:[secure-password]@[production-host]:[port]/vehicle_inventory"
```

Options:
- Google Cloud SQL (recommended, matches your GCS setup)
- Managed PostgreSQL service (AWS RDS, Azure Database, etc.)
- Self-hosted with proper security

### 3. NextAuth Configuration

**Current Issues:**
- `NEXTAUTH_SECRET`: Using development placeholder
- `NEXTAUTH_URL`: Set to localhost

**Required Actions:**
```env
# Generate a secure secret (run this command):
# openssl rand -base64 32

NEXTAUTH_SECRET="[generate-secure-32-byte-secret]"
NEXTAUTH_URL="https://your-production-domain.com"
```

### 4. Google Cloud Storage - Partially Configured ✅

**Status:** Service account file exists ✅
- File: `auto-ads-465719-e3bf3d627908.json` (present)
- Project ID: `auto-ads-465719` (configured)
- Bucket: `mmg-vehicle-inventory` (configured)

**Missing Configuration:**
```env
# Optional but recommended for production
GOOGLE_CLOUD_CDN_DOMAIN="cdn.your-domain.com"
```

**Action Required:**
1. Verify the service account has these permissions:
   - Storage Object Admin
   - Cloud SQL Client (if using Cloud SQL)
2. Ensure bucket exists and has proper access policies
3. Consider setting up Cloud CDN for better performance

### 5. AWS Configuration - Deprecated but Still Referenced

**Status:** Marked as deprecated in `.env.example` but still has placeholder values

**Current Code:** Your app has fallback logic to AWS S3 in `src/lib/s3.ts`

**Recommended Actions:**
- **Option A (Recommended):** Remove AWS dependencies entirely if migrated to GCS
- **Option B:** Configure real AWS credentials if you need dual storage

If keeping AWS:
```env
AWS_ACCESS_KEY_ID="[real-aws-access-key]"
AWS_SECRET_ACCESS_KEY="[real-aws-secret-key]"
AWS_REGION="us-east-1"
AWS_S3_BUCKET="mmg-vehicle-inventory"
AWS_CLOUDFRONT_DOMAIN="[your-cloudfront-domain].cloudfront.net"
```

### 6. Gemini API Configuration

**Current Issue:** Development placeholder key
```env
GEMINI_API_KEY="development-gemini-key"
```

**Required Action:**
```env
GEMINI_API_KEY="[your-real-gemini-api-key]"
GEMINI_API_URL="https://api.gemini.com/v1"
```

**Note:** Based on your code, this is used for AI-powered image processing. Verify:
- API key is valid and has sufficient quota
- Endpoint URL is correct for production

### 7. CDK One-Eighty API Key

**Status:** Configured ✅
```env
CDK_API_KEY="1d2241c2a5d2e291ffef7ee3dd26ba9612a3b69593fa1bf007d1ebad814247a4"
```

**Action Required:**
- Verify this key is production-ready (not a test key)
- Update `NEXT_PUBLIC_BASE_URL` to production domain:
```env
NEXT_PUBLIC_BASE_URL="https://your-production-domain.com"
```

## 🟡 IMPORTANT - Recommended Before Production

### 8. Node Environment

**Current:** `NODE_ENV="development"`

**Required:**
```env
NODE_ENV="production"
```

### 9. Security Headers & Next.js Configuration

Your `next.config.ts` is minimal. Consider adding production security:

```typescript
import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  // Image optimization domains
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'storage.googleapis.com',
      },
      {
        protocol: 'https',
        hostname: 'mmg-vehicle-inventory.storage.googleapis.com',
      },
    ],
  },
  
  // Security headers
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on'
          },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=63072000; includeSubDomains; preload'
          },
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN'
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff'
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin'
          },
        ],
      },
    ]
  },
}

export default nextConfig
```

### 10. Database Migration Strategy

**Before deploying:**
```bash
# Run migrations on production database
npm run db:migrate

# DO NOT run db:seed in production (it's for development data)
```

### 11. Service Account Security

**Current:** Service account JSON file in repository root

**Security Concerns:**
- ✅ File is in `.gitignore` (verify this)
- ⚠️ Consider using environment variable instead for deployment

**For deployment platforms (Vercel, AWS, etc.):**
```env
# Use inline JSON instead of file path
GOOGLE_APPLICATION_CREDENTIALS_JSON='{"type":"service_account","project_id":"auto-ads-465719",...}'
```

## 🟢 VERIFIED - Already Configured

### ✅ Google Cloud Project
- Project ID: `auto-ads-465719`
- Service account file present
- Bucket name configured

### ✅ CDK API Key
- Secure key generated
- Configured in environment

### ✅ Prisma Configuration
- Schema properly configured
- Database URL from environment variable
- Migrations directory set up

## 📋 Production Deployment Checklist

### Pre-Deployment

- [ ] Generate secure `NEXTAUTH_SECRET` (32+ bytes)
- [ ] Set up production database (Cloud SQL or managed PostgreSQL)
- [ ] Update `DATABASE_URL` with production credentials
- [ ] Obtain real `GEMINI_API_KEY` from Gemini
- [ ] Verify Google Cloud service account permissions
- [ ] Ensure GCS bucket exists and is accessible
- [ ] Update `NEXTAUTH_URL` to production domain
- [ ] Update `NEXT_PUBLIC_BASE_URL` to production domain
- [ ] Set `NODE_ENV="production"`
- [ ] Decide on AWS: remove or configure properly
- [ ] Add security headers to `next.config.ts`
- [ ] Review and update `.gitignore` (ensure secrets are excluded)

### Deployment

- [ ] Run `npm run build` locally to test production build
- [ ] Run database migrations on production database
- [ ] Deploy application to hosting platform
- [ ] Set environment variables in hosting platform
- [ ] Upload service account JSON or use inline credentials
- [ ] Test image upload to GCS
- [ ] Test authentication flow
- [ ] Test CDK CSV feed endpoint
- [ ] Verify database connectivity

### Post-Deployment

- [ ] Monitor application logs for errors
- [ ] Test all critical user flows
- [ ] Verify image processing pipeline
- [ ] Check API response times
- [ ] Set up monitoring/alerting (optional but recommended)
- [ ] Configure backups for database
- [ ] Set up SSL certificate (if not handled by platform)

## 🔧 Quick Fix Commands

### Generate NextAuth Secret
```bash
openssl rand -base64 32
```

### Generate CDK API Key (if needed)
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### Test Database Connection
```bash
node check-db-status.js
```

### Build for Production
```bash
npm run build
```

### Run Production Server Locally (for testing)
```bash
npm run start
```

## 📞 Service Dependencies Summary

| Service | Status | Action Required |
|---------|--------|-----------------|
| PostgreSQL Database | 🔴 Development | Set up production database |
| NextAuth | 🔴 Insecure | Generate secure secret |
| Google Cloud Storage | 🟡 Partial | Verify permissions & bucket |
| Gemini API | 🔴 Placeholder | Get real API key |
| AWS S3 | 🟡 Deprecated | Remove or configure |
| CDK API | 🟢 Configured | Update base URL |

## 🚨 Security Reminders

1. **Never commit** `.env` file to version control
2. **Rotate secrets** regularly in production
3. **Use strong passwords** for database (16+ characters, mixed case, numbers, symbols)
4. **Enable 2FA** on all cloud service accounts
5. **Restrict service account permissions** to minimum required
6. **Monitor API usage** to detect anomalies
7. **Set up rate limiting** on API endpoints
8. **Enable HTTPS only** in production

## 📚 Additional Resources

- [Next.js Deployment Documentation](https://nextjs.org/docs/deployment)
- [Google Cloud Storage Setup](https://cloud.google.com/storage/docs/creating-buckets)
- [NextAuth.js Production Checklist](https://next-auth.js.org/deployment)
- [Prisma Production Best Practices](https://www.prisma.io/docs/guides/performance-and-optimization/connection-management)
