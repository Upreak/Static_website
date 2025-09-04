"use client";

import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  MessageSquare, 
  X, 
  Minimize2, 
  Maximize2, 
  Send, 
  User,
  Bot,
  Clock,
  CheckCircle
} from "lucide-react";

interface Message {
  id: string;
  text: string;
  sender: "user" | "bot";
  timestamp: Date;
  status?: "sent" | "delivered" | "read";
}

interface ChatWidgetProps {
  position?: "bottom-right" | "bottom-left" | "top-right" | "top-left";
  primaryColor?: string;
  title?: string;
  subtitle?: string;
  welcomeMessage?: string;
}

export default function ChatWidget({
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
  const [userInfo, setUserInfo] = useState({ name: "", email: "", phone: "" });
  const [showUserInfoForm, setShowUserInfoForm] = useState(true);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const positionClasses = {
    "bottom-right": "bottom-4 right-4",
    "bottom-left": "bottom-4 left-4",
    "top-right": "top-4 right-4",
    "top-left": "top-4 left-4"
  };

  useEffect(() => {
    if (isOpen && !isMinimized) {
      // Add welcome message when chat is opened
      if (messages.length === 0) {
        addMessage(welcomeMessage, "bot");
      }
    }
  }, [isOpen, isMinimized]);

  useEffect(() => {
    console.log('[ChatWidget] Messages updated, count:', messages.length);
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    console.log('[ChatWidget] Scrolling to bottom');
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const addMessage = (text: string, sender: "user" | "bot") => {
    const newMessage: Message = {
      id: Date.now().toString(),
      text,
      sender,
      timestamp: new Date(),
      status: sender === "user" ? "sent" : undefined
    };
    setMessages(prev => [...prev, newMessage]);
  };

  const handleSend = async () => {
    if (!inputValue.trim()) return;

    const userMessage = inputValue.trim();
    setInputValue("");
    addMessage(userMessage, "user");

    // Show typing indicator
    setIsTyping(true);

    try {
      // Simulate bot response delay
      await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 2000));

      // Generate bot response based on user message
      const botResponse = generateBotResponse(userMessage);
      addMessage(botResponse, "bot");

      // Save message to database
      await saveMessageToDatabase(userMessage, botResponse);
    } catch (error) {
      console.error("Error sending message:", error);
      addMessage("I apologize, but I'm having trouble responding right now. Please try again later.", "bot");
    } finally {
      setIsTyping(false);
    }
  };

  const generateBotResponse = (userMessage: string): string => {
    const lowerMessage = userMessage.toLowerCase();

    // Job-related responses
    if (lowerMessage.includes("job") || lowerMessage.includes("career") || lowerMessage.includes("work")) {
      return "We offer various job opportunities across multiple industries including IT, Healthcare, Sales, and more. You can search for jobs on our website or contact our recruitment team for personalized assistance.";
    }

    // Service-related responses
    if (lowerMessage.includes("service") || lowerMessage.includes("recruitment") || lowerMessage.includes("staffing")) {
      return "Upreak provides comprehensive talent solutions including Permanent Placement, Professional Staffing, Payroll Outsourcing, and Train & Deploy programs. Which service are you interested in learning more about?";
    }

    // Contact-related responses
    if (lowerMessage.includes("contact") || lowerMessage.includes("phone") || lowerMessage.includes("email")) {
      return "You can reach us at +91 79759 30773 or email us at business@upreak.com. Our team is available Monday to Friday, 9 AM to 6 PM.";
    }

    // Company-related responses
    if (lowerMessage.includes("about") || lowerMessage.includes("company") || lowerMessage.includes("upreak")) {
      return "Upreak is a leading talent-sourcing solutions provider that combines AI, human expertise, and data analytics to deliver exceptional recruitment outcomes. We've successfully placed over 50 candidates with a 70%+ success rate.";
    }

    // Default response
    return "Thank you for your message! I'm here to help with any questions about our recruitment services, job opportunities, or company information. Could you please provide more details about what you're looking for?";
  };

  const saveMessageToDatabase = async (userMessage: string, botResponse: string) => {
    try {
      // Send to Twilio-enabled endpoint
      const response = await fetch("/api/chat/send", {
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
        console.error("Failed to send message via Twilio");
      } else {
        const result = await response.json();
        console.log("Twilio integration result:", result);
      }
    } catch (error) {
      console.error("Error sending message via Twilio:", error);
    }
  };

  const handleUserInfoSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (userInfo.name && userInfo.email) {
      setShowUserInfoForm(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
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
          className="pb-3"
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
                  console.log('[ChatWidget] Minimize button clicked');
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
                  console.log('[ChatWidget] Close button clicked');
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
                  <Button type="submit" className="w-full" style={{ backgroundColor: primaryColor }}>
                    Start Chat
                  </Button>
                </form>
              </div>
            ) : (
              <>
                {/* Messages Area */}
                <div className="h-96 overflow-y-auto p-4 space-y-4 flex-shrink-0">
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
                    Powered by Upreak AI • Your data is secure and confidential
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