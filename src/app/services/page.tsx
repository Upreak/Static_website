"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Users, Briefcase, Target, Zap, CheckCircle, Star, TrendingUp, Clock, Shield, Award } from "lucide-react";
import Link from "next/link";

export default function ServicesPage() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeService, setActiveService] = useState("all");

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const services = [
    {
      id: "permanent",
      title: "Permanent Placement",
      description: "Find your perfect long-term team members with our curated talent matching process.",
      icon: Users,
      features: [
        "Comprehensive candidate screening",
        "Cultural fit assessment",
        "Long-term success guarantee",
        "Ongoing support and follow-up"
      ],
      benefits: [
        "Reduced turnover rates",
        "Higher employee satisfaction",
        "Better team integration",
        "Cost-effective long-term solution"
      ]
    },
    {
      id: "staffing",
      title: "Professional Staffing",
      description: "Flexible staffing solutions for your temporary and contract needs.",
      icon: Briefcase,
      features: [
        "Quick turnaround time",
        "Pre-vetted professionals",
        "Flexible contract terms",
        "24/7 support availability"
      ],
      benefits: [
        "Immediate workforce solutions",
        "Scalable staffing options",
        "Reduced administrative burden",
        "Access to specialized skills"
      ]
    },
    {
      id: "payroll",
      title: "Payroll Outsourcing",
      description: "Streamline your payroll processes with our expert management services.",
      icon: Target,
      features: [
        "Automated payroll processing",
        "Tax compliance management",
        "Employee self-service portal",
        "Detailed reporting and analytics"
      ],
      benefits: [
        "Reduced payroll errors",
        "Time and cost savings",
        "Improved compliance",
        "Enhanced employee satisfaction"
      ]
    },
    {
      id: "training",
      title: "Train and Deploy Module",
      description: "Comprehensive training programs to prepare talent for your specific needs.",
      icon: Zap,
      features: [
        "Customized training curriculum",
        "Industry-specific skills development",
        "On-the-job training support",
        "Performance monitoring and feedback"
      ],
      benefits: [
        "Job-ready candidates",
        "Reduced training costs",
        "Faster productivity",
        "Higher retention rates"
      ]
    }
  ];

  const processSteps = [
    {
      step: "1",
      title: "Understand Your Business & Culture",
      description: "Deep dive into your company values and requirements."
    },
    {
      step: "2",
      title: "Analyze Requirements & Prepare JD",
      description: "Detailed job analysis and comprehensive job descriptions."
    },
    {
      step: "3",
      title: "AI-Driven Search",
      description: "Leverage advanced AI to find the perfect candidates."
    },
    {
      step: "4",
      title: "Expert Pre-Screening",
      description: "Thorough screening by industry experts."
    },
    {
      step: "5",
      title: "Data-Driven Finalization",
      description: "Analytics-based candidate selection and matching."
    },
    {
      step: "6",
      title: "Interview Coordination",
      description: "Seamless interview scheduling and coordination."
    },
    {
      step: "7",
      title: "Onboarding Support",
      description: "Comprehensive onboarding assistance and follow-up."
    }
  ];

  const benefits = [
    {
      icon: Users,
      title: "Access to Diverse Top Talent",
      description: "Access a wide pool of qualified candidates, promoting diversity & inclusion."
    },
    {
      icon: TrendingUp,
      title: "Cost-Effective, Technology-Driven Efficiency",
      description: "Save time & resources with AI-powered tools for streamlined recruitment."
    },
    {
      icon: Target,
      title: "Flexible, Tailored Solutions",
      description: "Personalized strategies for permanent, contract, or temporary roles."
    },
    {
      icon: Shield,
      title: "Strategic, Culture-Driven Hiring",
      description: "Attract candidates who fit your company culture, reducing turnover."
    },
    {
      icon: Star,
      title: "Enhanced Employer Brand",
      description: "Strengthen your reputation as an employer of choice."
    }
  ];

  const filteredServices = activeService === "all" 
    ? services 
    : services.filter(service => service.id === activeService);

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
              <img src="/logo.svg" alt="Upreak Logo" className="h-8 w-auto" />
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
            OUR SERVICES
          </Badge>
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            Comprehensive Talent
            <span className="text-blue-600 block">Solutions</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Our end-to-end recruitment services are designed to meet your unique business needs, 
            from permanent placement to flexible staffing solutions.
          </p>
        </div>
      </section>

      {/* Service Filter */}
      <section className="py-8 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap justify-center gap-4">
            <Button
              variant={activeService === "all" ? "default" : "outline"}
              onClick={() => setActiveService("all")}
              className="px-6 py-2"
            >
              All Services
            </Button>
            {services.map((service) => (
              <Button
                key={service.id}
                variant={activeService === service.id ? "default" : "outline"}
                onClick={() => setActiveService(service.id)}
                className="px-6 py-2"
              >
                {service.title}
              </Button>
            ))}
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 lg:grid-cols-2 gap-8">
            {filteredServices.map((service, index) => (
              <Card key={index} className="hover:shadow-lg transition-all duration-300">
                <CardHeader>
                  <div className="flex items-center space-x-4">
                    <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                      <service.icon className="w-8 h-8 text-blue-600" />
                    </div>
                    <div>
                      <CardTitle className="text-2xl">{service.title}</CardTitle>
                      <CardDescription className="text-lg mt-2">
                        {service.description}
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                      <CheckCircle className="w-5 h-5 text-green-600 mr-2" />
                      Key Features
                    </h4>
                    <ul className="space-y-2">
                      {service.features.map((feature, idx) => (
                        <li key={idx} className="flex items-start space-x-2">
                          <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
                          <span className="text-gray-600">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                      <Star className="w-5 h-5 text-yellow-600 mr-2" />
                      Benefits
                    </h4>
                    <ul className="space-y-2">
                      {service.benefits.map((benefit, idx) => (
                        <li key={idx} className="flex items-start space-x-2">
                          <div className="w-2 h-2 bg-green-600 rounded-full mt-2 flex-shrink-0"></div>
                          <span className="text-gray-600">{benefit}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <Button className="w-full" onClick={() => {
                    const contactSection = document.getElementById('contact');
                    if (contactSection) {
                      contactSection.scrollIntoView({ behavior: 'smooth' });
                    }
                  }}>
                    Learn More About This Service
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* The TriadX Process */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">The TriadX Process</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Our cutting-edge methodology that combines AI, Human expertise, and Data analytics 
              to deliver exceptional recruitment outcomes.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {processSteps.map((step, index) => (
              <Card key={index} className="hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                <CardHeader>
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold">
                      {step.step}
                    </div>
                    <CardTitle className="text-lg">{step.title}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <CardDescription>{step.description}</CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Benefits for You</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Discover how our services can transform your recruitment process.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {benefits.map((benefit, index) => (
              <Card key={index} className="text-center hover:shadow-lg transition-shadow duration-300">
                <CardHeader>
                  <div className="w-20 h-20 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <benefit.icon className="w-10 h-10 text-blue-600" />
                  </div>
                  <CardTitle className="text-xl">{benefit.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-lg">
                    {benefit.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Industry Expertise */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Industry Expertise</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              We specialize in recruitment across multiple industries with deep domain knowledge.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card className="hover:shadow-lg transition-shadow duration-300">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Users className="w-5 h-5 text-blue-600" />
                  <span>Information Technology</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Oracle Analysts, Senior Application Analysts, Cyber Security Specialists, 
                  ASP.Net Developers, Product Managers
                </CardDescription>
              </CardContent>
            </Card>
            
            <Card className="hover:shadow-lg transition-shadow duration-300">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Shield className="w-5 h-5 text-green-600" />
                  <span>Healthcare</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Cardiologists, Gastrologists, Urologists, Neurologists, 
                  and other medical specialists
                </CardDescription>
              </CardContent>
            </Card>
            
            <Card className="hover:shadow-lg transition-shadow duration-300">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <TrendingUp className="w-5 h-5 text-purple-600" />
                  <span>Sales & Business Development</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Sales Specialists, Business Development Executives, 
                  Account Managers, Sales Directors
                </CardDescription>
              </CardContent>
            </Card>
            
            <Card className="hover:shadow-lg transition-shadow duration-300">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Award className="w-5 h-5 text-yellow-600" />
                  <span>Jewelry Design</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Jewellery Manual Designers, Jewellery CAD Designers, 
                  Jewelry Production Managers
                </CardDescription>
              </CardContent>
            </Card>
            
            <Card className="hover:shadow-lg transition-shadow duration-300">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Target className="w-5 h-5 text-red-600" />
                  <span>Civil Engineering</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Project Managers, QA/QC Managers, ISO Lead Auditors, 
                  Site Engineers, Construction Managers
                </CardDescription>
              </CardContent>
            </Card>
            
            <Card className="hover:shadow-lg transition-shadow duration-300">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Briefcase className="w-5 h-5 text-indigo-600" />
                  <span>Manufacturing & Distribution</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Distribution Analysts, Manufacturing Analysts, 
                  Operations Managers, Supply Chain Specialists
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section id="contact" className="py-16 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Get Started?</h2>
          <p className="text-xl mb-8 opacity-90">
            Let's discuss how our services can meet your talent acquisition needs.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/contact">
              <Button size="lg" variant="secondary" className="text-lg px-8 py-3">
                Contact Us Today
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