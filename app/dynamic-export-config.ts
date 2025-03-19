// app/dynamic-export-config.ts

// List all dynamic routes (client-only routes) that should not be prerendered
export const dynamicPaths = [
    '/auth/login',
    '/auth/register',
    '/contact',
    '/dashboard/farmer/products/add',
    '/dashboard/settings',
    '/dashboard/profile',
    '/marketplace/cart',
    '/marketplace/products',
    '/dashboard/buyer',
    '/dashboard/supplier',
    '/dashboard/processor',
    '/dashboard/farmer',
    '/marketplace/products/[id]'
  ];