'use client'

import { useSession } from 'next-auth/react'
import { ReactNode } from 'react'
import { UserRole } from '../../generated/prisma'

interface RoleGuardProps {
  children: ReactNode
  allowedRoles: UserRole[]
  fallback?: ReactNode
}

export function RoleGuard({ children, allowedRoles, fallback }: RoleGuardProps) {
  const { data: session, status } = useSession()

  // Don't render anything while loading
  if (status === 'loading') {
    return null
  }

  // Don't render if no session
  if (!session) {
    return null
  }

  // Check if user's role is in the allowed roles
  const hasPermission = allowedRoles.includes(session.user.role)

  if (!hasPermission) {
    return (
      fallback || (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
          You don't have permission to access this feature.
        </div>
      )
    )
  }

  return <>{children}</>
}

// Convenience components for specific roles
export function AdminOnly({ children, fallback }: { children: ReactNode; fallback?: ReactNode }) {
  return (
    <RoleGuard allowedRoles={['ADMIN']} fallback={fallback}>
      {children}
    </RoleGuard>
  )
}

export function PhotographerOnly({ children, fallback }: { children: ReactNode; fallback?: ReactNode }) {
  return (
    <RoleGuard allowedRoles={['PHOTOGRAPHER']} fallback={fallback}>
      {children}
    </RoleGuard>
  )
}

export function AuthenticatedOnly({ children, fallback }: { children: ReactNode; fallback?: ReactNode }) {
  return (
    <RoleGuard allowedRoles={['ADMIN', 'PHOTOGRAPHER']} fallback={fallback}>
      {children}
    </RoleGuard>
  )
}