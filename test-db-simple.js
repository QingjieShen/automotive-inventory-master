#!/usr/bin/env node

/**
 * Simple Database Connection Test using Prisma
 * Tests DATABASE_URL without requiring additional packages
 */

require('dotenv').config();

// ANSI colors
const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  cyan: '\x1b[36m',
};

async function testConnection() {
  console.log(`${colors.cyan}🔍 Testing Database Connection${colors.reset}\n`);

  const databaseUrl = process.env.DATABASE_URL;

  if (!databaseUrl) {
    console.error(`${colors.red}❌ DATABASE_URL not found in .env file${colors.reset}\n`);
    process.exit(1);
  }

  console.log(`${colors.cyan}Connection String:${colors.reset}`);
  const maskedUrl = databaseUrl.replace(/:([^:@]+)@/, ':****@');
  console.log(`${maskedUrl}\n`);

  try {
    // Import Prisma Client
    const { PrismaClient } = require('@prisma/client');
    const prisma = new PrismaClient();

    console.log(`${colors.cyan}Attempting to connect...${colors.reset}`);
    
    // Try to connect
    await prisma.$connect();
    console.log(`${colors.green}✅ Connection successful!${colors.reset}\n`);

    // Get database version
    const result = await prisma.$queryRaw`SELECT version()`;
    console.log(`${colors.cyan}Database Version:${colors.reset}`);
    console.log(`${result[0].version}\n`);

    // Check for tables
    const tables = await prisma.$queryRaw`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
      ORDER BY table_name
    `;

    if (tables.length > 0) {
      console.log(`${colors.green}✅ Found ${tables.length} tables:${colors.reset}`);
      tables.forEach(row => {
        console.log(`   - ${row.table_name}`);
      });
      console.log();
    } else {
      console.log(`${colors.yellow}⚠️  No tables found${colors.reset}`);
      console.log(`${colors.cyan}Next step: Run migrations${colors.reset}`);
      console.log(`   npm run db:migrate\n`);
    }

    console.log(`${colors.green}✅ Database is ready!${colors.reset}\n`);

    await prisma.$disconnect();
    process.exit(0);

  } catch (error) {
    console.error(`${colors.red}❌ Connection failed!${colors.reset}\n`);
    console.error(`${colors.red}Error: ${error.message}${colors.reset}\n`);

    console.log(`${colors.yellow}Common Issues:${colors.reset}\n`);

    if (error.message.includes('ENOTFOUND') || error.message.includes('ECONNREFUSED')) {
      console.log(`${colors.yellow}1. Wrong IP address${colors.reset}`);
      console.log(`   ✅ Use Public IP: 34.130.125.67`);
      console.log(`   ❌ NOT Outgoing IP: 34.130.158.227\n`);
    }

    if (error.message.includes('timeout')) {
      console.log(`${colors.yellow}2. Firewall/Network issue${colors.reset}`);
      console.log(`   - Check Cloud SQL instance is running`);
      console.log(`   - Verify your IP is authorized`);
      console.log(`   - Add 0.0.0.0/0 to authorized networks (for testing)\n`);
    }

    if (error.message.includes('password')) {
      console.log(`${colors.yellow}3. Authentication issue${colors.reset}`);
      console.log(`   - Verify password is correct`);
      console.log(`   - Check username is 'postgres'\n`);
    }

    if (error.message.includes('database') && error.message.includes('does not exist')) {
      console.log(`${colors.yellow}4. Database not created${colors.reset}`);
      console.log(`   - Go to Cloud SQL console`);
      console.log(`   - Create database: vehicle_inventory\n`);
    }

    console.log(`${colors.cyan}Google Cloud SQL Checklist:${colors.reset}`);
    console.log(`  ✅ Instance is running (green checkmark)`);
    console.log(`  ✅ Public IP connectivity is enabled`);
    console.log(`  ✅ Your IP is in authorized networks`);
    console.log(`  ✅ Database 'vehicle_inventory' exists`);
    console.log(`  ✅ Using Public IP (34.130.125.67), not Outgoing IP\n`);

    process.exit(1);
  }
}

testConnection();
