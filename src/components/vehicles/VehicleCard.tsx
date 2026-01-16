'use client'

import { Vehicle } from '@/types'
import { EyeIcon, PhotoIcon } from '@heroicons/react/24/outline'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'

interface VehicleCardProps {
  vehicle: Vehicle
  showCheckbox?: boolean
  isSelected?: boolean
  onSelectionChange?: (checked: boolean) => void
}

export default function VehicleCard({ 
  vehicle, 
  showCheckbox = false, 
  isSelected = false, 
  onSelectionChange 
}: VehicleCardProps) {
  const router = useRouter()
  
  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      NOT_STARTED: { variant: 'secondary' as const, text: 'Not Started' },
      IN_PROGRESS: { variant: 'warning' as const, text: 'In Progress' },
      COMPLETED: { variant: 'success' as const, text: 'Completed' },
      ERROR: { variant: 'destructive' as const, text: 'Error' }
    }

    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.NOT_STARTED

    return (
      <Badge variant={config.variant}>
        {config.text}
      </Badge>
    )
  }

  // Get the first image as thumbnail (preferably front or front quarter)
  const getThumbnail = () => {
    if (!vehicle.images || vehicle.images.length === 0) {
      return null
    }

    // Try to find front or front quarter image first
    const frontImage = vehicle.images.find(img => 
      img.imageType === 'FRONT' || img.imageType === 'FRONT_QUARTER'
    )

    const thumbnailImage = frontImage || vehicle.images[0]
    return thumbnailImage.thumbnailUrl || thumbnailImage.originalUrl
  }

  const thumbnailUrl = getThumbnail()

  return (
    <Card 
      className="hover:bg-accent/50 transition-colors duration-150"
      role="row"
    >
      <CardContent className="p-4 sm:p-6">
        {/* Mobile layout */}
        <div className="sm:hidden space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              {showCheckbox && (
                <Checkbox
                  checked={isSelected}
                  onCheckedChange={(checked) => onSelectionChange?.(checked === true)}
                  aria-label={`Select vehicle ${vehicle.stockNumber}`}
                />
              )}
              <div className="text-sm font-medium text-foreground">
                {vehicle.stockNumber}
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => router.push(`/vehicles/${vehicle.id}`)}
              title="View vehicle details"
              aria-label={`View details for vehicle ${vehicle.stockNumber}`}
            >
              <EyeIcon className="h-5 w-5" />
            </Button>
          </div>
          
          <div className="flex items-center space-x-4">
            {/* Thumbnail */}
            <div className="flex-shrink-0">
              {thumbnailUrl ? (
                <div className="relative h-12 w-16 rounded-md overflow-hidden bg-muted">
                  <Image
                    src={thumbnailUrl}
                    alt={`Vehicle ${vehicle.stockNumber}`}
                    fill
                    className="object-cover"
                    sizes="64px"
                  />
                </div>
              ) : (
                <div className="h-12 w-16 rounded-md bg-muted flex items-center justify-center">
                  <PhotoIcon className="h-6 w-6 text-muted-foreground" />
                </div>
              )}
            </div>
            
            <div className="flex-1 min-w-0">
              <div className="text-sm text-foreground">
                {vehicle.images?.length || 0} photos
              </div>
              <div className="text-sm text-muted-foreground">
                {formatDate(vehicle.createdAt)}
              </div>
            </div>
            
            <div className="flex-shrink-0">
              {getStatusBadge(vehicle.processingStatus)}
            </div>
          </div>
        </div>

        {/* Desktop layout */}
        <div className="hidden sm:grid grid-cols-12 gap-4 items-center">
          {showCheckbox && (
            <div className="col-span-1">
              <Checkbox
                checked={isSelected}
                onCheckedChange={(checked) => onSelectionChange?.(checked === true)}
                aria-label={`Select vehicle ${vehicle.stockNumber}`}
              />
            </div>
          )}
          
          {/* Stock Number */}
          <div className={showCheckbox ? "col-span-2" : "col-span-3"}>
            <div className="text-sm font-medium text-foreground">
              {vehicle.stockNumber}
            </div>
          </div>

          {/* Thumbnail */}
          <div className="col-span-2">
            <div className="flex items-center">
              {thumbnailUrl ? (
                <div className="relative h-12 w-16 rounded-md overflow-hidden bg-muted">
                  <Image
                    src={thumbnailUrl}
                    alt={`Vehicle ${vehicle.stockNumber}`}
                    fill
                    className="object-cover"
                    sizes="64px"
                  />
                </div>
              ) : (
                <div className="h-12 w-16 rounded-md bg-muted flex items-center justify-center">
                  <PhotoIcon className="h-6 w-6 text-muted-foreground" />
                </div>
              )}
            </div>
          </div>

          {/* Photo Count */}
          <div className="col-span-2">
            <div className="text-sm text-foreground">
              {vehicle.images?.length || 0} photos
            </div>
          </div>

          {/* Created Date */}
          <div className="col-span-2">
            <div className="text-sm text-muted-foreground">
              {formatDate(vehicle.createdAt)}
            </div>
          </div>

          {/* Status */}
          <div className="col-span-2">
            {getStatusBadge(vehicle.processingStatus)}
          </div>

          {/* Actions */}
          <div className="col-span-1">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => router.push(`/vehicles/${vehicle.id}`)}
              title="View vehicle details"
              aria-label={`View details for vehicle ${vehicle.stockNumber}`}
            >
              <EyeIcon className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}