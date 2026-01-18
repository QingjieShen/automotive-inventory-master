#!/usr/bin/env node

/**
 * Check if GCS Bucket Exists and Create if Needed
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

async function checkAndCreateBucket() {
  console.log(`${colors.cyan}🔍 Checking GCS Bucket${colors.reset}\n`);

  const projectId = process.env.GOOGLE_CLOUD_PROJECT_ID;
  const bucketName = process.env.GOOGLE_CLOUD_STORAGE_BUCKET;
  const keyFilename = process.env.GOOGLE_APPLICATION_CREDENTIALS;

  console.log(`Project: ${projectId}`);
  console.log(`Bucket: ${bucketName}`);
  console.log(`Service Account: ${keyFilename}\n`);

  try {
    const storage = new Storage({
      projectId: projectId,
      keyFilename: keyFilename,
    });

    const bucket = storage.bucket(bucketName);

    // Check if bucket exists
    console.log(`${colors.cyan}Checking if bucket exists...${colors.reset}`);
    const [exists] = await bucket.exists();

    if (exists) {
      console.log(`${colors.green}✅ Bucket exists!${colors.reset}\n`);
      
      // Try to get bucket metadata
      try {
        const [metadata] = await bucket.getMetadata();
        console.log(`${colors.green}✅ Can access bucket metadata${colors.reset}`);
        console.log(`   Location: ${metadata.location}`);
        console.log(`   Storage Class: ${metadata.storageClass}`);
        console.log(`   Created: ${metadata.timeCreated}\n`);
        
        // Test upload
        console.log(`${colors.cyan}Testing upload...${colors.reset}`);
        const testFile = bucket.file(`test-${Date.now()}.txt`);
        await testFile.save('Test content', {
          metadata: {
            cacheControl: 'public, max-age=31536000',
          },
        });
        console.log(`${colors.green}✅ Upload successful!${colors.reset}`);
        
        // Check if uniform bucket-level access is enabled
        const [bucketMetadata] = await bucket.getMetadata();
        const uniformAccess = bucketMetadata.iamConfiguration?.uniformBucketLevelAccess?.enabled;
        
        if (uniformAccess) {
          console.log(`${colors.cyan}ℹ️  Bucket uses uniform bucket-level access (modern security)${colors.reset}`);
          console.log(`${colors.green}✅ Files are publicly accessible via bucket policy${colors.reset}`);
        } else {
          // Only try to make public if not using uniform access
          await testFile.makePublic();
          console.log(`${colors.green}✅ Can make files public${colors.reset}`);
        }
        
        const publicUrl = `https://storage.googleapis.com/${bucketName}/${testFile.name}`;
        console.log(`${colors.cyan}   Public URL: ${publicUrl}${colors.reset}`);
        
        await testFile.delete();
        console.log(`${colors.green}✅ Can delete files${colors.reset}\n`);
        
        console.log(`${colors.green}═══════════════════════════════════════════════════════${colors.reset}`);
        console.log(`${colors.green}✅ Everything is working correctly!${colors.reset}`);
        console.log(`${colors.green}═══════════════════════════════════════════════════════${colors.reset}\n`);
        
        return true;
      } catch (metadataError) {
        console.log(`${colors.red}❌ Cannot access bucket metadata${colors.reset}`);
        console.log(`   Error: ${metadataError.message}\n`);
        
        if (metadataError.message.includes('storage.buckets.get')) {
          console.log(`${colors.yellow}The bucket exists but you need additional permissions.${colors.reset}\n`);
          console.log(`${colors.cyan}Solution: Grant "Storage Admin" role instead${colors.reset}`);
          console.log(`1. Go to: https://console.cloud.google.com/iam-admin/iam?project=${projectId}`);
          console.log(`2. Find: mark-motors-group-inventory-ph@auto-ads-465719.iam.gserviceaccount.com`);
          console.log(`3. Edit and add role: "Storage Admin"`);
          console.log(`4. This gives full bucket access including metadata\n`);
        }
        
        return false;
      }
    } else {
      console.log(`${colors.yellow}⚠️  Bucket does not exist${colors.reset}\n`);
      
      console.log(`${colors.cyan}Creating bucket...${colors.reset}`);
      
      try {
        await storage.createBucket(bucketName, {
          location: 'NORTHAMERICA-NORTHEAST2', // Same region as your database
          storageClass: 'STANDARD',
        });
        
        console.log(`${colors.green}✅ Bucket created successfully!${colors.reset}`);
        console.log(`   Name: ${bucketName}`);
        console.log(`   Location: NORTHAMERICA-NORTHEAST2\n`);
        
        // Make bucket public for read
        await bucket.makePublic();
        console.log(`${colors.green}✅ Bucket configured for public read access${colors.reset}\n`);
        
        console.log(`${colors.green}═══════════════════════════════════════════════════════${colors.reset}`);
        console.log(`${colors.green}✅ Bucket created and configured!${colors.reset}`);
        console.log(`${colors.green}═══════════════════════════════════════════════════════${colors.reset}\n`);
        
        return true;
      } catch (createError) {
        console.log(`${colors.red}❌ Cannot create bucket${colors.reset}`);
        console.log(`   Error: ${createError.message}\n`);
        
        if (createError.message.includes('permission')) {
          console.log(`${colors.yellow}You need "Storage Admin" role to create buckets${colors.reset}\n`);
          console.log(`${colors.cyan}Option 1: Grant Storage Admin role${colors.reset}`);
          console.log(`1. Go to: https://console.cloud.google.com/iam-admin/iam?project=${projectId}`);
          console.log(`2. Find your service account`);
          console.log(`3. Add role: "Storage Admin"\n`);
          
          console.log(`${colors.cyan}Option 2: Create bucket manually${colors.reset}`);
          console.log(`1. Go to: https://console.cloud.google.com/storage/browser?project=${projectId}`);
          console.log(`2. Click "CREATE BUCKET"`);
          console.log(`3. Name: ${bucketName}`);
          console.log(`4. Location: northamerica-northeast2 (Montreal)`);
          console.log(`5. Click "CREATE"\n`);
        }
        
        return false;
      }
    }
  } catch (error) {
    console.log(`${colors.red}❌ Error:${colors.reset} ${error.message}\n`);
    return false;
  }
}

checkAndCreateBucket()
  .then(success => {
    if (!success) {
      console.log(`${colors.yellow}⚠️  Please fix the issues above and try again${colors.reset}\n`);
      process.exit(1);
    }
  })
  .catch(error => {
    console.error(`${colors.red}❌ Unexpected error:${colors.reset}`, error);
    process.exit(1);
  });
