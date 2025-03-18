// app/api/products/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const productId = params.id;
    
    const product = await prisma.product.findUnique({
      where: { id: productId },
      include: {
        category: true,
        farmer: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                image: true,
                createdAt: true,
              },
            },
          },
        },
        reviews: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                image: true,
              },
            },
          },
          orderBy: {
            createdAt: 'desc',
          },
        },
      },
    });
    
    if (!product) {
      return NextResponse.json(
        { message: 'Product not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(product);
  } catch (error) {
    console.error('Error fetching product details:', error);
    return NextResponse.json(
      { message: 'Failed to fetch product details' },
      { status: 500 }
    );
  }
}