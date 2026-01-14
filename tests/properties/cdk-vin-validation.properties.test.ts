import * as fc from 'fast-check';
import { validateVIN } from '@/lib/validators/vin-validator';

describe('VIN Validation Property Tests', () => {
  // Feature: cdk-one-eighty-integration, Property 1: VIN Validation Rejects Invalid Inputs
  // Validates: Requirements 1.2, 1.3, 1.4
  
  test('rejects VINs with incorrect length', () => {
    fc.assert(
      fc.property(
        fc.string().filter(s => s.length !== 17 && s.trim().length > 0),
        (invalidVin) => {
          const result = validateVIN(invalidVin);
          expect(result.valid).toBe(false);
          expect(result.error).toBeDefined();
          expect(result.error).toMatch(/17|character|length|required|empty/i);
        }
      ),
      { numRuns: 20 }
    );
  });

  test('rejects VINs containing invalid characters (I, O, Q)', () => {
    fc.assert(
      fc.property(
        fc.string({ minLength: 17, maxLength: 17 }).filter(s => /[IOQ]/.test(s)),
        (invalidVin) => {
          const result = validateVIN(invalidVin);
          expect(result.valid).toBe(false);
          expect(result.error).toBeDefined();
          expect(result.error).toMatch(/alphanumeric|I|O|Q|character/i);
        }
      ),
      { numRuns: 20 }
    );
  });

  test('rejects VINs with non-alphanumeric characters', () => {
    fc.assert(
      fc.property(
        fc.tuple(
          fc.array(fc.constantFrom('A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'J', 'K', 'L', 'M', 'N', 'P', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z', '0', '1', '2', '3', '4', '5', '6', '7', '8', '9'), { minLength: 0, maxLength: 16 }),
          fc.constantFrom('!', '@', '#', '$', '%', '^', '&', '*', '(', ')', '-', '_', '=', '+', '[', ']', '{', '}', '|', '\\', ';', ':', '\'', '"', ',', '.', '<', '>', '/', '?', ' '),
          fc.array(fc.constantFrom('A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'J', 'K', 'L', 'M', 'N', 'P', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z', '0', '1', '2', '3', '4', '5', '6', '7', '8', '9'), { minLength: 0, maxLength: 16 })
        ).map(([prefix, special, suffix]) => {
          const combined = prefix.join('') + special + suffix.join('');
          return combined.substring(0, 17).padEnd(17, 'A');
        }),
        (invalidVin) => {
          const result = validateVIN(invalidVin);
          expect(result.valid).toBe(false);
          expect(result.error).toBeDefined();
        }
      ),
      { numRuns: 20 }
    );
  });

  test('rejects empty or whitespace-only VINs', () => {
    fc.assert(
      fc.property(
        fc.constantFrom('', ' ', '  ', '\t', '\n', '   \t\n   '),
        (emptyVin) => {
          const result = validateVIN(emptyVin);
          expect(result.valid).toBe(false);
          expect(result.error).toBeDefined();
          expect(result.error).toMatch(/required|empty/i);
        }
      ),
      { numRuns: 20 }
    );
  });

  test('accepts valid VINs with correct format', () => {
    fc.assert(
      fc.property(
        fc.array(
          fc.constantFrom(
            'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'J', 'K', 'L', 'M', 'N', 'P', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z',
            '0', '1', '2', '3', '4', '5', '6', '7', '8', '9'
          ),
          { minLength: 17, maxLength: 17 }
        ).map(arr => arr.join('')),
        (validVin) => {
          const result = validateVIN(validVin);
          expect(result.valid).toBe(true);
          expect(result.error).toBeUndefined();
        }
      ),
      { numRuns: 20 }
    );
  });

  test('all invalid VINs return descriptive error messages', () => {
    fc.assert(
      fc.property(
        fc.oneof(
          fc.string().filter(s => s.length !== 17),
          fc.string({ minLength: 17, maxLength: 17 }).filter(s => /[IOQ]/.test(s)),
          fc.string({ minLength: 17, maxLength: 17 }).filter(s => /[^A-HJ-NPR-Z0-9]/.test(s)),
          fc.constantFrom('', ' ', '  ')
        ),
        (invalidVin) => {
          const result = validateVIN(invalidVin);
          expect(result.valid).toBe(false);
          expect(result.error).toBeDefined();
          expect(typeof result.error).toBe('string');
          expect(result.error!.length).toBeGreaterThan(0);
        }
      ),
      { numRuns: 20 }
    );
  });
});
