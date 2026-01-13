'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { ProtectedRoute } from '../../../components/auth/ProtectedRoute'
import { RoleGuard } from '../../../components/auth/RoleGuard'
import { Store } from '../../../types'

function StoreManagementContent() {
  const router = useRouter()
  const [stores, setStores] = useState<Store[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [selectedStore, setSelectedStore] = useState<Store | null>(null)
  const [formError, setFormError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    fetchStores()
  }, [])

  const fetchStores = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/stores')
      if (!response.ok) {
        throw new Error('Failed to fetch stores')
      }
      const data = await response.json()
      setStores(data)
      setError(null)
    } catch (err) {
      setError('Failed to load stores')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleAddStore = () => {
    router.push('/admin/stores/new')
  }

  const handleEditStore = (store: Store) => {
    router.push(`/admin/stores/${store.id}/edit`)
  }

  const handleDeleteStore = (store: Store) => {
    setSelectedStore(store)
    setFormError(null)
    setShowDeleteModal(true)
  }

  const handleSubmitDelete = async () => {
    if (!selectedStore) return

    setFormError(null)
    setSubmitting(true)

    try {
      const response = await fetch(`/api/stores/${selectedStore.id}`, {
        method: 'DELETE'
      })

      if (!response.ok) {
        const data = await response.json()
        setFormError(data.error || 'Failed to delete store')
        setSubmitting(false)
        return
      }

      setShowDeleteModal(false)
      fetchStores()
    } catch (err) {
      setFormError('An error occurred while deleting the store')
      console.error(err)
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading stores...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Store Management</h1>
              <p className="mt-1 text-sm text-gray-600">
                Manage dealership locations and their information
              </p>
            </div>
            <button
              onClick={() => router.push('/stores')}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
            >
              Back to Stores
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {error && (
          <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
            {error}
          </div>
        )}

        {/* Add Store Button */}
        <div className="mb-6">
          <button
            onClick={handleAddStore}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 font-medium"
          >
            Add Store
          </button>
        </div>

        {/* Stores Grid */}
        {stores.length === 0 ? (
          <div className="bg-white shadow-sm rounded-lg p-12 text-center">
            <p className="text-gray-500">No stores found</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {stores.map(store => {
              // Determine background style based on imageUrl availability
              const backgroundStyle = store.imageUrl
                ? {
                    backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.5)), url(${store.imageUrl})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                  }
                : {
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  }

              return (
                <div
                  key={store.id}
                  className="rounded-lg shadow-md hover:shadow-lg transition-all duration-200 border border-gray-200 p-6 min-h-[280px]"
                  style={backgroundStyle}
                >
                  <div className="flex flex-col h-full">
                    {/* Store Name */}
                    <h3 className="text-lg font-semibold text-white mb-2" style={{ textShadow: '2px 2px 4px rgba(0, 0, 0, 0.8)' }}>
                      {store.name}
                    </h3>
                    
                    {/* Address */}
                    <p className="text-sm text-white mb-4 flex-grow" style={{ textShadow: '1px 1px 3px rgba(0, 0, 0, 0.8)' }}>
                      {store.address}
                    </p>
                    
                    {/* Brand Logos */}
                    <div className="flex flex-wrap gap-2 mb-4">
                      {store.brandLogos.length > 0 ? (
                        store.brandLogos.map((logo, index) => (
                          <div
                            key={index}
                            className="px-2 py-1 bg-white/90 rounded text-xs text-gray-800 font-medium"
                          >
                            {logo.toUpperCase()}
                          </div>
                        ))
                      ) : (
                        <div className="px-2 py-1 bg-white/70 rounded text-xs text-gray-600 italic">
                          No brands
                        </div>
                      )}
                    </div>
                    
                    {/* Action Buttons */}
                    <div className="mt-auto pt-4 border-t border-white/30 flex gap-3">
                      <button
                        onClick={() => handleEditStore(store)}
                        className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors duration-200 font-medium"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteStore(store)}
                        className="flex-1 bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-colors duration-200 font-medium"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && selectedStore && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h2 className="text-xl font-bold mb-4">Delete Store</h2>
            {formError && (
              <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-3 py-2 rounded text-sm">
                {formError}
              </div>
            )}
            <p className="mb-6 text-gray-700">
              Are you sure you want to delete <strong>{selectedStore.name}</strong>?
              This action cannot be undone.
            </p>
            <div className="flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setShowDeleteModal(false)}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                disabled={submitting}
              >
                Cancel
              </button>
              <button
                onClick={handleSubmitDelete}
                className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700 disabled:opacity-50"
                disabled={submitting}
              >
                {submitting ? 'Deleting...' : 'Delete Store'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default function StoreManagementPage() {
  return (
    <ProtectedRoute>
      <RoleGuard allowedRoles={['SUPER_ADMIN']}>
        <StoreManagementContent />
      </RoleGuard>
    </ProtectedRoute>
  )
}
