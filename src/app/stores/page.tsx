'use client'

import { useRouter } from 'next/navigation'
import { useAuth } from '../../hooks/useAuth'
import { ProtectedRoute } from '../../components/auth/ProtectedRoute'
import { StoreGrid } from '../../components/stores/StoreGrid'
import { useStore } from '../../components/providers/StoreProvider'
import NavigationBanner from '../../components/common/NavigationBanner'
import { Button } from '@/components/ui/button'
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
    <div className="min-h-screen">
      {/* Navigation Banner */}
      <NavigationBanner />

      {/* Header */}
      <div className="border-b mt-16">
        <div className="container py-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="space-y-1">
              <h1 className="text-3xl font-bold tracking-tight">
                Select Store Location
              </h1>
              <p className="text-muted-foreground">
                Welcome, {user?.name}! Choose a dealership to manage vehicle inventory.
              </p>
            </div>
            <div className="flex items-center gap-4">
              {isSuperAdmin && (
                <Button onClick={handleManageStores}>
                  Manage Stores
                </Button>
              )}
              <div className="text-right">
                <p className="text-sm text-muted-foreground">Role: {user?.role}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Store Grid */}
      <div className="container py-8">
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