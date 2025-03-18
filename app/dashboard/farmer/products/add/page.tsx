// app/dashboard/farmer/products/add/page.tsx
'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'sonner'
import { ArrowLeft, Save } from 'lucide-react'

import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { Checkbox } from '@/components/ui/checkbox'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import ImageUpload from '@/components/shared/image-upload'
import Link from 'next/link'
import { ProductCategory } from '@prisma/client'

// Form validation schema
const productFormSchema = z.object({
  name: z.string().min(3, { message: 'Product name must be at least 3 characters' }),
  description: z.string().min(10, { message: 'Description must be at least 10 characters' }),
  price: z.coerce.number().positive({ message: 'Price must be a positive number' }),
  unit: z.string().min(1, { message: 'Unit is required' }),
  quantity: z.coerce.number().int().positive({ message: 'Quantity must be a positive integer' }),
  images: z.string().array().min(1, { message: 'At least one image is required' }),
  categoryId: z.string().min(1, { message: 'Category is required' }),
  quality: z.string().optional(),
  harvestDate: z.string().optional(),
  expiryDate: z.string().optional(),
  isOrganic: z.boolean().default(false),
  featured: z.boolean().default(false),
})

type ProductFormValues = z.infer<typeof productFormSchema>

export default function AddProductPage() {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [categories, setCategories] = useState<ProductCategory[]>([])
  
  // Initialize form with default values
  const form = useForm<ProductFormValues>({
    resolver: zodResolver(productFormSchema),
    defaultValues: {
      name: '',
      description: '',
      price: 0,
      unit: 'kg',
      quantity: 1,
      images: [],
      categoryId: '',
      quality: '',
      harvestDate: '',
      expiryDate: '',
      isOrganic: false,
      featured: false,
    },
  })
  
  // Fetch categories when component mounts
  useState(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch('/api/categories')
        if (!response.ok) throw new Error('Failed to fetch categories')
        const data = await response.json()
        setCategories(data)
      } catch (error) {
        console.error('Error fetching categories:', error)
        toast.error('Failed to load categories')
      }
    }
    
    fetchCategories()
  })
  
  const handleImageChange = (name: string, url: string) => {
    const currentImages = form.getValues('images')
    
    if (url === '') {
      // Remove the image at index 0 if it exists
      if (currentImages.length > 0) {
        const updatedImages = [...currentImages]
        updatedImages.splice(0, 1)
        form.setValue('images', updatedImages, { shouldValidate: true })
      }
    } else {
      // Add or update the first image
      const updatedImages = [...currentImages]
      updatedImages[0] = url
      form.setValue('images', updatedImages, { shouldValidate: true })
    }
  }
  
  const onSubmit = async (data: ProductFormValues) => {
    setIsSubmitting(true)
    
    try {
      const response = await fetch('/api/products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...data,
          // Convert images array to comma-separated string
          images: data.images.join(','),
        }),
      })
      
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || 'Failed to create product')
      }
      
      toast.success('Product created successfully')
      router.push('/dashboard/farmer/products')
    } catch (error) {
      console.error('Error creating product:', error)
      toast.error(error instanceof Error ? error.message : 'Failed to create product')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="container py-8">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/dashboard/farmer/products">
              <ArrowLeft className="h-5 w-5" />
            </Link>
          </Button>
          <h1 className="text-2xl font-bold">Add New Product</h1>
        </div>
        <Button 
          disabled={isSubmitting} 
          onClick={form.handleSubmit(onSubmit)}
          className="bg-green-600 hover:bg-green-700"
        >
          <Save className="mr-2 h-4 w-4" />
          {isSubmitting ? 'Saving...' : 'Save Product'}
        </Button>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Product Information</CardTitle>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form className="space-y-6">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Product Name <span className="text-destructive">*</span></FormLabel>
                        <FormControl>
                          <Input placeholder="Enter product name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Description <span className="text-destructive">*</span></FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Describe your product" 
                            rows={5}
                            {...field} 
                          />
                        </FormControl>
                        <FormDescription>
                          Provide a detailed description of your product
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="price"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Price (RWF) <span className="text-destructive">*</span></FormLabel>
                          <FormControl>
                            <Input 
                              type="number" 
                              min="0"
                              step="0.01"
                              placeholder="0.00" 
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="unit"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Unit <span className="text-destructive">*</span></FormLabel>
                          <Select 
                            onValueChange={field.onChange} 
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select unit" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="kg">Kilogram (kg)</SelectItem>
                              <SelectItem value="g">Gram (g)</SelectItem>
                              <SelectItem value="lb">Pound (lb)</SelectItem>
                              <SelectItem value="L">Liter (L)</SelectItem>
                              <SelectItem value="ml">Milliliter (ml)</SelectItem>
                              <SelectItem value="bundle">Bundle</SelectItem>
                              <SelectItem value="piece">Piece</SelectItem>
                              <SelectItem value="box">Box</SelectItem>
                              <SelectItem value="bag">Bag</SelectItem>
                              <SelectItem value="sack">Sack</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="quantity"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Available Quantity <span className="text-destructive">*</span></FormLabel>
                          <FormControl>
                            <Input 
                              type="number" 
                              min="1"
                              placeholder="1" 
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="categoryId"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Category <span className="text-destructive">*</span></FormLabel>
                          <Select 
                            onValueChange={field.onChange} 
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select category" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {categories.map((category) => (
                                <SelectItem key={category.id} value={category.id}>
                                  {category.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <Separator />
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="quality"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Quality Grade</FormLabel>
                          <Select 
                            onValueChange={field.onChange} 
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select quality grade" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="Premium">Premium</SelectItem>
                              <SelectItem value="Grade A">Grade A</SelectItem>
                              <SelectItem value="Grade B">Grade B</SelectItem>
                              <SelectItem value="Grade C">Grade C</SelectItem>
                              <SelectItem value="Standard">Standard</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormDescription>
                            Optional quality grading for your product
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="harvestDate"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Harvest Date</FormLabel>
                          <FormControl>
                            <Input 
                              type="date" 
                              {...field}
                            />
                          </FormControl>
                          <FormDescription>
                            When was this product harvested?
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <FormField
                    control={form.control}
                    name="expiryDate"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Expiry Date</FormLabel>
                        <FormControl>
                          <Input 
                            type="date" 
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>
                          When will this product expire?
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="isOrganic"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                          <div className="space-y-0.5">
                            <FormLabel className="text-base">Organic Product</FormLabel>
                            <FormDescription>
                              Mark this product as organically grown
                            </FormDescription>
                          </div>
                          <FormControl>
                            <Switch
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="featured"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                          <div className="space-y-0.5">
                            <FormLabel className="text-base">Featured Product</FormLabel>
                            <FormDescription>
                              Feature this product on the marketplace
                            </FormDescription>
                          </div>
                          <FormControl>
                            <Switch
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  </div>
                </form>
              </Form>
            </CardContent>
          </Card>
        </div>
        
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>Product Image</CardTitle>
            </CardHeader>
            <CardContent>
              <ImageUpload
                name="productImage"
                label="Product Image"
                currentImage={form.getValues('images')[0] || null}
                onImageChange={handleImageChange}
                isRequired={true}
                classNames="w-full h-60"
              />
              <FormDescription className="mt-2">
                Upload a high-quality image of your product. This will be the main image displayed on the marketplace.
              </FormDescription>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}