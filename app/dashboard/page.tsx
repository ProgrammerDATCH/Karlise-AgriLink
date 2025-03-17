'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { 
  Sheet, 
  SheetContent, 
  SheetTrigger 
} from '@/components/ui/sheet'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu'
import {
  User,
  Home,
  Package,
  ShoppingCart,
  BarChart2,
  FileText,
  Settings,
  HelpCircle,
  Bell,
  LogOut,
  Menu,
  X,
} from 'lucide-react'
import { ModeToggle } from '@/components/shared/theme-toggle'

interface DashboardLayoutProps {
  children: React.ReactNode
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const pathname = usePathname()
  const [isOpen, setIsOpen] = useState(false)
  
  // Mock user data - replace with real auth state
  const user = {
    name: 'Jean Mugabo',
    email: 'jean.mugabo@example.com',
    role: 'FARMER',
    image: '/images/avatars/farmer1.jpg',
  }
  
  const sidebarItems = [
    {
      title: 'Dashboard',
      href: '/dashboard/farmer',
      icon: <Home className="w-5 h-5" />,
      roles: ['ADMIN', 'FARMER', 'BUYER', 'SUPPLIER', 'PROCESSOR'],
    },
    {
      title: 'My Products',
      href: '/dashboard/farmer/products',
      icon: <Package className="w-5 h-5" />,
      roles: ['FARMER', 'SUPPLIER'],
    },
    {
      title: 'Orders',
      href: '/dashboard/farmer/orders',
      icon: <ShoppingCart className="w-5 h-5" />,
      roles: ['ADMIN', 'FARMER', 'BUYER', 'SUPPLIER', 'PROCESSOR'],
    },
    {
      title: 'Analytics',
      href: '/dashboard/farmer/analytics',
      icon: <BarChart2 className="w-5 h-5" />,
      roles: ['ADMIN', 'FARMER', 'BUYER', 'SUPPLIER', 'PROCESSOR'],
    },
    {
      title: 'Reports',
      href: '/dashboard/farmer/reports',
      icon: <FileText className="w-5 h-5" />,
      roles: ['ADMIN', 'FARMER', 'BUYER', 'SUPPLIER', 'PROCESSOR'],
    },
    {
      title: 'Settings',
      href: '/dashboard/farmer/settings',
      icon: <Settings className="w-5 h-5" />,
      roles: ['ADMIN', 'FARMER', 'BUYER', 'SUPPLIER', 'PROCESSOR'],
    },
    {
      title: 'Help',
      href: '/dashboard/farmer/help',
      icon: <HelpCircle className="w-5 h-5" />,
      roles: ['ADMIN', 'FARMER', 'BUYER', 'SUPPLIER', 'PROCESSOR'],
    },
  ]
  
  // Filter sidebar items based on user role
  const filteredSidebarItems = sidebarItems.filter(item => 
    item.roles.includes(user.role)
  )

  return (
    <div className="flex min-h-screen bg-background">
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex md:w-64 md:flex-col md:fixed md:inset-y-0 z-80">
        <div className="flex flex-col flex-1 min-h-0 border-r bg-card">
          <div className="flex items-center h-16 flex-shrink-0 px-4 border-b">
            <Link href="/" className="items-center space-x-2 flex">
              <span className="font-bold text-xl flex items-center gap-1">
                <span className="text-green-600">AGRI</span>
                <span>LINK</span>
              </span>
            </Link>
          </div>
          <div className="flex-1 flex flex-col pt-5 pb-4 overflow-y-auto">
            <nav className="mt-5 flex-1 px-2 space-y-1">
              {filteredSidebarItems.map((item) => (
                <Link
                  key={item.title}
                  href={item.href}
                  className={cn(
                    "group flex items-center px-2 py-2 text-base font-medium rounded-md",
                    pathname === item.href
                      ? "bg-green-600 text-white"
                      : "text-foreground hover:bg-muted"
                  )}
                >
                  {item.icon}
                  <span className="ml-3">{item.title}</span>
                </Link>
              ))}
            </nav>
          </div>
          <div className="flex-shrink-0 flex border-t p-4">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="flex items-center w-full text-left">
                  <div className="flex items-center">
                    <Avatar className="h-8 w-8 mr-2">
                      <AvatarImage src={user.image} alt={user.name} />
                      <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div className="ml-1">
                      <p className="text-sm font-medium">{user.name}</p>
                      <p className="text-xs text-muted-foreground">{user.role.toLowerCase()}</p>
                    </div>
                  </div>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <User className="mr-2 h-4 w-4" />
                  <span>Profile</span>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Settings</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Logout</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </aside>

      {/* Mobile Sidebar */}
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetTrigger asChild className="md:hidden">
          <Button variant="ghost" size="icon" className="absolute left-4 top-4">
            <Menu className="h-6 w-6" />
            <span className="sr-only">Open sidebar</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-72 p-0">
          <div className="flex flex-col h-full">
            <div className="flex items-center h-16 flex-shrink-0 px-4 border-b">
              <Link href="/" className="items-center space-x-2 flex" onClick={() => setIsOpen(false)}>
                <span className="font-bold text-xl flex items-center gap-1">
                  <span className="text-green-600">AGRI</span>
                  <span>LINK</span>
                </span>
              </Link>
              <Button variant="ghost" size="icon" className="ml-auto" onClick={() => setIsOpen(false)}>
                <X className="h-5 w-5" />
              </Button>
            </div>
            <div className="flex-1 overflow-y-auto">
              <nav className="p-4 space-y-1">
                {filteredSidebarItems.map((item) => (
                  <Link
                    key={item.title}
                    href={item.href}
                    className={cn(
                      "group flex items-center px-2 py-2 text-base font-medium rounded-md",
                      pathname === item.href
                        ? "bg-green-600 text-white"
                        : "text-foreground hover:bg-muted"
                    )}
                    onClick={() => setIsOpen(false)}
                  >
                    {item.icon}
                    <span className="ml-3">{item.title}</span>
                  </Link>
                ))}
              </nav>
            </div>
            <div className="flex-shrink-0 flex border-t p-4">
              <div className="flex items-center w-full">
                <Avatar className="h-9 w-9">
                  <AvatarImage src={user.image} alt={user.name} />
                  <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div className="ml-3">
                  <p className="text-sm font-medium">{user.name}</p>
                  <p className="text-xs text-muted-foreground">{user.role.toLowerCase()}</p>
                </div>
                <Button variant="ghost" size="icon" className="ml-auto">
                  <LogOut className="h-5 w-5" />
                </Button>
              </div>
            </div>
          </div>
        </SheetContent>
      </Sheet>

      {/* Main Content */}
      <div className="md:pl-64 flex flex-col flex-1">
        <div className="sticky top-0 z-10 flex-shrink-0 h-16 bg-background border-b flex">
          <button
            type="button"
            className="md:hidden px-4 text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-green-500"
            onClick={() => setIsOpen(true)}
          >
            <span className="sr-only">Open sidebar</span>
            <Menu className="h-6 w-6" aria-hidden="true" />
          </button>
          <div className="flex-1 px-4 flex justify-end">
            <div className="ml-4 flex items-center md:ml-6 space-x-3">
              <Button variant="ghost" size="icon">
                <Bell className="h-5 w-5" />
              </Button>
              <ModeToggle />
            </div>
          </div>
        </div>

        <main className="flex-1">
          <div className="py-6">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
              {children}
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}