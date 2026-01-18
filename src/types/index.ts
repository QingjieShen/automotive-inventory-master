// Core type definitions for the Vehicle Inventory Tool

export interface User {
  id: string
  email: string
  name: string
  role: 'PHOTOGRAPHER' | 'ADMIN' | 'SUPER_ADMIN'
  createdAt: Date
  updatedAt: Date
}

export interface Store {
  id: string
  name: string
  address: string
  brandLogos: string[]
  imageUrl?: string
}

export interface Vehicle {
  id: string
  stockNumber: string
  vin: string
  storeId: string
  store?: Store
  images: VehicleImage[]
  processingStatus: ProcessingStatus
  createdAt: Date
  updatedAt: Date
}

export interface VehicleImage {
  id: string
  vehicleId: string
  vehicle?: Vehicle
  originalUrl: string
  processedUrl?: string
  optimizedUrl?: string
  thumbnailUrl: string
  imageType: ImageType
  sortOrder: number
  isProcessed: boolean
  isOptimized: boolean
  processedAt?: Date
  uploadedAt: Date
  updatedAt: Date
}

export interface ProcessingJob {
  id: string
  vehicleId: string
  imageIds: string[]
  status: JobStatus
  errorMessage?: string
  createdAt: Date
  completedAt?: Date
}

export type ProcessingStatus = 'NOT_STARTED' | 'IN_PROGRESS' | 'COMPLETED' | 'ERROR'

export type JobStatus = 'QUEUED' | 'PROCESSING' | 'COMPLETED' | 'FAILED'

export type ImageType =
  | 'FRONT_QUARTER'
  | 'FRONT'
  | 'BACK_QUARTER'
  | 'BACK'
  | 'DRIVER_SIDE'
  | 'PASSENGER_SIDE'
  | 'GALLERY_EXTERIOR'
  | 'GALLERY_INTERIOR'
  | 'GALLERY' // Legacy support

export type UserRole = 'PHOTOGRAPHER' | 'ADMIN' | 'SUPER_ADMIN'

// API Response types
export interface ApiResponse<T> {
  data?: T
  error?: string
  message?: string
}

export interface PaginatedResponse<T> {
  data: T[]
  totalCount: number
  currentPage: number
  totalPages: number
}

// Form types
export interface LoginForm {
  email: string
  password: string
}

export interface CreateVehicleForm {
  stockNumber: string
  vin: string
  storeId: string
  images?: File[]
}

// NextAuth types
export interface AuthUser {
  id: string
  email: string
  name: string
  role: UserRole
}

declare module 'next-auth' {
  interface Session {
    user: AuthUser
  }

  interface User extends AuthUser {}
}

declare module 'next-auth/jwt' {
  interface JWT {
    role: UserRole
  }
}
