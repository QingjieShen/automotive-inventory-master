'use client'

import { useState, useEffect } from 'react'
import { Store } from '../../types'
import { StoreCard } from './StoreCard'
import { StoreCardSkeleton } from './StoreCardSkeleton'

interface StoreGridProps {
  onStoreSelect: (store: Store) => void
}

export function StoreGrid({ onStoreSelect }: StoreGridProps) {
  const [stores, setStores] = useState<Store[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

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
      
      const storesData = await response.json()
      setStores(storesData)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div 
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6"
        role="grid"
        aria-label="Loading stores"
      >
        <StoreCardSkeleton />
        <StoreCardSkeleton />
        <StoreCardSkeleton />
      </div>
    )
  }

  if (error) {
    return (
      <div 
        className="bg-red-50 border border-red-200 rounded-md p-4"
        role="alert"
        aria-live="polite"
      >
        <div className="flex">
          <div className="ml-3">
            <h3 className="text-sm font-medium text-red-800">
              Error loading stores
            </h3>
            <div className="mt-2 text-sm text-red-700">
              <p>{error}</p>
            </div>
            <div className="mt-4">
              <button
                onClick={fetchStores}
                className="bg-red-100 px-3 py-2 rounded-md text-sm font-medium text-red-800 hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-colors duration-200"
              >
                Try again
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div 
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6"
      role="grid"
      aria-label="Store selection grid"
    >
      {stores.map((store) => (
        <StoreCard
          key={store.id}
          store={store}
          onSelect={onStoreSelect}
        />
      ))}
    </div>
  )
}