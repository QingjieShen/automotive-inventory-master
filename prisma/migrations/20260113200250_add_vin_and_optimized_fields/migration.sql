/*
  Warnings:

  - Added the required column `updatedAt` to the `vehicle_images` table without a default value. This is not possible if the table is not empty.
  - Added the required column `vin` to the `vehicles` table without a default value. This is not possible if the table is not empty.

*/

-- Step 1: Add new columns with temporary defaults for existing rows
-- AlterTable vehicle_images: Add new columns
ALTER TABLE "vehicle_images" 
ADD COLUMN "isOptimized" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN "optimizedUrl" TEXT,
ADD COLUMN "processedAt" TIMESTAMP(3),
ADD COLUMN "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- Step 2: Add VIN column with temporary default for existing rows
ALTER TABLE "vehicles" 
ADD COLUMN "vin" TEXT NOT NULL DEFAULT 'PENDING_VIN_UPDATE';

-- Step 3: Update existing vehicles with placeholder VINs (must be unique 17-char strings)
-- Generate unique placeholder VINs for existing vehicles
UPDATE "vehicles" 
SET "vin" = 'PLACEHOLDER' || LPAD(SUBSTRING(id FROM 1 FOR 9), 9, '0')
WHERE "vin" = 'PENDING_VIN_UPDATE';

-- Step 4: Remove the default constraint from vin column (future inserts must provide VIN)
ALTER TABLE "vehicles" ALTER COLUMN "vin" DROP DEFAULT;

-- Step 5: Create indexes
CREATE INDEX "vehicle_images_isOptimized_idx" ON "vehicle_images"("isOptimized");
CREATE INDEX "vehicles_vin_idx" ON "vehicles"("vin");

