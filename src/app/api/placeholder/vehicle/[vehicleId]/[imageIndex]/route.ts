import { NextRequest, NextResponse } from 'next/server';

/**
 * GET /api/placeholder/vehicle/[vehicleId]/[imageIndex]
 * Returns a placeholder image for vehicles when GCS is not configured
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ vehicleId: string; imageIndex: string }> }
) {
  const { vehicleId, imageIndex } = await params;

  // Generate a simple SVG placeholder with the vehicle ID and image index
  const svg = `
    <svg width="800" height="600" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:#6366f1;stop-opacity:1" />
          <stop offset="100%" style="stop-color:#4338ca;stop-opacity:1" />
        </linearGradient>
      </defs>
      <rect width="800" height="600" fill="url(#grad)"/>
      <circle cx="400" cy="250" r="80" fill="rgba(255,255,255,0.2)"/>
      <path d="M 360 250 L 400 290 L 440 210" stroke="white" stroke-width="8" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
      <text x="50%" y="60%" text-anchor="middle" font-family="Arial, sans-serif" font-size="28" fill="white" font-weight="bold">
        Vehicle Image Placeholder
      </text>
      <text x="50%" y="68%" text-anchor="middle" font-family="Arial, sans-serif" font-size="16" fill="rgba(255,255,255,0.8)">
        Configure Google Cloud Storage to upload images
      </text>
      <text x="50%" y="78%" text-anchor="middle" font-family="Arial, monospace" font-size="12" fill="rgba(255,255,255,0.6)">
        Vehicle: ${vehicleId.substring(0, 12)}... | Image: ${imageIndex}
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
