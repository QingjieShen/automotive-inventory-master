'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { useStore } from '@/components/providers/StoreProvider'
import { Vehicle } from '@/types'
import { ArrowLeftIcon, ArrowDownTrayIcon } from '@heroicons/react/24/outline'
import { ProtectedRoute } from '@/components/auth/ProtectedRoute'
import ImageGallery from '@/components/vehicles/ImageGallery'
import { LoadingSpinner } from '@/components/common'
import NavigationBanner from '@/components/common/NavigationBanner'
import JSZip from 'jszip'
import { saveAs } from 'file-saver'
import { toast } from '@/lib/utils/toast'

export default function VehicleDetailPage() {
  return (
    <ProtectedRoute>
      <VehicleDetailContent />
    </ProtectedRoute>
  )
}

function VehicleDetailContent() {
  const params = useParams()
  const router = useRouter()
  const { data: session } = useSession()
  const { selectedStore } = useStore()
  const [vehicle, setVehicle] = useState<Vehicle | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [downloading, setDownloading] = useState(false)

  const vehicleId = params.id as string

  useEffect(() => {
    if (vehicleId) {
      fetchVehicle()
    }
  }, [vehicleId])

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
    } catch (err) {
      console.error('Error fetching vehicle:', err)
      setError('Failed to load vehicle details')
    } finally {
      setLoading(false)
    }
  }

  const handleBack = () => {
    router.back()
  }

  const handleDownloadImages = async () => {
    if (!vehicle || !vehicle.images || vehicle.images.length === 0) {
      toast.error('No images', 'No images to download')
      return
    }

    setDownloading(true)
    const loadingToast = toast.loading('Preparing download...')
    
    try {
      const zip = new JSZip()
      const folder = zip.folder(vehicle.stockNumber)

      if (!folder) {
        throw new Error('Failed to create folder in zip')
      }

      // Download all images and add them to the zip
      const imagePromises = vehicle.images.map(async (image) => {
        try {
          // Use processedUrl if available, otherwise use originalUrl
          const imageUrl = image.processedUrl || image.originalUrl
          const response = await fetch(imageUrl)
          if (!response.ok) {
            console.warn(`Failed to download image: ${imageUrl}`)
            return null
          }
          const blob = await response.blob()
          
          // Extract filename from URL or use a default name
          const urlParts = imageUrl.split('/')
          const filename = urlParts[urlParts.length - 1] || `image-${image.id}.jpg`
          
          return { filename, blob }
        } catch (err) {
          console.warn(`Error downloading image ${image.id}:`, err)
          return null
        }
      })

      const results = await Promise.all(imagePromises)
      
      // Add successfully downloaded images to the zip
      let successCount = 0
      results.forEach((result) => {
        if (result) {
          folder.file(result.filename, result.blob)
          successCount++
        }
      })

      if (successCount === 0) {
        toast.dismiss(loadingToast)
        toast.error('Download failed', 'Failed to download any images')
        return
      }

      // Generate the zip file and trigger download
      const content = await zip.generateAsync({ type: 'blob' })
      saveAs(content, `${vehicle.stockNumber}.zip`)

      toast.dismiss(loadingToast)
      if (successCount < vehicle.images.length) {
        toast.warning('Partial download', `Downloaded ${successCount} of ${vehicle.images.length} images. Some images failed to download.`)
      } else {
        toast.success('Download complete', `Downloaded ${successCount} images`)
      }
    } catch (err) {
      console.error('Error creating zip file:', err)
      toast.dismiss(loadingToast)
      toast.error('Download failed', 'Failed to download images. Please try again.')
    } finally {
      setDownloading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <NavigationBanner />
        <div className="pt-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-center h-64">
            <LoadingSpinner size="lg" text="Loading vehicle details..." />
          </div>
        </div>
      </div>
    )
  }

  if (error || !vehicle) {
    return (
      <div className="min-h-screen bg-gray-50">
        <NavigationBanner />
        <div className="pt-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              {error || 'Vehicle not found'}
            </h2>
            <button
              onClick={handleBack}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
            >
              <ArrowLeftIcon className="h-4 w-4 mr-2" />
              Go Back
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <NavigationBanner />
      
      {/* Add padding-top to account for fixed navigation banner */}
      <div className="pt-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={handleBack}
                className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <ArrowLeftIcon className="h-4 w-4 mr-2" />
                Back to Vehicles
              </button>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  Vehicle {vehicle.stockNumber}
                </h1>
                <p className="text-sm text-gray-500 mt-1">
                  {vehicle.store?.name} • Created {new Date(vehicle.createdAt).toLocaleDateString()}
                </p>
              </div>
            </div>
            
            {/* Status Badge and Action Buttons */}
            <div className="flex items-center space-x-4">
              <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                vehicle.processingStatus === 'COMPLETED' 
                  ? 'bg-green-100 text-green-800'
                  : vehicle.processingStatus === 'IN_PROGRESS'
                  ? 'bg-yellow-100 text-yellow-800'
                  : vehicle.processingStatus === 'ERROR'
                  ? 'bg-red-100 text-red-800'
                  : 'bg-gray-100 text-gray-800'
              }`}>
                {vehicle.processingStatus === 'NOT_STARTED' && 'Not Started'}
                {vehicle.processingStatus === 'IN_PROGRESS' && 'In Progress'}
                {vehicle.processingStatus === 'COMPLETED' && 'Completed'}
                {vehicle.processingStatus === 'ERROR' && 'Error'}
              </span>
              <button
                onClick={handleDownloadImages}
                disabled={downloading || !vehicle.images || vehicle.images.length === 0}
                className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                title={vehicle.images && vehicle.images.length > 0 ? `Download ${vehicle.images.length} images` : 'No images to download'}
              >
                {downloading ? (
                  <>
                    <LoadingSpinner size="sm" />
                    <span className="ml-2">Downloading...</span>
                  </>
                ) : (
                  <>
                    <ArrowDownTrayIcon className="h-4 w-4 mr-2" />
                    Download Images
                  </>
                )}
              </button>
              <button
                onClick={() => router.push(`/vehicles/${vehicle.id}/edit`)}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Edit Vehicle
              </button>
            </div>
          </div>
        </div>

        {/* Image Gallery */}
        <ImageGallery 
          vehicle={vehicle} 
          onVehicleUpdate={setVehicle}
        />
      </div>
    </div>
  )
}