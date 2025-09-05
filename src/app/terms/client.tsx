"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, FileText, Scale, Shield, DollarSign, Users, Clock, Mail, Phone, MapPin } from "lucide-react";
import Link from "next/link";

export default function TermsPageClient() {
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

  const termsSections = [
    { id: "introduction", title: "Introduction" },
    { id: "acceptance", title: "Acceptance of Terms" },
    { id: "services", title: "Services Description" },
    { id: "user-obligations", title: "User Obligations" },
    { id: "fees", title: "Fees and Payments" },
    { id: "intellectual-property", title: "Intellectual Property" },
    { id: "disclaimer", title: "Disclaimer of Warranties" },
    { id: "limitations", title: "Limitation of Liability" },
    { id: "indemnification", title: "Indemnification" },
    { id: "termination", title: "Termination" },
    { id: "privacy", title: "Privacy Policy" },
    { id: "changes", title: "Changes to Terms" },
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
            TERMS AND CONDITIONS
          </Badge>
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            Terms &
            <span className="text-blue-600 block">Conditions</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Welcome to Upreak. These terms and conditions outline the rules and guidelines for using our services.
          </p>
          <div className="flex justify-center">
            <div className="bg-blue-100 p-4 rounded-full">
              <FileText className="w-12 h-12 text-blue-600" />
            </div>
          </div>
        </div>
      </section>

      {/* Table of Contents */}
      <section className="py-8 bg-white sticky top-16 z-40 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap justify-center gap-2">
            {termsSections.map((section) => (
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

      {/* Terms Content */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          {/* Introduction */}
          <div id="introduction" className="scroll-mt-20">
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl flex items-center">
                  <FileText className="w-6 h-6 mr-2 text-blue-600" />
                  Introduction
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-gray-700 leading-relaxed">
                  Welcome to Upreak. These Terms and Conditions govern your use of our website, services, and 
                  related offerings. By accessing or using our services, you agree to be bound by these terms.
                </p>
                <p className="text-gray-700 leading-relaxed">
                  Upreak provides talent-sourcing solutions and recruitment services. These terms outline the 
                  legal framework under which our services are provided and used.
                </p>
                <div className="bg-blue-50 p-4 rounded-lg">
                  <p className="text-sm text-blue-800">
                    <strong>Last Updated:</strong> September 2024
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Acceptance of Terms */}
          <div id="acceptance" className="scroll-mt-20">
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl flex items-center">
                  <Scale className="w-6 h-6 mr-2 text-blue-600" />
                  Acceptance of Terms
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-gray-700 leading-relaxed">
                  By using our services, you acknowledge that you have read, understood, and agree to be bound 
                  by these Terms and Conditions. If you do not agree to these terms, you should not use our services.
                </p>
                <div className="space-y-3">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h5 className="font-semibold mb-2">Electronic Agreement</h5>
                    <p className="text-gray-700 text-sm">
                      These terms constitute a legally binding agreement between you and Upreak. By accessing 
                      our website or using our services, you accept these terms electronically.
                    </p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h5 className="font-semibold mb-2">Amendments</h5>
                    <p className="text-gray-700 text-sm">
                      Upreak reserves the right to modify these terms at any time. Continued use of our services 
                      after any modifications constitutes acceptance of the updated terms.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Services Description */}
          <div id="services" className="scroll-mt-20">
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl flex items-center">
                  <Users className="w-6 h-6 mr-2 text-blue-600" />
                  Services Description
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-gray-700 leading-relaxed">
                  Upreak provides comprehensive talent-sourcing solutions including:
                </p>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-3">
                    <div className="flex items-start space-x-3">
                      <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
                      <span className="text-gray-700">Permanent Placement Services</span>
                    </div>
                    <div className="flex items-start space-x-3">
                      <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
                      <span className="text-gray-700">Professional Staffing Solutions</span>
                    </div>
                    <div className="flex items-start space-x-3">
                      <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
                      <span className="text-gray-700">Payroll Outsourcing</span>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-start space-x-3">
                      <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
                      <span className="text-gray-700">Train and Deploy Module</span>
                    </div>
                    <div className="flex items-start space-x-3">
                      <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
                      <span className="text-gray-700">AI-Powered Recruitment</span>
                    </div>
                    <div className="flex items-start space-x-3">
                      <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
                      <span className="text-gray-700">HR Consulting Services</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* User Obligations */}
          <div id="user-obligations" className="scroll-mt-20">
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl flex items-center">
                  <Shield className="w-6 h-6 mr-2 text-blue-600" />
                  User Obligations
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-gray-700 leading-relaxed">
                  Users of our services must comply with the following obligations:
                </p>
                <div className="space-y-3">
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-green-600 rounded-full mt-2 flex-shrink-0"></div>
                    <div>
                      <h5 className="font-semibold">Accuracy of Information</h5>
                      <p className="text-gray-700 text-sm">
                        Provide accurate and complete information when using our services.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-green-600 rounded-full mt-2 flex-shrink-0"></div>
                    <div>
                      <h5 className="font-semibold">Compliance with Laws</h5>
                      <p className="text-gray-700 text-sm">
                        Comply with all applicable laws and regulations when using our services.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-green-600 rounded-full mt-2 flex-shrink-0"></div>
                    <div>
                      <h5 className="font-semibold">Prohibited Activities</h5>
                      <p className="text-gray-700 text-sm">
                        Engage in any illegal or harmful activities, including but not limited to fraud, discrimination, or harassment.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-green-600 rounded-full mt-2 flex-shrink-0"></div>
                    <div>
                      <h5 className="font-semibold">Confidentiality</h5>
                      <p className="text-gray-700 text-sm">
                        Maintain confidentiality of any proprietary information shared by Upreak.
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Fees and Payments */}
          <div id="fees" className="scroll-mt-20">
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl flex items-center">
                  <DollarSign className="w-6 h-6 mr-2 text-blue-600" />
                  Fees and Payments
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-gray-700 leading-relaxed">
                  Our services are subject to fees as outlined in our service agreements. Payment terms include:
                </p>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <h5 className="font-semibold">Payment Terms</h5>
                    <ul className="space-y-1 text-sm text-gray-700">
                      <li>• Invoices due within 30 days of receipt</li>
                      <li>• Late payments subject to interest charges</li>
                      <li>• Payment methods: Bank transfer, credit card</li>
                      <li>• All prices are exclusive of applicable taxes</li>
                    </ul>
                  </div>
                  <div className="space-y-2">
                    <h5 className="font-semibold">Refund Policy</h5>
                    <ul className="space-y-1 text-sm text-gray-700">
                      <li>• Service fees are non-refundable once rendered</li>
                      <li>• Cancellations require 30-day notice</li>
                      <li>• Refunds evaluated on case-by-case basis</li>
                      <li>• Processing fees may apply to refunds</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Intellectual Property */}
          <div id="intellectual-property" className="scroll-mt-20">
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl flex items-center">
                  <FileText className="w-6 h-6 mr-2 text-blue-600" />
                  Intellectual Property
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-gray-700 leading-relaxed">
                  All content, materials, and intellectual property on our website and services are owned by Upreak 
                  or its licensors and are protected by copyright, trademark, and other intellectual property laws.
                </p>
                <div className="space-y-3">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h5 className="font-semibold mb-2">User Content</h5>
                    <p className="text-gray-700 text-sm">
                      Users retain ownership of their content but grant Upreak a license to use, display, and distribute 
                      such content necessary to provide our services.
                    </p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h5 className="font-semibold mb-2">Prohibited Use</h5>
                    <p className="text-gray-700 text-sm">
                      Users may not copy, reproduce, distribute, or create derivative works of our proprietary content 
                      without prior written permission.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Disclaimer of Warranties */}
          <div id="disclaimer" className="scroll-mt-20">
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl flex items-center">
                  <Shield className="w-6 h-6 mr-2 text-blue-600" />
                  Disclaimer of Warranties
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-gray-700 leading-relaxed">
                  Our services are provided "as is" without any warranties, express or implied, including but not 
                  limited to merchantability, fitness for a particular purpose, or non-infringement.
                </p>
                <div className="bg-yellow-50 p-4 rounded-lg">
                  <p className="text-sm text-yellow-800">
                    <strong>Important:</strong> Upreak does not guarantee specific results from our services, and 
                    users acknowledge that recruitment outcomes may vary based on various factors beyond our control.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Limitation of Liability */}
          <div id="limitations" className="scroll-mt-20">
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl flex items-center">
                  <Scale className="w-6 h-6 mr-2 text-blue-600" />
                  Limitation of Liability
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-gray-700 leading-relaxed">
                  In no event shall Upreak be liable for any indirect, incidental, special, consequential, or 
                  punitive damages arising from or related to our services.
                </p>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <h5 className="font-semibold">Maximum Liability</h5>
                    <p className="text-sm text-gray-700">
                      Our total liability for any claim shall not exceed the fees paid by you for the services 
                      giving rise to the claim in the preceding 12 months.
                    </p>
                  </div>
                  <div className="space-y-2">
                    <h5 className="font-semibold">Exclusions</h5>
                    <p className="text-sm text-gray-700">
                      We exclude liability for personal injury, death, or damage to property, and for any 
                      loss of profits, business, or data.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Indemnification */}
          <div id="indemnification" className="scroll-mt-20">
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl flex items-center">
                  <Shield className="w-6 h-6 mr-2 text-blue-600" />
                  Indemnification
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-gray-700 leading-relaxed">
                  Users agree to indemnify and hold harmless Upreak from any claims, damages, liabilities, 
                  and expenses arising from their use of our services or violation of these terms.
                </p>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h5 className="font-semibold mb-2">Indemnification Scope</h5>
                  <p className="text-gray-700 text-sm">
                    This includes claims related to user content, breach of these terms, or any third-party 
                    claims arising from your use of our services.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Termination */}
          <div id="termination" className="scroll-mt-20">
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl flex items-center">
                  <Clock className="w-6 h-6 mr-2 text-blue-600" />
                  Termination
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-gray-700 leading-relaxed">
                  Upreak reserves the right to terminate or suspend your access to our services at any time, 
                  with or without notice, for any reason.
                </p>
                <div className="space-y-3">
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-red-600 rounded-full mt-2 flex-shrink-0"></div>
                    <div>
                      <h5 className="font-semibold">Termination for Cause</h5>
                      <p className="text-gray-700 text-sm">
                        Immediate termination for material breach, illegal activities, or violation of these terms.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-orange-600 rounded-full mt-2 flex-shrink-0"></div>
                    <div>
                      <h5 className="font-semibold">Termination without Cause</h5>
                      <p className="text-gray-700 text-sm">
                        30-day notice period for termination without cause, with prorated refunds for unused services.
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Privacy Policy */}
          <div id="privacy" className="scroll-mt-20">
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl flex items-center">
                  <Shield className="w-6 h-6 mr-2 text-blue-600" />
                  Privacy Policy
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-gray-700 leading-relaxed">
                  Your privacy is important to us. Our Privacy Policy explains how we collect, use, and protect 
                  your personal information. By using our services, you agree to our Privacy Policy.
                </p>
                <Link href="/privacy-policy">
                  <Button variant="outline" className="mt-2">
                    View Privacy Policy
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>

          {/* Changes to Terms */}
          <div id="changes" className="scroll-mt-20">
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl flex items-center">
                  <FileText className="w-6 h-6 mr-2 text-blue-600" />
                  Changes to Terms
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-gray-700 leading-relaxed">
                  Upreak reserves the right to modify these terms at any time. We will notify users of material 
                  changes through email or website notices. Continued use of our services after any modifications 
                  constitutes acceptance of the updated terms.
                </p>
                <div className="bg-blue-50 p-4 rounded-lg">
                  <p className="text-sm text-blue-800">
                    <strong>Effective Date:</strong> Changes will be effective immediately upon posting on our website.
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
                  <Phone className="w-6 h-6 mr-2 text-blue-600" />
                  Contact Us
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-gray-700 leading-relaxed">
                  If you have any questions about these Terms and Conditions, please contact us:
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
                    <h5 className="font-semibold mb-2">Legal Department</h5>
                    <p className="text-sm text-gray-700">
                      For legal inquiries regarding these terms, please contact our legal team at legal@upreak.com
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
          <h2 className="text-3xl font-bold mb-4">Questions About Our Terms?</h2>
          <p className="text-xl mb-8 opacity-90">
            We're here to help you understand our terms and conditions.
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