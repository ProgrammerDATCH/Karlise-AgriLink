// app/not-found.tsx
'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default function NotFound() {
  return (
    <div className="container flex items-center justify-center min-h-[80vh]">
      <div className="text-center space-y-6">
        <h1 className="text-6xl font-bold">404</h1>
        <h2 className="text-3xl font-semibold">Page Not Found</h2>
        <p className="text-gray-600 dark:text-gray-400 max-w-md mx-auto">
          Sorry, the page you are looking for doesn't exist or has been moved.
        </p>
        <Button asChild className="bg-green-600 hover:bg-green-700">
          <Link href="/">
            Return to Home
          </Link>
        </Button>
      </div>
    </div>
  )
}