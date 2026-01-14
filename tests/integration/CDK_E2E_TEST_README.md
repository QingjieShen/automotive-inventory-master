# CDK One-Eighty End-to-End Integration Test

## Overview

This document describes the end-to-end integration test for the CDK One-Eighty DMS integration feature. The test validates the complete workflow from vehicle creation with VIN through image processing to CSV feed generation.

## Test File

`tests/integration/cdk-one-eighty-e2e.test.ts`

## Test Coverage

The end-to-end test validates all 7 steps of the integration workflow:

### Step 1: Create vehicle with VIN
- Validates VIN format using the VIN validator
- Creates a vehicle record with a valid 17-character VIN
- Verifies the vehicle can be retrieved by VIN

### Step 2: Upload 6 key images
- Creates image records for all 6 key image types:
  - FRONT_QUARTER
  - FRONT
  - BACK_QUARTER
  - BACK
  - DRIVER_SIDE
  - PASSENGER_SIDE
- Verifies all images are initially marked as unprocessed

### Step 3: Trigger image processing
- Simulates AI processing for key images
- Updates database with optimized URLs and timestamps
- Verifies all 6 images are marked as optimized

### Step 4: Verify optimized images in GCS
- Checks that all images have optimized URLs
- Validates GCS URL format (https://storage.googleapis.com/...)

### Step 5: Verify database updates
- Confirms processedAt timestamps are set
- Validates updatedAt timestamps for cache busting
- Checks isOptimized flags are true

### Step 6: Generate CSV feed with API key
- Tests API key authentication (valid, invalid, missing)
- Generates CSV feed using CSVGeneratorService
- Validates feed generation succeeds

### Step 7: Verify CSV contains correct data
- Validates CSV header format
- Confirms test vehicle appears in CSV
- Checks pipe-separated image URLs
- Validates cache-busting query parameters (?v=timestamp)
- Verifies absolute URLs (https://)
- Confirms CRLF line terminators
- Validates CSV field escaping
- Ensures all 6 optimized images are included

### Complete Workflow Validation
- Tests the full workflow end-to-end
- Simulates CDK One-Eighty polling scenario
- Validates CSV parsing and data format

## Prerequisites

To run this test, you need:

1. **PostgreSQL Database Running**
   - The test requires a live database connection
   - Database URL should be configured in `.env` file
   - Run: `docker-compose up -d` (if using Docker)
   - Or start your local PostgreSQL instance

2. **Database Schema**
   - Run migrations: `npx prisma migrate dev`
   - Ensure all CDK One-Eighty schema updates are applied

3. **Environment Variables**
   - `DATABASE_URL`: PostgreSQL connection string
   - `CDK_API_KEY`: API key for CSV feed authentication (test value is fine)
   - `NEXT_PUBLIC_BASE_URL`: Base URL for the application

## Running the Test

```bash
# Start the database (if using Docker)
docker-compose up -d

# Run the integration test
npm test -- tests/integration/cdk-one-eighty-e2e.test.ts
```

## Test Approach

This integration test uses a **simulated AI processing** approach:

- **Real Database**: Uses actual Prisma client and PostgreSQL database
- **Simulated AI**: Mocks the AI API processing by directly updating database records
- **Real Services**: Tests actual CSVGeneratorService and APIKeyAuthenticator implementations

This approach allows us to test the complete workflow without requiring:
- Actual Google Cloud Storage credentials
- Real AI API access
- Actual image files

The simulation accurately reflects the database state changes that would occur during real processing, making it a valid integration test.

## Test Data Cleanup

The test includes proper cleanup in the `afterAll` hook:
- Deletes test vehicle (cascades to images)
- Deletes test store
- Disconnects Prisma client

## Expected Results

When the database is running, all 25 test cases should pass:

```
Test Suites: 1 passed, 1 total
Tests:       25 passed, 25 total
```

## Troubleshooting

### Database Connection Error

```
Can't reach database server at `localhost:5432`
```

**Solution**: Start your PostgreSQL database:
```bash
docker-compose up -d
# or
pg_ctl start
```

### Schema Out of Sync

```
Prisma schema is out of sync with database
```

**Solution**: Run migrations:
```bash
npx prisma migrate dev
```

### Test Timeout

If tests timeout, increase Jest timeout in `jest.config.js`:
```javascript
testTimeout: 30000 // 30 seconds
```

## Integration with CI/CD

For CI/CD pipelines, ensure:

1. PostgreSQL service is available
2. Database migrations run before tests
3. Environment variables are set
4. Test database is isolated from production

Example GitHub Actions:

```yaml
services:
  postgres:
    image: postgres:14
    env:
      POSTGRES_PASSWORD: postgres
    options: >-
      --health-cmd pg_isready
      --health-interval 10s
      --health-timeout 5s
      --health-retries 5

steps:
  - name: Run migrations
    run: npx prisma migrate deploy
    
  - name: Run integration tests
    run: npm test -- tests/integration/cdk-one-eighty-e2e.test.ts
```

## Future Enhancements

Potential improvements to this test:

1. **Real GCS Integration**: Test with actual Google Cloud Storage (requires credentials)
2. **Real AI API**: Test with actual AI processing (requires API access)
3. **Performance Testing**: Measure CSV generation time for large datasets
4. **Concurrent Processing**: Test multiple simultaneous image processing requests
5. **Error Scenarios**: Test AI API failures, GCS upload failures, etc.

## Related Documentation

- [Requirements Document](../../.kiro/specs/cdk-one-eighty-integration/requirements.md)
- [Design Document](../../.kiro/specs/cdk-one-eighty-integration/design.md)
- [Task List](../../.kiro/specs/cdk-one-eighty-integration/tasks.md)
- [Google Cloud Setup Guide](../../docs/GOOGLE_CLOUD_SETUP.md)
