'use client'

import { useSession, signOut } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { useStore } from '@/components/providers/StoreProvider'
import NavigationBanner from '@/components/common/NavigationBanner'
import { LoadingSpinner } from '@/components/common'
import { ProtectedRoute } from '@/components/auth/ProtectedRoute'
import { 
  UserCircleIcon, 
  EnvelopeIcon, 
  ShieldCheckIcon,
  ArrowRightOnRectangleIcon,
  BuildingStorefrontIcon
} from '@heroicons/react/24/outline'

export default function AccountPage() {
  return (
    <ProtectedRoute>
      <AccountContent />
    </ProtectedRoute>
  )
}

function AccountContent() {
  const router = useRouter()
  const { data: session, status } = useSession()
  const { selectedStore } = useStore()
  const [isLoggingOut, setIsLoggingOut] = useState(false)

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login')
    }
  }, [status, router])

  const handleLogout = async () => {
    setIsLoggingOut(true)
    try {
      await signOut({ 
        callbackUrl: '/login',
        redirect: true 
      })
    } catch (error) {
      console.error('Logout error:', error)
      setIsLoggingOut(false)
    }
  }

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'SUPER_ADMIN':
        return 'bg-purple-100 text-purple-800 border-purple-200'
      case 'ADMIN':
        return 'bg-blue-100 text-blue-800 border-blue-200'
      case 'PHOTOGRAPHER':
        return 'bg-green-100 text-green-800 border-green-200'
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const getRoleDisplayName = (role: string) => {
    switch (role) {
      case 'SUPER_ADMIN':
        return 'Super Admin'
      case 'ADMIN':
        return 'Admin'
      case 'PHOTOGRAPHER':
        return 'Photographer'
      default:
        return role
    }
  }

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" text="Loading..." />
      </div>
    )
  }

  if (!session) {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <NavigationBanner />
      
      {/* Add padding-top to account for fixed navigation banner */}
      <div className="pt-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Page Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">
              Account Settings
            </h1>
            <p className="mt-2 text-sm text-gray-600">
              Manage your account information and preferences
            </p>
          </div>

          {/* Profile Card */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden mb-6">
            {/* Header with gradient */}
            <div className="bg-gradient-to-r from-blue-500 to-blue-600 px-6 py-8">
              <div className="flex items-center">
                <div className="bg-white rounded-full p-3">
                  <UserCircleIcon className="h-16 w-16 text-blue-600" />
                </div>
                <div className="ml-6">
                  <h2 className="text-2xl font-bold text-white">
                    {session.user.name}
                  </h2>
                  <p className="text-blue-100 mt-1">
                    {session.user.email}
                  </p>
                </div>
              </div>
            </div>

            {/* Profile Details */}
            <div className="px-6 py-6 space-y-6">
              {/* Email */}
              <div className="flex items-start">
                <EnvelopeIcon className="h-6 w-6 text-gray-400 mt-0.5" />
                <div className="ml-4 flex-1">
                  <p className="text-sm font-medium text-gray-700">Email Address</p>
                  <p className="text-base text-gray-900 mt-1">{session.user.email}</p>
                </div>
              </div>

              {/* Role */}
              <div className="flex items-start">
                <ShieldCheckIcon className="h-6 w-6 text-gray-400 mt-0.5" />
                <div className="ml-4 flex-1">
                  <p className="text-sm font-medium text-gray-700">Role</p>
                  <div className="mt-2">
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${getRoleBadgeColor(session.user.role)}`}>
                      {getRoleDisplayName(session.user.role)}
                    </span>
                  </div>
                  <p className="text-sm text-gray-500 mt-2">
                    {session.user.role === 'SUPER_ADMIN' && 'Full system access including store management'}
                    {session.user.role === 'ADMIN' && 'Can manage vehicles, delete, and reprocess images'}
                    {session.user.role === 'PHOTOGRAPHER' && 'Can upload and manage vehicle photos'}
                  </p>
                </div>
              </div>

              {/* User ID (for debugging/support) */}
              <div className="flex items-start pt-4 border-t border-gray-200">
                <div className="ml-4 flex-1">
                  <p className="text-xs font-medium text-gray-500">User ID</p>
                  <p className="text-xs text-gray-400 mt-1 font-mono">{session.user.id}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Actions Card */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Account Actions
            </h3>

            <div className="space-y-3">
              {/* Logout Button */}
              <button
                onClick={handleLogout}
                disabled={isLoggingOut}
                className="w-full flex items-center justify-between px-4 py-3 bg-red-50 border border-red-200 rounded-lg hover:bg-red-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed group"
              >
                <div className="flex items-center">
                  <ArrowRightOnRectangleIcon className="h-5 w-5 text-red-600 group-hover:text-red-700" />
                  <span className="ml-3 text-sm font-medium text-red-700 group-hover:text-red-800">
                    {isLoggingOut ? 'Logging out...' : 'Log Out'}
                  </span>
                </div>
                {isLoggingOut && (
                  <LoadingSpinner size="sm" />
                )}
              </button>

              {/* Back to Stores */}
              <button
                onClick={() => router.push('/stores')}
                className="w-full flex items-center justify-between px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg hover:bg-gray-100 transition-colors group"
              >
                <div className="flex items-center">
                  <BuildingStorefrontIcon className="h-5 w-5 text-gray-600 group-hover:text-gray-700" />
                  <span className="ml-3 text-sm font-medium text-gray-700 group-hover:text-gray-800">
                    Back to Stores
                  </span>
                </div>
              </button>
            </div>
          </div>

          {/* Info Card */}
          <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-sm text-blue-800">
              <strong>Need help?</strong> Contact your system administrator if you need to change your role or access additional features.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
