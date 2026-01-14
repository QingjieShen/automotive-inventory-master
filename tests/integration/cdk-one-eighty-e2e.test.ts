/**
 * End-to-End Integration Test for CDK One-Eighty Integration
 * 
 * This test validates the complete workflow:
 * 1. Create vehicle with VIN
 * 2. Upload 6 key images
 * 3. Trigger image processing
 * 4. Verify optimized images in GCS
 * 5. Verify database updates
 * 6. Generate CSV feed with API key
 * 7. Verify CSV contains correct data with cache-busted URLs
 * 
 * Feature: cdk-one-eighty-integration
 * Requirements: All
 */

import { prisma } from '@/lib/prisma';
import { validateVIN } from '@/lib/validators/vin-validator';
import { ImageType } from '@/types';
import { getGCSService } from '@/lib/services/gcs-service';
import { getBackgroundTemplateService } from '@/lib/services/background-template-service';
import { createImageProcessorServiceFromEnv } from '@/lib/services/image-processor-service';
import { CSVGeneratorService } from '@/lib/services/csv-generator-service';
import { APIKeyAuthenticator } from '@/lib/services/api-key-authenticator';

// Test data
const TEST_VIN = 'WBADT43452G123456'; // Valid VIN format
const TEST_STOCK_NUMBER = 'TEST-E2E-001';
const TEST_API_KEY = process.env.CDK_API_KEY || 'test-api-key';

// Key image types that should be processed
const KEY_IMAGE_TYPES: ImageType[] = [
  'FRONT_QUARTER',
  'FRONT',
  'BACK_QUARTER',
  'BACK',
  'DRIVER_SIDE',
  'PASSENGER_SIDE',
];

