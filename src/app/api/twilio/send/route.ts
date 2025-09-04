import { NextRequest, NextResponse } from "next/server";
import { twilioService } from "@/lib/twilio/twilio.service";

// POST /api/twilio/send - Send messages via SMS or WhatsApp
export async function POST(request: NextRequest) {
  try {
    console.log('[Twilio API] Processing request');
    const body = await request.json();
    const { to, message, channel, type } = body;

    console.log('[Twilio API] Request parameters:', { to, message: message?.substring(0, 50), channel, type });

    if (!to || !message || !channel) {
      console.error('[Twilio API] Missing required parameters');
      return NextResponse.json(
        { error: "Missing required parameters: to, message, channel" },
        { status: 400 }
      );
    }

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
      console.log('[Twilio API] Sending job application confirmation');
      result = await twilioService.sendJobApplicationConfirmation(
        { name, phone: to, preferredChannel: channel },
        jobTitle,
        companyName
      );
    } else if (type === "interview_reminder") {
      const { name, date, time, company, position } = body;
      console.log('[Twilio API] Sending interview reminder');
      result = await twilioService.sendInterviewReminder(
        { name, phone: to, preferredChannel: channel },
        { date, time, company, position }
      );
    } else if (type === "welcome_message") {
      const { name } = body;
      console.log('[Twilio API] Sending welcome message');
      result = await twilioService.sendWelcomeMessage(
        { name, phone: to, preferredChannel: channel }
      );
    } else {
      // Send custom message
      console.log('[Twilio API] Sending custom message via', channel);
      if (channel === "whatsapp") {
        result = await twilioService.sendWhatsApp(to, message);
      } else {
        result = await twilioService.sendSMS(to, message);
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