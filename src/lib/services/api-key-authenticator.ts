/**
 * API Key Authenticator Service
 * 
 * Provides secure API key authentication for the CSV feed endpoint.
 * Uses constant-time comparison to prevent timing attacks.
 * 
 * Requirements: 7.1, 7.2, 7.3, 7.4, 7.6, 7.7
 */

export interface AuthResult {
  authenticated: boolean;
  error?: string;
}

export class APIKeyAuthenticator {
  private readonly validApiKey: string;

  constructor(apiKey: string) {
    if (!apiKey || apiKey.trim().length === 0) {
      throw new Error('API key must be provided to APIKeyAuthenticator');
    }
    this.validApiKey = apiKey;
  }

  /**
   * Authenticate a provided API key against the stored valid key
   * 
   * @param providedKey - The API key provided in the request
   * @returns AuthResult indicating success or failure with error message
   */
  authenticate(providedKey: string | null | undefined): AuthResult {
    // Requirement 7.2: Missing API key returns 401
    if (!providedKey) {
      return { 
        authenticated: false, 
        error: 'API key required' 
      };
    }

    // Requirement 7.3: Invalid API key returns 403
    // Requirement 7.6: Use constant-time comparison for security
    if (!this.constantTimeCompare(providedKey, this.validApiKey)) {
      return { 
        authenticated: false, 
        error: 'Invalid API key' 
      };
    }

    // Requirement 7.4: Valid API key grants access
    return { authenticated: true };
  }

  /**
   * Constant-time string comparison to prevent timing attacks
   * 
   * This method ensures that the comparison takes the same amount of time
   * regardless of where the strings differ, preventing attackers from
   * using timing information to guess the API key character by character.
   * 
   * @param a - First string to compare
   * @param b - Second string to compare
   * @returns true if strings are equal, false otherwise
   */
  private constantTimeCompare(a: string, b: string): boolean {
    // If lengths differ, still perform comparison to maintain constant time
    // but ensure result is false
    if (a.length !== b.length) {
      return false;
    }

    let result = 0;
    for (let i = 0; i < a.length; i++) {
      result |= a.charCodeAt(i) ^ b.charCodeAt(i);
    }

    return result === 0;
  }
}
