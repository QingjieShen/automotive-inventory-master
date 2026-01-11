# Google Cloud Configuration Guide

This guide provides detailed instructions for configuring Google Cloud services for the MMG Vehicle Inventory Tool.

## Overview

The application uses the following Google Cloud services:
- **Google Cloud Storage**: For storing vehicle and store images
- **Google Cloud SQL**: For PostgreSQL database (optional, can use any PostgreSQL instance)
- **Google Cloud CDN**: For optimized image delivery (optional)

## Required Environment Variables

### GOOGLE_CLOUD_STORAGE_BUCKET

**Required**: Yes

**Description**: The name of your Google Cloud Storage bucket where all vehicle and store images will be stored.

**Format**: String (bucket name)

**Example**: 
```bash
GOOGLE_CLOUD_STORAGE_BUCKET="mmg-vehicle-inventory"
```

**Setup Instructions**:
1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Navigate to Cloud Storage > Buckets
3. Click "Create Bucket"
4. Choose a globally unique name
5. Select a location (choose one close to your users for better performance)
6. Choose "Standard" storage class for frequently accessed images
7. Set access control to "Fine-grained"
8. Click "Create"

**Storage Structure**:
The application organizes files in the following structure:
```
bucket-name/
├── stores/
│   ├── {storeId}/
│   │   ├── store-image.jpg              # Store background image
│   │   └── vehicles/
│   │       └── {vehicleId}/
│   │           ├── original/
│   │           │   └── {uuid}_{timestamp}.jpg
│   │           ├── processed/
│   │           │   └── {uuid}_{timestamp}.jpg
│   │           └── thumbnail/
│   │               └── {uuid}_{timestamp}.jpg
```

---

### GOOGLE_APPLICATION_CREDENTIALS

**Required**: Yes (one of the two options)

**Description**: Authentication credentials for accessing Google Cloud services. You can provide either a file path or inline JSON.

#### Option 1: File Path (Recommended for Local Development)

**Format**: String (absolute or relative path to JSON key file)

**Example**:
```bash
GOOGLE_APPLICATION_CREDENTIALS="./config/service-account-key.json"
# or absolute path
GOOGLE_APPLICATION_CREDENTIALS="/home/user/keys/service-account-key.json"
```

**Setup Instructions**:
1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Navigate to IAM & Admin > Service Accounts
3. Click "Create Service Account"
4. Enter a name (e.g., "vehicle-inventory-app")
5. Click "Create and Continue"
6. Grant the following roles:
   - **Storage Object Admin** (for managing files in Cloud Storage)
   - **Cloud SQL Client** (if using Cloud SQL for database)
7. Click "Continue" then "Done"
8. Click on the newly created service account
9. Go to the "Keys" tab
10. Click "Add Key" > "Create new key"
11. Select "JSON" format
12. Click "Create" - the key file will download automatically
13. Save the file securely (do NOT commit to version control)
14. Set the path to this file in your `.env.local`

#### Option 2: Inline JSON (Recommended for Production/Deployment)

**Format**: String (entire JSON content)

**Example**:
```bash
GOOGLE_APPLICATION_CREDENTIALS_JSON='{"type":"service_account","project_id":"your-project","private_key_id":"...","private_key":"-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n","client_email":"...","client_id":"...","auth_uri":"...","token_uri":"...","auth_provider_x509_cert_url":"...","client_x509_cert_url":"..."}'
```

**Setup Instructions**:
1. Follow steps 1-12 from Option 1 above
2. Open the downloaded JSON file
3. Copy the entire JSON content
4. Set it as the value of `GOOGLE_APPLICATION_CREDENTIALS_JSON` in your environment
5. This is useful for deployment platforms like Vercel, Heroku, or Docker where file paths are not ideal

**Security Notes**:
- ⚠️ **NEVER commit service account keys to version control**
- Add `*.json` to your `.gitignore` file
- Use different service accounts for different environments (dev, staging, prod)
- Rotate keys regularly (every 90 days recommended)
- Use Cloud Secret Manager for production deployments
- Limit service account permissions to only what's needed

---

### GOOGLE_CLOUD_CDN_DOMAIN

**Required**: No (Optional)

**Description**: Custom domain for Google Cloud CDN if you've configured it in front of your storage bucket. This enables faster image delivery through Google's global CDN network.

**Format**: String (domain name without protocol)

**Example**:
```bash
GOOGLE_CLOUD_CDN_DOMAIN="cdn.example.com"
# or
GOOGLE_CLOUD_CDN_DOMAIN="images.mmgdealerships.com"
```

**Leave empty to use direct Google Cloud Storage URLs**:
```bash
GOOGLE_CLOUD_CDN_DOMAIN=""
```

**Setup Instructions**:

1. **Create a Load Balancer**:
   - Go to Network Services > Load Balancing
   - Click "Create Load Balancer"
   - Choose "HTTP(S) Load Balancing"
   - Select "From Internet to my VMs"
   - Configure backend to point to your Cloud Storage bucket

2. **Enable Cloud CDN**:
   - In the load balancer configuration
   - Enable "Cloud CDN" for the backend
   - Configure cache settings (recommended: 1 hour for images)

3. **Configure Custom Domain** (Optional):
   - Go to Network Services > Cloud CDN
   - Add your custom domain
   - Update DNS records to point to the load balancer IP
   - Configure SSL certificate (use Google-managed certificate)

