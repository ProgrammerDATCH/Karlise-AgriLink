// lib/providers/auth-context.tsx
'use client'

import React, { createContext, useContext, useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'

// Types
type AuthUser = {
  id: string
  name: string
  email: string
  role: string
  image?: string | null
}

type LoginCredentials = {
  email: string
  password: string
  rememberMe?: boolean
}

type RegisterData = {
  name: string
  email: string
  phone: string
  password: string
  role: 'FARMER' | 'BUYER' | 'PROCESSOR' | 'SUPPLIER'
}

type AuthContextType = {
  user: AuthUser | null
  isLoading: boolean
  isAuthenticated: boolean
  login: (credentials: LoginCredentials) => Promise<boolean>
  register: (data: RegisterData) => Promise<boolean>
  logout: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

// Auth token handling functions
const getAuthToken = (): string | null => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('auth_token')
  }
  return null
}

const setAuthToken = (token: string): void => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('auth_token', token)
  }
}

const removeAuthToken = (): void => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('auth_token')
  }
}

// User data handling functions
const setUserData = (user: AuthUser): void => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('user_data', JSON.stringify(user))
  }
}

const getUserData = (): AuthUser | null => {
  if (typeof window !== 'undefined') {
    const userData = localStorage.getItem('user_data')
    if (userData) {
      try {
        return JSON.parse(userData)
      } catch (e) {
        console.error('Failed to parse user data from localStorage', e)
      }
    }
  }
  return null
}

const removeUserData = (): void => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('user_data')
  }
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const router = useRouter()

  // Initialize auth state from localStorage on mount
  useEffect(() => {
    const initAuth = async () => {
      setIsLoading(true)
      try {
        // First try to get user from localStorage
        const userData = getUserData()
        const token = getAuthToken()
        
        if (userData && token) {
          // User is logged in from localStorage
          setUser(userData)
          
          // Verify token with backend
          try {
            const response = await fetch('/api/auth/verify', {
              headers: {
                Authorization: `Bearer ${token}`
              }
            })
            
            if (!response.ok) {
              // Token is invalid, clear auth state
              removeAuthToken()
              removeUserData()
              setUser(null)
            }
          } catch (error) {
            console.error('Failed to verify token:', error)
            // Clear auth state on error
            removeAuthToken()
            removeUserData()
            setUser(null)
          }
        }
      } catch (error) {
        console.error('Failed to initialize auth state:', error)
        // Clear local storage in case of error
        removeAuthToken()
        removeUserData()
      } finally {
        setIsLoading(false)
      }
    }

    initAuth()
  }, [])

  const login = async (credentials: LoginCredentials): Promise<boolean> => {
    setIsLoading(true)
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
      })
      
      const data = await response.json()
      
      if (!response.ok) {
        throw new Error(data.message || 'Login failed')
      }
      
      if (data.token && data.user) {
        // Save auth data
        setAuthToken(data.token)
        setUserData(data.user)
        setUser(data.user)
        
        // Show success message
        toast.success('Login successful', {
          description: `Welcome back, ${data.user.name}!`,
        })
        
        return true
      }
      
      return false
    } catch (error) {
      console.error('Login error:', error)
      toast.error('Login failed', {
        description: error instanceof Error ? error.message : 'Invalid credentials',
      })
      return false
    } finally {
      setIsLoading(false)
    }
  }

  const register = async (data: RegisterData): Promise<boolean> => {
    setIsLoading(true)
    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })
      
      const responseData = await response.json()
      
      if (!response.ok) {
        throw new Error(responseData.message || 'Registration failed')
      }
      
      toast.success('Registration successful', {
        description: 'Your account has been created. Please log in.',
      })
      
      return true
    } catch (error) {
      console.error('Registration error:', error)
      toast.error('Registration failed', {
        description: error instanceof Error ? error.message : 'Please try again',
      })
      return false
    } finally {
      setIsLoading(false)
    }
  }

  const logout = async (): Promise<void> => {
    setIsLoading(true)
    try {
      // Call logout API
      await fetch('/api/auth/logout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${getAuthToken()}`,
        },
      })
      
      // Clear auth state regardless of API response
      removeAuthToken()
      removeUserData()
      setUser(null)
      
      // Show success message
      toast.success('Logged out successfully')
      
      // Redirect to home page
      router.push('/')
    } catch (error) {
      console.error('Logout error:', error)
      // Still clear auth state on error
      removeAuthToken()
      removeUserData()
      setUser(null)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <AuthContext.Provider 
      value={{
        user,
        isLoading,
        isAuthenticated: !!user,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}