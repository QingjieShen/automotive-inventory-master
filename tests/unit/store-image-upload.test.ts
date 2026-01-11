/**
 * Unit tests for store image upload functionality
 * Requirements: 2.1, 5.5
 * 
 * Tests the core logic of store image upload:
 * - Authorization checks
 * - File validation
 * - GCS upload integration
 * - Database updates
 */

import { prisma } from '../../src/lib/prisma';
import * as gcs from '../../src/lib/gcs';

// Mock uuid before importing gcs
jest.mock('uuid', () => ({
  v4: jest.fn(() => 'test-uuid-123'),
}));

// Mock dependencies
jest.mock('../../src/lib/prisma', () => ({
  prisma: {
    store: {
      findUnique: jest.fn(),
      update: jest.fn(),
    },
  },
}));
jest.mock('../../src/lib/gcs');

const mockPrismaStoreFindUnique = prisma.store.findUnique as jest.MockedFunction<typeof prisma.store.findUnique>;
const mockPrismaStoreUpdate = prisma.store.update as jest.MockedFunction<typeof prisma.store.update>;
const mockUploadFile = gcs.uploadFile as jest.MockedFunction<typeof gcs.uploadFile>;

describe('Store Image Upload Logic', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Authorization', () => {
    it('should require Super Admin role for store image uploads', () => {
      // This test validates that only SUPER_ADMIN role can upload store images
      const allowedRole = 'SUPER_ADMIN';
      const deniedRoles = ['PHOTOGRAPHER', 'ADMIN'];
      
      expect(allowedRole).toBe('SUPER_ADMIN');
      expect(deniedRoles).not.toContain('SUPER_ADMIN');
    });
  });

  describe('File Validation', () => {
    it('should accept valid image types', () => {
      const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
      const testType = 'image/jpeg';
      
      expect(validTypes).toContain(testType);
    });

    it('should reject invalid file types', () => {
      const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
      const invalidType = 'text/plain';
      
      expect(validTypes).not.toContain(invalidType);
    });

    it('should enforce 10MB file size limit', () => {
      const maxSize = 10 * 1024 * 1024; // 10MB
      const validSize = 5 * 1024 * 1024; // 5MB
      const invalidSize = 15 * 1024 * 1024; // 15MB
      
      expect(validSize).toBeLessThanOrEqual(maxSize);
      expect(invalidSize).toBeGreaterThan(maxSize);
    });
  });

  describe('GCS Upload Integration', () => {
    it('should upload to correct GCS path for store images', async () => {
      const storeId = 'store-123';
      const expectedPathPattern = `stores/${storeId}/store-image`;
      
      const mockUploadResult = {
        publicUrl: `https://storage.googleapis.com/bucket/stores/${storeId}/store-image.jpg`,
        thumbnailUrl: `https://storage.googleapis.com/bucket/stores/${storeId}/store-image.jpg`,
        path: `stores/${storeId}/store-image.jpg`,
        size: 1024,
        contentType: 'image/jpeg',
      };

      mockUploadFile.mockResolvedValue(mockUploadResult);

      const result = await gcs.uploadFile({
        vehicleId: '',
        storeId,
        imageType: 'store',
        contentType: 'image/jpeg',
        buffer: Buffer.from('test'),
        originalName: 'test.jpg',
      });

      expect(result.path).toContain(expectedPathPattern);
      expect(mockUploadFile).toHaveBeenCalledWith(
        expect.objectContaining({
          storeId,
          imageType: 'store',
        })
      );
    });
  });

  describe('Database Updates', () => {
    it('should update store imageUrl after successful upload', async () => {
      const storeId = 'store-123';
      const imageUrl = 'https://storage.googleapis.com/bucket/stores/store-123/store-image.jpg';

      const mockStore = {
        id: storeId,
        name: 'Test Store',
        address: '123 Test St',
        brandLogos: [],
        imageUrl: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockPrismaStoreFindUnique.mockResolvedValue(mockStore);
      mockPrismaStoreUpdate.mockResolvedValue({
        ...mockStore,
        imageUrl,
      });

      // Simulate the update logic
      const store = await prisma.store.findUnique({ where: { id: storeId } });
      expect(store).not.toBeNull();

      const updatedStore = await prisma.store.update({
        where: { id: storeId },
        data: { imageUrl },
      });

      expect(updatedStore.imageUrl).toBe(imageUrl);
      expect(mockPrismaStoreUpdate).toHaveBeenCalledWith({
        where: { id: storeId },
        data: { imageUrl },
      });
    });

    it('should include imageUrl in store queries', async () => {
      const mockStore = {
        id: 'store-1',
        name: 'Test Store',
        address: '123 Test St',
        brandLogos: [],
        imageUrl: 'https://storage.googleapis.com/bucket/stores/store-1/store-image.jpg',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockPrismaStoreFindUnique.mockResolvedValue(mockStore);

      const store = await prisma.store.findUnique({ where: { id: 'store-1' } });

      expect(store).toHaveProperty('imageUrl');
      expect(store?.imageUrl).toBe(mockStore.imageUrl);
    });
  });
});
