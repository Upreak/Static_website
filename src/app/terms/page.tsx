import { Metadata } from "next";
import TermsPageClient from "./client";

export const metadata: Metadata = {
  title: "Terms and Conditions - Upreak Talent-Sourcing Solutions",
  description: "Read the terms and conditions for using Upreak's talent-sourcing and recruitment services. Learn about our service agreements, user obligations, and policies.",
  keywords: [
    "terms and conditions",
    "service agreement",
    "Upreak terms",
    "recruitment terms",
    "talent sourcing terms",
    "HR services terms",
    "employment terms"
  ],
  authors: [{ name: "Upreak Team" }],
  openGraph: {
    title: "Terms and Conditions - Upreak",
    description: "Terms and conditions for Upreak's talent-sourcing and recruitment services",
    url: "https://upreak.com/terms",
    siteName: "Upreak",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Terms and Conditions - Upreak",
    description: "Terms and conditions for Upreak's talent-sourcing and recruitment services",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function TermsPage() {
  return <TermsPageClient />;
}