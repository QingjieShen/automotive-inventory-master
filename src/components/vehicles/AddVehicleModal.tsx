'use client'

import { useState } from 'react'
import { useStore } from '@/components/providers/StoreProvider'
import { XMarkIcon } from '@heroicons/react/24/outline'
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
    setUploadedImages(files)
  }

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto" role="dialog" aria-modal="true" aria-labelledby="modal-title">
      <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div 
          className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" 
          onClick={onClose}
          aria-hidden="true"
        />

        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-2xl sm:w-full">
          <form onSubmit={handleSubmit}>
            <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
              <div className="flex items-center justify-between mb-4">
                <h3 id="modal-title" className="text-lg font-medium text-gray-900">
                  Add New Vehicle
                </h3>
                <button
                  type="button"
                  onClick={onClose}
                  className="text-gray-400 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded p-1"
                  aria-label="Close modal"
                >
                  <XMarkIcon className="h-6 w-6" />
                </button>
              </div>

              {error && (
                <div 
                  className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md"
                  role="alert"
                  aria-live="polite"
                >
                  <p className="text-sm text-red-800">{error}</p>
                </div>
              )}

              <div className="space-y-4 sm:space-y-6">
                {/* Stock Number Input */}
                <div>
                  <label htmlFor="stockNumber" className="block text-sm font-medium text-gray-700">
                    Stock Number *
                  </label>
                  <input
                    type="text"
                    id="stockNumber"
                    value={stockNumber}
                    onChange={(e) => setStockNumber(e.target.value)}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    placeholder="Enter vehicle stock number"
                    required
                    aria-describedby={error ? "form-error" : undefined}
                  />
                </div>

                {/* Store Display */}
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Store
                  </label>
                  <div className="mt-1 p-2 bg-gray-50 border border-gray-200 rounded-md">
                    <p className="text-sm text-gray-900">{selectedStore?.name}</p>
                  </div>
                </div>

                {/* Photo Upload */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Vehicle Photos (Optional)
                  </label>
                  <SimplePhotoUploader
                    onFilesChange={handleFilesChange}
                    maxFiles={20}
                    className="w-full"
                  />
                </div>
              </div>
            </div>
            
            <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse gap-3">
              <button
                type="submit"
                disabled={loading || !stockNumber.trim()}
                className="w-full inline-flex justify-center items-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:w-auto sm:text-sm disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                aria-describedby={loading ? "loading-status" : undefined}
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" aria-hidden="true" />
                    <span>Creating...</span>
                    <span className="sr-only" id="loading-status">Please wait, creating vehicle</span>
                  </>
                ) : (
                  'Create Vehicle'
                )}
              </button>
              <button
                type="button"
                onClick={onClose}
                className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:w-auto sm:text-sm transition-colors duration-200"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}