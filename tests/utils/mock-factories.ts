import * as fc from 'fast-check'

// Mock data factories for testing
export const mockStore = {
  id: '1',
  name: 'Downtown Toyota',
  address: '123 Main St, City, State 12345',
  brandLogos: ['toyota-logo.png'],
}

export const mockVehicle = {
  id: '1',
  stockNumber: 'T12345',
  storeId: '1',
  store: mockStore,
  images: [],
  processingStatus: 'NOT_STARTED' as const,
  createdAt: new Date('2024-01-01'),
  updatedAt: new Date('2024-01-01'),
}

export const mockVehicleImage = {
  id: '1',
  vehicleId: '1',
  vehicle: mockVehicle,
  originalUrl: 'https://example.com/original.jpg',
  processedUrl: null,
  thumbnailUrl: 'https://example.com/thumb.jpg',
  imageType: 'FRONT' as const,
  sortOrder: 1,
  isProcessed: false,
  uploadedAt: new Date('2024-01-01'),
}

export const mockUser = {
  id: '1',
  email: 'test@example.com',
  name: 'Test User',
  role: 'PHOTOGRAPHER' as const,
  createdAt: new Date('2024-01-01'),
  updatedAt: new Date('2024-01-01'),
}

// Fast-check arbitraries for property-based testing
export const arbitraries = {
  // User role arbitrary
  userRole: fc.constantFrom('PHOTOGRAPHER', 'ADMIN', 'SUPER_ADMIN'),

  // Stock number arbitrary (alphanumeric, 3-10 characters)
  stockNumber: fc.stringMatching(/^[A-Z0-9]{3,10}$/),

  // Email arbitrary
  email: fc.emailAddress(),

  // Image type arbitrary
  imageType: fc.constantFrom(
    'FRONT_QUARTER',
    'FRONT',
    'BACK_QUARTER',
    'BACK',
    'DRIVER_SIDE',
    'PASSENGER_SIDE',
    'GALLERY'
  ),

  // Processing status arbitrary
  processingStatus: fc.constantFrom('NOT_STARTED', 'IN_PROGRESS', 'COMPLETED', 'ERROR'),

  // Store name arbitrary
  storeName: fc.string({ minLength: 5, maxLength: 50 }),

  // Store arbitrary
  store: fc.record({
    id: fc.uuid(),
    name: fc.string({ minLength: 10, maxLength: 50 }).map(name => `Mark Motors ${name}`),
    address: fc.record({
      street: fc.string({ minLength: 5, maxLength: 30 }),
      city: fc.string({ minLength: 3, maxLength: 20 }),
      province: fc.constantFrom('ON', 'BC', 'AB', 'QC'),
      postalCode: fc.stringMatching(/^[A-Z]\d[A-Z] \d[A-Z]\d$/)
    }).map(addr => `${addr.street}, ${addr.city}, ${addr.province} ${addr.postalCode}`),
    brandLogos: fc.array(
      fc.constantFrom('toyota-logo.png', 'honda-logo.png', 'lexus-logo.png', 'acura-logo.png'),
      { minLength: 1, maxLength: 4 }
    ).map(logos => Array.from(new Set(logos))) // Remove duplicates
  }),

  // Vehicle arbitrary
  vehicle: fc.record({
    id: fc.uuid(),
    stockNumber: fc.stringMatching(/^[A-Z0-9]{3,10}$/),
    storeId: fc.uuid(),
    processingStatus: fc.constantFrom('NOT_STARTED', 'IN_PROGRESS', 'COMPLETED', 'ERROR'),
    createdAt: fc.date({ min: new Date('2020-01-01T00:00:00.000Z'), max: new Date('2024-12-31T23:59:59.999Z') }).filter(d => !isNaN(d.getTime())),
    updatedAt: fc.date({ min: new Date('2020-01-01T00:00:00.000Z'), max: new Date('2024-12-31T23:59:59.999Z') }).filter(d => !isNaN(d.getTime())),
  }),

  // User arbitrary
  user: fc.record({
    id: fc.uuid(),
    email: fc.emailAddress(),
    name: fc.string({ minLength: 2, maxLength: 50 }).filter(s => s.trim().length > 0),
    role: fc.constantFrom('PHOTOGRAPHER', 'ADMIN', 'SUPER_ADMIN'),
    createdAt: fc.date({ min: new Date('2020-01-01T00:00:00.000Z'), max: new Date('2024-12-31T23:59:59.999Z') }).filter(d => !isNaN(d.getTime())),
    updatedAt: fc.date({ min: new Date('2020-01-01T00:00:00.000Z'), max: new Date('2024-12-31T23:59:59.999Z') }).filter(d => !isNaN(d.getTime())),
  }),

  // Vehicle image arbitrary
  vehicleImage: fc.record({
    id: fc.uuid(),
    vehicleId: fc.uuid(),
    originalUrl: fc.webUrl(),
    processedUrl: fc.option(fc.webUrl()),
    thumbnailUrl: fc.webUrl(),
    imageType: fc.constantFrom(
      'FRONT_QUARTER',
      'FRONT',
      'BACK_QUARTER',
      'BACK',
      'DRIVER_SIDE',
      'PASSENGER_SIDE',
      'GALLERY'
    ),
    sortOrder: fc.integer({ min: 0, max: 100 }),
    isProcessed: fc.boolean(),
    uploadedAt: fc.date({ min: new Date('2020-01-01T00:00:00.000Z'), max: new Date('2024-12-31T23:59:59.999Z') }).filter(d => !isNaN(d.getTime())),
  }),

  // File upload arbitraries
  fileSize: fc.integer({ min: 1024, max: 10 * 1024 * 1024 }), // 1KB to 10MB
  fileName: fc.string({ minLength: 5, maxLength: 50 }).map(name => `${name}.jpg`),
  contentType: fc.constantFrom('image/jpeg', 'image/png', 'image/gif', 'image/webp'),
  
  // Upload file arbitrary (simulates File object properties)
  uploadFile: fc.record({
    name: fc.string({ minLength: 5, maxLength: 50 }).map(name => `${name}.jpg`),
    size: fc.integer({ min: 1024, max: 10 * 1024 * 1024 }),
    type: fc.constantFrom('image/jpeg', 'image/png', 'image/gif', 'image/webp'),
    lastModified: fc.integer({ min: 1640995200000, max: Date.now() }), // 2022 onwards
  }),

  // S3 key arbitrary
  s3Key: fc.record({
    storeId: fc.uuid(),
    vehicleId: fc.uuid(),
    imageType: fc.constantFrom('original', 'processed', 'thumbnail'),
    extension: fc.constantFrom('jpg', 'png', 'gif', 'webp'),
  }).map(({ storeId, vehicleId, imageType, extension }) => 
    `stores/${storeId}/vehicles/${vehicleId}/${imageType}/${fc.sample(fc.uuid(), 1)[0]}_${Date.now()}.${extension}`
  ),
}

// Helper functions for creating test data
export const createMockVehicles = (count: number) => {
  return Array.from({ length: count }, (_, i) => ({
    ...mockVehicle,
    id: `vehicle-${i + 1}`,
    stockNumber: `T${(12345 + i).toString()}`,
  }))
}

export const createMockImages = (vehicleId: string, count: number) => {
  const imageTypes = [
    'FRONT_QUARTER',
    'FRONT',
    'BACK_QUARTER',
    'BACK',
    'DRIVER_SIDE',
    'PASSENGER_SIDE',
  ]

  return Array.from({ length: count }, (_, i) => ({
    ...mockVehicleImage,
    id: `image-${i + 1}`,
    vehicleId,
    imageType: i < imageTypes.length ? imageTypes[i] : 'GALLERY',
    sortOrder: i + 1,
  }))
}
