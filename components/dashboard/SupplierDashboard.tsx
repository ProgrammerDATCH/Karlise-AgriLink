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
  PieChart,
  Pie,
  Cell,
  Legend
} from 'recharts'
import { 
  Package, 
  TrendingUp, 
  AlertTriangle, 
  Users, 
  Plus,
  RefreshCw,
  ShoppingBag,
  PanelLeft,
  BarChart as BarChartIcon, 
  Clock
} from 'lucide-react'
import { formatPrice, formatDate } from '@/lib/utils'
import { useAuth } from '@/lib/providers/auth-context'

export default function SupplierDashboard() {
  const { user } = useAuth()
  const [isLoading, setIsLoading] = useState(true)
  const [supplierData, setSupplierData] = useState<any>(null)
  const [inputs, setInputs] = useState([])
  const [recentOrders, setRecentOrders] = useState([])
  const [salesData, setSalesData] = useState([])
  const [inputsByCategory, setInputsByCategory] = useState([])
  
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // Fetch supplier profile
        const profileResponse = await fetch('/api/supplier/profile')
        if (!profileResponse.ok) throw new Error('Failed to fetch profile')
        const profileData = await profileResponse.json()
        setSupplierData(profileData)
        
        // Fetch supplier's inputs
        const inputsResponse = await fetch('/api/supplier/inputs')
        if (!inputsResponse.ok) throw new Error('Failed to fetch inputs')
        const inputsData = await inputsResponse.json()
        setInputs(inputsData.inputs)
        
        // Fetch recent orders
        const ordersResponse = await fetch('/api/supplier/orders?limit=4')
        if (!ordersResponse.ok) throw new Error('Failed to fetch orders')
        const ordersData = await ordersResponse.json()
        setRecentOrders(ordersData.orders)
        
        // Fetch sales data for charts
        const salesResponse = await fetch('/api/supplier/sales')
        if (!salesResponse.ok) throw new Error('Failed to fetch sales data')
        const salesData = await salesResponse.json()
        setSalesData(salesData.monthlyData)
        
        // Fetch inputs by category for pie chart
        const categoryResponse = await fetch('/api/supplier/inputs/categories')
        if (!categoryResponse.ok) throw new Error('Failed to fetch category data')
        const categoryData = await categoryResponse.json()
        setInputsByCategory(categoryData.categories)
        
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
  
  // Inventory status color
  const getInventoryStatusColor = (count: number) => {
    if (count <= 0) return 'text-red-500'
    if (count < 10) return 'text-yellow-500'
    return 'text-green-500'
  }
  
  // Pie chart colors
  const COLORS = ['#16a34a', '#4f46e5', '#eab308', '#ef4444', '#8b5cf6', '#ec4899']
  
  // Loading skeleton
  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold tracking-tight">Supplier Dashboard</h1>
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
              <Skeleton className="h-[300px] w-full" />
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }
  
  if (!supplierData) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <div className="text-center">
          <p className="text-lg mb-4">Could not load supplier data</p>
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
        <h1 className="text-3xl font-bold tracking-tight">Supplier Dashboard</h1>
        <Button className="bg-green-600 hover:bg-green-700" asChild>
          <Link href="/dashboard/supplier/inputs/add">
            <Plus className="mr-2 h-4 w-4" />
            Add New Input
          </Link>
        </Button>
      </div>
      
      {/* Overview Cards */}
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between space-x-4">
              <div className="flex items-center space-x-4">
                <div className="bg-green-100 p-3 rounded-full dark:bg-green-900/30">
                  <Package className="h-6 w-6 text-green-600 dark:text-green-500" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total Inputs</p>
                  <h3 className="text-2xl font-bold">{supplierData.inputStats?.total || 0}</h3>
                </div>
              </div>
              <Button variant="outline" size="sm" asChild>
                <Link href="/dashboard/supplier/inputs">View</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between space-x-4">
              <div className="flex items-center space-x-4">
                <div className="bg-blue-100 p-3 rounded-full dark:bg-blue-900/30">
                  <ShoppingBag className="h-6 w-6 text-blue-600 dark:text-blue-500" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total Orders</p>
                  <h3 className="text-2xl font-bold">{supplierData.orderStats?.total || 0}</h3>
                </div>
              </div>
              <Button variant="outline" size="sm" asChild>
                <Link href="/dashboard/supplier/orders">View</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between space-x-4">
              <div className="flex items-center space-x-4">
                <div className="bg-yellow-100 p-3 rounded-full dark:bg-yellow-900/30">
                  <AlertTriangle className="h-6 w-6 text-yellow-600 dark:text-yellow-500" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Low Stock Items</p>
                  <h3 className="text-2xl font-bold">{supplierData.inputStats?.lowStock || 0}</h3>
                </div>
              </div>
              <Button variant="outline" size="sm" asChild>
                <Link href="/dashboard/supplier/inputs?filter=low-stock">View</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between space-x-4">
              <div className="flex items-center space-x-4">
                <div className="bg-purple-100 p-3 rounded-full dark:bg-purple-900/30">
                  <TrendingUp className="h-6 w-6 text-purple-600 dark:text-purple-500" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Revenue</p>
                  <h3 className="text-2xl font-bold">{formatPrice(supplierData.salesStats?.total || 0)}</h3>
                </div>
              </div>
              <Badge className="bg-green-600">
                +{supplierData.salesStats?.growthRate || 0}%
              </Badge>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Chart Section */}
      <Tabs defaultValue="sales" className="space-y-4">
        <TabsList>
          <TabsTrigger value="sales">
            <BarChartIcon className="h-4 w-4 mr-2" />
            Sales
          </TabsTrigger>
          <TabsTrigger value="inventory">
            <PanelLeft className="h-4 w-4 mr-2" />
            Inventory
          </TabsTrigger>
        </TabsList>
        <TabsContent value="sales" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Sales Overview</CardTitle>
              <CardDescription>
                Your sales trend over the past 6 months
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                {salesData.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={salesData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip 
                        formatter={(value: any) => [formatPrice(value as number), "Sales"]}
                      />
                      <Line 
                        type="monotone" 
                        dataKey="sales" 
                        stroke="#16a34a" 
                        strokeWidth={2} 
                        dot={{ r: 4 }} 
                      />
                    </LineChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <p className="text-muted-foreground">No sales data available</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="inventory" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Input Categories Distribution</CardTitle>
              <CardDescription>
                Overview of your inputs by category
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                {inputsByCategory.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={inputsByCategory}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name}: ${(percent! * 100).toFixed(0)}%`}
                        outerRadius={100}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {inputsByCategory.map((entry: any, index: number) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value: any) => [`${value} items`, 'Count']} />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <p className="text-muted-foreground">No category data available</p>
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
            <CardDescription>Latest orders for your agricultural inputs</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentOrders.length > 0 ? (
                recentOrders.map((order: any) => (
                  <div key={order.id} className="flex justify-between border-b pb-4 last:border-0 last:pb-0">
                    <div className="space-y-1">
                      <div className="flex items-center space-x-2">
                        <h4 className="font-medium">{order.items && order.items[0] ? order.items[0].input.name : 'Product'}</h4>
                        <Badge className={getStatusColor(order.status)}>
                          {order.status.charAt(0) + order.status.slice(1).toLowerCase()}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">Buyer: {order.buyer.name}</p>
                      <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                        <Clock className="h-3 w-3" />
                        <span>{formatDate(order.createdAt)}</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-semibold">{formatPrice(order.totalAmount)}</div>
                      <Button variant="ghost" size="sm" className="text-sm mt-1" asChild>
                        <Link href={`/dashboard/supplier/orders/${order.id}`}>
                          View Order
                        </Link>
                      </Button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-6">
                  <p className="text-muted-foreground">No recent orders found</p>
                </div>
              )}
            </div>
          </CardContent>
          <CardFooter>
            <Button variant="outline" className="w-full" asChild>
              <Link href="/dashboard/supplier/orders">View All Orders</Link>
            </Button>
          </CardFooter>
        </Card>
        
        {/* Low Stock Inputs */}
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Low Stock Alerts</CardTitle>
            <CardDescription>Agricultural inputs that need restocking</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {inputs.length > 0 ? (
                inputs
                  .filter((input: any) => input.inStock < 10) // Show only low stock items
                  .slice(0, 5) // Limit to 5 items
                  .map((input: any) => (
                    <div key={input.id} className="flex justify-between border-b pb-4 last:border-0 last:pb-0">
                      <div className="space-y-1">
                        <h4 className="font-medium">{input.name}</h4>
                        <p className="text-sm text-muted-foreground">
                          Type: {input.type.charAt(0) + input.type.slice(1).toLowerCase()}
                        </p>
                        <div className="flex items-center space-x-2">
                          <span className={`text-sm font-medium ${getInventoryStatusColor(input.inStock)}`}>
                            {input.inStock} {input.unit} left in stock
                          </span>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-semibold">{formatPrice(input.price)} / {input.unit}</div>
                        <Button variant="ghost" size="sm" className="text-sm mt-1" asChild>
                          <Link href={`/dashboard/supplier/inputs/${input.id}`}>
                            Manage
                          </Link>
                        </Button>
                      </div>
                    </div>
                  ))
              ) : (
                <div className="text-center py-6">
                  <p className="text-muted-foreground">No low stock items found</p>
                </div>
              )}
              
              {inputs.length > 0 && inputs.filter((input: any) => input.inStock < 10).length === 0 && (
                <div className="flex flex-col items-center justify-center py-6 text-center">
                  <div className="rounded-full bg-green-100 p-3 dark:bg-green-900/30">
                    <Package className="h-6 w-6 text-green-600 dark:text-green-500" />
                  </div>
                  <h3 className="mt-4 text-lg font-semibold">All Good!</h3>
                  <p className="mt-2 text-sm text-muted-foreground">
                    You have no inputs that need restocking right now.
                  </p>
                </div>
              )}
            </div>
          </CardContent>
          <CardFooter>
            <Button variant="outline" className="w-full" asChild>
              <Link href="/dashboard/supplier/inputs">Manage Inventory</Link>
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}