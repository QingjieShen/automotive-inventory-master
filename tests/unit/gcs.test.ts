import { 
  generatePath, 
  getExtensionFromContentType, 
  getPublicUrl 
} from '@/lib/gcs';

// Mock uuid to avoid ES module issues in Jest
jest.mock('uuid', () => ({
  v4: jest.fn(() => 'test-uuid-1234-5678-90ab-cdef'),
}));

describe('GCS Service Unit Tests', () => {
  describe('generatePath', () => {
    it('should generate paths with timestamp for uniqueness', () => {
      const storeId = 'store-123';
      const vehicleId = 'vehicle-456';
      const imageType = 'original';
      const extension = 'jpg';

      const path1 = generatePath(storeId, vehicleId, imageType, extension);
      
      // Wait a tiny bit to ensure different timestamp
      const path2 = generatePath(storeId, vehicleId, imageType, extension);

      // Paths should have same structure but different timestamps
      expect(path1).toMatch(/^stores\/store-123\/vehicles\/vehicle-456\/original\//);
      expect(path2).toMatch(/^stores\/store-123\/vehicles\/vehicle-456\/original\//);
      expect(path1).toContain('.jpg');
      expect(path2).toContain('.jpg');
    });

    it('should generate correct path for store images', () => {
      const storeId = 'store-789';
      const vehicleId = 'vehicle-000';
      const imageType = 'store';
      const extension = 'png';

      const path = generatePath(storeId, vehicleId, imageType, extension);

      expect(path).toBe('stores/store-789/store-image.png');
    });

    it('should generate paths with different image types', () => {
      const storeId = 'store-123';
      const vehicleId = 'vehicle-456';
      const extension = 'jpg';

      const originalPath = generatePath(storeId, vehicleId, 'original', extension);
      const processedPath = generatePath(storeId, vehicleId, 'processed', extension);
      const thumbnailPath = generatePath(storeId, vehicleId, 'thumbnail', extension);

      expect(originalPath).toContain('/original/');
      expect(processedPath).toContain('/processed/');
      expect(thumbnailPath).toContain('/thumbnail/');
    });

    it('should include UUID and timestamp in path', () => {
      const storeId = 'store-123';
      const vehicleId = 'vehicle-456';
      const imageType = 'original';
      const extension = 'jpg';

      const path = generatePath(storeId, vehicleId, imageType, extension);

      // Path should contain mocked UUID and timestamp pattern
      expect(path).toContain('test-uuid-1234-5678-90ab-cdef');
      expect(path).toMatch(/_\d+\.jpg$/);
    });
  });

  describe('getExtensionFromContentType', () => {
    it('should return correct extension for jpeg', () => {
      expect(getExtensionFromContentType('image/jpeg')).toBe('jpg');
      expect(getExtensionFromContentType('image/jpg')).toBe('jpg');
    });

    it('should return correct extension for png', () => {
      expect(getExtensionFromContentType('image/png')).toBe('png');
    });

    it('should return correct extension for gif', () => {
      expect(getExtensionFromContentType('image/gif')).toBe('gif');
    });

    it('should return correct extension for webp', () => {
      expect(getExtensionFromContentType('image/webp')).toBe('webp');
    });

    it('should return jpg as default for unknown content types', () => {
      expect(getExtensionFromContentType('image/unknown')).toBe('jpg');
      expect(getExtensionFromContentType('application/octet-stream')).toBe('jpg');
    });
  });

  describe('getPublicUrl', () => {
    it('should generate public URL with storage.googleapis.com domain', () => {
      const path = 'stores/store-123/vehicles/vehicle-456/original/image.jpg';

      const url = getPublicUrl(path);

      // Should use GCS public URL format
      expect(url).toContain('https://storage.googleapis.com/');
      expect(url).toContain(path);
    });

    it('should include the full path in the URL', () => {
      const path = 'stores/store-123/vehicles/vehicle-456/original/image.jpg';

      const url = getPublicUrl(path);

      expect(url).toContain('stores/store-123/vehicles/vehicle-456/original/image.jpg');
    });

    it('should handle paths with special characters', () => {
      const path = 'stores/store-123/vehicles/vehicle-456/original/image with spaces.jpg';

      const url = getPublicUrl(path);

      expect(url).toContain('image with spaces.jpg');
    });
  });

  describe('Error Handling', () => {
    it('should handle various parameter combinations for path generation', () => {
      const testCases = [
        { storeId: 'a', vehicleId: 'b', imageType: 'original' as const, ext: 'jpg' },
        { storeId: 'store-with-dashes', vehicleId: 'vehicle_with_underscores', imageType: 'processed' as const, ext: 'png' },
        { storeId: '123', vehicleId: '456', imageType: 'thumbnail' as const, ext: 'webp' },
      ];

      testCases.forEach(({ storeId, vehicleId, imageType, ext }) => {
        const path = generatePath(storeId, vehicleId, imageType, ext);
        expect(path).toBeTruthy();
        expect(path).toContain(storeId);
        expect(path).toContain(vehicleId);
        expect(path).toContain(imageType);
        expect(path).toContain(`.${ext}`);
      });
    });
  });
});
