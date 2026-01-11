'use client'

import { useRouter } from 'next/navigation'
import { Store } from '@/types'
import { useState } from 'react'
import { useAuth } from '@/hooks/useAuth'

interface NavigationBannerProps {
  currentStore?: Store
  showBackToStores?: boolean
  onBackToStores?: () => void
}

export default function NavigationBanner({
  currentStore,
  showBackToStores = true,
  onBackToStores
}: NavigationBannerProps) {
  const router = useRouter()
  const { isSuperAdmin } = useAuth()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const handleBackToStores = () => {
    if (onBackToStores) {
      onBackToStores()
    } else {
      router.push('/stores')
    }
  }

  const handleManageStores = () => {
    router.push('/admin/stores')
    setIsMobileMenuOpen(false)
  }

  const handleAccount = () => {
    router.push('/account')
    setIsMobileMenuOpen(false)
  }

  return (
    <nav 
      className="fixed top-0 left-0 right-0 z-50 h-16 bg-white border-b border-gray-200 shadow-sm"
      role="navigation"
      aria-label="Main navigation"
    >
      <div className="h-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-full">
          {/* Logo */}
          <div className="flex-shrink-0">
            <div className="text-xl font-bold text-gray-900">
              MMG
            </div>
          </div>

          {/* Store Name - Desktop */}
          {currentStore && (
            <div className="hidden md:block flex-1 text-center">
              <h1 className="text-lg font-semibold text-gray-900">
                {currentStore.name}
              </h1>
            </div>
          )}

          {/* Navigation Actions - Desktop */}
          <div className="hidden md:flex items-center gap-3">
            {/* Account Link */}
            <button
              onClick={handleAccount}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
              aria-label="Account settings"
            >
              Account
            </button>

            {/* Manage Stores Link - Super Admin Only */}
            {isSuperAdmin && (
              <button
                onClick={handleManageStores}
                className="px-4 py-2 text-sm font-medium text-blue-700 bg-blue-50 border border-blue-300 rounded-md hover:bg-blue-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                aria-label="Manage stores"
              >
                Manage Stores
              </button>
            )}

            {/* Back to Stores Button */}
            {showBackToStores && (
              <button
                onClick={handleBackToStores}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                aria-label="Back to store selection"
              >
                Back to Stores
              </button>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 rounded-md text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
              aria-expanded={isMobileMenuOpen}
              aria-label="Toggle navigation menu"
            >
              <svg
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                {isMobileMenuOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-t border-gray-200 bg-white">
          <div className="px-4 py-3 space-y-3">
            {currentStore && (
              <div className="text-center py-2">
                <p className="text-sm font-semibold text-gray-900">
                  {currentStore.name}
                </p>
              </div>
            )}
            {/* Account Link */}
            <button
              onClick={handleAccount}
              className="w-full px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
              aria-label="Account settings"
            >
              Account
            </button>
            {/* Manage Stores Link - Super Admin Only */}
            {isSuperAdmin && (
              <button
                onClick={handleManageStores}
                className="w-full px-4 py-2 text-sm font-medium text-blue-700 bg-blue-50 border border-blue-300 rounded-md hover:bg-blue-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                aria-label="Manage stores"
              >
                Manage Stores
              </button>
            )}
            {showBackToStores && (
              <button
                onClick={() => {
                  handleBackToStores()
                  setIsMobileMenuOpen(false)
                }}
                className="w-full px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                aria-label="Back to store selection"
              >
                Back to Stores
              </button>
            )}
          </div>
        </div>
      )}
    </nav>
  )
}
