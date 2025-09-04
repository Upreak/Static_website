import { NextRequest, NextResponse } from "next/server";
import { writeFile, mkdir, unlink } from "fs/promises";
import { join } from "path";
import { db } from "@/lib/db";
import { faviconGenerator } from "@/lib/favicon-generator";

export async function POST(request: NextRequest) {
  try {
    console.log('[Upload API] Starting file upload process');
    
    const data = await request.formData();
    const file: File | null = data.get("file") as unknown as File;
    const type = data.get("type") as string; // "logo" or "favicon"
    const updatedBy = data.get("updatedBy") as string;

    if (!file) {
      console.error('[Upload API] No file provided');
      return NextResponse.json(
        { error: "No file provided" },
        { status: 400 }
      );
    }

    if (!type || !["logo", "favicon"].includes(type)) {
      console.error('[Upload API] Invalid file type:', type);
      return NextResponse.json(
        { error: "Invalid file type. Must be 'logo' or 'favicon'" },
        { status: 400 }
      );
    }

    if (!updatedBy) {
      console.error('[Upload API] No updatedBy provided');
      return NextResponse.json(
        { error: "updatedBy is required" },
        { status: 400 }
      );
    }

    // Validate file type
    const allowedTypes = type === "logo" 
      ? ["image/jpeg", "image/jpg", "image/png", "image/svg+xml"]
      : ["image/x-icon", "image/vnd.microsoft.icon", "image/png"];
    
    if (!allowedTypes.includes(file.type)) {
      console.error('[Upload API] Invalid file type:', file.type);
      return NextResponse.json(
        { error: `Invalid file type. ${type === "logo" ? "JPEG, PNG, or SVG" : "ICO or PNG"} files only.` },
        { status: 400 }
      );
    }

    // Validate file size (max 5MB)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      console.error('[Upload API] File too large:', file.size);
      return NextResponse.json(
        { error: "File too large. Maximum size is 5MB." },
        { status: 400 }
      );
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Create uploads directory if it doesn't exist
    const uploadDir = join(process.cwd(), "public", "uploads");
    try {
      await mkdir(uploadDir, { recursive: true });
      console.log('[Upload API] Upload directory created/verified:', uploadDir);
    } catch (error) {
      console.error('[Upload API] Error creating upload directory:', error);
    }

    // Generate filename
    const timestamp = Date.now();
    const fileExtension = file.name.split('.').pop();
    const fileName = `${type}_${timestamp}.${fileExtension}`;
    const filePath = join(uploadDir, fileName);

    // Write file to disk
    try {
      await writeFile(filePath, buffer);
      console.log('[Upload API] File written successfully:', filePath);
    } catch (error) {
      console.error('[Upload API] Error writing file:', error);
      return NextResponse.json(
        { error: "Failed to save file" },
        { status: 500 }
      );
    }

    // Save file info to database
    const fileUrl = `/uploads/${fileName}`;
    let generatedFavicons: string[] = [];
    
    try {
      console.log('[Upload API] Saving file info to database');
      
      // Update or create setting
      const setting = await db.siteSetting.upsert({
        where: { key: type === "logo" ? "site_logo" : "site_favicon" },
        update: {
          value: fileUrl,
          type: "STRING",
          updatedBy,
          updatedAt: new Date()
        },
        create: {
          key: type === "logo" ? "site_logo" : "site_favicon",
          value: fileUrl,
          type: "STRING",
          updatedBy
        }
      });

      console.log('[Upload API] File info saved to database:', setting);
      
      // If logo is uploaded, automatically generate favicons
      if (type === "logo") {
        try {
          console.log('[Upload API] Generating favicons for logo');
          const faviconDir = join(process.cwd(), "public", "favicons");
          const timestamp = Date.now();
          
          generatedFavicons = await faviconGenerator.generateFavicons({
            sourceImagePath: filePath,
            outputDir: faviconDir,
            sizes: [16, 32, 48, 64, 128, 180, 192, 256, 512],
            formats: ['png']
          });
          
          // Save favicon URLs to database
          const faviconBaseUrl = `/favicons`;
          const faviconFiles = {
            'favicon_16x16': `${faviconBaseUrl}/favicon-16x16.png?t=${timestamp}`,
            'favicon_32x32': `${faviconBaseUrl}/favicon-32x32.png?t=${timestamp}`,
            'favicon_48x48': `${faviconBaseUrl}/favicon-48x48.png?t=${timestamp}`,
            'favicon_64x64': `${faviconBaseUrl}/favicon-64x64.png?t=${timestamp}`,
            'favicon_128x128': `${faviconBaseUrl}/favicon-128x128.png?t=${timestamp}`,
            'favicon_180x180': `${faviconBaseUrl}/apple-touch-icon.png?t=${timestamp}`,
            'favicon_192x192': `${faviconBaseUrl}/android-chrome-192x192.png?t=${timestamp}`,
            'favicon_256x256': `${faviconBaseUrl}/favicon-256x256.png?t=${timestamp}`,
            'favicon_512x512': `${faviconBaseUrl}/android-chrome-512x512.png?t=${timestamp}`,
            'favicon_ico': `${faviconBaseUrl}/favicon.ico?t=${timestamp}`
          };
          
          // Update favicon settings
          for (const [key, value] of Object.entries(faviconFiles)) {
            await db.siteSetting.upsert({
              where: { key },
              update: {
                value,
                type: "STRING",
                updatedBy,
                updatedAt: new Date()
              },
              create: {
                key,
                value,
                type: "STRING",
                updatedBy
              }
            });
          }
          
          console.log('[Upload API] Favicons generated successfully:', generatedFavicons);
        } catch (faviconError) {
          console.error('[Upload API] Error generating favicons:', faviconError);
          // Don't fail the upload if favicon generation fails
        }
      }
    } catch (error) {
      console.error('[Upload API] Error saving file info to database:', error);
      // Don't fail the upload if database save fails
    }

    return NextResponse.json({
      success: true,
      message: "File uploaded successfully",
      fileUrl,
      fileName,
      fileType: type
    });

  } catch (error) {
    console.error("[Upload API] Upload error:", error);
    return NextResponse.json(
      { error: "Failed to upload file" },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    message: "File upload endpoint is active",
    supportedTypes: ["logo", "favicon"],
    maxFileSize: "5MB",
    supportedFormats: {
      logo: ["JPEG", "PNG", "SVG"],
      favicon: ["ICO", "PNG"]
    },
    timestamp: new Date().toISOString()
  });
}