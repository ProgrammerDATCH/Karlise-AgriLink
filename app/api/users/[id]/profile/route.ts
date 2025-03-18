// app/api/users/[id]/profile/route.ts
import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { isAuthenticated } from '@/lib/auth';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { isAuth, user } = await isAuthenticated(request);
    
    if (!isAuth) {
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    // Only allow users to access their own profile
    if (user!.userId !== params.id) {
      return NextResponse.json(
        { message: 'Forbidden: You can only access your own profile' },
        { status: 403 }
      );
    }
    
    // Fetch user data with role-specific profile
    const userData = await prisma.user.findUnique({
      where: { id: params.id },
      include: {
        farmer: user!.role === 'FARMER',
        buyer: user!.role === 'BUYER',
        processor: user!.role === 'PROCESSOR',
        supplier: user!.role === 'SUPPLIER',
      },
    });
    
    if (!userData) {
      return NextResponse.json(
        { message: 'User not found' },
        { status: 404 }
      );
    }
    
    // Remove sensitive information
    const { password, ...userDataWithoutPassword } = userData;
    
    return NextResponse.json(userDataWithoutPassword);
  } catch (error) {
    console.error('Error fetching user profile:', error);
    return NextResponse.json(
      { message: 'Failed to fetch profile' },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { isAuth, user } = await isAuthenticated(request);
    
    if (!isAuth) {
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    // Only allow users to update their own profile
    if (user!.userId !== params.id) {
      return NextResponse.json(
        { message: 'Forbidden: You can only update your own profile' },
        { status: 403 }
      );
    }
    
    const data = await request.json();
    
    // Update personal info
    if (data.personalInfo) {
      const { email, ...updateData } = data.personalInfo;
      
      await prisma.user.update({
        where: { id: params.id },
        data: updateData,
      });
    }
    
    // Update business info based on role
    if (data.businessInfo && data.role) {
      if (data.role === 'FARMER') {
        await prisma.farmer.update({
          where: { userId: params.id },
          data: data.businessInfo,
        });
      } else if (data.role === 'BUYER') {
        await prisma.buyer.update({
          where: { userId: params.id },
          data: {
            location: data.businessInfo.location,
            description: data.businessInfo.description,
          },
        });
      } else if (data.role === 'PROCESSOR') {
        await prisma.processor.update({
          where: { userId: params.id },
          data: {
            location: data.businessInfo.location,
            description: data.businessInfo.description,
          },
        });
      } else if (data.role === 'SUPPLIER') {
        await prisma.supplier.update({
          where: { userId: params.id },
          data: {
            location: data.businessInfo.location,
            description: data.businessInfo.description,
          },
        });
      }
    }
    
    return NextResponse.json({ message: 'Profile updated successfully' });
  } catch (error) {
    console.error('Error updating user profile:', error);
    return NextResponse.json(
      { message: 'Failed to update profile' },
      { status: 500 }
    );
  }
}