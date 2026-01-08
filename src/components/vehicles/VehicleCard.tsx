'use client'

import { Vehicle } from '@/types'
import { EyeIcon, PhotoIcon } from '@heroicons/react/24/outline'
import Image from 'next/image'
import { useRouter } from 'next/navigation'

interface VehicleCardProps {
  vehicle: Vehicle
  showCheckbox?: boolean
  isSelected?: boolean
  onSelectionChange?: (checked: boolean) => void
}

export default function VehicleCard({ 
  vehicle, 
  showCheckbox = false, 
  isSelected = false, 
  onSelectionChange 
}: VehicleCardProps) {
  const router = useRouter()
  
  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      NOT_STARTED: { color: 'bg-gray-100 text-gray-800', text: 'Not Started' },
      IN_PROGRESS: { color: 'bg-yellow-100 text-yellow-800', text: 'In Progress' },
      COMPLETED: { color: 'bg-green-100 text-green-800', text: 'Completed' },
      ERROR: { color: 'bg-red-100 text-red-800', text: 'Error' }
    }

    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.NOT_STARTED

    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.color}`}>
        {config.text}
      </span>
    )
  }

  // Get the first image as thumbnail (preferably front or front quarter)
  const getThumbnail = () => {
    if (!vehicle.images || vehicle.images.length === 0) {
      return null
    }

    // Try to find front or front quarter image first
    const frontImage = vehicle.images.find(img => 
      img.imageType === 'FRONT' || img.imageType === 'FRONT_QUARTER'
    )

    const thumbnailImage = frontImage || vehicle.images[0]
    return thumbnailImage.thumbnailUrl || thumbnailImage.originalUrl
  }

  const thumbnailUrl = getThumbnail()

  return (
    <div 
      className="px-4 sm:px-6 py-4 hover:bg-gray-50 transition-colors duration-150"
      role="row"
    >
      {/* Mobile layout */}
      <div className="sm:hidden space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            {showCheckbox && (
              <input
                type="checkbox"
                checked={isSelected}
                onChange={(e) => onSelectionChange?.(e.target.checked)}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                aria-label={`Select vehicle ${vehicle.stockNumber}`}
              />
            )}
            <div className="text-sm font-medium text-gray-900">
              {vehicle.stockNumber}
            </div>
          </div>
          <button
            onClick={() => router.push(`/vehicles/${vehicle.id}`)}
            className="text-blue-600 hover:text-blue-900 transition-colors duration-150 p-1"
            title="View vehicle details"
            aria-label={`View details for vehicle ${vehicle.stockNumber}`}
          >
            <EyeIcon className="h-5 w-5" />
          </button>
        </div>
        
        <div className="flex items-center space-x-4">
          {/* Thumbnail */}
          <div className="flex-shrink-0">
            {thumbnailUrl ? (
              <div className="relative h-12 w-16 rounded-md overflow-hidden bg-gray-100">
                <Image
                  src={thumbnailUrl}
                  alt={`Vehicle ${vehicle.stockNumber}`}
                  fill
                  className="object-cover"
                  sizes="64px"
                />
              </div>
            ) : (
              <div className="h-12 w-16 rounded-md bg-gray-100 flex items-center justify-center">
                <PhotoIcon className="h-6 w-6 text-gray-400" />
              </div>
            )}
          </div>
          
          <div className="flex-1 min-w-0">
            <div className="text-sm text-gray-900">
              {vehicle.images?.length || 0} photos
            </div>
            <div className="text-sm text-gray-500">
              {formatDate(vehicle.createdAt)}
            </div>
          </div>
          
          <div className="flex-shrink-0">
            {getStatusBadge(vehicle.processingStatus)}
          </div>
        </div>
      </div>

      {/* Desktop layout */}
      <div className="hidden sm:grid grid-cols-12 gap-4 items-center">
        {showCheckbox && (
          <div className="col-span-1">
            <input
              type="checkbox"
              checked={isSelected}
              onChange={(e) => onSelectionChange?.(e.target.checked)}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              aria-label={`Select vehicle ${vehicle.stockNumber}`}
            />
          </div>
        )}
        
        {/* Stock Number */}
        <div className={showCheckbox ? "col-span-2" : "col-span-3"}>
          <div className="text-sm font-medium text-gray-900">
            {vehicle.stockNumber}
          </div>
        </div>

        {/* Thumbnail */}
        <div className="col-span-2">
          <div className="flex items-center">
            {thumbnailUrl ? (
              <div className="relative h-12 w-16 rounded-md overflow-hidden bg-gray-100">
                <Image
                  src={thumbnailUrl}
                  alt={`Vehicle ${vehicle.stockNumber}`}
                  fill
                  className="object-cover"
                  sizes="64px"
                />
              </div>
            ) : (
              <div className="h-12 w-16 rounded-md bg-gray-100 flex items-center justify-center">
                <PhotoIcon className="h-6 w-6 text-gray-400" />
              </div>
            )}
          </div>
        </div>

        {/* Photo Count */}
        <div className="col-span-2">
          <div className="text-sm text-gray-900">
            {vehicle.images?.length || 0} photos
          </div>
        </div>

        {/* Created Date */}
        <div className="col-span-2">
          <div className="text-sm text-gray-500">
            {formatDate(vehicle.createdAt)}
          </div>
        </div>

        {/* Status */}
        <div className="col-span-2">
          {getStatusBadge(vehicle.processingStatus)}
        </div>

        {/* Actions */}
        <div className="col-span-1">
          <button
            onClick={() => router.push(`/vehicles/${vehicle.id}`)}
            className="text-blue-600 hover:text-blue-900 transition-colors duration-150 p-1 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded"
            title="View vehicle details"
            aria-label={`View details for vehicle ${vehicle.stockNumber}`}
          >
            <EyeIcon className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  )
}