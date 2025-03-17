'use client'

import React, { createContext, useContext, useState, useEffect } from 'react'
import { User } from '@prisma/client'
import { useRouter } from 'next/navigation'
import { login, register, logout, getCurrentUser, LoginCredentials, RegisterData, AuthResult } from '@/lib/auth-service'

type AuthContextType = {
  user: Partial<User> | null
  isLoading: boolean
  isAuthenticated: boolean
  login: (credentials: LoginCredentials) => Promise<AuthResult>
  register: (data: RegisterData) => Promise<AuthResult>
  logout: () => Promise<boolean>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

// Auth token handling functions (client-side only)
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

// User data handling functions (client-side only)
const setUserData = (user: Partial<User>): void => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('user_data', JSON.stringify(user))
  }
}

const getUserData = (): Partial<User> | null => {
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
  const [user, setUser] = useState<Partial<User> | null>(null)
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
        } else {
          // If not in localStorage, try to get from API
          const currentUser = await getCurrentUser()
          if (currentUser) {
            setUser(currentUser)
            setUserData(currentUser)
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

  const handleLogin = async (credentials: LoginCredentials): Promise<AuthResult> => {
    setIsLoading(true)
    try {
      const result = await login(credentials)
      if (result.success && result.user && result.token) {
        setUser(result.user)
        
        // Save to localStorage
        setAuthToken(result.token)
        setUserData(result.user)
      }
      return result
    } catch (error) {
      console.error('Login error:', error)
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  const handleRegister = async (data: RegisterData): Promise<AuthResult> => {
    setIsLoading(true)
    try {
      const result = await register(data)
      // Don't automatically log in after registration
      // The user should verify email first or go through login
      return result
    } catch (error) {
      console.error('Registration error:', error)
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  const handleLogout = async (): Promise<boolean> => {
    setIsLoading(true)
    try {
      const success = await logout()
      if (success) {
        // Clear user state and localStorage
        setUser(null)
        removeAuthToken()
        removeUserData()
        
        // Redirect to home page
        router.push('/')
      }
      return success
    } catch (error) {
      console.error('Logout error:', error)
      throw error
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
        login: handleLogin,
        register: handleRegister,
        logout: handleLogout,
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