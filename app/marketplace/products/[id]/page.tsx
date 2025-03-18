// app/marketplace/products/[id]/page.tsx
'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { 
  ArrowLeft, 
  Check, 
  Star, 
  Truck, 
  ShieldCheck, 
  Heart, 
  Share, 
  MessageCircle,
  Plus,
  Minus,
  User
} from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card'
import { Textarea } from '@/components/ui/textarea'
import { formatPrice, formatDate } from '@/lib/utils'
import { toast } from 'sonner'

// Define a type for the product with detailed info
interface ProductDetail {
  id: string
  name: string
  description: string
  price: number
  unit: string
  quantity: number
  images: string
  categoryId: string
  category: {
    id: string
    name: string
  }
  farmerId: string
  farmer: {
    id: string
    userId: string
    location: string
    rating: number
    user: {
      id: string
      name: string
      image: string
      createdAt: string
    }
  }
  quality: string
  harvestDate: string
  expiryDate: string
  isOrganic: boolean
  featured: boolean
  createdAt: string
  updatedAt: string
  reviews: {
    id: string
    userId: string
    rating: number
    comment: string
    createdAt: string
    user: {
      id: string
      name: string
      image: string
    }
  }[]
}

export default function ProductDetailPage() {
  const params = useParams()
  const productId = params.id as string

  const [product, setProduct] = useState<ProductDetail | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [mainImage, setMainImage] = useState('')
  const [quantity, setQuantity] = useState(1)
  const [activeTab, setActiveTab] = useState('details')
  const [reviewText, setReviewText] = useState('')
  const [reviewRating, setReviewRating] = useState(5)
  
  useEffect(() => {
    const fetchProductDetails = async () => {
      setIsLoading(true)
      setError(null)
      try {
        const response = await fetch(`/api/products/${productId}`)
        if (!response.ok) {
          throw new Error('Failed to fetch product details')
        }
        const data = await response.json()
        setProduct(data)
        
        // Set the main image to the first image in the array
        if (data.images) {
          setMainImage(data.images.split(',')[0])
        }
        
        // Set minimum order quantity
        setQuantity(1) // You could set this to a minimum order quantity from the product data
        
      } catch (error) {
        console.error('Error fetching product details:', error)
        setError('Failed to load product details. Please try again.')
      } finally {
        setIsLoading(false)
      }
    }

    if (productId) {
      fetchProductDetails()
    }
  }, [productId])
  
  const handleQuantityChange = (newQuantity: number) => {
    if (product && newQuantity >= 1 && newQuantity <= product.quantity) {
      setQuantity(newQuantity)
    }
  }
  
  const submitReview = async () => {
    if (!product) return
    
    try {
      const response = await fetch('/api/reviews', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          productId: product.id,
          rating: reviewRating,
          comment: reviewText,
        }),
      })
      
      if (!response.ok) {
        throw new Error('Failed to submit review')
      }
      
      toast.success('Review submitted successfully')
      setReviewText('')
      
      // Refresh product details to show the new review
      const updatedProductResponse = await fetch(`/api/products/${productId}`)
      const updatedProduct = await updatedProductResponse.json()
      setProduct(updatedProduct)
      
    } catch (error) {
      console.error('Error submitting review:', error)
      toast.error('Failed to submit review. Please try again.')
    }
  }
  
  const addToCart = async () => {
    if (!product) return
    
    try {
      const response = await fetch('/api/cart', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          productId: product.id,
          quantity,
        }),
      })
      
      if (!response.ok) {
        throw new Error('Failed to add to cart')
      }
      
      toast.success(`${product.name} added to cart`)
      
    } catch (error) {
      console.error('Error adding to cart:', error)
      toast.error('Failed to add to cart. Please try again.')
    }
  }
  
  if (isLoading) {
    return (
      <div className="container px-4 py-8 flex justify-center items-center min-h-[50vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    )
  }
  
  if (error || !product) {
    return (
      <div className="container px-4 py-8">
        <div className="text-center py-12">
          <h3 className="text-xl font-medium text-red-600">Error</h3>
          <p className="mt-2">{error || 'Product not found'}</p>
          <Button asChild className="mt-4">
            <Link href="/marketplace/products">Back to Products</Link>
          </Button>
        </div>
      </div>
    )
  }
  
  // Parse images from comma-separated string to array
  const productImages = product.images ? product.images.split(',') : []
  
  // Calculate average rating
  const avgRating = product.reviews.length > 0
    ? product.reviews.reduce((sum, review) => sum + review.rating, 0) / product.reviews.length
    : 0
  
  return (
    <main className="container px-4 py-8">
      <Link href="/marketplace/products" className="flex items-center text-green-600 mb-6">
        <ArrowLeft className="mr-1 h-4 w-4" />
        Back to products
      </Link>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        {/* Product Images */}
        <div className="space-y-4">
          <div className="relative aspect-square overflow-hidden rounded-lg border bg-background">
            {mainImage ? (
              <Image 
                src={mainImage} 
                alt={product.name}
                fill
                className="object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gray-100 dark:bg-gray-800">
                <span className="text-gray-400">No image available</span>
              </div>
            )}
            {product.isOrganic && (
              <Badge className="absolute top-3 left-3 bg-green-600">Organic</Badge>
            )}
          </div>
          {productImages.length > 0 && (
            <div className="flex space-x-2">
              {productImages.map((image, index) => (
                <div 
                  key={index}
                  className={`relative w-20 h-20 cursor-pointer rounded-md overflow-hidden border-2 ${
                    mainImage === image ? 'border-green-600' : 'border-transparent'
                  }`}
                  onClick={() => setMainImage(image)}
                >
                  <Image 
                    src={image} 
                    alt={`${product.name} - Image ${index + 1}`}
                    fill
                    className="object-cover"
                  />
                </div>
              ))}
            </div>
          )}
        </div>
        
        {/* Product Info */}
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold">{product.name}</h1>
            <div className="flex items-center mt-2 space-x-4">
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`h-4 w-4 ${
                      i < Math.floor(avgRating)
                        ? "text-yellow-500 fill-yellow-500"
                        : "text-gray-300 dark:text-gray-600"
                    }`}
                  />
                ))}
                <span className="ml-2 text-sm text-gray-600 dark:text-gray-400">
                  ({product.reviews.length} reviews)
                </span>
              </div>
              <Badge variant="outline">{product.category.name}</Badge>
            </div>
            <div className="mt-4">
              <span className="text-3xl font-bold text-green-600">
                {formatPrice(product.price)}
              </span>
              <span className="ml-2 text-gray-500">/ {product.unit}</span>
            </div>
          </div>
          
          <div className="space-y-4 border-t border-b py-4">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600 dark:text-gray-400">Available Quantity</span>
              <span className="font-medium">{product.quantity} {product.unit}</span>
            </div>
            {product.quality && (
              <div className="flex justify-between text-sm">
                <span className="text-gray-600 dark:text-gray-400">Quality</span>
                <span className="font-medium">{product.quality}</span>
              </div>
            )}
            {product.harvestDate && (
              <div className="flex justify-between text-sm">
                <span className="text-gray-600 dark:text-gray-400">Harvest Date</span>
                <span className="font-medium">{formatDate(product.harvestDate)}</span>
              </div>
            )}
            <div className="flex justify-between text-sm">
              <span className="text-gray-600 dark:text-gray-400">Seller</span>
              <Link 
                href={`/marketplace/farmers/${product.farmer.id}`}
                className="font-medium text-green-600 hover:underline"
              >
                {product.farmer.user.name}
              </Link>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600 dark:text-gray-400">Location</span>
              <span className="font-medium">{product.farmer.location}</span>
            </div>
          </div>
          
          {/* Quantity selector */}
          <div className="flex items-center space-x-4">
            <span className="text-gray-700 dark:text-gray-300">Quantity:</span>
            <div className="flex items-center border rounded-md">
              <Button 
                variant="ghost" 
                size="icon"
                onClick={() => handleQuantityChange(quantity - 1)}
                disabled={quantity <= 1}
              >
                <Minus className="h-4 w-4" />
              </Button>
              <span className="w-12 text-center">{quantity}</span>
              <Button 
                variant="ghost" 
                size="icon"
                onClick={() => handleQuantityChange(quantity + 1)}
                disabled={quantity >= product.quantity}
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            <span className="text-gray-500 text-sm">
              ({product.unit})
            </span>
          </div>
          
          {/* Total price */}
          <div className="text-lg font-semibold">
            Total: {formatPrice(product.price * quantity)}
          </div>
          
          {/* Action buttons */}
          <div className="flex flex-col sm:flex-row gap-3">
            <Button 
              className="bg-green-600 hover:bg-green-700 flex-1"
              onClick={addToCart}
            >
              Add to Cart
            </Button>
            <Button variant="outline" className="flex-1">
              Buy Now
            </Button>
            <Button variant="outline" size="icon">
              <Heart className="h-5 w-5" />
            </Button>
            <Button variant="outline" size="icon">
              <Share className="h-5 w-5" />
            </Button>
          </div>
          
          {/* Features */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-4">
            <div className="flex items-center space-x-2 text-sm">
              <ShieldCheck className="h-5 w-5 text-green-600" />
              <span>Quality Guaranteed</span>
            </div>
            <div className="flex items-center space-x-2 text-sm">
              <Truck className="h-5 w-5 text-green-600" />
              <span>Fast Delivery</span>
            </div>
            <div className="flex items-center space-x-2 text-sm">
              <Check className="h-5 w-5 text-green-600" />
              <span>Verified Farmer</span>
            </div>
          </div>
        </div>
      </div>
      
      {/* Tabs section */}
      <div className="mt-12">
        <Tabs defaultValue="details" className="w-full" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="w-full justify-start border-b rounded-none h-auto p-0">
            <TabsTrigger 
              value="details" 
              className="rounded-none data-[state=active]:border-b-2 data-[state=active]:border-green-600 data-[state=active]:text-green-600 px-4 py-2"
            >
              Details
            </TabsTrigger>
            <TabsTrigger 
              value="reviews" 
              className="rounded-none data-[state=active]:border-b-2 data-[state=active]:border-green-600 data-[state=active]:text-green-600 px-4 py-2"
            >
              Reviews ({product.reviews.length})
            </TabsTrigger>
            <TabsTrigger 
              value="seller" 
              className="rounded-none data-[state=active]:border-b-2 data-[state=active]:border-green-600 data-[state=active]:text-green-600 px-4 py-2"
            >
              Seller Info
            </TabsTrigger>
          </TabsList>
          <TabsContent value="details" className="pt-6">
            <div className="space-y-4">
              <h3 className="text-xl font-semibold">Product Description</h3>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                {product.description || 'No description available'}
              </p>
              {product.expiryDate && (
                <div className="mt-4">
                  <h4 className="font-medium">Expiry Date</h4>
                  <p>{formatDate(product.expiryDate)}</p>
                </div>
              )}
            </div>
          </TabsContent>
          <TabsContent value="reviews" className="pt-6">
            <div className="space-y-6">
              <h3 className="text-xl font-semibold">Customer Reviews</h3>
              
              {/* Review summary */}
              <div className="flex flex-col md:flex-row md:items-center gap-6 p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
                <div className="text-center">
                  <div className="text-4xl font-bold text-green-600">
                    {avgRating.toFixed(1)}
                  </div>
                  <div className="flex justify-center mt-2">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`h-4 w-4 ${
                          i < Math.floor(avgRating)
                            ? "text-yellow-500 fill-yellow-500"
                            : "text-gray-300 dark:text-gray-600"
                        }`}
                      />
                    ))}
                  </div>
                  <div className="text-sm text-gray-500 mt-1">
                    Based on {product.reviews.length} reviews
                  </div>
                </div>
              </div>
              
              {/* Write a review */}
              <Card>
                <CardHeader>
                  <CardTitle>Write a Review</CardTitle>
                  <CardDescription>
                    Share your experience with this product
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <div className="text-sm font-medium mb-1">Your Rating</div>
                      <div className="flex">
                        {[1, 2, 3, 4, 5].map((rating) => (
                          <Star
                            key={rating}
                            className={`h-6 w-6 cursor-pointer ${
                              rating <= reviewRating
                                ? "text-yellow-500 fill-yellow-500"
                                : "text-gray-300 dark:text-gray-600"
                            }`}
                            onClick={() => setReviewRating(rating)}
                          />
                        ))}
                      </div>
                    </div>
                    <div>
                      <div className="text-sm font-medium mb-1">Your Review</div>
                      <Textarea
                        placeholder="Share your thoughts about this product..."
                        value={reviewText}
                        onChange={(e: any) => setReviewText(e.target.value)}
                        rows={4}
                      />
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-end">
                <Button 
                    className="bg-green-600 hover:bg-green-700"
                    onClick={submitReview}
                    disabled={!reviewText.trim() || reviewRating === 0}
                  >
                    Submit Review
                  </Button>
                </CardFooter>
              </Card>
              
              {/* Review list */}
              <div className="space-y-6 mt-8">
                <h4 className="font-medium">Product Reviews</h4>
                {product.reviews.length > 0 ? (
                  product.reviews.map((review) => (
                    <div key={review.id} className="border-b pb-6">
                      <div className="flex items-center space-x-3">
                        {review.user.image ? (
                          <Image
                            src={review.user.image}
                            alt={review.user.name}
                            width={40}
                            height={40}
                            className="rounded-full"
                          />
                        ) : (
                          <div className="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                            <User className="h-6 w-6 text-gray-500" />
                          </div>
                        )}
                        <div>
                          <div className="font-medium">{review.user.name}</div>
                          <div className="text-sm text-gray-500">
                            {formatDate(review.createdAt)}
                          </div>
                        </div>
                      </div>
                      <div className="flex mt-2">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`h-4 w-4 ${
                              i < review.rating
                                ? "text-yellow-500 fill-yellow-500"
                                : "text-gray-300 dark:text-gray-600"
                            }`}
                          />
                        ))}
                      </div>
                      <p className="mt-3 text-gray-700 dark:text-gray-300">
                        {review.comment}
                      </p>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 bg-gray-50 dark:bg-gray-900 rounded-lg">
                    <p className="text-gray-500">No reviews yet. Be the first to review this product!</p>
                  </div>
                )}
              </div>
            </div>
          </TabsContent>
          <TabsContent value="seller" className="pt-6">
            <div className="space-y-6">
              <h3 className="text-xl font-semibold">Seller Information</h3>
              
              <div className="flex flex-col md:flex-row gap-6 items-start">
                <div className="flex items-center space-x-4">
                  <div className="relative h-20 w-20 overflow-hidden rounded-full">
                    {product.farmer.user.image ? (
                      <Image
                        src={product.farmer.user.image}
                        alt={product.farmer.user.name}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="w-full h-full rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                        <User className="h-10 w-10 text-gray-500" />
                      </div>
                    )}
                  </div>
                  <div>
                    <h4 className="text-lg font-medium">{product.farmer.user.name}</h4>
                    <div className="flex items-center mt-1">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`h-4 w-4 ${
                            i < Math.floor(product.farmer.rating || 0)
                              ? "text-yellow-500 fill-yellow-500"
                              : "text-gray-300 dark:text-gray-600"
                          }`}
                        />
                      ))}
                    </div>
                    <div className="text-sm text-gray-500 mt-1">
                      <span>Member since {formatDate(product.farmer.user.createdAt)}</span>
                    </div>
                  </div>
                </div>
                
                <div className="flex-1 space-y-4">
                  <p className="text-gray-700 dark:text-gray-300">
                    Farmer from {product.farmer.location}, specializing in quality agricultural products.
                  </p>
                  <Button 
                    asChild
                    className="bg-green-600 hover:bg-green-700"
                  >
                    <Link href={`/marketplace/farmers/${product.farmer.id}`}>
                      View Seller Profile
                    </Link>
                  </Button>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </main>
  )
}