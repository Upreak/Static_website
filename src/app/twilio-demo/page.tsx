"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  MessageSquare, 
  Phone, 
  MessageCircle, 
  Send, 
  CheckCircle, 
  AlertCircle,
  Smartphone,
  Mail,
  User,
  Briefcase,
  Calendar
} from "lucide-react";

// Empty interface for props - this component doesn't receive any props

export default function TwilioDemo({}: TwilioDemoProps) {
  const [formData, setFormData] = useState({
    to: "",
    message: "",
    channel: "sms" as "sms" | "whatsapp",
    type: "custom" as "custom" | "job_application_confirmation" | "interview_reminder" | "welcome_message",
    name: "",
    jobTitle: "",
    companyName: "",
    date: "",
    time: ""
  });
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<{ success: boolean; message?: string; messageId?: string } | null>(null);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSendMessage = async () => {
    if (!formData.to || !formData.message) {
      setResult({ success: false, message: "Phone number and message are required" });
      return;
    }

    setIsLoading(true);
    setResult(null);

    try {
      const payload: any = {
        to: formData.to,
        message: formData.message,
        channel: formData.channel,
        type: formData.type
      };

      // Add type-specific fields
      if (formData.type === "job_application_confirmation") {
        payload.name = formData.name;
        payload.jobTitle = formData.jobTitle;
        payload.companyName = formData.companyName;
      } else if (formData.type === "interview_reminder") {
        payload.name = formData.name;
        payload.date = formData.date;
        payload.time = formData.time;
        payload.company = formData.companyName;
        payload.position = formData.jobTitle;
      } else if (formData.type === "welcome_message") {
        payload.name = formData.name;
      }

      const response = await fetch("/api/twilio/send", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (response.ok) {
        setResult({
          success: true,
          message: "Message sent successfully!",
          messageId: data.messageId
        });
      } else {
        setResult({
          success: false,
          message: data.error || "Failed to send message"
        });
      }
    } catch (error) {
      setResult({
        success: false,
        message: "Network error. Please try again."
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getExampleMessage = () => {
    switch (formData.type) {
      case "job_application_confirmation":
        return `Hi ${formData.name || "John"}! Thank you for applying for the ${formData.jobTitle || "Software Engineer"} position at ${formData.companyName || "Tech Corp"}. We've received your application and will review it shortly.`;
      case "interview_reminder":
        return `Hi ${formData.name || "Jane"}! Reminder: You have an interview for the ${formData.jobTitle || "Developer"} position at ${formData.companyName || "Company"} on ${formData.date || "2024-01-20"} at ${formData.time || "10:00 AM"}.`;
      case "welcome_message":
        return `Welcome to Upreak, ${formData.name || "Alex"}! We're excited to help you find your dream job. Browse our latest opportunities at www.upreak.com.`;
      default:
        return formData.message;
    }
  };

  const features = [
    {
      icon: MessageSquare,
      title: "SMS Integration",
      description: "Send and receive SMS messages for job notifications and updates."
    },
    {
      icon: MessageCircle,
      title: "WhatsApp Support",
      description: "Leverage WhatsApp for richer communication with candidates."
    },
    {
      icon: Smartphone,
      title: "Multi-Channel",
      description: "Choose between SMS, WhatsApp, or web chat based on user preference."
    },
    {
      icon: Briefcase,
      title: "Job Notifications",
      description: "Automated job application confirmations and interview reminders."
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Twilio Integration Demo
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Experience the power of integrated communication with SMS and WhatsApp messaging 
            capabilities powered by Twilio.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {features.map((feature, index) => (
            <Card key={index} className="text-center hover:shadow-lg transition-shadow duration-300">
              <CardHeader>
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <feature.icon className="w-6 h-6 text-blue-600" />
                </div>
                <CardTitle className="text-lg">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>{feature.description}</CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Message Sender */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Send className="w-5 h-5" />
                <span>Send Test Message</span>
              </CardTitle>
              <CardDescription>
                Send a test SMS or WhatsApp message using Twilio integration
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Recipient Phone Number</label>
                <Input
                  placeholder="+1234567890"
                  value={formData.to}
                  onChange={(e) => handleInputChange("to", e.target.value)}
                />
                <p className="text-xs text-gray-500 mt-1">Include country code (e.g., +1 for US)</p>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Message Type</label>
                <Select value={formData.type} onValueChange={(value) => handleInputChange("type", value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="custom">Custom Message</SelectItem>
                    <SelectItem value="job_application_confirmation">Job Application Confirmation</SelectItem>
                    <SelectItem value="interview_reminder">Interview Reminder</SelectItem>
                    <SelectItem value="welcome_message">Welcome Message</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Channel</label>
                <Select value={formData.channel} onValueChange={(value) => handleInputChange("channel", value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="sms">SMS</SelectItem>
                    <SelectItem value="whatsapp">WhatsApp</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {formData.type === "job_application_confirmation" && (
                <>
                  <Input
                    placeholder="Candidate Name"
                    value={formData.name}
                    onChange={(e) => handleInputChange("name", e.target.value)}
                  />
                  <Input
                    placeholder="Job Title"
                    value={formData.jobTitle}
                    onChange={(e) => handleInputChange("jobTitle", e.target.value)}
                  />
                  <Input
                    placeholder="Company Name"
                    value={formData.companyName}
                    onChange={(e) => handleInputChange("companyName", e.target.value)}
                  />
                </>
              )}

              {formData.type === "interview_reminder" && (
                <>
                  <Input
                    placeholder="Candidate Name"
                    value={formData.name}
                    onChange={(e) => handleInputChange("name", e.target.value)}
                  />
                  <Input
                    placeholder="Job Title"
                    value={formData.jobTitle}
                    onChange={(e) => handleInputChange("jobTitle", e.target.value)}
                  />
                  <Input
                    placeholder="Company Name"
                    value={formData.companyName}
                    onChange={(e) => handleInputChange("companyName", e.target.value)}
                  />
                  <Input
                    placeholder="Interview Date (YYYY-MM-DD)"
                    value={formData.date}
                    onChange={(e) => handleInputChange("date", e.target.value)}
                  />
                  <Input
                    placeholder="Interview Time (HH:MM AM/PM)"
                    value={formData.time}
                    onChange={(e) => handleInputChange("time", e.target.value)}
                  />
                </>
              )}

              {formData.type === "welcome_message" && (
                <Input
                  placeholder="User Name"
                  value={formData.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                />
              )}

              {formData.type === "custom" && (
                <div>
                  <label className="block text-sm font-medium mb-2">Custom Message</label>
                  <textarea
                    placeholder="Enter your custom message here..."
                    value={formData.message}
                    onChange={(e) => handleInputChange("message", e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    rows={4}
                  />
                </div>
              )}

              {formData.type !== "custom" && (
                <div>
                  <label className="block text-sm font-medium mb-2">Preview Message</label>
                  <div className="p-3 bg-gray-100 rounded-lg text-sm">
                    {getExampleMessage()}
                  </div>
                </div>
              )}

              <Button
                onClick={handleSendMessage}
                disabled={isLoading || !formData.to}
                className="w-full"
              >
                {isLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Sending...
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4 mr-2" />
                    Send {formData.channel === "whatsapp" ? "WhatsApp" : "SMS"}
                  </>
                )}
              </Button>

              {result && (
                <div className={`p-4 rounded-lg ${
                  result.success 
                    ? "bg-green-50 border border-green-200" 
                    : "bg-red-50 border border-red-200"
                }`}>
                  <div className="flex items-center space-x-2">
                    {result.success ? (
                      <CheckCircle className="w-5 h-5 text-green-600" />
                    ) : (
                      <AlertCircle className="w-5 h-5 text-red-600" />
                    )}
                    <span className={`font-medium ${
                      result.success ? "text-green-800" : "text-red-800"
                    }`}>
                      {result.success ? "Success!" : "Error"}
                    </span>
                  </div>
                  <p className={`text-sm mt-1 ${
                    result.success ? "text-green-700" : "text-red-700"
                  }`}>
                    {result.message}
                  </p>
                  {result.messageId && (
                    <p className="text-xs text-green-600 mt-1">
                      Message ID: {result.messageId}
                    </p>
                  )}
                </div>
              )}
            </CardContent>
          </Card>

          {/* API Documentation */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <MessageSquare className="w-5 h-5" />
                <span>API Endpoints</span>
              </CardTitle>
              <CardDescription>
                Available Twilio integration endpoints
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h4 className="font-semibold mb-2">Send Message</h4>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm font-mono text-gray-700 mb-2">POST /api/twilio/send</p>
                  <div className="text-xs text-gray-600 space-y-1">
                    <p><strong>Body:</strong></p>
                    <p>{`{`}</p>
                    <p className="ml-4">"to": "+1234567890",</p>
                    <p className="ml-4">"message": "Your message here",</p>
                    <p className="ml-4">"channel": "sms|whatsapp",</p>
                    <p className="ml-4">"type": "custom|job_application_confirmation|interview_reminder|welcome_message"</p>
                    <p>{`}`}</p>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-semibold mb-2">SMS Webhook</h4>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm font-mono text-gray-700 mb-2">POST /api/twilio/sms</p>
                  <p className="text-xs text-gray-600">
                    Handles incoming SMS messages from Twilio
                  </p>
                </div>
              </div>

              <div>
                <h4 className="font-semibold mb-2">WhatsApp Webhook</h4>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm font-mono text-gray-700 mb-2">POST /api/twilio/whatsapp</p>
                  <p className="text-xs text-gray-600">
                    Handles incoming WhatsApp messages from Twilio
                  </p>
                </div>
              </div>

              <div>
                <h4 className="font-semibold mb-2">Environment Variables</h4>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="text-xs text-gray-600 space-y-1">
                    <p><strong>TWILIO_ACCOUNT_SID:</strong> Your Twilio Account SID</p>
                    <p><strong>TWILIO_AUTH_TOKEN:</strong> Your Twilio Auth Token</p>
                    <p><strong>TWILIO_PHONE_NUMBER:</strong> Your Twilio phone number</p>
                    <p><strong>TWILIO_WHATSAPP_NUMBER:</strong> Your Twilio WhatsApp number</p>
                  </div>
                </div>
              </div>

              <div className="bg-blue-50 p-4 rounded-lg">
                <h4 className="font-semibold text-blue-800 mb-2">Demo Mode</h4>
                <p className="text-sm text-blue-700">
                  This demo is running in simulation mode. In a production environment, 
                  you would need to configure actual Twilio credentials and phone numbers.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}