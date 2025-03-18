// components/layout/footer.tsx
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Facebook, Twitter, Instagram, Linkedin, Mail, Phone, MapPin } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="bg-green-950 text-green-50">
      <div className="container px-4 md:px-6 py-12 md:py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="space-y-4">
            <div className="font-bold text-xl flex items-center gap-1">
              <span className="text-green-400">AGRI</span>
              <span>LINK</span>
            </div>
            <p className="text-green-200 text-sm">
              AGRILINK Rwanda is a comprehensive e-commerce platform designed to transform the agricultural sector in Rwanda through digital technology.
            </p>
            <div className="flex space-x-4">
              <Link href="#" className="text-green-200 hover:text-white">
                <Facebook className="h-5 w-5" />
                <span className="sr-only">Facebook</span>
              </Link>
              <Link href="#" className="text-green-200 hover:text-white">
                <Twitter className="h-5 w-5" />
                <span className="sr-only">Twitter</span>
              </Link>
              <Link href="#" className="text-green-200 hover:text-white">
                <Instagram className="h-5 w-5" />
                <span className="sr-only">Instagram</span>
              </Link>
              <Link href="#" className="text-green-200 hover:text-white">
                <Linkedin className="h-5 w-5" />
                <span className="sr-only">LinkedIn</span>
              </Link>
            </div>
          </div>
          
          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/marketplace/products" className="text-green-200 hover:text-white text-sm">
                  Marketplace
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-green-200 hover:text-white text-sm">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/dashboard/farmer/products/add" className="text-green-200 hover:text-white text-sm">
                  Sell on AGRILINK
                </Link>
              </li>
              <li>
                <Link href="/marketplace/products" className="text-green-200 hover:text-white text-sm">
                  Buy on AGRILINK
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-green-200 hover:text-white text-sm">
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>
          
          {/* Contact Info */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Contact Us</h3>
            <ul className="space-y-3">
              <li className="flex items-start space-x-2 text-sm">
                <MapPin className="h-5 w-5 text-green-400 shrink-0 mt-0.5" />
                <span className="text-green-200">KK 15 Ave, Kigali Innovation City<br/>Kigali, Rwanda</span>
              </li>
              <li className="flex items-center space-x-2 text-sm">
                <Phone className="h-5 w-5 text-green-400 shrink-0" />
                <span className="text-green-200">+250 788 123 456</span>
              </li>
              <li className="flex items-center space-x-2 text-sm">
                <Mail className="h-5 w-5 text-green-400 shrink-0" />
                <span className="text-green-200">info@agrilink.rw</span>
              </li>
            </ul>
          </div>
          
          {/* Newsletter */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Newsletter</h3>
            <p className="text-green-200 text-sm">
              Subscribe to our newsletter for the latest agricultural market updates and news.
            </p>
            <form className="flex flex-col space-y-2" onSubmit={(e) => {
              e.preventDefault();
              // Here you would handle the newsletter subscription
              // For now just provide visual feedback
              const input = e.currentTarget.querySelector('input');
              if (input && input.value) {
                alert(`Thank you for subscribing with: ${input.value}`);
                input.value = '';
              }
            }}>
              <Input 
                type="email" 
                placeholder="Your email" 
                className="bg-green-900 border-green-700 text-white placeholder:text-green-400"
                required
              />
              <Button type="submit" className="bg-green-600 hover:bg-green-700 w-full">
                Subscribe
              </Button>
            </form>
          </div>
        </div>
        
        <div className="border-t border-green-800 mt-8 pt-8 flex flex-col sm:flex-row justify-between items-center">
          <p className="text-green-400 text-sm">
            &copy; {new Date().getFullYear()} AGRILINK Rwanda. All rights reserved.
          </p>
          <div className="flex space-x-4 mt-4 sm:mt-0">
            <Link href="/terms" className="text-green-200 hover:text-white text-sm">
              Terms of Service
            </Link>
            <Link href="/privacy" className="text-green-200 hover:text-white text-sm">
              Privacy Policy
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}