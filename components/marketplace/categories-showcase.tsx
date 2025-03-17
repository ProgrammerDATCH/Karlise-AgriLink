import Link from 'next/link'
import Image from 'next/image'
import { Card, CardContent, CardFooter } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Star, ShoppingCart } from 'lucide-react'

export default function ProductFeatureGrid() {
  // Sample featured products - in a real app, these would come from your database
  const featuredProducts = [
    {
      id: 'p1',
      name: 'Premium Arabica Coffee Beans',
      image: '/images/products/coffee.jpg',
      price: 12.50,
      unit: 'kg',
      farmer: 'Jean Mugabo',
      location: 'Nyamagabe',
      rating: 4.8,
      reviews: 24,
      isOrganic: true,
      category: 'Coffee',
    },
    {
      id: 'p2',
      name: 'Fresh Highland Potatoes',
      image: '/images/products/potatoes.jpg',
      price: 1.20,
      unit: 'kg',
      farmer: 'Marie Niyonkuru',
      location: 'Musanze',
      rating: 4.6,
      reviews: 18,
      isOrganic: false,
      category: 'Vegetables',
    },
    {
      id: 'p3',
      name: 'Organic Avocados',
      image: '/images/products/avocados.jpg',
      price: 2.80,
      unit: 'kg',
      farmer: 'Emmanuel Habimana',
      location: 'Karongi',
      rating: 4.9,
      reviews: 31,
      isOrganic: true,
      category: 'Fruits',
    },
    {
      id: 'p4',
      name: 'Fresh Cow Milk',
      image: '/images/products/milk.jpg',
      price: 1.50,
      unit: 'L',
      farmer: 'Nyiraneza Cooperative',
      location: 'Nyabihu',
      rating: 4.7,
      reviews: 42,
      isOrganic: false,
      category: 'Dairy',
    },
    {
      id: 'p5',
      name: 'Premium Green Tea Leaves',
      image: '/images/products/tea.jpg',
      price: 8.75,
      unit: 'kg',
      farmer: 'Gisovu Tea Cooperative',
      location: 'Karongi',
      rating: 4.9,
      reviews: 36,
      isOrganic: true,
      category: 'Tea',
    },
    {
      id: 'p6',
      name: 'Organic Brown Rice',
      image: '/images/products/rice.jpg',
      price: 3.20,
      unit: 'kg',
      farmer: 'Bugarama Farmers Group',
      location: 'Rusizi',
      rating: 4.5,
      reviews: 28,
      isOrganic: true,
      category: 'Grains',
    },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
      {featuredProducts.map((product) => (
        <Card key={product.id} className="overflow-hidden h-full flex flex-col">
          <div className="relative h-48 w-full">
            <Image 
              src={product.image} 
              alt={product.name}
              fill
              className="object-cover"
            />
            {product.isOrganic && (
              <Badge className="absolute top-2 left-2 bg-green-600">Organic</Badge>
            )}
          </div>
          <CardContent className="p-4 flex-1">
            <div className="mb-2">
              <Badge variant="outline" className="text-xs font-normal">
                {product.category}
              </Badge>
            </div>
            <Link href={`/marketplace/products/${product.id}`}>
              <h3 className="font-semibold text-lg hover:text-green-600 transition-colors">
                {product.name}
              </h3>
            </Link>
            <div className="flex items-center gap-1 mt-1 text-sm text-gray-500 dark:text-gray-400">
              <span>By {product.farmer}</span>
              <span>•</span>
              <span>{product.location}</span>
            </div>
            <div className="flex items-center gap-1 mt-2">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`h-4 w-4 ${
                    i < Math.floor(product.rating)
                      ? "text-yellow-500 fill-yellow-500"
                      : "text-gray-300 dark:text-gray-600"
                  }`}
                />
              ))}
              <span className="text-sm text-gray-600 dark:text-gray-400">
                ({product.reviews})
              </span>
            </div>
            <div className="mt-3 text-lg font-semibold">
              ${product.price.toFixed(2)} / {product.unit}
            </div>
          </CardContent>
          <CardFooter className="p-4 pt-0">
            <Button className="w-full bg-green-600 hover:bg-green-700">
              <ShoppingCart className="h-4 w-4 mr-2" />
              Add to Cart
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  )
}