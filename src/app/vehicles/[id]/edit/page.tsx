'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { useStore } from '@/components/providers/StoreProvider'
import NavigationBanner from '@/components/common/NavigationBanner'
import ImageGallery from '@/components/vehicles/ImageGallery'
import KeyImagesUploader from '@/components/vehicles/KeyImagesUploader'
import GalleryImagesUploader from '@/components/vehicles/GalleryImagesUploader'
import DeleteVehicleModal from '@/components/vehicles/DeleteVehicleModal'
import { LoadingSpinner } from '@/components/common'
import { ProtectedRoute } from '@/components/auth/ProtectedRoute'
import { Vehicle, ImageType } from '@/types'
import { ArrowLeftIcon, TrashIcon } from '@heroicons/react/24/outline'
import { validateVIN } from '@/lib/validators/vin-validator'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

interface UploadFile extends File {
  id: string
  preview?: string
  imageType?: ImageType
}

export default function EditVehiclePage() {
  return (
    <ProtectedRoute>
      <EditVehicleContent />
    </ProtectedRoute>
  )
}

function EditVehicleContent() {
  const params = useParams()
  const router = useRouter()
  const { data: session, status } = useSession()
  const { selectedStore } = useStore()
  
  const vehicleId = params.id as string
  
  const [vehicle, setVehicle] = useState<Vehicle | null>(null)
  const [stockNumber, setStockNumber] = useState('')
  const [vin, setVin] = useState('')
  const [vinError, setVinError] = useState<string | null>(null)
  const [newKeyImages, setNewKeyImages] = useState<UploadFile[]>([])
  const [newGalleryImages, setNewGalleryImages] = useState<UploadFile[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [validationError, setValidationError] = useState<string | null>(null)
  const [showRetry, setShowRetry] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)

  // Fetch vehicle data
  useEffect(() => {
    if (vehicleId) {
      fetchVehicle()
    }
  }, [vehicleId])

  // Redirect if not authenticated
  useEffect(() => {
    if (status === 'loading') return

    if (!session) {
      router.push('/login')
      return
    }
  }, [session, status, router])

  // Validate stock number in real-time
  useEffect(() => {
    if (stockNumber.trim() === '') {
      setValidationError('Stock number is required')
    } else if (stockNumber.trim().length < 1) {
      setValidationError('Stock number is required')
    } else if (!/^[a-zA-Z0-9-_]+$/.test(stockNumber.trim())) {
      setValidationError('Stock number can only contain letters, numbers, hyphens, and underscores')
    } else {
      setValidationError(null)
    }
  }, [stockNumber])

  // Validate VIN in real-time
  useEffect(() => {
    if (vin.trim() === '') {
      setVinError(null)
    } else {
      const validation = validateVIN(vin)
      setVinError(validation.valid ? null : validation.error || 'Invalid VIN')
    }
  }, [vin])

  const fetchVehicle = async () => {
    try {
      setLoading(true)
      const response = await fetch(`/api/vehicles/${vehicleId}`)
      
      if (!response.ok) {
        if (response.status === 404) {
          setError('Vehicle not found')
        } else {
          throw new Error('Failed to fetch vehicle')
        }
        return
      }

      const data = await response.json()
      setVehicle(data)
      setStockNumber(data.stockNumber)
      setVin(data.vin || '')
    } catch (err) {
      console.error('Error fetching vehicle:', err)
      setError('Failed to load vehicle details')
    } finally {
      setLoading(false)
    }
  }

  const handleNewKeyImagesChange = (files: UploadFile[]) => {
    setNewKeyImages(files)
  }

  const handleNewGalleryImagesChange = (files: UploadFile[]) => {
    setNewGalleryImages(files)
  }

  const handleCancel = () => {
    router.push(`/vehicles/${vehicleId}`)
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

    if (!vin.trim()) {
      setError('VIN is required')
      setShowRetry(false)
      return
    }

    if (validationError) {
      setError(validationError)
      setShowRetry(false)
      return
    }

    if (vinError) {
      setError(vinError)
      setShowRetry(false)
      return
    }

    if (!vehicle) {
      setError('Vehicle data not loaded')
      setShowRetry(false)
      return
    }

    setSaving(true)
    setError(null)
    setShowRetry(false)

    try {
      // Update vehicle information if stock number or VIN changed
      if (stockNumber.trim() !== vehicle.stockNumber || vin.trim() !== vehicle.vin) {
        const vehicleResponse = await fetch(`/api/vehicles/${vehicleId}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            stockNumber: stockNumber.trim(),
            vin: vin.trim(),
          }),
        })

        if (!vehicleResponse.ok) {
          const errorData = await vehicleResponse.json()
          throw new Error(errorData.error || 'Failed to update vehicle')
        }

        const updatedVehicle = await vehicleResponse.json()
        setVehicle(updatedVehicle)
      }

      // Upload new images if any
      const allNewImages = [...newKeyImages, ...newGalleryImages]
      if (allNewImages.length > 0) {
        try {
          const formData = new FormData()
          allNewImages.forEach((uploadFile, index) => {
            formData.append(`file_${index}`, uploadFile)
            formData.append(`imageType_${index}`, uploadFile.imageType || 'GALLERY')
          })

          const imageResponse = await fetch(`/api/vehicles/${vehicleId}/images`, {
            method: 'POST',
            body: formData,
          })

          if (!imageResponse.ok) {
            console.warn('Failed to upload some images, but vehicle was updated successfully')
          }
        } catch (imageError) {
          console.warn('Image upload failed, but vehicle was updated successfully:', imageError)
        }
      }

      // Navigate back to the vehicle detail page
      router.push(`/vehicles/${vehicleId}`)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
      setShowRetry(true)
      setSaving(false)
    }
  }

  const handleRetry = () => {
    handleSubmit()
  }

  const handleDeleteClick = () => {
    setShowDeleteModal(true)
  }

  const handleDeleteConfirm = async () => {
    if (!vehicle) return

    try {
      setIsDeleting(true)
      const response = await fetch(`/api/vehicles/${vehicleId}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to delete vehicle')
      }

      // Navigate to vehicles list after successful deletion
      router.push('/vehicles')
    } catch (err) {
      console.error('Error deleting vehicle:', err)
      setError(err instanceof Error ? err.message : 'Failed to delete vehicle')
      setShowDeleteModal(false)
      setIsDeleting(false)
    }
  }

  const handleDeleteCancel = () => {
    setShowDeleteModal(false)
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" text="Loading vehicle..." />
      </div>
    )
  }

  if (error && !vehicle) {
    return (
      <div className="min-h-screen bg-gray-50">
        <NavigationBanner />
        <div className="pt-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              {error}
            </h2>
            <Button
              onClick={() => router.back()}
              className="inline-flex items-center"
            >
              <ArrowLeftIcon className="h-4 w-4 mr-2" />
              Go Back
            </Button>
          </div>
        </div>
      </div>
    )
  }

  if (!vehicle) {
    return null
  }

  const totalNewImages = newKeyImages.length + newGalleryImages.length

  return (
    <div className="min-h-screen bg-gray-50">
      <NavigationBanner />
      
      {/* Add padding-top to account for fixed navigation banner */}
      <div className="pt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Page Header */}
          <div className="mb-8">
            <div className="flex items-center space-x-4 mb-4">
              <Button
                variant="outline"
                onClick={handleCancel}
                className="inline-flex items-center"
              >
                <ArrowLeftIcon className="h-4 w-4 mr-2" />
                Cancel
              </Button>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  Edit Vehicle
                </h1>
                <p className="mt-2 text-sm text-gray-600">
                  Update vehicle information and manage images
                </p>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit}>
            {/* Error Message */}
            {error && (
              <div className="mb-6 p-4 bg-destructive/10 border border-destructive/30 rounded-md">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <p className="text-destructive font-medium">Error</p>
                    <p className="text-destructive mt-1">{error}</p>
                  </div>
                  {showRetry && (
                    <Button
                      type="button"
                      variant="destructive"
                      onClick={handleRetry}
                      disabled={saving}
                      className="ml-4"
                    >
                      Retry
                    </Button>
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
                      Stock Number <span className="text-destructive">*</span>
                    </label>
                    <Input
                      id="stockNumber"
                      type="text"
                      value={stockNumber}
                      onChange={(e) => setStockNumber(e.target.value)}
                      className={validationError ? 'border-destructive focus:ring-destructive' : ''}
                      placeholder="Enter stock number (e.g., ABC123)"
                      required
                      disabled={saving}
                      aria-invalid={!!validationError}
                      aria-describedby={validationError ? "stockNumber-error" : undefined}
                    />
                    {validationError && (
                      <p className="mt-2 text-sm text-destructive" id="stockNumber-error" role="alert">
                        {validationError}
                      </p>
                    )}
                    {!validationError && stockNumber.trim() && (
                      <p className="mt-2 text-sm text-green-600">
                        ✓ Valid stock number
                      </p>
                    )}
                  </div>

                  {/* VIN Input */}
                  <div className="mb-6">
                    <label 
                      htmlFor="vin" 
                      className="block text-sm font-medium text-gray-700 mb-2"
                    >
                      VIN <span className="text-destructive">*</span>
                    </label>
                    <Input
                      id="vin"
                      type="text"
                      value={vin}
                      onChange={(e) => setVin(e.target.value.toUpperCase())}
                      className={`uppercase ${vinError ? 'border-destructive focus:ring-destructive' : ''}`}
                      placeholder="Enter 17-character VIN"
                      maxLength={17}
                      required
                      disabled={saving}
                      aria-invalid={!!vinError}
                      aria-describedby={vinError ? "vin-error" : undefined}
                    />
                    {vinError && (
                      <p className="mt-2 text-sm text-destructive" id="vin-error" role="alert">
                        {vinError}
                      </p>
                    )}
                    {!vinError && vin.trim() && (
                      <p className="mt-2 text-sm text-green-600">
                        ✓ Valid VIN
                      </p>
                    )}
                    <p className="mt-2 text-xs text-gray-500">
                      17 characters, alphanumeric (excluding I, O, Q)
                    </p>
                  </div>

                  {/* Store Display */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Store
                    </label>
                    <div className="px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg">
                      <p className="text-base text-gray-900 font-medium">
                        {vehicle.store?.name}
                      </p>
                      <p className="text-sm text-gray-600 mt-1">
                        {vehicle.store?.address}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Form Actions - Desktop (hidden on mobile) */}
                <div className="hidden lg:block bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                  <div className="flex flex-col gap-3">
                    <Button
                      type="submit"
                      disabled={saving || !stockNumber.trim() || !vin.trim() || !!validationError || !!vinError}
                      className="w-full"
                    >
                      {saving ? (
                        <span className="flex items-center justify-center">
                          <LoadingSpinner size="sm" />
                          <span className="ml-2">Saving Changes...</span>
                        </span>
                      ) : (
                        <>
                          Save Changes
                          {totalNewImages > 0 && (
                            <span className="ml-2 text-sm">
                              (+{totalNewImages} new photo{totalNewImages !== 1 ? 's' : ''})
                            </span>
                          )}
                        </>
                      )}
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={handleCancel}
                      disabled={saving}
                      className="w-full"
                    >
                      Cancel
                    </Button>
                    
                    {/* Delete Button */}
                    <div className="pt-3 border-t border-gray-200">
                      <Button
                        type="button"
                        variant="destructive"
                        onClick={handleDeleteClick}
                        disabled={saving || isDeleting}
                        className="w-full flex items-center justify-center"
                      >
                        <TrashIcon className="h-5 w-5 mr-2" />
                        Delete Vehicle
                      </Button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column: Images */}
              <div className="space-y-6">
                {/* Existing Images Section */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                  <h2 className="text-xl font-semibold text-gray-900 mb-4">
                    Existing Images
                  </h2>
                  <p className="text-sm text-gray-600 mb-4">
                    Delete, reorder, or reclassify existing images
                  </p>
                  <ImageGallery 
                    vehicle={vehicle} 
                    onVehicleUpdate={setVehicle}
                  />
                </div>

                {/* Add New Key Images Section */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                  <h2 className="text-xl font-semibold text-gray-900 mb-2">
                    Add New Key Images
                  </h2>
                  <p className="text-sm text-gray-600 mb-4">
                    Upload additional key images if needed
                  </p>
                  <KeyImagesUploader
                    onFilesChange={handleNewKeyImagesChange}
                    className="w-full"
                  />
                </div>

                {/* Add New Gallery Images Section */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                  <h2 className="text-xl font-semibold text-gray-900 mb-2">
                    Add New Gallery Images
                  </h2>
                  <p className="text-sm text-gray-600 mb-4">
                    Upload additional gallery photos
                  </p>
                  <GalleryImagesUploader
                    onFilesChange={handleNewGalleryImagesChange}
                    maxFiles={60}
                    className="w-full"
                  />
                </div>
              </div>
            </div>

            {/* Form Actions - Mobile (shown only on mobile) */}
            <div className="lg:hidden mt-8 bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex flex-col gap-3">
                <Button
                  type="submit"
                  disabled={saving || !stockNumber.trim() || !vin.trim() || !!validationError || !!vinError}
                  className="w-full"
                >
                  {saving ? (
                    <span className="flex items-center justify-center">
                      <LoadingSpinner size="sm" />
                      <span className="ml-2">Saving Changes...</span>
                    </span>
                  ) : (
                    <>
                      Save Changes
                      {totalNewImages > 0 && (
                        <span className="ml-2 text-sm">
                          (+{totalNewImages} new photo{totalNewImages !== 1 ? 's' : ''})
                        </span>
                      )}
                    </>
                  )}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleCancel}
                  disabled={saving}
                  className="w-full"
                >
                  Cancel
                </Button>
                
                {/* Delete Button */}
                <div className="pt-3 border-t border-gray-200">
                  <Button
                    type="button"
                    variant="destructive"
                    onClick={handleDeleteClick}
                    disabled={saving || isDeleting}
                    className="w-full flex items-center justify-center"
                  >
                    <TrashIcon className="h-5 w-5 mr-2" />
                    Delete Vehicle
                  </Button>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
      
      {/* Delete Confirmation Modal */}
      {vehicle && (
        <DeleteVehicleModal
          vehicle={vehicle}
          open={showDeleteModal}
          onConfirm={handleDeleteConfirm}
          onCancel={handleDeleteCancel}
          isDeleting={isDeleting}
        />
      )}
    </div>
  )
}
