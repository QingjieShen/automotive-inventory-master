# Fix Database Connection Issue

**Error:** Can't reach database server at `34.130.125.67:5432`

**Your Connection String:** ✅ Correct format!
```
postgresql://postgres:CDssyu1o7LJ0nO3osV3qxWlqRHAvvw@34.130.125.67:5432/vehicle_inventory?sslmode=require
```

**IP Address:** ✅ Using correct Public IP (34.130.125.67)

---

## 🔍 Diagnosis

The connection string is correct, but we can't reach the database. This is usually a **firewall/authorization issue**.

---

## ✅ Step-by-Step Fix

### Step 1: Verify Instance is Running

1. Go to: https://console.cloud.google.com/sql/instances
2. Find your instance: `vehicle-inventory`
3. Check status: Should show **green checkmark** and "Running"
4. If not running: Click on it and start it

### Step 2: Check Database Exists

1. Click on your instance: `vehicle-inventory`
2. Go to **DATABASES** tab
3. Verify `vehicle_inventory` database exists
4. If not: Click "CREATE DATABASE", name it `vehicle_inventory`

### Step 3: Authorize Your IP Address (CRITICAL)

This is the most common issue!

1. Click on your instance: `vehicle-inventory`
2. Go to **CONNECTIONS** tab
3. Scroll to **Authorized networks**
4. Click **ADD NETWORK**

**Option A: Allow Your Current IP (Secure)**
```
Name: My Computer
Network: [Your IP]/32
```

To find your IP: https://whatismyipaddress.com/

**Option B: Allow All IPs (Testing Only - NOT for production)**
```
Name: Allow All (Testing)
Network: 0.0.0.0/0
```

⚠️ **Warning:** `0.0.0.0/0` allows connections from anywhere. Use only for testing!

5. Click **DONE**
6. Click **SAVE** at the bottom
7. Wait 1-2 minutes for changes to apply

### Step 4: Verify Public IP is Enabled

1. Still in **CONNECTIONS** tab
2. Check **Public IP** section
3. Should say: "Enabled"
4. If disabled: Enable it and save

### Step 5: Test Connection Again

```bash
npm run db:migrate
```

---

## 🎯 Quick Fix (Most Common)

**The issue is usually:** Your IP address isn't authorized.

**Quick solution:**
1. Go to Cloud SQL instance
2. Connections → Authorized networks
3. Add: `0.0.0.0/0` (for testing)
4. Save and wait 1-2 minutes
5. Try again: `npm run db:migrate`

---

## 🔐 Security Note

After testing works with `0.0.0.0/0`, you should:

1. Find your actual IP: https://whatismyipaddress.com/
2. Replace `0.0.0.0/0` with `YOUR_IP/32`
3. Or use Cloud SQL Proxy for secure connections

---

## 🆘 Still Not Working?

### Check 1: Instance Status
```
Go to: https://console.cloud.google.com/sql/instances
Status should be: Running (green checkmark)
```

### Check 2: Connection Details Match
From your screenshot:
- ✅ Public IP: `34.130.125.67`
- ✅ Port: `5432`
- ✅ Connection name: `auto-ads-465719:northamerica-northeast2:vehicle-inventory`

### Check 3: Password
Make sure password in .env matches what you set:
```
CDssyu1o7LJ0nO3osV3qxWlqRHAvvw
```

### Check 4: Firewall
- Check Windows Firewall isn't blocking port 5432
- Check any antivirus/security software

---

## 📋 Checklist

Before trying again, verify:

- [ ] Cloud SQL instance is **Running** (green checkmark)
- [ ] Database `vehicle_inventory` exists
- [ ] **Public IP connectivity** is **Enabled**
- [ ] Your IP is in **Authorized networks** (or `0.0.0.0/0` for testing)
- [ ] Waited 1-2 minutes after making changes
- [ ] Using correct Public IP: `34.130.125.67`
- [ ] Password is correct in .env

---

## 🚀 After It Works

Once connection succeeds:

```bash
# 1. Run migrations
npm run db:migrate

# 2. Check database
node check-db-status.js

# 3. Seed database (optional)
npm run db:seed

# 4. Validate config
node validate-production-config.js
```

---

## 💡 Alternative: Cloud SQL Proxy (Advanced)

If you continue having issues, you can use Cloud SQL Proxy:

```bash
# Download Cloud SQL Proxy
# https://cloud.google.com/sql/docs/postgres/sql-proxy

# Run proxy
cloud-sql-proxy auto-ads-465719:northamerica-northeast2:vehicle-inventory

# Update .env to use localhost
DATABASE_URL="postgresql://postgres:CDssyu1o7LJ0nO3osV3qxWlqRHAvvw@localhost:5432/vehicle_inventory"
```

---

## 📞 Most Likely Solution

**90% of the time, the issue is:**

1. Go to: https://console.cloud.google.com/sql/instances
2. Click your instance
3. Go to: **CONNECTIONS** tab
4. Under **Authorized networks**, click **ADD NETWORK**
5. Add: `0.0.0.0/0` (for testing)
6. Click **SAVE**
7. Wait 2 minutes
8. Try: `npm run db:migrate`

This should work! ✅

---

**Need more help?** Share any error messages you see after following these steps.
