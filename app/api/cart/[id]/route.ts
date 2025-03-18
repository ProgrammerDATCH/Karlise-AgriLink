// app/api/cart/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";
import { isAuthenticated } from "@/lib/auth";

// Update cart item quantity
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { isAuth, user } = await isAuthenticated(request);
    
    if (!isAuth) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }
    
    const cartItemId = params.id;
    const { quantity } = await request.json();
    
    // Validate input
    if (!quantity || quantity < 1) {
      return NextResponse.json(
        { message: "Valid quantity is required" },
        { status: 400 }
      );
    }
    
    // Get cart item to check ownership and get product info
    const cartItem = await prisma.cartItem.findUnique({
      where: { id: cartItemId },
      include: { product: true },
    });
    
    if (!cartItem) {
      return NextResponse.json(
        { message: "Cart item not found" },
        { status: 404 }
      );
    }
    
    // Verify item belongs to user
    if (cartItem.userId !== user!.userId) {
      return NextResponse.json(
        { message: "Unauthorized: This cart item doesn't belong to you" },
        { status: 403 }
      );
    }
    
    // Verify product has enough quantity
    if (cartItem.product.quantity < quantity) {
      return NextResponse.json(
        { message: `Only ${cartItem.product.quantity} units available` },
        { status: 400 }
      );
    }
    
    // Update cart item quantity
    const updatedCartItem = await prisma.cartItem.update({
      where: { id: cartItemId },
      data: { quantity },
    });
    
    return NextResponse.json(updatedCartItem);
  } catch (error) {
    console.error('Error updating cart item:', error);
    return NextResponse.json(
      { message: 'Failed to update cart item' },
      { status: 500 }
    );
  }
}

// Remove item from cart
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { isAuth, user } = await isAuthenticated(request);
    
    if (!isAuth) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }
    
    const cartItemId = params.id;
    
    // Get cart item to check ownership
    const cartItem = await prisma.cartItem.findUnique({
      where: { id: cartItemId },
    });
    
    if (!cartItem) {
      return NextResponse.json(
        { message: "Cart item not found" },
        { status: 404 }
      );
    }
    
    // Verify item belongs to user
    if (cartItem.userId !== user!.userId) {
      return NextResponse.json(
        { message: "Unauthorized: This cart item doesn't belong to you" },
        { status: 403 }
      );
    }
    
    // Delete cart item
    await prisma.cartItem.delete({
      where: { id: cartItemId },
    });
    
    return NextResponse.json({ message: "Item removed from cart" });
  } catch (error) {
    console.error('Error removing cart item:', error);
    return NextResponse.json(
      { message: 'Failed to remove cart item' },
      { status: 500 }
    );
  }
}