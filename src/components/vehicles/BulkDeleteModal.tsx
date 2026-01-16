'use client'

import { useState } from 'react'
import { ExclamationTriangleIcon } from '@heroicons/react/24/outline'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'

interface BulkDeleteModalProps {
  vehicleCount: number
  open: boolean
  onConfirm: () => void
  onCancel: () => void
}

export default function BulkDeleteModal({ vehicleCount, open, onConfirm, onCancel }: BulkDeleteModalProps) {
  const [loading, setLoading] = useState(false)

  const handleConfirm = async () => {
    setLoading(true)
    try {
      await onConfirm()
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onCancel}>
      <DialogContent className="sm:max-w-lg">
        <div className="sm:flex sm:items-start">
          <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-destructive/10 sm:mx-0 sm:h-10 sm:w-10">
            <ExclamationTriangleIcon className="h-6 w-6 text-destructive" />
          </div>
          <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left flex-1">
            <DialogHeader>
              <DialogTitle className="text-lg leading-6 font-medium">
                Delete Vehicles
              </DialogTitle>
            </DialogHeader>
            <div className="mt-2">
              <DialogDescription className="text-sm text-destructive/90 font-medium">
                Are you sure you want to delete {vehicleCount} vehicle{vehicleCount !== 1 ? 's' : ''}? 
                This action will permanently remove the vehicle{vehicleCount !== 1 ? 's' : ''} and all 
                associated photos and processing data. This action cannot be undone.
              </DialogDescription>
            </div>
          </div>
        </div>
        <DialogFooter className="mt-5 sm:mt-4">
          <Button
            variant="outline"
            onClick={onCancel}
            disabled={loading}
          >
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={handleConfirm}
            disabled={loading}
          >
            {loading ? 'Deleting...' : 'Delete'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}