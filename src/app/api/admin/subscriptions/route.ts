import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { z } from "zod";

// Authorization check middleware
async function checkAuth(request: NextRequest) {
  const authHeader = request.headers.get('authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return false;
  }
  
  // In a real app, you would verify the JWT token here
  // For now, we'll just check if the header exists
  return true;
}

const exportSchema = z.object({
  format: z.enum(['csv', 'json']).default('csv'),
});

export async function GET(request: NextRequest) {
  try {
    // Check authentication
    const isAuthenticated = await checkAuth(request);
    if (!isAuthenticated) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    // Get query parameters
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const search = searchParams.get('search') || '';
    const exportFormat = searchParams.get('export');

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

    // Handle export
    if (exportFormat) {
      const validatedExport = exportSchema.parse({ format: exportFormat });
      
      if (validatedExport.format === 'csv') {
        // Generate CSV
        const csvHeaders = ['Email', 'Name', 'Created At'];
        const csvRows = subscriptions.map(sub => [
          sub.email,
          sub.name || '',
          sub.createdAt.toISOString()
        ]);

        const csvContent = [csvHeaders, ...csvRows]
          .map(row => row.map(cell => `"${cell}"`).join(','))
          .join('\n');

        return new NextResponse(csvContent, {
          headers: {
            'Content-Type': 'text/csv',
            'Content-Disposition': `attachment; filename="email-subscriptions-${new Date().toISOString().split('T')[0]}.csv"`
          }
        });
      } else if (validatedExport.format === 'json') {
        // Generate JSON
        const exportData = {
          subscriptions,
          exportedAt: new Date().toISOString(),
          total
        };

        return new NextResponse(JSON.stringify(exportData, null, 2), {
          headers: {
            'Content-Type': 'application/json',
            'Content-Disposition': `attachment; filename="email-subscriptions-${new Date().toISOString().split('T')[0]}.json"`
          }
        });
      }
    }

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
    console.error("[Get Admin Subscriptions Error]", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    // Check authentication
    const isAuthenticated = await checkAuth(request);
    if (!isAuthenticated) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const subscriptionId = searchParams.get('id');

    if (!subscriptionId) {
      return NextResponse.json(
        { error: "Subscription ID is required" },
        { status: 400 }
      );
    }

    // Delete subscription
    const deletedSubscription = await db.emailSubscription.delete({
      where: { id: subscriptionId }
    });

    // Log the deletion
    console.log(`[Admin] Deleted subscription: ${deletedSubscription.email}`, {
      timestamp: new Date().toISOString(),
      deletedBy: request.headers.get('x-forwarded-for') || 'unknown'
    });

    return NextResponse.json({
      message: "Subscription deleted successfully",
      subscription: deletedSubscription
    });

  } catch (error) {
    console.error("[Delete Subscription Error]", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}