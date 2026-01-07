// Re-export Prisma types for easier imports throughout the application
export type {
  User,
  Store,
  Vehicle,
  VehicleImage,
  ProcessingJob,
  UserRole,
  ImageType,
  ProcessingStatus,
  JobStatus,
  Prisma
} from '../generated/prisma'

export { PrismaClient } from '../generated/prisma'