import { BackgroundTemplateService } from '@/lib/services/background-template-service';
import { ImageType } from '@/types';

describe('BackgroundTemplateService', () => {
  let service: BackgroundTemplateService;
  const testBucketName = 'test-bucket';

  beforeEach(() => {
    service = new BackgroundTemplateService({
      bucketName: testBucketName,
    });
  });

  describe('selectBackgroundTemplate', () => {
    it('should return studio-white template for FRONT_QUARTER', async () => {
      const result = await service.selectBackgroundTemplate('FRONT_QUARTER');
      
      expect(result).not.toBeNull();
      expect(result?.templateName).toBe('studio-white.jpg');
      expect(result?.imageType).toBe('FRONT_QUARTER');
      expect(result?.templateUrl).toBe(
        `https://storage.googleapis.com/${testBucketName}/backgrounds/studio-white.jpg`
      );
    });

    it('should return studio-white template for FRONT', async () => {
      const result = await service.selectBackgroundTemplate('FRONT');
      
      expect(result).not.toBeNull();
      expect(result?.templateName).toBe('studio-white.jpg');
      expect(result?.imageType).toBe('FRONT');
    });

    it('should return studio-gray template for BACK_QUARTER', async () => {
      const result = await service.selectBackgroundTemplate('BACK_QUARTER');
      
      expect(result).not.toBeNull();
      expect(result?.templateName).toBe('studio-gray.jpg');
      expect(result?.imageType).toBe('BACK_QUARTER');
    });

    it('should return studio-gray template for BACK', async () => {
      const result = await service.selectBackgroundTemplate('BACK');
      
      expect(result).not.toBeNull();
      expect(result?.templateName).toBe('studio-gray.jpg');
      expect(result?.imageType).toBe('BACK');
    });

    it('should return gradient-blue template for DRIVER_SIDE', async () => {
      const result = await service.selectBackgroundTemplate('DRIVER_SIDE');
      
      expect(result).not.toBeNull();
      expect(result?.templateName).toBe('gradient-blue.jpg');
      expect(result?.imageType).toBe('DRIVER_SIDE');
    });

    it('should return gradient-blue template for PASSENGER_SIDE', async () => {
      const result = await service.selectBackgroundTemplate('PASSENGER_SIDE');
      
      expect(result).not.toBeNull();
      expect(result?.templateName).toBe('gradient-blue.jpg');
      expect(result?.imageType).toBe('PASSENGER_SIDE');
    });

    it('should return null for GALLERY image type', async () => {
      const result = await service.selectBackgroundTemplate('GALLERY');
      
      expect(result).toBeNull();
    });

    it('should return null for GALLERY_EXTERIOR image type', async () => {
      const result = await service.selectBackgroundTemplate('GALLERY_EXTERIOR');
      
      expect(result).toBeNull();
    });

    it('should return null for GALLERY_INTERIOR image type', async () => {
      const result = await service.selectBackgroundTemplate('GALLERY_INTERIOR');
      
      expect(result).toBeNull();
    });
  });

  describe('isKeyImageType', () => {
    it('should return true for key image types', () => {
      expect(service.isKeyImageType('FRONT_QUARTER')).toBe(true);
      expect(service.isKeyImageType('FRONT')).toBe(true);
      expect(service.isKeyImageType('BACK_QUARTER')).toBe(true);
      expect(service.isKeyImageType('BACK')).toBe(true);
      expect(service.isKeyImageType('DRIVER_SIDE')).toBe(true);
      expect(service.isKeyImageType('PASSENGER_SIDE')).toBe(true);
    });

    it('should return false for gallery image types', () => {
      expect(service.isKeyImageType('GALLERY')).toBe(false);
      expect(service.isKeyImageType('GALLERY_EXTERIOR')).toBe(false);
      expect(service.isKeyImageType('GALLERY_INTERIOR')).toBe(false);
    });
  });

  describe('getAvailableTemplates', () => {
    it('should return all available templates with their image types', () => {
      const templates = service.getAvailableTemplates();
      
      expect(templates).toHaveLength(3); // 3 unique templates
      
      const studioWhite = templates.find(t => t.templateName === 'studio-white.jpg');
      expect(studioWhite?.imageTypes).toContain('FRONT_QUARTER');
      expect(studioWhite?.imageTypes).toContain('FRONT');
      
      const studioGray = templates.find(t => t.templateName === 'studio-gray.jpg');
      expect(studioGray?.imageTypes).toContain('BACK_QUARTER');
      expect(studioGray?.imageTypes).toContain('BACK');
      
      const gradientBlue = templates.find(t => t.templateName === 'gradient-blue.jpg');
      expect(gradientBlue?.imageTypes).toContain('DRIVER_SIDE');
      expect(gradientBlue?.imageTypes).toContain('PASSENGER_SIDE');
    });
  });

  describe('getTemplateName', () => {
    it('should return template name for key image types', () => {
      expect(service.getTemplateName('FRONT_QUARTER')).toBe('studio-white.jpg');
      expect(service.getTemplateName('BACK')).toBe('studio-gray.jpg');
      expect(service.getTemplateName('DRIVER_SIDE')).toBe('gradient-blue.jpg');
    });

    it('should return null for gallery image types', () => {
      expect(service.getTemplateName('GALLERY')).toBeNull();
      expect(service.getTemplateName('GALLERY_EXTERIOR')).toBeNull();
      expect(service.getTemplateName('GALLERY_INTERIOR')).toBeNull();
    });
  });

  describe('updateTemplateMapping', () => {
    it('should update template mapping for key image types', () => {
      service.updateTemplateMapping('FRONT', 'custom-white.jpg');
      
      expect(service.getTemplateName('FRONT')).toBe('custom-white.jpg');
    });

    it('should throw error when updating gallery image type', () => {
      expect(() => {
        service.updateTemplateMapping('GALLERY', 'custom.jpg');
      }).toThrow('Cannot update template mapping for gallery image type');
    });
  });

  describe('custom base URL', () => {
    it('should use custom base URL when provided', async () => {
      const customService = new BackgroundTemplateService({
        bucketName: testBucketName,
        baseUrl: 'https://custom-cdn.example.com',
      });

      const result = await customService.selectBackgroundTemplate('FRONT');
      
      expect(result?.templateUrl).toBe(
        'https://custom-cdn.example.com/backgrounds/studio-white.jpg'
      );
    });
  });
});
