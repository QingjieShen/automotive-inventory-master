/**
 * VIN Validation Utility
 * 
 * Validates Vehicle Identification Numbers (VINs) according to standard format:
 * - Exactly 17 characters
 * - Alphanumeric only
 * - Excludes I, O, Q to avoid confusion with 1, 0
 */

export interface VINValidationResult {
  valid: boolean;
  error?: string;
}

/**
 * Validates a VIN string
 * @param vin - The VIN string to validate
 * @returns Validation result with error message if invalid
 */
export function validateVIN(vin: string): VINValidationResult {
  // Check if VIN is empty
  if (!vin || vin.trim().length === 0) {
    return {
      valid: false,
      error: 'VIN is required and cannot be empty',
    };
  }

  // Check if VIN is exactly 17 characters
  if (vin.length !== 17) {
    return {
      valid: false,
      error: `VIN must be exactly 17 characters (provided: ${vin.length})`,
    };
  }

  // Check if VIN contains only valid characters (A-Z, 0-9, excluding I, O, Q)
  const validVINPattern = /^[A-HJ-NPR-Z0-9]{17}$/;
  if (!validVINPattern.test(vin)) {
    return {
      valid: false,
      error: 'VIN must contain only alphanumeric characters (A-Z, 0-9) excluding I, O, and Q',
    };
  }

  return {
    valid: true,
  };
}
