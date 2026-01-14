import { prisma } from '../prisma';

/**
 * Vehicle data structure for CSV feed generation
 */
interface VehicleFeedData {
  vin: string;
  stockNumber: string;
  imageUrls: string[];
  updatedAt: Date;
}

/**
 * Configuration for CSV Generator Service
 */
interface CSVGeneratorConfig {
  baseUrl: string; // Base URL for absolute image URLs
}

/**
 * Service for generating CSV feeds for CDK One-Eighty DMS integration.
 * 
 * This service queries vehicles with optimized images and generates a CSV feed
 * with VIN, StockNumber, and pipe-separated image URLs with cache-busting timestamps.
 * 
 * Requirements: 5.2, 5.3, 5.4, 5.5, 6.1, 6.2, 6.3, 8.1, 8.2, 8.3, 8.5
 */
export class CSVGeneratorService {
  private config: CSVGeneratorConfig;

  constructor(config: CSVGeneratorConfig) {
    this.config = config;
  }

  /**
   * Generate CSV feed for CDK One-Eighty polling.
   * 
   * Returns a CSV string with headers and vehicle data.
   * Only includes vehicles that have at least one optimized image.
   * 
   * @returns CSV string with format: VIN,StockNumber,ImageURLs
   */
  async generateFeed(): Promise<string> {
    const vehicles = await this.fetchVehiclesWithOptimizedImages();

    // CSV header row
    const header = 'VIN,StockNumber,ImageURLs\r\n';

    // Generate CSV rows
    const rows = vehicles.map((vehicle) => this.formatCSVRow(vehicle));

    return header + rows.join('');
  }

  /**
   * Fetch all vehicles that have at least one optimized image.
   * 
   * Queries the database for vehicles with isOptimized=true images,
   * and returns the data needed for CSV generation.
   * 
   * Requirement 5.2: Query all vehicles that have optimized images
   * 
   * @returns Array of vehicle feed data
   */
  private async fetchVehiclesWithOptimizedImages(): Promise<VehicleFeedData[]> {
    const vehicles = await prisma.vehicle.findMany({
      where: {
        images: {
          some: {
            isOptimized: true,
          },
        },
      },
      include: {
        images: {
          where: {
            isOptimized: true,
          },
          select: {
            optimizedUrl: true,
            updatedAt: true,
          },
        },
      },
    });

    return vehicles.map((vehicle) => ({
      vin: vehicle.vin,
      stockNumber: vehicle.stockNumber,
      imageUrls: vehicle.images
        .filter((img) => img.optimizedUrl !== null)
        .map((img) => this.buildImageUrlWithCacheBuster(img.optimizedUrl!, img.updatedAt)),
      updatedAt: vehicle.updatedAt,
    }));
  }

  /**
   * Build image URL with cache-busting query parameter.
   * 
   * Appends ?v={unix_timestamp} to the URL to force re-downloading when images change.
   * 
   * Requirements:
   * - 6.1: Append version query parameter
   * - 6.2: Use image's last updated timestamp as version value
   * - 6.3: Format as ?v={unix_timestamp}
   * 
   * @param url - Base image URL
   * @param updatedAt - Image's last updated timestamp
   * @returns URL with cache-buster parameter
   */
  private buildImageUrlWithCacheBuster(url: string, updatedAt: Date): string {
    const timestamp = Math.floor(updatedAt.getTime() / 1000); // Unix timestamp in seconds
    return `${url}?v=${timestamp}`;
  }

  /**
   * Escape CSV field according to RFC 4180 standards.
   * 
   * - Enclose field in double quotes if it contains comma, quote, or newline
   * - Escape double quotes by doubling them ("")
   * 
   * Requirements:
   * - 8.2: Use double quotes to escape fields containing commas or quotes
   * - 8.3: Escape double quotes by doubling them
   * 
   * @param field - Field value to escape
   * @returns Escaped field value
   */
  private escapeCSVField(field: string): string {
    // Check if field needs escaping (contains comma, quote, or newline)
    if (field.includes(',') || field.includes('"') || field.includes('\n') || field.includes('\r')) {
      // Escape double quotes by doubling them
      const escaped = field.replace(/"/g, '""');
      // Enclose in double quotes
      return `"${escaped}"`;
    }
    return field;
  }

  /**
   * Format a single vehicle record as a CSV row.
   * 
   * Requirements:
   * - 5.3: Include columns VIN, StockNumber, ImageURLs
   * - 5.4: Concatenate multiple URLs with pipe separator
   * - 8.1: Use comma as field delimiter
   * - 8.5: Use CRLF as line terminator
   * 
   * @param data - Vehicle feed data
   * @returns Formatted CSV row with CRLF terminator
   */
  private formatCSVRow(data: VehicleFeedData): string {
    const vin = this.escapeCSVField(data.vin);
    const stockNumber = this.escapeCSVField(data.stockNumber);
    const imageUrls = this.escapeCSVField(data.imageUrls.join('|'));

    return `${vin},${stockNumber},${imageUrls}\r\n`;
  }
}
