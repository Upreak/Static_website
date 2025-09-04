"use client";

import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  MessageSquare, 
  X, 
  Minimize2, 
  Maximize2, 
  Send, 
  User,
  Bot,
  Clock,
  CheckCircle,
  Phone,
  MessageCircle,
  Smartphone
} from "lucide-react";

interface Message {
  id: string;
  text: string;
  sender: "user" | "bot";
  timestamp: Date;
  status?: "sent" | "delivered" | "read";
  channel?: "web" | "sms" | "whatsapp";
}

interface ChatWidgetProps {
  position?: "bottom-right" | "bottom-left" | "top-right" | "top-left";
  primaryColor?: string;
  title?: string;
  subtitle?: string;
  welcomeMessage?: string;
}

export default function EnhancedChatWidget({
  position = "bottom-right",
  primaryColor = "#3B82F6",
  title = "Upreak Support",
  subtitle = "We're here to help you",
  welcomeMessage = "Hello! Welcome to Upreak. How can I assist you today?"
}: ChatWidgetProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [userInfo, setUserInfo] = useState({ name: "", email: "", phone: "", preferredChannel: "web" as "web" | "sms" | "whatsapp" });
  const [showUserInfoForm, setShowUserInfoForm] = useState(true);
  const [isTyping, setIsTyping] = useState(false);
  const [showChannelSelector, setShowChannelSelector] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const positionClasses = {
    "bottom-right": "bottom-4 right-4",
    "bottom-left": "bottom-4 left-4",
    "top-right": "top-4 right-4",
    "top-left": "top-4 left-4"
  };

  useEffect(() => {
    if (isOpen && !isMinimized) {
      if (messages.length === 0) {
        addMessage(welcomeMessage, "bot", "web");
      }
    }
  }, [isOpen, isMinimized]);

  useEffect(() => {
    console.log('[EnhancedChatWidget] Messages updated, count:', messages.length);
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    console.log('[EnhancedChatWidget] Scrolling to bottom');
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const addMessage = (text: string, sender: "user" | "bot", channel: "web" | "sms" | "whatsapp" = "web") => {
    const newMessage: Message = {
      id: Date.now().toString(),
      text,
      sender,
      timestamp: new Date(),
      status: sender === "user" ? "sent" : undefined,
      channel
    };
    setMessages(prev => [...prev, newMessage]);
  };

  const handleSend = async () => {
    if (!inputValue.trim()) return;

    const userMessage = inputValue.trim();
    setInputValue("");
    
    // Add user message with selected channel
    addMessage(userMessage, "user", userInfo.preferredChannel);

    // Show typing indicator
    setIsTyping(true);

    try {
      // Simulate bot response delay
      await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 2000));

      // Generate bot response
      const botResponse = generateBotResponse(userMessage);
      addMessage(botResponse, "bot", "web");

      // Save message to database
      await saveMessageToDatabase(userMessage, botResponse);

      // If user prefers SMS/WhatsApp, send notification
      if (userInfo.preferredChannel !== "web" && userInfo.phone) {
        await sendSMSNotification(userMessage, botResponse);
      }
    } catch (error) {
      console.error("Error sending message:", error);
      addMessage("I apologize, but I'm having trouble responding right now. Please try again later.", "bot", "web");
    } finally {
      setIsTyping(false);
    }
  };

  const sendSMSNotification = async (userMessage: string, botResponse: string) => {
    try {
      console.log('[EnhancedChatWidget] Sending SMS notification');
      const response = await fetch("/api/twilio/send", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          to: userInfo.phone,
          message: `New chat message from ${userInfo.name}: "${userMessage}"\n\nResponse: ${botResponse}`,
          channel: userInfo.preferredChannel,
          type: "custom"
        }),
      });

      if (response.ok) {
        console.log("[EnhancedChatWidget] SMS/WhatsApp notification sent successfully");
      } else {
        console.error("[EnhancedChatWidget] Failed to send SMS notification:", response.status, response.statusText);
      }
    } catch (error) {
      console.error("[EnhancedChatWidget] Error sending SMS notification:", error);
    }
  };

  const generateBotResponse = (userMessage: string): string => {
    const lowerMessage = userMessage.toLowerCase();

    if (lowerMessage.includes("job") || lowerMessage.includes("career") || lowerMessage.includes("work")) {
      return "We offer various job opportunities across multiple industries including IT, Healthcare, Sales, and more. You can search for jobs on our website or contact our recruitment team for personalized assistance.";
    }

    if (lowerMessage.includes("service") || lowerMessage.includes("recruitment") || lowerMessage.includes("staffing")) {
      return "Upreak provides comprehensive talent solutions including Permanent Placement, Professional Staffing, Payroll Outsourcing, and Train & Deploy programs. Which service are you interested in learning more about?";
    }

    if (lowerMessage.includes("contact") || lowerMessage.includes("phone") || lowerMessage.includes("email")) {
      return "You can reach us at +91 79759 30773 or email us at business@upreak.com. Our team is available Monday to Friday, 9 AM to 6 PM.";
    }

    if (lowerMessage.includes("sms") || lowerMessage.includes("whatsapp") || lowerMessage.includes("message")) {
      return "We can communicate with you via SMS or WhatsApp! Just let us know your preference and we'll send updates and notifications to your phone.";
    }

    if (lowerMessage.includes("about") || lowerMessage.includes("company") || lowerMessage.includes("upreak")) {
      return "Upreak is a leading talent-sourcing solutions provider that combines AI, human expertise, and data analytics to deliver exceptional recruitment outcomes. We've successfully placed over 50 candidates with a 70%+ success rate.";
    }

    return "Thank you for your message! I'm here to help with any questions about our recruitment services, job opportunities, or company information. Could you please provide more details about what you're looking for?";
  };

  const saveMessageToDatabase = async (userMessage: string, botResponse: string) => {
    try {
      console.log('[EnhancedChatWidget] Saving message to database');
      const response = await fetch("/api/admin/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: userInfo.name || "Anonymous",
          email: userInfo.email || "anonymous@example.com",
          phone: userInfo.phone || "",
          message: userMessage
        }),
      });

      if (!response.ok) {
        console.error('[EnhancedChatWidget] Failed to save message to database:', response.status, response.statusText);
      } else {
        console.log('[EnhancedChatWidget] Message saved to database successfully');
      }
    } catch (error) {
      console.error("[EnhancedChatWidget] Error saving message:", error);
    }
  };

  const handleUserInfoSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (userInfo.name && userInfo.email) {
      setShowUserInfoForm(false);
      
      // Send welcome message if phone is provided
      if (userInfo.phone && userInfo.preferredChannel !== "web") {
        sendWelcomeMessage();
      }
    }
  };

  const sendWelcomeMessage = async () => {
    try {
      console.log('[EnhancedChatWidget] Sending welcome message');
      const response = await fetch("/api/twilio/send", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          to: userInfo.phone,
          message: `Welcome to Upreak, ${userInfo.name}! We're excited to help you find your dream job. You can now reach us via ${userInfo.preferredChannel}.`,
          channel: userInfo.preferredChannel,
          type: "welcome_message",
          name: userInfo.name
        }),
      });

      if (response.ok) {
        console.log("[EnhancedChatWidget] Welcome message sent successfully");
      } else {
        console.error("[EnhancedChatWidget] Failed to send welcome message:", response.status, response.statusText);
      }
    } catch (error) {
      console.error("[EnhancedChatWidget] Error sending welcome message:", error);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const getChannelIcon = (channel?: string) => {
    switch (channel) {
      case "sms":
        return <Smartphone className="w-3 h-3" />;
      case "whatsapp":
        return <MessageCircle className="w-3 h-3" />;
      default:
        return <MessageSquare className="w-3 h-3" />;
    }
  };

  if (!isOpen) {
    return (
      <div className={`fixed ${positionClasses[position]} z-50`}>
        <Button
          onClick={() => setIsOpen(true)}
          className="rounded-full w-14 h-14 shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center"
          style={{ backgroundColor: primaryColor }}
        >
          <MessageSquare className="w-6 h-6 text-white" />
          {messages.length > 0 && (
            <Badge className="absolute -top-1 -right-1 w-5 h-5 flex items-center justify-center p-0 text-xs bg-red-500">
              {messages.filter(m => m.sender === "user").length}
            </Badge>
          )}
        </Button>
      </div>
    );
  }

  return (
    <div className={`fixed ${positionClasses[position]} z-50 w-96 max-w-full`} style={{ maxHeight: '80vh' }}>
      <Card className="shadow-2xl border-0 h-full flex flex-col">
        <CardHeader
          className="pb-3 flex-shrink-0"
          style={{ backgroundColor: primaryColor }}
        >
          <div className="flex items-center justify-between text-white">
            <div className="flex items-center space-x-2">
              <MessageSquare className="w-5 h-5" />
              <div>
                <CardTitle className="text-lg">{title}</CardTitle>
                <p className="text-sm opacity-90">{subtitle}</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  console.log('[EnhancedChatWidget] Minimize button clicked');
                  setIsMinimized(!isMinimized);
                }}
                className="text-white hover:bg-white/20"
              >
                {isMinimized ? <Maximize2 className="w-4 h-4" /> : <Minimize2 className="w-4 h-4" />}
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  console.log('[EnhancedChatWidget] Close button clicked');
                  setIsOpen(false);
                }}
                className="text-white hover:bg-white/20"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </CardHeader>

        {!isMinimized && (
          <CardContent className="p-0">
            {showUserInfoForm ? (
              <div className="p-4 border-b">
                <h3 className="font-semibold mb-3">Welcome! Please tell us about yourself</h3>
                <form onSubmit={handleUserInfoSubmit} className="space-y-3">
                  <Input
                    placeholder="Your Name"
                    value={userInfo.name}
                    onChange={(e) => setUserInfo(prev => ({ ...prev, name: e.target.value }))}
                    required
                  />
                  <Input
                    type="email"
                    placeholder="Your Email"
                    value={userInfo.email}
                    onChange={(e) => setUserInfo(prev => ({ ...prev, email: e.target.value }))}
                    required
                  />
                  <Input
                    type="tel"
                    placeholder="Your Phone (Optional)"
                    value={userInfo.phone}
                    onChange={(e) => setUserInfo(prev => ({ ...prev, phone: e.target.value }))}
                  />
                  <div>
                    <label className="block text-sm font-medium mb-2">Preferred Communication Channel</label>
                    <Select value={userInfo.preferredChannel} onValueChange={(value: any) => setUserInfo(prev => ({ ...prev, preferredChannel: value }))}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="web">Web Chat</SelectItem>
                        <SelectItem value="sms">SMS</SelectItem>
                        <SelectItem value="whatsapp">WhatsApp</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <Button type="submit" className="w-full" style={{ backgroundColor: primaryColor }}>
                    Start Chat
                  </Button>
                </form>
              </div>
            ) : (
              <>
                {/* Messages Area */}
                <div className="h-96 overflow-y-auto p-4 space-y-4 flex-shrink-0" id="messages-container">
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}
                    >
                      <div
                        className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                          message.sender === "user"
                            ? "text-white"
                            : "bg-gray-100 text-gray-900"
                        }`}
                        style={message.sender === "user" ? { backgroundColor: primaryColor } : {}}
                      >
                        <div className="flex items-center space-x-2 mb-1">
                          {getChannelIcon(message.channel)}
                          {message.sender === "user" ? (
                            <User className="w-3 h-3" />
                          ) : (
                            <Bot className="w-3 h-3" />
                          )}
                          <span className="text-xs opacity-75">
                            {message.sender === "user" ? "You" : "Support Bot"}
                          </span>
                        </div>
                        <p className="text-sm">{message.text}</p>
                        <div className="flex items-center justify-between mt-1">
                          <span className="text-xs opacity-75">
                            {message.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                          </span>
                          {message.sender === "user" && message.status && (
                            <CheckCircle className="w-3 h-3 opacity-75" />
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                  
                  {isTyping && (
                    <div className="flex justify-start">
                      <div className="bg-gray-100 text-gray-900 px-4 py-2 rounded-lg">
                        <div className="flex items-center space-x-2">
                          <Bot className="w-3 h-3" />
                          <span className="text-xs opacity-75">Support Bot is typing...</span>
                        </div>
                        <div className="flex space-x-1 mt-2">
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0.1s" }}></div>
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }}></div>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  <div ref={messagesEndRef} />
                </div>

                {/* Input Area */}
                <div className="p-4 border-t">
                  <div className="flex items-center space-x-2 mb-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setShowChannelSelector(!showChannelSelector)}
                      className="text-xs"
                    >
                      {getChannelIcon(userInfo.preferredChannel)}
                      {userInfo.preferredChannel === "sms" && "SMS"}
                      {userInfo.preferredChannel === "whatsapp" && "WhatsApp"}
                      {userInfo.preferredChannel === "web" && "Web"}
                    </Button>
                  </div>
                  
                  {showChannelSelector && (
                    <div className="mb-2 p-2 bg-gray-50 rounded-lg">
                      <p className="text-xs text-gray-600 mb-1">Send via:</p>
                      <div className="flex space-x-1">
                        {["web", "sms", "whatsapp"].map((channel) => (
                          <Button
                            key={channel}
                            variant={userInfo.preferredChannel === channel ? "default" : "outline"}
                            size="sm"
                            onClick={() => {
                              setUserInfo(prev => ({ ...prev, preferredChannel: channel as any }));
                              setShowChannelSelector(false);
                            }}
                            className="text-xs"
                          >
                            {channel === "web" && "Web"}
                            {channel === "sms" && "SMS"}
                            {channel === "whatsapp" && "WhatsApp"}
                          </Button>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  <div className="flex space-x-2">
                    <Input
                      value={inputValue}
                      onChange={(e) => setInputValue(e.target.value)}
                      onKeyPress={handleKeyPress}
                      placeholder="Type your message..."
                      className="flex-1"
                    />
                    <Button
                      onClick={handleSend}
                      disabled={!inputValue.trim() || isTyping}
                      style={{ backgroundColor: primaryColor }}
                    >
                      <Send className="w-4 h-4" />
                    </Button>
                  </div>
                  <p className="text-xs text-gray-500 mt-2 text-center">
                    Powered by Upreak AI + Twilio • Your data is secure and confidential
                  </p>
                </div>
              </>
            )}
          </CardContent>
        )}
      </Card>
    </div>
  );
}