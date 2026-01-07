# Database Setup

This document explains how to set up the PostgreSQL database for the Vehicle Inventory Tool.

## Prerequisites

1. PostgreSQL 12+ installed and running
2. Node.js and npm installed
3. Environment variables configured in `.env`

## Database Setup Steps

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment

Copy `.env.example` to `.env` and update the `DATABASE_URL`:

```bash
DATABASE_URL="postgresql://username:password@localhost:5432/vehicle_inventory"
```

### 3. Create Database

Create the PostgreSQL database:

```sql
CREATE DATABASE vehicle_inventory;
```

### 4. Run Migrations

Apply the database schema:

```bash
npm run db:migrate
```

### 5. Seed Database

Populate with initial data (9 MMG stores and sample users):

```bash
npm run db:seed
```

## Database Schema

The database includes the following main entities:

- **Users**: Authentication and role management (PHOTOGRAPHER, ADMIN)
- **Stores**: 9 MMG dealership locations
- **Vehicles**: Vehicle inventory records with stock numbers
- **VehicleImages**: Photo management with categorization
- **ProcessingJobs**: Background removal job tracking

## Sample Data

The seed script creates:

- 9 MMG store locations across the GTA
- Admin user: `admin@markmotors.com` (password: `admin123`)
- Photographer user: `photographer@markmotors.com` (password: `photo123`)
- Sample vehicles for testing

## Development Commands

- `npm run db:migrate` - Run database migrations
- `npm run db:seed` - Seed database with initial data
- `npm run db:reset` - Reset database (drops all data)
- `npm run db:studio` - Open Prisma Studio for database browsing

## Production Notes

- Change default passwords before deploying
- Use strong `NEXTAUTH_SECRET` in production
- Configure proper PostgreSQL connection pooling
- Set up database backups and monitoring