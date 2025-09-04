import { NextRequest, NextResponse } from "next/server";
import twilio from "twilio";

// This is a demo implementation. In a real app, you would:
// 1. Store Twilio credentials in environment variables
// 2. Use proper error handling
// 3. Implement message templates
// 4. Add rate limiting
// 5. Use proper logging

export async function POST(request: NextRequest) {
  try {
    const { name, email, phone, message } = await request.json();

    if (!name || !email || !message) {
      return NextResponse.json(
        { error: "Name, email, and message are required" },
        { status: 400 }
      );
    }

    // For demo purposes, we'll simulate Twilio integration
    // In a real app, you would initialize Twilio client like this:
    // const client = twilio(
    //   process.env.TWILIO_ACCOUNT_SID,
    //   process.env.TWILIO_AUTH_TOKEN
    // );

    // Simulate sending SMS notification
    if (phone) {
      console.log(`[Twilio Demo] Would send SMS to ${phone}: New message from ${name}`);
      
      // Real Twilio implementation would be:
      // await client.messages.create({
      //   body: `New message from ${name} (${email}): ${message.substring(0, 100)}...`,
      //   from: process.env.TWILIO_PHONE_NUMBER,
      //   to: phone
      // });
    }

    // Simulate sending WhatsApp notification
    console.log(`[Twilio Demo] Would send WhatsApp notification to admin about new message from ${name}`);
    
    // Real Twilio WhatsApp implementation would be:
    // await client.messages.create({
    //   body: `New contact form submission from ${name}\nEmail: ${email}\nMessage: ${message}`,
    //   from: `whatsapp:${process.env.TWILIO_PHONE_NUMBER}`,
    //   to: `whatsapp:${process.env.ADMIN_WHATSAPP_NUMBER}`
    // });

    // Save message to database
    try {
      const dbResponse = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/admin/messages`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          email,
          phone: phone || "",
          message
        }),
      });

      if (!dbResponse.ok) {
        console.error("Failed to save message to database");
      }
    } catch (error) {
      console.error("Error saving message to database:", error);
    }

    return NextResponse.json({
      success: true,
      message: "Message sent successfully",
      twilioStatus: "simulated",
      notifications: {
        sms: phone ? "simulated" : "skipped (no phone provided)",
        whatsapp: "simulated",
        email: "simulated"
      }
    });

  } catch (error) {
    console.error("Twilio integration error:", error);
    return NextResponse.json(
      { error: "Failed to send message" },
      { status: 500 }
    );
  }
}