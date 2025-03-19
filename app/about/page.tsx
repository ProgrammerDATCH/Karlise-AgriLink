'use client'

import Image from 'next/image'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { CheckCircle } from 'lucide-react'

export default function AboutPage() {
  return (
    <main className="container mx-auto px-4 py-12">
      {/* Hero section */}
      <section className="py-12 md:py-24 flex flex-col-reverse md:flex-row items-center gap-8 md:gap-16">
        <div className="md:w-1/2 space-y-6">
          <h1 className="text-4xl md:text-5xl font-bold leading-tight tracking-tighter">
            Transforming Agricultural Commerce in Rwanda
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400">
            AGRILINK Rwanda is building a digital ecosystem that connects farmers, buyers, processors, and distributors across Rwanda's agricultural value chain.
          </p>
          <Button className="bg-green-600 hover:bg-green-700" size="lg" asChild>
            <Link href="/auth/register">Join Our Community</Link>
          </Button>
        </div>
        <div className="md:w-1/2 relative h-64 md:h-96 w-full rounded-lg overflow-hidden">
          <Image 
            src="/images/about/farmers-market.jpg" 
            alt="Rwandan Farmers Market"
            fill
            className="object-cover"
          />
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-12 md:py-24">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          <div className="space-y-6 p-8 bg-green-50 dark:bg-green-900/20 rounded-lg">
            <h2 className="text-3xl font-bold">Our Mission</h2>
            <p className="text-lg text-gray-600 dark:text-gray-400">
              To empower Rwandan farmers by creating a transparent and efficient marketplace that increases their income and improves access to quality agricultural products for consumers and businesses.
            </p>
          </div>
          <div className="space-y-6 p-8 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
            <h2 className="text-3xl font-bold">Our Vision</h2>
            <p className="text-lg text-gray-600 dark:text-gray-400">
              A thriving agricultural sector in Rwanda where technology bridges the gap between rural producers and urban markets, creating sustainable economic growth and food security.
            </p>
          </div>
        </div>
      </section>

      {/* Story */}
      <section className="py-12 md:py-24">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Our Story</h2>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
            How AGRILINK Rwanda came to be and our journey so far
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div className="relative h-80 w-full rounded-lg overflow-hidden">
            <Image
              src="/images/about/founder.jpg"
              alt="AGRILINK Rwanda Founder"
              fill
              className="object-cover"
            />
          </div>
          <div className="space-y-6">
            <h3 className="text-2xl font-bold">From Challenge to Opportunity</h3>
            <p className="text-lg text-gray-600 dark:text-gray-400">
              AGRILINK Rwanda was founded in 2023 after our founder witnessed the challenges faced by small-scale farmers in accessing profitable markets. Despite growing high-quality products, many farmers were forced to sell at low prices to intermediaries due to limited market access.
            </p>
            <p className="text-lg text-gray-600 dark:text-gray-400">
              With a background in technology and agriculture, our team saw an opportunity to leverage digital solutions to connect farmers directly with buyers, processors, and exporters across Rwanda and beyond.
            </p>
            <p className="text-lg text-gray-600 dark:text-gray-400">
              Since our launch, we've connected over 1,000 farmers with reliable buyers, resulting in an average income increase of 35% for participating producers.
            </p>
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-12 md:py-24">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Our Team</h2>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
            The dedicated professionals making AGRILINK Rwanda possible
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {[
            {
              name: "Jean Mugabo",
              role: "Founder & CEO",
              image: "/images/team/ceo.jpg",
              bio: "Agricultural economist with 15 years of experience in Rwanda's agricultural sector."
            },
            {
              name: "Marie Uwimana",
              role: "Chief Technology Officer",
              image: "/images/team/cto.jpg",
              bio: "Software engineer with a passion for applying technology to solve rural challenges."
            },
            {
              name: "Emmanuel Niyonkuru",
              role: "Operations Director",
              image: "/images/team/operations.jpg",
              bio: "Logistics expert with extensive experience in agricultural supply chains."
            },
            {
              name: "Alice Mukamana",
              role: "Community Relations",
              image: "/images/team/community.jpg",
              bio: "Former extension officer who has worked with farmer cooperatives across Rwanda."
            }
          ].map((member, index) => (
            <div key={index} className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
              <div className="relative h-64 w-full">
                <Image
                  src={member.image}
                  alt={member.name}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold mb-1">{member.name}</h3>
                <p className="text-green-600 dark:text-green-400 font-medium mb-3">{member.role}</p>
                <p className="text-gray-600 dark:text-gray-400">{member.bio}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Impact */}
      <section className="py-12 md:py-24 bg-green-50 dark:bg-green-900/10 rounded-lg">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Our Impact</h2>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
            Making a difference in Rwanda's agricultural ecosystem
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-8 text-center">
            <div className="text-4xl font-bold text-green-600 mb-4">35%</div>
            <h3 className="text-xl font-semibold mb-2">Income Increase</h3>
            <p className="text-gray-600 dark:text-gray-400">
              Average income increase for farmers selling through our platform.
            </p>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg p-8 text-center">
            <div className="text-4xl font-bold text-green-600 mb-4">1,200+</div>
            <h3 className="text-xl font-semibold mb-2">Connected Farmers</h3>
            <p className="text-gray-600 dark:text-gray-400">
              Small and medium-scale farmers now connected to reliable markets.
            </p>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg p-8 text-center">
            <div className="text-4xl font-bold text-green-600 mb-4">15</div>
            <h3 className="text-xl font-semibold mb-2">Districts Covered</h3>
            <p className="text-gray-600 dark:text-gray-400">
              Our services now reach farmers across 15 districts in Rwanda.
            </p>
          </div>
        </div>
      </section>

      {/* Partners */}
      <section className="py-12 md:py-24">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Our Partners</h2>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
            Organizations supporting our mission
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 items-center">
          {[
            { name: "Rwanda Development Board", logo: "/images/partners/rdb.png" },
            { name: "Ministry of Agriculture", logo: "/images/partners/minagri.png" },
            { name: "Rwanda Agricultural Board", logo: "/images/partners/rab.png" },
            { name: "National Agricultural Export Development Board", logo: "/images/partners/naeb.png" },
          ].map((partner, index) => (
            <div key={index} className="bg-white dark:bg-gray-800 p-6 rounded-lg flex items-center justify-center h-24">
              <div className="relative h-16 w-full">
                <Image
                  src={partner.logo}
                  alt={partner.name}
                  fill
                  className="object-contain"
                />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-12 md:py-24 text-center">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Join the Agricultural Revolution in Rwanda</h2>
          <p className="text-xl text-gray-600 dark:text-gray-400 mb-8">
            Whether you're a farmer looking to expand your market reach, a buyer seeking quality produce, or a processor in need of consistent raw materials, AGRILINK Rwanda offers the platform to connect and thrive.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button className="bg-green-600 hover:bg-green-700" size="lg" asChild>
              <Link href="/auth/register">Sign Up Today</Link>
            </Button>
            <Button variant="outline" size="lg" asChild>
              <Link href="/contact">Contact Us</Link>
            </Button>
          </div>
        </div>
      </section>
    </main>
  )
}