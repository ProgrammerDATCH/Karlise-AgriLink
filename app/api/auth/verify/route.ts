// app/api/auth/verify/route.ts
import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

const JWT_SECRET = process.env.JWT_SECRET || "your_fallback_secret_key";

export async function GET(request: NextRequest) {
  try {
    // Check for token in cookie or authorization header
    const cookieStore = await cookies();
    const token = 
      cookieStore.get("auth_token")?.value || 
      request.headers.get("Authorization")?.split(" ")[1];
    
    if (!token) {
      return NextResponse.json(
        { message: "No token provided" },
        { status: 401 }
      );
    }
    
    // Verify token
    const decoded = jwt.verify(token, JWT_SECRET);
    
    // Return user information (from token)
    return NextResponse.json({
      message: "Token is valid",
      user: decoded
    });
    
  } catch (error) {
    console.error("Token verification error:", error);
    return NextResponse.json(
      { message: "Invalid token" },
      { status: 401 }
    );
  }
}