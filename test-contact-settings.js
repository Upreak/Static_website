// Test script for contact settings validation
const { z } = require('zod');

// Copy the validation logic from the updated settings route
const phoneRegex = /^(\+?\d{1,3}[- ]?)?\d{10,15}(\s*\(.*\))?$/;
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const socialMediaRegex = {
  facebook: /^https?:\/\/(www\.)?facebook\.com\/.+/,
  twitter: /^https?:\/\/(www\.)?twitter\.com\/.+/,
  linkedin: /^https?:\/\/(www\.)?linkedin\.com\/(company|in|pub)\/.+/,
  instagram: /^https?:\/\/(www\.)?instagram\.com\/.+/,
};

const officeHoursSchema = z.array(z.object({
  day: z.string().min(1, "Day is required").max(50, "Day name too long"),
  hours: z.string().min(1, "Hours are required").max(50, "Hours too long")
}));

// Helper function to normalize setting input to expected object format
const normalizeSetting = (value, defaultValue = "") => {
  if (typeof value === 'object' && value !== null && (value.value !== undefined || value.type !== undefined)) {
    // Already in object format
    return {
      value: value.value || defaultValue,
      type: value.type || "STRING"
    };
  } else {
    // Plain string value, convert to object format
    return {
      value: value || defaultValue,
      type: "STRING"
    };
  }
};

// Settings validation schema - accepts both plain strings and object format
const settingsSchema = z.object({
  // Basic site settings
  site_name: z.preprocess(
    (val) => normalizeSetting(val, "Upreak"),
    z.object({
      value: z.string().min(1, "Site name is required").max(100, "Site name must be less than 100 characters"),
      type: z.enum(["STRING"]).default("STRING")
    })
  ),
  site_description: z.preprocess(
    (val) => normalizeSetting(val, "Talent-Sourcing Solutions Partnering to Deliver Exceptional Talent"),
    z.object({
      value: z.string().min(10, "Description must be at least 10 characters").max(500, "Description must be less than 500 characters"),
      type: z.enum(["STRING"]).default("STRING")
    })
  ),
  
  // Contact settings
  contact_email: z.preprocess(
    (val) => normalizeSetting(val),
    z.object({
      value: z.string()
        .min(1, "Contact email is required")
        .email("Invalid email format")
        .regex(emailRegex, "Please enter a valid email address"),
      type: z.enum(["STRING"]).default("STRING")
    })
  ),
  contact_phone: z.preprocess(
    (val) => normalizeSetting(val),
    z.object({
      value: z.string()
        .min(1, "Contact phone is required")
        .regex(phoneRegex, "Please enter a valid phone number (+91 format or local numbers)")
        .max(50, "Phone number must be less than 50 characters"),
      type: z.enum(["STRING"]).default("STRING")
    })
  ),
  contact_address: z.preprocess(
    (val) => normalizeSetting(val),
    z.object({
      value: z.string().min(5, "Address must be at least 5 characters").max(500, "Address must be less than 500 characters"),
      type: z.enum(["STRING"]).default("STRING")
    })
  ),
  contact_hours: z.preprocess(
    (val) => normalizeSetting(val),
    z.object({
      value: z.string()
        .min(10, "Office hours are required")
        .max(200, "Office hours must be less than 200 characters")
        .refine((value) => {
          // Accept both plain string format and JSON format
          try {
            const parsed = JSON.parse(value);
            return officeHoursSchema.safeParse(parsed).success;
          } catch {
            // If JSON parsing fails, accept as plain string
            return value.trim().length >= 10;
          }
        }, "Office hours must be either a plain string or valid JSON format"),
      type: z.enum(["STRING"]).default("STRING")
    })
  ),
  contact_description: z.preprocess(
    (val) => normalizeSetting(val),
    z.object({
      value: z.string().min(10, "Description must be at least 10 characters").max(500, "Description must be less than 500 characters"),
      type: z.enum(["STRING"]).default("STRING")
    })
  ),
  
  // Footer settings (making fields optional as per task requirements)
  footer_address: z.preprocess(
    (val) => normalizeSetting(val),
    z.object({
      value: z.string().max(200, "Address must be less than 200 characters").optional(),
      type: z.enum(["STRING"]).default("STRING")
    })
  ),
  footer_get_in_touch: z.preprocess(
    (val) => normalizeSetting(val, "Get in touch with us for your recruitment needs."),
    z.object({
      value: z.string().max(500, "Get in touch content must be less than 500 characters").optional(),
      type: z.enum(["STRING"]).default("STRING")
    })
  ),
  footer_copyright: z.preprocess(
    (val) => normalizeSetting(val, "© {year} Upreak. All rights reserved."),
    z.object({
      value: z.string().max(200, "Copyright text must be less than 200 characters").optional(),
      type: z.enum(["STRING"]).default("STRING")
    })
  ),
  
  // Social media settings with platform-specific validation
  social_facebook: z.preprocess(
    (val) => normalizeSetting(val),
    z.object({
      value: z.string()
        .optional()
        .refine((val) => !val || socialMediaRegex.facebook.test(val) || val === "",
          "Facebook URL must contain facebook.com"),
      type: z.enum(["STRING"]).default("STRING")
    })
  ),
  social_twitter: z.preprocess(
    (val) => normalizeSetting(val),
    z.object({
      value: z.string()
        .optional()
        .refine((val) => !val || socialMediaRegex.twitter.test(val) || val === "",
          "Twitter URL must contain twitter.com"),
      type: z.enum(["STRING"]).default("STRING")
    })
  ),
  social_linkedin: z.preprocess(
    (val) => normalizeSetting(val),
    z.object({
      value: z.string()
        .optional()
        .refine((val) => !val || socialMediaRegex.linkedin.test(val) || val === "",
          "LinkedIn URL must contain linkedin.com"),
      type: z.enum(["STRING"]).default("STRING")
    })
  ),
  social_instagram: z.preprocess(
    (val) => normalizeSetting(val),
    z.object({
      value: z.string()
        .optional()
        .refine((val) => !val || socialMediaRegex.instagram.test(val) || val === "",
          "Instagram URL must contain instagram.com"),
      type: z.enum(["STRING"]).default("STRING")
    })
  ),
  
  // Logo and favicon settings
  site_logo: z.preprocess(
    (val) => normalizeSetting(val),
    z.object({
      value: z.string().url("Invalid logo URL").or(z.literal("")).optional(),
      type: z.enum(["STRING"]).default("STRING")
    })
  ),
  site_favicon: z.preprocess(
    (val) => normalizeSetting(val),
    z.object({
      value: z.string().url("Invalid favicon URL").or(z.literal("")).optional(),
      type: z.enum(["STRING"]).default("STRING")
    })
  )
});

