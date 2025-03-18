// lib/auth.ts
import { NextRequest } from "next/server";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

const JWT_SECRET = process.env.JWT_SECRET || "your_fallback_secret_key";

export type AuthUser = {
  userId: string;
  email: string;
  role: string;
  iat?: number;
  exp?: number;
};

// Verify a JWT token
export function verifyToken(token: string): AuthUser | null {
  try {
    return jwt.verify(token, JWT_SECRET) as AuthUser;
  } catch (error) {
    return null;
  }
}

// Check if a request is authenticated
export async function isAuthenticated(request: NextRequest): Promise<{
  isAuth: boolean;
  user?: AuthUser;
}> {
  // Get token from cookie (for server-side) or Authorization header (for API)
  const cookieStore = await cookies();
  const token =
    cookieStore.get("auth_token")?.value ||
    request.headers.get("Authorization")?.split(" ")[1];

  if (!token) {
    return { isAuth: false };
  }

  const decoded = verifyToken(token);
  if (!decoded) {
    return { isAuth: false };
  }

  return { isAuth: true, user: decoded };
}