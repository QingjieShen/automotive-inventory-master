'use client'

import { useState } from 'react'
import { Vehicle } from '@/types'
import { useSession } from 'next-auth/react'
import { 
  ChevronUpIcon, 
  ChevronDownIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  TrashIcon
} from '@heroicons/react/24/outline'
import VehicleCard from '@/components/vehicles/VehicleCard'
import VehicleCardSkeleton from '@/components/vehicles/VehicleCardSkeleton'
import BulkDeleteModal from '@/components/vehicles/BulkDeleteModal'
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
      <ChevronUpIcon className="h-4 w-4" />
    ) : (
      <ChevronDownIcon className="h-4 w-4" />
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
              <span className="text-sm text-primary">
                {selectedVehicles.size} vehicle{selectedVehicles.size !== 1 ? 's' : ''} selected
              </span>
              <button
                onClick={handleBulkDelete}
                className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded text-destructive-foreground bg-destructive hover:bg-destructive/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-destructive transition-colors duration-200"
                aria-label={`Delete ${selectedVehicles.size} selected vehicles`}
              >
                <TrashIcon className="h-4 w-4 mr-1" aria-hidden="true" />
                Delete Selected
              </button>
            </div>
          </div>
        )}

        {/* Mobile-friendly table header - hidden on small screens */}
        <div className="hidden sm:block bg-muted px-4 sm:px-6 py-3 border-b">
          <div className="grid grid-cols-12 gap-4 items-center text-xs font-medium text-muted-foreground uppercase tracking-wider">
            {isAdmin && (
              <div className="col-span-1">
                <input
                  type="checkbox"
                  checked={isAllSelected}
                  ref={(input) => {
                    if (input) input.indeterminate = isPartiallySelected
                  }}
                  onChange={(e) => handleSelectAll(e.target.checked)}
                  className="h-4 w-4 text-primary focus:ring-ring border-input rounded"
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
              <button
                onClick={() => onPageChange(pagination.currentPage - 1)}
                disabled={pagination.currentPage === 1}
                className="relative inline-flex items-center px-4 py-2 border text-sm font-medium rounded-md bg-card hover:bg-accent disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 transition-colors duration-200"
                aria-label="Go to previous page"
              >
                Previous
              </button>
              <span className="text-sm flex items-center">
                Page {pagination.currentPage} of {pagination.totalPages}
              </span>
              <button
                onClick={() => onPageChange(pagination.currentPage + 1)}
                disabled={pagination.currentPage === pagination.totalPages}
                className="ml-3 relative inline-flex items-center px-4 py-2 border text-sm font-medium rounded-md bg-card hover:bg-accent disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 transition-colors duration-200"
                aria-label="Go to next page"
              >
                Next
              </button>
            </div>
            
            {/* Desktop pagination */}
            <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
              <div>
                <p className="text-sm">
                  Showing{' '}
                  <span className="font-medium">
                    {(pagination.currentPage - 1) * 10 + 1}
                  </span>{' '}
                  to{' '}
                  <span className="font-medium">
                    {Math.min(pagination.currentPage * 10, pagination.totalCount)}
                  </span>{' '}
                  of{' '}
                  <span className="font-medium">{pagination.totalCount}</span>{' '}
                  results
                </p>
              </div>
              <div>
                <nav 
                  className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" 
                  aria-label="Pagination"
                  role="navigation"
                >
                  <button
                    onClick={() => onPageChange(pagination.currentPage - 1)}
                    disabled={pagination.currentPage === 1}
                    className="relative inline-flex items-center px-2 py-2 rounded-l-md border bg-card text-sm font-medium text-muted-foreground hover:bg-accent disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 transition-colors duration-200"
                    aria-label="Go to previous page"
                  >
                    <ChevronLeftIcon className="h-5 w-5" aria-hidden="true" />
                  </button>
                  
                  {/* Page numbers */}
                  {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map((page) => (
                    <button
                      key={page}
                      onClick={() => onPageChange(page)}
                      className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 transition-colors duration-200 ${
                        page === pagination.currentPage
                          ? 'z-10 bg-primary/10 border-primary text-primary'
                          : 'bg-card border-border hover:bg-accent'
                      }`}
                      aria-label={`Go to page ${page}`}
                      aria-current={page === pagination.currentPage ? 'page' : undefined}
                    >
                      {page}
                    </button>
                  ))}
                  
                  <button
                    onClick={() => onPageChange(pagination.currentPage + 1)}
                    disabled={pagination.currentPage === pagination.totalPages}
                    className="relative inline-flex items-center px-2 py-2 rounded-r-md border bg-card text-sm font-medium text-muted-foreground hover:bg-accent disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 transition-colors duration-200"
                    aria-label="Go to next page"
                  >
                    <ChevronRightIcon className="h-5 w-5" aria-hidden="true" />
                  </button>
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