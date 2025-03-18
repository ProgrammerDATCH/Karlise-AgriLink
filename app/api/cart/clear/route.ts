// app/api/cart/clear/route.ts
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";
import { isAuthenticated } from "@/lib/auth";

// Clear user's cart
export async function POST(request: NextRequest) {
  try {
    const { isAuth, user } = await isAuthenticated(request);
    
    if (!isAuth) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }
    
    // Delete all cart items for the user
    await prisma.cartItem.deleteMany({
      where: { userId: user!.userId },
    });
    
    return NextResponse.json({ message: "Cart cleared successfully" });
  } catch (error) {
    console.error('Error clearing cart:', error);
    return NextResponse.json(
      { message: 'Failed to clear cart' },
      { status: 500 }
    );
  }
}