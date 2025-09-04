"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Target, Zap, Award, Users, TrendingUp, Globe, Heart, Shield, Star } from "lucide-react";
import Link from "next/link";

export default function AboutPage() {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const values = [
    {
      icon: Heart,
      title: "Client Focus",
      description: "Delivering exceptional, \"WOW\" service to our clients.",
    },
    {
      icon: Shield,
      title: "Courage",
      description: "Embracing and driving change in the recruitment landscape.",
    },
    {
      icon: Star,
      title: "Excellence",
      description: "Passionate, determined, and results-driven approach.",
    },
    {
      icon: Users,
      title: "Integrity",
      description: "Transparent communication with consistent feedback.",
    },
  ];

  const successStats = [
    {
      number: "50+",
      label: "Candidates Placed",
      description: "Across multiple industries and roles",
    },
    {
      number: "70%+",
      label: "Success Rate",
      description: "In filling critical positions",
    },
    {
      number: "90%+",
      label: "Client Retention",
      description: "Building long-term partnerships",
    },
    {
      number: "4+",
      label: "Industries Served",
      description: "From IT to Healthcare and beyond",
    },
  ];

  const uspPoints = [
    {
      icon: Globe,
      title: "Extensive Reach",
      description: "Utilizing professional networks like LinkedIn, Naukri, and more for a broad talent pool",
    },
    {
      icon: TrendingUp,
      title: "Pan-India Expansion",
      description: "Over 100+ training centers in Karnataka, expanding nationwide for diverse talent from cities to remote areas",
    },
    {
      icon: Zap,
      title: "Digital Footprint",
      description: "Our marketing and website enhance visibility and connectivity",
    },
    {
      icon: Users,
      title: "Campus Outreach",
      description: "Strong ties with campuses and alumni for fresh talent",
    },
    {
      icon: Heart,
      title: "Innovative Referrals",
      description: "Leading referral campaigns for quality candidates",
    },
    {
      icon: Award,
      title: "Expert Network",
      description: "60+ freelancers and in-house recruiters ensuring depth and expertise",
    },
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
            ABOUT UPREAK
          </Badge>
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            Your Trusted Partner in
            <span className="text-blue-600 block">Talent Acquisition</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            At Upreak, we pride ourselves on being a Preferred Recruitment Business Partner 
            for companies seeking to align top-tier talent with strategic business goals.
          </p>
        </div>
      </section>

      {/* Company Overview */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Who We Are</h2>
              <p className="text-lg text-gray-600 leading-relaxed">
                Upreak is a leading talent-sourcing solutions provider that combines cutting-edge technology 
                with human expertise to deliver exceptional recruitment outcomes. Our innovative TriadX Process 
                leverages AI, human insight, and data analytics to find the perfect match between companies 
                and candidates.
              </p>
              <p className="text-lg text-gray-600 leading-relaxed">
                Founded with the vision of revolutionizing the recruitment industry, we have successfully 
                placed over 50 top candidates across 4 industries, maintaining a success rate of over 70% 
                and client retention of over 90%.
              </p>
              <div className="flex flex-wrap gap-4 pt-4">
                <Badge variant="outline" className="px-4 py-2">
                  <Target className="w-4 h-4 mr-2" />
                  AI-Powered
                </Badge>
                <Badge variant="outline" className="px-4 py-2">
                  <Users className="w-4 h-4 mr-2" />
                  Human Expertise
                </Badge>
                <Badge variant="outline" className="px-4 py-2">
                  <TrendingUp className="w-4 h-4 mr-2" />
                  Data-Driven
                </Badge>
              </div>
            </div>
            
            <div className="bg-gradient-to-br from-blue-50 to-purple-50 p-8 rounded-2xl">
              <div className="space-y-6">
                <div className="text-center">
                  <h3 className="text-2xl font-semibold text-gray-900 mb-4">Our Impact</h3>
                  <div className="grid grid-cols-2 gap-6">
                    {successStats.map((stat, index) => (
                      <div key={index} className="text-center p-4 bg-white rounded-lg shadow-sm">
                        <div className="text-3xl font-bold text-blue-600 mb-2">{stat.number}</div>
                        <div className="font-semibold text-gray-900 mb-1">{stat.label}</div>
                        <div className="text-sm text-gray-600">{stat.description}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Vision & Mission */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Purpose</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Guided by a clear vision and mission, we strive to transform the recruitment landscape.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8">
            <Card className="hover:shadow-lg transition-shadow duration-300">
              <CardHeader>
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                  <Target className="w-8 h-8 text-blue-600" />
                </div>
                <CardTitle className="text-2xl">Our Vision</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-lg">
                  To be the world's leading talent solutions provider shaping the future of work 
                  through innovation and cultural alignment.
                </CardDescription>
              </CardContent>
            </Card>
            
            <Card className="hover:shadow-lg transition-shadow duration-300">
              <CardHeader>
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mb-4">
                  <Zap className="w-8 h-8 text-purple-600" />
                </div>
                <CardTitle className="text-2xl">Our Mission</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-lg">
                  We empower companies and talent to thrive by delivering curated solutions 
                  that foster sustainable success and lasting partnerships.
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Values</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              The principles that guide our actions and decisions every day.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value, index) => (
              <Card key={index} className="text-center hover:shadow-lg transition-shadow duration-300">
                <CardHeader>
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <value.icon className="w-8 h-8 text-blue-600" />
                  </div>
                  <CardTitle className="text-lg">{value.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>{value.description}</CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
          
          <div className="text-center mt-12">
            <div className="bg-blue-50 p-6 rounded-2xl">
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Our Keys to Success</h3>
              <div className="flex flex-wrap justify-center gap-4">
                <Badge variant="secondary" className="px-4 py-2">Innovation</Badge>
                <Badge variant="secondary" className="px-4 py-2">Teamwork</Badge>
                <Badge variant="secondary" className="px-4 py-2">Speed</Badge>
                <Badge variant="secondary" className="px-4 py-2">Quality</Badge>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* USP Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">What Sets Us Apart</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Our unique advantages that make us the preferred choice for talent solutions.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {uspPoints.map((usp, index) => (
              <Card key={index} className="hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                <CardHeader>
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                      <usp.icon className="w-6 h-6 text-blue-600" />
                    </div>
                    <CardTitle className="text-lg">{usp.title}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <CardDescription>{usp.description}</CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Success Story */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Success Story</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              The journey of excellence and growth that defines Upreak.
            </p>
          </div>
          
          <div className="bg-gradient-to-br from-blue-50 to-purple-50 p-8 rounded-2xl">
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div>
                <h3 className="text-2xl font-semibold text-gray-900 mb-4">The Upreak Edge</h3>
                <p className="text-lg text-gray-600 mb-6">
                  "One client said, 'Upreak found us the perfect candidate when no one else could.' 
                  That trust keeps our clients coming back, even under the toughest deadlines."
                </p>
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <Award className="w-5 h-5 text-blue-600" />
                    <span className="text-gray-700">Overcoming obstacles with ease</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <TrendingUp className="w-5 h-5 text-blue-600" />
                    <span className="text-gray-700">Proactive approach to talent acquisition</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Globe className="w-5 h-5 text-blue-600" />
                    <span className="text-gray-700">Excellence in remote area recruitment</span>
                  </div>
                </div>
              </div>
              
              <div className="bg-white p-6 rounded-xl shadow-sm">
                <h4 className="text-lg font-semibold text-gray-900 mb-4">Notable Roles We've Filled</h4>
                <div className="space-y-3">
                  <div>
                    <h5 className="font-medium text-gray-900">Information Technology & Software Development</h5>
                    <p className="text-sm text-gray-600">Oracle Analyst, Senior Application Analyst, Cyber Security BDE Specialist, ASP.Net Developer, Product Manager</p>
                  </div>
                  <div>
                    <h5 className="font-medium text-gray-900">Healthcare Industry</h5>
                    <p className="text-sm text-gray-600">Cardiologist, Gastrologist, Urologist, Neurologist</p>
                  </div>
                  <div>
                    <h5 className="font-medium text-gray-900">Sales & Business Development</h5>
                    <p className="text-sm text-gray-600">Sales Specialist, Business Development Executives</p>
                  </div>
                  <div>
                    <h5 className="font-medium text-gray-900">Jewelry Design & Civil Engineering</h5>
                    <p className="text-sm text-gray-600">Jewellery Designers, Project Managers, QA/QC Managers</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Partner with Us?</h2>
          <p className="text-xl mb-8 opacity-90">
            Experience the Upreak difference in talent acquisition.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/contact">
              <Button size="lg" variant="secondary" className="text-lg px-8 py-3">
                Get in Touch
              </Button>
            </Link>
            <Link href="/services">
              <Button size="lg" variant="outline" className="text-lg px-8 py-3 text-white border-white hover:bg-white hover:text-blue-600">
                Our Services
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}