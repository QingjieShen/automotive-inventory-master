'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { ProtectedRoute } from '../../../components/auth/ProtectedRoute'
import { RoleGuard } from '../../../components/auth/RoleGuard'
import { Store } from '../../../types'

interface StoreFormData {
  name: string
  address: string
  brandLogos: string
  imageUrl?: string
}

function StoreManagementContent() {
  const router = useRouter()
  const [stores, setStores] = useState<Store[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [showAddModal, setShowAddModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [selectedStore, setSelectedStore] = useState<Store | null>(null)
  const [formData, setFormData] = useState<StoreFormData>({
    name: '',
    address: '',
    brandLogos: '',
    imageUrl: ''
  })
  const [formError, setFormError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [imageFile, setImageFile] = useState<File | null>(null)

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
    setFormData({ name: '', address: '', brandLogos: '', imageUrl: '' })
    setFormError(null)
    setImageFile(null)
    setShowAddModal(true)
  }

  const handleEditStore = (store: Store) => {
    setSelectedStore(store)
    setFormData({
      name: store.name,
      address: store.address,
      brandLogos: store.brandLogos.join(', '),
      imageUrl: store.imageUrl || ''
    })
    setFormError(null)
    setImageFile(null)
    setShowEditModal(true)
  }

  const handleDeleteStore = (store: Store) => {
    setSelectedStore(store)
    setFormError(null)
    setShowDeleteModal(true)
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        setFormError('Please select a valid image file')
        return
      }
      // Validate file size (10MB limit)
      if (file.size > 10 * 1024 * 1024) {
        setFormError('Image file must be less than 10MB')
        return
      }
      setImageFile(file)
      setFormError(null)
    }
  }

  const uploadStoreImage = async (storeId: string): Promise<string | null> => {
    if (!imageFile) return null

    try {
      const formData = new FormData()
      formData.append('image', imageFile)

      const response = await fetch(`/api/stores/${storeId}/image`, {
        method: 'POST',
        body: formData
      })

      if (!response.ok) {
        console.error('Failed to upload store image')
        return null
      }

      const data = await response.json()
      return data.imageUrl
    } catch (err) {
      console.error('Error uploading store image:', err)
      return null
    }
  }

  const handleSubmitAdd = async (e: React.FormEvent) => {
    e.preventDefault()
    setFormError(null)
    setSubmitting(true)

    try {
      // Validate form
      if (!formData.name.trim()) {
        setFormError('Store name is required')
        setSubmitting(false)
        return
      }
      if (!formData.address.trim()) {
        setFormError('Store address is required')
        setSubmitting(false)
        return
      }

      // Create store
      const response = await fetch('/api/stores', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name.trim(),
          address: formData.address.trim(),
          brandLogos: formData.brandLogos
            .split(',')
            .map(logo => logo.trim())
            .filter(logo => logo.length > 0),
          imageUrl: formData.imageUrl || null
        })
      })

      if (!response.ok) {
        const data = await response.json()
        setFormError(data.error || 'Failed to create store')
        setSubmitting(false)
        return
      }

      const newStore = await response.json()

      // Upload image if provided
      if (imageFile) {
        const imageUrl = await uploadStoreImage(newStore.id)
        if (imageUrl) {
          newStore.imageUrl = imageUrl
        }
      }

      setShowAddModal(false)
      fetchStores()
    } catch (err) {
      setFormError('An error occurred while creating the store')
      console.error(err)
    } finally {
      setSubmitting(false)
    }
  }

  const handleSubmitEdit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedStore) return

    setFormError(null)
    setSubmitting(true)

    try {
      // Validate form
      if (!formData.name.trim()) {
        setFormError('Store name is required')
        setSubmitting(false)
        return
      }
      if (!formData.address.trim()) {
        setFormError('Store address is required')
        setSubmitting(false)
        return
      }

      // Upload image first if provided
      let imageUrl = formData.imageUrl
      if (imageFile) {
        const uploadedUrl = await uploadStoreImage(selectedStore.id)
        if (uploadedUrl) {
          imageUrl = uploadedUrl
        }
      }

      // Update store
      const response = await fetch(`/api/stores/${selectedStore.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name.trim(),
          address: formData.address.trim(),
          brandLogos: formData.brandLogos
            .split(',')
            .map(logo => logo.trim())
            .filter(logo => logo.length > 0),
          imageUrl: imageUrl || null
        })
      })

      if (!response.ok) {
        const data = await response.json()
        setFormError(data.error || 'Failed to update store')
        setSubmitting(false)
        return
      }

      setShowEditModal(false)
      fetchStores()
    } catch (err) {
      setFormError('An error occurred while updating the store')
      console.error(err)
    } finally {
      setSubmitting(false)
    }
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

        {/* Stores Table */}
        <div className="bg-white shadow-sm rounded-lg overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Address
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Brand Logos
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Image
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider w-32">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {stores.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-4 text-center text-gray-500">
                    No stores found
                  </td>
                </tr>
              ) : (
                stores.map(store => (
                  <tr key={store.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {store.name}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500 max-w-xs truncate">
                      {store.address}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500 max-w-xs truncate">
                      {store.brandLogos.join(', ') || 'None'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {store.imageUrl ? (
                        <span className="text-green-600">✓ Yes</span>
                      ) : (
                        <span className="text-gray-400">No</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end gap-3">
                        <button
                          onClick={() => handleEditStore(store)}
                          className="text-blue-600 hover:text-blue-900 font-medium"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteStore(store)}
                          className="text-red-600 hover:text-red-900 font-medium"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Store Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h2 className="text-xl font-bold mb-4">Add New Store</h2>
            {formError && (
              <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-3 py-2 rounded text-sm">
                {formError}
              </div>
            )}
            <form onSubmit={handleSubmitAdd}>
              <div className="mb-4">
                <label htmlFor="add-store-name" className="block text-sm font-medium text-gray-700 mb-1">
                  Store Name *
                </label>
                <input
                  id="add-store-name"
                  type="text"
                  value={formData.name}
                  onChange={e => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div className="mb-4">
                <label htmlFor="add-store-address" className="block text-sm font-medium text-gray-700 mb-1">
                  Address *
                </label>
                <input
                  id="add-store-address"
                  type="text"
                  value={formData.address}
                  onChange={e => setFormData({ ...formData, address: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div className="mb-4">
                <label htmlFor="add-store-logos" className="block text-sm font-medium text-gray-700 mb-1">
                  Brand Logos (comma-separated)
                </label>
                <input
                  id="add-store-logos"
                  type="text"
                  value={formData.brandLogos}
                  onChange={e => setFormData({ ...formData, brandLogos: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g., Honda, Toyota, Ford"
                />
              </div>
              <div className="mb-4">
                <label htmlFor="add-store-image" className="block text-sm font-medium text-gray-700 mb-1">
                  Store Image
                </label>
                <input
                  id="add-store-image"
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                {imageFile && (
                  <p className="mt-1 text-sm text-gray-500">Selected: {imageFile.name}</p>
                )}
              </div>
              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                  disabled={submitting}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:opacity-50"
                  disabled={submitting}
                >
                  {submitting ? 'Creating...' : 'Create Store'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Store Modal */}
      {showEditModal && selectedStore && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h2 className="text-xl font-bold mb-4">Edit Store</h2>
            {formError && (
              <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-3 py-2 rounded text-sm">
                {formError}
              </div>
            )}
            <form onSubmit={handleSubmitEdit}>
              <div className="mb-4">
                <label htmlFor="edit-store-name" className="block text-sm font-medium text-gray-700 mb-1">
                  Store Name *
                </label>
                <input
                  id="edit-store-name"
                  type="text"
                  value={formData.name}
                  onChange={e => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div className="mb-4">
                <label htmlFor="edit-store-address" className="block text-sm font-medium text-gray-700 mb-1">
                  Address *
                </label>
                <input
                  id="edit-store-address"
                  type="text"
                  value={formData.address}
                  onChange={e => setFormData({ ...formData, address: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div className="mb-4">
                <label htmlFor="edit-store-logos" className="block text-sm font-medium text-gray-700 mb-1">
                  Brand Logos (comma-separated)
                </label>
                <input
                  id="edit-store-logos"
                  type="text"
                  value={formData.brandLogos}
                  onChange={e => setFormData({ ...formData, brandLogos: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g., Honda, Toyota, Ford"
                />
              </div>
              <div className="mb-4">
                <label htmlFor="edit-store-image" className="block text-sm font-medium text-gray-700 mb-1">
                  Store Image
                </label>
                <input
                  id="edit-store-image"
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                {imageFile && (
                  <p className="mt-1 text-sm text-gray-500">Selected: {imageFile.name}</p>
                )}
                {!imageFile && formData.imageUrl && (
                  <p className="mt-1 text-sm text-gray-500">Current image will be kept</p>
                )}
              </div>
              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowEditModal(false)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                  disabled={submitting}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:opacity-50"
                  disabled={submitting}
                >
                  {submitting ? 'Updating...' : 'Update Store'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

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
