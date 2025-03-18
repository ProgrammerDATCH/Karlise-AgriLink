// app/api/auth/change-password/route.ts
import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db';
import bcrypt from 'bcryptjs';
import { isAuthenticated } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    const { isAuth, user } = await isAuthenticated(request);
    
    if (!isAuth) {
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    const { currentPassword, newPassword } = await request.json();
    
    // Get the user with password
    const userData = await prisma.user.findUnique({
      where: { id: user!.userId },
      select: {
        id: true,
        password: true,
      },
    });
    
    if (!userData) {
      return NextResponse.json(
        { message: 'User not found' },
        { status: 404 }
      );
    }
    
    // Verify current password
    const isPasswordValid = await bcrypt.compare(currentPassword, userData.password);
    
    if (!isPasswordValid) {
      return NextResponse.json(
        { message: 'Current password is incorrect' },
        { status: 400 }
      );
    }
    
    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    
    // Update password
    await prisma.user.update({
      where: { id: user!.userId },
      data: {
        password: hashedPassword,
      },
    });
    
    return NextResponse.json({ message: 'Password changed successfully' });
  } catch (error) {
    console.error('Error changing password:', error);
    return NextResponse.json(
      { message: 'Failed to change password' },
      { status: 500 }
    );
  }
}