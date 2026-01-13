'use client'

import { useRouter } from 'next/navigation'
import { useAuth } from '../../hooks/useAuth'
import { ProtectedRoute } from '../../components/auth/ProtectedRoute'
import { StoreGrid } from '../../components/stores/StoreGrid'
import { useStore } from '../../components/providers/StoreProvider'
import NavigationBanner from '../../components/common/NavigationBanner'
import { Store } from '../../types'

function StoresPageContent() {
  const { user, isSuperAdmin } = useAuth()
  const { setSelectedStore } = useStore()
  const router = useRouter()

  const handleStoreSelect = (store: Store) => {
    // Set the selected store in context
    setSelectedStore(store)
    
    // Navigate to vehicle inventory page for selected store
    router.push('/vehicles')
  }

  const handleManageStores = () => {
    router.push('/admin/stores')
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation Banner */}
      <NavigationBanner />

      {/* Header */}
      <div className="bg-white shadow-sm border-b mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Select Store Location
              </h1>
              <p className="mt-1 text-sm text-gray-600">
                Welcome, {user?.name}! Choose a dealership to manage vehicle inventory.
              </p>
            </div>
            <div className="flex items-center gap-4">
              {isSuperAdmin && (
                <button
                  onClick={handleManageStores}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                >
                  Manage Stores
                </button>
              )}
              <div className="text-right">
                <p className="text-sm text-gray-500">Role: {user?.role}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Store Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <StoreGrid onStoreSelect={handleStoreSelect} />
      </div>
    </div>
  )
}

export default function StoresPage() {
  return (
    <ProtectedRoute>
      <StoresPageContent />
    </ProtectedRoute>
  )
}