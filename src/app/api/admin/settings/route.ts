import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { z } from "zod";
import { settingsCache, invalidateCache } from "@/lib/cache";

// GET /api/admin/settings - Get all settings (with cache)
export async function GET(request: NextRequest) {
  try {
    // Try to get from cache first
    const cachedSettings = await settingsCache.getAll();
    
    if (Object.keys(cachedSettings).length > 0) {
      // Transform cached settings to match the expected format
      const transformedSettings = Object.keys(cachedSettings).reduce((acc, key) => {
        const cachedValue = cachedSettings[key];
        if (typeof cachedValue === 'object' && cachedValue.value !== undefined) {
          // Already in correct format
          acc[key] = cachedValue;
        } else {
          // Transform from string format to object format
          acc[key] = {
            value: cachedValue,
            type: "STRING",
            description: null,
            updatedAt: new Date().toISOString()
          };
        }
        return acc;
      }, {} as Record<string, any>);
      
      return NextResponse.json({ success: true, settings: transformedSettings });
    }

    // Fallback to database if cache is empty
    const settings = await db.siteSetting.findMany({
      include: {
        updater: {
          select: { id: true, name: true, email: true }
        }
      },
      orderBy: { key: "asc" }
    });

    // Convert settings array to key-value object in the format expected by frontend
    const settingsObj = settings.reduce((acc, setting) => {
      acc[setting.key] = {
        value: setting.value,
        type: setting.type,
        description: setting.description,
        updatedAt: setting.updatedAt
      };
      return acc;
    }, {} as Record<string, any>);

    // Cache the results
    settingsCache.set('all_settings', settingsObj);

    return NextResponse.json({ success: true, settings: settingsObj });
  } catch (error) {
    console.error("Error fetching settings:", error);
    return NextResponse.json(
      { error: "Failed to fetch settings" },
      { status: 500 }
    );
  }
}

// Phone number validation regex (accepts +91 format and local numbers)
const phoneRegex = /^(\+?\d{1,3}[- ]?)?\d{10,15}$/;

// Email validation regex
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Social media URL validation regex
const socialMediaRegex = {
  facebook: /^https?:\/\/(www\.)?facebook\.com\/.+/,
  twitter: /^https?:\/\/(www\.)?twitter\.com\/.+/,
  linkedin: /^https?:\/\/(www\.)?linkedin\.com\/(company|in|pub)\/.+/,
  instagram: /^https?:\/\/(www\.)?instagram\.com\/.+/,
};

// Office hours JSON schema validation
const officeHoursSchema = z.array(z.object({
  day: z.string().min(1, "Day is required").max(50, "Day name too long"),
  hours: z.string().min(1, "Hours are required").max(50, "Hours too long")
}));

// Settings validation schema
const settingsSchema = z.object({
  // Basic site settings
  site_name: z.object({
    value: z.string().min(1, "Site name is required").max(100, "Site name must be less than 100 characters"),
    type: z.enum(["STRING"]).default("STRING")
  }),
  site_description: z.object({
    value: z.string().min(10, "Description must be at least 10 characters").max(500, "Description must be less than 500 characters"),
    type: z.enum(["STRING"]).default("STRING")
  }),
  
  // Contact settings
  contact_email: z.object({
    value: z.string()
      .min(1, "Contact email is required")
      .email("Invalid email format")
      .regex(emailRegex, "Please enter a valid email address"),
    type: z.enum(["STRING"]).default("STRING")
  }),
  contact_phone: z.object({
    value: z.string()
      .min(1, "Contact phone is required")
      .regex(phoneRegex, "Please enter a valid phone number (+91 format or local numbers)")
      .max(20, "Phone number must be less than 20 characters"),
    type: z.enum(["STRING"]).default("STRING")
  }),
  contact_address: z.object({
    value: z.string().min(5, "Address must be at least 5 characters").max(500, "Address must be less than 500 characters"),
    type: z.enum(["STRING"]).default("STRING")
  }),
  contact_hours: z.object({
    value: z.string()
      .min(10, "Office hours are required")
      .max(1000, "Office hours must be less than 1000 characters")
      .refine((value) => {
        try {
          const parsed = JSON.parse(value);
          return officeHoursSchema.safeParse(parsed).success;
        } catch {
          return false;
        }
      }, "Invalid JSON format in Office Hours. Please provide a valid JSON array with day and hours objects."),
    type: z.enum(["STRING"]).default("STRING")
  }),
  contact_description: z.object({
    value: z.string().min(10, "Description must be at least 10 characters").max(500, "Description must be less than 500 characters"),
    type: z.enum(["STRING"]).default("STRING")
  }),
  
  // Footer settings (making fields optional as per task requirements)
  footer_address: z.object({
    value: z.string().max(200, "Address must be less than 200 characters").optional(),
    type: z.enum(["STRING"]).default("STRING")
  }),
  footer_get_in_touch: z.object({
    value: z.string().max(500, "Get in touch content must be less than 500 characters").optional(),
    type: z.enum(["STRING"]).default("STRING")
  }),
  footer_copyright: z.object({
    value: z.string().max(200, "Copyright text must be less than 200 characters").optional(),
    type: z.enum(["STRING"]).default("STRING")
  }),
  
  // Social media settings with platform-specific validation
  social_facebook: z.object({
    value: z.string()
      .optional()
      .refine((val) => !val || socialMediaRegex.facebook.test(val) || val === "",
        "Facebook URL must contain facebook.com"),
    type: z.enum(["STRING"]).default("STRING")
  }),
  social_twitter: z.object({
    value: z.string()
      .optional()
      .refine((val) => !val || socialMediaRegex.twitter.test(val) || val === "",
        "Twitter URL must contain twitter.com"),
    type: z.enum(["STRING"]).default("STRING")
  }),
  social_linkedin: z.object({
    value: z.string()
      .optional()
      .refine((val) => !val || socialMediaRegex.linkedin.test(val) || val === "",
        "LinkedIn URL must contain linkedin.com"),
    type: z.enum(["STRING"]).default("STRING")
  }),
  social_instagram: z.object({
    value: z.string()
      .optional()
      .refine((val) => !val || socialMediaRegex.instagram.test(val) || val === "",
        "Instagram URL must contain instagram.com"),
    type: z.enum(["STRING"]).default("STRING")
  }),
  
  // Logo and favicon settings
  site_logo: z.object({
    value: z.string().url("Invalid logo URL").or(z.literal("")).optional(),
    type: z.enum(["STRING"]).default("STRING")
  }),
  site_favicon: z.object({
    value: z.string().url("Invalid favicon URL").or(z.literal("")).optional(),
    type: z.enum(["STRING"]).default("STRING")
  })
});

