// app/api/reviews/route.ts
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";
import { isAuthenticated } from "@/lib/auth";

export async function POST(request: NextRequest) {
  try {
    const { isAuth, user } = await isAuthenticated(request);
    
    if (!isAuth) {
      return NextResponse.json(
        { message: 'You must be logged in to submit a review' },
        { status: 401 }
      );
    }
    
    const { productId, rating, comment } = await request.json();
    
    // Validate input
    if (!productId || !rating) {
      return NextResponse.json(
        { message: 'Product ID and rating are required' },
        { status: 400 }
      );
    }
    
    // Check if product exists
    const product = await prisma.product.findUnique({
      where: { id: productId },
    });
    
    if (!product) {
      return NextResponse.json(
        { message: 'Product not found' },
        { status: 404 }
      );
    }
    
    // Check if user already reviewed this product
    const existingReview = await prisma.review.findFirst({
      where: {
        userId: user!.userId,
        productId,
      },
    });
    
    if (existingReview) {
      // Update existing review
      const updatedReview = await prisma.review.update({
        where: { id: existingReview.id },
        data: {
          rating,
          comment,
        },
      });
      
      return NextResponse.json(updatedReview);
    }
    
    // Create new review
    const newReview = await prisma.review.create({
      data: {
        userId: user!.userId,
        productId,
        rating,
        comment,
      },
    });
    
    // Update product's average rating
    const reviews = await prisma.review.findMany({
      where: { productId },
      select: { rating: true },
    });
    
    const averageRating = reviews.reduce((acc, review) => acc + review.rating, 0) / reviews.length;
    
    await prisma.review.update({
      where: { id: productId },
      data: { rating: averageRating },
    });
    
    return NextResponse.json(newReview, { status: 201 });
  } catch (error) {
    console.error('Error creating review:', error);
    return NextResponse.json(
      { message: 'Failed to submit review' },
      { status: 500 }
    );
  }
}