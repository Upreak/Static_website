import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { db } from "@/lib/db";

// Enhanced logging function
function logDebug(message: string, data?: any) {
  console.log(`[LOGIN DEBUG] ${message}`, data || '');
}

export async function POST(request: NextRequest) {
  try {
    const startTime = Date.now();
    logDebug("Login attempt started");
    
    // Log request details
    const contentType = request.headers.get('content-type');
    logDebug("Request content-type:", contentType);
    
    const { email, password } = await request.json();
    logDebug("Login attempt for email:", email);
    logDebug("Password length:", password?.length);

    if (!email || !password) {
      console.log("Missing email or password");
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 }
      );
    }

    // Find admin by email
    logDebug("Looking for admin with email:", email);
    const adminQueryStart = Date.now();
    const admin = await db.admin.findUnique({
      where: { email }
    });
    const adminQueryTime = Date.now() - adminQueryStart;
    logDebug("Admin found:", admin ? "Yes" : "No");
    logDebug("Admin query took:", adminQueryTime + "ms");
    
    if (admin) {
      logDebug("Admin details:", {
        id: admin.id,
        email: admin.email,
        role: admin.role,
        isActive: admin.isActive,
        createdAt: admin.createdAt,
        lastLoginAt: admin.lastLoginAt
      });
    }

    if (!admin) {
      console.log("Admin not found for email:", email);
      return NextResponse.json(
        { error: "Invalid email or password" },
        { status: 401 }
      );
    }

    // Check if admin is active
    console.log("Admin active status:", admin.isActive);
    if (!admin.isActive) {
      console.log("Admin account deactivated for email:", email);
      return NextResponse.json(
        { error: "Account is deactivated" },
        { status: 401 }
      );
    }

    // Compare password hashes
    logDebug("Comparing passwords");
    const passwordCompareStart = Date.now();
    const isPasswordValid = await bcrypt.compare(password, admin.password);
    const passwordCompareTime = Date.now() - passwordCompareStart;
    logDebug("Password valid:", isPasswordValid);
    logDebug("Password comparison took:", passwordCompareTime + "ms");
    
    if (!isPasswordValid) {
      logDebug("Password hash mismatch for email:", email);
      logDebug("Provided password (first 10 chars):", password?.substring(0, 10) + '...');
      logDebug("Stored password hash (first 10 chars):", admin.password?.substring(0, 10) + '...');
    }

    if (!isPasswordValid) {
      console.log("Invalid password for email:", email);
      return NextResponse.json(
        { error: "Invalid email or password" },
        { status: 401 }
      );
    }

    // Update last login time
    logDebug("Updating last login time");
    const updateStart = Date.now();
    await db.admin.update({
      where: { id: admin.id },
      data: { lastLoginAt: new Date() }
    });
    const updateTime = Date.now() - updateStart;
    logDebug("Last login update took:", updateTime + "ms");

    // Remove password from response
    const { password: _, ...adminWithoutPassword } = admin;

    // Simulate token generation (in a real app, use JWT)
    const token = "admin-token-" + admin.id + "-" + Date.now();
    const totalTime = Date.now() - startTime;
    logDebug("Login successful for email:", email);
    logDebug("Total login process took:", totalTime + "ms");

    return NextResponse.json({
      success: true,
      message: "Login successful",
      user: adminWithoutPassword,
      token: token
    });

  } catch (error) {
    const totalTime = Date.now() - startTime;
    logDebug("Login failed after:", totalTime + "ms");
    logDebug("Login error:", error);
    logDebug("Error stack:", error instanceof Error ? error.stack : "No stack trace");
    logDebug("Error type:", error?.constructor?.name);
    
    // More specific error handling
    if (error instanceof Error) {
      if (error.message.includes('connect')) {
        logDebug("Database connection error detected");
      } else if (error.message.includes('timeout')) {
        logDebug("Database timeout error detected");
      } else if (error.message.includes('unique constraint')) {
        logDebug("Database constraint violation detected");
      }
    }
    
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}