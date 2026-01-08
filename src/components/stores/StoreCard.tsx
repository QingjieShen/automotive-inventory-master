import { Store } from '../../types'

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

  return (
    <div
      onClick={() => onSelect(store)}
      onKeyDown={handleKeyDown}
      className="bg-white rounded-lg shadow-md hover:shadow-lg transition-all duration-200 cursor-pointer border border-gray-200 hover:border-blue-300 p-4 sm:p-6 focus-within:ring-2 focus-within:ring-blue-500 focus-within:ring-offset-2"
      role="gridcell"
      tabIndex={0}
      aria-label={`Select ${store.name} store`}
    >
      <div className="flex flex-col h-full">
        {/* Store Name */}
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          {store.name}
        </h3>
        
        {/* Address */}
        <p className="text-sm text-gray-600 mb-4 flex-grow">
          {store.address}
        </p>
        
        {/* Brand Logos */}
        <div className="flex flex-wrap gap-2 mt-auto" aria-label="Available brands">
          {store.brandLogos.map((logo, index) => (
            <div
              key={index}
              className="px-2 py-1 bg-gray-100 rounded text-xs text-gray-700 font-medium"
            >
              {logo.replace('-logo.png', '').toUpperCase()}
            </div>
          ))}
        </div>
        
        {/* Select Button */}
        <div className="mt-4 pt-4 border-t border-gray-100">
          <button 
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors duration-200 font-medium"
            onClick={(e) => {
              e.stopPropagation()
              onSelect(store)
            }}
            aria-label={`Select ${store.name} store`}
          >
            Select Store
          </button>
        </div>
      </div>
    </div>
  )
}