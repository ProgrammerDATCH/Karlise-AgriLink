'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { toast } from 'sonner'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Skeleton } from '@/components/ui/skeleton'
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer, 
  CartesianGrid,
  BarChart,
  Bar,
  Legend
} from 'recharts'
import { 
  ShoppingBag, 
  CreditCard, 
  TrendingDown, 
  Clock, 
  Package,
  ArrowRight,
  RefreshCw,
  ChevronRight,
  Loader2
} from 'lucide-react'
import { formatPrice, formatDate } from '@/lib/utils'
import { useAuth } from '@/lib/providers/auth-context'

export default function BuyerDashboard() {
  const { user } = useAuth()
  const [isLoading, setIsLoading] = useState(true)
  const [buyerData, setBuyerData] = useState<any>(null)
  const [recentOrders, setRecentOrders] = useState([])
  const [purchaseData, setPurchaseData] = useState([])
  const [recommendedProducts, setRecommendedProducts] = useState([])
  
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // Fetch buyer profile
        const profileResponse = await fetch('/api/buyer/profile')
        if (!profileResponse.ok) throw new Error('Failed to fetch profile')
        const profileData = await profileResponse.json()
        setBuyerData(profileData)
        
        // Fetch recent orders
        const ordersResponse = await fetch('/api/buyer/orders?limit=4')
        if (!ordersResponse.ok) throw new Error('Failed to fetch orders')
        const ordersData = await ordersResponse.json()
        setRecentOrders(ordersData.orders)
        
        // Fetch spending data for charts
        const spendingResponse = await fetch('/api/buyer/spending')
        if (!spendingResponse.ok) throw new Error('Failed to fetch spending data')
        const spendingData = await spendingResponse.json()
        setPurchaseData(spendingData.monthlyData)
        
        // Fetch recommended products
        const recommendationsResponse = await fetch('/api/buyer/recommendations')
        if (!recommendationsResponse.ok) throw new Error('Failed to fetch recommendations')
        const recommendationsData = await recommendationsResponse.json()
        setRecommendedProducts(recommendationsData.products)
        
      } catch (error) {
        console.error('Error fetching dashboard data:', error)
        toast.error('Failed to load dashboard data')
      } finally {
        setIsLoading(false)
      }
    }
    
    fetchDashboardData()
  }, [])
  
  // Get status badge color
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'COMPLETED':
        return 'bg-green-500'
      case 'PROCESSING':
        return 'bg-blue-500'
      case 'PENDING':
        return 'bg-yellow-500'
      case 'CANCELLED':
        return 'bg-red-500'
      default:
        return 'bg-gray-500'
    }
  }
  
  // Loading skeleton
  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold tracking-tight">Buyer Dashboard</h1>
          <Skeleton className="h-10 w-32" />
        </div>
        
        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <Card key={i}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between space-x-4">
                  <div className="flex items-center space-x-4">
                    <Skeleton className="h-12 w-12 rounded-full" />
                    <div>
                      <Skeleton className="h-4 w-24 mb-2" />
                      <Skeleton className="h-6 w-16" />
                    </div>
                  </div>
                  <Skeleton className="h-9 w-16" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-40 mb-2" />
            <Skeleton className="h-4 w-60" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-[300px] w-full" />
          </CardContent>
        </Card>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <Skeleton className="h-6 w-32 mb-2" />
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="flex justify-between border-b pb-4 last:border-0 last:pb-0">
                    <div className="space-y-1">
                      <Skeleton className="h-5 w-40 mb-1" />
                      <Skeleton className="h-4 w-60 mb-1" />
                      <Skeleton className="h-4 w-20" />
                    </div>
                    <Skeleton className="h-10 w-24" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <Skeleton className="h-6 w-32 mb-2" />
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 gap-4">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="flex items-center space-x-4">
                    <Skeleton className="h-16 w-16 rounded-md" />
                    <div className="flex-1 space-y-1">
                      <Skeleton className="h-5 w-40 mb-1" />
                      <Skeleton className="h-4 w-24 mb-1" />
                      <Skeleton className="h-4 w-16" />
                    </div>
                    <Skeleton className="h-10 w-24" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }
  
  if (!buyerData) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <div className="text-center">
          <p className="text-lg mb-4">Could not load buyer data</p>
          <Button 
            onClick={() => window.location.reload()}
            className="bg-green-600 hover:bg-green-700"
          >
            <RefreshCw className="mr-2 h-4 w-4" />
            Retry
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tight">Buyer Dashboard</h1>
        <Button className="bg-green-600 hover:bg-green-700" asChild>
          <Link href="/marketplace/products">
            Shop Now
          </Link>
        </Button>
      </div>
      
      {/* Overview Cards */}
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between space-x-4">
              <div className="flex items-center space-x-4">
                <div className="bg-blue-100 p-3 rounded-full dark:bg-blue-900/30">
                  <ShoppingBag className="h-6 w-6 text-blue-600 dark:text-blue-500" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total Orders</p>
                  <h3 className="text-2xl font-bold">{buyerData.orderStats?.total || 0}</h3>
                </div>
              </div>
              <Button variant="outline" size="sm" asChild>
                <Link href="/dashboard/buyer/orders">View</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between space-x-4">
              <div className="flex items-center space-x-4">
                <div className="bg-green-100 p-3 rounded-full dark:bg-green-900/30">
                  <CreditCard className="h-6 w-6 text-green-600 dark:text-green-500" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total Spent</p>
                  <h3 className="text-2xl font-bold">{formatPrice(buyerData.spendingStats?.total || 0)}</h3>
                </div>
              </div>
              <Button variant="outline" size="sm" asChild>
                <Link href="/dashboard/buyer/spending">View</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between space-x-4">
              <div className="flex items-center space-x-4">
                <div className="bg-yellow-100 p-3 rounded-full dark:bg-yellow-900/30">
                  <Clock className="h-6 w-6 text-yellow-600 dark:text-yellow-500" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Pending Orders</p>
                  <h3 className="text-2xl font-bold">{buyerData.orderStats?.pending || 0}</h3>
                </div>
              </div>
              <Button variant="outline" size="sm" asChild>
                <Link href="/dashboard/buyer/orders?status=PENDING">View</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between space-x-4">
              <div className="flex items-center space-x-4">
                <div className="bg-purple-100 p-3 rounded-full dark:bg-purple-900/30">
                  <TrendingDown className="h-6 w-6 text-purple-600 dark:text-purple-500" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Savings</p>
                  <div className="flex items-center">
                    <h3 className="text-2xl font-bold">{buyerData.spendingStats?.savingsPercent || 0}%</h3>
                    <span className="text-sm text-muted-foreground ml-1">vs. market</span>
                  </div>
                </div>
              </div>
              <Badge className="bg-green-600">
                {formatPrice(buyerData.spendingStats?.savings || 0)}
              </Badge>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Chart Section */}
      <Tabs defaultValue="spending" className="space-y-4">
        <TabsList>
          <TabsTrigger value="spending">Spending</TabsTrigger>
          <TabsTrigger value="orders">Orders</TabsTrigger>
        </TabsList>
        <TabsContent value="spending" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Spending Overview</CardTitle>
              <CardDescription>
                Your spending trend over the past 6 months
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                {purchaseData.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={purchaseData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip 
                        formatter={(value: any) => [formatPrice(value as number), "Spending"]}
                      />
                      <Line 
                        type="monotone" 
                        dataKey="spending" 
                        stroke="#16a34a" 
                        strokeWidth={2} 
                        dot={{ r: 4 }} 
                      />
                    </LineChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <p className="text-muted-foreground">No spending data available</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="orders" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Orders Overview</CardTitle>
              <CardDescription>
                Your order volume over the past 6 months
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                {purchaseData.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={purchaseData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip 
                        formatter={(value: any) => [value, "Orders"]}
                      />
                      <Bar 
                        dataKey="orders" 
                        fill="#16a34a" 
                        radius={[4, 4, 0, 0]} 
                      />
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <p className="text-muted-foreground">No order data available</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      
      {/* Bottom Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Orders */}
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Recent Orders</CardTitle>
            <CardDescription>Your latest purchases</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentOrders.length > 0 ? (
                recentOrders.map((order: any) => (
                  <div key={order.id} className="flex justify-between border-b pb-4 last:border-0 last:pb-0">
                    <div className="space-y-1">
                      <div className="flex items-center space-x-2">
                        <h4 className="font-medium">{order.items && order.items[0] ? order.items[0].product.name : 'Product'}</h4>
                        <Badge className={getStatusColor(order.status)}>
                          {order.status.charAt(0) + order.status.slice(1).toLowerCase()}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">Seller: {order.seller.name}</p>
                      <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                        <Clock className="h-3 w-3" />
                        <span>{formatDate(order.createdAt)}</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-semibold">{formatPrice(order.totalAmount)}</div>
                      <Button variant="ghost" size="sm" className="text-sm mt-1" asChild>
                        <Link href={`/dashboard/buyer/orders/${order.id}`}>
                          View Order
                        </Link>
                      </Button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-6">
                  <p className="text-muted-foreground">No recent orders found</p>
                  <Button asChild className="mt-4 bg-green-600 hover:bg-green-700">
                    <Link href="/marketplace/products">Browse Products</Link>
                  </Button>
                </div>
              )}
            </div>
          </CardContent>
          <CardFooter>
            <Button variant="outline" className="w-full" asChild>
              <Link href="/dashboard/buyer/orders">View All Orders</Link>
            </Button>
          </CardFooter>
        </Card>
        
        {/* Recommended Products */}
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Recommended For You</CardTitle>
            <CardDescription>Products you might be interested in</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recommendedProducts.length > 0 ? (
                recommendedProducts.map((product: any) => (
                  <div key={product.id} className="flex space-x-4">
                    <div className="relative h-16 w-16 rounded-md overflow-hidden flex-shrink-0">
                      {product.images ? (
                        <Image
                          src={product.images.split(',')[0]}
                          alt={product.name}
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                          <Package className="h-6 w-6 text-gray-400" />
                        </div>
                      )}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium text-sm">{product.name}</h4>
                      <p className="text-sm text-muted-foreground">
                        {product.farmer.user.name} • {product.farmer.location}
                      </p>
                      <p className="font-semibold mt-1">{formatPrice(product.price)} / {product.unit}</p>
                    </div>
                    <Button size="sm" className="bg-green-600 hover:bg-green-700 self-center" asChild>
                      <Link href={`/marketplace/products/${product.id}`}>
                        View
                      </Link>
                    </Button>
                  </div>
                ))
              ) : (
                <div className="text-center py-6">
                  <p className="text-muted-foreground">No recommendations available yet</p>
                  <Button asChild className="mt-4 bg-green-600 hover:bg-green-700">
                    <Link href="/marketplace/products">Browse Products</Link>
                  </Button>
                </div>
              )}
            </div>
          </CardContent>
          <CardFooter>
            <Button variant="outline" className="w-full" asChild>
              <Link href="/marketplace/products">
                Explore All Products
              </Link>
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}