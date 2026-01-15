'use client'

import { Vehicle } from '@/types'
import { TrashIcon, ExclamationTriangleIcon } from '@heroicons/react/24/outline'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'

interface DeleteVehicleModalProps {
  vehicle: Vehicle
  open: boolean
  onConfirm: () => void
  onCancel: () => void
  isDeleting?: boolean
}

export default function DeleteVehicleModal({ 
  vehicle,
  open,
  onConfirm, 
  onCancel,
  isDeleting = false 
}: DeleteVehicleModalProps) {
  return (
    <Dialog open={open} onOpenChange={onCancel}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="text-lg font-medium text-gray-900">
            Delete Vehicle
          </DialogTitle>
        </DialogHeader>

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
              <DialogDescription className="text-sm text-red-700">
                This action cannot be undone. The vehicle and all {vehicle.images.length} associated image{vehicle.images.length !== 1 ? 's' : ''} will be permanently removed from both the database and storage.
              </DialogDescription>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <DialogFooter>
          <Button
            variant="outline"
            onClick={onCancel}
            disabled={isDeleting}
          >
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={onConfirm}
            disabled={isDeleting}
            className="flex items-center"
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
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
