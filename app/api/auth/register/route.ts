// app/api/auth/register/route.ts
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";
import bcrypt from "bcryptjs";

export async function POST(request: NextRequest) {
  try {
    const { name, email, password, phone, role } = await request.json();

    // Input validation
    if (!name || !email || !password || !role) {
      return NextResponse.json(
        { message: "All fields are required" },
        { status: 400 }
      );
    }

    // Check if email already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json(
        { message: "Email already in use" },
        { status: 409 }
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create transaction to create user and role-specific profile
    const user = await prisma.$transaction(async (tx) => {
      // Create user
      const newUser = await tx.user.create({
        data: {
          name,
          email,
          password: hashedPassword,
          phone: phone || null,
          role,
        },
      });

      // Create role-specific profile based on user role
      switch (role) {
        case "FARMER":
          await tx.farmer.create({
            data: {
              userId: newUser.id,
              location: "Rwanda", // Default value, update later
            },
          });
          break;
        case "BUYER":
          await tx.buyer.create({
            data: {
              userId: newUser.id,
              type: "INDIVIDUAL", // Default value, update later
              location: "Rwanda", // Default value, update later
            },
          });
          break;
        case "PROCESSOR":
          await tx.processor.create({
            data: {
              userId: newUser.id,
              companyName: name, // Use name as default, update later
              location: "Rwanda", // Default value, update later
            },
          });
          break;
        case "SUPPLIER":
          await tx.supplier.create({
            data: {
              userId: newUser.id,
              companyName: name, // Use name as default, update later
              location: "Rwanda", // Default value, update later
            },
          });
          break;
      }

      return newUser;
    });

    // Return success message (exclude password)
    const { password: _, ...userWithoutPassword } = user;
    
    return NextResponse.json({
      message: "Registration successful",
      user: userWithoutPassword,
    });
    
  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json(
      { message: "An error occurred during registration" },
      { status: 500 }
    );
  }
}