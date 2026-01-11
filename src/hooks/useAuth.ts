'use client'

import { useSession } from 'next-auth/react'
import { UserRole } from '../generated/prisma'

export function useAuth() {
  const { data: session, status } = useSession()

  const isLoading = status === 'loading'
  const isAuthenticated = !!session
  const user = session?.user

  const hasRole = (role: UserRole) => {
    return user?.role === role
  }

  const hasAnyRole = (roles: UserRole[]) => {
    return user ? roles.includes(user.role) : false
  }

  const isAdmin = hasRole('ADMIN')
  const isPhotographer = hasRole('PHOTOGRAPHER')
  const isSuperAdmin = hasRole('SUPER_ADMIN')

  return {
    session,
    user,
    isLoading,
    isAuthenticated,
    isAdmin,
    isPhotographer,
    isSuperAdmin,
    hasRole,
    hasAnyRole,
  }
}