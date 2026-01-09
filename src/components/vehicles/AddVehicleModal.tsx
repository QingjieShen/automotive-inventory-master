'use client'

import { useState } from 'react'
import { useStore } from '@/components/providers/StoreProvider'
import SimplePhotoUploader from './SimplePhotoUploader'

interface AddVehicleModalProps {
  onClose: () => void
  onVehicleAdded: () => void
}

export default function AddVehicleModal({ onClose, onVehicleAdded }: AddVehicleModalProps) {
  const { selectedStore } = useStore()
  const [stockNumber, setStockNumber] = useState('')
  const [uploadedImages, setUploadedImages] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!stockNumber.trim()) {
      setError('Stock number is required')
      return
    }

    if (!selectedStore) {
      setError('No store selected')
      return
    }

    setLoading(true)
    setError(null)

    try {
      // Create the vehicle first
      const vehicleResponse = await fetch('/api/vehicles', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          stockNumber: stockNumber.trim(),
          storeId: selectedStore.id,
        }),
      })

      if (!vehicleResponse.ok) {
        const errorData = await vehicleResponse.json()
        throw new Error(errorData.error || 'Failed to create vehicle')
      }

      const vehicle = await vehicleResponse.json()

      // Handle uploaded images if any
      if (uploadedImages.length > 0) {
        try {
          // Upload images to the newly created vehicle
          const formData = new FormData()
          uploadedImages.forEach((uploadFile, index) => {
            formData.append(`file_${index}`, uploadFile)
            formData.append(`imageType_${index}`, uploadFile.imageType || 'GALLERY')
          })

          const imageResponse = await fetch(`/api/vehicles/${vehicle.id}/images`, {
            method: 'POST',
            body: formData,
          })

          if (!imageResponse.ok) {
            console.warn('Failed to upload some images, but vehicle was created successfully')
          }
        } catch (imageError) {
          console.warn('Image upload failed, but vehicle was created successfully:', imageError)
        }
      }

      onVehicleAdded()
      onClose()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  const handleFilesChange = (files: any[]) => {
    console.log('Files changed:', files) // Debug log
    setUploadedImages(files)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] flex flex-col">
        <form onSubmit={handleSubmit} className="flex flex-col h-full">
          {/* Header - Fixed */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200 flex-shrink-0">
            <h3 className="text-xl font-bold text-gray-900">
              Add New Vehicle
            </h3>
            <button
              type="button"
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 text-2xl"
            >
              ×
            </button>
          </div>

          {/* Content - Scrollable */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {/* Error Message */}
            {error && (
              <div className="p-3 bg-red-100 border border-red-300 rounded text-red-700">
                {error}
              </div>
            )}

            {/* Stock Number Input */}
            <div>
              <label className="block text-lg font-bold text-gray-900 mb-3">
                Stock Number (Required)
              </label>
              <input
                type="text"
                value={stockNumber}
                onChange={(e) => setStockNumber(e.target.value)}
                className="w-full p-4 border-2 border-gray-400 rounded-lg text-lg"
                placeholder="Enter stock number (e.g., ABC123)"
                required
              />
              <p className="mt-2 text-blue-600 font-medium">
                💡 Button will be enabled after entering stock number
              </p>
            </div>

            {/* Store Info */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Store
              </label>
              <div className="p-3 bg-gray-100 border rounded">
                {selectedStore?.name || 'No store selected'}
              </div>
            </div>

            {/* Photo Upload */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Vehicle Photos (Optional)
                {uploadedImages.length > 0 && (
                  <span className="ml-2 text-blue-600 font-semibold">
                    ({uploadedImages.length} file{uploadedImages.length !== 1 ? 's' : ''} selected)
                  </span>
                )}
              </label>
              <SimplePhotoUploader
                onFilesChange={handleFilesChange}
                maxFiles={20}
                className="w-full"
              />
            </div>
          </div>

          {/* Buttons - Fixed at bottom */}
          <div className="flex gap-3 p-6 border-t border-gray-200 bg-gray-50 flex-shrink-0">
            <button
              type="submit"
              disabled={loading || !stockNumber.trim()}
              className="flex-1 py-3 px-4 bg-blue-600 text-white rounded-lg font-medium disabled:bg-gray-300 disabled:cursor-not-allowed hover:bg-blue-700"
            >
              {loading ? 'Creating...' : (
                <>
                  Create Vehicle
                  {uploadedImages.length > 0 && (
                    <span className="ml-1 text-xs">
                      & Upload {uploadedImages.length} Photo{uploadedImages.length !== 1 ? 's' : ''}
                    </span>
                  )}
                </>
              )}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-3 bg-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-300"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}