'use client'

import { VehicleImage, ImageType } from '@/types'
import { XMarkIcon, TrashIcon } from '@heroicons/react/24/outline'
import Image from 'next/image'

interface DeleteImageModalProps {
  image: VehicleImage
  onConfirm: () => void
  onCancel: () => void
}

export default function DeleteImageModal({ image, onConfirm, onCancel }: DeleteImageModalProps) {
  const getImageTypeLabel = (type: ImageType): string => {
    const labels: Record<ImageType, string> = {
      'FRONT_QUARTER': 'Front Quarter',
      'FRONT': 'Front',
      'BACK_QUARTER': 'Back Quarter', 
      'BACK': 'Back',
      'DRIVER_SIDE': 'Driver Side',
      'PASSENGER_SIDE': 'Passenger Side',
      'GALLERY': 'Gallery',
      'GALLERY_EXTERIOR': 'Gallery Exterior',
      'GALLERY_INTERIOR': 'Gallery Interior'
    }
    return labels[type]
  }

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-medium text-gray-900">
            Delete Image
          </h3>
          <button
            onClick={onCancel}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <XMarkIcon className="h-6 w-6" />
          </button>
        </div>

        {/* Image Preview */}
        <div className="mb-4">
          <div className="relative aspect-[4/3] bg-gray-100 rounded-lg overflow-hidden">
            <Image
              src={image.processedUrl || image.originalUrl}
              alt={`${getImageTypeLabel(image.imageType)} view`}
              fill
              className="object-cover"
              sizes="384px"
            />
          </div>
        </div>

        {/* Image Info */}
        <div className="mb-6 space-y-2">
          <div className="flex justify-between">
            <span className="text-sm font-medium text-gray-700">Type:</span>
            <span className="text-sm text-gray-900">{getImageTypeLabel(image.imageType)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm font-medium text-gray-700">Uploaded:</span>
            <span className="text-sm text-gray-900">
              {new Date(image.uploadedAt).toLocaleDateString()}
            </span>
          </div>
          {image.isProcessed && (
            <div className="flex justify-between">
              <span className="text-sm font-medium text-gray-700">Status:</span>
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                Processed
              </span>
            </div>
          )}
        </div>

        {/* Warning Message */}
        <div className="mb-6 p-3 bg-red-50 border border-red-200 rounded-md">
          <div className="flex">
            <TrashIcon className="h-5 w-5 text-red-400 mr-2 mt-0.5" />
            <div>
              <h4 className="text-sm font-medium text-red-800">
                Are you sure you want to delete this image?
              </h4>
              <p className="text-sm text-red-700 mt-1">
                This action cannot be undone. The image will be permanently removed from both the database and storage.
              </p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end space-x-3">
          <button
            onClick={onCancel}
            className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 border border-transparent rounded-md text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
          >
            Delete Image
          </button>
        </div>
      </div>
    </div>
  )
}