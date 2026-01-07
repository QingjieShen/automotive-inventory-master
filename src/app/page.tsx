'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { useStore } from '../components/providers/StoreProvider'

export default function Home() {
  const { data: session, status } = useSession()
  const { selectedStore, isLoading: storeLoading } = useStore()
  const router = useRouter()

  useEffect(() => {
    if (status === 'loading' || storeLoading) return // Still loading

    if (!session) {
      router.push('/login')
      return
    }

    // If user is authenticated but no store is selected, go to store selection
    if (!selectedStore) {
      router.push('/stores')
      return
    }

    // If user is authenticated and has a store selected, go to vehicle inventory
    // TODO: Uncomment when vehicle inventory page is implemented
    // router.push('/vehicles')
    
    // For now, redirect to stores page
    router.push('/stores')
  }, [session, status, selectedStore, storeLoading, router])

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-lg">Redirecting...</div>
    </div>
  )
}
