import twilio from "twilio";

// Twilio service for handling SMS and WhatsApp messages
export class TwilioService {
  private client: twilio.Twilio;

  constructor() {
    // Validate required environment variables
    if (!process.env.TWILIO_ACCOUNT_SID || !process.env.TWILIO_AUTH_TOKEN) {
      throw new Error('Twilio credentials are not configured. Please set TWILIO_ACCOUNT_SID and TWILIO_AUTH_TOKEN environment variables.');
    }
    
    const accountSid = process.env.TWILIO_ACCOUNT_SID;
    const authToken = process.env.TWILIO_AUTH_TOKEN;
    
    this.client = twilio(accountSid, authToken);
  }

  /**
   * Send an SMS message
   */
  async sendSMS(to: string, body: string, from?: string): Promise<{ success: boolean; messageId?: string; error?: string }> {
    try {
      const fromNumber = from || process.env.TWILIO_PHONE_NUMBER;
      
      if (!fromNumber) {
        return {
          success: false,
          error: "Twilio phone number is not configured"
        };
      }
      
      // Validate phone number format
      if (!/^\+?[1-9]\d{1,14}$/.test(to)) {
        return {
          success: false,
          error: "Invalid recipient phone number format"
        };
      }

      // In a real application, you would use:
      const message = await this.client.messages.create({
        body,
        from: fromNumber,
        to
      });

      return {
        success: true,
        messageId: message.sid
      };
    } catch (error) {
      console.error("Error sending SMS:", error);
      return {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error"
      };
    }
  }

  /**
   * Send a WhatsApp message
   */
  async sendWhatsApp(to: string, body: string, from?: string): Promise<{ success: boolean; messageId?: string; error?: string }> {
    try {
      const fromNumber = from || process.env.TWILIO_WHATSAPP_NUMBER;
      
      if (!fromNumber) {
        return {
          success: false,
          error: "Twilio WhatsApp number is not configured"
        };
      }
      
      // Validate phone number format
      if (!/^\+?[1-9]\d{1,14}$/.test(to)) {
        return {
          success: false,
          error: "Invalid recipient phone number format"
        };
      }

      // In a real application, you would use:
      const message = await this.client.messages.create({
        body,
        from: fromNumber,
        to: `whatsapp:${to}`
      });

      return {
        success: true,
        messageId: message.sid
      };
    } catch (error) {
      console.error("Error sending WhatsApp message:", error);
      return {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error"
      };
    }
  }

  /**
   * Send a notification via SMS or WhatsApp based on user preference
   */
  async sendNotification(
    user: { phone: string; preferredChannel?: "sms" | "whatsapp" },
    message: string
  ): Promise<{ success: boolean; messageId?: string; error?: string }> {
    const channel = user.preferredChannel || "sms";
    
    if (channel === "whatsapp") {
      return this.sendWhatsApp(user.phone, message);
    } else {
      return this.sendSMS(user.phone, message);
    }
  }

  /**
   * Send job application confirmation
   */
  async sendJobApplicationConfirmation(
    user: { name: string; phone: string; preferredChannel?: "sms" | "whatsapp" },
    jobTitle: string,
    companyName: string
  ): Promise<{ success: boolean; messageId?: string; error?: string }> {
    const message = `Hi ${user.name}! Thank you for applying for the ${jobTitle} position at ${companyName}. We've received your application and will review it shortly. Best regards, Upreak Team`;
    
    return this.sendNotification(user, message);
  }

  /**
   * Send interview reminder
   */
  async sendInterviewReminder(
    user: { name: string; phone: string; preferredChannel?: "sms" | "whatsapp" },
    interviewDetails: { date: string; time: string; company: string; position: string }
  ): Promise<{ success: boolean; messageId?: string; error?: string }> {
    const message = `Hi ${user.name}! Reminder: You have an interview for the ${interviewDetails.position} position at ${interviewDetails.company} on ${interviewDetails.date} at ${interviewDetails.time}. Good luck! - Upreak Team`;
    
    return this.sendNotification(user, message);
  }

  /**
   * Send welcome message to new users
   */
  async sendWelcomeMessage(
    user: { name: string; phone: string; preferredChannel?: "sms" | "whatsapp" }
  ): Promise<{ success: boolean; messageId?: string; error?: string }> {
    const message = `Welcome to Upreak, ${user.name}! We're excited to help you find your dream job. Browse our latest opportunities at www.upreak.com or reply to this message for assistance.`;
    
    return this.sendNotification(user, message);
  }

  /**
   * Process incoming message (webhook handler)
   */
  async processIncomingMessage(
    from: string,
    body: string,
    channel: "sms" | "whatsapp"
  ): Promise<{ success: boolean; response?: string; error?: string }> {
    try {
      console.log(`[Twilio Demo] Incoming ${channel} from ${from}: ${body}`);
      
      // Process the message and generate a response
      const response = this.generateAutoResponse(body, channel);
      
      // Send the response back
      if (channel === "whatsapp") {
        await this.sendWhatsApp(from, response);
      } else {
        await this.sendSMS(from, response);
      }
      
      return {
        success: true,
        response
      };
    } catch (error) {
      console.error("Error processing incoming message:", error);
      return {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error"
      };
    }
  }

  /**
   * Generate automatic response for incoming messages
   */
  private generateAutoResponse(message: string, channel: "sms" | "whatsapp"): string {
    const lowerMessage = message.toLowerCase();
    
    if (lowerMessage.includes("job") || lowerMessage.includes("career")) {
      return "Thank you for your interest in job opportunities! Please visit www.upreak.com to browse our latest openings or reply with your email address for personalized assistance.";
    }
    
    if (lowerMessage.includes("apply")) {
      return "To apply for a position, please visit our website at www.upreak.com and submit your application through the job listing. You can also email your resume to jobs@upreak.com.";
    }
    
    if (lowerMessage.includes("status") || lowerMessage.includes("application")) {
      return "To check your application status, please email us at applications@upreak.com with your name and the position you applied for.";
    }
    
    if (lowerMessage.includes("help") || lowerMessage.includes("support")) {
      return "Our support team is here to help! You can reach us at +91 79759 30773 or support@upreak.com. What specific assistance do you need?";
    }
    
    // Default response
    return "Thank you for contacting Upreak! We're here to help with your recruitment needs. For immediate assistance, please call us at +91 79759 30773 or visit www.upreak.com.";
  }
}

// Export singleton instance
export const twilioService = new TwilioService();