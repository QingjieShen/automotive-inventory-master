'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ProtectedRoute } from '../../../../components/auth/ProtectedRoute'
import { RoleGuard } from '../../../../components/auth/RoleGuard'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

interface StoreFormData {
  name: string
  address: string
  brandLogos: string
  imageUrl?: string
}

function AddStoreContent() {
  const router = useRouter()
  const [formData, setFormData] = useState<StoreFormData>({
    name: '',
    address: '',
    brandLogos: '',
    imageUrl: ''
  })
  const [formError, setFormError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)

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
      
      // Create preview URL
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreview(reader.result as string)
      }
      reader.readAsDataURL(file)
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

  const handleSubmit = async (e: React.FormEvent) => {
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
        await uploadStoreImage(newStore.id)
      }

      // Navigate back to stores list
      router.push('/admin/stores')
    } catch (err) {
      setFormError('An error occurred while creating the store')
      console.error(err)
      setSubmitting(false)
    }
  }

  // Generate preview background style
  const previewBackgroundStyle = imagePreview
    ? {
        backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.5)), url(${imagePreview})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }
    : {
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      }

  const brandLogosArray = formData.brandLogos
    .split(',')
    .map(logo => logo.trim())
    .filter(logo => logo.length > 0)

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Add New Store</h1>
              <p className="mt-1 text-sm text-gray-600">
                Create a new dealership location
              </p>
            </div>
            <Button
              variant="outline"
              onClick={() => router.push('/admin/stores')}
            >
              Cancel
            </Button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Form Section */}
          <div className="bg-white shadow-sm rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-6">Store Information</h2>
            
            {formError && (
              <div className="mb-4 bg-destructive/10 border border-destructive/30 text-destructive px-3 py-2 rounded text-sm" role="alert" id="store-form-error">
                {formError}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="store-name" className="block text-sm font-medium text-gray-700 mb-1">
                  Store Name *
                </label>
                <Input
                  id="store-name"
                  type="text"
                  value={formData.name}
                  onChange={e => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g., Downtown Honda"
                  required
                />
              </div>

              <div>
                <label htmlFor="store-address" className="block text-sm font-medium text-gray-700 mb-1">
                  Address *
                </label>
                <Input
                  id="store-address"
                  type="text"
                  value={formData.address}
                  onChange={e => setFormData({ ...formData, address: e.target.value })}
                  placeholder="e.g., 123 Main St, City, State 12345"
                  required
                />
              </div>

              <div>
                <label htmlFor="store-logos" className="block text-sm font-medium text-gray-700 mb-1">
                  Brand Logos (comma-separated)
                </label>
                <Input
                  id="store-logos"
                  type="text"
                  value={formData.brandLogos}
                  onChange={e => setFormData({ ...formData, brandLogos: e.target.value })}
                  placeholder="e.g., Honda, Toyota, Ford"
                />
                <p className="mt-1 text-xs text-gray-500">
                  Separate multiple brands with commas
                </p>
              </div>

              <div>
                <label htmlFor="store-image" className="block text-sm font-medium text-gray-700 mb-1">
                  Store Image
                </label>
                <Input
                  id="store-image"
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                />
                {imageFile && (
                  <p className="mt-1 text-sm text-gray-500">Selected: {imageFile.name}</p>
                )}
                <p className="mt-1 text-xs text-gray-500">
                  Maximum file size: 10MB. Supported formats: JPG, PNG, WebP
                </p>
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.push('/admin/stores')}
                  disabled={submitting}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={submitting}
                >
                  {submitting ? 'Creating...' : 'Create Store'}
                </Button>
              </div>
            </form>
          </div>

          {/* Preview Section */}
          <div className="bg-white shadow-sm rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-6">Preview</h2>
            <p className="text-sm text-gray-600 mb-4">
              This is how your store card will appear to users
            </p>
            
            {/* Store Card Preview */}
            <div
              className="rounded-lg shadow-md border border-gray-200 p-6 min-h-[320px] flex flex-col"
              style={previewBackgroundStyle}
            >
              {/* Store Name */}
              <h3 className="text-lg font-semibold text-white mb-2" style={{ textShadow: '2px 2px 4px rgba(0, 0, 0, 0.8)' }}>
                {formData.name || 'Store Name'}
              </h3>
              
              {/* Address */}
              <p className="text-sm text-white mb-4" style={{ textShadow: '1px 1px 3px rgba(0, 0, 0, 0.8)' }}>
                {formData.address || 'Store Address'}
              </p>
              
              {/* Brand Logos */}
              <div className="flex flex-wrap gap-2 mb-6">
                {brandLogosArray.length > 0 ? (
                  brandLogosArray.map((logo, index) => (
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
              
              {/* Select Button (Preview) */}
              <div className="mt-auto pt-4 border-t border-white/30">
                <div className="w-full bg-blue-600 text-white py-2 px-4 rounded-md text-center font-medium">
                  Select Store
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function AddStorePage() {
  return (
    <ProtectedRoute>
      <RoleGuard allowedRoles={['SUPER_ADMIN']}>
        <AddStoreContent />
      </RoleGuard>
    </ProtectedRoute>
  )
}
