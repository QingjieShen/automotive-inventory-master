'use client'

import { useRouter } from 'next/navigation'
import { useStore } from '../providers/StoreProvider'

interface StoreHeaderProps {
  title?: string
  showStoreSelector?: boolean
}

export function StoreHeader({ title = 'Vehicle Inventory', showStoreSelector = true }: StoreHeaderProps) {
  const { selectedStore, clearSelectedStore } = useStore()
  const router = useRouter()

  const handleChangeStore = () => {
    clearSelectedStore()
    router.push('/stores')
  }

  if (!selectedStore) {
    return null
  }

  return (
    <div className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
            <div className="flex items-center mt-1 text-sm text-gray-600">
              <span>Current Store: </span>
              <span className="font-medium text-gray-900 ml-1">
                {selectedStore.name}
              </span>
              <span className="mx-2">•</span>
              <span>{selectedStore.address}</span>
            </div>
          </div>
          
          {showStoreSelector && (
            <button
              onClick={handleChangeStore}
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors duration-200 text-sm font-medium"
            >
              Change Store
            </button>
          )}
        </div>
      </div>
    </div>
  )
}