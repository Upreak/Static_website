"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Cookie, Settings, Shield, BarChart2, Eye, Database, X, Check, Info } from "lucide-react";
import Link from "next/link";

export default function CookiePolicyPageClient() {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  const cookieSections = [
    { id: "introduction", title: "Introduction" },
    { id: "what-are-cookies", title: "What Are Cookies" },
    { id: "types-of-cookies", title: "Types of Cookies We Use" },
    { id: "how-we-use-cookies", title: "How We Use Cookies" },
    { id: "cookie-management", title: "Managing Cookies" },
    { id: "cookie-consent", title: "Cookie Consent" },
    { id: "third-party-cookies", title: "Third-Party Cookies" },
    { id: "data-security", title: "Data Security" },
    { id: "changes", title: "Changes to This Policy" },
    { id: "contact", title: "Contact Us" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Navigation */}
      <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        isScrolled ? "bg-white shadow-lg" : "bg-transparent"
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <Link href="/" className="flex items-center space-x-2">
                <ArrowLeft className="w-5 h-5 text-gray-600" />
                <span className="text-gray-600 hover:text-gray-900">Back to Home</span>
              </Link>
              <div className="h-6 w-px bg-gray-300"></div>
              <img src="/Text logo.png" alt="Upreak Logo" className="h-8 w-auto" />
            </div>
            <div className="flex items-center space-x-4">
              <Link href="/">
                <Button variant="outline">Home</Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-24 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <Badge variant="secondary" className="mb-4 text-sm">
            COOKIE POLICY
          </Badge>
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            Cookie
            <span className="text-blue-600 block">Policy</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Learn about how we use cookies to enhance your browsing experience and analyze website traffic.
          </p>
          <div className="flex justify-center">
            <div className="bg-blue-100 p-4 rounded-full">
              <Cookie className="w-12 h-12 text-blue-600" />
            </div>
          </div>
        </div>
      </section>

      {/* Table of Contents */}
      <section className="py-8 bg-white sticky top-16 z-40 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap justify-center gap-2">
            {cookieSections.map((section) => (
              <button
                key={section.id}
                onClick={() => scrollToSection(section.id)}
                className="px-3 py-1 text-sm bg-gray-100 hover:bg-gray-200 rounded-full transition-colors"
              >
                {section.title}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Cookie Policy Content */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          {/* Introduction */}
          <div id="introduction" className="scroll-mt-20">
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl flex items-center">
                  <Cookie className="w-6 h-6 mr-2 text-blue-600" />
                  Introduction
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-gray-700 leading-relaxed">
                  Welcome to Upreak's Cookie Policy. This policy explains what cookies are, how we use them, 
                  and how you can manage your cookie preferences when visiting our website.
                </p>
                <p className="text-gray-700 leading-relaxed">
                  By using our website, you consent to the use of cookies in accordance with this policy. 
                  We use cookies to enhance your browsing experience, analyze website traffic, and provide 
                  personalized services.
                </p>
                <div className="bg-blue-50 p-4 rounded-lg">
                  <p className="text-sm text-blue-800">
                    <strong>Last Updated:</strong> September 2024
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* What Are Cookies */}
          <div id="what-are-cookies" className="scroll-mt-20">
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl flex items-center">
                  <Info className="w-6 h-6 mr-2 text-blue-600" />
                  What Are Cookies
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-gray-700 leading-relaxed">
                  Cookies are small text files that are placed on your device when you visit a website. 
                  They are widely used to make websites work more efficiently, and to provide information 
                  to the website owners.
                </p>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <h5 className="font-semibold">How Cookies Work</h5>
                    <ul className="space-y-1 text-sm text-gray-700">
                      <li>• Small data files stored in your browser</li>
                      <li>• Unique identifier for your browser session</li>
                      <li>• Sent back to the server on subsequent visits</li>
                      <li>• Help websites remember your preferences</li>
                    </ul>
                  </div>
                  <div className="space-y-2">
                    <h5 className="font-semibold">Cookie Duration</h5>
                    <ul className="space-y-1 text-sm text-gray-700">
                      <li>• <strong>Session cookies:</strong> Deleted when browser closes</li>
                      <li>• <strong>Persistent cookies:</strong> Remain until expiration</li>
                      <li>• <strong>Third-party cookies:</strong> Set by external domains</li>
                      <li>• <strong>Secure cookies:</strong> Only sent over HTTPS</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Types of Cookies We Use */}
          <div id="types-of-cookies" className="scroll-mt-20">
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl flex items-center">
                  <Settings className="w-6 h-6 mr-2 text-blue-600" />
                  Types of Cookies We Use
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h4 className="font-semibold text-lg mb-3">Essential Cookies</h4>
                  <div className="bg-green-50 p-4 rounded-lg">
                    <p className="text-gray-700 mb-2">
                      These cookies are necessary for the website to function properly and cannot be switched off.
                    </p>
                    <ul className="space-y-1 text-sm text-gray-700">
                      <li className="flex items-start">
                        <div className="w-2 h-2 bg-green-600 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                        <span><strong>Session Management:</strong> Keep you logged in during your visit</span>
                      </li>
                      <li className="flex items-start">
                        <div className="w-2 h-2 bg-green-600 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                        <span><strong>Security:</strong> Protect against security threats</span>
                      </li>
                      <li className="flex items-start">
                        <div className="w-2 h-2 bg-green-600 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                        <span><strong>Preferences:</strong> Remember your language and region settings</span>
                      </li>
                    </ul>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold text-lg mb-3">Analytics Cookies</h4>
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <p className="text-gray-700 mb-2">
                      These cookies help us understand how visitors interact with our website by collecting 
                      and reporting information anonymously.
                    </p>
                    <ul className="space-y-1 text-sm text-gray-700">
                      <li className="flex items-start">
                        <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                        <span><strong>Google Analytics:</strong> Track website usage and performance</span>
                      </li>
                      <li className="flex items-start">
                        <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                        <span><strong>Heatmaps:</strong> Understand user behavior and interactions</span>
                      </li>
                      <li className="flex items-start">
                        <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                        <span><strong>Bounce Rate:</strong> Measure page engagement and effectiveness</span>
                      </li>
                    </ul>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold text-lg mb-3">Marketing Cookies</h4>
                  <div className="bg-purple-50 p-4 rounded-lg">
                    <p className="text-gray-700 mb-2">
                      These cookies are used to track visitors across websites to provide relevant advertisements 
                      and marketing campaigns.
                    </p>
                    <ul className="space-y-1 text-sm text-gray-700">
                      <li className="flex items-start">
                        <div className="w-2 h-2 bg-purple-600 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                        <span><strong>Facebook Pixel:</strong> Track conversions and optimize ads</span>
                      </li>
                      <li className="flex items-start">
                        <div className="w-2 h-2 bg-purple-600 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                        <span><strong>LinkedIn Insight:</strong> Measure campaign effectiveness</span>
                      </li>
                      <li className="flex items-start">
                        <div className="w-2 h-2 bg-purple-600 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                        <span><strong>Remarketing:</strong> Show relevant ads to past visitors</span>
                      </li>
                    </ul>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold text-lg mb-3">Functional Cookies</h4>
                  <div className="bg-orange-50 p-4 rounded-lg">
                    <p className="text-gray-700 mb-2">
                      These cookies allow the website to provide enhanced functionality and personalization. 
                      They may be set by us or by third-party providers.
                    </p>
                    <ul className="space-y-1 text-sm text-gray-700">
                      <li className="flex items-start">
                        <div className="w-2 h-2 bg-orange-600 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                        <span><strong>Chat Widget:</strong> Remember chat conversation history</span>
                      </li>
                      <li className="flex items-start">
                        <div className="w-2 h-2 bg-orange-600 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                        <span><strong>Language Settings:</strong> Remember your preferred language</span>
                      </li>
                      <li className="flex items-start">
                        <div className="w-2 h-2 bg-orange-600 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                        <span><strong>Theme Preferences:</strong> Remember your display preferences</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* How We Use Cookies */}
          <div id="how-we-use-cookies" className="scroll-mt-20">
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl flex items-center">
                  <BarChart2 className="w-6 h-6 mr-2 text-blue-600" />
                  How We Use Cookies
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-gray-700 leading-relaxed">
                  We use cookies for various purposes to enhance your experience on our website:
                </p>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-3">
                    <div className="flex items-start space-x-3">
                      <div className="w-2 h-2 bg-green-600 rounded-full mt-2 flex-shrink-0"></div>
                      <span className="text-gray-700">Website functionality and navigation</span>
                    </div>
                    <div className="flex items-start space-x-3">
                      <div className="w-2 h-2 bg-green-600 rounded-full mt-2 flex-shrink-0"></div>
                      <span className="text-gray-700">Personalizing content and recommendations</span>
                    </div>
                    <div className="flex items-start space-x-3">
                      <div className="w-2 h-2 bg-green-600 rounded-full mt-2 flex-shrink-0"></div>
                      <span className="text-gray-700">Analyzing website traffic and usage patterns</span>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-start space-x-3">
                      <div className="w-2 h-2 bg-green-600 rounded-full mt-2 flex-shrink-0"></div>
                      <span className="text-gray-700">Improving website performance and user experience</span>
                    </div>
                    <div className="flex items-start space-x-3">
                      <div className="w-2 h-2 bg-green-600 rounded-full mt-2 flex-shrink-0"></div>
                      <span className="text-gray-700">Targeting advertising and marketing campaigns</span>
                    </div>
                    <div className="flex items-start space-x-3">
                      <div className="w-2 h-2 bg-green-600 rounded-full mt-2 flex-shrink-0"></div>
                      <span className="text-gray-700">Providing customer support and chat services</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Managing Cookies */}
          <div id="cookie-management" className="scroll-mt-20">
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl flex items-center">
                  <Settings className="w-6 h-6 mr-2 text-blue-600" />
                  Managing Cookies
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-gray-700 leading-relaxed">
                  You have control over cookies through your browser settings. You can choose to accept or 
                  reject cookies, or be notified when a cookie is being sent.
                </p>
                <div className="space-y-4">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h5 className="font-semibold mb-2">Browser Settings</h5>
                    <p className="text-gray-700 text-sm mb-3">
                      Most browsers allow you to control cookies through their preferences or settings menu:
                    </p>
                    <div className="grid md:grid-cols-3 gap-4 text-sm">
                      <div>
                        <h6 className="font-medium mb-1">Chrome</h6>
                        <p className="text-gray-600">Settings → Privacy and Security → Cookies</p>
                      </div>
                      <div>
                        <h6 className="font-medium mb-1">Firefox</h6>
                        <p className="text-gray-600">Preferences → Privacy & Security → Cookies</p>
                      </div>
                      <div>
                        <h6 className="font-medium mb-1">Safari</h6>
                        <p className="text-gray-600">Preferences → Privacy → Cookies and website data</p>
                      </div>
                    </div>
                  </div>
                  <div className="bg-yellow-50 p-4 rounded-lg">
                    <h5 className="font-semibold mb-2">Impact of Cookie Restrictions</h5>
                    <p className="text-gray-700 text-sm">
                      Disabling cookies may affect your experience on our website. Some features may not 
                      work properly, and you may need to re-enter information on each visit.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Cookie Consent */}
          <div id="cookie-consent" className="scroll-mt-20">
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl flex items-center">
                  <Check className="w-6 h-6 mr-2 text-blue-600" />
                  Cookie Consent
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-gray-700 leading-relaxed">
                  When you first visit our website, we will display a cookie consent banner that allows you 
                  to choose which types of cookies you want to accept.
                </p>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <h5 className="font-semibold">Consent Options</h5>
                    <ul className="space-y-1 text-sm text-gray-700">
                      <li className="flex items-center space-x-2">
                        <Check className="w-4 h-4 text-green-600" />
                        <span>Accept all cookies</span>
                      </li>
                      <li className="flex items-center space-x-2">
                        <X className="w-4 h-4 text-red-600" />
                        <span>Reject all cookies</span>
                      </li>
                      <li className="flex items-center space-x-2">
                        <Settings className="w-4 h-4 text-blue-600" />
                        <span>Customize preferences</span>
                      </li>
                    </ul>
                  </div>
                  <div className="space-y-2">
                    <h5 className="font-semibold">Consent Withdrawal</h5>
                    <p className="text-sm text-gray-700">
                      You can change your cookie preferences at any time by clicking on the "Cookie Settings" 
                      link in our footer or through your browser settings.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Third-Party Cookies */}
          <div id="third-party-cookies" className="scroll-mt-20">
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl flex items-center">
                  <Eye className="w-6 h-6 mr-2 text-blue-600" />
                  Third-Party Cookies
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-gray-700 leading-relaxed">
                  We use various third-party services that may set their own cookies on your device when 
                  you visit our website. These cookies are used to provide services such as analytics, 
                  advertising, and social media features.
                </p>
                <div className="space-y-3">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h5 className="font-semibold mb-2">Third-Party Services</h5>
                    <ul className="space-y-1 text-sm text-gray-700">
                      <li>• Google Analytics (website analytics)</li>
                      <li>• Facebook Pixel (advertising and analytics)</li>
                      <li>• LinkedIn Insight Tag (professional networking)</li>
                      <li>• Hotjar (user behavior analysis)</li>
                    </ul>
                  </div>
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <h5 className="font-semibold mb-2">Third-Party Policies</h5>
                    <p className="text-gray-700 text-sm">
                      Each third-party service has its own cookie policy. We recommend reviewing their 
                      respective policies to understand how they use cookies.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Data Security */}
          <div id="data-security" className="scroll-mt-20">
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl flex items-center">
                  <Shield className="w-6 h-6 mr-2 text-blue-600" />
                  Data Security
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-gray-700 leading-relaxed">
                  We take the security of your data seriously. All cookie data is handled in accordance 
                  with our Privacy Policy and applicable data protection laws.
                </p>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <h5 className="font-semibold">Security Measures</h5>
                    <ul className="space-y-1 text-sm text-gray-700">
                      <li>• Secure cookie transmission over HTTPS</li>
                      <li>• Regular security audits and assessments</li>
                      <li>• Access controls and data encryption</li>
                      <li>• Compliance with data protection regulations</li>
                    </ul>
                  </div>
                  <div className="space-y-2">
                    <h5 className="font-semibold">Data Retention</h5>
                    <p className="text-sm text-gray-700">
                      We retain cookie data only as long as necessary for the purposes for which it was 
                      collected, unless a longer retention period is required by law.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Changes to This Policy */}
          <div id="changes" className="scroll-mt-20">
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl flex items-center">
                  <Database className="w-6 h-6 mr-2 text-blue-600" />
                  Changes to This Policy
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-gray-700 leading-relaxed">
                  We may update this Cookie Policy from time to time to reflect changes in our practices 
                  or for operational, legal, or regulatory reasons.
                </p>
                <div className="bg-blue-50 p-4 rounded-lg">
                  <p className="text-sm text-blue-800">
                    <strong>How We Notify You:</strong> We will post the updated policy on our website and 
                    update the "Last Updated" date at the top of this policy. Significant changes may also 
                    be communicated through email or other means.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Contact Us */}
          <div id="contact" className="scroll-mt-20">
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl flex items-center">
                  <Cookie className="w-6 h-6 mr-2 text-blue-600" />
                  Contact Us
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-gray-700 leading-relaxed">
                  If you have any questions about this Cookie Policy or how we use cookies, please contact us:
                </p>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <h5 className="font-semibold">Contact Information</h5>
                    <div className="space-y-1 text-sm">
                      <div className="flex items-center space-x-2">
                        <Cookie className="w-4 h-4 text-blue-600" />
                        <span>business@upreak.com</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Cookie className="w-4 h-4 text-blue-600" />
                        <span>+91 79759 30773</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Cookie className="w-4 h-4 text-blue-600" />
                        <span>Bangalore, Karnataka</span>
                      </div>
                    </div>
                  </div>
                  <div>
                    <h5 className="font-semibold mb-2">Data Protection Officer</h5>
                    <p className="text-sm text-gray-700">
                      For privacy-related inquiries regarding cookies, please contact our Data Protection 
                      Officer at privacy@upreak.com
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">Questions About Cookies?</h2>
          <p className="text-xl mb-8 opacity-90">
            We're here to help you understand how we use cookies on our website.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/contact">
              <Button size="lg" variant="secondary" className="text-lg px-8 py-3">
                Contact Our Team
              </Button>
            </Link>
            <Link href="/">
              <Button size="lg" variant="outline" className="text-lg px-8 py-3 text-white border-white hover:bg-white hover:text-blue-600">
                Back to Home
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}