#!/usr/bin/env node

/**
 * Simple Database Connection Tester
 * 
 * Tests if the DATABASE_URL in .env is valid and accessible.
 * This works BEFORE running migrations.
 * 
 * Usage:
 *   node test-database-connection.js
 */

require('dotenv').config();
const { Client } = require('pg');

// ANSI color codes
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
    console.log(`${colors.yellow}Please set DATABASE_URL in your .env file${colors.reset}`);
    console.log(`Example: DATABASE_URL="postgresql://user:password@host:5432/database"\n`);
    process.exit(1);
  }

  console.log(`${colors.cyan}Connection String:${colors.reset}`);
  // Mask password in output
  const maskedUrl = databaseUrl.replace(/:([^:@]+)@/, ':****@');
  console.log(`${maskedUrl}\n`);

  const client = new Client({
    connectionString: databaseUrl,
  });

  try {
    console.log(`${colors.cyan}Attempting to connect...${colors.reset}`);
    
    await client.connect();
    console.log(`${colors.green}✅ Connection successful!${colors.reset}\n`);

    // Get database info
    const result = await client.query('SELECT version()');
    console.log(`${colors.cyan}Database Version:${colors.reset}`);
    console.log(`${result.rows[0].version}\n`);

    // Check if tables exist
    const tablesResult = await client.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
      ORDER BY table_name
    `);

    if (tablesResult.rows.length > 0) {
      console.log(`${colors.green}✅ Found ${tablesResult.rows.length} tables:${colors.reset}`);
      tablesResult.rows.forEach(row => {
        console.log(`   - ${row.table_name}`);
      });
      console.log();
    } else {
      console.log(`${colors.yellow}⚠️  No tables found${colors.reset}`);
      console.log(`${colors.cyan}Next step: Run migrations${colors.reset}`);
      console.log(`   npm run db:migrate\n`);
    }

    console.log(`${colors.green}✅ Database is ready to use!${colors.reset}\n`);
    
    process.exit(0);

  } catch (error) {
    console.error(`${colors.red}❌ Connection failed!${colors.reset}\n`);
    console.error(`${colors.red}Error: ${error.message}${colors.reset}\n`);

    // Provide helpful troubleshooting
    console.log(`${colors.yellow}Troubleshooting:${colors.reset}\n`);

    if (error.message.includes('ENOTFOUND') || error.message.includes('ECONNREFUSED')) {
      console.log(`${colors.yellow}1. Check database host is correct and accessible${colors.reset}`);
      console.log(`   - Verify the hostname/IP address`);
      console.log(`   - Ensure database server is running`);
      console.log(`   - Check firewall allows connections\n`);
    }

    if (error.message.includes('password authentication failed')) {
      console.log(`${colors.yellow}2. Check username and password${colors.reset}`);
      console.log(`   - Verify credentials are correct`);
      console.log(`   - Check for typos or extra spaces`);
      console.log(`   - Ensure password special characters are URL-encoded\n`);
    }

    if (error.message.includes('database') && error.message.includes('does not exist')) {
      console.log(`${colors.yellow}3. Database does not exist${colors.reset}`);
      console.log(`   - Create the database first`);
      console.log(`   - For Cloud SQL: Use Google Cloud Console`);
      console.log(`   - For local: CREATE DATABASE vehicle_inventory;\n`);
    }

    if (error.message.includes('SSL') || error.message.includes('ssl')) {
      console.log(`${colors.yellow}4. SSL/TLS issue${colors.reset}`);
      console.log(`   - Add ?sslmode=require to connection string`);
      console.log(`   - Or try ?sslmode=disable for local testing\n`);
    }

    if (error.message.includes('timeout')) {
      console.log(`${colors.yellow}5. Connection timeout${colors.reset}`);
      console.log(`   - Check network connectivity`);
      console.log(`   - Verify firewall rules`);
      console.log(`   - Ensure database accepts connections from your IP\n`);
    }

    console.log(`${colors.cyan}Common Solutions:${colors.reset}\n`);
    console.log(`For Google Cloud SQL:`);
    console.log(`  1. Check instance is running (green checkmark in console)`);
    console.log(`  2. Verify Public IP is enabled`);
    console.log(`  3. Add your IP to authorized networks`);
    console.log(`  4. Wait 5-10 minutes after creating instance\n`);

    console.log(`For local PostgreSQL:`);
    console.log(`  1. Start PostgreSQL service`);
    console.log(`  2. Or start Docker: docker-compose up -d`);
    console.log(`  3. Check PostgreSQL is listening on port 5432\n`);

    console.log(`For Neon/Supabase:`);
    console.log(`  1. Verify connection string is copied correctly`);
    console.log(`  2. Check no extra spaces or quotes`);
    console.log(`  3. Ensure project is active (not paused)\n`);

    console.log(`${colors.cyan}Need help?${colors.reset}`);
    console.log(`  See: DATABASE_PRODUCTION_SETUP.md\n`);

    process.exit(1);

  } finally {
    await client.end();
  }
}

testConnection();
