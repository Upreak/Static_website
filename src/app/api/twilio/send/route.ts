import { NextRequest, NextResponse } from "next/server";
import { twilioService } from "@/lib/twilio/twilio.service";
import { sanitizeInput, rateLimit } from "@/lib/auth";

// Rate limiting: 10 messages per minute
const checkRateLimit = rateLimit(10, 60 * 1000);

// POST /api/twilio/send - Send messages via SMS or WhatsApp
export async function POST(request: NextRequest) {
  try {
    // Rate limiting check
    const rateLimitResult = checkRateLimit(request);
    if (!rateLimitResult.allowed) {
      return NextResponse.json(
        { error: "Too many message requests. Please try again later." },
        { status: 429 }
      );
    }

    console.log('[Twilio API] Processing request');
    const body = await request.json();
    const { to, message, channel, type } = body;

    console.log('[Twilio API] Request parameters:', { to, message: message?.substring(0, 50), channel, type });

    // Input validation
    if (!to || !message || !channel) {
      console.error('[Twilio API] Missing required parameters');
      return NextResponse.json(
        { error: "Missing required parameters: to, message, channel" },
        { status: 400 }
      );
    }

    // Validate phone number format
    if (!/^\+?[1-9]\d{1,14}$/.test(to)) {
      return NextResponse.json(
        { error: "Invalid phone number format. Please use E.164 format (e.g., +1234567890)" },
        { status: 400 }
      );
    }

    // Validate message content
    if (message.length < 1 || message.length > 1600) {
      return NextResponse.json(
        { error: "Message must be between 1 and 1600 characters" },
        { status: 400 }
      );
    }

    // Sanitize message content
    const sanitizedMessage = sanitizeInput(message);

    if (!["sms", "whatsapp"].includes(channel)) {
      console.error('[Twilio API] Invalid channel:', channel);
      return NextResponse.json(
        { error: "Channel must be 'sms' or 'whatsapp'" },
        { status: 400 }
      );
    }

    let result;
    
    if (type === "job_application_confirmation") {
      const { name, jobTitle, companyName } = body;
      
      // Validate required fields
      if (!name || !jobTitle || !companyName) {
        return NextResponse.json(
          { error: "Missing required fields for job application confirmation" },
          { status: 400 }
        );
      }

      console.log('[Twilio API] Sending job application confirmation');
      result = await twilioService.sendJobApplicationConfirmation(
        { name: sanitizeInput(name), phone: to, preferredChannel: channel },
        sanitizeInput(jobTitle),
        sanitizeInput(companyName)
      );
    } else if (type === "interview_reminder") {
      const { name, date, time, company, position } = body;
      
      // Validate required fields
      if (!name || !date || !time || !company || !position) {
        return NextResponse.json(
          { error: "Missing required fields for interview reminder" },
          { status: 400 }
        );
      }

      console.log('[Twilio API] Sending interview reminder');
      result = await twilioService.sendInterviewReminder(
        { name: sanitizeInput(name), phone: to, preferredChannel: channel },
        { date: sanitizeInput(date), time: sanitizeInput(time), company: sanitizeInput(company), position: sanitizeInput(position) }
      );
    } else if (type === "welcome_message") {
      const { name } = body;
      
      // Validate required fields
      if (!name) {
        return NextResponse.json(
          { error: "Missing required fields for welcome message" },
          { status: 400 }
        );
      }

      console.log('[Twilio API] Sending welcome message');
      result = await twilioService.sendWelcomeMessage(
        { name: sanitizeInput(name), phone: to, preferredChannel: channel }
      );
    } else {
      // Send custom message
      console.log('[Twilio API] Sending custom message via', channel);
      if (channel === "whatsapp") {
        result = await twilioService.sendWhatsApp(to, sanitizedMessage);
      } else {
        result = await twilioService.sendSMS(to, sanitizedMessage);
      }
    }

    if (!result.success) {
      console.error('[Twilio API] Failed to send message:', result.error);
      return NextResponse.json(
        { error: result.error || "Failed to send message" },
        { status: 500 }
      );
    }

    console.log('[Twilio API] Message sent successfully');
    return NextResponse.json({
      success: true,
      messageId: result.messageId,
      channel,
      message: "Message sent successfully"
    });

  } catch (error) {
    console.error("[Twilio API] Error sending message:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// GET /api/twilio/send - Get send message status
export async function GET() {
  return NextResponse.json({
    message: "Twilio send message endpoint is active",
    supportedChannels: ["sms", "whatsapp"],
    supportedMessageTypes: ["custom", "job_application_confirmation", "interview_reminder", "welcome_message"],
    timestamp: new Date().toISOString()
  });
}