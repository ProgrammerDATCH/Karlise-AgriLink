// app/api/cart/route.ts
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";
import { isAuthenticated } from "@/lib/auth";

// Get user's cart
export async function GET(request: NextRequest) {
  try {
    const { isAuth, user } = await isAuthenticated(request);
    
    if (!isAuth) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }
    
    // Get user's cart items
    const cartItems = await prisma.cartItem.findMany({
      where: { userId: user!.userId },
      include: {
        product: {
          include: {
            category: true,
            farmer: {
              include: {
                user: {
                  select: {
                    name: true,
                  },
                },
              },
            },
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
    
    // Calculate subtotal
    const subtotal = cartItems.reduce((total, item) => {
      return total + (item.product.price * item.quantity);
    }, 0);
    
    return NextResponse.json({
      cartItems,
      subtotal,
    });
  } catch (error) {
    console.error('Error fetching cart:', error);
    return NextResponse.json(
      { message: 'Failed to fetch cart' },
      { status: 500 }
    );
  }
}

// Add item to cart
export async function POST(request: NextRequest) {
  try {
    const { isAuth, user } = await isAuthenticated(request);
    
    if (!isAuth) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }
    
    const { productId, quantity } = await request.json();
    
    // Validate input
    if (!productId || !quantity || quantity < 1) {
      return NextResponse.json(
        { message: "Product ID and valid quantity are required" },
        { status: 400 }
      );
    }
    
    // Check if product exists and has sufficient quantity
    const product = await prisma.product.findUnique({
      where: { id: productId },
    });
    
    if (!product) {
      return NextResponse.json(
        { message: "Product not found" },
        { status: 404 }
      );
    }
    
    if (product.quantity < quantity) {
      return NextResponse.json(
        { message: "Insufficient product quantity available" },
        { status: 400 }
      );
    }
    
    // Check if item already in cart
    const existingCartItem = await prisma.cartItem.findFirst({
      where: {
        userId: user!.userId,
        productId,
      },
    });
    
    if (existingCartItem) {
      // Update quantity
      const updatedCartItem = await prisma.cartItem.update({
        where: { id: existingCartItem.id },
        data: {
          quantity: existingCartItem.quantity + quantity,
        },
      });
      
      return NextResponse.json(updatedCartItem);
    }
    
    // Add new item to cart
    const newCartItem = await prisma.cartItem.create({
      data: {
        userId: user!.userId,
        productId,
        quantity,
      },
    });
    
    return NextResponse.json(newCartItem, { status: 201 });
  } catch (error) {
    console.error('Error adding to cart:', error);
    return NextResponse.json(
      { message: 'Failed to add item to cart' },
      { status: 500 }
    );
  }
}