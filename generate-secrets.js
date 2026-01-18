#!/usr/bin/env node

/**
 * Secret Generator for Production Environment
 * 
 * Generates cryptographically secure secrets for production deployment.
 * 
 * Usage:
 *   node generate-secrets.js
 */

const crypto = require('crypto');

// ANSI color codes
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  cyan: '\x1b[36m',
  yellow: '\x1b[33m',
};

console.log(`${colors.cyan}🔐 Production Secret Generator${colors.reset}\n`);

// Generate NEXTAUTH_SECRET (32 bytes, base64 encoded)
const nextAuthSecret = crypto.randomBytes(32).toString('base64');

// Generate CDK_API_KEY (32 bytes, hex encoded)
const cdkApiKey = crypto.randomBytes(32).toString('hex');

// Generate a strong database password suggestion
const dbPassword = crypto.randomBytes(24).toString('base64').replace(/[+/=]/g, '');

console.log(`${colors.green}✅ Generated Secrets${colors.reset}\n`);

console.log(`${colors.cyan}NEXTAUTH_SECRET:${colors.reset}`);
console.log(`${nextAuthSecret}\n`);

console.log(`${colors.cyan}CDK_API_KEY:${colors.reset}`);
console.log(`${cdkApiKey}\n`);

console.log(`${colors.cyan}Suggested Database Password:${colors.reset}`);
console.log(`${dbPassword}\n`);

console.log(`${colors.yellow}⚠️  Important:${colors.reset}`);
console.log(`1. Copy these values to your .env.production file`);
console.log(`2. Never commit these secrets to version control`);
console.log(`3. Store them securely in your deployment platform's environment variables`);
console.log(`4. Keep a backup in a secure password manager\n`);

console.log(`${colors.cyan}Example .env.production entries:${colors.reset}\n`);
console.log(`NEXTAUTH_SECRET="${nextAuthSecret}"`);
console.log(`CDK_API_KEY="${cdkApiKey}"`);
console.log(`DATABASE_URL="postgresql://username:${dbPassword}@host:port/database"\n`);
