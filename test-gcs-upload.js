#!/usr/bin/env node

/**
 * Test Google Cloud Storage Upload
 * Verifies GCS configuration and upload functionality
 */

require('dotenv').config();
const { Storage } = require('@google-cloud/storage');
const fs = require('fs');
const path = require('path');

// ANSI colors
const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  cyan: '\x1b[36m',
};

async function testGCS() {
  console.log(`${colors.cyan}🔍 Testing Google Cloud Storage Configuration${colors.reset}\n`);

  // Check environment variables
  console.log(`${colors.cyan}1. Checking Environment Variables${colors.reset}`);
  
  const projectId = process.env.GOOGLE_CLOUD_PROJECT_ID;
  const bucketName = process.env.GOOGLE_CLOUD_STORAGE_BUCKET;
  const keyFilename = process.env.GOOGLE_APPLICATION_CREDENTIALS;
  const credentialsJson = process.env.GOOGLE_APPLICATION_CREDENTIALS_JSON;

  if (!projectId) {
    console.log(`${colors.red}❌ GOOGLE_CLOUD_PROJECT_ID not set${colors.reset}`);
    return false;
  }
  console.log(`${colors.green}✅ Project ID: ${projectId}${colors.reset}`);

  if (!bucketName) {
    console.log(`${colors.red}❌ GOOGLE_CLOUD_STORAGE_BUCKET not set${colors.reset}`);
    return false;
  }
  console.log(`${colors.green}✅ Bucket Name: ${bucketName}${colors.reset}`);

  if (!keyFilename && !credentialsJson) {
    console.log(`${colors.red}❌ No credentials configured${colors.reset}`);
    console.log(`   Set either GOOGLE_APPLICATION_CREDENTIALS or GOOGLE_APPLICATION_CREDENTIALS_JSON`);
    return false;
  }

  if (keyFilename) {
    const keyPath = path.resolve(process.cwd(), keyFilename);
    if (!fs.existsSync(keyPath)) {
      console.log(`${colors.red}❌ Service account file not found: ${keyFilename}${colors.reset}`);
      return false;
    }
    console.log(`${colors.green}✅ Service Account File: ${keyFilename}${colors.reset}`);
  } else {
    console.log(`${colors.green}✅ Using inline credentials (GOOGLE_APPLICATION_CREDENTIALS_JSON)${colors.reset}`);
  }

  console.log();

  // Initialize Storage client
  console.log(`${colors.cyan}2. Initializing Storage Client${colors.reset}`);
  
  let storage;
  try {
    const config = {
      projectId: projectId,
    };

    if (keyFilename) {
      config.keyFilename = keyFilename;
    } else if (credentialsJson) {
      config.credentials = JSON.parse(credentialsJson);
    }

    storage = new Storage(config);
    console.log(`${colors.green}✅ Storage client initialized${colors.reset}\n`);
  } catch (error) {
    console.log(`${colors.red}❌ Failed to initialize storage client${colors.reset}`);
    console.log(`   Error: ${error.message}\n`);
    return false;
  }

  // Check bucket exists
  console.log(`${colors.cyan}3. Checking Bucket Access${colors.reset}`);
  
  try {
    const bucket = storage.bucket(bucketName);
    const [exists] = await bucket.exists();
    
    if (!exists) {
      console.log(`${colors.red}❌ Bucket does not exist: ${bucketName}${colors.reset}`);
      console.log(`   Create it at: https://console.cloud.google.com/storage/browser\n`);
      return false;
    }
    console.log(`${colors.green}✅ Bucket exists and is accessible${colors.reset}\n`);
  } catch (error) {
    console.log(`${colors.red}❌ Cannot access bucket${colors.reset}`);
    console.log(`   Error: ${error.message}`);
    console.log(`   Check service account has "Storage Object Admin" role\n`);
    return false;
  }

  // Test upload
  console.log(`${colors.cyan}4. Testing File Upload${colors.reset}`);
  
  try {
    const bucket = storage.bucket(bucketName);
    const testFileName = `test-${Date.now()}.txt`;
    const testContent = 'This is a test file from GCS configuration test';
    
    const file = bucket.file(`test/${testFileName}`);
    await file.save(testContent, {
      contentType: 'text/plain',
      metadata: {
        cacheControl: 'public, max-age=31536000',
      },
    });

    console.log(`${colors.green}✅ Test file uploaded successfully${colors.reset}`);
    
    // Make it public
    await file.makePublic();
    console.log(`${colors.green}✅ File made public${colors.reset}`);
    
    // Get public URL
    const publicUrl = `https://storage.googleapis.com/${bucketName}/${file.name}`;
    console.log(`${colors.cyan}   Public URL: ${publicUrl}${colors.reset}`);
    
    // Clean up test file
    await file.delete();
    console.log(`${colors.green}✅ Test file cleaned up${colors.reset}\n`);
    
  } catch (error) {
    console.log(`${colors.red}❌ Upload test failed${colors.reset}`);
    console.log(`   Error: ${error.message}`);
    
    if (error.message.includes('permission')) {
      console.log(`\n${colors.yellow}   Solution: Grant "Storage Object Admin" role to service account${colors.reset}`);
      console.log(`   1. Go to: https://console.cloud.google.com/iam-admin/iam`);
      console.log(`   2. Find your service account`);
      console.log(`   3. Add role: "Storage Object Admin"\n`);
    }
    
    return false;
  }

  // Success!
  console.log(`${colors.green}═══════════════════════════════════════════════════════${colors.reset}`);
  console.log(`${colors.green}✅ Google Cloud Storage is configured correctly!${colors.reset}`);
  console.log(`${colors.green}═══════════════════════════════════════════════════════${colors.reset}\n`);
  
  console.log(`${colors.cyan}Configuration Summary:${colors.reset}`);
  console.log(`  Project: ${projectId}`);
  console.log(`  Bucket: ${bucketName}`);
  console.log(`  Credentials: ${keyFilename || 'Inline JSON'}`);
  console.log();
  
  return true;
}

testGCS()
  .then(success => {
    if (!success) {
      console.log(`${colors.yellow}⚠️  GCS is not properly configured${colors.reset}`);
      console.log(`${colors.yellow}   Images will use placeholder URLs until this is fixed${colors.reset}\n`);
      process.exit(1);
    }
  })
  .catch(error => {
    console.error(`${colors.red}❌ Unexpected error:${colors.reset}`, error);
    process.exit(1);
  });
