'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'
import ThemeToggle from './ThemeToggle'

export default function NavigationBanner() {
  const router = useRouter()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const handleStores = () => {
    router.push('/stores')
    setIsMobileMenuOpen(false)
  }

  const handleAccount = () => {
    router.push('/account')
    setIsMobileMenuOpen(false)
  }

  return (
    <nav 
      className="fixed top-0 left-0 right-0 z-50 h-16 bg-card border-b shadow-sm"
      role="navigation"
      aria-label="Main navigation"
    >
      <div className="h-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-full">
          {/* Logo */}
          <div className="flex-shrink-0">
            <div className="text-xl font-bold">
              MMG
            </div>
          </div>

          {/* Navigation Links - Desktop */}
          <div className="hidden md:flex items-center gap-4">
            <button
              onClick={handleStores}
              className="px-4 py-2 text-sm font-medium hover:bg-accent rounded-md transition-colors"
              aria-label="Stores"
            >
              Stores
            </button>
            <button
              onClick={handleAccount}
              className="px-4 py-2 text-sm font-medium hover:bg-accent rounded-md transition-colors"
              aria-label="Account"
            >
              Account
            </button>
            <ThemeToggle />
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 rounded-md hover:bg-accent focus:outline-none focus:ring-2 focus:ring-inset focus:ring-ring"
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
        <div className="md:hidden border-t bg-card">
          <div className="px-4 py-3 space-y-3">
            <button
              onClick={handleStores}
              className="w-full px-4 py-2 text-sm font-medium hover:bg-accent rounded-md transition-colors text-left"
              aria-label="Stores"
            >
              Stores
            </button>
            <button
              onClick={handleAccount}
              className="w-full px-4 py-2 text-sm font-medium hover:bg-accent rounded-md transition-colors text-left"
              aria-label="Account"
            >
              Account
            </button>
            <div className="flex justify-center pt-2">
              <ThemeToggle />
            </div>
          </div>
        </div>
      )}
    </nav>
  )
}