4. **Update Environment Variable**:
   - Set `GOOGLE_CLOUD_CDN_DOMAIN` to your custom domain
   - The application will use this domain for all image URLs

**Benefits of Using CDN**:
- Faster image loading for users worldwide
- Reduced bandwidth costs
- Automatic image caching
- Better performance during traffic spikes

---

### GOOGLE_CLOUD_PROJECT_ID

**Required**: Yes

**Description**: Your Google Cloud project ID. This identifies which Google Cloud project the application should use.

**Format**: String (project ID)

**Example**:
```bash
GOOGLE_CLOUD_PROJECT_ID="mmg-vehicle-inventory-prod"
```

**Setup Instructions**:
1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Your project ID is displayed in the top navigation bar
3. Or go to IAM & Admin > Settings to find your project ID
4. Copy the project ID (not the project name or number)
5. Set it in your `.env.local` file

---

## Complete Configuration Example

Here's a complete example of Google Cloud configuration in your `.env.local` file:

```bash
# Google Cloud Configuration
GOOGLE_CLOUD_PROJECT_ID="mmg-vehicle-inventory-prod"
GOOGLE_APPLICATION_CREDENTIALS="./config/service-account-key.json"
GOOGLE_CLOUD_STORAGE_BUCKET="mmg-vehicle-inventory"
GOOGLE_CLOUD_CDN_DOMAIN="cdn.mmgdealerships.com"
```

## Bucket Permissions Configuration

### For Public Image Access (Recommended for simplicity)

If you want images to be publicly accessible via direct URLs:

1. Go to your bucket in Cloud Storage
2. Click on "Permissions" tab
3. Click "Add Principal"
4. Enter `allUsers` as the principal
5. Select role: "Storage Object Viewer"
6. Click "Save"

### For Private Images with Signed URLs (More secure)

If you want to control access to images:

1. Keep bucket private (don't add `allUsers` permission)
2. The application will generate signed URLs for temporary access
3. Ensure your service account has "Storage Object Admin" role
4. Signed URLs expire after a configured time period

## Testing Your Configuration

After setting up your environment variables, test the configuration:

```bash
# Test Google Cloud Storage connection
npm run test:gcs

# Or manually test by uploading a file
node -e "
const { gcsService } = require('./src/lib/gcs');
gcsService.uploadFile({
  vehicleId: 'test',
  storeId: 'test',
  imageType: 'original',
  contentType: 'image/jpeg',
  buffer: Buffer.from('test'),
  originalName: 'test.jpg'
}).then(result => console.log('Upload successful:', result))
  .catch(err => console.error('Upload failed:', err));
"
```

## Troubleshooting

### Error: "Could not load the default credentials"

**Cause**: `GOOGLE_APPLICATION_CREDENTIALS` is not set or points to an invalid file.

**Solution**:
1. Verify the file path is correct
2. Ensure the JSON key file exists and is readable
3. Check that the file contains valid JSON
4. Try using an absolute path instead of relative path

### Error: "The caller does not have permission"

**Cause**: Service account lacks required permissions.

**Solution**:
1. Go to IAM & Admin > IAM
2. Find your service account
3. Click "Edit" (pencil icon)
4. Add missing roles:
   - Storage Object Admin
   - Cloud SQL Client (if using Cloud SQL)
5. Save changes and wait a few minutes for propagation

### Error: "Bucket does not exist"

**Cause**: `GOOGLE_CLOUD_STORAGE_BUCKET` is incorrect or bucket doesn't exist.

**Solution**:
1. Verify the bucket name in Cloud Storage console
2. Ensure the bucket is in the same project as your service account
3. Check for typos in the environment variable

### Images not loading (404 errors)

**Cause**: Bucket permissions not configured for public access.

**Solution**:
1. Go to bucket permissions
2. Add `allUsers` with "Storage Object Viewer" role
3. Or implement signed URLs in the application

## Cost Optimization

### Storage Costs
- Use "Standard" storage class for frequently accessed images
- Use "Nearline" or "Coldline" for archived images
- Enable lifecycle policies to automatically move old images to cheaper storage

### Bandwidth Costs
- Enable Cloud CDN to reduce egress costs
- Compress images before upload
- Use appropriate image formats (WebP for web)

### Monitoring
- Set up billing alerts in Google Cloud Console
- Monitor storage usage and bandwidth
- Review Cloud Storage analytics regularly

## Security Best Practices

1. **Service Account Keys**:
   - Never commit keys to version control
   - Rotate keys every 90 days
   - Use separate keys for each environment
   - Delete unused keys immediately

2. **Bucket Security**:
   - Enable uniform bucket-level access
   - Use IAM policies instead of ACLs
   - Enable audit logging
   - Set up VPC Service Controls for production

3. **Access Control**:
   - Use signed URLs for sensitive images
   - Implement CORS policies if needed
   - Enable versioning for important data
   - Set up retention policies

4. **Monitoring**:
   - Enable Cloud Audit Logs
   - Set up alerts for unusual activity
   - Monitor access patterns
   - Review IAM permissions regularly

## Migration from AWS S3

If you're migrating from AWS S3, see the [Migration Guide](./MIGRATION.md) for detailed instructions on:
- Transferring existing images from S3 to Cloud Storage
- Running both systems in parallel during migration
- Updating image URLs in the database
- Validating the migration
