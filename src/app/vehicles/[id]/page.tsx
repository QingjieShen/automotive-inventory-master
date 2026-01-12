'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { useStore } from '@/components/providers/StoreProvider'
import { Vehicle } from '@/types'
import { ArrowLeftIcon } from '@heroicons/react/24/outline'
import { ProtectedRoute } from '@/components/auth/ProtectedRoute'
import ImageGallery from '@/components/vehicles/ImageGallery'
import { LoadingSpinner } from '@/components/common'
import NavigationBanner from '@/components/common/NavigationBanner'

export default function VehicleDetailPage() {
  return (
    <ProtectedRoute>
      <VehicleDetailContent />
    </ProtectedRoute>
  )
}

function VehicleDetailContent() {
  const params = useParams()
  const router = useRouter()
  const { data: session } = useSession()
  const { selectedStore } = useStore()
  const [vehicle, setVehicle] = useState<Vehicle | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const vehicleId = params.id as string

  useEffect(() => {
    if (vehicleId) {
      fetchVehicle()
    }
  }, [vehicleId])

  const fetchVehicle = async () => {
    try {
      setLoading(true)
      const response = await fetch(`/api/vehicles/${vehicleId}`)
      
      if (!response.ok) {
        if (response.status === 404) {
          setError('Vehicle not found')
        } else {
          throw new Error('Failed to fetch vehicle')
        }
        return
      }

      const data = await response.json()
      setVehicle(data)
    } catch (err) {
      console.error('Error fetching vehicle:', err)
      setError('Failed to load vehicle details')
    } finally {
      setLoading(false)
    }
  }

  const handleBack = () => {
    router.back()
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <NavigationBanner 
          currentStore={selectedStore || undefined}
          showBackToStores={true}
        />
        <div className="pt-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-center h-64">
            <LoadingSpinner size="lg" text="Loading vehicle details..." />
          </div>
        </div>
      </div>
    )
  }

  if (error || !vehicle) {
    return (
      <div className="min-h-screen bg-gray-50">
        <NavigationBanner 
          currentStore={selectedStore || undefined}
          showBackToStores={true}
        />
        <div className="pt-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              {error || 'Vehicle not found'}
            </h2>
            <button
              onClick={handleBack}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
            >
              <ArrowLeftIcon className="h-4 w-4 mr-2" />
              Go Back
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <NavigationBanner 
        currentStore={selectedStore || undefined}
        showBackToStores={true}
      />
      
      {/* Add padding-top to account for fixed navigation banner */}
      <div className="pt-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={handleBack}
                className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <ArrowLeftIcon className="h-4 w-4 mr-2" />
                Back to Vehicles
              </button>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  Vehicle {vehicle.stockNumber}
                </h1>
                <p className="text-sm text-gray-500 mt-1">
                  {vehicle.store?.name} • Created {new Date(vehicle.createdAt).toLocaleDateString()}
                </p>
              </div>
            </div>
            
            {/* Status Badge and Edit Button */}
            <div className="flex items-center space-x-4">
              <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                vehicle.processingStatus === 'COMPLETED' 
                  ? 'bg-green-100 text-green-800'
                  : vehicle.processingStatus === 'IN_PROGRESS'
                  ? 'bg-yellow-100 text-yellow-800'
                  : vehicle.processingStatus === 'ERROR'
                  ? 'bg-red-100 text-red-800'
                  : 'bg-gray-100 text-gray-800'
              }`}>
                {vehicle.processingStatus === 'NOT_STARTED' && 'Not Started'}
                {vehicle.processingStatus === 'IN_PROGRESS' && 'In Progress'}
                {vehicle.processingStatus === 'COMPLETED' && 'Completed'}
                {vehicle.processingStatus === 'ERROR' && 'Error'}
              </span>
              <button
                onClick={() => router.push(`/vehicles/${vehicle.id}/edit`)}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Edit Vehicle
              </button>
            </div>
          </div>
        </div>

        {/* Image Gallery */}
        <ImageGallery 
          vehicle={vehicle} 
          onVehicleUpdate={setVehicle}
        />
      </div>
    </div>
  )
}