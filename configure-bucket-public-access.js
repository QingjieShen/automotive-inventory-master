#!/usr/bin/env node

/**
 * Configure Bucket for Public Read Access
 * Required for images to be viewable in the application
 */

require('dotenv').config();
const { Storage } = require('@google-cloud/storage');

const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  cyan: '\x1b[36m',
};

async function configurePublicAccess() {
  console.log(`${colors.cyan}🔧 Configuring Bucket for Public Access${colors.reset}\n`);

  const projectId = process.env.GOOGLE_CLOUD_PROJECT_ID;
  const bucketName = process.env.GOOGLE_CLOUD_STORAGE_BUCKET;
  const keyFilename = process.env.GOOGLE_APPLICATION_CREDENTIALS;

  try {
    const storage = new Storage({
      projectId: projectId,
      keyFilename: keyFilename,
    });

    const bucket = storage.bucket(bucketName);

    // Check current IAM policy
    console.log(`${colors.cyan}Checking current permissions...${colors.reset}`);
    const [policy] = await bucket.iam.getPolicy({ requestedPolicyVersion: 3 });
    
    // Check if allUsers already has Storage Object Viewer role
    const hasPublicAccess = policy.bindings?.some(
      binding => 
        binding.role === 'roles/storage.objectViewer' &&
        binding.members?.includes('allUsers')
    );

    if (hasPublicAccess) {
      console.log(`${colors.green}✅ Bucket already has public read access${colors.reset}\n`);
    } else {
      console.log(`${colors.yellow}⚠️  Bucket does not have public read access${colors.reset}`);
      console.log(`${colors.cyan}Adding public read access...${colors.reset}`);

      // Add allUsers with Storage Object Viewer role
      policy.bindings = policy.bindings || [];
      policy.bindings.push({
        role: 'roles/storage.objectViewer',
        members: ['allUsers'],
      });

      await bucket.iam.setPolicy(policy);
      console.log(`${colors.green}✅ Public read access granted${colors.reset}\n`);
    }

    // Test public access
    console.log(`${colors.cyan}Testing public access...${colors.reset}`);
    
    // Upload a test file
    const testFileName = `test-public-${Date.now()}.txt`;
    const testFile = bucket.file(testFileName);
    await testFile.save('This is a public test file', {
      metadata: {
        cacheControl: 'public, max-age=31536000',
      },
    });

    const publicUrl = `https://storage.googleapis.com/${bucketName}/${testFileName}`;
    console.log(`${colors.green}✅ Test file uploaded${colors.reset}`);
    console.log(`${colors.cyan}   Public URL: ${publicUrl}${colors.reset}`);

    // Try to access it publicly (without authentication)
    const https = require('https');
    await new Promise((resolve, reject) => {
      https.get(publicUrl, (res) => {
        if (res.statusCode === 200) {
          console.log(`${colors.green}✅ File is publicly accessible!${colors.reset}`);
          resolve();
        } else {
          console.log(`${colors.red}❌ File is not publicly accessible (Status: ${res.statusCode})${colors.reset}`);
          reject(new Error(`HTTP ${res.statusCode}`));
        }
      }).on('error', reject);
    });

    // Clean up test file
    await testFile.delete();
    console.log(`${colors.green}✅ Test file cleaned up${colors.reset}\n`);

    console.log(`${colors.green}═══════════════════════════════════════════════════════${colors.reset}`);
    console.log(`${colors.green}✅ Bucket is configured for public access!${colors.reset}`);
    console.log(`${colors.green}═══════════════════════════════════════════════════════${colors.reset}\n`);

    console.log(`${colors.cyan}Configuration Summary:${colors.reset}`);
    console.log(`  Bucket: ${bucketName}`);
    console.log(`  Public Access: Enabled`);
    console.log(`  All uploaded images will be publicly viewable\n`);

    console.log(`${colors.cyan}Next Steps:${colors.reset}`);
    console.log(`  1. Restart your application`);
    console.log(`  2. Upload a store image`);
    console.log(`  3. Image should display correctly (not placeholder)!\n`);

    return true;

  } catch (error) {
    console.log(`${colors.red}❌ Error:${colors.reset} ${error.message}\n`);

    if (error.message.includes('permission')) {
      console.log(`${colors.yellow}You need additional permissions to modify IAM policies${colors.reset}\n`);
      console.log(`${colors.cyan}Manual Solution:${colors.reset}`);
      console.log(`1. Go to: https://console.cloud.google.com/storage/browser/${bucketName}?project=${projectId}`);
      console.log(`2. Click on the bucket name`);
      console.log(`3. Go to PERMISSIONS tab`);
      console.log(`4. Click GRANT ACCESS`);
      console.log(`5. New principals: allUsers`);
      console.log(`6. Role: Storage Object Viewer`);
      console.log(`7. Click SAVE`);
      console.log(`8. Click ALLOW PUBLIC ACCESS\n`);
    }

    return false;
  }
}

configurePublicAccess()
  .then(success => {
    if (!success) {
      console.log(`${colors.yellow}⚠️  Please configure public access manually${colors.reset}\n`);
      process.exit(1);
    }
  })
  .catch(error => {
    console.error(`${colors.red}❌ Unexpected error:${colors.reset}`, error);
    process.exit(1);
  });
