'use client'

import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useStore } from '@/components/providers/StoreProvider'
import { Vehicle, PaginatedResponse } from '@/types'
import VehicleList from '@/components/vehicles/VehicleList'
import VehicleHeader from '@/components/vehicles/VehicleHeader'
import { LoadingSpinner } from '@/components/common'
import NavigationBanner from '@/components/common/NavigationBanner'

export default function VehiclesPage() {
  const { data: session, status } = useSession()
  const { selectedStore } = useStore()
  const router = useRouter()
  const [vehicles, setVehicles] = useState<Vehicle[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalCount: 0
  })
  const [searchTerm, setSearchTerm] = useState('')
  const [sortBy, setSortBy] = useState('stockNumber')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc')

  useEffect(() => {
    if (status === 'loading') return

    if (!session) {
      router.push('/login')
      return
    }

    if (!selectedStore) {
      router.push('/stores')
      return
    }
  }, [session, status, selectedStore, router])

  const fetchVehicles = async (page = 1, search = searchTerm, sort = sortBy, order = sortOrder) => {
    if (!selectedStore) return

    try {
      setLoading(true)
      setError(null)

      const params = new URLSearchParams({
        storeId: selectedStore.id,
        page: page.toString(),
        limit: '10',
        search,
        sortBy: sort,
        sortOrder: order
      })

      const response = await fetch(`/api/vehicles?${params}`)
      
      if (!response.ok) {
        throw new Error('Failed to fetch vehicles')
      }

      const data: PaginatedResponse<Vehicle> = await response.json()
      
      setVehicles(data.data)
      setPagination({
        currentPage: data.currentPage,
        totalPages: data.totalPages,
        totalCount: data.totalCount
      })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (selectedStore) {
      fetchVehicles()
    }
  }, [selectedStore])

  const handleSearch = (term: string) => {
    setSearchTerm(term)
    fetchVehicles(1, term, sortBy, sortOrder)
  }

  const handleSort = (field: string) => {
    const newOrder = field === sortBy && sortOrder === 'asc' ? 'desc' : 'asc'
    setSortBy(field)
    setSortOrder(newOrder)
    fetchVehicles(pagination.currentPage, searchTerm, field, newOrder)
  }

  const handlePageChange = (page: number) => {
    fetchVehicles(page, searchTerm, sortBy, sortOrder)
  }

  const handleVehicleAdded = () => {
    // Refresh the vehicle list when a new vehicle is added
    fetchVehicles(pagination.currentPage, searchTerm, sortBy, sortOrder)
  }

  const handleVehiclesDeleted = async () => {
    // Refresh the vehicle list after vehicles are deleted
    await fetchVehicles(pagination.currentPage, searchTerm, sortBy, sortOrder)
  }

  if (status === 'loading' || !selectedStore) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" text="Loading..." />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <NavigationBanner />
      
      {/* Add padding-top to account for fixed navigation banner */}
      <div className="pt-16">
        <VehicleHeader
          storeName={selectedStore.name}
          onSearch={handleSearch}
          searchTerm={searchTerm}
          onVehicleAdded={handleVehicleAdded}
        />
        
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {error && (
            <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-md">
              <p className="text-red-800">{error}</p>
            </div>
          )}

          <VehicleList
            vehicles={vehicles}
            loading={loading}
            pagination={pagination}
            sortBy={sortBy}
            sortOrder={sortOrder}
            onSort={handleSort}
            onPageChange={handlePageChange}
            onVehiclesDeleted={handleVehiclesDeleted}
          />
        </main>
      </div>
    </div>
  )
}