// Test data with the provided contact details
const testSettings = {
  // Test with plain strings (should be normalized to objects)
  site_name: "Upreak",
  site_description: "Talent-Sourcing Solutions Partnering to Deliver Exceptional Talent",
  
  // Contact details as provided in the task
  contact_email: "info@upreak.com",
  contact_phone: "+91 99013 81877 (WhatsApp only)",
  contact_address: "UPREAK INDIA PRIVATE LIMITED 5-3-133,507,1st Floor,3rd, Neelakanteshwara Colony, Gangavathi, Koppal- 583227, Karnataka",
  contact_hours: "Monday to Saturday 9.30 am to 6.30 pm",
  contact_description: "Professional recruitment services with a focus on talent sourcing and staffing solutions.",
  
  // Footer settings
  footer_address: "UPREAK INDIA PRIVATE LIMITED 5-3-133,507,1st Floor,3rd, Neelakanteshwara Colony, Gangavathi, Koppal- 583227, Karnataka",
  footer_get_in_touch: "Get in touch with us for your recruitment needs. We provide comprehensive staffing solutions tailored to your business requirements.",
  footer_copyright: "© {year} Upreak. All rights reserved.",
  
  // Social media links (testing with empty values as per task)
  social_facebook: "",
  social_twitter: "",
  social_linkedin: "",
  social_instagram: "",
  
  // Logo and favicon
  site_logo: "",
  site_favicon: ""
};

