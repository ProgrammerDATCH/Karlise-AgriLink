// components/marketplace/add-to-cart-button.tsx
'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { ShoppingCart, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/lib/providers/auth-context'

interface AddToCartButtonProps {
  productId: string
  productName: string
  maxQuantity: number
  quantity?: number
  variant?: "default" | "outline" | "secondary"
  size?: "default" | "sm" | "lg" | "icon"
  className?: string
}

export default function AddToCartButton({
  productId,
  productName,
  maxQuantity,
  quantity = 1,
  variant = "default",
  size = "default",
  className = "bg-green-600 hover:bg-green-700"
}: AddToCartButtonProps) {
  const router = useRouter()
  const { isAuthenticated } = useAuth()
  const [isLoading, setIsLoading] = useState(false)
  
  const addToCart = async () => {
    if (!isAuthenticated) {
      toast.error('Please sign in to add items to your cart', {
        action: {
          label: 'Sign In',
          onClick: () => router.push(`/auth/login?redirect=/marketplace/products/${productId}`),
        },
      })
      return
    }
    
    if (maxQuantity < 1) {
      toast.error(`${productName} is out of stock`)
      return
    }
    
    if (quantity > maxQuantity) {
      toast.error(`Only ${maxQuantity} units available`)
      return
    }
    
    setIsLoading(true)
    
    try {
      const response = await fetch('/api/cart', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          productId,
          quantity,
        }),
      })
      
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || 'Failed to add item to cart')
      }
      
      toast.success(`${productName} added to cart`, {
        action: {
          label: 'View Cart',
          onClick: () => router.push('/marketplace/cart'),
        },
      })
    } catch (error) {
      console.error('Error adding to cart:', error)
      toast.error(error instanceof Error ? error.message : 'Failed to add item to cart')
    } finally {
      setIsLoading(false)
    }
  }
  
  return (
    <Button
      variant={variant}
      size={size}
      className={className}
      onClick={addToCart}
      disabled={isLoading || maxQuantity < 1}
    >
      {isLoading ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Adding...
        </>
      ) : (
        <>
          <ShoppingCart className="mr-2 h-4 w-4" />
          Add to Cart
        </>
      )}
    </Button>
  )
}