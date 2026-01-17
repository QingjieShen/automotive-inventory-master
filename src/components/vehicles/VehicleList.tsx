'use client'

import { useState } from 'react'
import { Vehicle } from '@/types'
import { useSession } from 'next-auth/react'
import { 
  ChevronUp, 
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Trash2
} from 'lucide-react'
import VehicleCard from '@/components/vehicles/VehicleCard'
import VehicleCardSkeleton from '@/components/vehicles/VehicleCardSkeleton'
import BulkDeleteModal from '@/components/vehicles/BulkDeleteModal'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { toast } from '@/lib/utils/toast'

interface VehicleListProps {
  vehicles: Vehicle[]
  loading: boolean
  pagination: {
    currentPage: number
    totalPages: number
    totalCount: number
  }
  sortBy: string
  sortOrder: 'asc' | 'desc'
  onSort: (field: string) => void
  onPageChange: (page: number) => void
  onVehiclesDeleted?: () => void | Promise<void>
}

export default function VehicleList({
  vehicles,
  loading,
  pagination,
  sortBy,
  sortOrder,
  onSort,
  onPageChange,
  onVehiclesDeleted
}: VehicleListProps) {
  const { data: session } = useSession()
  const isAdmin = session?.user?.role === 'ADMIN'
  
  const [selectedVehicles, setSelectedVehicles] = useState<Set<string>>(new Set())
  const [showBulkDeleteModal, setShowBulkDeleteModal] = useState(false)

  const getSortIcon = (field: string) => {
    if (sortBy !== field) return null
    return sortOrder === 'asc' ? (
      <ChevronUp className="h-4 w-4" />
    ) : (
      <ChevronDown className="h-4 w-4" />
    )
  }

  const SortButton = ({ field, children }: { field: string; children: React.ReactNode }) => (
    <button
      onClick={() => onSort(field)}
      className="flex items-center space-x-1 text-left font-medium hover:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 rounded-sm transition-colors"
    >
      <span>{children}</span>
      {getSortIcon(field)}
    </button>
  )

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedVehicles(new Set(vehicles.map(v => v.id)))
    } else {
      setSelectedVehicles(new Set())
    }
  }

  const handleSelectVehicle = (vehicleId: string, checked: boolean) => {
    const newSelected = new Set(selectedVehicles)
    if (checked) {
      newSelected.add(vehicleId)
    } else {
      newSelected.delete(vehicleId)
    }
    setSelectedVehicles(newSelected)
  }

  const handleBulkDelete = () => {
    if (selectedVehicles.size > 0) {
      setShowBulkDeleteModal(true)
    }
  }

  const handleDeleteConfirmed = async (vehicleIds: string[]) => {
    try {
      const response = await fetch('/api/vehicles/bulk-delete', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ vehicleIds }),
      })

      if (!response.ok) {
        throw new Error('Failed to delete vehicles')
      }

      // Close modal first
      setShowBulkDeleteModal(false)
      
      // Refresh the list from the server
      if (onVehiclesDeleted) {
        await onVehiclesDeleted()
      }
      
      // Clear selection after the list has been refreshed
      setSelectedVehicles(new Set())
      
      toast.success('Vehicles deleted', `Successfully deleted ${vehicleIds.length} vehicle(s)`)
    } catch (error) {
      console.error('Error deleting vehicles:', error)
      setShowBulkDeleteModal(false)
      toast.error('Delete failed', 'Failed to delete vehicles. Please try again.')
    }
  }

  const isAllSelected = vehicles.length > 0 && selectedVehicles.size === vehicles.length
  const isPartiallySelected = selectedVehicles.size > 0 && selectedVehicles.size < vehicles.length

  if (loading) {
    return (
      <div className="bg-card shadow rounded-lg">
        <div className="p-4 sm:p-6 space-y-4">
          <VehicleCardSkeleton showCheckbox={isAdmin} />
          <VehicleCardSkeleton showCheckbox={isAdmin} />
          <VehicleCardSkeleton showCheckbox={isAdmin} />
        </div>
      </div>
    )
  }

  if (vehicles.length === 0) {
    return (
      <div className="bg-card shadow rounded-lg">
        <div className="p-8 text-center">
          <p className="text-muted-foreground">No vehicles found.</p>
        </div>
      </div>
    )
  }

  return (
    <>
      <div className="bg-card shadow rounded-lg overflow-hidden">
        {/* Bulk Actions Bar */}
        {isAdmin && selectedVehicles.size > 0 && (
          <div 
            className="bg-primary/10 border-b border-primary/20 px-4 sm:px-6 py-3"
            role="region"
            aria-label="Bulk actions"
          >
            <div className="flex items-center justify-between">
              <span className="text-sm text-primary font-medium">
                {selectedVehicles.size} vehicle{selectedVehicles.size !== 1 ? 's' : ''} selected
              </span>
              <Button
                variant="destructive"
                size="sm"
                onClick={handleBulkDelete}
                aria-label={`Delete ${selectedVehicles.size} selected vehicles`}
              >
                <Trash2 className="h-4 w-4 mr-1" aria-hidden="true" />
                Delete Selected
              </Button>
            </div>
          </div>
        )}

        {/* Mobile-friendly table header - hidden on small screens */}
        <div className="hidden sm:block bg-muted px-4 sm:px-6 py-3 border-b">
          <div className="grid grid-cols-12 gap-4 items-center text-xs font-medium text-muted-foreground uppercase tracking-wider">
            {isAdmin && (
              <div className="col-span-1">
                <Checkbox
                  checked={isAllSelected}
                  onCheckedChange={handleSelectAll}
                  aria-label="Select all vehicles"
                />
              </div>
            )}
            <div className={isAdmin ? "col-span-2" : "col-span-3"}>
              <SortButton field="stockNumber">Stock Number</SortButton>
            </div>
            <div className="col-span-2">
              Thumbnail
            </div>
            <div className="col-span-2">
              Photo Count
            </div>
            <div className="col-span-2">
              <SortButton field="createdAt">Created Date</SortButton>
            </div>
            <div className="col-span-2">
              <SortButton field="processingStatus">Status</SortButton>
            </div>
            <div className="col-span-1">
              Actions
            </div>
          </div>
        </div>

        {/* Vehicle List */}
        <div 
          className="divide-y divide-border"
          role="table"
          aria-label="Vehicle inventory"
        >
          {vehicles.map((vehicle) => (
            <VehicleCard
              key={vehicle.id}
              vehicle={vehicle}
              showCheckbox={isAdmin}
              isSelected={selectedVehicles.has(vehicle.id)}
              onSelectionChange={(checked) => handleSelectVehicle(vehicle.id, checked)}
            />
          ))}
        </div>

        {/* Pagination */}
        {pagination.totalPages > 1 && (
          <div className="bg-card px-4 py-3 flex items-center justify-between border-t sm:px-6">
            {/* Mobile pagination */}
            <div className="flex-1 flex justify-between sm:hidden">
              <Button
                variant="outline"
                size="sm"
                onClick={() => onPageChange(pagination.currentPage - 1)}
                disabled={pagination.currentPage === 1}
                aria-label="Go to previous page"
              >
                Previous
              </Button>
              <span className="text-sm flex items-center">
                Page {pagination.currentPage} of {pagination.totalPages}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => onPageChange(pagination.currentPage + 1)}
                disabled={pagination.currentPage === pagination.totalPages}
                aria-label="Go to next page"
              >
                Next
              </Button>
            </div>
            
            {/* Desktop pagination */}
            <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
              <div>
                <p className="text-sm text-muted-foreground">
                  Showing{' '}
                  <span className="font-medium text-foreground">
                    {(pagination.currentPage - 1) * 10 + 1}
                  </span>{' '}
                  to{' '}
                  <span className="font-medium text-foreground">
                    {Math.min(pagination.currentPage * 10, pagination.totalCount)}
                  </span>{' '}
                  of{' '}
                  <span className="font-medium text-foreground">{pagination.totalCount}</span>{' '}
                  results
                </p>
              </div>
              <div>
                <nav 
                  className="flex items-center gap-1" 
                  aria-label="Pagination"
                  role="navigation"
                >
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => onPageChange(pagination.currentPage - 1)}
                    disabled={pagination.currentPage === 1}
                    aria-label="Go to previous page"
                  >
                    <ChevronLeft className="h-4 w-4" aria-hidden="true" />
                  </Button>
                  
                  {/* Page numbers */}
                  {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map((page) => (
                    <Button
                      key={page}
                      variant={page === pagination.currentPage ? "default" : "outline"}
                      size="sm"
                      onClick={() => onPageChange(page)}
                      aria-label={`Go to page ${page}`}
                      aria-current={page === pagination.currentPage ? 'page' : undefined}
                    >
                      {page}
                    </Button>
                  ))}
                  
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => onPageChange(pagination.currentPage + 1)}
                    disabled={pagination.currentPage === pagination.totalPages}
                    aria-label="Go to next page"
                  >
                    <ChevronRight className="h-4 w-4" aria-hidden="true" />
                  </Button>
                </nav>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Bulk Delete Modal */}
      <BulkDeleteModal
        vehicleCount={selectedVehicles.size}
        open={showBulkDeleteModal}
        onConfirm={() => handleDeleteConfirmed(Array.from(selectedVehicles))}
        onCancel={() => setShowBulkDeleteModal(false)}
      />
    </>
  )
}