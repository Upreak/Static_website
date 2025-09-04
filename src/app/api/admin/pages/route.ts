import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

// GET /api/admin/pages - Get all pages
export async function GET(request: NextRequest) {
  try {
    const pages = await db.page.findMany({
      include: {
        creator: {
          select: { id: true, name: true, email: true }
        }
      },
      orderBy: { updatedAt: "desc" }
    });

    return NextResponse.json({ success: true, pages });
  } catch (error) {
    console.error("Error fetching pages:", error);
    return NextResponse.json(
      { error: "Failed to fetch pages" },
      { status: 500 }
    );
  }
}

// POST /api/admin/pages - Create new page
export async function POST(request: NextRequest) {
  try {
    const { title, slug, content, metaTitle, metaDescription, status, createdBy } = await request.json();

    if (!title || !slug || !content || !createdBy) {
      return NextResponse.json(
        { error: "Title, slug, content, and createdBy are required" },
        { status: 400 }
      );
    }

    // Check if slug already exists
    const existingPage = await db.page.findUnique({
      where: { slug }
    });

    if (existingPage) {
      return NextResponse.json(
        { error: "Page with this slug already exists" },
        { status: 400 }
      );
    }

    const page = await db.page.create({
      data: {
        title,
        slug,
        content,
        metaTitle,
        metaDescription,
        status,
        createdBy,
        publishedAt: status === "PUBLISHED" ? new Date() : null
      },
      include: {
        creator: {
          select: { id: true, name: true, email: true }
        }
      }
    });

    return NextResponse.json({ success: true, page }, { status: 201 });
  } catch (error) {
    console.error("Error creating page:", error);
    return NextResponse.json(
      { error: "Failed to create page" },
      { status: 500 }
    );
  }
}

// PUT /api/admin/pages - Update existing page
export async function PUT(request: NextRequest) {
  try {
    const { id, title, slug, content, metaTitle, metaDescription, status } = await request.json();

    if (!id || !title || !slug || !content) {
      return NextResponse.json(
        { error: "ID, title, slug, and content are required" },
        { status: 400 }
      );
    }

    // Check if slug already exists for a different page
    const existingPage = await db.page.findFirst({
      where: { 
        slug: slug,
        NOT: { id: id }
      }
    });

    if (existingPage) {
      return NextResponse.json(
        { error: "Page with this slug already exists" },
        { status: 400 }
      );
    }

    const page = await db.page.update({
      where: { id },
      data: {
        title,
        slug,
        content,
        metaTitle,
        metaDescription,
        status,
        publishedAt: status === "PUBLISHED" ? new Date() : null,
        updatedAt: new Date()
      },
      include: {
        creator: {
          select: { id: true, name: true, email: true }
        }
      }
    });

    return NextResponse.json({ success: true, page });
  } catch (error) {
    console.error("Error updating page:", error);
    return NextResponse.json(
      { error: "Failed to update page" },
      { status: 500 }
    );
  }
}