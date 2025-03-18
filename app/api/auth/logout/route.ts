// app/api/auth/logout/route.ts
import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST() {
  try {
    // Delete the token cookie
    const cookieStore = await cookies();
    cookieStore.delete("auth_token");
    
    return NextResponse.json({
      message: "Logged out successfully"
    });
  } catch (error) {
    console.error("Logout error:", error);
    return NextResponse.json(
      { message: "An error occurred during logout" },
      { status: 500 }
    );
  }
}