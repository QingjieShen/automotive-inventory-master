'use client'

import { useState } from 'react'
import { VehicleImage, ProcessingStatus, UserRole } from '@/types'
import { 
  PlayIcon, 
  ArrowPathIcon, 
  CheckCircleIcon, 
  ExclamationTriangleIcon,
  ArrowDownTrayIcon,
  ClockIcon
} from '@heroicons/react/24/outline'
import { useSession } from 'next-auth/react'

interface ProcessingButtonProps {
  image: VehicleImage
  vehicleId: string
  processingStatus: ProcessingStatus
  onProcessingStart: () => void
  onProcessingComplete: (updatedImage: VehicleImage) => void
}

export default function ProcessingButton({
  image,
  vehicleId,
  processingStatus,
  onProcessingStart,
  onProcessingComplete,
}: ProcessingButtonProps) {
  const { data: session } = useSession()
  const [isProcessing, setIsProcessing] = useState(false)
  const [isReprocessing, setIsReprocessing] = useState(false)
  const [isDownloading, setIsDownloading] = useState(false)

  const isAdmin = session?.user?.role === 'ADMIN'
  const isKeyImage = image.imageType !== 'GALLERY'

  // Don't show processing buttons for gallery images
  if (!isKeyImage) {
    return null
  }

  const handleProcess = async () => {
    try {
      setIsProcessing(true)
      onProcessingStart()

      const response = await fetch('/api/processing', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          vehicleId,
          imageIds: [image.id],
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to start processing')
      }

      const result = await response.json()
      
      // Find the updated image in the response
      const updatedImage = result.vehicle?.images?.find((img: VehicleImage) => img.id === image.id)
      if (updatedImage) {
        onProcessingComplete(updatedImage)
      }
    } catch (error) {
      console.error('Processing error:', error)
      // TODO: Show error toast/notification
    } finally {
      setIsProcessing(false)
    }
  }

  const handleReprocess = async () => {
    if (!isAdmin) return

    try {
      setIsReprocessing(true)
      onProcessingStart()

      const response = await fetch('/api/processing/reprocess', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          vehicleId,
          imageIds: [image.id],
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to start reprocessing')
      }

      const result = await response.json()
      
      // Find the updated image in the response
      const updatedImage = result.vehicle?.images?.find((img: VehicleImage) => img.id === image.id)
      if (updatedImage) {
        onProcessingComplete(updatedImage)
      }
    } catch (error) {
      console.error('Reprocessing error:', error)
      // TODO: Show error toast/notification
    } finally {
      setIsReprocessing(false)
    }
  }

  const handleDownload = async () => {
    if (!image.processedUrl) return

    try {
      setIsDownloading(true)

      const response = await fetch(`/api/processing/download?imageId=${image.id}`)
      
      if (!response.ok) {
        throw new Error('Failed to download image')
      }

      // Create download link
      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      
      // Get filename from Content-Disposition header or create default
      const contentDisposition = response.headers.get('Content-Disposition')
      const filename = contentDisposition
        ? contentDisposition.split('filename=')[1]?.replace(/"/g, '')
        : `processed_${image.imageType.toLowerCase()}.jpg`
      
      link.download = filename
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      window.URL.revokeObjectURL(url)
    } catch (error) {
      console.error('Download error:', error)
      // TODO: Show error toast/notification
    } finally {
      setIsDownloading(false)
    }
  }

  const getStatusDisplay = () => {
    if (isProcessing || isReprocessing) {
      return (
        <div className="flex items-center space-x-2 text-blue-600">
          <ClockIcon className="h-4 w-4 animate-spin" />
          <span className="text-sm font-medium">
            {isReprocessing ? 'Reprocessing...' : 'Processing...'}
          </span>
        </div>
      )
    }

    switch (processingStatus) {
      case 'IN_PROGRESS':
        return (
          <div className="flex items-center space-x-2 text-blue-600">
            <ClockIcon className="h-4 w-4 animate-spin" />
            <span className="text-sm font-medium">In Progress</span>
          </div>
        )
      case 'COMPLETED':
        return (
          <div className="flex items-center space-x-2 text-green-600">
            <CheckCircleIcon className="h-4 w-4" />
            <span className="text-sm font-medium">Finished</span>
          </div>
        )
      case 'ERROR':
        return (
          <div className="flex items-center space-x-2 text-red-600">
            <ExclamationTriangleIcon className="h-4 w-4" />
            <span className="text-sm font-medium">Error</span>
          </div>
        )
      default:
        return null
    }
  }

  const renderButtons = () => {
    // Show processing status if vehicle is being processed
    if (processingStatus === 'IN_PROGRESS' || isProcessing || isReprocessing) {
      return getStatusDisplay()
    }

    // If image is not processed and no processing in progress, show process button
    if (!image.isProcessed && processingStatus !== 'IN_PROGRESS') {
      return (
        <button
          onClick={handleProcess}
          disabled={isProcessing}
          className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <PlayIcon className="h-4 w-4 mr-2" />
          Process
        </button>
      )
    }

    // If image is processed, show status and admin controls
    if (image.isProcessed) {
      return (
        <div className="space-y-2">
          {getStatusDisplay()}
          
          <div className="flex space-x-2">
            {/* Download button */}
            <button
              onClick={handleDownload}
              disabled={isDownloading || !image.processedUrl}
              className="inline-flex items-center px-2 py-1 border border-gray-300 text-xs font-medium rounded text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ArrowDownTrayIcon className="h-3 w-3 mr-1" />
              {isDownloading ? 'Downloading...' : 'Download'}
            </button>

            {/* Reprocess button (Admin only) */}
            {isAdmin && (
              <button
                onClick={handleReprocess}
                disabled={isReprocessing}
                className="inline-flex items-center px-2 py-1 border border-gray-300 text-xs font-medium rounded text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ArrowPathIcon className="h-3 w-3 mr-1" />
                Reprocess
              </button>
            )}
          </div>
        </div>
      )
    }

    // Show error status with retry option
    if (processingStatus === 'ERROR') {
      return (
        <div className="space-y-2">
          {getStatusDisplay()}
          <button
            onClick={handleProcess}
            disabled={isProcessing}
            className="inline-flex items-center px-2 py-1 border border-gray-300 text-xs font-medium rounded text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ArrowPathIcon className="h-3 w-3 mr-1" />
            Retry
          </button>
        </div>
      )
    }

    return null
  }

  return (
    <div className="mt-2">
      {renderButtons()}
    </div>
  )
}