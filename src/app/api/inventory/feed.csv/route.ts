import { NextRequest, NextResponse } from 'next/server';
import { APIKeyAuthenticator } from '@/lib/services/api-key-authenticator';
import { CSVGeneratorService } from '@/lib/services/csv-generator-service';

/**
 * GET /api/inventory/feed.csv
 * 
 * Generate CSV feed for CDK One-Eighty DMS integration.
 * This endpoint requires API key authentication via query parameter.
 * Returns a CSV file with vehicle inventory data including VINs, stock numbers,
 * and optimized image URLs with cache-busting timestamps.
 * 
 * Requirements: 5.1, 5.6, 5.7, 5.8, 7.1, 7.2, 7.3, 7.4, 7.7
 * 
 * Query Parameters:
 * - key: API key for authentication (required)
 * 
 * Response (Success):
 * - Content-Type: text/csv
 * - Content-Disposition: attachment; filename="inventory-feed.csv"
 * - Body: CSV content with format VIN,StockNumber,ImageURLs
 * 
 * Response (Error):
 * - Content-Type: application/json
 * - Body: { error: string, code: string, timestamp: string }
 * - Status: 401 (missing key), 403 (invalid key), 500 (server error)
 */
export async function GET(request: NextRequest) {
  try {
    // Requirement 7.1: Extract API key from query parameter named "key"
    const searchParams = request.nextUrl.searchParams;
    const providedKey = searchParams.get('key');

    // Requirement 7.2, 7.3, 7.4: Authenticate using APIKeyAuthenticator
    const apiKey = process.env.CDK_API_KEY;
    
    if (!apiKey) {
      console.error('CDK_API_KEY environment variable is not configured');
      return NextResponse.json(
        {
          error: 'Server configuration error',
          code: 'CONFIG_ERROR',
          timestamp: new Date().toISOString(),
        },
        { status: 500 }
      );
    }

    const authenticator = new APIKeyAuthenticator(apiKey);
    const authResult = authenticator.authenticate(providedKey);

    // Requirement 7.7: Return JSON error response on authentication failure
    if (!authResult.authenticated) {
      // Requirement 7.2: Return 401 for missing API key
      if (authResult.error === 'API key required') {
        return NextResponse.json(
          {
            error: authResult.error,
            code: 'MISSING_API_KEY',
            timestamp: new Date().toISOString(),
          },
          { status: 401 }
        );
      }
      
      // Requirement 7.3: Return 403 for invalid API key
      return NextResponse.json(
        {
          error: authResult.error,
          code: 'INVALID_API_KEY',
          timestamp: new Date().toISOString(),
        },
        { status: 403 }
      );
    }

    // Authentication successful - generate CSV feed
    // Requirement 5.1: Expose GET endpoint at /api/inventory/feed.csv
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 
                    process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 
                    'http://localhost:3000';

    const csvGenerator = new CSVGeneratorService({ baseUrl });
    const csvContent = await csvGenerator.generateFeed();

    // Requirement 5.6, 5.7: Set proper response headers
    // Requirement 5.6: Content-Type header to text/csv
    // Requirement 5.7: Content-Disposition header with filename
    const headers = new Headers();
    headers.set('Content-Type', 'text/csv; charset=utf-8');
    headers.set('Content-Disposition', 'attachment; filename="inventory-feed.csv"');
    
    // Add cache control headers to prevent caching of the feed
    headers.set('Cache-Control', 'no-cache, no-store, must-revalidate');
    headers.set('Pragma', 'no-cache');
    headers.set('Expires', '0');

    // Requirement 5.8: Return CSV content
    return new NextResponse(csvContent, {
      status: 200,
      headers,
    });

  } catch (error) {
    // Log error for debugging (Requirement 11.1, 11.2)
    console.error('CSV feed generation error:', {
      timestamp: new Date().toISOString(),
      error: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined,
    });

    // Requirement 11.5: Don't expose sensitive information in error responses
    return NextResponse.json(
      {
        error: 'Internal server error',
        code: 'FEED_GENERATION_ERROR',
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
}
