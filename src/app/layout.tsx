import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import EnhancedChatWidget from "@/components/chat/EnhancedChatWidget";
import Footer from "@/components/layout/footer";
import { db } from "@/lib/db";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Upreak - Talent-Sourcing Solutions",
  description: "Preferred Recruitment Business Partner for companies seeking to align top-tier talent with strategic business goals. Our TriadX Process combines AI, Human expertise, and Data analytics.",
  keywords: ["Upreak", "Recruitment", "Talent Sourcing", "HR Solutions", "Staffing", "AI Recruitment", "Healthcare Recruitment"],
  authors: [{ name: "Upreak Team" }],
  icons: {
    icon: [
      { url: '/favicons/favicon.ico', type: 'image/x-icon' },
      { url: '/favicons/favicon-16x16.png', type: 'image/png', sizes: '16x16' },
      { url: '/favicons/favicon-32x32.png', type: 'image/png', sizes: '32x32' },
      { url: '/favicons/favicon-48x48.png', type: 'image/png', sizes: '48x48' },
      { url: '/favicons/favicon-64x64.png', type: 'image/png', sizes: '64x64' },
      { url: '/favicons/favicon-128x128.png', type: 'image/png', sizes: '128x128' },
    ],
    apple: [
      { url: '/favicons/apple-touch-icon.png', type: 'image/png', sizes: '180x180' },
    ],
    other: [
      { url: '/favicons/android-chrome-192x192.png', type: 'image/png', sizes: '192x192' },
      { url: '/favicons/android-chrome-512x512.png', type: 'image/png', sizes: '512x512' },
    ],
  },
  manifest: '/favicons/site.webmanifest',
  openGraph: {
    title: "Upreak - Talent-Sourcing Solutions",
    description: "Preferred Recruitment Business Partner delivering exceptional talent through AI, Human expertise, and Data analytics.",
    url: "https://upreak.com",
    siteName: "Upreak",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Upreak - Talent-Sourcing Solutions",
    description: "Preferred Recruitment Business Partner delivering exceptional talent through AI, Human expertise, and Data analytics.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
      >
        {children}
        <Toaster />
        <EnhancedChatWidget />
        <Footer />
      </body>
    </html>
  );
}
