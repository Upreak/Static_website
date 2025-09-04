import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

// GET /api/admin/messages - Get all messages
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");
    const download = searchParams.get("download");

    const where = status ? { status: status.toUpperCase() as any } : {};

    const messages = await db.chatMessage.findMany({
      where,
      include: {
        handler: {
          select: { id: true, name: true, email: true }
        }
      },
      orderBy: { createdAt: "desc" }
    });

    // If download parameter is present, return CSV
    if (download === "csv") {
      console.log("[Messages API] Generating CSV download");
      
      // Create CSV content
      const headers = ["ID", "Name", "Email", "Phone", "Message", "Status", "Created At", "Reply", "Replied At", "Replied By"];
      const csvRows = [
        headers.join(","),
        ...messages.map(msg => [
          msg.id,
          `"${msg.name}"`,
          `"${msg.email}"`,
          `"${msg.phone || ""}"`,
          `"${msg.message.replace(/"/g, '""')}"`,
          msg.status,
          msg.createdAt,
          `"${msg.response || ""}"`,
          msg.respondedAt || "",
          `"${msg.handler?.name || ""}"`
        ].join(","))
      ];
      
      const csvContent = csvRows.join("\n");
      
      return new NextResponse(csvContent, {
        headers: {
          "Content-Type": "text/csv",
          "Content-Disposition": `attachment; filename="messages_${new Date().toISOString().split('T')[0]}.csv"`
        }
      });
    }

    return NextResponse.json({ success: true, messages });
  } catch (error) {
    console.error("Error fetching messages:", error);
    return NextResponse.json(
      { error: "Failed to fetch messages" },
      { status: 500 }
    );
  }
}

// POST /api/admin/messages - Create new message (from contact form)
export async function POST(request: NextRequest) {
  try {
    const { name, email, phone, message } = await request.json();

    if (!name || !email || !message) {
      return NextResponse.json(
        { error: "Name, email, and message are required" },
        { status: 400 }
      );
    }

    const chatMessage = await db.chatMessage.create({
      data: {
        name,
        email,
        phone,
        message,
        status: "NEW"
      }
    });

    return NextResponse.json({ success: true, message: chatMessage }, { status: 201 });
  } catch (error) {
    console.error("Error creating message:", error);
    return NextResponse.json(
      { error: "Failed to create message" },
      { status: 500 }
    );
  }
}

// PUT /api/admin/messages - Update message status or reply
export async function PUT(request: NextRequest) {
  try {
    const { id, status, reply, repliedBy } = await request.json();

    if (!id) {
      return NextResponse.json(
        { error: "Message ID is required" },
        { status: 400 }
      );
    }

    const updateData: any = {};
    
    if (status) {
      updateData.status = status.toUpperCase();
      console.log(`[Messages API] Updating message ${id} status to ${status.toUpperCase()}`);
    }
    
    if (reply !== undefined) {
      updateData.response = reply;
      updateData.respondedAt = new Date();
      console.log(`[Messages API] Adding reply to message ${id}`);
    }
    
    if (repliedBy) {
      updateData.handledBy = repliedBy;
    }

    const updatedMessage = await db.chatMessage.update({
      where: { id },
      data: updateData,
      include: {
        handler: {
          select: { id: true, name: true, email: true }
        }
      }
    });

    return NextResponse.json({ success: true, message: updatedMessage });
  } catch (error) {
    console.error("Error updating message:", error);
    return NextResponse.json(
      { error: "Failed to update message" },
      { status: 500 }
    );
  }
}