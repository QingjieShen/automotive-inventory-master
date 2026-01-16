'use client'

import { Card, CardContent } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'

interface VehicleCardSkeletonProps {
  showCheckbox?: boolean
}

export default function VehicleCardSkeleton({ showCheckbox = false }: VehicleCardSkeletonProps) {
  return (
    <Card>
      <CardContent className="p-4 sm:p-6">
        {/* Mobile layout */}
        <div className="sm:hidden space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              {showCheckbox && (
                <Skeleton className="h-4 w-4 rounded" />
              )}
              <Skeleton className="h-5 w-24" />
            </div>
            <Skeleton className="h-10 w-10 rounded-md" />
          </div>
          
          <div className="flex items-center space-x-4">
            {/* Thumbnail skeleton */}
            <Skeleton className="h-12 w-16 rounded-md flex-shrink-0" />
            
            <div className="flex-1 min-w-0 space-y-2">
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-4 w-24" />
            </div>
            
            <Skeleton className="h-6 w-20 rounded-full flex-shrink-0" />
          </div>
        </div>

        {/* Desktop layout */}
        <div className="hidden sm:grid grid-cols-12 gap-4 items-center">
          {showCheckbox && (
            <div className="col-span-1">
              <Skeleton className="h-4 w-4 rounded" />
            </div>
          )}
          
          {/* Stock Number skeleton */}
          <div className={showCheckbox ? "col-span-2" : "col-span-3"}>
            <Skeleton className="h-5 w-24" />
          </div>

          {/* Thumbnail skeleton */}
          <div className="col-span-2">
            <Skeleton className="h-12 w-16 rounded-md" />
          </div>

          {/* Photo Count skeleton */}
          <div className="col-span-2">
            <Skeleton className="h-4 w-16" />
          </div>

          {/* Created Date skeleton */}
          <div className="col-span-2">
            <Skeleton className="h-4 w-24" />
          </div>

          {/* Status skeleton */}
          <div className="col-span-2">
            <Skeleton className="h-6 w-20 rounded-full" />
          </div>

          {/* Actions skeleton */}
          <div className="col-span-1">
            <Skeleton className="h-10 w-10 rounded-md" />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
