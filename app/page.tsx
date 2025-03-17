import Link from 'next/link'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import ProductFeatureGrid from '@/components/marketplace/product-feature-grid'
import CategoriesShowcase from '@/components/marketplace/categories-showcase'
import ValuePropositionSection from '@/components/home/value-proposition-section'
import TestimonialsSection from '@/components/home/testimonials-section'
import HowItWorksSection from '@/components/home/how-it-works-section'

export default function Home() {
  return (
    <main className="flex-1">
      {/* Hero Section */}
      <section className="relative py-20 md:py-32 bg-gradient-to-b from-green-50 to-white dark:from-green-950 dark:to-background">
        <div className="container px-4 md:px-6">
          <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 items-center">
            <div className="flex flex-col justify-center space-y-4">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none">
                  Connecting Rwanda's Agricultural Market
                </h1>
                <p className="max-w-[600px] text-gray-500 md:text-xl dark:text-gray-400">
                  AGRILINK Rwanda provides a digital marketplace connecting farmers, buyers, 
                  processors, and distributors to transform agricultural trade in Rwanda.
                </p>
              </div>
              <div className="flex flex-col gap-2 min-[400px]:flex-row">
                <Button asChild size="lg" className="bg-green-600 hover:bg-green-700">
                  <Link href="/marketplace">
                    Explore Marketplace
                  </Link>
                </Button>
                <Button asChild variant="outline" size="lg">
                  <Link href="/auth/register">
                    Join AGRILINK
                  </Link>
                </Button>
              </div>
            </div>
            <div className="relative lg:pl-6">
              <Image 
                src="/images/hero-image.jpg" 
                alt="Farmers in Rwanda"
                width={600}
                height={400}
                className="mx-auto aspect-video overflow-hidden rounded-xl object-cover"
                priority
              />
            </div>
          </div>
        </div>
      </section>

      {/* Value Proposition Section */}
      <ValuePropositionSection />

      {/* Featured Products */}
      <section className="py-12 md:py-16 bg-green-50 dark:bg-green-950/20">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Featured Products</h2>
              <p className="max-w-[900px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400">
                Discover quality agricultural products from Rwanda's best farmers
              </p>
            </div>
          </div>
          <ProductFeatureGrid />
          <div className="flex justify-center mt-10">
            <Button asChild className="bg-green-600 hover:bg-green-700">
              <Link href="/marketplace/products">
                View All Products
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-12 md:py-16">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Product Categories</h2>
              <p className="max-w-[900px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400">
                Browse agricultural products by category
              </p>
            </div>
          </div>
          <CategoriesShowcase />
        </div>
      </section>

      {/* How It Works Section */}
      <HowItWorksSection />

      {/* Testimonials Section */}
      <TestimonialsSection />

      {/* CTA Section */}
      <section className="py-12 md:py-16 bg-green-600 text-white">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Ready to Transform Your Agricultural Business?</h2>
              <p className="max-w-[900px] text-green-50 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                Join AGRILINK Rwanda today and connect with agricultural opportunities across Rwanda
              </p>
            </div>
            <div className="flex flex-col gap-2 min-[400px]:flex-row">
              <Button asChild size="lg" variant="secondary">
                <Link href="/auth/register">
                  Register Now
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="bg-transparent text-white border-white hover:bg-green-700 hover:text-white">
                <Link href="/contact">
                  Contact Us
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}