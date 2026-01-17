'use client'

import { useSession, signOut } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { useStore } from '@/components/providers/StoreProvider'
import NavigationBanner from '@/components/common/NavigationBanner'
import { LoadingSpinner } from '@/components/common'
import { ProtectedRoute } from '@/components/auth/ProtectedRoute'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  User, 
  Mail, 
  Shield,
  LogOut,
  Store
} from 'lucide-react'

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

  const getRoleBadgeVariant = (role: string) => {
    switch (role) {
      case 'SUPER_ADMIN':
        return 'default' as const
      case 'ADMIN':
        return 'secondary' as const
      case 'PHOTOGRAPHER':
        return 'success' as const
      default:
        return 'secondary' as const
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

  const getRoleDescription = (role: string) => {
    switch (role) {
      case 'SUPER_ADMIN':
        return 'Full system access including store management'
      case 'ADMIN':
        return 'Can manage vehicles, delete, and reprocess images'
      case 'PHOTOGRAPHER':
        return 'Can upload and manage vehicle photos'
      default:
        return ''
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
    <div className="min-h-screen">
      <NavigationBanner />
      
      <div className="pt-16">
        <div className="container max-w-4xl py-8">
          {/* Page Header */}
          <div className="mb-8 space-y-1">
            <h1 className="text-3xl font-bold tracking-tight">
              Account Settings
            </h1>
            <p className="text-muted-foreground">
              Manage your account information and preferences
            </p>
          </div>

          {/* Profile Card */}
          <Card className="mb-6">
            {/* Header with gradient */}
            <div className="bg-gradient-to-r from-primary to-primary/60 px-6 py-8 rounded-t-lg">
              <div className="flex items-center">
                <div className="bg-background rounded-full p-3">
                  <User className="h-12 w-12 text-primary" />
                </div>
                <div className="ml-6">
                  <h2 className="text-2xl font-bold text-primary-foreground">
                    {session.user.name}
                  </h2>
                  <p className="text-primary-foreground/80 mt-1">
                    {session.user.email}
                  </p>
                </div>
              </div>
            </div>

            {/* Profile Details */}
            <CardContent className="pt-6 space-y-6">
              {/* Email */}
              <div className="flex items-start gap-4">
                <Mail className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div className="flex-1 space-y-1">
                  <p className="text-sm font-medium">Email Address</p>
                  <p className="text-sm text-muted-foreground">{session.user.email}</p>
                </div>
              </div>

              {/* Role */}
              <div className="flex items-start gap-4">
                <Shield className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div className="flex-1 space-y-2">
                  <p className="text-sm font-medium">Role</p>
                  <Badge variant={getRoleBadgeVariant(session.user.role)}>
                    {getRoleDisplayName(session.user.role)}
                  </Badge>
                  <p className="text-sm text-muted-foreground">
                    {getRoleDescription(session.user.role)}
                  </p>
                </div>
              </div>

              {/* User ID (for debugging/support) */}
              <div className="pt-4 border-t">
                <p className="text-xs font-medium text-muted-foreground">User ID</p>
                <p className="text-xs text-muted-foreground/60 mt-1 font-mono">{session.user.id}</p>
              </div>
            </CardContent>
          </Card>

          {/* Actions Card */}
          <Card>
            <CardHeader>
              <CardTitle>Account Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {/* Back to Stores */}
              <Button
                variant="outline"
                className="w-full justify-start"
                onClick={() => router.push('/stores')}
              >
                <Store className="h-4 w-4 mr-2" />
                Back to Stores
              </Button>

              {/* Logout Button */}
              <Button
                variant="destructive"
                className="w-full justify-start"
                onClick={handleLogout}
                disabled={isLoggingOut}
              >
                <LogOut className="h-4 w-4 mr-2" />
                {isLoggingOut ? 'Logging out...' : 'Log Out'}
              </Button>
            </CardContent>
          </Card>

          {/* Info Card */}
          <Card className="mt-6 border-primary/20 bg-primary/5">
            <CardContent className="pt-6">
              <p className="text-sm">
                <strong>Need help?</strong> Contact your system administrator if you need to change your role or access additional features.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
