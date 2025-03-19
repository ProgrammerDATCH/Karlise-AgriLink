'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { toast } from 'sonner'
import { Mail, Phone, MapPin, Send, Check } from 'lucide-react'

import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
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
  SelectValue 
} from '@/components/ui/select'

const contactFormSchema = z.object({
  name: z.string().min(2, { message: 'Name must be at least 2 characters' }),
  email: z.string().email({ message: 'Please enter a valid email address' }),
  phone: z.string().optional(),
  subject: z.string().min(1, { message: 'Please select a subject' }),
  message: z.string().min(10, { message: 'Message must be at least 10 characters' }),
})

type ContactFormValues = z.infer<typeof contactFormSchema>

export default function ContactPage() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)

  const form = useForm<ContactFormValues>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      subject: '',
      message: '',
    },
  })

  async function onSubmit(data: ContactFormValues) {
    setIsSubmitting(true)
    
    try {
      // In a real application, you would send the data to your API
      await new Promise(resolve => setTimeout(resolve, 1500)) // Simulate API call
      
      console.log('Contact form data:', data)
      
      // Show success message
      toast.success('Message sent successfully', {
        description: 'We will get back to you as soon as possible.',
      })
      
      // Reset form
      form.reset()
      setIsSuccess(true)
      
      // Reset success state after 5 seconds
      setTimeout(() => {
        setIsSuccess(false)
      }, 5000)
      
    } catch (error) {
      console.error('Error sending message:', error)
      toast.error('Failed to send message', {
        description: 'Please try again later.',
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <main className="container mx-auto px-4 py-12">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Contact Us</h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
            Have questions or feedback? We'd love to hear from you. Get in touch with the AGRILINK Rwanda team.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Contact Information */}
          <div className="lg:col-span-1 space-y-8">
            <div className="bg-white dark:bg-gray-800 rounded-lg p-8 shadow-sm">
              <h2 className="text-2xl font-bold mb-6">Contact Information</h2>
              
              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <MapPin className="h-6 w-6 text-green-600 shrink-0 mt-0.5" />
                  <div>
                    <h3 className="font-semibold mb-1">Address</h3>
                    <p className="text-gray-600 dark:text-gray-400">
                      KK 15 Ave, Kigali Innovation City<br />
                      Kigali, Rwanda
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-4">
                  <Phone className="h-6 w-6 text-green-600 shrink-0 mt-0.5" />
                  <div>
                    <h3 className="font-semibold mb-1">Phone</h3>
                    <p className="text-gray-600 dark:text-gray-400">
                      +250 788 123 456
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-4">
                  <Mail className="h-6 w-6 text-green-600 shrink-0 mt-0.5" />
                  <div>
                    <h3 className="font-semibold mb-1">Email</h3>
                    <p className="text-gray-600 dark:text-gray-400">
                      info@agrilink.rw
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="mt-12">
                <h3 className="font-semibold mb-3">Working Hours</h3>
                <div className="space-y-2 text-gray-600 dark:text-gray-400">
                  <p className="flex justify-between">
                    <span>Monday - Friday:</span>
                    <span>8:00 AM - 5:00 PM</span>
                  </p>
                  <p className="flex justify-between">
                    <span>Saturday:</span>
                    <span>9:00 AM - 1:00 PM</span>
                  </p>
                  <p className="flex justify-between">
                    <span>Sunday:</span>
                    <span>Closed</span>
                  </p>
                </div>
              </div>
            </div>
            
            <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-8">
              <h2 className="text-2xl font-bold mb-4">Follow Us</h2>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                Stay updated with our latest news and announcements.
              </p>
              <div className="flex space-x-4">
                <a href="#" className="bg-white dark:bg-gray-800 rounded-full p-3 hover:bg-green-100 dark:hover:bg-green-900/50 transition-colors">
                  <svg className="h-5 w-5 text-green-600" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
                  </svg>
                </a>
                <a href="#" className="bg-white dark:bg-gray-800 rounded-full p-3 hover:bg-green-100 dark:hover:bg-green-900/50 transition-colors">
                  <svg className="h-5 w-5 text-green-600" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                  </svg>
                </a>
                <a href="#" className="bg-white dark:bg-gray-800 rounded-full p-3 hover:bg-green-100 dark:hover:bg-green-900/50 transition-colors">
                  <svg className="h-5 w-5 text-green-600" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clipRule="evenodd" />
                  </svg>
                </a>
                <a href="#" className="bg-white dark:bg-gray-800 rounded-full p-3 hover:bg-green-100 dark:hover:bg-green-900/50 transition-colors">
                  <svg className="h-5 w-5 text-green-600" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path fillRule="evenodd" d="M19 3a2 2 0 012 2v14a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h14m-.5 15.5v-5.3a3.26 3.26 0 00-3.26-3.26c-.85 0-1.84.52-2.32 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 011.4 1.4v4.93h2.79M6.88 8.56a1.68 1.68 0 001.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 00-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z" clipRule="evenodd" />
                  </svg>
                </a>
              </div>
            </div>
          </div>
          
          {/* Contact Form */}
          <div className="lg:col-span-2">
            <div className="bg-white dark:bg-gray-800 rounded-lg p-8 shadow-sm">
              <h2 className="text-2xl font-bold mb-6">Send us a Message</h2>
              
              {isSuccess ? (
                <div className="rounded-lg bg-green-50 dark:bg-green-900/20 p-6 flex items-start space-x-4">
                  <div className="rounded-full bg-green-100 dark:bg-green-900/50 p-2">
                    <Check className="h-6 w-6 text-green-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold mb-1">Message Sent!</h3>
                    <p className="text-gray-600 dark:text-gray-400">
                      Thank you for reaching out. Our team will get back to you as soon as possible.
                    </p>
                  </div>
                </div>
              ) : (
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Full Name <span className="text-red-500">*</span></FormLabel>
                            <FormControl>
                              <Input placeholder="Your full name" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Email <span className="text-red-500">*</span></FormLabel>
                            <FormControl>
                              <Input placeholder="your.email@example.com" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <FormField
                        control={form.control}
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
                      <FormField
                        control={form.control}
                        name="subject"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Subject <span className="text-red-500">*</span></FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select a subject" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="general">General Inquiry</SelectItem>
                                <SelectItem value="support">Technical Support</SelectItem>
                                <SelectItem value="partnership">Partnership Opportunity</SelectItem>
                                <SelectItem value="feedback">Feedback</SelectItem>
                                <SelectItem value="other">Other</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    
                    <FormField
                      control={form.control}
                      name="message"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Message <span className="text-red-500">*</span></FormLabel>
                          <FormControl>
                            <Textarea 
                              placeholder="How can we help you today?" 
                              rows={6}
                              {...field} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <Button 
                      type="submit" 
                      className="w-full bg-green-600 hover:bg-green-700"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? (
                        <div className="flex items-center">
                          <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Sending...
                        </div>
                      ) : (
                        <div className="flex items-center">
                          <Send className="mr-2 h-4 w-4" />
                          Send Message
                        </div>
                      )}
                    </Button>
                  </form>
                </Form>
              )}
            </div>
          </div>
        </div>
        
        {/* Map Section */}
        <div className="mt-16">
          <div className="bg-white dark:bg-gray-800 rounded-lg overflow-hidden shadow-sm">
            <h2 className="text-2xl font-bold p-8 pb-4">Find Us</h2>
            <div className="aspect-[16/9] w-full">
              <iframe 
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3987.5105994665394!2d30.057678674857482!3d-1.9441196980198783!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x19dca5a86e051d59%3A0xd37dabac7a658c51!2sKigali%20Innovation%20City!5e0!3m2!1sen!2sus!4v1709927127650!5m2!1sen!2sus" 
                width="100%" 
                height="100%" 
                style={{ border: 0 }} 
                allowFullScreen 
                loading="lazy" 
                referrerPolicy="no-referrer-when-downgrade"
              ></iframe>
            </div>
          </div>
        </div>
        
        {/* FAQ Section */}
        <div className="mt-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Frequently Asked Questions</h2>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
              Find answers to common questions about AGRILINK Rwanda
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[
              {
                question: "How do I register as a farmer on AGRILINK?",
                answer: "To register as a farmer on AGRILINK Rwanda, click the 'Sign Up' button, select 'Farmer' as your role, and complete the registration form. Once registered, you can set up your profile and start listing your products."
              },
              {
                question: "What types of agricultural products can be sold on the platform?",
                answer: "AGRILINK Rwanda supports a wide range of agricultural products including crops, fruits, vegetables, dairy, livestock products, processed foods, and agricultural inputs. If your product is agricultural in nature, it can likely be listed on our platform."
              },
              {
                question: "How does payment processing work?",
                answer: "AGRILINK Rwanda offers multiple payment options including mobile money, bank transfers, and cash on delivery. Our secure payment system ensures that farmers receive payment promptly once goods are delivered and verified by the buyer."
              },
              {
                question: "Is there a fee to use AGRILINK Rwanda?",
                answer: "Basic registration and product listing is free. AGRILINK Rwanda charges a small commission (5%) on completed sales. There are no monthly fees or hidden charges."
              },
              {
                question: "How is product quality ensured?",
                answer: "We implement a rating and review system that allows buyers to provide feedback on product quality. Additionally, sellers must adhere to our quality standards, and we conduct random quality checks at collection points."
              },
              {
                question: "Can I use AGRILINK Rwanda if I'm not in Kigali?",
                answer: "Yes! AGRILINK Rwanda serves farmers and buyers across all provinces in Rwanda. Our logistics network ensures products can be delivered regardless of location within the country."
              },
            ].map((faq, index) => (
              <div key={index} className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
                <h3 className="text-lg font-semibold mb-3">{faq.question}</h3>
                <p className="text-gray-600 dark:text-gray-400">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  )
}