// Office hours validation function
const validateOfficeHours = (hoursString: string) => {
  try {
    const hours = JSON.parse(hoursString);
    officeHoursSchema.parse(hours);
    return { valid: true, error: null };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        valid: false,
        error: error.issues[0]?.message || "Invalid office hours format"
      };
    }
    return {
      valid: false,
      error: "Invalid JSON format in Office Hours"
    };
  }
};

// POST /api/admin/settings - Update settings
export async function POST(request: NextRequest) {
  try {
    const { settings, updatedBy } = await request.json();

    if (!settings || !updatedBy) {
      return NextResponse.json(
        { error: "Settings and updatedBy are required" },
        { status: 400 }
      );
    }

    // Validate settings using Zod schema
    const validatedSettings = settingsSchema.parse(settings);
    const updatedSettings: any[] = [];
    const validationErrors: any[] = [];

    // Special validation for office hours
    if (settings.contact_hours?.value) {
      const officeHoursValidation = validateOfficeHours(settings.contact_hours.value);
      if (!officeHoursValidation.valid) {
        validationErrors.push({
          field: "contact_hours",
          message: officeHoursValidation.error || "Invalid office hours format"
        });
      }
    }

    // Check for email uniqueness if contact_email is being updated
    if (settings.contact_email?.value) {
      const existingEmail = await db.siteSetting.findUnique({
        where: { key: "contact_email" }
      });
      
      if (existingEmail && existingEmail.value !== settings.contact_email.value) {
        // Check if this email already exists in another setting
        const emailExists = await db.siteSetting.findFirst({
          where: {
            key: "contact_email",
            value: settings.contact_email.value,
            NOT: { id: existingEmail.id }
          }
        });
        
        if (emailExists) {
          validationErrors.push({
            field: "contact_email",
            message: "This email address is already in use"
          });
        }
      }
    }

    if (validationErrors.length > 0) {
      return NextResponse.json(
        { error: "Validation failed", details: validationErrors },
        { status: 400 }
      );
    }

    for (const [key, data] of Object.entries(validatedSettings)) {
      const { value, type } = data;

      // Sanitize input
      const sanitizedValue = value?.toString().trim() || '';
      
      // Update or create setting
      const setting = await db.siteSetting.upsert({
        where: { key },
        update: {
          value: sanitizedValue,
          type: type as any,
          updatedBy,
          updatedAt: new Date()
        },
        create: {
          key,
          value: sanitizedValue,
          type: type as any,
          updatedBy
        }
      });

      updatedSettings.push(setting);
    }

    // Invalidate cache after successful update
    invalidateCache(['all_settings']);

    return NextResponse.json({ success: true, settings: updatedSettings });
  } catch (error) {
    console.error("Error updating settings:", error);
    
    if (error instanceof z.ZodError) {
      // Format Zod errors to be more specific
      const formattedErrors = error.issues.map(issue => ({
        field: issue.path.join('.'),
        message: issue.message
      }));
      
      return NextResponse.json(
        { error: "Validation failed", details: formattedErrors },
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      { error: "Failed to update settings" },
      { status: 500 }
    );
  }
}