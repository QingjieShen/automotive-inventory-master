import { Card, CardHeader, CardContent, CardFooter } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'

export function StoreCardSkeleton() {
  return (
    <Card
      className="p-4 sm:p-6 min-h-[280px]"
      style={{
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      }}
    >
      <div className="flex flex-col h-full">
        {/* Store Name skeleton */}
        <CardHeader className="p-0 mb-2">
          <Skeleton className="h-7 w-48 bg-white/30" />
        </CardHeader>
        
        {/* Address skeleton */}
        <CardContent className="p-0 mb-4 flex-grow">
          <Skeleton className="h-4 w-full bg-white/30 mb-2" />
          <Skeleton className="h-4 w-3/4 bg-white/30" />
        </CardContent>
        
        {/* Brand Logos skeleton */}
        <div className="flex flex-wrap gap-2 mt-auto">
          <Skeleton className="h-6 w-16 rounded-full bg-white/30" />
          <Skeleton className="h-6 w-20 rounded-full bg-white/30" />
          <Skeleton className="h-6 w-16 rounded-full bg-white/30" />
        </div>
        
        {/* Select Button skeleton */}
        <CardFooter className="p-0 mt-4 pt-4 border-t border-white/30">
          <Skeleton className="h-10 w-full rounded-md bg-white/30" />
        </CardFooter>
      </div>
    </Card>
  )
}
