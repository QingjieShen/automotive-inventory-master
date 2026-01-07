'use client'

import { useState } from 'react'
import { Vehicle } from '@/types'
import PhotoUploader from './PhotoUploader'
import { PlusIcon } from '@heroicons/react/24/outline'

interface VehiclePhotoUploadProps {
  vehicle: Vehicle
  onPhotosUploaded: (vehicle: Vehicle) => void
}

export default function VehiclePhotoUpload({ vehicle, onPhotosUploaded }: VehiclePhotoUploadProps) {
  const [showUploader, setShowUploader] = useState(false)
  const [isUploading, setIsUploading] = useState(false)

  const handleUploadComplete = async (uploadedImages: any[]) => {
    setIsUploading(true)
    
    try {
      console.log(`Successfully uploaded ${uploadedImages.length} images for vehicle ${vehicle.id}`)
      
      // Refresh vehicle data from the server to get updated images
      const response = await fetch(`/api/vehicles/${vehicle.id}`)
      if (response.ok) {
        const updatedVehicle = await response.json()
        onPhotosUploaded(updatedVehicle)
      }
      
      setShowUploader(false)
    } catch (error) {
      console.error('Error handling upload completion:', error)
    } finally {
      setIsUploading(false)
    }
  }

  if (!showUploader) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="text-center">
          <PlusIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Add More Photos
          </h3>
          <p className="text-gray-500 mb-4">
            Upload additional photos for this vehicle
          </p>
          <button
            onClick={() => setShowUploader(true)}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <PlusIcon className="h-4 w-4 mr-2" />
            Upload Photos
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-medium text-gray-900">
          Upload Photos
        </h3>
        <button
          onClick={() => setShowUploader(false)}
          disabled={isUploading}
          className="text-gray-400 hover:text-gray-600 disabled:opacity-50"
        >
          Cancel
        </button>
      </div>
      
      <PhotoUploader
        vehicleId={vehicle.id}
        onUploadComplete={handleUploadComplete}
        maxFiles={10}
        className="w-full"
      />
      
      {isUploading && (
        <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-md">
          <p className="text-sm text-blue-800">
            Processing uploaded photos...
          </p>
        </div>
      )}
    </div>
  )
}