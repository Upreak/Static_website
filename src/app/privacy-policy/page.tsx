"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Shield, Lock, Eye, Database, Mail, Phone, MapPin } from "lucide-react";
import Link from "next/link";

export default function PrivacyPolicyPage() {
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

  const policySections = [
    { id: "introduction", title: "Introduction" },
    { id: "information-collection", title: "Information We Collect" },
    { id: "information-use", title: "How We Use Your Information" },
    { id: "information-sharing", title: "Information Sharing" },
    { id: "data-security", title: "Data Security" },
    { id: "your-rights", title: "Your Rights" },
    { id: "cookies", title: "Cookies" },
    { id: "third-party", title: "Third-Party Links" },
    { id: "children", title: "Children's Privacy" },
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
            PRIVACY POLICY
          </Badge>
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            Privacy
            <span className="text-blue-600 block">Policy</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            At Upreak, we are committed to protecting your privacy and ensuring the security of your personal information.
          </p>
          <div className="flex justify-center">
            <div className="bg-blue-100 p-4 rounded-full">
              <Shield className="w-12 h-12 text-blue-600" />
            </div>
          </div>
        </div>
      </section>

      {/* Table of Contents */}
      <section className="py-8 bg-white sticky top-16 z-40 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap justify-center gap-2">
            {policySections.map((section) => (
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

      {/* Policy Content */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          {/* Introduction */}
          <div id="introduction" className="scroll-mt-20">
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl flex items-center">
                  <Shield className="w-6 h-6 mr-2 text-blue-600" />
                  Introduction
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-gray-700 leading-relaxed">
                  Welcome to Upreak. This Privacy Policy outlines how we collect, use, disclose, and safeguard 
                  your personal information when you visit our website, use our services, or interact with us in 
                  any other way.
                </p>
                <p className="text-gray-700 leading-relaxed">
                  By using our services, you agree to the collection and use of information in accordance with 
                  this policy. We are committed to protecting your privacy and ensuring that your personal 
                  information is handled in a safe and responsible manner.
                </p>
                <div className="bg-blue-50 p-4 rounded-lg">
                  <p className="text-sm text-blue-800">
                    <strong>Last Updated:</strong> November 2024
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Information We Collect */}
          <div id="information-collection" className="scroll-mt-20">
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl flex items-center">
                  <Database className="w-6 h-6 mr-2 text-blue-600" />
                  Information We Collect
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h4 className="font-semibold text-lg mb-3">Personal Information</h4>
                  <ul className="space-y-2 text-gray-700">
                    <li className="flex items-start">
                      <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                      <span>Full name and contact details (email, phone number, address)</span>
                    </li>
                    <li className="flex items-start">
                      <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                      <span>Professional information (resume, work history, skills)</span>
                    </li>
                    <li className="flex items-start">
                      <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                      <span>Company information (for business clients)</span>
                    </li>
                    <li className="flex items-start">
                      <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                      <span>Communication preferences and correspondence</span>
                    </li>
                  </ul>
                </div>

                <div>
                  <h4 className="font-semibold text-lg mb-3">Automatically Collected Information</h4>
                  <ul className="space-y-2 text-gray-700">
                    <li className="flex items-start">
                      <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                      <span>IP address and browser information</span>
                    </li>
                    <li className="flex items-start">
                      <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                      <span>Device information and usage data</span>
                    </li>
                    <li className="flex items-start">
                      <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                      <span>Cookies and tracking technologies</span>
                    </li>
                    <li className="flex items-start">
                      <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                      <span>Pages visited and time spent on our website</span>
                    </li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* How We Use Your Information */}
          <div id="information-use" className="scroll-mt-20">
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl flex items-center">
                  <Eye className="w-6 h-6 mr-2 text-blue-600" />
                  How We Use Your Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-gray-700 leading-relaxed">
                  We use the information we collect for various purposes, including:
                </p>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-3">
                    <div className="flex items-start space-x-3">
                      <div className="w-2 h-2 bg-green-600 rounded-full mt-2 flex-shrink-0"></div>
                      <span className="text-gray-700">To provide and maintain our services</span>
                    </div>
                    <div className="flex items-start space-x-3">
                      <div className="w-2 h-2 bg-green-600 rounded-full mt-2 flex-shrink-0"></div>
                      <span className="text-gray-700">To process job applications and placements</span>
                    </div>
                    <div className="flex items-start space-x-3">
                      <div className="w-2 h-2 bg-green-600 rounded-full mt-2 flex-shrink-0"></div>
                      <span className="text-gray-700">To communicate with you about our services</span>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-start space-x-3">
                      <div className="w-2 h-2 bg-green-600 rounded-full mt-2 flex-shrink-0"></div>
                      <span className="text-gray-700">To improve our website and services</span>
                    </div>
                    <div className="flex items-start space-x-3">
                      <div className="w-2 h-2 bg-green-600 rounded-full mt-2 flex-shrink-0"></div>
                      <span className="text-gray-700">To send marketing and promotional materials</span>
                    </div>
                    <div className="flex items-start space-x-3">
                      <div className="w-2 h-2 bg-green-600 rounded-full mt-2 flex-shrink-0"></div>
                      <span className="text-gray-700">To comply with legal obligations</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Information Sharing */}
          <div id="information-sharing" className="scroll-mt-20">
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl flex items-center">
                  <Mail className="w-6 h-6 mr-2 text-blue-600" />
                  Information Sharing
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-gray-700 leading-relaxed">
                  We do not sell, trade, or otherwise transfer your personal information to third parties 
                  without your consent, except in the following circumstances:
                </p>
                <div className="space-y-3">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h5 className="font-semibold mb-2">With Client Companies</h5>
                    <p className="text-gray-700 text-sm">
                      We share candidate information with potential employers when you apply for positions 
                      through our platform.
                    </p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h5 className="font-semibold mb-2">Service Providers</h5>
                    <p className="text-gray-700 text-sm">
                      We may share information with third-party service providers who assist us in 
                      operating our business (e.g., payment processors, email services).
                    </p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h5 className="font-semibold mb-2">Legal Requirements</h5>
                    <p className="text-gray-700 text-sm">
                      We may disclose information when required by law or to protect our rights, 
                      safety, or property.
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
                  <Lock className="w-6 h-6 mr-2 text-blue-600" />
                  Data Security
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-gray-700 leading-relaxed">
                  We implement appropriate technical and organizational measures to protect your personal 
                  information against unauthorized access, alteration, disclosure, or destruction.
                </p>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <h5 className="font-semibold">Security Measures</h5>
                    <ul className="space-y-1 text-sm text-gray-700">
                      <li>• SSL/TLS encryption for data transmission</li>
                      <li>• Secure server infrastructure</li>
                      <li>• Regular security assessments</li>
                      <li>• Employee training on data protection</li>
                    </ul>
                  </div>
                  <div className="space-y-2">
                    <h5 className="font-semibold">Access Controls</h5>
                    <ul className="space-y-1 text-sm text-gray-700">
                      <li>• Role-based access permissions</li>
                      <li>• Multi-factor authentication</li>
                      <li>• Regular access reviews</li>
                      <li>• Audit trails and logging</li>
                    </ul>
                  </div>
                </div>
                <div className="bg-yellow-50 p-4 rounded-lg">
                  <p className="text-sm text-yellow-800">
                    <strong>Important:</strong> While we take reasonable measures to protect your information, 
                    no method of transmission over the internet is 100% secure. We cannot guarantee absolute security.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Your Rights */}
          <div id="your-rights" className="scroll-mt-20">
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl flex items-center">
                  <Shield className="w-6 h-6 mr-2 text-blue-600" />
                  Your Rights
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-gray-700 leading-relaxed">
                  You have certain rights regarding your personal information. These rights include:
                </p>
                <div className="space-y-3">
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
                    <div>
                      <h5 className="font-semibold">Access and Portability</h5>
                      <p className="text-gray-700 text-sm">
                        Request a copy of your personal information and obtain it in a portable format.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
                    <div>
                      <h5 className="font-semibold">Correction and Deletion</h5>
                      <p className="text-gray-700 text-sm">
                        Request correction of inaccurate information or deletion of your personal data.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
                    <div>
                      <h5 className="font-semibold">Opt-out of Marketing</h5>
                      <p className="text-gray-700 text-sm">
                        Unsubscribe from marketing communications at any time.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
                    <div>
                      <h5 className="font-semibold">Complaints</h5>
                      <p className="text-gray-700 text-sm">
                        File a complaint with the appropriate data protection authority.
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Cookies */}
          <div id="cookies" className="scroll-mt-20">
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl flex items-center">
                  <Database className="w-6 h-6 mr-2 text-blue-600" />
                  Cookies
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-gray-700 leading-relaxed">
                  Our website uses cookies and similar tracking technologies to enhance your browsing experience 
                  and analyze website traffic.
                </p>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <h5 className="font-semibold mb-2">Types of Cookies We Use</h5>
                    <ul className="space-y-2 text-sm text-gray-700">
                      <li className="flex items-start">
                        <div className="w-2 h-2 bg-orange-600 rounded-full mt-2 mr-2 flex-shrink-0"></div>
                        <span><strong>Essential Cookies:</strong> Required for basic website functionality</span>
                      </li>
                      <li className="flex items-start">
                        <div className="w-2 h-2 bg-orange-600 rounded-full mt-2 mr-2 flex-shrink-0"></div>
                        <span><strong>Analytics Cookies:</strong> Help us understand how you use our site</span>
                      </li>
                      <li className="flex items-start">
                        <div className="w-2 h-2 bg-orange-600 rounded-full mt-2 mr-2 flex-shrink-0"></div>
                        <span><strong>Marketing Cookies:</strong> Used for targeted advertising</span>
                      </li>
                    </ul>
                  </div>
                  <div>
                    <h5 className="font-semibold mb-2">Managing Cookies</h5>
                    <p className="text-sm text-gray-700">
                      You can manage your cookie preferences through your browser settings. 
                      Disabling certain cookies may affect your experience on our website.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Third-Party Links */}
          <div id="third-party" className="scroll-mt-20">
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl flex items-center">
                  <MapPin className="w-6 h-6 mr-2 text-blue-600" />
                  Third-Party Links
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 leading-relaxed">
                  Our website may contain links to third-party websites. We are not responsible for 
                  the privacy practices of these external sites. We encourage you to review the 
                  privacy policies of any third-party websites you visit.
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Children's Privacy */}
          <div id="children" className="scroll-mt-20">
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl flex items-center">
                  <Shield className="w-6 h-6 mr-2 text-blue-600" />
                  Children's Privacy
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 leading-relaxed">
                  Our services are not intended for individuals under the age of 18. We do not 
                  knowingly collect personal information from children. If you are a parent or 
                  guardian and believe your child has provided us with personal information, 
                  please contact us so we can delete such information.
                </p>
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
              <CardContent>
                <p className="text-gray-700 leading-relaxed">
                  We may update this privacy policy from time to time to reflect changes in our 
                  practices or for operational, legal, or regulatory reasons. The updated policy 
                  will be effective immediately upon posting on our website. We encourage you to 
                  review this policy periodically for any changes.
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Contact Us */}
          <div id="contact" className="scroll-mt-20">
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl flex items-center">
                  <Phone className="w-6 h-6 mr-2 text-blue-600" />
                  Contact Us
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-gray-700 leading-relaxed">
                  If you have any questions or concerns about this Privacy Policy, please contact us:
                </p>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <h5 className="font-semibold">Contact Information</h5>
                    <div className="space-y-1 text-sm">
                      <div className="flex items-center space-x-2">
                        <Mail className="w-4 h-4 text-blue-600" />
                        <span>business@upreak.com</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Phone className="w-4 h-4 text-blue-600" />
                        <span>+91 79759 30773</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <MapPin className="w-4 h-4 text-blue-600" />
                        <span>Bangalore, Karnataka</span>
                      </div>
                    </div>
                  </div>
                  <div>
                    <h5 className="font-semibold mb-2">Data Protection Officer</h5>
                    <p className="text-sm text-gray-700">
                      For privacy-related inquiries, please contact our Data Protection Officer 
                      at privacy@upreak.com
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
          <h2 className="text-3xl font-bold mb-4">Questions About Your Privacy?</h2>
          <p className="text-xl mb-8 opacity-90">
            We're here to help you understand how we protect your information.
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