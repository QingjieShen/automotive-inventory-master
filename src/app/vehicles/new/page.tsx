'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { useStore } from '@/components/providers/StoreProvider'
import NavigationBanner from '@/components/common/NavigationBanner'
import KeyImagesUploader from '@/components/vehicles/KeyImagesUploader'
import SimplePhotoUploader from '@/components/vehicles/SimplePhotoUploader'
import { LoadingSpinner } from '@/components/common'
import { ProtectedRoute } from '@/components/auth/ProtectedRoute'
import { ImageType } from '@/types'

interface UploadFile extends File {
  id: string
  preview?: string
  imageType?: ImageType
}

export default function AddVehiclePage() {
  return (
    <ProtectedRoute>
      <AddVehicleContent />
    </ProtectedRoute>
  )
}

function AddVehicleContent() {
  const router = useRouter()
  const { data: session, status } = useSession()
  const { selectedStore } = useStore()
  
  const [stockNumber, setStockNumber] = useState('')
  const [keyImages, setKeyImages] = useState<UploadFile[]>([])
  const [galleryImages, setGalleryImages] = useState<UploadFile[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [validationError, setValidationError] = useState<string | null>(null)
  const [showRetry, setShowRetry] = useState(false)

  // Redirect if not authenticated or no store selected
  useEffect(() => {
    if (status === 'loading') return

    if (!session) {
      router.push('/login')
      return
    }

    if (!selectedStore) {
      router.push('/stores')
      return
    }
  }, [session, status, selectedStore, router])

  // Validate stock number in real-time
  useEffect(() => {
    if (stockNumber.trim() === '') {
      setValidationError(null)
    } else if (stockNumber.trim().length < 1) {
      setValidationError('Stock number is required')
    } else if (!/^[a-zA-Z0-9-_]+$/.test(stockNumber.trim())) {
      setValidationError('Stock number can only contain letters, numbers, hyphens, and underscores')
    } else {
      setValidationError(null)
    }
  }, [stockNumber])

  const handleKeyImagesChange = (files: UploadFile[]) => {
    setKeyImages(files)
  }

  const handleGalleryImagesChange = (files: UploadFile[]) => {
    setGalleryImages(files)
  }

  const handleCancel = () => {
    router.push('/vehicles')
  }

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) {
      e.preventDefault()
    }
    
    if (!stockNumber.trim()) {
      setError('Stock number is required')
      setShowRetry(false)
      return
    }

    if (validationError) {
      setError(validationError)
      setShowRetry(false)
      return
    }

    if (!selectedStore) {
      setError('No store selected')
      setShowRetry(false)
      return
    }

    setLoading(true)
    setError(null)
    setShowRetry(false)

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

      // Upload all images if any
      const allImages = [...keyImages, ...galleryImages]
      if (allImages.length > 0) {
        try {
          const formData = new FormData()
          allImages.forEach((uploadFile, index) => {
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

      // Navigate to the vehicle detail page
      router.push(`/vehicles/${vehicle.id}`)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
      setShowRetry(true)
      setLoading(false)
    }
  }

  const handleRetry = () => {
    handleSubmit()
  }

  if (status === 'loading' || !selectedStore) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" text="Loading..." />
      </div>
    )
  }

  const totalImages = keyImages.length + galleryImages.length

  return (
    <div className="min-h-screen bg-gray-50">
      <NavigationBanner 
        currentStore={selectedStore}
        showBackToStores={true}
      />
      
      {/* Add padding-top to account for fixed navigation banner */}
      <div className="pt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Page Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">
              Add New Vehicle
            </h1>
            <p className="mt-2 text-sm text-gray-600">
              Create a new vehicle record for {selectedStore.name}
            </p>
          </div>

          <form onSubmit={handleSubmit}>
            {/* Error Message */}
            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-md">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <p className="text-red-800 font-medium">Error</p>
                    <p className="text-red-700 mt-1">{error}</p>
                  </div>
                  {showRetry && (
                    <button
                      type="button"
                      onClick={handleRetry}
                      disabled={loading}
                      className="ml-4 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      Retry
                    </button>
                  )}
                </div>
              </div>
            )}

            {/* Two-column layout on desktop, single column on mobile */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Left Column: Vehicle Information */}
              <div className="space-y-6">
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                  <h2 className="text-xl font-semibold text-gray-900 mb-6">
                    Vehicle Information
                  </h2>

                  {/* Stock Number Input */}
                  <div className="mb-6">
                    <label 
                      htmlFor="stockNumber" 
                      className="block text-sm font-medium text-gray-700 mb-2"
                    >
                      Stock Number <span className="text-red-500">*</span>
                    </label>
                    <input
                      id="stockNumber"
                      type="text"
                      value={stockNumber}
                      onChange={(e) => setStockNumber(e.target.value)}
                      className={`w-full px-4 py-3 border rounded-lg text-base focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                        validationError 
                          ? 'border-red-300 focus:ring-red-500' 
                          : 'border-gray-300'
                      }`}
                      placeholder="Enter stock number (e.g., ABC123)"
                      required
                      disabled={loading}
                    />
                    {validationError && (
                      <p className="mt-2 text-sm text-red-600">
                        {validationError}
                      </p>
                    )}
                    {!validationError && stockNumber.trim() && (
                      <p className="mt-2 text-sm text-green-600">
                        ✓ Valid stock number
                      </p>
                    )}
                  </div>

                  {/* Store Display */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Store
                    </label>
                    <div className="px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg">
                      <p className="text-base text-gray-900 font-medium">
                        {selectedStore.name}
                      </p>
                      <p className="text-sm text-gray-600 mt-1">
                        {selectedStore.address}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Form Actions - Desktop (hidden on mobile) */}
                <div className="hidden lg:block bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                  <div className="flex flex-col gap-3">
                    <button
                      type="submit"
                      disabled={loading || !stockNumber.trim() || !!validationError}
                      className="w-full py-3 px-4 bg-blue-600 text-white rounded-lg font-medium disabled:bg-gray-300 disabled:cursor-not-allowed hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                    >
                      {loading ? (
                        <span className="flex items-center justify-center">
                          <LoadingSpinner size="sm" />
                          <span className="ml-2">Creating Vehicle...</span>
                        </span>
                      ) : (
                        <>
                          Create Vehicle
                          {totalImages > 0 && (
                            <span className="ml-2 text-sm">
                              ({totalImages} photo{totalImages !== 1 ? 's' : ''})
                            </span>
                          )}
                        </>
                      )}
                    </button>
                    <button
                      type="button"
                      onClick={handleCancel}
                      disabled={loading}
                      className="w-full py-3 px-4 bg-white text-gray-700 border border-gray-300 rounded-lg font-medium hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </div>

              {/* Right Column: Photo Upload */}
              <div className="space-y-6">
                {/* Key Images Section */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                  <h2 className="text-xl font-semibold text-gray-900 mb-2">
                    Key Images
                  </h2>
                  <p className="text-sm text-gray-600 mb-4">
                    Upload the 6 standard vehicle shots. Each slot accepts one image.
                  </p>
                  <KeyImagesUploader
                    onFilesChange={handleKeyImagesChange}
                    className="w-full"
                  />
                </div>

                {/* Gallery Images Section */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                  <h2 className="text-xl font-semibold text-gray-900 mb-2">
                    Gallery Images
                  </h2>
                  <p className="text-sm text-gray-600 mb-4">
                    Upload additional photos (interior, details, etc.) - up to 60 images
                  </p>
                  <SimplePhotoUploader
                    onFilesChange={handleGalleryImagesChange}
                    maxFiles={60}
                    className="w-full"
                  />
                  {galleryImages.length > 0 && (
                    <p className="mt-3 text-sm text-blue-600 font-medium">
                      {galleryImages.length} of 60 gallery image{galleryImages.length !== 1 ? 's' : ''} selected
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Form Actions - Mobile (shown only on mobile) */}
            <div className="lg:hidden mt-8 bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex flex-col gap-3">
                <button
                  type="submit"
                  disabled={loading || !stockNumber.trim() || !!validationError}
                  className="w-full py-3 px-4 bg-blue-600 text-white rounded-lg font-medium disabled:bg-gray-300 disabled:cursor-not-allowed hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                >
                  {loading ? (
                    <span className="flex items-center justify-center">
                      <LoadingSpinner size="sm" />
                      <span className="ml-2">Creating Vehicle...</span>
                    </span>
                  ) : (
                    <>
                      Create Vehicle
                      {totalImages > 0 && (
                        <span className="ml-2 text-sm">
                          ({totalImages} photo{totalImages !== 1 ? 's' : ''})
                        </span>
                      )}
                    </>
                  )}
                </button>
                <button
                  type="button"
                  onClick={handleCancel}
                  disabled={loading}
                  className="w-full py-3 px-4 bg-white text-gray-700 border border-gray-300 rounded-lg font-medium hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Cancel
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
