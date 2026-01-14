import { GoogleCloudStorageService, GCSConfig } from '@/lib/services/gcs-service';

// Mock the @google-cloud/storage module
jest.mock('@google-cloud/storage', () => {
  const mockFile = {
    save: jest.fn().mockResolvedValue(undefined),
    delete: jest.fn().mockResolvedValue(undefined),
  };

  const mockBucket = {
    file: jest.fn(() => mockFile),
  };

  const mockStorage = jest.fn(() => ({
    bucket: jest.fn(() => mockBucket),
  }));

  return {
    Storage: mockStorage,
  };
});

// Mock uuid
jest.mock('uuid', () => ({
  v4: jest.fn(() => 'test-uuid-1234'),
}));

describe('GoogleCloudStorageService', () => {
  let service: GoogleCloudStorageService;
  const mockConfig: GCSConfig = {
    projectId: 'test-project',
    bucketName: 'test-bucket',
    credentials: { type: 'service_account' },
  };

  beforeEach(() => {
    jest.clearAllMocks();
    service = new GoogleCloudStorageService(mockConfig);
  });

  describe('constructor', () => {
    it('should initialize with provided config', () => {
      expect(service).toBeDefined();
    });

    it('should accept keyFilename configuration', () => {
      const configWithKeyFile: GCSConfig = {
        projectId: 'test-project',
        bucketName: 'test-bucket',
        keyFilename: '/path/to/key.json',
      };
      
      const serviceWithKeyFile = new GoogleCloudStorageService(configWithKeyFile);
      expect(serviceWithKeyFile).toBeDefined();
    });

    it('should accept inline credentials configuration', () => {
      const configWithCredentials: GCSConfig = {
        projectId: 'test-project',
        bucketName: 'test-bucket',
        credentials: { type: 'service_account', project_id: 'test' },
      };
      
      const serviceWithCredentials = new GoogleCloudStorageService(configWithCredentials);
      expect(serviceWithCredentials).toBeDefined();
    });
  });

  describe('uploadImage', () => {
    it('should upload image and return public URL', async () => {
      const buffer = Buffer.from('test image data');
      const filename = 'test-image.jpg';
      const contentType = 'image/jpeg';

      const result = await service.uploadImage(buffer, filename, contentType);

      expect(result).toEqual({
        publicUrl: `https://storage.googleapis.com/test-bucket/${filename}`,
        bucket: 'test-bucket',
        filename: filename,
      });
    });

    it('should handle different content types', async () => {
      const buffer = Buffer.from('test image data');
      const filename = 'test-image.png';
      const contentType = 'image/png';

      const result = await service.uploadImage(buffer, filename, contentType);

      expect(result.publicUrl).toContain(filename);
      expect(result.bucket).toBe('test-bucket');
    });
  });

  describe('getPublicUrl', () => {
    it('should return correct public URL format', async () => {
      const filename = 'optimized/vehicle-123/image.jpg';
      
      const url = await service.getPublicUrl(filename);

      expect(url).toBe(`https://storage.googleapis.com/test-bucket/${filename}`);
    });

    it('should handle filenames with special characters', async () => {
      const filename = 'optimized/vehicle-123/image with spaces.jpg';
      
      const url = await service.getPublicUrl(filename);

      expect(url).toContain(filename);
    });
  });

  describe('deleteImage', () => {
    it('should delete image successfully', async () => {
      const filename = 'test-image.jpg';

      await expect(service.deleteImage(filename)).resolves.not.toThrow();
    });

    it('should handle non-existent file gracefully', async () => {
      const { Storage } = require('@google-cloud/storage');
      const mockStorage = new Storage();
      const mockBucket = mockStorage.bucket();
      const mockFile = mockBucket.file();
      
      // Mock file.delete to throw "No such object" error
      mockFile.delete.mockRejectedValueOnce(new Error('No such object'));

      const filename = 'non-existent.jpg';

      // Should not throw, just log warning
      await expect(service.deleteImage(filename)).resolves.not.toThrow();
    });
  });

  describe('generateUniqueFilename', () => {
    it('should generate unique filename with vehicle ID', () => {
      const originalName = 'photo.jpg';
      const vehicleId = 'vehicle-123';

      const filename = service.generateUniqueFilename(originalName, vehicleId);

      expect(filename).toContain('optimized/vehicle-123/');
      expect(filename).toContain('test-uuid-1234');
      expect(filename).toMatch(/_\d+\.jpg$/);
    });

    it('should preserve file extension', () => {
      const testCases = [
        { name: 'photo.jpg', ext: 'jpg' },
        { name: 'image.png', ext: 'png' },
        { name: 'picture.jpeg', ext: 'jpeg' },
        { name: 'graphic.gif', ext: 'gif' },
      ];

      testCases.forEach(({ name, ext }) => {
        const filename = service.generateUniqueFilename(name, 'vehicle-123');
        expect(filename).toMatch(new RegExp(`\\.${ext}$`));
      });
    });

    it('should default to jpg for files without extension', () => {
      const filename = service.generateUniqueFilename('photo', 'vehicle-123');
      expect(filename).toMatch(/\.jpg$/);
    });

    it('should include timestamp for uniqueness', () => {
      const vehicleId = 'vehicle-123';
      const originalName = 'photo.jpg';

      const filename1 = service.generateUniqueFilename(originalName, vehicleId);
      
      // Small delay to ensure different timestamp
      const filename2 = service.generateUniqueFilename(originalName, vehicleId);

      // Both should have timestamp pattern
      expect(filename1).toMatch(/_\d+\.jpg$/);
      expect(filename2).toMatch(/_\d+\.jpg$/);
    });

    it('should create path structure with optimized folder', () => {
      const filename = service.generateUniqueFilename('photo.jpg', 'vehicle-456');

      expect(filename).toMatch(/^optimized\/vehicle-456\//);
    });
  });
});
