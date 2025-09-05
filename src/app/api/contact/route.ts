import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { sanitizeInput } from "@/lib/auth";

// GET /api/contact - Get contact information
export async function GET(request: NextRequest) {
  try {
    console.log('[Contact API] === FETCH START ===');
    console.log('[Contact API] Request URL:', request.url);
    console.log('[Contact API] Request method:', request.method);
    
    // Try to get contact information from database
    console.log('[Contact API] Attempting database connection...');
    console.log('[Contact API] Database URL:', process.env.DATABASE_URL);
    
    const contactSettings = await db.siteSetting.findMany({
      where: {
        key: {
          in: [
            "contact_phone",
            "contact_email",
            "contact_address",
            "contact_hours",
            "contact_description"
          ]
        }
      }
    });
    console.log('[Contact API] Database query successful, found', contactSettings.length, 'settings');

    // Transform settings into a contact object
    const contactInfo: any = {
      phones: [],
      emails: [],
      address: "",
      hours: [],
      description: ""
    };

    contactSettings.forEach(setting => {
      switch (setting.key) {
        case "contact_phone":
          try {
            contactInfo.phones = JSON.parse(setting.value);
          } catch {
            // If it's not JSON, treat as a single phone number
            contactInfo.phones = [setting.value];
          }
          break;
        case "contact_email":
          try {
            contactInfo.emails = JSON.parse(setting.value);
          } catch {
            // If it's not JSON, treat as a single email
            contactInfo.emails = [setting.value];
          }
          break;
        case "contact_address":
          contactInfo.address = setting.value;
          break;
        case "contact_hours":
          try {
            contactInfo.hours = JSON.parse(setting.value);
          } catch {
            // If it's not JSON, treat as plain text
            contactInfo.hours = [{ day: "Office Hours", hours: setting.value }];
          }
          break;
        case "contact_description":
          contactInfo.description = setting.value;
          break;
      }
    });

    // If no contact info in database, return default values
    if (contactInfo.phones.length === 0 && contactInfo.emails.length === 0) {
      console.log('[Contact API] No contact info in database, using defaults');
      return NextResponse.json({
        success: true,
        contact: {
          phones: ["+91 79759 30773", "+91 7483756277"],
          emails: ["business@upreak.com", "sales@upreak.com", "mahesha@upreak.com"],
          address: "Bangalore, Karnataka",
          hours: [
            { day: "Monday - Friday", hours: "9:00 AM - 6:00 PM" },
            { day: "Saturday", hours: "10:00 AM - 4:00 PM" },
            { day: "Sunday", hours: "Closed" }
          ],
          description: "Ready to find exceptional talent for your organization? We're here to help you with all your recruitment needs."
        }
      });
    }

    console.log('[Contact API] Contact information retrieved successfully');
    console.log('[Contact API] === FETCH SUCCESS ===');
    return NextResponse.json({ success: true, contact: contactInfo });
  } catch (error) {
    console.error("[Contact API] Error fetching contact information:", error);
    console.log('[Contact API] === FETCH FAILED ===');
    return NextResponse.json(
      { error: "Failed to fetch contact information" },
      { status: 500 }
    );
  }
}

// POST /api/contact - Update contact information (admin only)
export async function POST(request: NextRequest) {
  try {
    console.log('[Contact API] Updating contact information');
    
    const { phones, emails, address, hours, description, updatedBy } = await request.json();

    // Input validation
    if (!updatedBy) {
      return NextResponse.json(
        { error: "updatedBy is required" },
        { status: 400 }
      );
    }

    // Validate and sanitize inputs
    if (phones && !Array.isArray(phones)) {
      return NextResponse.json(
        { error: "Phones must be an array" },
        { status: 400 }
      );
    }

    if (emails && !Array.isArray(emails)) {
      return NextResponse.json(
        { error: "Emails must be an array" },
        { status: 400 }
      );
    }

    // Validate email format
    if (emails) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      for (const email of emails) {
        if (!emailRegex.test(email)) {
          return NextResponse.json(
            { error: `Invalid email format: ${email}` },
            { status: 400 }
          );
        }
      }
    }

    // Sanitize string inputs
    const sanitizedAddress = address ? sanitizeInput(address) : '';
    const sanitizedDescription = description ? sanitizeInput(description) : '';

    // Update each contact setting
    const updates = [
      { key: "contact_phone", value: JSON.stringify(phones || []) },
      { key: "contact_email", value: JSON.stringify(emails || []) },
      { key: "contact_address", value: sanitizedAddress },
      { key: "contact_hours", value: JSON.stringify(hours || []) },
      { key: "contact_description", value: sanitizedDescription }
    ];

    for (const update of updates) {
      await db.siteSetting.upsert({
        where: { key: update.key },
        update: {
          value: update.value,
          type: "JSON",
          updatedBy: sanitizeInput(updatedBy),
          updatedAt: new Date()
        },
        create: {
          key: update.key,
          value: update.value,
          type: "JSON",
          updatedBy: sanitizeInput(updatedBy)
        }
      });
    }

    console.log('[Contact API] Contact information updated successfully');
    return NextResponse.json({
      success: true,
      message: "Contact information updated successfully"
    });
  } catch (error) {
    console.error("[Contact API] Error updating contact information:", error);
    return NextResponse.json(
      { error: "Failed to update contact information" },
      { status: 500 }
    );
  }
}