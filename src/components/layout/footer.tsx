"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { Phone, Mail, MapPin, Facebook, Twitter, Linkedin, Instagram, Globe } from "lucide-react";

interface FooterData {
  company_name?: string;
  company_description?: string;
  company_address?: string;
  contact_phone?: string;
  contact_email?: string;
  social_media_links?: {
    facebook?: string;
    twitter?: string;
    linkedin?: string;
    instagram?: string;
  };
  get_in_touch_content?: string;
  copyright_text?: string;
}

export default function Footer() {
  const [footerData, setFooterData] = useState<FooterData>({});
  const [isLoading, setIsLoading] = useState(true);
  const [currentYear] = useState(new Date().getFullYear());

  useEffect(() => {
    const fetchFooterData = async () => {
      try {
        const response = await fetch('/api/admin/settings');
        const data = await response.json();
        
        if (data.success) {
          const settings = data.settings;
          const footerData: FooterData = {
            company_name: settings.site_name?.value || "Upreak",
            company_description: settings.site_description?.value || "Preferred Recruitment Business Partner delivering exceptional talent through AI, Human expertise, and Data analytics.",
            company_address: settings.footer_address?.value || "Bangalore, Karnataka",
            contact_phone: settings.contact_phone?.value || "+91 79759 30773",
            contact_email: settings.contact_email?.value || "business@upreak.com",
            social_media_links: {
              facebook: settings.social_facebook?.value,
              twitter: settings.social_twitter?.value,
              linkedin: settings.social_linkedin?.value,
              instagram: settings.social_instagram?.value,
            },
            get_in_touch_content: settings.footer_get_in_touch?.value || "Get in touch with us for your recruitment needs.",
            copyright_text: settings.footer_copyright?.value || `© ${currentYear} Upreak. All rights reserved.`
          };
          setFooterData(footerData);
        }
      } catch (error) {
        console.error('Error fetching footer data:', error);
        // Use default data if API fails
        setFooterData({
          company_name: "Upreak",
          company_description: "Preferred Recruitment Business Partner delivering exceptional talent through AI, Human expertise, and Data analytics.",
          company_address: "Bangalore, Karnataka",
          contact_phone: "+91 79759 30773",
          contact_email: "business@upreak.com",
          social_media_links: {},
          get_in_touch_content: "Get in touch with us for your recruitment needs.",
          copyright_text: `© ${currentYear} Upreak. All rights reserved.`
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchFooterData();
  }, [currentYear]);

  if (isLoading) {
    return (
      <footer className="bg-gray-900 text-white pt-16 pb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="animate-pulse">
              <div className="h-8 bg-gray-700 rounded mb-4"></div>
              <div className="h-4 bg-gray-700 rounded mb-2"></div>
              <div className="h-4 bg-gray-700 rounded mb-2"></div>
              <div className="h-4 bg-gray-700 rounded"></div>
            </div>
            <div className="animate-pulse">
              <div className="h-6 bg-gray-700 rounded mb-4"></div>
              <div className="h-4 bg-gray-700 rounded mb-2"></div>
              <div className="h-4 bg-gray-700 rounded mb-2"></div>
              <div className="h-4 bg-gray-700 rounded"></div>
            </div>
            <div className="animate-pulse">
              <div className="h-6 bg-gray-700 rounded mb-4"></div>
              <div className="h-4 bg-gray-700 rounded mb-2"></div>
              <div className="h-4 bg-gray-700 rounded mb-2"></div>
              <div className="h-4 bg-gray-700 rounded"></div>
            </div>
            <div className="animate-pulse">
              <div className="h-6 bg-gray-700 rounded mb-4"></div>
              <div className="h-4 bg-gray-700 rounded mb-2"></div>
              <div className="h-4 bg-gray-700 rounded mb-2"></div>
              <div className="h-4 bg-gray-700 rounded"></div>
            </div>
          </div>
        </div>
      </footer>
    );
  }

  const socialLinks = footerData.social_media_links || {};

  return (
    <footer className="bg-gray-900 text-white pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="lg:col-span-1">
            <h3 className="text-2xl font-bold mb-4">{footerData.company_name}</h3>
            <p className="text-gray-300 mb-6">
              {footerData.company_description}
            </p>
            <div className="flex space-x-4">
              {socialLinks.facebook && (
                <a href={socialLinks.facebook} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors">
                  <Facebook className="w-5 h-5" />
                </a>
              )}
              {socialLinks.twitter && (
                <a href={socialLinks.twitter} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors">
                  <Twitter className="w-5 h-5" />
                </a>
              )}
              {socialLinks.linkedin && (
                <a href={socialLinks.linkedin} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors">
                  <Linkedin className="w-5 h-5" />
                </a>
              )}
              {socialLinks.instagram && (
                <a href={socialLinks.instagram} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors">
                  <Instagram className="w-5 h-5" />
                </a>
              )}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-gray-300 hover:text-white transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-gray-300 hover:text-white transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/services" className="text-gray-300 hover:text-white transition-colors">
                  Services
                </Link>
              </li>
              <li>
                <Link href="/jobs" className="text-gray-300 hover:text-white transition-colors">
                  Jobs
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-gray-300 hover:text-white transition-colors">
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Our Services</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/services" className="text-gray-300 hover:text-white transition-colors">
                  Permanent Placement
                </Link>
              </li>
              <li>
                <Link href="/services" className="text-gray-300 hover:text-white transition-colors">
                  Professional Staffing
                </Link>
              </li>
              <li>
                <Link href="/services" className="text-gray-300 hover:text-white transition-colors">
                  Payroll Outsourcing
                </Link>
              </li>
              <li>
                <Link href="/services" className="text-gray-300 hover:text-white transition-colors">
                  Train and Deploy Module
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Contact Us</h4>
            <ul className="space-y-3">
              <li className="flex items-start space-x-3">
                <Phone className="w-5 h-5 text-blue-400 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-gray-300">{footerData.contact_phone}</p>
                </div>
              </li>
              <li className="flex items-start space-x-3">
                <Mail className="w-5 h-5 text-blue-400 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-gray-300">{footerData.contact_email}</p>
                </div>
              </li>
              <li className="flex items-start space-x-3">
                <MapPin className="w-5 h-5 text-blue-400 mt-0.5 flex-shrink-0" />
                <p className="text-gray-300">{footerData.company_address}</p>
              </li>
            </ul>
          </div>
        </div>

        {/* Get in Touch Section */}
        {footerData.get_in_touch_content && (
          <div className="border-t border-gray-800 mt-8 pt-8">
            <div className="text-center">
              <h4 className="text-lg font-semibold mb-2">Get in Touch</h4>
              <p className="text-gray-300 max-w-2xl mx-auto">
                {footerData.get_in_touch_content}
              </p>
            </div>
          </div>
        )}

        {/* Bottom Section */}
        <div className="border-t border-gray-800 mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm mb-4 md:mb-0">
              {footerData.copyright_text?.replace(currentYear.toString(), currentYear.toString())}
            </p>
            <div className="flex flex-wrap justify-center gap-4 text-sm">
              <Link href="/privacy-policy" className="text-gray-400 hover:text-white transition-colors">
                Privacy Policy
              </Link>
              <Link href="/terms" className="text-gray-400 hover:text-white transition-colors">
                Terms of Service
              </Link>
              <Link href="/cookie-policy" className="text-gray-400 hover:text-white transition-colors">
                Cookie Policy
              </Link>
              <Link href="/sitemap" className="text-gray-400 hover:text-white transition-colors">
                Sitemap
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}