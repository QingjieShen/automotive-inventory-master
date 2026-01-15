'use client'

import { useState } from 'react'
import { signIn, getSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)

    try {
      const result = await signIn('credentials', {
        email,
        password,
        redirect: false
      })

      if (result?.error) {
        setError('Invalid email or password')
      } else {
        // Get the session to check if login was successful
        const session = await getSession()
        if (session) {
          router.push('/stores')
        }
      }
    } catch (error) {
      setError('An error occurred during login')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full space-y-8">
        <div className="bg-white rounded-lg shadow-xl p-6 sm:p-8">
          {/* MMG Logo */}
          <div className="text-center mb-6 sm:mb-8">
            <div className="mx-auto h-12 sm:h-16 w-auto flex items-center justify-center">
              <div className="text-2xl sm:text-3xl font-bold text-blue-600" aria-label="MMG Logo">
                MMG
              </div>
            </div>
            <h1 className="mt-4 text-xl sm:text-2xl font-bold text-gray-900">
              Vehicle Inventory Tool
            </h1>
            <p className="mt-2 text-sm text-gray-600">
              Sign in to your account
            </p>
          </div>

          {/* Login Form */}
          <form className="space-y-6" onSubmit={handleSubmit} noValidate>
            {error && (
              <div 
                className="bg-destructive/10 border border-destructive/30 text-destructive px-4 py-3 rounded-md text-sm"
                role="alert"
                aria-live="polite"
                id="login-error"
              >
                {error}
              </div>
            )}

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email address
              </label>
              <Input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1"
                placeholder="Enter your email"
                aria-describedby={error ? "login-error" : undefined}
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <Input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-1"
                placeholder="Enter your password"
                aria-describedby={error ? "login-error" : undefined}
              />
            </div>

            <div>
              <Button
                type="submit"
                disabled={isLoading}
                className="w-full"
                aria-describedby={isLoading ? "loading-status" : undefined}
              >
                {isLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" aria-hidden="true" />
                    <span>Signing in...</span>
                    <span className="sr-only" id="loading-status">Please wait, signing you in</span>
                  </>
                ) : (
                  'Sign in'
                )}
              </Button>
            </div>
          </form>

          {/* Footer */}
          <div className="mt-6 sm:mt-8 text-center">
            <p className="text-xs text-gray-500">
              © 2024 Mark Motors Group. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}