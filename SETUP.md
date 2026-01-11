# Vehicle Inventory Tool - Setup Guide

## Prerequisites

- Node.js 18+
- PostgreSQL database (Google Cloud SQL recommended)
- Google Cloud Storage bucket for file storage
- Google Cloud service account with appropriate permissions
- Gemini API access for image processing

## Installation

1. Clone the repository and install dependencies:

```bash
npm install
```

2. Set up environment variables:

```bash
cp .env.example .env.local
# Edit .env.local with your actual values
```

### Required Google Cloud Environment Variables

The application requires the following Google Cloud environment variables to be configured:

#### GOOGLE_CLOUD_STORAGE_BUCKET (Required)
- **Description**: The name of your Google Cloud Storage bucket where vehicle and store images will be stored
- **Example**: `mmg-vehicle-inventory`
- **Setup**: 
  1. Create a bucket in Google Cloud Console > Cloud Storage
  2. Enable public read access for the bucket (or configure signed URLs)
  3. Set the bucket name in your `.env.local` file

#### GOOGLE_APPLICATION_CREDENTIALS (Required)
- **Description**: Path to your Google Cloud service account JSON key file
- **Example**: `./config/service-account-key.json`
- **Setup**:
  1. Go to Google Cloud Console > IAM & Admin > Service Accounts
  2. Create a new service account or select an existing one
  3. Grant the following roles:
     - **Storage Object Admin** (for managing files in Cloud Storage)
     - **Cloud SQL Client** (for database access)
  4. Create and download a JSON key
  5. Save the key file securely (do NOT commit to version control)
  6. Set the path to this file in your `.env.local`

**Alternative for deployment environments**: You can set `GOOGLE_APPLICATION_CREDENTIALS_JSON` with the entire JSON content as a string instead of using a file path.

#### GOOGLE_CLOUD_CDN_DOMAIN (Optional)
- **Description**: Custom domain for Cloud CDN if you've configured it in front of your storage bucket
- **Example**: `cdn.example.com`
- **Setup**: 
  1. Set up Cloud CDN in Google Cloud Console
  2. Configure your custom domain
  3. Add the domain to your `.env.local` file
  4. Leave empty to use direct Google Cloud Storage URLs

#### GOOGLE_CLOUD_PROJECT_ID (Required)
- **Description**: Your Google Cloud project ID
- **Example**: `mmg-vehicle-inventory-prod`
- **Setup**: Find this in your Google Cloud Console dashboard

3. Set up the database:

```bash
# Run Prisma migrations (after schema is defined)
npx prisma migrate dev
npx prisma generate
```

## Google Cloud Setup

### Setting up Google Cloud Storage

1. **Create a Storage Bucket**:
   - Go to Google Cloud Console > Cloud Storage > Buckets
   - Click "Create Bucket"
   - Choose a globally unique name (e.g., `mmg-vehicle-inventory-prod`)
   - Select a location close to your users
   - Choose "Standard" storage class
   - Set access control to "Fine-grained" 
   - Enable public access if you want direct image URLs (or use signed URLs)

2. **Configure Bucket Permissions**:
   - Go to the bucket's "Permissions" tab
   - Add your service account with "Storage Object Admin" role
   - For public images, add `allUsers` with "Storage Object Viewer" role

3. **Optional: Set up Cloud CDN**:
   - Go to Network Services > Cloud CDN
   - Create a new CDN configuration
   - Point it to your storage bucket
   - Configure your custom domain
   - Update `GOOGLE_CLOUD_CDN_DOMAIN` in your environment variables

### Creating a Service Account

1. **Create Service Account**:
   - Go to IAM & Admin > Service Accounts
   - Click "Create Service Account"
   - Name it (e.g., `vehicle-inventory-app`)
   - Grant roles:
     - Storage Object Admin
     - Cloud SQL Client (if using Cloud SQL)

2. **Generate Key**:
   - Click on the service account
   - Go to "Keys" tab
   - Click "Add Key" > "Create new key"
   - Choose JSON format
   - Download and save securely

3. **Configure Application**:
   - Save the JSON key file in a secure location (NOT in your repository)
   - Set `GOOGLE_APPLICATION_CREDENTIALS` to the file path
   - Add the key file path to `.gitignore`

### Security Best Practices

- **Never commit service account keys to version control**
- Add `*.json` to `.gitignore` for key files
- Use environment-specific service accounts (dev, staging, prod)
- Rotate service account keys regularly
- Use Cloud Secret Manager for production deployments
- Enable audit logging for storage operations

## Development

### Running the application

```bash
npm run dev
```

### Testing

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run property-based tests only
npm run test:properties

# Run with coverage
npm run test:coverage
```

### Code Quality

```bash
# Lint code
npm run lint
npm run lint:fix

# Format code
npm run format
npm run format:check
```

## Project Structure

```
src/
├── app/                 # Next.js 14 app router
│   ├── api/            # API routes
│   ├── auth/           # Authentication pages
│   ├── stores/         # Store selection pages
│   ├── vehicles/       # Vehicle management pages
│   └── layout.tsx      # Root layout
├── components/         # Reusable UI components
├── lib/               # Utility libraries
├── types/             # TypeScript type definitions
├── hooks/             # Custom React hooks
└── utils/             # Helper functions

tests/
├── unit/              # Unit tests
├── integration/       # Integration tests
├── properties/        # Property-based tests
├── e2e/              # End-to-end tests
└── utils/            # Test utilities and mocks
```

## Technology Stack

- **Frontend**: Next.js 16, React 19, TypeScript, Tailwind CSS 4
- **Authentication**: NextAuth.js 4.24
- **Database**: PostgreSQL with Prisma ORM 6.19
- **File Storage**: Google Cloud Storage (migrated from AWS S3)
- **CDN**: Google Cloud CDN (optional, migrated from CloudFront)
- **Image Processing**: Gemini API
- **Testing**: Jest, React Testing Library, fast-check (property-based testing)
- **Code Quality**: ESLint, Prettier

## Next Steps

1. Complete database schema definition in `prisma/schema.prisma`
2. Set up authentication configuration
3. Implement core components and API routes
4. Add comprehensive test coverage
