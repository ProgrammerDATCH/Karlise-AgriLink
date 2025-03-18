// app/dashboard/page.tsx
'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/providers/auth-context'
import FarmerDashboard from '@/components/dashboard/FarmerDashboard'
import { Loader2 } from 'lucide-react'

export default function DashboardPage() {
  const { user, isLoading, isAuthenticated } = useAuth()
  const router = useRouter()
  
  // Redirect based on user role when authenticated
  useEffect(() => {
    if (!isLoading && isAuthenticated && user) {
      // If role-specific dashboard is accessed directly, redirect to the main dashboard
      if (user.role === 'FARMER') {
        router.push('/dashboard/farmer')
      } else if (user.role === 'BUYER') {
        router.push('/dashboard/buyer')
      } else if (user.role === 'PROCESSOR') {
        router.push('/dashboard/processor')
      } else if (user.role === 'SUPPLIER') {
        router.push('/dashboard/supplier')
      }
    } else if (!isLoading && !isAuthenticated) {
      // If not authenticated, redirect to login
      router.push('/auth/login')
    }
  }, [user, isLoading, isAuthenticated, router])
  
  // Show loading state while checking authentication
  if (isLoading || !user) {
    return (
      <div className="flex items-center justify-center h-[80vh]">
        <div className="flex flex-col items-center">
          <Loader2 className="h-8 w-8 animate-spin text-green-600 mb-4" />
          <p className="text-lg">Loading your dashboard...</p>
        </div>
      </div>
    )
  }
  
  // This should not normally render as the useEffect should redirect
  return (
    <div className="container py-8">
      <h1 className="text-3xl font-bold mb-6">Dashboard</h1>
      <p>Redirecting to your role-specific dashboard...</p>
    </div>
  )
}