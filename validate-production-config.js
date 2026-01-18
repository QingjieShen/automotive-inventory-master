#!/usr/bin/env node

/**
 * Production Configuration Validator
 * 
 * This script validates that all required environment variables are properly
 * configured for production deployment.
 * 
 * Usage:
 *   node validate-production-config.js
 * 
 * Or with a specific env file:
 *   node validate-production-config.js .env.production
 */

const fs = require('fs');
const path = require('path');

// ANSI color codes for terminal output
const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
};

// Load environment file
const envFile = process.argv[2] || '.env';
const envPath = path.resolve(process.cwd(), envFile);

console.log(`${colors.cyan}🔍 Validating Production Configuration${colors.reset}`);
console.log(`${colors.blue}📄 Reading: ${envFile}${colors.reset}\n`);

if (!fs.existsSync(envPath)) {
  console.error(`${colors.red}❌ Error: ${envFile} not found${colors.reset}`);
  console.log(`\nCreate ${envFile} from .env.production.template\n`);
  process.exit(1);
}

// Parse .env file
const envContent = fs.readFileSync(envPath, 'utf-8');
const envVars = {};

envContent.split('\n').forEach(line => {
  const trimmed = line.trim();
  if (trimmed && !trimmed.startsWith('#')) {
    const [key, ...valueParts] = trimmed.split('=');
    if (key && valueParts.length > 0) {
      envVars[key.trim()] = valueParts.join('=').trim().replace(/^["']|["']$/g, '');
    }
  }
});

// Validation rules
const validations = {
  critical: [
    {
      name: 'DATABASE_URL',
      check: (val) => val && val !== 'postgresql://postgres:password@localhost:5432/vehicle_inventory',
      message: 'Must be set to production database (not localhost)',
    },
    {
      name: 'NEXTAUTH_SECRET',
      check: (val) => val && val.length >= 32 && val !== 'development-secret-key-change-in-production',
      message: 'Must be at least 32 characters and not the development placeholder',
    },
    {
      name: 'NEXTAUTH_URL',
      check: (val) => val && val.startsWith('https://') && !val.includes('localhost'),
      message: 'Must be HTTPS production URL (not localhost)',
    },
    {
      name: 'GOOGLE_CLOUD_PROJECT_ID',
      check: (val) => val && val.length > 0,
      message: 'Required for Google Cloud Storage',
    },
    {
      name: 'GOOGLE_CLOUD_STORAGE_BUCKET',
      check: (val) => val && val.length > 0,
      message: 'Required for image storage',
    },
    {
      name: 'GEMINI_API_KEY',
      check: (val) => val && val !== 'development-gemini-key' && val.length > 10,
      message: 'Must be a valid Gemini API key (not development placeholder)',
    },
    {
      name: 'CDK_API_KEY',
      check: (val) => val && val.length >= 32,
      message: 'Required for CDK CSV feed security',
    },
    {
      name: 'NEXT_PUBLIC_BASE_URL',
      check: (val) => val && val.startsWith('https://') && !val.includes('localhost'),
      message: 'Must be HTTPS production URL for CDK feed',
    },
    {
      name: 'NODE_ENV',
      check: (val) => val === 'production',
      message: 'Must be set to "production"',
    },
  ],
  recommended: [
    {
      name: 'GOOGLE_CLOUD_CDN_DOMAIN',
      check: (val) => val && val.length > 0,
      message: 'Recommended for better image delivery performance',
    },
    {
      name: 'GOOGLE_APPLICATION_CREDENTIALS or GOOGLE_APPLICATION_CREDENTIALS_JSON',
      check: () => envVars.GOOGLE_APPLICATION_CREDENTIALS || envVars.GOOGLE_APPLICATION_CREDENTIALS_JSON,
      message: 'One of these must be set for GCS authentication',
    },
  ],
  warnings: [
    {
      name: 'AWS_ACCESS_KEY_ID',
      check: (val) => !val || val !== 'development-key',
      message: 'Still has development placeholder - remove if not using AWS',
    },
    {
      name: 'AWS_SECRET_ACCESS_KEY',
      check: (val) => !val || val !== 'development-secret',
      message: 'Still has development placeholder - remove if not using AWS',
    },
  ],
};

// Run validations
let criticalIssues = 0;
let recommendedIssues = 0;
let warnings = 0;

console.log(`${colors.cyan}═══════════════════════════════════════════════════════${colors.reset}`);
console.log(`${colors.red}🔴 CRITICAL ISSUES (Must Fix)${colors.reset}`);
console.log(`${colors.cyan}═══════════════════════════════════════════════════════${colors.reset}\n`);

validations.critical.forEach(({ name, check, message }) => {
  const value = envVars[name];
  const passed = check(value);
  
  if (!passed) {
    criticalIssues++;
    console.log(`${colors.red}❌ ${name}${colors.reset}`);
    console.log(`   ${message}`);
    console.log(`   Current: ${value || '(not set)'}\n`);
  } else {
    console.log(`${colors.green}✅ ${name}${colors.reset}`);
  }
});

console.log(`\n${colors.cyan}═══════════════════════════════════════════════════════${colors.reset}`);
console.log(`${colors.yellow}🟡 RECOMMENDED (Should Configure)${colors.reset}`);
console.log(`${colors.cyan}═══════════════════════════════════════════════════════${colors.reset}\n`);

validations.recommended.forEach(({ name, check, message }) => {
  const value = envVars[name];
  const passed = check(value);
  
  if (!passed) {
    recommendedIssues++;
    console.log(`${colors.yellow}⚠️  ${name}${colors.reset}`);
    console.log(`   ${message}\n`);
  } else {
    console.log(`${colors.green}✅ ${name}${colors.reset}`);
  }
});

console.log(`\n${colors.cyan}═══════════════════════════════════════════════════════${colors.reset}`);
console.log(`${colors.yellow}⚠️  WARNINGS${colors.reset}`);
console.log(`${colors.cyan}═══════════════════════════════════════════════════════${colors.reset}\n`);

validations.warnings.forEach(({ name, check, message }) => {
  const value = envVars[name];
  const passed = check(value);
  
  if (!passed) {
    warnings++;
    console.log(`${colors.yellow}⚠️  ${name}${colors.reset}`);
    console.log(`   ${message}\n`);
  }
});

// Additional checks
console.log(`${colors.cyan}═══════════════════════════════════════════════════════${colors.reset}`);
console.log(`${colors.blue}📋 Additional Checks${colors.reset}`);
console.log(`${colors.cyan}═══════════════════════════════════════════════════════${colors.reset}\n`);

// Check if service account file exists
const serviceAccountPath = envVars.GOOGLE_APPLICATION_CREDENTIALS;
if (serviceAccountPath) {
  const fullPath = path.resolve(process.cwd(), serviceAccountPath);
  if (fs.existsSync(fullPath)) {
    console.log(`${colors.green}✅ Service account file found: ${serviceAccountPath}${colors.reset}`);
  } else {
    console.log(`${colors.red}❌ Service account file not found: ${serviceAccountPath}${colors.reset}`);
    criticalIssues++;
  }
} else if (!envVars.GOOGLE_APPLICATION_CREDENTIALS_JSON) {
  console.log(`${colors.red}❌ No Google Cloud credentials configured${colors.reset}`);
  criticalIssues++;
}

// Check database URL format
const dbUrl = envVars.DATABASE_URL;
if (dbUrl) {
  if (dbUrl.includes('localhost')) {
    console.log(`${colors.red}❌ Database URL points to localhost${colors.reset}`);
  } else if (!dbUrl.includes('sslmode=require') && !dbUrl.includes('sslmode=verify')) {
    console.log(`${colors.yellow}⚠️  Database URL doesn't enforce SSL (add ?sslmode=require)${colors.reset}`);
  } else {
    console.log(`${colors.green}✅ Database URL looks production-ready${colors.reset}`);
  }
}

// Summary
console.log(`\n${colors.cyan}═══════════════════════════════════════════════════════${colors.reset}`);
console.log(`${colors.cyan}📊 SUMMARY${colors.reset}`);
console.log(`${colors.cyan}═══════════════════════════════════════════════════════${colors.reset}\n`);

console.log(`${colors.red}Critical Issues: ${criticalIssues}${colors.reset}`);
console.log(`${colors.yellow}Recommended: ${recommendedIssues}${colors.reset}`);
console.log(`${colors.yellow}Warnings: ${warnings}${colors.reset}\n`);

if (criticalIssues === 0 && recommendedIssues === 0) {
  console.log(`${colors.green}✅ Configuration looks good for production!${colors.reset}\n`);
  console.log(`${colors.blue}Next steps:${colors.reset}`);
  console.log(`  1. Run: npm run build`);
  console.log(`  2. Test: npm run start`);
  console.log(`  3. Deploy to your hosting platform\n`);
  process.exit(0);
} else if (criticalIssues === 0) {
  console.log(`${colors.yellow}⚠️  Configuration is functional but has recommended improvements${colors.reset}\n`);
  console.log(`${colors.blue}You can proceed with deployment, but consider addressing the recommendations.${colors.reset}\n`);
  process.exit(0);
} else {
  console.log(`${colors.red}❌ Configuration has critical issues that must be fixed before production${colors.reset}\n`);
  console.log(`${colors.blue}See PRODUCTION_READINESS_CHECKLIST.md for detailed instructions.${colors.reset}\n`);
  process.exit(1);
}
