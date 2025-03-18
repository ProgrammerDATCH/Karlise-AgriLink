// app/marketplace/cart/page.tsx
'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { 
  ShoppingCart, 
  Minus, 
  Plus, 
  Trash2, 
  ChevronLeft, 
  CheckCircle, 
  AlertTriangle,
  Loader2
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Input } from '@/components/ui/input'
import { Separator } from '@/components/ui/separator'
import { formatPrice } from '@/lib/utils'
import { useAuth } from '@/lib/providers/auth-context'

// Define type for cart item
interface CartItem {
  id: string
  productId: string
  product: {
    id: string
    name: string
    price: number
    unit: string
    quantity: number
    images: string
    farmer: {
      id: string
      user: {
        name: string
      }
    }
  }
  quantity: number
}

export default function CartPage() {
  const router = useRouter()
  const { user, isAuthenticated } = useAuth()
  const [cartItems, setCartItems] = useState<CartItem[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isUpdating, setIsUpdating] = useState(false)
  const [isCheckingOut, setIsCheckingOut] = useState(false)
  
  // Calculate cart totals
  const subtotal = cartItems.reduce((total, item) => {
    return total + (item.product.price * item.quantity)
  }, 0)
  
  const deliveryFee = 2500 // Fixed delivery fee of 2,500 RWF
  const total = subtotal + deliveryFee
  
  // Fetch cart items on component mount
  useEffect(() => {
    const fetchCartItems = async () => {
      if (!isAuthenticated) {
        setIsLoading(false)
        return
      }
      
      try {
        const response = await fetch('/api/cart')
        
        if (!response.ok) {
          throw new Error('Failed to fetch cart items')
        }
        
        const data = await response.json()
        setCartItems(data.cartItems)
      } catch (error) {
        console.error('Error fetching cart:', error)
        toast.error('Failed to load your cart')
      } finally {
        setIsLoading(false)
      }
    }
    
    fetchCartItems()
  }, [isAuthenticated])
  
  // Update cart item quantity
  const updateCartItemQuantity = async (itemId: string, newQuantity: number) => {
    if (newQuantity < 1) return
    
    const item = cartItems.find(item => item.id === itemId)
    if (!item) return
    
    // Check if quantity is available
    if (newQuantity > item.product.quantity) {
      toast.error(`Only ${item.product.quantity} units available`)
      return
    }
    
    setIsUpdating(true)
    
    try {
      const response = await fetch(`/api/cart/${itemId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ quantity: newQuantity }),
      })
      
      if (!response.ok) {
        throw new Error('Failed to update cart')
      }
      
      // Update local state
      setCartItems(prevItems => 
        prevItems.map(item => 
          item.id === itemId 
            ? { ...item, quantity: newQuantity } 
            : item
        )
      )
      
      toast.success('Cart updated')
    } catch (error) {
      console.error('Error updating cart:', error)
      toast.error('Failed to update cart')
    } finally {
      setIsUpdating(false)
    }
  }
  
  // Remove item from cart
  const removeCartItem = async (itemId: string) => {
    setIsUpdating(true)
    
    try {
      const response = await fetch(`/api/cart/${itemId}`, {
        method: 'DELETE',
      })
      
      if (!response.ok) {
        throw new Error('Failed to remove item')
      }
      
      // Update local state
      setCartItems(prevItems => prevItems.filter(item => item.id !== itemId))
      
      toast.success('Item removed from cart')
    } catch (error) {
      console.error('Error removing item:', error)
      toast.error('Failed to remove item')
    } finally {
      setIsUpdating(false)
    }
  }
  
  // Proceed to checkout
  const handleCheckout = async () => {
    if (!isAuthenticated) {
      router.push('/auth/login?redirect=/marketplace/cart')
      return
    }
    
    if (cartItems.length === 0) {
      toast.error('Your cart is empty')
      return
    }
    
    setIsCheckingOut(true)
    
    try {
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          deliveryFee,
          items: cartItems.map(item => ({
            productId: item.productId,
            quantity: item.quantity,
            price: item.product.price,
          })),
        }),
      })
      
      if (!response.ok) {
        throw new Error('Failed to create order')
      }
      
      const data = await response.json()
      
      // Clear cart after successful checkout
      await fetch('/api/cart/clear', { method: 'POST' })
      
      // Redirect to order confirmation page
      router.push(`/dashboard/${user?.role?.toLowerCase() || 'buyer'}/orders/${data.orderId}`)
      
      toast.success('Order placed successfully')
    } catch (error) {
      console.error('Error creating order:', error)
      toast.error('Failed to place order')
    } finally {
      setIsCheckingOut(false)
    }
  }
  
  // Render loading state
  if (isLoading) {
    return (
      <div className="container py-12 flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-green-600 mx-auto mb-6" />
          <h2 className="text-2xl font-bold">Loading your cart...</h2>
        </div>
      </div>
    )
  }
  
  // Render login prompt if not authenticated
  if (!isAuthenticated) {
    return (
      <div className="container py-12">
        <h1 className="text-3xl font-bold mb-8 flex items-center">
          <ShoppingCart className="mr-3 h-8 w-8" />
          Your Cart
        </h1>
        
        <Card className="mb-8">
          <CardContent className="pt-6 pb-6 flex flex-col items-center justify-center text-center space-y-4 min-h-[200px]">
            <AlertTriangle className="h-12 w-12 text-yellow-500 mb-2" />
            <h2 className="text-xl font-bold">Please log in to view your cart</h2>
            <p className="text-gray-500 dark:text-gray-400 max-w-md">
              You need to be logged in to view your cart and checkout. Please sign in or create an account to continue shopping.
            </p>
            <div className="flex flex-col sm:flex-row gap-2 mt-4">
              <Button asChild className="bg-green-600 hover:bg-green-700">
                <Link href="/auth/login?redirect=/marketplace/cart">
                  Sign In
                </Link>
              </Button>
              <Button asChild variant="outline">
                <Link href="/auth/register?redirect=/marketplace/cart">
                  Create Account
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }
  
  // Render empty cart
  if (cartItems.length === 0) {
    return (
      <div className="container py-12">
        <h1 className="text-3xl font-bold mb-8 flex items-center">
          <ShoppingCart className="mr-3 h-8 w-8" />
          Your Cart
        </h1>
        
        <Card className="mb-8">
          <CardContent className="pt-6 pb-6 flex flex-col items-center justify-center text-center space-y-4 min-h-[300px]">
            <div className="relative h-24 w-24 mb-4">
              <Image
                src="/images/empty-cart.svg"
                alt="Empty Cart"
                fill
                className="object-contain"
              />
            </div>
            <h2 className="text-xl font-bold">Your cart is empty</h2>
            <p className="text-gray-500 dark:text-gray-400 max-w-md">
              Looks like you haven't added any products to your cart yet. Explore our marketplace to find quality agricultural products.
            </p>
            <Button asChild className="mt-4 bg-green-600 hover:bg-green-700">
              <Link href="/marketplace/products">
                Browse Products
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }
  
  // Render cart with items
  return (
    <div className="container py-12">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold flex items-center">
          <ShoppingCart className="mr-3 h-8 w-8" />
          Your Cart
        </h1>
        <Button asChild variant="outline" size="sm">
          <Link href="/marketplace/products" className="flex items-center">
            <ChevronLeft className="mr-1 h-4 w-4" />
            Continue Shopping
          </Link>
        </Button>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Items ({cartItems.length})</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Product</TableHead>
                    <TableHead className="text-right">Price</TableHead>
                    <TableHead className="text-center">Quantity</TableHead>
                    <TableHead className="text-right">Subtotal</TableHead>
                    <TableHead className="w-[50px]"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {cartItems.map((item) => {
                    const itemImage = item.product.images ? item.product.images.split(',')[0] : null;
                    return (
                      <TableRow key={item.id}>
                        <TableCell>
                          <div className="flex items-center space-x-3">
                            <div className="relative h-16 w-16 rounded-md overflow-hidden">
                              {itemImage ? (
                                <Image
                                  src={itemImage}
                                  alt={item.product.name}
                                  fill
                                  className="object-cover"
                                />
                              ) : (
                                <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                                  <span className="text-gray-400">No image</span>
                                </div>
                              )}
                            </div>
                            <div>
                              <p className="font-medium">{item.product.name}</p>
                              <p className="text-sm text-gray-500">
                                Seller: {item.product.farmer.user.name}
                              </p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="text-right whitespace-nowrap">
                          {formatPrice(item.product.price)} / {item.product.unit}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center justify-center">
                            <Button
                              variant="outline"
                              size="icon"
                              className="h-8 w-8"
                              onClick={() => updateCartItemQuantity(item.id, item.quantity - 1)}
                              disabled={isUpdating || item.quantity <= 1}
                            >
                              <Minus className="h-4 w-4" />
                            </Button>
                            <span className="w-12 text-center">{item.quantity}</span>
                            <Button
                              variant="outline"
                              size="icon"
                              className="h-8 w-8"
                              onClick={() => updateCartItemQuantity(item.id, item.quantity + 1)}
                              disabled={isUpdating || item.quantity >= item.product.quantity}
                            >
                              <Plus className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                        <TableCell className="text-right font-medium whitespace-nowrap">
                          {formatPrice(item.product.price * item.quantity)}
                        </TableCell>
                        <TableCell>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => removeCartItem(item.id)}
                            disabled={isUpdating}
                          >
                            <Trash2 className="h-4 w-4 text-red-500" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    )
                  })}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
        
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-gray-500">Subtotal</span>
                  <span className="font-medium">{formatPrice(subtotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Delivery Fee</span>
                  <span className="font-medium">{formatPrice(deliveryFee)}</span>
                </div>
                <Separator />
                <div className="flex justify-between text-lg font-bold">
                  <span>Total</span>
                  <span>{formatPrice(total)}</span>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex flex-col space-y-4">
              <Button 
                className="w-full bg-green-600 hover:bg-green-700"
                onClick={handleCheckout}
                disabled={isCheckingOut || cartItems.length === 0}
              >
                {isCheckingOut ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    <CheckCircle className="mr-2 h-4 w-4" />
                    Checkout
                  </>
                )}
              </Button>
              <p className="text-xs text-center text-gray-500">
                By proceeding to checkout, you agree to our{' '}
                <Link href="/terms" className="text-green-600 hover:underline">Terms of Service</Link>{' '}
                and{' '}
                <Link href="/privacy" className="text-green-600 hover:underline">Privacy Policy</Link>.
              </p>
            </CardFooter>
          </Card>
          
          <div className="mt-6">
            <h3 className="text-lg font-medium mb-4">Need Help?</h3>
            <div className="space-y-4 text-sm">
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <span>Free delivery for orders over 50,000 RWF</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <span>Quality guarantee on all products</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <span>Secure payment processing</span>
              </div>
              <Link href="/contact" className="text-green-600 hover:underline block mt-4">
                Contact our support team
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}