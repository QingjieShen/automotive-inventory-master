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
import BulkDeleteModal from '@/components/vehicles/BulkDeleteModal'

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
  onVehiclesDeleted?: () => void
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
      className="flex items-center space-x-1 text-left font-medium text-gray-900 hover:text-gray-600"
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

      // Clear selection and refresh the list
      setSelectedVehicles(new Set())
      setShowBulkDeleteModal(false)
      
      if (onVehiclesDeleted) {
        onVehiclesDeleted()
      }
    } catch (error) {
      console.error('Error deleting vehicles:', error)
      // TODO: Show error toast/notification
    }
  }

  const isAllSelected = vehicles.length > 0 && selectedVehicles.size === vehicles.length
  const isPartiallySelected = selectedVehicles.size > 0 && selectedVehicles.size < vehicles.length

  if (loading) {
    return (
      <div className="bg-white shadow rounded-lg">
        <div className="p-8 text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-2 text-gray-500">Loading vehicles...</p>
        </div>
      </div>
    )
  }

  if (vehicles.length === 0) {
    return (
      <div className="bg-white shadow rounded-lg">
        <div className="p-8 text-center">
          <p className="text-gray-500">No vehicles found.</p>
        </div>
      </div>
    )
  }

  return (
    <>
      <div className="bg-white shadow rounded-lg overflow-hidden">
        {/* Bulk Actions Bar */}
        {isAdmin && selectedVehicles.size > 0 && (
          <div className="bg-blue-50 border-b border-blue-200 px-6 py-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-blue-800">
                {selectedVehicles.size} vehicle{selectedVehicles.size !== 1 ? 's' : ''} selected
              </span>
              <button
                onClick={handleBulkDelete}
                className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
              >
                <TrashIcon className="h-4 w-4 mr-1" />
                Delete Selected
              </button>
            </div>
          </div>
        )}

        {/* Table Header */}
        <div className="bg-gray-50 px-6 py-3 border-b border-gray-200">
          <div className="grid grid-cols-12 gap-4 items-center text-xs font-medium text-gray-500 uppercase tracking-wider">
            {isAdmin && (
              <div className="col-span-1">
                <input
                  type="checkbox"
                  checked={isAllSelected}
                  ref={(input) => {
                    if (input) input.indeterminate = isPartiallySelected
                  }}
                  onChange={(e) => handleSelectAll(e.target.checked)}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
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
        <div className="divide-y divide-gray-200">
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
          <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
            <div className="flex-1 flex justify-between sm:hidden">
              <button
                onClick={() => onPageChange(pagination.currentPage - 1)}
                disabled={pagination.currentPage === 1}
                className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>
              <button
                onClick={() => onPageChange(pagination.currentPage + 1)}
                disabled={pagination.currentPage === pagination.totalPages}
                className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </div>
            <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
              <div>
                <p className="text-sm text-gray-700">
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
                <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                  <button
                    onClick={() => onPageChange(pagination.currentPage - 1)}
                    disabled={pagination.currentPage === 1}
                    className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <ChevronLeftIcon className="h-5 w-5" />
                  </button>
                  
                  {/* Page numbers */}
                  {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map((page) => (
                    <button
                      key={page}
                      onClick={() => onPageChange(page)}
                      className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                        page === pagination.currentPage
                          ? 'z-10 bg-blue-50 border-blue-500 text-blue-600'
                          : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                      }`}
                    >
                      {page}
                    </button>
                  ))}
                  
                  <button
                    onClick={() => onPageChange(pagination.currentPage + 1)}
                    disabled={pagination.currentPage === pagination.totalPages}
                    className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <ChevronRightIcon className="h-5 w-5" />
                  </button>
                </nav>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Bulk Delete Modal */}
      {showBulkDeleteModal && (
        <BulkDeleteModal
          vehicleCount={selectedVehicles.size}
          onConfirm={() => handleDeleteConfirmed(Array.from(selectedVehicles))}
          onCancel={() => setShowBulkDeleteModal(false)}
        />
      )}
    </>
  )
}