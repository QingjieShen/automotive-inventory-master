import { NextRequest, NextResponse } from 'next/server';

/**
 * GET /api/placeholder/store/[id]
 * Returns a placeholder image for stores when GCS is not configured
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  // Generate a simple SVG placeholder with the store ID
  const svg = `
    <svg width="800" height="400" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:#3b82f6;stop-opacity:1" />
          <stop offset="100%" style="stop-color:#1e40af;stop-opacity:1" />
        </linearGradient>
      </defs>
      <rect width="800" height="400" fill="url(#grad)"/>
      <text x="50%" y="45%" text-anchor="middle" font-family="Arial, sans-serif" font-size="32" fill="white" font-weight="bold">
        Store Image Placeholder
      </text>
      <text x="50%" y="55%" text-anchor="middle" font-family="Arial, sans-serif" font-size="16" fill="rgba(255,255,255,0.8)">
        Configure Google Cloud Storage to upload images
      </text>
      <text x="50%" y="65%" text-anchor="middle" font-family="Arial, monospace" font-size="12" fill="rgba(255,255,255,0.6)">
        Store ID: ${id}
      </text>
    </svg>
  `;

  return new NextResponse(svg, {
    headers: {
      'Content-Type': 'image/svg+xml',
      'Cache-Control': 'public, max-age=3600',
    },
  });
}
