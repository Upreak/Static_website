import { NextRequest, NextResponse } from "next/server";
import { twilioService } from "@/lib/twilio/twilio.service";

// POST /api/twilio/sms - Handle incoming SMS messages (Twilio webhook)
export async function POST(request: NextRequest) {
  try {
    // Parse form data from Twilio
    const formData = await request.formData();
    
    const from = formData.get("From") as string;
    const body = formData.get("Body") as string;
    const to = formData.get("To") as string;
    
    console.log("Incoming SMS:", { from, body, to });

    if (!from || !body) {
      return new NextResponse("Missing required parameters", { status: 400 });
    }

    // Process the incoming message
    const result = await twilioService.processIncomingMessage(from, body, "sms");

    if (!result.success) {
      console.error("Failed to process SMS:", result.error);
      return new NextResponse("Error processing message", { status: 500 });
    }

    // Return TwiML response
    const twiml = `<?xml version="1.0" encoding="UTF-8"?>
<Response>
  <Message>${result.response}</Message>
</Response>`;

    return new NextResponse(twiml, {
      headers: {
        "Content-Type": "text/xml"
      }
    });

  } catch (error) {
    console.error("Error processing SMS webhook:", error);
    return new NextResponse("Internal server error", { status: 500 });
  }
}

// GET /api/twilio/sms - Verify webhook endpoint
export async function GET() {
  return NextResponse.json({
    message: "Twilio SMS webhook endpoint is active",
    timestamp: new Date().toISOString()
  });
}