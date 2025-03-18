// app/marketplace/products/page.tsx
'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select'
import { Slider } from '@/components/ui/slider'
import { Checkbox } from '@/components/ui/checkbox'
import { Badge } from '@/components/ui/badge'
import { Search, SlidersHorizontal, X } from 'lucide-react'
import { Product, ProductCategory } from '@prisma/client'
import { toast } from 'sonner'
import { formatPrice } from '@/lib/utils'
import ProductFeatureGrid from '@/components/marketplace/product-feature-grid'

export default function ProductsPage() {
  const [filtersVisible, setFiltersVisible] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('')
  const [priceRange, setPriceRange] = useState([0, 100])
  const [organicOnly, setOrganicOnly] = useState(false)
  const [products, setProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<ProductCategory[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Fetch categories
    const fetchCategories = async () => {
      try {
        const response = await fetch('/api/categories')
        if (!response.ok) {
          throw new Error('Failed to fetch categories')
        }
        const data = await response.json()
        setCategories(data)
      } catch (error) {
        console.error('Error fetching categories:', error)
        toast.error('Failed to load categories')
      }
    }

    // Fetch products with filters
    const fetchProducts = async () => {
      setIsLoading(true)
      try {
        let url = '/api/products?'
        
        if (searchTerm) {
          url += `search=${encodeURIComponent(searchTerm)}&`
        }
        
        if (selectedCategory) {
          url += `category=${encodeURIComponent(selectedCategory)}&`
        }
        
        if (organicOnly) {
          url += 'organic=true&'
        }
        
        // Add price range - convert from percentage to actual price
        // This assumes your API can handle min/max price filtering
        url += `minPrice=${priceRange[0] * 100}&maxPrice=${priceRange[1] * 100}`
        
        const response = await fetch(url)
        if (!response.ok) {
          throw new Error('Failed to fetch products')
        }
        
        const data = await response.json()
        setProducts(data)
      } catch (error) {
        console.error('Error fetching products:', error)
        toast.error('Failed to load products')
      } finally {
        setIsLoading(false)
      }
    }

    fetchCategories()
    fetchProducts()
  }, [searchTerm, selectedCategory, priceRange, organicOnly])

  return (
    <main className="container px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Agricultural Products</h1>
      
      {/* Search and filter bar */}
      <div className="flex flex-col md:flex-row gap-4 mb-8">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search products..."
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Button 
          variant="outline" 
          onClick={() => setFiltersVisible(!filtersVisible)}
          className="md:w-auto w-full"
        >
          <SlidersHorizontal className="mr-2 h-4 w-4" />
          Filters
          {(selectedCategory || organicOnly || priceRange[0] > 0 || priceRange[1] < 100) && (
            <Badge className="ml-2 bg-green-600 text-white" variant="secondary">
              Active
            </Badge>
          )}
        </Button>
        <Select value={selectedCategory} onValueChange={setSelectedCategory}>
          <SelectTrigger className="md:w-[180px] w-full">
            <SelectValue placeholder="Category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">All Categories</SelectItem>
            {categories.map((category) => (
              <SelectItem key={category.id} value={category.id}>
                {category.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select>
          <SelectTrigger className="md:w-[180px] w-full">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="newest">Newest First</SelectItem>
            <SelectItem value="price-low">Price: Low to High</SelectItem>
            <SelectItem value="price-high">Price: High to Low</SelectItem>
            <SelectItem value="rating">Highest Rated</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      {/* Expanded filters */}
      {filtersVisible && (
        <Card className="mb-8">
          <CardContent className="p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-semibold text-lg">Filters</h3>
              <Button variant="ghost" size="sm" onClick={() => setFiltersVisible(false)}>
                <X className="h-4 w-4" />
              </Button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <h4 className="font-medium mb-2">Categories</h4>
                <div className="space-y-2">
                  {categories.map((category) => (
                    <div key={category.id} className="flex items-center space-x-2">
                      <Checkbox 
                        id={`category-${category.id}`} 
                        checked={selectedCategory === category.id}
                        onCheckedChange={() => 
                          setSelectedCategory(
                            selectedCategory === category.id ? '' : category.id
                          )
                        }
                      />
                      <label 
                        htmlFor={`category-${category.id}`}
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        {category.name}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <h4 className="font-medium mb-2">Price Range (RWF)</h4>
                <div className="pt-4 px-2">
                  <Slider
                    defaultValue={[0, 100]}
                    max={100}
                    step={1}
                    value={priceRange}
                    onValueChange={setPriceRange}
                  />
                  <div className="flex justify-between mt-2 text-sm text-gray-500">
                    <span>{priceRange[0] * 100} RWF</span>
                    <span>{priceRange[1] * 100} RWF</span>
                  </div>
                </div>
              </div>
              <div>
                <h4 className="font-medium mb-2">Product Type</h4>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="organic-only" 
                      checked={organicOnly}
                      onCheckedChange={(checked) => 
                        setOrganicOnly(checked === true)
                      }
                    />
                    <label 
                      htmlFor="organic-only"
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      Organic Products Only
                    </label>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex gap-2 mt-6 justify-end">
              <Button 
                variant="outline" 
                onClick={() => {
                  setSelectedCategory('')
                  setPriceRange([0, 100])
                  setOrganicOnly(false)
                }}
              >
                Reset Filters
              </Button>
              <Button className="bg-green-600 hover:bg-green-700">
                Apply Filters
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
      
      {/* Products grid - replace with dynamic data */}
      {isLoading ? (
        <div className="flex justify-center items-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
        </div>
      ) : (
        products.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <h3 className="text-lg font-medium">No products found</h3>
            <p className="text-gray-500 mt-2">Try adjusting your filters or search terms</p>
          </div>
        )
      )}
      
      {/* Pagination */}
      <div className="flex justify-center mt-12">
        <nav className="flex space-x-2">
          <Button variant="outline" size="icon" disabled>
            &laquo;
          </Button>
          <Button variant="outline" size="icon" className="bg-green-600 text-white">
            1
          </Button>
          <Button variant="outline" size="icon">
            2
          </Button>
          <Button variant="outline" size="icon">
            3
          </Button>
          <Button variant="outline" size="icon">
            &raquo;
          </Button>
        </nav>
      </div>
    </main>
  )
}

interface ProductCardProps {
  product: Product
}

function ProductCard({ product }: ProductCardProps) {
  return (
    <Card className="overflow-hidden h-full flex flex-col">
      <div className="relative h-48 w-full">
        <img 
          src={product.images?.split(',')[0] || '/images/products/placeholder.jpg'} 
          alt={product.name}
          className="w-full h-full object-cover"
        />
        {product.isOrganic && (
          <Badge className="absolute top-2 left-2 bg-green-600">Organic</Badge>
        )}
      </div>
      <CardContent className="p-4 flex-1 flex flex-col">
        <div className="mb-2">
          <Badge variant="outline" className="text-xs font-normal">
            {product.categoryId}
          </Badge>
        </div>
        <Link href={`/marketplace/products/${product.id}`}>
          <h3 className="font-semibold text-lg hover:text-green-600 transition-colors">
            {product.name}
          </h3>
        </Link>
        <div className="mt-auto pt-4">
          <div className="text-lg font-semibold">
            {formatPrice(product.price)} / {product.unit}
          </div>
          <Button className="w-full bg-green-600 hover:bg-green-700 mt-4">
            Add to Cart
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}