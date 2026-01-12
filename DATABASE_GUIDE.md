# Database Management Guide

## Overview
This project uses Prisma as the ORM with PostgreSQL as the database. This guide covers all database operations including migrations, seeding, and updates.

## Prerequisites
- PostgreSQL database running (local or remote)
- `.env` file with `DATABASE_URL` configured
- Node.js and npm installed

## Database Commands

### 1. Create a New Migration
When you make changes to `prisma/schema.prisma`, create a migration:

```bash
npm run db:migrate
```

This will:
- Generate SQL migration files
- Apply the migration to your database
- Regenerate the Prisma Client
- Prompt you for a migration name

**Example:**
```bash
npm run db:migrate
# Enter migration name: add_super_admin_role
```

### 2. Seed the Database
Populate the database with initial data:

```bash
npm run db:seed
```

This will create:
- **Super Admin Account**
  - Email: `superadmin@markmotors.com`
  - Password: `superadmin123`
  - Role: SUPER_ADMIN

- **Admin Account**
  - Email: `admin@markmotors.com`
  - Password: `admin123`
  - Role: ADMIN

- **Photographer Account**
  - Email: `photographer@markmotors.com`
  - Password: `photo123`
  - Role: PHOTOGRAPHER

- **9 Store Locations** (Mark Motors Group locations across GTA)
- **3 Sample Vehicles** (for the first store)

### 3. Reset Database
**⚠️ WARNING: This will delete ALL data!**

```bash
npm run db:reset
```

This will:
- Drop the database
- Recreate it
- Run all migrations
- Run the seed script

Use this when you want a fresh start or need to fix migration issues.

### 4. Open Prisma Studio
Visual database browser:

```bash
npm run db:studio
```

This opens a web interface at `http://localhost:5555` where you can:
- View all tables and data
- Edit records directly
- Run queries
- Manage relationships

## Common Workflows

### Updating the Database Schema

1. **Edit the schema:**
   ```bash
   # Edit prisma/schema.prisma
   # Add/modify models, fields, enums, etc.
   ```

2. **Create and apply migration:**
   ```bash
   npm run db:migrate
   # Enter a descriptive name for the migration
   ```

3. **Verify changes:**
   ```bash
   npm run db:studio
   # Check that your changes are reflected
   ```

### Adding New Seed Data

1. **Edit the seed file:**
   ```bash
   # Edit prisma/seed.ts
   # Add new users, stores, vehicles, etc.
   ```

2. **Run the seed:**
   ```bash
   npm run db:seed
   ```

3. **Verify:**
   ```bash
   npm run db:studio
   # Check that new data was added
   ```

### Fixing Migration Issues

If you encounter migration errors:

1. **Check migration status:**
   ```bash
   npx prisma migrate status
   ```

2. **If migrations are out of sync, reset:**
   ```bash
   npm run db:reset
   # This will recreate everything from scratch
   ```

3. **If you need to keep data, manually fix:**
   ```bash
   # Resolve conflicts in migration files
   npx prisma migrate resolve --applied <migration-name>
   ```

## Database Schema Overview

### User Roles
- `PHOTOGRAPHER` - Can upload and manage vehicle photos
- `ADMIN` - Can delete vehicles and manage store data
- `SUPER_ADMIN` - Full system access (future features)

### Image Types
- `FRONT_QUARTER` - Front quarter view
- `FRONT` - Front view
- `BACK_QUARTER` - Back quarter view
- `BACK` - Back view
- `DRIVER_SIDE` - Driver side profile
- `PASSENGER_SIDE` - Passenger side profile
- `GALLERY_EXTERIOR` - Additional exterior photos
- `GALLERY_INTERIOR` - Interior photos
- `GALLERY` - Legacy gallery images (uncategorized)

### Processing Status
- `NOT_STARTED` - Vehicle created, no processing started
- `IN_PROGRESS` - Images being processed
- `COMPLETED` - All images processed
- `ERROR` - Processing failed

## Environment Variables

Ensure your `.env` file has:

```env
DATABASE_URL="postgresql://user:password@localhost:5432/dbname"
```

For production, use connection pooling:

```env
DATABASE_URL="postgresql://user:password@host:5432/dbname?pgbouncer=true"
DIRECT_URL="postgresql://user:password@host:5432/dbname"
```

## Troubleshooting

### "Migration failed" error
```bash
# Reset and start fresh
npm run db:reset
```

### "Prisma Client not found" error
```bash
# Regenerate the client
npx prisma generate
```

### "Cannot connect to database" error
```bash
# Check your DATABASE_URL in .env
# Verify PostgreSQL is running
# Test connection:
npx prisma db pull
```

### Seed script fails
```bash
# Check for unique constraint violations
# The seed script uses upsert, so it should be safe to run multiple times
# If it still fails, check the error message and fix the seed.ts file
```

## Production Deployment

### Initial Setup
```bash
# 1. Set DATABASE_URL in production environment
# 2. Run migrations
npx prisma migrate deploy

# 3. Seed the database (optional)
npm run db:seed
```

### Updating Production
```bash
# 1. Create migration locally
npm run db:migrate

# 2. Commit migration files to git
git add prisma/migrations
git commit -m "Add migration: description"

# 3. Deploy to production
# 4. Run migrations on production
npx prisma migrate deploy
```

## Best Practices

1. **Always create migrations for schema changes** - Don't edit the database directly
2. **Test migrations locally first** - Use `db:reset` to test from scratch
3. **Use descriptive migration names** - Makes it easier to track changes
4. **Keep seed data minimal** - Only essential data for development
5. **Use upsert in seeds** - Prevents errors when running seed multiple times
6. **Backup production before migrations** - Always have a rollback plan

## Quick Reference

| Command | Description |
|---------|-------------|
| `npm run db:migrate` | Create and apply migration |
| `npm run db:seed` | Populate database with seed data |
| `npm run db:reset` | Reset database (⚠️ deletes all data) |
| `npm run db:studio` | Open Prisma Studio |
| `npx prisma generate` | Regenerate Prisma Client |
| `npx prisma migrate status` | Check migration status |
| `npx prisma migrate deploy` | Apply migrations (production) |
| `npx prisma db pull` | Pull schema from database |
| `npx prisma db push` | Push schema to database (dev only) |

## Support

For more information:
- [Prisma Documentation](https://www.prisma.io/docs)
- [Prisma Migrate Guide](https://www.prisma.io/docs/concepts/components/prisma-migrate)
- [Prisma Seeding Guide](https://www.prisma.io/docs/guides/database/seed-database)
