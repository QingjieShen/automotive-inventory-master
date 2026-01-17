'use client'

import { useRouter } from 'next/navigation'
import { Search, Plus } from 'lucide-react'
import { useStore } from '@/components/providers/StoreProvider'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

interface VehicleHeaderProps {
  storeName: string
  onSearch: (term: string) => void
  searchTerm: string
  onVehicleAdded: () => void
}

export default function VehicleHeader({ 
  storeName, 
  onSearch, 
  searchTerm
}: VehicleHeaderProps) {
  const router = useRouter()
  const { selectedStore } = useStore()

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onSearch(e.target.value)
  }

  const handleAddVehicleClick = () => {
    if (selectedStore) {
      router.push(`/vehicles/new?storeId=${selectedStore.id}`)
    }
  }

  return (
    <header className="border-b">
      <div className="container">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 py-6">
          <div className="space-y-1">
            <h1 className="text-3xl font-bold tracking-tight">
              Vehicle Inventory
            </h1>
            <p className="text-muted-foreground">
              {storeName}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full sm:w-auto">
            {/* Search */}
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search by stock number..."
                value={searchTerm}
                onChange={handleSearchChange}
                className="pl-9"
              />
            </div>

            {/* Add Vehicle Button */}
            <Button
              onClick={handleAddVehicleClick}
              className="w-full sm:w-auto"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Vehicle
            </Button>
          </div>
        </div>
      </div>
    </header>
  )
}