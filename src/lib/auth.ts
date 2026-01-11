import { NextAuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import bcrypt from 'bcryptjs'
import { prisma } from './prisma'
import { UserRole } from '../generated/prisma'
import { getServerSession } from 'next-auth'
import { NextRequest, NextResponse } from 'next/server'

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null
        }

        try {
          const user = await prisma.user.findUnique({
            where: { email: credentials.email }
          })

          if (!user) {
            return null
          }

          const isPasswordValid = await bcrypt.compare(
            credentials.password,
            user.passwordHash
          )

          if (!isPasswordValid) {
            return null
          }

          return {
            id: user.id,
            email: user.email,
            name: user.name,
            role: user.role
          }
        } catch (error) {
          console.error('Authentication error:', error)
          return null
        }
      }
    })
  ],
  session: {
    strategy: 'jwt',
    maxAge: 24 * 60 * 60 // 24 hours
  },
  jwt: {
    maxAge: 24 * 60 * 60 // 24 hours
  },
  callbacks: {
    async jwt({ token, user }) {
      // Include role in JWT token when user signs in
      if (user) {
        token.role = user.role
        token.id = user.id
      }
      return token
    },
    async session({ session, token }) {
      // Include role and id in session from JWT token
      if (token) {
        session.user.id = token.id as string
        session.user.role = token.role as UserRole
      }
      return session
    }
  },
  pages: {
    signIn: '/login',
    error: '/login'
  },
  secret: process.env.NEXTAUTH_SECRET
}


/**
 * Middleware to require Super Admin role for API routes
 * Returns 403 Forbidden if user is not authenticated or not a Super Admin
 * Logs authorization failures for audit purposes
 */
export async function requireSuperAdmin(
  request: NextRequest,
  handler: (request: NextRequest) => Promise<NextResponse>
): Promise<NextResponse> {
  try {
    // Get the session from the request
    const session = await getServerSession(authOptions)

    // Check if user is authenticated
    if (!session || !session.user) {
      console.warn('[Auth] Unauthorized access attempt to Super Admin endpoint', {
        timestamp: new Date().toISOString(),
        path: request.nextUrl.pathname,
        method: request.method,
        reason: 'No session found'
      })

      return NextResponse.json(
        { error: 'Unauthorized: Authentication required' },
        { status: 401 }
      )
    }

    // Check if user has Super Admin role
    if (session.user.role !== 'SUPER_ADMIN') {
      console.warn('[Auth] Forbidden access attempt to Super Admin endpoint', {
        timestamp: new Date().toISOString(),
        path: request.nextUrl.pathname,
        method: request.method,
        userId: session.user.id,
        userEmail: session.user.email,
        userRole: session.user.role,
        reason: 'Insufficient permissions'
      })

      return NextResponse.json(
        { error: 'Forbidden: Super Admin access required' },
        { status: 403 }
      )
    }

    // User is authenticated and has Super Admin role
    console.info('[Auth] Super Admin access granted', {
      timestamp: new Date().toISOString(),
      path: request.nextUrl.pathname,
      method: request.method,
      userId: session.user.id,
      userEmail: session.user.email
    })

    // Call the handler with the request
    return await handler(request)
  } catch (error) {
    console.error('[Auth] Error in requireSuperAdmin middleware', {
      timestamp: new Date().toISOString(),
      path: request.nextUrl.pathname,
      method: request.method,
      error: error instanceof Error ? error.message : 'Unknown error'
    })

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
