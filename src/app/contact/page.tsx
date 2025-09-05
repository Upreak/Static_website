"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Phone, Mail, MapPin, Clock, Send, CheckCircle, AlertCircle } from "lucide-react";
import Link from "next/link";

export default function ContactPage() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    company: "",
    subject: "",
    message: "",
    service: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<"idle" | "success" | "error">("idle");
  const [contactInfo, setContactInfo] = useState<any>({
    phones: [],
    emails: [],
    address: "",
    hours: [],
    description: ""
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Fetch contact information
  useEffect(() => {
    const fetchContactInfo = async () => {
      try {
        console.log('[Contact Page] Fetching contact information');
        const response = await fetch("/api/admin/settings");
        const data = await response.json();
        
        if (data.success) {
          const settings = data.settings;
          console.log('[Contact Page] Settings retrieved:', settings);
          
          // Transform settings into contact info format
          const contactInfo = {
            phones: settings.contact_phone?.value ? [settings.contact_phone.value] : [],
            emails: settings.contact_email?.value ? [settings.contact_email.value] : [],
            address: settings.contact_address?.value || settings.footer_address?.value || "",
            hours: settings.contact_hours?.value ?
              (typeof settings.contact_hours.value === 'string' ?
                JSON.parse(settings.contact_hours.value) :
                settings.contact_hours.value) :
              [{ day: "Office Hours", hours: "Contact hours not available" }],
            description: settings.contact_description?.value || ""
          };
          
          console.log('[Contact Page] Contact information transformed:', contactInfo);
          setContactInfo(contactInfo);
        } else {
          console.error('[Contact Page] Failed to fetch contact information:', data.error);
        }
      } catch (error) {
        console.error('[Contact Page] Error fetching contact information:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchContactInfo();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      console.log('[Contact Page] Submitting contact form');
      
      const response = await fetch("/api/admin/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: `${formData.firstName} ${formData.lastName}`,
          email: formData.email,
          phone: formData.phone,
          message: formData.message
        }),
      });

      const data = await response.json();

      if (response.ok) {
        console.log('[Contact Page] Form submitted successfully');
        setSubmitStatus("success");
        setFormData({
          firstName: "",
          lastName: "",
          email: "",
          phone: "",
          company: "",
          subject: "",
          message: "",
          service: ""
        });
      } else {
        console.error('[Contact Page] Failed to submit form:', data.error);
        setSubmitStatus("error");
      }
    } catch (error) {
      console.error('[Contact Page] Error submitting form:', error);
      setSubmitStatus("error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const services = [
    "Permanent Placement",
    "Professional Staffing",
    "Payroll Outsourcing",
    "Train and Deploy Module",
    "General Inquiry"
  ];

  // Format contact information for display
  const contactCards = [
    {
      icon: Phone,
      title: "Phone",
      details: contactInfo.phones || [],
      description: contactInfo.hours[0]?.hours || "Contact hours not available"
    },
    {
      icon: Mail,
      title: "Email",
      details: contactInfo.emails || [],
      description: "We'll respond within 24 hours"
    },
    {
      icon: MapPin,
      title: "Office Locations",
      details: [contactInfo.address || "Location not specified"],
      description: contactInfo.description || "Contact information not available"
    }
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
            CONTACT US
          </Badge>
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            Get in
            <span className="text-blue-600 block">Touch</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Ready to find exceptional talent for your organization? 
            We're here to help you with all your recruitment needs.
          </p>
        </div>
      </section>

      {/* Contact Information */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-8">
            {isLoading ? (
              // Loading skeleton
              <>
                {[1, 2, 3].map((index) => (
                  <Card key={index} className="text-center">
                    <CardHeader>
                      <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse"></div>
                      <div className="h-6 bg-gray-200 rounded animate-pulse mb-2"></div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <div className="h-4 bg-gray-200 rounded animate-pulse w-3/4 mx-auto"></div>
                        <div className="h-4 bg-gray-200 rounded animate-pulse w-1/2 mx-auto"></div>
                        <div className="h-3 bg-gray-200 rounded animate-pulse w-5/6 mx-auto mt-3"></div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </>
            ) : (
              contactCards.map((info, index) => (
                <Card key={index} className="text-center hover:shadow-lg transition-shadow duration-300">
                  <CardHeader>
                    <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <info.icon className="w-8 h-8 text-blue-600" />
                    </div>
                    <CardTitle className="text-xl">{info.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {info.details.map((detail: string, idx: number) => (
                        <p key={idx} className="font-medium text-gray-900">{detail}</p>
                      ))}
                      <p className="text-sm text-gray-600">{info.description}</p>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </div>
      </section>

      {/* Contact Form */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Send us a Message</h2>
            <p className="text-lg text-gray-600">
              Fill out the form below and we'll get back to you as soon as possible.
            </p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Contact Form</CardTitle>
              <CardDescription>
                Please provide as much detail as possible to help us better understand your needs.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {submitStatus === "success" && (
                <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    <span className="text-green-800 font-medium">Message sent successfully!</span>
                  </div>
                  <p className="text-green-700 mt-1">We'll get back to you within 24 hours.</p>
                </div>
              )}

              {submitStatus === "error" && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <AlertCircle className="w-5 h-5 text-red-600" />
                    <span className="text-red-800 font-medium">Error sending message</span>
                  </div>
                  <p className="text-red-700 mt-1">Please try again or contact us directly at business@upreak.com</p>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-2">
                      First Name *
                    </label>
                    <Input
                      id="firstName"
                      name="firstName"
                      type="text"
                      required
                      value={formData.firstName}
                      onChange={handleInputChange}
                      className="w-full"
                    />
                  </div>
                  <div>
                    <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-2">
                      Last Name *
                    </label>
                    <Input
                      id="lastName"
                      name="lastName"
                      type="text"
                      required
                      value={formData.lastName}
                      onChange={handleInputChange}
                      className="w-full"
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                      Email Address *
                    </label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      required
                      value={formData.email}
                      onChange={handleInputChange}
                      className="w-full"
                    />
                  </div>
                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                      Phone Number *
                    </label>
                    <Input
                      id="phone"
                      name="phone"
                      type="tel"
                      required
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="w-full"
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="company" className="block text-sm font-medium text-gray-700 mb-2">
                      Company Name
                    </label>
                    <Input
                      id="company"
                      name="company"
                      type="text"
                      value={formData.company}
                      onChange={handleInputChange}
                      className="w-full"
                    />
                  </div>
                  <div>
                    <label htmlFor="service" className="block text-sm font-medium text-gray-700 mb-2">
                      Service Interest
                    </label>
                    <select
                      id="service"
                      name="service"
                      value={formData.service}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Select a service</option>
                      {services.map((service) => (
                        <option key={service} value={service}>
                          {service}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-2">
                    Subject *
                  </label>
                  <Input
                    id="subject"
                    name="subject"
                    type="text"
                    required
                    value={formData.subject}
                    onChange={handleInputChange}
                    className="w-full"
                  />
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                    Message *
                  </label>
                  <Textarea
                    id="message"
                    name="message"
                    required
                    value={formData.message}
                    onChange={handleInputChange}
                    rows={6}
                    className="w-full"
                    placeholder="Please describe your requirements in detail..."
                  />
                </div>

                <div className="flex justify-center">
                  <Button
                    type="submit"
                    size="lg"
                    disabled={isSubmitting}
                    className="px-8 py-3"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Sending...
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4 mr-2" />
                        Send Message
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Office Hours */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Office Hours</h2>
            <p className="text-lg text-gray-600">
              When you can reach us for immediate assistance.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {isLoading ? (
              // Loading skeleton
              <>
                {[1, 2, 3].map((index) => (
                  <Card key={index} className="text-center">
                    <CardHeader>
                      <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse"></div>
                      <div className="h-6 bg-gray-200 rounded animate-pulse"></div>
                    </CardHeader>
                    <CardContent>
                      <div className="h-6 bg-gray-200 rounded animate-pulse w-3/4 mx-auto"></div>
                    </CardContent>
                  </Card>
                ))}
              </>
            ) : (
              contactInfo.hours.map((schedule: any, index: number) => (
                <Card key={index} className="text-center">
                  <CardHeader>
                    <Clock className="w-12 h-12 text-blue-600 mx-auto mb-4" />
                    <CardTitle className="text-lg">{schedule.day}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-xl font-semibold text-gray-900">{schedule.hours}</p>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </div>
      </section>

      {/* Quick Contact */}
      <section className="py-16 bg-blue-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">Need Immediate Assistance?</h2>
          <p className="text-xl mb-8 opacity-90">
            Call us directly for urgent recruitment needs.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            {contactInfo.phones && contactInfo.phones.length > 0 && (
              <>
                <a href={`tel:${contactInfo.phones[0].replace(/\s/g, "")}`} className="flex items-center space-x-2 text-2xl font-bold hover:opacity-80 transition-opacity">
                  <Phone className="w-6 h-6" />
                  <span>{contactInfo.phones[0]}</span>
                </a>
                {contactInfo.phones.length > 1 && (
                  <>
                    <div className="hidden sm:block w-px h-8 bg-white opacity-50"></div>
                    <a href={`tel:${contactInfo.phones[1].replace(/\s/g, "")}`} className="flex items-center space-x-2 text-2xl font-bold hover:opacity-80 transition-opacity">
                      <Phone className="w-6 h-6" />
                      <span>{contactInfo.phones[1]}</span>
                    </a>
                  </>
                )}
              </>
            )}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Frequently Asked Questions</h2>
            <p className="text-lg text-gray-600">
              Quick answers to common questions about our services.
            </p>
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">How quickly can you fill a position?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Depending on the role and requirements, we typically fill positions within 2-4 weeks. 
                  For urgent requirements, we can expedite the process and provide shortlisted candidates within 48-72 hours.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">What industries do you specialize in?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  We have expertise across multiple industries including Information Technology, Healthcare, 
                  Sales & Business Development, Jewelry Design, Civil Engineering, and Manufacturing & Distribution.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">What is your success rate?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  We maintain a success rate of over 70% in filling critical positions and a client retention rate of over 90%. 
                  Our TriadX Process ensures high-quality matches between candidates and companies.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Do you offer replacement guarantees?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Yes, we offer replacement guarantees for our permanent placement services. 
                  If a candidate leaves within the guarantee period, we'll find a replacement at no additional cost.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Map Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Locations</h2>
            <p className="text-lg text-gray-600">
              Find us at our main office or any of our training centers across India.
            </p>
          </div>

          <div className="bg-gray-200 rounded-lg h-96 flex items-center justify-center">
            <div className="text-center">
              <MapPin className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 text-lg">Interactive Map Coming Soon</p>
              <p className="text-gray-500">Bangalore, Karnataka - Main Office</p>
              <p className="text-gray-500">100+ Training Centers Across India</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Transform Your Recruitment?</h2>
          <p className="text-xl mb-8 opacity-90">
            Partner with Upreak and experience the difference in talent acquisition.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/services">
              <Button size="lg" variant="secondary" className="text-lg px-8 py-3">
                Our Services
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