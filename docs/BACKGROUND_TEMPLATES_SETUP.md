# Background Templates Setup Guide

## Overview

This guide explains how to set up background templates in Google Cloud Storage for the CDK One-Eighty integration. Background templates are used by the AI image processor to replace vehicle image backgrounds with professional, consistent backgrounds.

## Background Template Naming Convention

Background templates are stored in the `backgrounds/` folder in your GCS bucket with the following naming convention:

```
backgrounds/{template-name}.jpg
```

### Standard Template Names

The system uses the following standard template names:

- `studio-white.jpg` - Clean white studio background (recommended for front views)
- `studio-gray.jpg` - Neutral gray studio background (recommended for rear views)
- `gradient-blue.jpg` - Professional blue gradient background (recommended for side views)
- `outdoor-showroom.jpg` - Outdoor dealership showroom background (optional)
- `gradient-dark.jpg` - Dark gradient background for luxury vehicles (optional)

## Image Type to Background Mapping

The system maps each key image type to a specific background template:

| Image Type | Background Template | Description |
|------------|-------------------|-------------|
| `FRONT_QUARTER` | `studio-white.jpg` | Clean white background for front 3/4 view |
| `FRONT` | `studio-white.jpg` | Clean white background for front view |
| `BACK_QUARTER` | `studio-gray.jpg` | Neutral gray for rear 3/4 view |
| `BACK` | `studio-gray.jpg` | Neutral gray for rear view |
| `DRIVER_SIDE` | `gradient-blue.jpg` | Blue gradient for driver side view |
| `PASSENGER_SIDE` | `gradient-blue.jpg` | Blue gradient for passenger side view |

**Note**: Gallery images (`GALLERY`, `GALLERY_EXTERIOR`, `GALLERY_INTERIOR`) are NOT processed and do not use background templates.

## Setup Instructions

### Step 1: Prepare Background Images

1. Create or obtain professional background images:
   - **Resolution**: Minimum 2048x1536 pixels (recommended: 4096x3072)
   - **Format**: JPG (PNG also supported but larger file size)
   - **Quality**: High quality, no compression artifacts
   - **Aspect Ratio**: 4:3 or 16:9 (match your vehicle photos)

2. Ensure backgrounds are:
   - Clean and professional
   - Well-lit with even lighting
   - Free of distracting elements
   - Appropriate for automotive photography

### Step 2: Upload to Google Cloud Storage

#### Option A: Using Google Cloud Console (Web UI)

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Navigate to **Cloud Storage** → **Buckets**
3. Select your vehicle images bucket (e.g., `your-app-vehicle-images`)
4. Click **Create Folder**
5. Name the folder: `backgrounds`
6. Click **Create**
7. Open the `backgrounds/` folder
8. Click **Upload Files**
9. Select your background template images
10. Upload the following files:
    - `studio-white.jpg`
    - `studio-gray.jpg`
    - `gradient-blue.jpg`
    - (Optional) Additional templates

#### Option B: Using gsutil Command Line

```bash
# Set your bucket name
BUCKET_NAME="your-app-vehicle-images"

# Upload background templates
gsutil cp studio-white.jpg gs://${BUCKET_NAME}/backgrounds/
gsutil cp studio-gray.jpg gs://${BUCKET_NAME}/backgrounds/
gsutil cp gradient-blue.jpg gs://${BUCKET_NAME}/backgrounds/

# Verify upload
gsutil ls gs://${BUCKET_NAME}/backgrounds/
```

#### Option C: Using Node.js Script

Create a script `upload-backgrounds.js`:

