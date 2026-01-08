'use client'

import { useState } from 'react'
import { VehicleImage, UserRole } from '@/types'
import { 
  ArrowDownTrayIcon, 
  ArrowPathIcon,
  PlayIcon,
  CheckCircleIcon
} from '@heroicons/react/24/outline'
import { useSession } from 'next-auth/react'

interface BulkProcessingActionsProps {
  selectedImages: VehicleImage[]
  vehicleId: string
  onProcessingComplete: () => void
}

export default function BulkProcessingActions({
  selectedImages,
  vehicleId,
  onProcessingComplete,
}: BulkProcessingActionsProps) {
  const { data: session } = useSession()
  const [isProcessing, setIsProcessing] = useState(false)
  const [isReprocessing, setIsReprocessing] = useState(false)
  const [isDownloading, setIsDownloading] = useState(false)

  const isAdmin = session?.user?.role === 'ADMIN'

  // Filter to only key images for processing
  const keyImages = selectedImages.filter(img => img.imageType !== 'GALLERY')
  const unprocessedKeyImages = keyImages.filter(img => !img.isProcessed)
  const processedKeyImages = keyImages.filter(img => img.isProcessed && img.processedUrl)

  if (selectedImages.length === 0) {
    return null
  }

  const handleBulkProcess = async () => {
    if (unprocessedKeyImages.length === 0) return

    try {
      setIsProcessing(true)

      const response = await fetch('/api/processing', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          vehicleId,
          imageIds: unprocessedKeyImages.map(img => img.id),
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to start bulk processing')
      }

      onProcessingComplete()
    } catch (error) {
      console.error('Bulk processing error:', error)
      // TODO: Show error toast/notification
    } finally {
      setIsProcessing(false)
    }
  }

  const handleBulkReprocess = async () => {
    if (!isAdmin || processedKeyImages.length === 0) return

    try {
      setIsReprocessing(true)

      const response = await fetch('/api/processing/reprocess', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          vehicleId,
          imageIds: processedKeyImages.map(img => img.id),
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to start bulk reprocessing')
      }

      onProcessingComplete()
    } catch (error) {
      console.error('Bulk reprocessing error:', error)
      // TODO: Show error toast/notification
    } finally {
      setIsReprocessing(false)
    }
  }

  const handleBulkDownload = async () => {
    if (processedKeyImages.length === 0) return

    try {
      setIsDownloading(true)

      const response = await fetch('/api/processing/download/batch', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          imageIds: processedKeyImages.map(img => img.id),
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to get download information')
      }

      const result = await response.json()

      // Download each image individually
      // In a production environment, you might want to create a ZIP file
      for (const imageInfo of result.images) {
        const downloadResponse = await fetch(imageInfo.downloadUrl)
        if (downloadResponse.ok) {
          const blob = await downloadResponse.blob()
          const url = window.URL.createObjectURL(blob)
          const link = document.createElement('a')
          link.href = url
          link.download = imageInfo.filename
          document.body.appendChild(link)
          link.click()
          document.body.removeChild(link)
          window.URL.revokeObjectURL(url)
          
          // Small delay between downloads to avoid overwhelming the browser
          await new Promise(resolve => setTimeout(resolve, 100))
        }
      }
    } catch (error) {
      console.error('Bulk download error:', error)
      // TODO: Show error toast/notification
    } finally {
      setIsDownloading(false)
    }
  }

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-medium text-gray-900">
          Bulk Actions ({selectedImages.length} selected)
        </h3>
        <div className="text-xs text-gray-500">
          {keyImages.length} key images, {selectedImages.length - keyImages.length} gallery images
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        {/* Bulk Process Button */}
        {unprocessedKeyImages.length > 0 && (
          <button
            onClick={handleBulkProcess}
            disabled={isProcessing}
            className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <PlayIcon className="h-4 w-4 mr-2" />
            {isProcessing ? 'Processing...' : `Process ${unprocessedKeyImages.length} Images`}
          </button>
        )}

        {/* Bulk Reprocess Button (Admin only) */}
        {isAdmin && processedKeyImages.length > 0 && (
          <button
            onClick={handleBulkReprocess}
            disabled={isReprocessing}
            className="inline-flex items-center px-3 py-2 border border-gray-300 text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ArrowPathIcon className="h-4 w-4 mr-2" />
            {isReprocessing ? 'Reprocessing...' : `Reprocess ${processedKeyImages.length} Images`}
          </button>
        )}

        {/* Bulk Download Button */}
        {processedKeyImages.length > 0 && (
          <button
            onClick={handleBulkDownload}
            disabled={isDownloading}
            className="inline-flex items-center px-3 py-2 border border-gray-300 text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ArrowDownTrayIcon className="h-4 w-4 mr-2" />
            {isDownloading ? 'Downloading...' : `Download ${processedKeyImages.length} Images`}
          </button>
        )}

        {/* Status indicators */}
        {processedKeyImages.length > 0 && (
          <div className="inline-flex items-center px-3 py-2 text-sm text-green-600">
            <CheckCircleIcon className="h-4 w-4 mr-2" />
            {processedKeyImages.length} Processed
          </div>
        )}
      </div>

      {/* Information text */}
      <div className="mt-3 text-xs text-gray-500">
        <p>• Only key images (Front Quarter, Front, Back Quarter, Back, Driver Side, Passenger Side) can be processed</p>
        <p>• Gallery images are not eligible for background removal processing</p>
        {isAdmin && <p>• Admin users can reprocess already finished images</p>}
      </div>
    </div>
  )
}