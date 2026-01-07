'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { Store } from '../../types'

interface StoreContextType {
  selectedStore: Store | null
  setSelectedStore: (store: Store | null) => void
  isLoading: boolean
  clearSelectedStore: () => void
}

const StoreContext = createContext<StoreContextType | undefined>(undefined)

interface StoreProviderProps {
  children: ReactNode
}

export function StoreProvider({ children }: StoreProviderProps) {
  const [selectedStore, setSelectedStoreState] = useState<Store | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  // Load selected store from localStorage on mount
  useEffect(() => {
    const savedStore = localStorage.getItem('selectedStore')
    if (savedStore) {
      try {
        const store = JSON.parse(savedStore)
        setSelectedStoreState(store)
      } catch (error) {
        console.error('Error parsing saved store:', error)
        localStorage.removeItem('selectedStore')
      }
    }
    setIsLoading(false)
  }, [])

  const setSelectedStore = (store: Store | null) => {
    setSelectedStoreState(store)
    
    if (store) {
      localStorage.setItem('selectedStore', JSON.stringify(store))
    } else {
      localStorage.removeItem('selectedStore')
    }
  }

  const clearSelectedStore = () => {
    setSelectedStore(null)
  }

  const value: StoreContextType = {
    selectedStore,
    setSelectedStore,
    isLoading,
    clearSelectedStore
  }

  return (
    <StoreContext.Provider value={value}>
      {children}
    </StoreContext.Provider>
  )
}

export function useStore() {
  const context = useContext(StoreContext)
  if (context === undefined) {
    throw new Error('useStore must be used within a StoreProvider')
  }
  return context
}