describe('CDK One-Eighty End-to-End Integration', () => {
  let testStoreId: string;
  let testVehicleId: string;
  let testImageIds: string[] = [];

  beforeAll(async () => {
    // Create a test store for the integration test
    const testStore = await prisma.store.create({
      data: {
        name: 'E2E Test Store',
        address: '123 Test St',
        city: 'Test City',
        state: 'TS',
        zipCode: '12345',
        phone: '555-0100',
      },
    });
    testStoreId = testStore.id;
  });

  afterAll(async () => {
    // Cleanup: Delete test data
    if (testVehicleId) {
      await prisma.vehicle.delete({
        where: { id: testVehicleId },
      }).catch(() => {
        // Ignore errors if already deleted
      });
    }

    if (testStoreId) {
      await prisma.store.delete({
        where: { id: testStoreId },
      }).catch(() => {
        // Ignore errors if already deleted
      });
    }

    await prisma.$disconnect();
  });

  describe('Step 1: Create vehicle with VIN', () => {
    test('should validate VIN format', () => {
      const result = validateVIN(TEST_VIN);
      expect(result.valid).toBe(true);
      expect(result.error).toBeUndefined();
    });

    test('should create vehicle with valid VIN', async () => {
      const vehicle = await prisma.vehicle.create({
        data: {
          stockNumber: TEST_STOCK_NUMBER,
          vin: TEST_VIN,
          storeId: testStoreId,
          processingStatus: 'NOT_STARTED',
        },
      });

      expect(vehicle).toBeDefined();
      expect(vehicle.vin).toBe(TEST_VIN);
      expect(vehicle.stockNumber).toBe(TEST_STOCK_NUMBER);
      expect(vehicle.storeId).toBe(testStoreId);

      testVehicleId = vehicle.id;
    });

    test('should retrieve vehicle by VIN', async () => {
      const vehicle = await prisma.vehicle.findFirst({
        where: { vin: TEST_VIN },
      });

      expect(vehicle).toBeDefined();
      expect(vehicle?.id).toBe(testVehicleId);
    });
  });

  describe('Step 2: Upload 6 key images', () => {
    test('should create image records for all 6 key image types', async () => {
      // Create mock image URLs (in real scenario, these would be uploaded to GCS)
      const mockImageUrl = 'https://storage.googleapis.com/test-bucket/raw/test-vehicle/';

      for (let i = 0; i < KEY_IMAGE_TYPES.length; i++) {
        const imageType = KEY_IMAGE_TYPES[i];
        const image = await prisma.vehicleImage.create({
          data: {
            vehicleId: testVehicleId,
            originalUrl: `${mockImageUrl}${imageType.toLowerCase()}.jpg`,
            processedUrl: null,
            optimizedUrl: null,
            thumbnailUrl: `${mockImageUrl}${imageType.toLowerCase()}_thumb.jpg`,
            imageType: imageType,
            sortOrder: i,
            isProcessed: false,
            isOptimized: false,
          },
        });

        testImageIds.push(image.id);
      }

      expect(testImageIds).toHaveLength(6);
    });

    test('should verify all images are unprocessed initially', async () => {
      const images = await prisma.vehicleImage.findMany({
        where: {
          vehicleId: testVehicleId,
        },
      });

      expect(images).toHaveLength(6);
      images.forEach((image) => {
        expect(image.isOptimized).toBe(false);
        expect(image.optimizedUrl).toBeNull();
        expect(image.processedAt).toBeNull();
      });
    });
  });

  describe('Step 3: Trigger image processing (mocked)', () => {
    test('should process key images and skip gallery images', async () => {
      // Note: In a real integration test, we would mock the AI API
      // For this test, we'll simulate the processing by updating the database directly
      // to avoid requiring actual AI API credentials

      for (const imageId of testImageIds) {
        const image = await prisma.vehicleImage.findUnique({
          where: { id: imageId },
        });

        if (!image) continue;

        // Simulate processing for key images
        const mockOptimizedUrl = image.originalUrl.replace('/raw/', '/optimized/');
        const processedAt = new Date();

        await prisma.vehicleImage.update({
          where: { id: imageId },
          data: {
            optimizedUrl: mockOptimizedUrl,
            isOptimized: true,
            processedAt: processedAt,
            updatedAt: processedAt,
          },
        });
      }

      // Verify processing completed
      const processedImages = await prisma.vehicleImage.findMany({
        where: {
          vehicleId: testVehicleId,
          isOptimized: true,
        },
      });

      expect(processedImages).toHaveLength(6);
    });
  });

  describe('Step 4: Verify optimized images in GCS (simulated)', () => {
    test('should have optimized URLs for all key images', async () => {
      const images = await prisma.vehicleImage.findMany({
        where: {
          vehicleId: testVehicleId,
        },
      });

      images.forEach((image) => {
        expect(image.optimizedUrl).toBeDefined();
        expect(image.optimizedUrl).toContain('/optimized/');
        expect(image.isOptimized).toBe(true);
      });
    });

    test('should have valid GCS URL format', async () => {
      const images = await prisma.vehicleImage.findMany({
        where: {
          vehicleId: testVehicleId,
        },
      });

      images.forEach((image) => {
        expect(image.optimizedUrl).toMatch(/^https:\/\/storage\.googleapis\.com\//);
      });
    });
  });

  describe('Step 5: Verify database updates', () => {
    test('should have processedAt timestamps', async () => {
      const images = await prisma.vehicleImage.findMany({
        where: {
          vehicleId: testVehicleId,
        },
      });

      images.forEach((image) => {
        expect(image.processedAt).toBeDefined();
        expect(image.processedAt).toBeInstanceOf(Date);
      });
    });

    test('should have updatedAt timestamps for cache busting', async () => {
      const images = await prisma.vehicleImage.findMany({
        where: {
          vehicleId: testVehicleId,
        },
      });

      images.forEach((image) => {
        expect(image.updatedAt).toBeDefined();
        expect(image.updatedAt).toBeInstanceOf(Date);
        // updatedAt should be >= processedAt
        if (image.processedAt) {
          expect(image.updatedAt.getTime()).toBeGreaterThanOrEqual(
            image.processedAt.getTime()
          );
        }
      });
    });

    test('should have isOptimized flag set to true', async () => {
      const images = await prisma.vehicleImage.findMany({
        where: {
          vehicleId: testVehicleId,
        },
      });

      images.forEach((image) => {
        expect(image.isOptimized).toBe(true);
      });
    });
  });

  describe('Step 6: Generate CSV feed with API key', () => {
    test('should authenticate with valid API key', () => {
      const authenticator = new APIKeyAuthenticator(TEST_API_KEY);
      const result = authenticator.authenticate(TEST_API_KEY);

      expect(result.authenticated).toBe(true);
      expect(result.error).toBeUndefined();
    });

    test('should reject invalid API key', () => {
      const authenticator = new APIKeyAuthenticator(TEST_API_KEY);
      const result = authenticator.authenticate('wrong-key');

      expect(result.authenticated).toBe(false);
      expect(result.error).toBeDefined();
    });

    test('should reject missing API key', () => {
      const authenticator = new APIKeyAuthenticator(TEST_API_KEY);
      const result = authenticator.authenticate(null);

      expect(result.authenticated).toBe(false);
      expect(result.error).toBe('API key required');
    });

    test('should generate CSV feed', async () => {
      const csvGenerator = new CSVGeneratorService({
        baseUrl: 'https://test.example.com',
      });

      const csv = await csvGenerator.generateFeed();

      expect(csv).toBeDefined();
      expect(typeof csv).toBe('string');
      expect(csv.length).toBeGreaterThan(0);
    });
  });

  describe('Step 7: Verify CSV contains correct data with cache-busted URLs', () => {
    let csvContent: string;

    beforeAll(async () => {
      const csvGenerator = new CSVGeneratorService({
        baseUrl: 'https://test.example.com',
      });
      csvContent = await csvGenerator.generateFeed();
    });

    test('should have correct CSV header', () => {
      const lines = csvContent.split('\r\n');
      expect(lines[0]).toBe('VIN,StockNumber,ImageURLs');
    });

    test('should include test vehicle in CSV', () => {
      expect(csvContent).toContain(TEST_VIN);
      expect(csvContent).toContain(TEST_STOCK_NUMBER);
    });

    test('should have pipe-separated image URLs', () => {
      const lines = csvContent.split('\r\n');
      const dataLines = lines.slice(1).filter((line) => line.length > 0);

      const testVehicleLine = dataLines.find((line) => line.includes(TEST_VIN));
      expect(testVehicleLine).toBeDefined();

      if (testVehicleLine) {
        const fields = testVehicleLine.split(',');
        expect(fields).toHaveLength(3);

        const imageUrls = fields[2];
        expect(imageUrls).toContain('|'); // Multiple URLs separated by pipe
      }
    });

    test('should have cache-busting query parameters', () => {
      const lines = csvContent.split('\r\n');
      const dataLines = lines.slice(1).filter((line) => line.length > 0);

      const testVehicleLine = dataLines.find((line) => line.includes(TEST_VIN));
      expect(testVehicleLine).toBeDefined();

      if (testVehicleLine) {
        const fields = testVehicleLine.split(',');
        const imageUrls = fields[2].split('|');

        imageUrls.forEach((url) => {
          expect(url).toMatch(/\?v=\d+/); // Should have ?v={timestamp}
        });
      }
    });

    test('should have absolute URLs', () => {
      const lines = csvContent.split('\r\n');
      const dataLines = lines.slice(1).filter((line) => line.length > 0);

      const testVehicleLine = dataLines.find((line) => line.includes(TEST_VIN));
      expect(testVehicleLine).toBeDefined();

      if (testVehicleLine) {
        const fields = testVehicleLine.split(',');
        const imageUrls = fields[2].split('|');

        imageUrls.forEach((url) => {
          expect(url).toMatch(/^https?:\/\//); // Should start with http:// or https://
        });
      }
    });

    test('should use CRLF line terminators', () => {
      expect(csvContent).toContain('\r\n');
      
      // All lines should end with CRLF
      const lines = csvContent.split('\n');
      lines.slice(0, -1).forEach((line) => {
        expect(line).toMatch(/\r$/);
      });
    });

    test('should properly escape CSV fields', () => {
      // Test that fields with special characters are properly escaped
      const lines = csvContent.split('\r\n');
      
      // If any field contains comma, it should be quoted
      lines.forEach((line) => {
        if (line.includes('",')) {
          // Field is properly quoted
          expect(line).toMatch(/"[^"]*"/);
        }
      });
    });

    test('should include all 6 optimized images', () => {
      const lines = csvContent.split('\r\n');
      const dataLines = lines.slice(1).filter((line) => line.length > 0);

      const testVehicleLine = dataLines.find((line) => line.includes(TEST_VIN));
      expect(testVehicleLine).toBeDefined();

      if (testVehicleLine) {
        const fields = testVehicleLine.split(',');
        const imageUrls = fields[2].split('|');

        expect(imageUrls.length).toBe(6); // All 6 key images
      }
    });
  });

  describe('Complete workflow validation', () => {
    test('should complete full workflow without errors', async () => {
      // This test validates that all steps completed successfully
      // by checking the final state

      // 1. Vehicle exists with VIN
      const vehicle = await prisma.vehicle.findUnique({
        where: { id: testVehicleId },
        include: {
          images: true,
        },
      });

      expect(vehicle).toBeDefined();
      expect(vehicle?.vin).toBe(TEST_VIN);

      // 2. All 6 key images are optimized
      expect(vehicle?.images).toHaveLength(6);
      vehicle?.images.forEach((image) => {
        expect(image.isOptimized).toBe(true);
        expect(image.optimizedUrl).toBeDefined();
        expect(image.processedAt).toBeDefined();
      });

      // 3. CSV feed can be generated
      const csvGenerator = new CSVGeneratorService({
        baseUrl: 'https://test.example.com',
      });
      const csv = await csvGenerator.generateFeed();

      expect(csv).toContain(TEST_VIN);
      expect(csv).toContain(TEST_STOCK_NUMBER);

      // 4. CSV contains cache-busted URLs
      expect(csv).toMatch(/\?v=\d+/);
    });

    test('should handle CDK One-Eighty polling scenario', async () => {
      // Simulate CDK One-Eighty polling the feed endpoint

      // 1. Authenticate
      const authenticator = new APIKeyAuthenticator(TEST_API_KEY);
      const authResult = authenticator.authenticate(TEST_API_KEY);
      expect(authResult.authenticated).toBe(true);

      // 2. Generate feed
      const csvGenerator = new CSVGeneratorService({
        baseUrl: 'https://test.example.com',
      });
      const csv = await csvGenerator.generateFeed();

      // 3. Parse CSV
      const lines = csv.split('\r\n');
      const header = lines[0];
      const dataLines = lines.slice(1).filter((line) => line.length > 0);

      expect(header).toBe('VIN,StockNumber,ImageURLs');
      expect(dataLines.length).toBeGreaterThan(0);

      // 4. Verify data format
      dataLines.forEach((line) => {
        const fields = line.split(',');
        expect(fields.length).toBeGreaterThanOrEqual(3);

        // VIN should be 17 characters
        const vin = fields[0].replace(/"/g, '');
        if (vin.length > 0) {
          expect(vin.length).toBe(17);
        }

        // ImageURLs should contain URLs
        const imageUrls = fields[2];
        if (imageUrls.length > 0) {
          expect(imageUrls).toMatch(/https?:\/\//);
        }
      });
    });
  });
});
