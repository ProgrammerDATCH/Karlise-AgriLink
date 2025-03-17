// src/lib/auth-service.ts
import { User } from '@prisma/client'

// Types
export type LoginCredentials = {
  email: string
  password: string
  rememberMe?: boolean
}

export type RegisterData = {
  name: string
  email: string
  phone: string
  password: string
  role: 'FARMER' | 'BUYER' | 'PROCESSOR' | 'SUPPLIER'
}

export type AuthResult = {
  success: boolean
  user?: Partial<User>
  token?: string
  message?: string
}

/**
 * Login service function
 * Makes an API call to the backend for authentication
 */
export async function login(credentials: LoginCredentials): Promise<AuthResult> {
  try {
    const response = await fetch('/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: credentials.email,
        password: credentials.password,
      }),
    })

    const data = await response.json()
    
    if (!response.ok) {
      return {
        success: false,
        message: data.message || 'Login failed',
      }
    }
    
    return data
  } catch (error) {
    console.error('Login API error:', error)
    return {
      success: false,
      message: 'An error occurred during login. Please try again.',
    }
  }
}

/**
 * Register service function
 * Makes an API call to the backend for user registration
 */
export async function register(data: RegisterData): Promise<AuthResult> {
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
      return {
        success: false,
        message: responseData.message || 'Registration failed',
      }
    }
    
    return responseData
  } catch (error) {
    console.error('Registration API error:', error)
    return {
      success: false,
      message: 'An error occurred during registration. Please try again.',
    }
  }
}

/**
 * Logout service function
 * Makes an API call to the backend to logout the user
 */
export async function logout(): Promise<boolean> {
  try {
    const token = localStorage.getItem('auth_token')
    
    const response = await fetch('/api/auth/logout', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    })

    const data = await response.json()
    return data.success || false
  } catch (error) {
    console.error('Logout API error:', error)
    return false
  }
}

/**
 * Get current user function
 * Verifies the JWT token and gets user data from the backend
 */
export async function getCurrentUser(): Promise<Partial<User> | null> {
  try {
    const token = localStorage.getItem('auth_token')
    
    if (!token) {
      return null
    }
    
    const response = await fetch('/api/auth/me', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    })

    const data = await response.json()
    
    if (!response.ok || !data.success) {
      // Token is invalid or expired
      localStorage.removeItem('auth_token')
      localStorage.removeItem('user_data')
      return null
    }
    
    return data.user
  } catch (error) {
    console.error('Get current user API error:', error)
    return null
  }
}

// Utility function to get auth headers for authenticated API requests
export function getAuthHeaders(): { Authorization: string } | undefined {
  const token = localStorage.getItem('auth_token')
  return token ? { Authorization: `Bearer ${token}` } : undefined
}