import Link from 'next/link'
import Image from 'next/image'
import { Card, CardContent } from '@/components/ui/card'

export default function CategoriesShowcase() {
  // Sample categories - in a real app, these would come from your database
  const categories = [
    {
      id: 'coffee',
      name: 'Coffee',
      image: '/images/categories/coffee.jpg',
      count: 58,
      description: 'Premium Rwandan coffee beans from different regions'
    },
    {
      id: 'tea',
      name: 'Tea',
      image: '/images/categories/tea.jpg',
      count: 42,
      description: 'High-quality tea from Rwanda\'s lush plantations'
    },
    {
      id: 'fruits',
      name: 'Fruits',
      image: '/images/categories/fruits.jpg',
      count: 86,
      description: 'Fresh tropical fruits grown across Rwanda'
    },
    {
      id: 'vegetables',
      name: 'Vegetables',
      image: '/images/categories/vegetables.jpg',
      count: 124,
      description: 'Locally grown vegetables for all cooking needs'
    },
    {
      id: 'dairy',
      name: 'Dairy',
      image: '/images/categories/dairy.jpg',
      count: 37,
      description: 'Milk, cheese and other dairy products from Rwandan farms'
    },
    {
      id: 'grains',
      name: 'Grains',
      image: '/images/categories/grains.jpg',
      count: 69,
      description: 'Rice, maize, wheat and other essential grains'
    },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
      {categories.map((category) => (
        <Link 
          key={category.id} 
          href={`/marketplace/categories/${category.id}`}
          className="transition-transform hover:scale-[1.02]"
        >
          <Card className="overflow-hidden h-full">
            <div className="relative h-48 w-full">
              <Image 
                src={category.image} 
                alt={category.name}
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
              <div className="absolute bottom-0 left-0 p-4 text-white">
                <h3 className="text-xl font-bold">{category.name}</h3>
                <p className="text-sm text-white/80">{category.count} products</p>
              </div>
            </div>
            <CardContent className="p-4">
              <p className="text-sm text-gray-500 dark:text-gray-400">{category.description}</p>
            </CardContent>
          </Card>
        </Link>
      ))}
    </div>
  )
}