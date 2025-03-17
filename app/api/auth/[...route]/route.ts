// src/app/api/auth/[route]/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

const prisma = new PrismaClient()

// Set a secure JWT secret (in production, this should be environment variable)
const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret_here'
const JWT_EXPIRES_IN = '7d' // Token expires in 7 days

// Handler for all API routes
export async function POST(
  request: NextRequest,
  { params }: { params: { route: string } }
) {
  const route = params.route

  // Login route
  if (route === 'login') {
    try {
      const body = await request.json()
      const { email, password } = body
      
      // Validate input
      if (!email || !password) {
        return NextResponse.json(
          { success: false, message: 'Email and password are required' },
          { status: 400 }
        )
      }
      
      // Find the user in the database
      const user = await prisma.user.findUnique({
        where: { email },
      })
      
      // Check if user exists
      if (!user) {
        return NextResponse.json(
          { success: false, message: 'Invalid email or password' },
          { status: 401 }
        )
      }
      
      // Verify password
      const passwordMatch = await bcrypt.compare(password, user.password)
      if (!passwordMatch) {
        return NextResponse.json(
          { success: false, message: 'Invalid email or password' },
          { status: 401 }
        )
      }
      
      // Generate JWT token
      const token = jwt.sign(
        { 
          userId: user.id,
          email: user.email,
          role: user.role 
        },
        JWT_SECRET,
        { expiresIn: JWT_EXPIRES_IN }
      )
      
      // Return success with user data (excluding password) and token
      const { password: _, ...userWithoutPassword } = user
      return NextResponse.json({
        success: true,
        user: userWithoutPassword,
        token,
      })
    } catch (error) {
      console.error('Login error:', error)
      return NextResponse.json(
        { success: false, message: 'An error occurred during login' },
        { status: 500 }
      )
    }
  }
  
  // Register route
  if (route === 'register') {
    try {
      const body = await request.json()
      const { name, email, phone, password, role } = body
      
      // Validate input
      if (!name || !email || !password || !role) {
        return NextResponse.json(
          { success: false, message: 'Missing required fields' },
          { status: 400 }
        )
      }
      
      // Check if user already exists
      const existingUser = await prisma.user.findUnique({
        where: { email },
      })
      
      if (existingUser) {
        return NextResponse.json(
          { success: false, message: 'User with this email already exists' },
          { status: 409 }
        )
      }
      
      // Hash password
      const hashedPassword = await bcrypt.hash(password, 10)
      
      // Create new user
      const newUser = await prisma.user.create({
        data: {
          name,
          email,
          phone: phone || '',
          password: hashedPassword,
          role,
        },
      })
      
      // Return success (don't include token for registration)
      const { password: _, ...userWithoutPassword } = newUser
      return NextResponse.json({
        success: true,
        user: userWithoutPassword,
        message: 'Registration successful'
      })
    } catch (error) {
      console.error('Registration error:', error)
      return NextResponse.json(
        { success: false, message: 'An error occurred during registration' },
        { status: 500 }
      )
    }
  }
  
  // Logout route
  if (route === 'logout') {
    return NextResponse.json({
      success: true,
      message: 'Logged out successfully'
    })
  }

  // If no route matches
  return NextResponse.json(
    { success: false, message: 'Route not found' },
    { status: 404 }
  )
}

// Get current user handler
export async function GET(
  request: NextRequest,
  { params }: { params: { route: string } }
) {
  const route = params.route
  
  // Get current user route
  if (route === 'me') {
    try {
      // Get the authorization header
      const authHeader = request.headers.get('authorization')
      
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return NextResponse.json(
          { success: false, message: 'Unauthorized' },
          { status: 401 }
        )
      }
      
      // Extract the token
      const token = authHeader.split(' ')[1]
      
      try {
        // Verify token
        const decoded = jwt.verify(token, JWT_SECRET) as { userId: string }
        
        // Get user from database
        const user = await prisma.user.findUnique({
          where: { id: decoded.userId },
        })
        
        if (!user) {
          return NextResponse.json(
            { success: false, message: 'User not found' },
            { status: 404 }
          )
        }
        
        // Return user data without password
        const { password, ...userWithoutPassword } = user
        return NextResponse.json({
          success: true,
          user: userWithoutPassword,
        })
      } catch (error) {
        // Token verification failed
        return NextResponse.json(
          { success: false, message: 'Invalid or expired token' },
          { status: 401 }
        )
      }
    } catch (error) {
      console.error('Get current user error:', error)
      return NextResponse.json(
        { success: false, message: 'An error occurred' },
        { status: 500 }
      )
    }
  }
  
  // If no route matches
  return NextResponse.json(
    { success: false, message: 'Route not found' },
    { status: 404 }
  )
}