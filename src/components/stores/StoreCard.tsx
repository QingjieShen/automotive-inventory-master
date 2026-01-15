import { Store } from '../../types'
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

interface StoreCardProps {
  store: Store
  onSelect: (store: Store) => void
}

export function StoreCard({ store, onSelect }: StoreCardProps) {
  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      onSelect(store)
    }
  }

  // Determine background style based on imageUrl availability
  const backgroundStyle = store.imageUrl
    ? {
        backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.5)), url(${store.imageUrl})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }
    : {
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      }

  return (
    <Card
      onClick={() => onSelect(store)}
      onKeyDown={handleKeyDown}
      className="hover:shadow-lg transition-all duration-200 cursor-pointer hover:border-blue-300 p-4 sm:p-6 min-h-[280px]"
      style={backgroundStyle}
      role="gridcell"
      tabIndex={0}
      aria-label={`Select ${store.name} store`}
    >
      <div className="flex flex-col h-full">
        {/* Store Name */}
        <CardHeader className="p-0 mb-2">
          <CardTitle className="text-lg text-white" style={{ textShadow: '2px 2px 4px rgba(0, 0, 0, 0.8)' }}>
            {store.name}
          </CardTitle>
        </CardHeader>
        
        {/* Address */}
        <CardContent className="p-0 mb-4 flex-grow">
          <p className="text-sm text-white" style={{ textShadow: '1px 1px 3px rgba(0, 0, 0, 0.8)' }}>
            {store.address}
          </p>
        </CardContent>
        
        {/* Brand Logos */}
        <div className="flex flex-wrap gap-2 mt-auto" aria-label="Available brands">
          {store.brandLogos.map((logo, index) => (
            <Badge
              key={index}
              variant="secondary"
              className="bg-white/90 text-gray-800 hover:bg-white/80"
            >
              {logo.replace('-logo.png', '').toUpperCase()}
            </Badge>
          ))}
        </div>
        
        {/* Select Button */}
        <CardFooter className="p-0 mt-4 pt-4 border-t border-white/30">
          <Button 
            className="w-full"
            onClick={(e) => {
              e.stopPropagation()
              onSelect(store)
            }}
            aria-label={`Select ${store.name} store`}
          >
            Select Store
          </Button>
        </CardFooter>
      </div>
    </Card>
  )
}