'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
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
  Package, 
  ShoppingCart, 
  Star, 
  TrendingUp, 
  Clock, 
  AlertCircle, 
  Check, 
  Plus
} from 'lucide-react'

export default function FarmerDashboard() {
  // Mock farmer data for demonstration
  const farmerData = {
    name: 'Jean Mugabo',
    location: 'Nyamagabe, Rwanda',
    products: 12,
    orders: {
      total: 36,
      pending: 4,
      completed: 28,
      cancelled: 4
    },
    revenue: {
      current: 265000,
      previous: 210000,
      growth: 26.2,
    },
    rating: 4.8,
    reviewCount: 42,
  }
  
  // Mock sales data for charts
  const salesData = [
    { month: 'Jan', sales: 42000, orders: 5 },
    { month: 'Feb', sales: 58000, orders: 7 },
    { month: 'Mar', sales: 65000, orders: 9 },
    { month: 'Apr', sales: 75000, orders: 12 },
    { month: 'May', sales: 95000, orders: 15 },
    { month: 'Jun', sales: 125000, orders: 21 },
  ]
  
  // Recent orders data
  const recentOrders = [
    {
      id: 'ORD-12345',
      buyer: 'Hospitality Rwanda Ltd',
      products: 'Premium Arabica Coffee Beans (10kg)',
      value: 125000,
      status: 'completed',
      date: '2025-03-14'
    },
    {
      id: 'ORD-12346',
      buyer: 'Kigali Fresh Markets',
      products: 'Organic Avocados (25kg)',
      value: 62500,
      status: 'processing',
      date: '2025-03-15'
    },
    {
      id: 'ORD-12347',
      buyer: 'Green Basket Exports',
      products: 'Premium Arabica Coffee Beans (25kg)',
      value: 312500,
      status: 'pending',
      date: '2025-03-16'
    },
    {
      id: 'ORD-12348',
      buyer: 'Restaurant Le Panorama',
      products: 'Fresh Highland Potatoes (15kg)',
      value: 18000,
      status: 'completed',
      date: '2025-03-12'
    },
  ]
  
  // Products that need attention
  const attentionProducts = [
    {
      id: 'P-1234',
      name: 'Arabica Coffee Beans',
      issue: 'Low inventory',
      stock: 5,
      unit: 'kg',
      reorderPoint: 10
    },
    {
      id: 'P-2345',
      name: 'Organic Avocados',
      issue: 'Expiring soon',
      stock: 15,
      unit: 'kg',
      expiryDate: '2025-03-20'
    }
  ]
  
  // Format currency
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-RW', {
      style: 'currency',
      currency: 'RWF',
      minimumFractionDigits: 0
    }).format(value)
  }
  
  // Get status badge color
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-500'
      case 'processing':
        return 'bg-blue-500'
      case 'pending':
        return 'bg-yellow-500'
      case 'cancelled':
        return 'bg-red-500'
      default:
        return 'bg-gray-500'
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tight">Farmer Dashboard</h1>
        <Button className="bg-green-600 hover:bg-green-700">
          <Plus className="mr-2 h-4 w-4" /> Add New Product
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
                  <p className="text-sm text-muted-foreground">Products</p>
                  <h3 className="text-2xl font-bold">{farmerData.products}</h3>
                </div>
              </div>
              <Button variant="outline" size="sm" asChild>
                <Link href="/dashboard/farmer/products">View</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between space-x-4">
              <div className="flex items-center space-x-4">
                <div className="bg-blue-100 p-3 rounded-full dark:bg-blue-900/30">
                  <ShoppingCart className="h-6 w-6 text-blue-600 dark:text-blue-500" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Orders</p>
                  <h3 className="text-2xl font-bold">{farmerData.orders.total}</h3>
                </div>
              </div>
              <Button variant="outline" size="sm" asChild>
                <Link href="/dashboard/farmer/orders">View</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between space-x-4">
              <div className="flex items-center space-x-4">
                <div className="bg-amber-100 p-3 rounded-full dark:bg-amber-900/30">
                  <TrendingUp className="h-6 w-6 text-amber-600 dark:text-amber-500" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Revenue</p>
                  <h3 className="text-2xl font-bold">{formatCurrency(farmerData.revenue.current)}</h3>
                </div>
              </div>
              <Badge className="bg-green-600">+{farmerData.revenue.growth}%</Badge>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between space-x-4">
              <div className="flex items-center space-x-4">
                <div className="bg-purple-100 p-3 rounded-full dark:bg-purple-900/30">
                  <Star className="h-6 w-6 text-purple-600 dark:text-purple-500" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Rating</p>
                  <div className="flex items-center">
                    <h3 className="text-2xl font-bold">{farmerData.rating}</h3>
                    <span className="text-sm text-muted-foreground ml-1">({farmerData.reviewCount})</span>
                  </div>
                </div>
              </div>
              <Button variant="outline" size="sm" asChild>
                <Link href="/dashboard/farmer/reviews">View</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Chart Section */}
      <Tabs defaultValue="revenue" className="space-y-4">
        <TabsList>
          <TabsTrigger value="revenue">Revenue</TabsTrigger>
          <TabsTrigger value="orders">Orders</TabsTrigger>
        </TabsList>
        <TabsContent value="revenue" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Revenue Overview</CardTitle>
              <CardDescription>
                Your revenue trend over the past 6 months
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={salesData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip 
                      formatter={(value: any) => [formatCurrency(value as number), "Revenue"]}
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
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={salesData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
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
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      
      {/* Bottom Section */}
      <div className="grid gap-4 grid-cols-1 lg:grid-cols-2">
        {/* Recent Orders */}
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Recent Orders</CardTitle>
            <CardDescription>Your latest transactions</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentOrders.map((order) => (
                <div key={order.id} className="flex justify-between border-b pb-4 last:border-0 last:pb-0">
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <h4 className="font-medium">{order.buyer}</h4>
                      <Badge className={getStatusColor(order.status)}>
                        {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">{order.products}</p>
                    <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                      <Clock className="h-3 w-3" />
                      <span>{new Date(order.date).toLocaleDateString()}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold">{formatCurrency(order.value)}</div>
                    <Button variant="ghost" size="sm" className="text-sm mt-1">
                      View Order
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
          <CardFooter>
            <Button variant="outline" className="w-full" asChild>
              <Link href="/dashboard/farmer/orders">View All Orders</Link>
            </Button>
          </CardFooter>
        </Card>
        
        {/* Products Needing Attention */}
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Products Needing Attention</CardTitle>
            <CardDescription>Issues that require your action</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {attentionProducts.map((product) => (
                <div key={product.id} className="flex justify-between border-b pb-4 last:border-0 last:pb-0">
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <h4 className="font-medium">{product.name}</h4>
                    </div>
                    <div className="flex items-center space-x-2 text-sm text-amber-600 dark:text-amber-500">
                      <AlertCircle className="h-3 w-3" />
                      <span>{product.issue}</span>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Current stock: {product.stock} {product.unit}
                    </div>
                  </div>
                  <div className="text-right">
                    {product.issue === 'Low inventory' ? (
                      <Button size="sm" className="bg-green-600 hover:bg-green-700">
                        Restock
                      </Button>
                    ) : (
                      <Button size="sm" className="bg-amber-600 hover:bg-amber-700">
                        Update
                      </Button>
                    )}
                  </div>
                </div>
              ))}
              
              {attentionProducts.length === 0 && (
                <div className="flex flex-col items-center justify-center text-center p-6">
                  <div className="rounded-full bg-green-100 p-3 dark:bg-green-900/30">
                    <Check className="h-6 w-6 text-green-600 dark:text-green-500" />
                  </div>
                  <h3 className="mt-4 text-lg font-semibold">All Good!</h3>
                  <p className="mt-2 text-sm text-muted-foreground">
                    You have no products that need attention right now.
                  </p>
                </div>
              )}
            </div>
          </CardContent>
          <CardFooter>
            <Button variant="outline" className="w-full" asChild>
              <Link href="/dashboard/farmer/products">Manage Products</Link>
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}