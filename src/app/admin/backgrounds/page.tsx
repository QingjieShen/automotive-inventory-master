'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { ProtectedRoute } from '../../../components/auth/ProtectedRoute'
import { RoleGuard } from '../../../components/auth/RoleGuard'
import { Store } from '../../../types'
import Image from 'next/image'
import NavigationBanner from '../../../components/common/NavigationBanner'

interface StoreBackgrounds {
  id: string
  name: string
  bgFrontQuarter: string | null
  bgFront: string | null
  bgBackQuarter: string | null
  bgBack: string | null
  bgDriverSide: string | null
  bgPassengerSide: string | null
}

const IMAGE_TYPES = [
  { key: 'FRONT_QUARTER', label: 'Front Quarter', field: 'bgFrontQuarter' },
  { key: 'FRONT', label: 'Front', field: 'bgFront' },
  { key: 'BACK_QUARTER', label: 'Back Quarter', field: 'bgBackQuarter' },
  { key: 'BACK', label: 'Back', field: 'bgBack' },
  { key: 'DRIVER_SIDE', label: 'Driver Side', field: 'bgDriverSide' },
  { key: 'PASSENGER_SIDE', label: 'Passenger Side', field: 'bgPassengerSide' },
]

function BackgroundsManagementContent() {
  const router = useRouter()
  const [stores, setStores] = useState<Store[]>([])
  const [selectedStore, setSelectedStore] = useState<Store | null>(null)
  const [backgrounds, setBackgrounds] = useState<StoreBackgrounds | null>(null)
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [fileInputKey, setFileInputKey] = useState(0) // Key to force file input reset

  useEffect(() => {
    fetchStores()
  }, [])

  useEffect(() => {
    if (selectedStore) {
      fetchBackgrounds(selectedStore.id)
      setFileInputKey(prev => prev + 1) // Reset file inputs when store changes
    }
  }, [selectedStore])

  const fetchStores = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/stores')
      if (!response.ok) throw new Error('Failed to fetch stores')
      const data = await response.json()
      setStores(data)
      if (data.length > 0) {
        setSelectedStore(data[0])
      }
    } catch (err) {
      setError('Failed to load stores')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const fetchBackgrounds = async (storeId: string) => {
    try {
      const response = await fetch(`/api/stores/${storeId}/backgrounds`)
      if (!response.ok) throw new Error('Failed to fetch backgrounds')
      const data = await response.json()
      setBackgrounds(data)
    } catch (err) {
      setError('Failed to load backgrounds')
      console.error(err)
    }
  }

  const handleFileUpload = async (imageType: string, file: File) => {
    if (!selectedStore) return

    try {
      setUploading(imageType)
      setError(null)

      const formData = new FormData()
      formData.append('image', file)
      formData.append('imageType', imageType)

      const response = await fetch(`/api/stores/${selectedStore.id}/backgrounds`, {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Failed to upload image')
      }

      const data = await response.json()
      setBackgrounds(data.store)
      
      // Reset file inputs to allow re-uploading
      setFileInputKey(prev => prev + 1)
    } catch (err: any) {
      setError(err.message || 'Failed to upload image')
      console.error(err)
    } finally {
      setUploading(null)
    }
  }

  const handleRemoveBackground = async (imageType: string) => {
    if (!selectedStore) return

    if (!confirm('Are you sure you want to remove this background image?')) {
      return
    }

    try {
      setError(null)
      const response = await fetch(
        `/api/stores/${selectedStore.id}/backgrounds?imageType=${imageType}`,
        { method: 'DELETE' }
      )

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Failed to remove image')
      }

      const data = await response.json()
      setBackgrounds(data.store)
    } catch (err: any) {
      setError(err.message || 'Failed to remove image')
      console.error(err)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation Banner */}
      <NavigationBanner />
      
      {/* Add padding-top to account for fixed navigation banner */}
      <div className="pt-16">
        {/* Header */}
        <div className="bg-white shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  Key Images Background Settings
                </h1>
                <p className="mt-2 text-sm text-gray-600">
                  Customize background images for each store's key images. These backgrounds will be used for AI-powered background replacement.
                </p>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => router.push('/admin/stores')}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                >
                  Back to Store Management
                </button>
              </div>
            </div>
          </div>
        </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
            {error}
          </div>
        )}

        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Select Store
          </label>
          <select
            value={selectedStore?.id || ''}
            onChange={(e) => {
              const store = stores.find((s) => s.id === e.target.value)
              setSelectedStore(store || null)
            }}
            className="block w-full max-w-md px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          >
            {stores.map((store) => (
              <option key={store.id} value={store.id}>
                {store.name}
              </option>
            ))}
          </select>
        </div>

        {backgrounds && (
          <div className="bg-white rounded-lg shadow-sm border">
            <div className="p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-6">
                Background Images for {selectedStore?.name}
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {IMAGE_TYPES.map((type) => {
                  const imageUrl = backgrounds[type.field as keyof StoreBackgrounds] as string | null
                  const isUploading = uploading === type.key

                  return (
                    <div key={type.key} className="border rounded-lg p-4">
                      <h3 className="font-medium text-gray-900 mb-3">
                        {type.label}
                      </h3>

                      <div className="aspect-video bg-gray-100 rounded-md mb-3 relative overflow-hidden">
                        {imageUrl ? (
                          <Image
                            src={imageUrl}
                            alt={`${type.label} background`}
                            fill
                            className="object-cover"
                          />
                        ) : (
                          <div className="flex items-center justify-center h-full text-gray-400">
                            <svg
                              className="w-12 h-12"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                              />
                            </svg>
                          </div>
                        )}
                      </div>

                      <div className="space-y-2">
                        {imageUrl ? (
                          // Show current file info and change button
                          <div className="space-y-2">
                            <div className="text-sm text-gray-600 bg-gray-50 px-3 py-2 rounded-md border border-gray-200">
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                  <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                  </svg>
                                  <span className="font-medium">Current:</span>
                                </div>
                              </div>
                              <div className="mt-1 text-xs text-gray-500 truncate">
                                {imageUrl.split('/').pop()}
                              </div>
                            </div>
                            <label className="block">
                              <input
                                key={`${type.key}-${fileInputKey}`}
                                type="file"
                                accept="image/jpeg,image/jpg,image/png,image/webp"
                                onChange={(e) => {
                                  const file = e.target.files?.[0]
                                  if (file) {
                                    handleFileUpload(type.key, file)
                                  }
                                }}
                                disabled={isUploading}
                                className="block w-full text-sm text-gray-500
                                  file:mr-4 file:py-2 file:px-4
                                  file:rounded-md file:border-0
                                  file:text-sm file:font-semibold
                                  file:bg-blue-50 file:text-blue-700
                                  hover:file:bg-blue-100
                                  disabled:opacity-50 disabled:cursor-not-allowed"
                              />
                            </label>
                          </div>
                        ) : (
                          // Show upload input when no image
                          <label className="block">
                            <span className="sr-only">Choose image</span>
                            <input
                              key={`${type.key}-${fileInputKey}`}
                              type="file"
                              accept="image/jpeg,image/jpg,image/png,image/webp"
                              onChange={(e) => {
                                const file = e.target.files?.[0]
                                if (file) {
                                  handleFileUpload(type.key, file)
                                }
                              }}
                              disabled={isUploading}
                              className="block w-full text-sm text-gray-500
                                file:mr-4 file:py-2 file:px-4
                                file:rounded-md file:border-0
                                file:text-sm file:font-semibold
                                file:bg-blue-50 file:text-blue-700
                                hover:file:bg-blue-100
                                disabled:opacity-50 disabled:cursor-not-allowed"
                            />
                          </label>
                        )}

                        {imageUrl && (
                          <button
                            onClick={() => handleRemoveBackground(type.key)}
                            disabled={isUploading}
                            className="w-full px-3 py-2 text-sm font-medium text-red-700 bg-red-50 rounded-md hover:bg-red-100 disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            Remove
                          </button>
                        )}

                        {isUploading && (
                          <div className="text-sm text-blue-600 text-center">
                            Uploading...
                          </div>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>

              <div className="mt-6 p-4 bg-blue-50 rounded-md">
                <h4 className="text-sm font-medium text-blue-900 mb-2">
                  ℹ️ How it works
                </h4>
                <ul className="text-sm text-blue-800 space-y-1">
                  <li>• Upload custom background images for each key image type</li>
                  <li>• These backgrounds will be used during AI-powered image processing</li>
                  <li>• If no custom background is set, default templates will be used</li>
                  <li>• Supported formats: JPG, PNG, WebP (max 10MB)</li>
                </ul>
              </div>
            </div>
          </div>
        )}
      </div>
      </div>
    </div>
  )
}

export default function BackgroundsManagementPage() {
  return (
    <ProtectedRoute>
      <RoleGuard allowedRoles={['SUPER_ADMIN']}>
        <BackgroundsManagementContent />
      </RoleGuard>
    </ProtectedRoute>
  )
}
