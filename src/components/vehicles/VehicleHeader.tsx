'use client'

import { useRouter } from 'next/navigation'
import { MagnifyingGlassIcon, PlusIcon } from '@heroicons/react/24/outline'
import { useStore } from '@/components/providers/StoreProvider'

interface VehicleHeaderProps {
  storeName: string
  onSearch: (term: string) => void
  searchTerm: string
  onVehicleAdded: () => void
}

export default function VehicleHeader({ 
  storeName, 
  onSearch, 
  searchTerm
}: VehicleHeaderProps) {
  const router = useRouter()
  const { selectedStore } = useStore()

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onSearch(e.target.value)
  }

  const handleAddVehicleClick = () => {
    if (selectedStore) {
      router.push(`/vehicles/new?storeId=${selectedStore.id}`)
    }
  }

  return (
    <>
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-gray-900">
                Vehicle Inventory
              </h1>
              <span className="ml-2 text-sm text-gray-500">
                - {storeName}
              </span>
            </div>

            <div className="flex items-center space-x-4">
              {/* Search */}
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Search by stock number..."
                  value={searchTerm}
                  onChange={handleSearchChange}
                  className="block w-64 pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
              </div>

              {/* Add Vehicle Button */}
              <button
                onClick={handleAddVehicleClick}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <PlusIcon className="h-5 w-5 mr-2" />
                Add Vehicle
              </button>
            </div>
          </div>
        </div>
      </header>
    </>
  )
}