import { Metadata } from "next";
import CookiePolicyPageClient from "./client";

export const metadata: Metadata = {
  title: "Cookie Policy - Upreak Talent-Sourcing Solutions",
  description: "Learn about how Upreak uses cookies to enhance your browsing experience, analyze website traffic, and provide personalized services.",
  keywords: [
    "cookie policy",
    "cookie usage",
    "privacy cookies",
    "Upreak cookies",
    "website cookies",
    "data collection",
    "user preferences"
  ],
  authors: [{ name: "Upreak Team" }],
  openGraph: {
    title: "Cookie Policy - Upreak",
    description: "Learn about how Upreak uses cookies to enhance your browsing experience",
    url: "https://upreak.com/cookie-policy",
    siteName: "Upreak",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Cookie Policy - Upreak",
    description: "Learn about how Upreak uses cookies to enhance your browsing experience",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function CookiePolicyPage() {
  return <CookiePolicyPageClient />;
}