// Test with object format (what the frontend actually sends)
const testSettingsWithObjects = {
  site_name: { value: "Upreak", type: "STRING" },
  site_description: { value: "Talent-Sourcing Solutions Partnering to Deliver Exceptional Talent", type: "STRING" },
  contact_email: { value: "info@upreak.com", type: "STRING" },
  contact_phone: { value: "+91 99013 81877 (WhatsApp only)", type: "STRING" },
  contact_address: { value: "UPREAK INDIA PRIVATE LIMITED 5-3-133,507,1st Floor,3rd, Neelakanteshwara Colony, Gangavathi, Koppal- 583227, Karnataka", type: "STRING" },
  contact_hours: { value: "Monday to Saturday 9.30 am to 6.30 pm", type: "STRING" },
  contact_description: { value: "Professional recruitment services with a focus on talent sourcing and staffing solutions.", type: "STRING" },
  footer_address: { value: "UPREAK INDIA PRIVATE LIMITED 5-3-133,507,1st Floor,3rd, Neelakanteshwara Colony, Gangavathi, Koppal- 583227, Karnataka", type: "STRING" },
  footer_get_in_touch: { value: "Get in touch with us for your recruitment needs. We provide comprehensive staffing solutions tailored to your business requirements.", type: "STRING" },
  footer_copyright: { value: "© {year} Upreak. All rights reserved.", type: "STRING" },
  social_facebook: { value: "", type: "STRING" },
  social_twitter: { value: "", type: "STRING" },
  social_linkedin: { value: "", type: "STRING" },
  social_instagram: { value: "", type: "STRING" },
  site_logo: { value: "", type: "STRING" },
  site_favicon: { value: "", type: "STRING" }
};

console.log("=== Testing Contact Settings Validation ===\n");

// Test 1: Plain strings
console.log("Test 1: Plain string input");
try {
  const result1 = settingsSchema.parse(testSettings);
  console.log("✅ Plain strings validation passed!");
  console.log("Normalized result:", JSON.stringify(result1, null, 2));
} catch (error) {
  console.log("❌ Plain strings validation failed:");
  console.log(error.issues);
}

console.log("\n" + "=".repeat(50) + "\n");

// Test 2: Object format
console.log("Test 2: Object format input");
try {
  const result2 = settingsSchema.parse(testSettingsWithObjects);
  console.log("✅ Object format validation passed!");
  console.log("Result:", JSON.stringify(result2, null, 2));
} catch (error) {
  console.log("❌ Object format validation failed:");
  console.log(error.issues);
}

console.log("\n" + "=".repeat(50) + "\n");

// Test 3: Mixed format (some strings, some objects)
console.log("Test 3: Mixed format input");
const mixedSettings = {
  ...testSettings,
  contact_email: { value: "info@upreak.com", type: "STRING" }, // Object
  contact_phone: "+91 99013 81877 (WhatsApp only)" // String
};

try {
  const result3 = settingsSchema.parse(mixedSettings);
  console.log("✅ Mixed format validation passed!");
  console.log("Normalized result:", JSON.stringify(result3, null, 2));
} catch (error) {
  console.log("❌ Mixed format validation failed:");
  console.log(error.issues);
}

console.log("\n" + "=".repeat(50) + "\n");

// Test 4: Invalid email
console.log("Test 4: Invalid email validation");
const invalidEmailSettings = {
  ...testSettings,
  contact_email: "invalid-email"
};

try {
  const result4 = settingsSchema.parse(invalidEmailSettings);
  console.log("❌ Invalid email should have failed but passed!");
} catch (error) {
  console.log("✅ Invalid email correctly rejected:");
  console.log(error.issues[0]?.message);
}

console.log("\n" + "=".repeat(50) + "\n");

// Test 5: Invalid phone
console.log("Test 5: Invalid phone validation");
const invalidPhoneSettings = {
  ...testSettings,
  contact_phone: "123"
};

try {
  const result5 = settingsSchema.parse(invalidPhoneSettings);
  console.log("❌ Invalid phone should have failed but passed!");
} catch (error) {
  console.log("✅ Invalid phone correctly rejected:");
  console.log(error.issues[0]?.message);
}

console.log("\n" + "=".repeat(50) + "\n");

// Test 6: Social media URL validation
console.log("Test 6: Social media URL validation");
const socialMediaSettings = {
  ...testSettings,
  social_facebook: "https://facebook.com/upreak",
  social_twitter: "https://twitter.com/upreak",
  social_linkedin: "https://linkedin.com/company/upreak",
  social_instagram: "https://instagram.com/upreak"
};

try {
  const result6 = settingsSchema.parse(socialMediaSettings);
  console.log("✅ Social media URLs validation passed!");
  console.log("Social media results:", {
    facebook: result6.social_facebook.value,
    twitter: result6.social_twitter.value,
    linkedin: result6.social_linkedin.value,
    instagram: result6.social_instagram.value
  });
} catch (error) {
  console.log("❌ Social media URLs validation failed:");
  console.log(error.issues);
}

console.log("\n" + "=".repeat(50) + "\n");

console.log("=== Test Summary ===");
console.log("All tests completed! The schema should now handle both plain strings and object formats.");
console.log("The contact details provided in the task should be validated correctly.");