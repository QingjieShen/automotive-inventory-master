# Database Quick Start

## 🚀 First Time Setup

```bash
# 1. Make sure PostgreSQL is running
# 2. Set DATABASE_URL in .env file
# 3. Run migrations
npm run db:migrate

# 4. Seed the database
npm run db:seed
```

## 👤 Default Accounts

After seeding, you can login with:

### Super Admin
- **Email:** `superadmin@markmotors.com`
- **Password:** `superadmin123`
- **Access:** Full system access

### Admin
- **Email:** `admin@markmotors.com`
- **Password:** `admin123`
- **Access:** Can delete vehicles, manage stores

### Photographer
- **Email:** `photographer@markmotors.com`
- **Password:** `photo123`
- **Access:** Can upload and manage photos

## 🔄 Common Operations

### Update Database Schema
```bash
# 1. Edit prisma/schema.prisma
# 2. Create migration
npm run db:migrate
# 3. Enter migration name when prompted
```

### Add New Seed Data
```bash
# 1. Edit prisma/seed.ts
# 2. Run seed
npm run db:seed
```

### View Database
```bash
npm run db:studio
# Opens at http://localhost:5555
```

### Reset Everything (⚠️ Deletes all data!)
```bash
npm run db:reset
```

## 📝 What Gets Seeded

- ✅ 3 User accounts (Super Admin, Admin, Photographer)
- ✅ 9 Store locations (Mark Motors Group)
- ✅ 3 Sample vehicles

## 🆘 Troubleshooting

### Can't connect to database?
```bash
# Check .env file has DATABASE_URL
# Verify PostgreSQL is running
```

### Migration failed?
```bash
# Reset and start fresh
npm run db:reset
```

### Prisma Client not found?
```bash
npx prisma generate
```

## 📚 Full Documentation

See `DATABASE_GUIDE.md` for complete documentation.
