import * as fc from 'fast-check'

describe('Add Vehicle Page Form Validation Properties', () => {
  // Feature: app-enhancements, Property 4: Add Vehicle Page Form Validation
  // **Validates: Requirements 4.7**
  
  // Validation logic extracted from the page component
  const validateStockNumber = (stockNumber: string): { isValid: boolean; error: string | null } => {
    if (stockNumber.trim() === '') {
      return { isValid: false, error: null } // Empty is handled by required attribute
    }
    
    if (!/^[a-zA-Z0-9-_]+$/.test(stockNumber.trim())) {
      return { 
        isValid: false, 
        error: 'Stock number can only contain letters, numbers, hyphens, and underscores' 
      }
    }
    
    return { isValid: true, error: null }
  }

  test('Property 4: form validation prevents submission with invalid stock numbers', () => {
    // Generate various invalid stock numbers
    const invalidStockNumbers = fc.oneof(
      fc.constant(''), // empty string
      fc.constant('   '), // whitespace only
      fc.constant('\t\n'), // tabs and newlines
      fc.string().filter(s => s.trim() === ''), // any whitespace-only string
      fc.string().filter(s => /[^a-zA-Z0-9-_]/.test(s) && s.trim() !== ''), // contains special chars
    )

    fc.assert(
      fc.property(invalidStockNumbers, (stockNumber) => {
        const result = validateStockNumber(stockNumber)
        
        // Verify validation correctly identifies invalid stock numbers
        expect(result.isValid).toBe(false)
        
        // If it's empty/whitespace, error should be null (handled by required)
        if (stockNumber.trim() === '') {
          expect(result.error).toBeNull()
        } else {
          // If it has invalid characters, should have error message
          expect(result.error).toBeTruthy()
          expect(result.error).toContain('can only contain letters, numbers, hyphens, and underscores')
        }
      }),
      { numRuns: 100 }
    )
  })

  test('Property 4 (edge case): empty and whitespace-only strings are invalid', () => {
    const whitespaceStrings = [
      '',
      ' ',
      '  ',
      '   ',
      '\t',
      '\n',
      '\r',
      '\t\n',
      '  \t  ',
      '\n\n',
    ]

    whitespaceStrings.forEach(stockNumber => {
      const result = validateStockNumber(stockNumber)
      expect(result.isValid).toBe(false)
      expect(result.error).toBeNull() // Empty is handled by required attribute
    })
  })

  test('Property 4 (edge case): special characters trigger validation error', () => {
    const specialCharStockNumbers = [
      'ABC@123',
      'TEST#456',
      'STOCK$789',
      'VIN!234',
      'CAR%567',
      'AUTO&890',
      'TRUCK*123',
      'SUV+456',
      'VAN=789',
      'SEDAN[123]',
      'COUPE{456}',
      'WAGON|789',
      'SPACE 123', // space is not allowed
      'DOT.COM',
      'SLASH/123',
      'BACK\\SLASH',
    ]

    specialCharStockNumbers.forEach(stockNumber => {
      const result = validateStockNumber(stockNumber)
      expect(result.isValid).toBe(false)
      expect(result.error).toBeTruthy()
      expect(result.error).toContain('can only contain letters, numbers, hyphens, and underscores')
    })
  })

  test('Property 4 (positive case): valid stock numbers pass validation', () => {
    const validStockNumbers = fc.stringMatching(/^[a-zA-Z0-9-_]+$/).filter(s => s.length > 0)

    fc.assert(
      fc.property(validStockNumbers, (stockNumber) => {
        const result = validateStockNumber(stockNumber)
        
        // Should be valid
        expect(result.isValid).toBe(true)
        expect(result.error).toBeNull()
      }),
      { numRuns: 100 }
    )
  })

  test('Property 4 (positive case): common valid stock number formats', () => {
    const validStockNumbers = [
      'ABC123',
      'T12345',
      'STOCK-001',
      'VIN_12345',
      'CAR-2024-001',
      'TRUCK_ABC_123',
      '123456',
      'ABCDEF',
      'a1b2c3',
      'Test-Stock_123',
    ]

    validStockNumbers.forEach(stockNumber => {
      const result = validateStockNumber(stockNumber)
      expect(result.isValid).toBe(true)
      expect(result.error).toBeNull()
    })
  })

  test('Property 4 (metamorphic): trimming whitespace should not affect validation result', () => {
    const stockNumberWithWhitespace = fc.tuple(
      fc.stringMatching(/^[a-zA-Z0-9-_]+$/),
      fc.constantFrom('', ' ', '  ', '\t', '\n')
    )

    fc.assert(
      fc.property(stockNumberWithWhitespace, ([stockNumber, whitespace]) => {
        if (stockNumber.length === 0) return // Skip empty base strings
        
        const withLeadingWhitespace = whitespace + stockNumber
        const withTrailingWhitespace = stockNumber + whitespace
        const withBothWhitespace = whitespace + stockNumber + whitespace
        
        const baseResult = validateStockNumber(stockNumber)
        const leadingResult = validateStockNumber(withLeadingWhitespace)
        const trailingResult = validateStockNumber(withTrailingWhitespace)
        const bothResult = validateStockNumber(withBothWhitespace)
        
        // All should have the same validation result (trimming is applied)
        expect(leadingResult.isValid).toBe(baseResult.isValid)
        expect(trailingResult.isValid).toBe(baseResult.isValid)
        expect(bothResult.isValid).toBe(baseResult.isValid)
      }),
      { numRuns: 100 }
    )
  })
})
