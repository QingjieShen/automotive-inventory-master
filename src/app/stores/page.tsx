'use client'

import { useAuth } from '../../hooks/useAuth'
import { ProtectedRoute } from '../../components/auth/ProtectedRoute'
import { AdminOnly } from '../../components/auth/RoleGuard'

function StoresPageContent() {
  const { user } = useAuth()

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">
          Select Store Location
        </h1>
        <div className="bg-white rounded-lg shadow p-6">
          <p className="text-gray-600">
            Welcome, {user?.name}! ({user?.role})
          </p>
          <p className="mt-2 text-sm text-gray-500">
            Store selection functionality will be implemented in a future task.
          </p>
          
          <AdminOnly>
            <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-md">
              <p className="text-blue-700 font-medium">Admin Features Available</p>
              <p className="text-blue-600 text-sm">
                You have access to admin-only features like bulk operations and reprocessing.
              </p>
            </div>
          </AdminOnly>
        </div>
      </div>
    </div>
  )
}

export default function StoresPage() {
  return (
    <ProtectedRoute>
      <StoresPageContent />
    </ProtectedRoute>
  )
}