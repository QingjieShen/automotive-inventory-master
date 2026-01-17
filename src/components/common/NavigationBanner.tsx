'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'
import ThemeToggle from './ThemeToggle'
import { Button } from '@/components/ui/button'
import { Menu, X } from 'lucide-react'

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
      className="fixed top-0 left-0 right-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60"
      role="navigation"
      aria-label="Main navigation"
    >
      <div className="container flex h-16 items-center">
        {/* Logo */}
        <div className="mr-4 flex">
          <div className="text-xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
            MMG
          </div>
        </div>

        {/* Navigation Links - Desktop */}
        <div className="flex flex-1 items-center justify-end space-x-2">
          <nav className="hidden md:flex items-center space-x-2">
            <Button
              variant="ghost"
              onClick={handleStores}
              aria-label="Stores"
            >
              Stores
            </Button>
            <Button
              variant="ghost"
              onClick={handleAccount}
              aria-label="Account"
            >
              Account
            </Button>
            <ThemeToggle />
          </nav>

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-expanded={isMobileMenuOpen}
            aria-label="Toggle navigation menu"
          >
            {isMobileMenuOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </Button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-t">
          <div className="container py-4 space-y-2">
            <Button
              variant="ghost"
              className="w-full justify-start"
              onClick={handleStores}
              aria-label="Stores"
            >
              Stores
            </Button>
            <Button
              variant="ghost"
              className="w-full justify-start"
              onClick={handleAccount}
              aria-label="Account"
            >
              Account
            </Button>
            <div className="flex justify-center pt-2">
              <ThemeToggle />
            </div>
          </div>
        </div>
      )}
    </nav>
  )
}
