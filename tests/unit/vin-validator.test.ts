/**
 * Unit Tests for VIN Validator
 * 
 * Tests specific edge cases for VIN validation:
 * - Empty string
 * - 16 characters
 * - 18 characters
 * - Invalid characters (I, O, Q)
 * 
 * Requirements: 1.2, 1.3, 1.4
 */

import { validateVIN } from '@/lib/validators/vin-validator';

describe('VIN Validator Unit Tests', () => {
  describe('Empty string validation', () => {
    test('should reject empty string', () => {
      const result = validateVIN('');
      
      expect(result.valid).toBe(false);
      expect(result.error).toBeDefined();
      expect(result.error).toContain('required');
    });

    test('should reject whitespace-only string', () => {
      const result = validateVIN('   ');
      
      expect(result.valid).toBe(false);
      expect(result.error).toBeDefined();
      expect(result.error).toContain('required');
    });
  });

  describe('16 character VIN validation', () => {
    test('should reject VIN with exactly 16 characters', () => {
      const vin16 = '1HGBH41JXMN10918'; // 16 chars, all valid
      const result = validateVIN(vin16);
      
      expect(result.valid).toBe(false);
      expect(result.error).toBeDefined();
      expect(result.error).toContain('17 characters');
      expect(result.error).toContain('16');
    });

    test('should reject VIN with 16 valid alphanumeric characters', () => {
      const vin16 = 'ABCDEFGH12345678'; // 16 chars
      const result = validateVIN(vin16);
      
      expect(result.valid).toBe(false);
      expect(result.error).toBeDefined();
      expect(result.error).toMatch(/17.*character/i);
    });
  });

  describe('18 character VIN validation', () => {
    test('should reject VIN with exactly 18 characters', () => {
      const vin18 = '1HGBH41JXMN109186X'; // 18 chars, all valid
      const result = validateVIN(vin18);
      
      expect(result.valid).toBe(false);
      expect(result.error).toBeDefined();
      expect(result.error).toContain('17 characters');
      expect(result.error).toContain('18');
    });

    test('should reject VIN with 18 valid alphanumeric characters', () => {
      const vin18 = 'ABCDEFGH123456789X'; // 18 chars
      const result = validateVIN(vin18);
      
      expect(result.valid).toBe(false);
      expect(result.error).toBeDefined();
      expect(result.error).toMatch(/17.*character/i);
    });
  });

  describe('Invalid character validation', () => {
    test('should reject VIN containing letter I', () => {
      const vinWithI = '1HGBH41JXMN10918I'; // Contains I
      const result = validateVIN(vinWithI);
      
      expect(result.valid).toBe(false);
      expect(result.error).toBeDefined();
      expect(result.error).toMatch(/I.*O.*Q/i);
    });

    test('should reject VIN containing letter O', () => {
      const vinWithO = '1HGBH41JXMN10918O'; // Contains O
      const result = validateVIN(vinWithO);
      
      expect(result.valid).toBe(false);
      expect(result.error).toBeDefined();
      expect(result.error).toMatch(/I.*O.*Q/i);
    });

    test('should reject VIN containing letter Q', () => {
      const vinWithQ = '1HGBH41JXMN10918Q'; // Contains Q
      const result = validateVIN(vinWithQ);
      
      expect(result.valid).toBe(false);
      expect(result.error).toBeDefined();
      expect(result.error).toMatch(/I.*O.*Q/i);
    });

    test('should reject VIN containing lowercase letters', () => {
      const vinWithLowercase = '1hgbh41jxmn109186'; // Lowercase
      const result = validateVIN(vinWithLowercase);
      
      expect(result.valid).toBe(false);
      expect(result.error).toBeDefined();
    });

    test('should reject VIN containing special characters', () => {
      const vinWithSpecial = '1HGBH41JXMN10918-'; // Contains hyphen
      const result = validateVIN(vinWithSpecial);
      
      expect(result.valid).toBe(false);
      expect(result.error).toBeDefined();
    });

    test('should reject VIN containing spaces', () => {
      const vinWithSpace = '1HGBH41JXMN10918 '; // Contains space
      const result = validateVIN(vinWithSpace);
      
      expect(result.valid).toBe(false);
      expect(result.error).toBeDefined();
    });
  });

  describe('Valid VIN validation', () => {
    test('should accept valid 17-character VIN with uppercase letters and numbers', () => {
      const validVin = '1HGBH41JXMN109186';
      const result = validateVIN(validVin);
      
      expect(result.valid).toBe(true);
      expect(result.error).toBeUndefined();
    });

    test('should accept VIN with all valid letters (excluding I, O, Q)', () => {
      const validVin = 'ABCDEFGHJKLMNPRST'; // 17 chars, no I, O, Q
      const result = validateVIN(validVin);
      
      expect(result.valid).toBe(true);
      expect(result.error).toBeUndefined();
    });

    test('should accept VIN with all numbers', () => {
      const validVin = '12345678901234567'; // 17 digits
      const result = validateVIN(validVin);
      
      expect(result.valid).toBe(true);
      expect(result.error).toBeUndefined();
    });

    test('should accept VIN with mix of letters and numbers', () => {
      const validVin = '5YJSA1E14HF123456'; // Tesla VIN format
      const result = validateVIN(validVin);
      
      expect(result.valid).toBe(true);
      expect(result.error).toBeUndefined();
    });
  });
});
