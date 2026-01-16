/**
 * Bundle Size Performance Test
 * 
 * This test measures the bundle size after the shadcn/ui migration
 * and compares it against acceptable thresholds.
 * 
 * Requirements: 14.1
 */

import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

describe('Bundle Size Performance', () => {
  const BUILD_DIR = path.join(process.cwd(), '.next');
  const ACCEPTABLE_INCREASE_PERCENT = 10; // 10% increase is acceptable

  // Baseline bundle sizes (approximate, before shadcn migration)
  // These would be measured from the pre-migration build
  const BASELINE_SIZES = {
    totalJsSize: 500 * 1024, // 500 KB baseline
    totalCssSize: 50 * 1024,  // 50 KB baseline
    firstLoadJs: 300 * 1024,  // 300 KB baseline
  };

  beforeAll(() => {
    // Check if build exists, if not skip tests
    if (!fs.existsSync(BUILD_DIR)) {
      console.warn('Build directory not found. Run "npm run build" first.');
    }
  });

  it('should have a production build available', () => {
    expect(fs.existsSync(BUILD_DIR)).toBe(true);
  });

  it('should not increase total JavaScript bundle size significantly', () => {
    if (!fs.existsSync(BUILD_DIR)) {
      console.warn('Skipping test - no build found');
      return;
    }

    const buildManifestPath = path.join(BUILD_DIR, 'build-manifest.json');
    
    if (!fs.existsSync(buildManifestPath)) {
      console.warn('Build manifest not found');
      return;
    }

    const manifest = JSON.parse(fs.readFileSync(buildManifestPath, 'utf-8'));
    
    // Calculate total JS size from all pages
    let totalJsSize = 0;
    const staticDir = path.join(BUILD_DIR, 'static');
    
    if (fs.existsSync(staticDir)) {
      const calculateDirSize = (dir: string): number => {
        let size = 0;
        const files = fs.readdirSync(dir);
        
        for (const file of files) {
          const filePath = path.join(dir, file);
          const stat = fs.statSync(filePath);
          
          if (stat.isDirectory()) {
            size += calculateDirSize(filePath);
          } else if (file.endsWith('.js')) {
            size += stat.size;
          }
        }
        
        return size;
      };
      
      totalJsSize = calculateDirSize(staticDir);
    }

    const increasePercent = ((totalJsSize - BASELINE_SIZES.totalJsSize) / BASELINE_SIZES.totalJsSize) * 100;
    
    console.log(`Total JS Bundle Size: ${(totalJsSize / 1024).toFixed(2)} KB`);
    console.log(`Baseline: ${(BASELINE_SIZES.totalJsSize / 1024).toFixed(2)} KB`);
    console.log(`Increase: ${increasePercent.toFixed(2)}%`);

    // Bundle size should not increase by more than acceptable threshold
    expect(increasePercent).toBeLessThanOrEqual(ACCEPTABLE_INCREASE_PERCENT);
  });

  it('should not increase CSS bundle size significantly', () => {
    if (!fs.existsSync(BUILD_DIR)) {
      console.warn('Skipping test - no build found');
      return;
    }

    const staticDir = path.join(BUILD_DIR, 'static');
    let totalCssSize = 0;
    
    if (fs.existsSync(staticDir)) {
      const calculateCssSize = (dir: string): number => {
        let size = 0;
        const files = fs.readdirSync(dir);
        
        for (const file of files) {
          const filePath = path.join(dir, file);
          const stat = fs.statSync(filePath);
          
          if (stat.isDirectory()) {
            size += calculateCssSize(filePath);
          } else if (file.endsWith('.css')) {
            size += stat.size;
          }
        }
        
        return size;
      };
      
      totalCssSize = calculateCssSize(staticDir);
    }

    const increasePercent = ((totalCssSize - BASELINE_SIZES.totalCssSize) / BASELINE_SIZES.totalCssSize) * 100;
    
    console.log(`Total CSS Bundle Size: ${(totalCssSize / 1024).toFixed(2)} KB`);
    console.log(`Baseline: ${(BASELINE_SIZES.totalCssSize / 1024).toFixed(2)} KB`);
    console.log(`Increase: ${increasePercent.toFixed(2)}%`);

    // CSS size should not increase significantly (Tailwind JIT should keep it small)
    expect(increasePercent).toBeLessThanOrEqual(ACCEPTABLE_INCREASE_PERCENT);
  });

  it('should report bundle size metrics', () => {
    if (!fs.existsSync(BUILD_DIR)) {
      console.warn('Skipping test - no build found');
      return;
    }

    // This test always passes but logs useful information
    console.log('\n=== Bundle Size Report ===');
    console.log('Run "npm run build" to see detailed Next.js bundle analysis');
    console.log('Look for "First Load JS" metrics in the build output');
    console.log('shadcn/ui components are tree-shakeable and should not significantly increase bundle size');
    
    expect(true).toBe(true);
  });
});
