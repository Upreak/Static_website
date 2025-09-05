"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, Search, MapPin, Clock, DollarSign, Briefcase, Users, Filter, Star } from "lucide-react";
import Link from "next/link";

export default function JobsPage() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedLocation, setSelectedLocation] = useState("");
  const [selectedIndustry, setSelectedIndustry] = useState("");
  const [selectedJobType, setSelectedJobType] = useState("");
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const jobListings = [
    {
      id: 1,
      title: "Senior Application Analyst",
      company: "Leading Tech Company",
      location: "Bangalore",
      type: "Full-time",
      industry: "Information Technology",
      salary: "₹12-18 LPA",
      experience: "3-5 years",
      posted: "2 days ago",
      description: "We are looking for a skilled Senior Application Analyst to join our dynamic team...",
      skills: ["Java", "Spring Boot", "MySQL", "AWS"],
      featured: true
    },
    {
      id: 2,
      title: "Cardiologist",
      company: "Apollo Hospitals",
      location: "Chennai",
      type: "Full-time",
      industry: "Healthcare",
      salary: "₹25-40 LPA",
      experience: "5+ years",
      posted: "1 week ago",
      description: "Join our team of expert cardiologists in a state-of-the-art medical facility...",
      skills: ["Cardiology", "MD", "DM", "Patient Care"],
      featured: true
    },
    {
      id: 3,
      title: "Business Development Executive",
      company: "Growing Startup",
      location: "Mumbai",
      type: "Full-time",
      industry: "Sales & Business Development",
      salary: "₹8-12 LPA",
      experience: "2-4 years",
      posted: "3 days ago",
      description: "Drive business growth through strategic partnerships and client acquisition...",
      skills: ["Sales", "Business Development", "Communication", "Strategy"],
      featured: false
    },
    {
      id: 4,
      title: "Jewellery CAD Designer",
      company: "Luxury Jewelry Brand",
      location: "Jaipur",
      type: "Full-time",
      industry: "Jewelry Design",
      salary: "₹6-10 LPA",
      experience: "2-3 years",
      posted: "5 days ago",
      description: "Create stunning jewelry designs using CAD software for our luxury brand...",
      skills: ["CAD", "Jewelry Design", "3D Modeling", "Creative"],
      featured: false
    },
    {
      id: 5,
      title: "Project Manager - Civil",
      company: "Construction Giant",
      location: "Delhi",
      type: "Full-time",
      industry: "Civil Engineering",
      salary: "₹15-25 LPA",
      experience: "8+ years",
      posted: "1 week ago",
      description: "Lead large-scale civil construction projects with our esteemed organization...",
      skills: ["Project Management", "Civil Engineering", "Team Leadership", "AutoCAD"],
      featured: true
    },
    {
      id: 6,
      title: "Cyber Security BDE Specialist",
      company: "Security Solutions Ltd",
      location: "Hyderabad",
      type: "Full-time",
      industry: "Information Technology",
      salary: "₹10-15 LPA",
      experience: "3-6 years",
      posted: "4 days ago",
      description: "Drive business development in the cyber security domain with cutting-edge solutions...",
      skills: ["Cyber Security", "B2B Sales", "Technical Sales", "Security Solutions"],
      featured: false
    },
    {
      id: 7,
      title: "ASP.Net Developer",
      company: "Software Solutions",
      location: "Pune",
      type: "Full-time",
      industry: "Information Technology",
      salary: "₹8-12 LPA",
      experience: "2-4 years",
      posted: "6 days ago",
      description: "Develop robust web applications using ASP.NET and modern web technologies...",
      skills: ["ASP.NET", "C#", "SQL Server", "JavaScript"],
      featured: false
    },
    {
      id: 8,
      title: "Product Manager",
      company: "Tech Innovations",
      location: "Bangalore",
      type: "Full-time",
      industry: "Information Technology",
      salary: "₹20-30 LPA",
      experience: "5+ years",
      posted: "1 week ago",
      description: "Lead product strategy and development for innovative tech solutions...",
      skills: ["Product Management", "Strategy", "Agile", "Leadership"],
      featured: true
    }
  ];

  const locations = ["Bangalore", "Chennai", "Mumbai", "Delhi", "Hyderabad", "Pune", "Jaipur"];
  const industries = ["Information Technology", "Healthcare", "Sales & Business Development", "Jewelry Design", "Civil Engineering"];
  const jobTypes = ["Full-time", "Part-time", "Contract", "Remote"];

  const filteredJobs = jobListings.filter(job => {
    const matchesSearch = job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         job.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         job.skills.some(skill => skill.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesLocation = !selectedLocation || job.location === selectedLocation;
    const matchesIndustry = !selectedIndustry || job.industry === selectedIndustry;
    const matchesJobType = !selectedJobType || job.type === selectedJobType;

    return matchesSearch && matchesLocation && matchesIndustry && matchesJobType;
  });

  const featuredJobs = jobListings.filter(job => job.featured);

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
            SEARCH JOBS
          </Badge>
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            Find Your Dream
            <span className="text-blue-600 block">Job</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Discover exciting opportunities across various industries. 
            Let us help you find the perfect match for your skills and aspirations.
          </p>
        </div>
      </section>

      {/* Search Section */}
      <section className="py-8 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <Input
                type="text"
                placeholder="Search jobs by title, company, or skills..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-3 text-lg border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none"
              />
            </div>
            
            <div className="flex justify-center mt-4">
              <Button
                variant="outline"
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center space-x-2"
              >
                <Filter className="w-4 h-4" />
                <span>Filters</span>
              </Button>
            </div>

            {showFilters && (
              <div className="mt-6 p-6 bg-gray-50 rounded-lg">
                <div className="grid md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
                    <Select value={selectedLocation} onValueChange={setSelectedLocation}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select location" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="">All Locations</SelectItem>
                        {locations.map((location) => (
                          <SelectItem key={location} value={location}>
                            {location}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Industry</label>
                    <Select value={selectedIndustry} onValueChange={setSelectedIndustry}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select industry" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="">All Industries</SelectItem>
                        {industries.map((industry) => (
                          <SelectItem key={industry} value={industry}>
                            {industry}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Job Type</label>
                    <Select value={selectedJobType} onValueChange={setSelectedJobType}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select job type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="">All Types</SelectItem>
                        {jobTypes.map((type) => (
                          <SelectItem key={type} value={type}>
                            {type}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div className="mt-4 flex justify-center">
                  <Button
                    variant="outline"
                    onClick={() => {
                      setSelectedLocation("");
                      setSelectedIndustry("");
                      setSelectedJobType("");
                    }}
                  >
                    Clear Filters
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Featured Jobs */}
      {searchTerm === "" && selectedLocation === "" && selectedIndustry === "" && selectedJobType === "" && (
        <section className="py-12 bg-yellow-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
              <Star className="w-6 h-6 text-yellow-600 mr-2" />
              Featured Jobs
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredJobs.map((job) => (
                <Card key={job.id} className="border-2 border-yellow-200 hover:shadow-lg transition-shadow duration-300">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <CardTitle className="text-lg">{job.title}</CardTitle>
                        <CardDescription className="text-base font-medium text-gray-700">
                          {job.company}
                        </CardDescription>
                      </div>
                      <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
                        Featured
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex items-center text-sm text-gray-600">
                        <MapPin className="w-4 h-4 mr-1" />
                        <span>{job.location}</span>
                      </div>
                      <div className="flex items-center text-sm text-gray-600">
                        <Clock className="w-4 h-4 mr-1" />
                        <span>{job.type}</span>
                      </div>
                      <div className="flex items-center text-sm text-gray-600">
                        <DollarSign className="w-4 h-4 mr-1" />
                        <span>{job.salary}</span>
                      </div>
                      <div className="flex items-center text-sm text-gray-600">
                        <Briefcase className="w-4 h-4 mr-1" />
                        <span>{job.experience}</span>
                      </div>
                      <div className="flex flex-wrap gap-1 mt-3">
                        {job.skills.slice(0, 3).map((skill, idx) => (
                          <Badge key={idx} variant="outline" className="text-xs">
                            {skill}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Job Listings */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-bold text-gray-900">
              {filteredJobs.length} Jobs Found
            </h2>
            <div className="text-sm text-gray-600">
              Showing {filteredJobs.length} of {jobListings.length} jobs
            </div>
          </div>
          
          <div className="space-y-6">
            {filteredJobs.map((job) => (
              <Card key={job.id} className="hover:shadow-lg transition-shadow duration-300">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <CardTitle className="text-xl">{job.title}</CardTitle>
                      <CardDescription className="text-lg font-medium text-gray-700">
                        {job.company}
                      </CardDescription>
                    </div>
                    {job.featured && (
                      <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
                        Featured
                      </Badge>
                    )}
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                    <div className="flex items-center text-sm text-gray-600">
                      <MapPin className="w-4 h-4 mr-2" />
                      <span>{job.location}</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <Clock className="w-4 h-4 mr-2" />
                      <span>{job.type}</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <DollarSign className="w-4 h-4 mr-2" />
                      <span>{job.salary}</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <Briefcase className="w-4 h-4 mr-2" />
                      <span>{job.experience}</span>
                    </div>
                  </div>
                  
                  <p className="text-gray-600 mb-4">{job.description}</p>
                  
                  <div className="flex flex-wrap gap-2 mb-4">
                    {job.skills.map((skill, idx) => (
                      <Badge key={idx} variant="outline" className="text-xs">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <div className="text-sm text-gray-500">
                      Posted {job.posted}
                    </div>
                    <div className="space-x-2">
                      <Button variant="outline" size="sm">
                        View Details
                      </Button>
                      <Button size="sm">
                        Apply Now
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          
          {filteredJobs.length === 0 && (
            <div className="text-center py-12">
              <div className="text-gray-400 mb-4">
                <Search className="w-16 h-16 mx-auto" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No jobs found</h3>
              <p className="text-gray-600 mb-4">
                Try adjusting your search criteria or filters to find more opportunities.
              </p>
              <Button
                variant="outline"
                onClick={() => {
                  setSearchTerm("");
                  setSelectedLocation("");
                  setSelectedIndustry("");
                  setSelectedJobType("");
                }}
              >
                Clear All Filters
              </Button>
            </div>
          )}
        </div>
      </section>

      {/* Job Board Button */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Looking for More Opportunities?</h2>
          <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
            Access our comprehensive job board with thousands of listings across various industries and locations.
          </p>
          <Button size="lg" className="text-lg px-8 py-3">
            <Briefcase className="w-5 h-5 mr-2" />
            Visit Full Job Board
          </Button>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">Can't Find What You're Looking For?</h2>
          <p className="text-xl mb-8 opacity-90">
            Let us help you find the perfect opportunity. Our team is here to assist you.
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