```javascript
const { Storage } = require('@google-cloud/storage');
const fs = require('fs');
const path = require('path');

async function uploadBackgrounds() {
  const storage = new Storage({
    projectId: process.env.GCS_PROJECT_ID,
    keyFilename: process.env.GCS_KEY_FILE_PATH,
  });

  const bucket = storage.bucket(process.env.GCS_BUCKET_NAME);
  
  const templates = [
    'studio-white.jpg',
    'studio-gray.jpg',
    'gradient-blue.jpg',
  ];

  for (const template of templates) {
    const localPath = path.join(__dirname, 'backgrounds', template);
    const destination = `backgrounds/${template}`;
    
    try {
      await bucket.upload(localPath, {
        destination,
        metadata: {
          cacheControl: 'public, max-age=31536000',
        },
      });
      console.log(`✓ Uploaded: ${template}`);
    } catch (error) {
      console.error(`✗ Failed to upload ${template}:`, error.message);
    }
  }
  
  console.log('\n✅ Background templates uploaded successfully!');
}

uploadBackgrounds();
```

Run: `node upload-backgrounds.js`

### Step 3: Set Permissions (Optional)

Background templates can be private since they're only accessed by the server-side image processor. However, if you want to make them publicly accessible for testing:

```bash
# Make backgrounds folder publicly readable
gsutil iam ch allUsers:objectViewer gs://${BUCKET_NAME}/backgrounds/
```

### Step 4: Verify Upload

Check that templates are accessible:

```bash
# List all backgrounds
gsutil ls gs://${BUCKET_NAME}/backgrounds/

# Get public URL (if public)
echo "https://storage.googleapis.com/${BUCKET_NAME}/backgrounds/studio-white.jpg"
```

Or test in browser/curl:
```bash
curl -I "https://storage.googleapis.com/${BUCKET_NAME}/backgrounds/studio-white.jpg"
```

## Background Template Requirements

### Technical Specifications

- **File Format**: JPG or PNG
- **Color Space**: sRGB
- **Resolution**: 2048x1536 minimum (4096x3072 recommended)
- **File Size**: < 5MB per template
- **Aspect Ratio**: Match your vehicle photo aspect ratio (typically 4:3 or 16:9)

### Design Guidelines

1. **Lighting**: Even, diffused lighting without harsh shadows
2. **Color**: Neutral colors that complement vehicle colors
3. **Composition**: Simple, uncluttered backgrounds
4. **Perspective**: Match the perspective of vehicle photos (eye-level, slight angle)
5. **Branding**: Avoid visible branding unless intentional

## Customization

### Adding Custom Templates

To add custom background templates:

1. Upload new template to `backgrounds/` folder
2. Update the background template service mapping (see `src/lib/services/background-template-service.ts`)
3. Restart the application

### Per-Store Templates (Future Enhancement)

For multi-store deployments, you can organize templates by store:

```
backgrounds/
  store-123/
    studio-white.jpg
    studio-gray.jpg
  store-456/
    studio-white.jpg
    studio-gray.jpg
```

Update the template selector to include store ID in the path.

## Troubleshooting

### Issue: Templates not found during processing

**Solution**:
- Verify templates exist in GCS: `gsutil ls gs://${BUCKET_NAME}/backgrounds/`
- Check file names match exactly (case-sensitive)
- Ensure GCS service account has read access to the bucket

### Issue: AI processing fails with background error

**Solution**:
- Verify template images are valid JPG/PNG files
- Check template resolution meets minimum requirements
- Ensure templates are not corrupted

### Issue: Backgrounds don't blend well with vehicles

**Solution**:
- Use higher resolution templates
- Adjust lighting in templates to match vehicle photos
- Consider using gradient backgrounds instead of solid colors
- Test with different AI processing parameters

## Cost Considerations

- **Storage**: Background templates are small (~1-5MB each)
- **Bandwidth**: Templates are downloaded once per processing session
- **Total Cost**: Negligible (< $0.01/month for 5-10 templates)

## Sample Templates

Sample background templates are available at:
- [Automotive Photography Backgrounds](https://example.com/backgrounds) (placeholder)
- Create your own using photo editing software (Photoshop, GIMP)
- Use AI generation tools (Midjourney, DALL-E) to create custom backgrounds

## Next Steps

After uploading background templates:

1. Implement the Background Template Service (`src/lib/services/background-template-service.ts`)
2. Test the image processor with sample vehicle images
3. Verify AI processing produces good results with your templates
4. Adjust templates or mappings as needed based on results

