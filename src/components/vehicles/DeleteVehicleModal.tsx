'use client'

import { Vehicle } from '@/types'
import { XMarkIcon, TrashIcon, ExclamationTriangleIcon } from '@heroicons/react/24/outline'

interface DeleteVehicleModalProps {
  vehicle: Vehicle
  onConfirm: () => void
  onCancel: () => void
  isDeleting?: boolean
}

export default function DeleteVehicleModal({ 
  vehicle, 
  onConfirm, 
  onCancel,
  isDeleting = false 
}: DeleteVehicleModalProps) {
  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-20 mx-auto p-5 border w-full max-w-md shadow-lg rounded-md bg-white">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-medium text-gray-900">
            Delete Vehicle
          </h3>
          <button
            onClick={onCancel}
            disabled={isDeleting}
            className="text-gray-400 hover:text-gray-600 transition-colors disabled:opacity-50"
          >
            <XMarkIcon className="h-6 w-6" />
          </button>
        </div>

        {/* Vehicle Info */}
        <div className="mb-6 p-4 bg-gray-50 border border-gray-200 rounded-lg">
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-sm font-medium text-gray-700">Stock Number:</span>
              <span className="text-sm font-semibold text-gray-900">{vehicle.stockNumber}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm font-medium text-gray-700">Store:</span>
              <span className="text-sm text-gray-900">{vehicle.store?.name}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm font-medium text-gray-700">Images:</span>
              <span className="text-sm text-gray-900">{vehicle.images.length} image{vehicle.images.length !== 1 ? 's' : ''}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm font-medium text-gray-700">Created:</span>
              <span className="text-sm text-gray-900">
                {new Date(vehicle.createdAt).toLocaleDateString()}
              </span>
            </div>
          </div>
        </div>

        {/* Warning Message */}
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-md">
          <div className="flex">
            <ExclamationTriangleIcon className="h-6 w-6 text-red-400 mr-3 mt-0.5 flex-shrink-0" />
            <div>
              <h4 className="text-sm font-medium text-red-800 mb-2">
                Are you sure you want to delete this vehicle?
              </h4>
              <p className="text-sm text-red-700">
                This action cannot be undone. The vehicle and all {vehicle.images.length} associated image{vehicle.images.length !== 1 ? 's' : ''} will be permanently removed from both the database and storage.
              </p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end space-x-3">
          <button
            onClick={onCancel}
            disabled={isDeleting}
            className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={isDeleting}
            className="px-4 py-2 border border-transparent rounded-md text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
          >
            {isDeleting ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Deleting...
              </>
            ) : (
              <>
                <TrashIcon className="h-4 w-4 mr-2" />
                Delete Vehicle
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  )
}
