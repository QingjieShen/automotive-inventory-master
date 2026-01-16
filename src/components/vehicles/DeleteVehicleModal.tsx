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
          <DialogTitle className="text-lg font-medium">
            Delete Vehicle
          </DialogTitle>
        </DialogHeader>

        {/* Vehicle Info */}
        <div className="mb-6 p-4 bg-muted border rounded-lg">
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-sm font-medium text-muted-foreground">Stock Number:</span>
              <span className="text-sm font-semibold">{vehicle.stockNumber}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm font-medium text-muted-foreground">Store:</span>
              <span className="text-sm">{vehicle.store?.name}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm font-medium text-muted-foreground">Images:</span>
              <span className="text-sm">{vehicle.images.length} image{vehicle.images.length !== 1 ? 's' : ''}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm font-medium text-muted-foreground">Created:</span>
              <span className="text-sm">
                {new Date(vehicle.createdAt).toLocaleDateString()}
              </span>
            </div>
          </div>
        </div>

        {/* Warning Message */}
        <div className="mb-6 p-4 bg-destructive/10 border border-destructive/30 rounded-md">
          <div className="flex">
            <ExclamationTriangleIcon className="h-6 w-6 text-destructive mr-3 mt-0.5 flex-shrink-0" />
            <div>
              <h4 className="text-sm font-medium text-destructive mb-2">
                Are you sure you want to delete this vehicle?
              </h4>
              <DialogDescription className="text-sm text-destructive/90">
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
