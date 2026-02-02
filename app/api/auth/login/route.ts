import { NextRequest, NextResponse } from "next/server";
import { loginSchema } from "@/lib/validations/auth-schema";
import type { User } from "@/types/auth";

// Dummy user data for frontend-only implementation
// TODO: Replace with actual database query using Prisma
const DUMMY_USERS: User[] = [
  {
    id: "1",
    username: "admin",
    email: "admin@skyshi-hub.com",
    name: "Admin User",
    role: "admin",
  },
  {
    id: "2",
    username: "recruiter",
    email: "recruiter@skyshi-hub.com",
    name: "Recruiter User",
    role: "recruiter",
  },
];

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate request body with Zod
    const validationResult = loginSchema.safeParse(body);

    if (!validationResult.success) {
      return NextResponse.json(
        {
          error: "Validation failed",
          details: validationResult.error.errors,
        },
        { status: 400 }
      );
    }

    const { username, password } = validationResult.data;

    // TODO: Replace with actual authentication logic
    // For now, accept any username/password combination for demo
    // In production, this should:
    // 1. Query user from database using Prisma
    // 2. Verify password hash (using bcrypt or similar)
    // 3. Return user data if valid

    // Dummy authentication - accept any credentials
    const user = DUMMY_USERS.find((u) => u.username === username) || {
      id: "1",
      username,
      email: `${username}@skyshi-hub.com`,
      name: username.charAt(0).toUpperCase() + username.slice(1),
      role: "recruiter",
    };

    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 500));

    return NextResponse.json(
      {
        success: true,
        user,
        message: "Login successful",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json(
      {
        error: "Internal server error",
        message: "An error occurred during login",
      },
      { status: 500 }
    );
  }
}
