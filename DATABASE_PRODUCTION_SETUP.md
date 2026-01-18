# Production Database Setup Guide

**Goal:** Set up a production PostgreSQL database and get the connection string  
**Recommended:** Google Cloud SQL (since you're already using Google Cloud)  
**Date:** January 16, 2026

---

## Option 1: Google Cloud SQL (Recommended) ⭐

Since you're already using Google Cloud Storage with project `auto-ads-465719`, this is the easiest option.

### Step 1: Create Cloud SQL Instance

#### Via Google Cloud Console (Web UI)

1. **Go to Cloud SQL**
   - Visit: https://console.cloud.google.com/sql
   - Make sure project `auto-ads-465719` is selected (top left)

2. **Create Instance**
   - Click "CREATE INSTANCE"
   - Choose "PostgreSQL"
   - Click "Choose PostgreSQL"

3. **Configure Instance**

   **Instance ID:** `vehicle-inventory-db` (or your preferred name)
   
   **Password:** Set a strong password for the `postgres` user
   - Suggestion: `CDssyu1o7LJ0nO3osV3qxWlqRHAvvw`
   - Or generate your own: `openssl rand -base64 24`
   - **SAVE THIS PASSWORD** - you'll need it for the connection string
   
   **Database Version:** PostgreSQL 15 (or latest)
   
   **Region:** Choose closest to your application
   - `us-central1` (Iowa)
   - `us-east1` (South Carolina)
   - `us-west1` (Oregon)
   - Or your preferred region
   
   **Zonal availability:** Single zone (for development/testing)
   - For production: Choose "Multiple zones (Highly available)"
   
   **Machine type:**
   - Development: Shared core (1 vCPU, 0.614 GB) - ~$10/month
   - Production: Dedicated core (2 vCPU, 8 GB) - ~$100/month
   - Start small, scale up as needed

4. **Configure Connections**
   
   Under "Connections" section:
   - ✅ Enable "Public IP"
   - Click "ADD NETWORK"
   - Name: "My Computer" (or "Allow All" for testing)
   - Network: `0.0.0.0/0` (allows all IPs - restrict this in production!)
   - For production: Add only your application's IP addresses

5. **Create Instance**
   - Click "CREATE INSTANCE"
   - Wait 5-10 minutes for instance to be created

### Step 2: Create Database

1. **Go to Your Instance**
   - Click on your instance name: `vehicle-inventory-db`

2. **Create Database**
   - Click "DATABASES" tab
   - Click "CREATE DATABASE"
   - Database name: `vehicle_inventory`
   - Click "CREATE"

### Step 3: Get Connection Details

1. **Find Connection Information**
   - Go to "OVERVIEW" tab
   - Note these details:
     - **Public IP address:** (e.g., `34.123.45.67`)
     - **Connection name:** (e.g., `auto-ads-465719:us-central1:vehicle-inventory-db`)

2. **Build Connection String**

   **Format A: Public IP (Easiest for getting started)**
   ```
   postgresql://postgres:YOUR_PASSWORD@PUBLIC_IP:5432/vehicle_inventory?sslmode=require
   ```

   **Example:**
   ```
   postgresql://postgres:CDssyu1o7LJ0nO3osV3qxWlqRHAvvw@34.123.45.67:5432/vehicle_inventory?sslmode=require
   ```

   **Format B: Unix Socket (For Cloud Run/App Engine)**
   ```
   postgresql://postgres:YOUR_PASSWORD@/vehicle_inventory?host=/cloudsql/auto-ads-465719:REGION:vehicle-inventory-db
   ```

### Step 4: Test Connection

Test from your local machine:

```bash
# Install PostgreSQL client if needed
# Windows: Download from https://www.postgresql.org/download/windows/
# Mac: brew install postgresql
# Linux: apt-get install postgresql-client

# Test connection
psql "postgresql://postgres:YOUR_PASSWORD@PUBLIC_IP:5432/vehicle_inventory?sslmode=require"
```

Or test with Node.js:

```bash
node -e "
const { Client } = require('pg');
const client = new Client({
  connectionString: 'postgresql://postgres:YOUR_PASSWORD@PUBLIC_IP:5432/vehicle_inventory?sslmode=require'
});
client.connect()
  .then(() => { console.log('✅ Connected!'); client.end(); })
  .catch(err => console.error('❌ Error:', err.message));
"
```

### Step 5: Update .env File

```env
DATABASE_URL="postgresql://postgres:YOUR_PASSWORD@YOUR_PUBLIC_IP:5432/vehicle_inventory?sslmode=require"
```

### Step 6: Run Migrations

```bash
npm run db:migrate
```

### 💰 Cost Estimate

- **Shared Core (Development):** ~$10-15/month
- **Dedicated 2 vCPU (Production):** ~$100-150/month
- **Storage:** ~$0.17/GB/month
- **Backups:** ~$0.08/GB/month

**Tip:** Start with shared core, upgrade when needed.

---

## Option 2: Google Cloud SQL via gcloud CLI

If you prefer command line:

```bash
# Install gcloud CLI if needed
# https://cloud.google.com/sdk/docs/install

# Set project
gcloud config set project auto-ads-465719

# Create instance
gcloud sql instances create vehicle-inventory-db \
  --database-version=POSTGRES_15 \
  --tier=db-f1-micro \
  --region=us-central1 \
  --root-password=YOUR_STRONG_PASSWORD

# Create database
gcloud sql databases create vehicle_inventory \
  --instance=vehicle-inventory-db

# Get connection info
gcloud sql instances describe vehicle-inventory-db

# Allow your IP
gcloud sql instances patch vehicle-inventory-db \
  --authorized-networks=YOUR_IP_ADDRESS
```

---

## Option 3: Neon (Serverless PostgreSQL) 🚀

Free tier available, great for development/small projects.

### Step 1: Sign Up

1. Go to: https://neon.tech
2. Sign up with GitHub/Google
3. Create a new project

### Step 2: Create Database

1. Project name: `vehicle-inventory`
2. PostgreSQL version: 15
3. Region: Choose closest to you
4. Click "Create Project"

### Step 3: Get Connection String

1. Copy the connection string shown (it's automatically generated)
2. Format: `postgresql://user:password@host/database?sslmode=require`

### Step 4: Update .env

```env
DATABASE_URL="postgresql://user:password@ep-xxx.region.aws.neon.tech/vehicle_inventory?sslmode=require"
```

**Pros:**
- ✅ Free tier (0.5 GB storage, 1 GB data transfer)
- ✅ Instant setup (30 seconds)
- ✅ Auto-scaling
- ✅ Generous free tier

**Cons:**
- ⚠️ Not in Google Cloud (slight latency if using GCS)

---

## Option 4: Supabase (PostgreSQL + Extras)

Free tier with 500 MB database.

### Step 1: Sign Up

1. Go to: https://supabase.com
2. Sign up with GitHub/Google
3. Create new project

### Step 2: Configure

1. Project name: `vehicle-inventory`
2. Database password: Generate strong password
3. Region: Choose closest to you
4. Click "Create new project"

### Step 3: Get Connection String

1. Go to Project Settings > Database
2. Copy "Connection string" under "Connection pooling"
3. Replace `[YOUR-PASSWORD]` with your password

### Step 4: Update .env

```env
DATABASE_URL="postgresql://postgres.xxx:password@aws-0-region.pooler.supabase.com:5432/postgres?sslmode=require"
```

**Pros:**
- ✅ Free tier (500 MB database)
- ✅ Includes auth, storage, realtime features
- ✅ Easy setup

**Cons:**
- ⚠️ Not in Google Cloud

---

## Option 5: Railway

Simple deployment platform with PostgreSQL.

### Step 1: Sign Up

1. Go to: https://railway.app
2. Sign up with GitHub
3. Create new project

### Step 2: Add PostgreSQL

1. Click "New" > "Database" > "Add PostgreSQL"
2. Wait for provisioning (1-2 minutes)

### Step 3: Get Connection String

1. Click on PostgreSQL service
2. Go to "Connect" tab
3. Copy "Postgres Connection URL"

### Step 4: Update .env

```env
DATABASE_URL="postgresql://postgres:password@region.railway.app:5432/railway?sslmode=require"
```

**Pros:**
- ✅ $5 free credit/month
- ✅ Very simple setup
- ✅ Good for small projects

---

## Option 6: Local PostgreSQL (Development Only)

For local testing before setting up production database.

### Windows

1. **Download PostgreSQL**
   - Go to: https://www.postgresql.org/download/windows/
   - Download installer
   - Run installer, set password for `postgres` user

2. **Create Database**
   ```cmd
   psql -U postgres
   CREATE DATABASE vehicle_inventory;
   \q
   ```

3. **Connection String**
   ```env
   DATABASE_URL="postgresql://postgres:your_password@localhost:5432/vehicle_inventory"
   ```

### Using Docker (All Platforms)

```bash
# Start PostgreSQL container
docker run --name vehicle-inventory-db \
  -e POSTGRES_PASSWORD=password \
  -e POSTGRES_DB=vehicle_inventory \
  -p 5432:5432 \
  -d postgres:15

# Connection string
DATABASE_URL="postgresql://postgres:password@localhost:5432/vehicle_inventory"
```

---

## Comparison Table

| Option | Cost | Setup Time | Best For | Location |
|--------|------|------------|----------|----------|
| **Google Cloud SQL** | $10-150/mo | 10 min | Production, already using GCP | Google Cloud |
| **Neon** | Free-$20/mo | 30 sec | Development, small projects | AWS |
| **Supabase** | Free-$25/mo | 2 min | Full-stack features | AWS |
| **Railway** | $5/mo | 2 min | Simple deployment | Various |
| **Local/Docker** | Free | 5 min | Local development only | Local |

---

## Recommended Path

### For Production (Recommended)

**Use Google Cloud SQL** since you're already using:
- Google Cloud project: `auto-ads-465719`
- Google Cloud Storage
- Same region = lower latency
- Integrated billing and management

### For Quick Testing

**Use Neon or Supabase** to get started immediately:
- Free tier available
- Setup in under 2 minutes
- Migrate to Cloud SQL later

---

## Security Best Practices

### 1. Strong Password

Generate secure password:
```bash
openssl rand -base64 24
```

### 2. Restrict IP Access

Don't use `0.0.0.0/0` in production. Instead:
- Add only your application's IP addresses
- Use Cloud SQL Proxy for secure connections
- Enable SSL/TLS (use `sslmode=require`)

### 3. Connection Pooling

For production, use connection pooling:
```env
DATABASE_URL="postgresql://user:password@host:5432/database?sslmode=require&pool_timeout=30&connect_timeout=10"
```

### 4. Backups

Enable automated backups:
- Google Cloud SQL: Enable in console (Backups tab)
- Most managed services: Enabled by default

---

## Troubleshooting

### "Connection refused"

- ✅ Check database is running
- ✅ Verify IP address is correct
- ✅ Check firewall rules allow your IP
- ✅ Ensure port 5432 is open

### "Password authentication failed"

- ✅ Verify password is correct
- ✅ Check username (usually `postgres`)
- ✅ Ensure no extra spaces in connection string

### "SSL required"

Add to connection string:
```
?sslmode=require
```

### "Too many connections"

- Increase connection limit in database settings
- Implement connection pooling
- Check for connection leaks in code

---

## Next Steps

1. **Choose your option** (Google Cloud SQL recommended)
2. **Create database** following steps above
3. **Get connection string**
4. **Update .env file:**
   ```env
   DATABASE_URL="your-connection-string-here"
   ```
5. **Test connection:**
   ```bash
   node check-db-status.js
   ```
6. **Run migrations:**
   ```bash
   npm run db:migrate
   ```
7. **Validate configuration:**
   ```bash
   node validate-production-config.js
   ```

---

## Quick Start Commands

After setting up database:

```bash
# 1. Update .env with your DATABASE_URL

# 2. Test connection
node check-db-status.js

# 3. Run migrations
npm run db:migrate

# 4. Verify everything works
node validate-production-config.js

# 5. Build and test
npm run build
npm run start
```

---

**Need Help?** 
- Google Cloud SQL docs: https://cloud.google.com/sql/docs/postgres
- Neon docs: https://neon.tech/docs
- Supabase docs: https://supabase.com/docs

**Estimated Time:** 10-15 minutes for Google Cloud SQL, 2-3 minutes for Neon/Supabase
