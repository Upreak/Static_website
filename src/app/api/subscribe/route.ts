import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { z } from "zod";

// Email validation regex
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const subscribeSchema = z.object({
  email: z.string()
    .min(1, "Email is required")
    .email("Invalid email format")
    .regex(emailRegex, "Please enter a valid email address"),
  name: z.string()
    .min(1, "Name is required")
    .max(100, "Name must be less than 100 characters")
    .optional(),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validatedData = subscribeSchema.parse(body);

    const { email, name } = validatedData;

    // Check if email already exists using raw SQL
    const existingSubscription = await db.$queryRaw`
      SELECT id FROM email_subscriptions WHERE email = ${email}
    `;

    if (existingSubscription && (existingSubscription as any[]).length > 0) {
      return NextResponse.json(
        { error: "This email address is already subscribed" },
        { status: 409 }
      );
    }

    // Create new subscription using raw SQL
    const subscription = await db.$queryRaw`
      INSERT INTO email_subscriptions (id, email, name, createdAt, updatedAt)
      VALUES (${crypto.randomUUID()}, ${email}, ${name || null}, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
      RETURNING id, email, name, createdAt
    `;

    const subscriptionData = (subscription as any[])[0];

    // Log the subscription (for security and monitoring)
    console.log(`[Subscription] New email subscription: ${email}`, {
      timestamp: new Date().toISOString(),
      userAgent: request.headers.get('user-agent'),
      ip: request.headers.get('x-forwarded-for') || 'unknown'
    });

    // TODO: Send welcome email (implement email service integration)
    // For now, we'll just log that we would send an email
    console.log(`[Subscription] Would send welcome email to: ${email}`);

    return NextResponse.json({
      message: "Thank you for subscribing! We'll notify you when we launch.",
      subscription: {
        id: subscriptionData.id,
        email: subscriptionData.email,
        name: subscriptionData.name,
        createdAt: subscriptionData.createdAt
      }
    }, { status: 201 });

  } catch (error) {
    console.error("[Subscription Error]", error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          error: "Validation failed",
          details: error.issues.map(err => ({
            field: err.path.join('.'),
            message: err.message
          }))
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// GET endpoint to retrieve all subscriptions (admin only)
export async function GET(request: NextRequest) {
  try {
    // Check for admin authorization (in a real app, you'd verify JWT or session)
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    // Get query parameters for pagination
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const search = searchParams.get('search') || '';

    const skip = (page - 1) * limit;

    // Build where clause for search
    const where = search
      ? {
          OR: [
            { email: { contains: search, mode: 'insensitive' as const } },
            { name: { contains: search, mode: 'insensitive' as const } }
          ]
        }
      : {};

    // Get total count for pagination
    const total = await db.emailSubscription.count({ where });

    // Get subscriptions
    const subscriptions = await db.emailSubscription.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      skip,
      take: limit,
      select: {
        id: true,
        email: true,
        name: true,
        createdAt: true,
        updatedAt: true
      }
    });

    return NextResponse.json({
      subscriptions,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });

  } catch (error) {
    console.error("[Get Subscriptions Error]", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}