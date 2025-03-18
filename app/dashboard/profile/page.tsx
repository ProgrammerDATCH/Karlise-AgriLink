// app/dashboard/profile/page.tsx
'use client'

import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { toast } from 'sonner'
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { User, Mail, Phone, MapPin, Save, Loader2 } from 'lucide-react'
import { useAuth } from '@/lib/providers/auth-context'
import ImageUpload from '@/components/shared/image-upload'

// Form validation schema for personal info
const personalInfoSchema = z.object({
  name: z.string().min(2, { message: 'Name must be at least 2 characters' }),
  email: z.string().email({ message: 'Please enter a valid email address' }).optional(),
  phone: z.string().min(10, { message: 'Please enter a valid phone number' }).optional(),
  image: z.string().optional(),
})

// Form validation schema for business info
const businessInfoSchema = z.object({
  location: z.string().min(2, { message: 'Location must be at least 2 characters' }),
  description: z.string().optional(),
  specializations: z.string().optional(),
  certifications: z.string().optional(),
  farmSize: z.coerce.number().optional(),
})

type PersonalInfoValues = z.infer<typeof personalInfoSchema>
type BusinessInfoValues = z.infer<typeof businessInfoSchema>

export default function ProfilePage() {
  const { user } = useAuth()
  const [isLoading, setIsLoading] = useState(false)
  const [profileData, setProfileData] = useState<any>(null)
  const [activeTab, setActiveTab] = useState('personal')
  
  // Personal info form
  const personalForm = useForm<PersonalInfoValues>({
    resolver: zodResolver(personalInfoSchema),
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      image: '',
    },
  })
  
  // Business info form
  const businessForm = useForm<BusinessInfoValues>({
    resolver: zodResolver(businessInfoSchema),
    defaultValues: {
      location: '',
      description: '',
      specializations: '',
      certifications: '',
      farmSize: undefined,
    },
  })
  
  // Fetch profile data when component mounts
  useEffect(() => {
    const fetchProfileData = async () => {
      if (!user) return
      
      setIsLoading(true)
      try {
        const response = await fetch(`/api/users/${user.id}/profile`)
        
        if (!response.ok) {
          throw new Error('Failed to fetch profile data')
        }
        
        const data = await response.json()
        setProfileData(data)
        
        // Set form values for personal info
        personalForm.reset({
          name: data.name || '',
          email: data.email || '',
          phone: data.phone || '',
          image: data.image || '',
        })
        
        // Set form values for business info based on role
        if (data.farmer) {
          businessForm.reset({
            location: data.farmer.location || '',
            description: data.farmer.description || '',
            specializations: data.farmer.specializations || '',
            certifications: data.farmer.certifications || '',
            farmSize: data.farmer.farmSize || undefined,
          })
        } else if (data.buyer) {
          // Handle buyer profile data
          businessForm.reset({
            location: data.buyer.location || '',
            description: data.buyer.description || '',
          })
        }
        // Add similar handling for other roles
        
      } catch (error) {
        console.error('Error fetching profile data:', error)
        toast.error('Failed to load profile data')
      } finally {
        setIsLoading(false)
      }
    }
    
    fetchProfileData()
  }, [user, personalForm, businessForm])
  
  const onPersonalSubmit = async (data: PersonalInfoValues) => {
    if (!user) return
    
    setIsLoading(true)
    try {
      const response = await fetch(`/api/users/${user.id}/profile`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          personalInfo: data,
        }),
      })
      
      if (!response.ok) {
        throw new Error('Failed to update profile')
      }
      
      toast.success('Personal information updated successfully')
    } catch (error) {
      console.error('Error updating profile:', error)
      toast.error('Failed to update profile')
    } finally {
      setIsLoading(false)
    }
  }
  
  const onBusinessSubmit = async (data: BusinessInfoValues) => {
    if (!user) return
    
    setIsLoading(true)
    try {
      const response = await fetch(`/api/users/${user.id}/profile`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          businessInfo: data,
          role: user.role,
        }),
      })
      
      if (!response.ok) {
        throw new Error('Failed to update business information')
      }
      
      toast.success('Business information updated successfully')
    } catch (error) {
      console.error('Error updating business information:', error)
      toast.error('Failed to update business information')
    } finally {
      setIsLoading(false)
    }
  }
  
  const handleImageChange = (name: string, url: string) => {
    personalForm.setValue('image', url, { shouldValidate: true })
  }
  
  if (!user) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <p className="text-lg">Please log in to view your profile.</p>
      </div>
    )
  }
  
  return (
    <div className="container py-8">
      <h1 className="text-3xl font-bold mb-8">My Profile</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Profile Summary Card */}
        <Card className="lg:col-span-1">
          <CardContent className="pt-6">
            <div className="flex flex-col items-center text-center">
              <Avatar className="h-32 w-32">
                <AvatarImage src={profileData?.image || ''} alt={profileData?.name || ''} />
                <AvatarFallback className="text-3xl">
                  {profileData?.name?.[0] || user.name?.[0] || 'U'}
                </AvatarFallback>
              </Avatar>
              <h2 className="mt-4 text-xl font-bold">{profileData?.name || user.name}</h2>
              <p className="text-sm text-muted-foreground capitalize">{user.role?.toLowerCase()}</p>
              
              <div className="mt-6 space-y-2 w-full">
                <div className="flex items-center text-sm">
                  <Mail className="mr-2 h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground">{profileData?.email || user.email}</span>
                </div>
                {profileData?.phone && (
                  <div className="flex items-center text-sm">
                    <Phone className="mr-2 h-4 w-4 text-muted-foreground" />
                    <span className="text-muted-foreground">{profileData.phone}</span>
                  </div>
                )}
                {profileData?.farmer?.location && (
                  <div className="flex items-center text-sm">
                    <MapPin className="mr-2 h-4 w-4 text-muted-foreground" />
                    <span className="text-muted-foreground">{profileData.farmer.location}</span>
                  </div>
                )}
              </div>
              
              <div className="mt-6 pt-6 border-t w-full">
                <h3 className="font-medium text-sm mb-2">Account Information</h3>
                <div className="text-sm text-muted-foreground">
                  <p>Member since: {new Date(profileData?.createdAt || Date.now()).toLocaleDateString()}</p>
                  <p>User ID: {user.id}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        {/* Profile Edit Forms */}
        <div className="lg:col-span-3">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="mb-4">
              <TabsTrigger value="personal">Personal Information</TabsTrigger>
              <TabsTrigger value="business">Business Information</TabsTrigger>
            </TabsList>
            
            <TabsContent value="personal">
              <Card>
                <CardHeader>
                  <CardTitle>Personal Information</CardTitle>
                  <CardDescription>
                    Update your personal details and profile photo
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Form {...personalForm}>
                    <form onSubmit={personalForm.handleSubmit(onPersonalSubmit)} className="space-y-6">
                      <div className="flex flex-col md:flex-row gap-8 items-start">
                        <FormField
                          control={personalForm.control}
                          name="image"
                          render={({ field }) => (
                            <div className="md:w-1/3">
                              <FormItem>
                                <FormLabel>Profile Photo</FormLabel>
                                <FormControl>
                                  <ImageUpload
                                    name="profileImage"
                                    label="Profile Photo"
                                    currentImage={field.value || null}
                                    onImageChange={handleImageChange}
                                    isRequired={false}
                                    classNames="w-40 h-40 mx-auto"
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            </div>
                          )}
                        />
                        
                        <div className="md:w-2/3 space-y-6">
                          <FormField
                            control={personalForm.control}
                            name="name"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Full Name</FormLabel>
                                <FormControl>
                                  <Input placeholder="Your full name" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          
                          <FormField
                            control={personalForm.control}
                            name="email"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Email Address</FormLabel>
                                <FormControl>
                                  <Input placeholder="Your email" {...field} disabled />
                                </FormControl>
                                <FormDescription>
                                  Email address cannot be changed
                                </FormDescription>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          
                          <FormField
                            control={personalForm.control}
                            name="phone"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Phone Number</FormLabel>
                                <FormControl>
                                  <Input placeholder="+250 788 123 456" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                      </div>
                      
                      <div className="flex justify-end">
                        <Button 
                          type="submit" 
                          className="bg-green-600 hover:bg-green-700"
                          disabled={isLoading || !personalForm.formState.isDirty}
                        >
                          {isLoading ? (
                            <>
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                              Saving...
                            </>
                          ) : (
                            <>
                              <Save className="mr-2 h-4 w-4" />
                              Save Changes
                            </>
                          )}
                        </Button>
                      </div>
                    </form>
                  </Form>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="business">
              <Card>
                <CardHeader>
                  <CardTitle>Business Information</CardTitle>
                  <CardDescription>
                    Update details about your business or farm
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Form {...businessForm}>
                    <form onSubmit={businessForm.handleSubmit(onBusinessSubmit)} className="space-y-6">
                      <FormField
                        control={businessForm.control}
                        name="location"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Location</FormLabel>
                            <FormControl>
                              <Input placeholder="City, Province" {...field} />
                            </FormControl>
                            <FormDescription>
                              Your primary business or farm location
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      {user.role === 'FARMER' && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <FormField
                            control={businessForm.control}
                            name="farmSize"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Farm Size (Hectares)</FormLabel>
                                <FormControl>
                                  <Input 
                                    type="number" 
                                    placeholder="0.5" 
                                    {...field}
                                    value={field.value === undefined ? '' : field.value}
                                    onChange={(e) => field.onChange(e.target.value === '' ? undefined : parseFloat(e.target.value))}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          
                          <FormField
                            control={businessForm.control}
                            name="specializations"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Specializations</FormLabel>
                                <FormControl>
                                  <Input placeholder="Coffee, Potatoes, Dairy" {...field} />
                                </FormControl>
                                <FormDescription>
                                  Comma-separated list of your specializations
                                </FormDescription>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                      )}
                      
                      <FormField
                        control={businessForm.control}
                        name="description"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Description</FormLabel>
                            <FormControl>
                              <Textarea 
                                placeholder="Tell us about your business or farm" 
                                className="min-h-32"
                                {...field} 
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      {user.role === 'FARMER' && (
                        <FormField
                          control={businessForm.control}
                          name="certifications"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Certifications</FormLabel>
                              <FormControl>
                                <Input placeholder="Organic, Fair Trade, etc." {...field} />
                              </FormControl>
                              <FormDescription>
                                List any certifications or quality standards you hold
                              </FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      )}
                      
                      <div className="flex justify-end">
                        <Button 
                          type="submit" 
                          className="bg-green-600 hover:bg-green-700"
                          disabled={isLoading || !businessForm.formState.isDirty}
                        >
                          {isLoading ? (
                            <>
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                              Saving...
                            </>
                          ) : (
                            <>
                              <Save className="mr-2 h-4 w-4" />
                              Save Changes
                            </>
                          )}
                        </Button>
                      </div>
                    </form>
                  </Form>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}