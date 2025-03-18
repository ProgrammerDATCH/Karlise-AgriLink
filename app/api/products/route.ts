// app/api/products/route.ts
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";
import { isAuthenticated } from "@/lib/auth";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    
    // Get filter parameters
    const search = searchParams.get('search');
    const category = searchParams.get('category');
    const organic = searchParams.get('organic');
    const minPrice = searchParams.get('minPrice');
    const maxPrice = searchParams.get('maxPrice');
    const sort = searchParams.get('sort') || 'newest';
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '9');
    const skip = (page - 1) * limit;
    
    // Build where conditions
    const where: any = {};
    
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
      ];
    }
    
    if (category) {
      where.categoryId = category;
    }
    
    if (organic === 'true') {
      where.isOrganic = true;
    }
    
    if (minPrice) {
      where.price = {
        ...(where.price || {}),
        gte: parseInt(minPrice),
      };
    }
    
    if (maxPrice) {
      where.price = {
        ...(where.price || {}),
        lte: parseInt(maxPrice),
      };
    }
    
    // Determine sorting
    let orderBy: any = {};
    switch (sort) {
      case 'price-low':
        orderBy = { price: 'asc' };
        break;
      case 'price-high':
        orderBy = { price: 'desc' };
        break;
      case 'rating':
        orderBy = { rating: 'desc' };
        break;
      case 'newest':
      default:
        orderBy = { createdAt: 'desc' };
        break;
    }
    
    // Get products with pagination
    const products = await prisma.product.findMany({
      where,
      include: {
        category: {
          select: {
            id: true,
            name: true,
          },
        },
        farmer: {
          select: {
            id: true,
            user: {
              select: {
                name: true,
              },
            },
          },
        },
      },
      orderBy,
      skip,
      take: limit,
    });
    
    // Get total count for pagination
    const totalCount = await prisma.product.count({ where });
    
    return NextResponse.json({
      products,
      pagination: {
        total: totalCount,
        pages: Math.ceil(totalCount / limit),
        currentPage: page,
        perPage: limit,
      },
    });
  } catch (error) {
    console.error('Error fetching products:', error);
    return NextResponse.json(
      { message: 'Failed to fetch products' },
      { status: 500 }
    );
}
}



export async function POST(request: NextRequest) {
  try {
    const { isAuth, user } = await isAuthenticated(request);
    
    if (!isAuth) {
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    // Make sure the user is a farmer
    const farmer = await prisma.farmer.findFirst({
      where: { userId: user!.userId },
    });
    
    if (!farmer) {
      return NextResponse.json(
        { message: 'Only farmers can create products' },
        { status: 403 }
      );
    }
    
    const data = await request.json();
    
    // Validate required fields
    if (!data.name || !data.price || !data.unit || !data.quantity || !data.categoryId) {
      return NextResponse.json(
        { message: 'Missing required fields' },
        { status: 400 }
      );
    }
    
    // Create new product
    const newProduct = await prisma.product.create({
      data: {
        name: data.name,
        description: data.description,
        price: parseFloat(data.price),
        unit: data.unit,
        quantity: parseInt(data.quantity),
        images: data.images,
        categoryId: data.categoryId,
        farmerId: farmer.id,
        quality: data.quality || null,
        harvestDate: data.harvestDate ? new Date(data.harvestDate) : null,
        expiryDate: data.expiryDate ? new Date(data.expiryDate) : null,
        isOrganic: Boolean(data.isOrganic),
        featured: Boolean(data.featured),
      },
    });
    
    return NextResponse.json(newProduct, { status: 201 });
  } catch (error) {
    console.error('Error creating product:', error);
    return NextResponse.json(
      { message: 'Failed to create product' },
      { status: 500 }
    );
  }
}