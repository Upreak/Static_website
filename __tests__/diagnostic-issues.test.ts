import { describe, it, expect, beforeEach, afterEach } from "@jest/globals";
import { NextRequest } from "next/server";
import { db } from "@/lib/db";

// Mock the database connection
jest.mock("@/lib/db", () => ({
  db: {
    chatMessage: {
      create: jest.fn(),
      findMany: jest.fn(),
      update: jest.fn(),
    },
  },
}));

// Mock authentication
jest.mock("@/lib/auth", () => ({
  getAuthToken: jest.fn(),
  verifyJWT: jest.fn(),
  sanitizeInput: jest.fn((input) => input),
}));

describe("Diagnostic Tests for Critical Issues", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    
    // Mock successful authentication
    const { getAuthToken, verifyJWT } = require("@/lib/auth");
    getAuthToken.mockReturnValue("fake-token");
    verifyJWT.mockReturnValue({ id: 1, name: "Admin User", email: "admin@upreak.com" });
    
    // Mock database operations
    const { db } = require("@/lib/db");
    db.chatMessage.create.mockResolvedValue({
      id: "1",
      name: "John Doe",
      email: "john@example.com",
      phone: "+1234567890",
      message: "Test message",
      status: "NEW",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
    
    db.chatMessage.findMany.mockResolvedValue([
      {
        id: "1",
        name: "John Doe",
        email: "john@example.com",
        phone: "+1234567890",
        message: "Test message",
        status: "NEW",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        handler: null,
      }
    ]);
    
    db.chatMessage.update.mockResolvedValue({
      id: "1",
      name: "John Doe",
      email: "john@example.com",
      phone: "+1234567890",
      message: "Test message",
      status: "RESPONDED",
      response: "Thank you for your message. We will get back to you soon.",
      respondedAt: new Date().toISOString(),
      handledBy: "1",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      handler: { id: 1, name: "Admin User", email: "admin@upreak.com" },
    });
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe("Issue 1: Chart Data Not Appearing in Admin Panel", () => {
    it("should properly create and retrieve messages for admin display", async () => {
      const { db } = require("@/lib/db");
      
      // Simulate message creation from chartbot
      const createMessageData = {
        name: "Chart User",
        email: "chart@example.com",
        phone: "",
        message: "I need help with chart data visualization",
      };
      
      db.chatMessage.create.mockResolvedValueOnce({
        ...createMessageData,
        id: "chart-123",
        status: "NEW",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });
      
      // Test message creation
      const createResponse = await fetch("/api/admin/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(createMessageData),
      });
      
      expect(createResponse.status).toBe(201);
      const createData = await createResponse.json();
      expect(createData.success).toBe(true);
      expect(createData.message.name).toBe("Chart User");
      
      // Test message retrieval in admin panel
      const getResponse = await fetch("/api/admin/messages");
      expect(getResponse.status).toBe(200);
      const getData = await getResponse.json();
      expect(getData.success).toBe(true);
      expect(getData.messages).toHaveLength(1);
      expect(getData.messages[0].name).toBe("Chart User");
      expect(getData.messages[0].status).toBe("NEW");
    });

    it("should handle message status updates properly", async () => {
      const { db } = require("@/lib/db");
      
      // Simulate admin updating message status
      const updateData = {
        id: "chart-123",
        status: "RESPONDED",
        reply: "Thank you for your inquiry about chart data. We'll assist you shortly.",
        repliedBy: "1",
      };
      
      db.chatMessage.update.mockResolvedValueOnce({
        id: "chart-123",
        name: "Chart User",
        email: "chart@example.com",
        phone: "",
        message: "I need help with chart data visualization",
        status: "RESPONDED",
        response: "Thank you for your inquiry about chart data. We'll assist you shortly.",
        respondedAt: new Date().toISOString(),
        handledBy: "1",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        handler: { id: 1, name: "Admin User", email: "admin@upreak.com" },
      });
      
      const response = await fetch("/api/admin/messages", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updateData),
      });
      
      expect(response.status).toBe(200);
      const data = await response.json();
      expect(data.success).toBe(true);
      expect(data.message.status).toBe("RESPONDED");
      expect(data.message.response).toBe("Thank you for your inquiry about chart data. We'll assist you shortly.");
    });
  });

  describe("Issue 2: 'Send us Message' Form Not Functioning", () => {
    it("should properly handle form submission with all required fields", async () => {
      const { db } = require("@/lib/db");
      
      // Simulate form submission from services page
      const formData = {
        name: "Service Inquiry",
        email: "service@example.com",
        phone: "+1234567890",
        message: "I'm interested in your permanent placement services",
      };
      
      db.chatMessage.create.mockResolvedValueOnce({
        ...formData,
        id: "service-456",
        status: "NEW",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });
      
      const response = await fetch("/api/admin/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      
      expect(response.status).toBe(201);
      const data = await response.json();
      expect(data.success).toBe(true);
      expect(data.message.name).toBe("Service Inquiry");
      expect(data.message.email).toBe("service@example.com");
      expect(data.message.message).toBe("I'm interested in your permanent placement services");
    });

    it("should handle form submission with missing optional fields", async () => {
      const { db } = require("@/lib/db");
      
      // Simulate form submission without phone number
      const formData = {
        name: "Service Inquiry",
        email: "service@example.com",
        phone: "", // Missing phone
        message: "I'm interested in your permanent placement services",
      };
      
      db.chatMessage.create.mockResolvedValueOnce({
        ...formData,
        id: "service-789",
        status: "NEW",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });
      
      const response = await fetch("/api/admin/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      
      expect(response.status).toBe(201);
      const data = await response.json();
      expect(data.success).toBe(true);
      expect(data.message.phone).toBe(""); // Should be empty string, not null
    });

    it("should validate email format properly", async () => {
      const formData = {
        name: "Test User",
        email: "invalid-email", // Invalid email
        phone: "+1234567890",
        message: "Test message",
      };
      
      const response = await fetch("/api/admin/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      
      expect(response.status).toBe(400);
      const data = await response.json();
      expect(data.error).toContain("Invalid email format");
    });
  });

  describe("Issue 3: 'Get in Touch' Form Problems", () => {
    it("should handle contact form submission with proper name formatting", async () => {
      const { db } = require("@/lib/db");
      
      // Simulate contact form submission with first and last name
      const formData = {
        firstName: "John",
        lastName: "Doe",
        email: "john.doe@example.com",
        phone: "+1234567890",
        company: "ABC Corp",
        subject: "General Inquiry",
        message: "I'd like to discuss your recruitment services",
        service: "Permanent Placement",
      };
      
      // The API expects name as combined first and last name
      const expectedName = `${formData.firstName} ${formData.lastName}`;
      
      db.chatMessage.create.mockResolvedValueOnce({
        name: expectedName,
        email: formData.email,
        phone: formData.phone,
        message: formData.message,
        id: "contact-999",
        status: "NEW",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });
      
      const response = await fetch("/api/admin/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: expectedName,
          email: formData.email,
          phone: formData.phone,
          message: formData.message,
        }),
      });
      
      expect(response.status).toBe(201);
      const data = await response.json();
      expect(data.success).toBe(true);
      expect(data.message.name).toBe("John Doe"); // Should be properly formatted
      expect(data.message.email).toBe("john.doe@example.com");
    });

    it("should handle contact form submission with missing optional fields", async () => {
      const { db } = require("@/lib/db");
      
      // Simulate contact form submission with minimal required data
      const formData = {
        firstName: "Jane",
        lastName: "Smith",
        email: "jane.smith@example.com",
        phone: "", // Missing phone
        company: "", // Missing company
        subject: "No Subject",
        message: "Please contact me",
        service: "", // Missing service
      };
      
      const expectedName = `${formData.firstName} ${formData.lastName}`;
      
      db.chatMessage.create.mockResolvedValueOnce({
        name: expectedName,
        email: formData.email,
        phone: formData.phone,
        message: formData.message,
        id: "contact-1000",
        status: "NEW",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });
      
      const response = await fetch("/api/admin/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: expectedName,
          email: formData.email,
          phone: formData.phone,
          message: formData.message,
        }),
      });
      
      expect(response.status).toBe(201);
      const data = await response.json();
      expect(data.success).toBe(true);
      expect(data.message.name).toBe("Jane Smith");
      expect(data.message.phone).toBe(""); // Should handle missing phone gracefully
    });

    it("should handle large message content efficiently", async () => {
      const { db } = require("@/lib/db");
      
      // Create a large message content
      const largeMessage = "x".repeat(5000); // 5000 character message
      
      db.chatMessage.create.mockResolvedValueOnce({
        name: "Large Message User",
        email: "large@example.com",
        phone: "+1234567890",
        message: largeMessage,
        id: "contact-large",
        status: "NEW",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });
      
      const response = await fetch("/api/admin/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: "Large Message User",
          email: "large@example.com",
          phone: "+1234567890",
          message: largeMessage,
        }),
      });
      
      expect(response.status).toBe(201);
      const data = await response.json();
      expect(data.success).toBe(true);
      expect(data.message.message).toBe(largeMessage);
    });
  });

  describe("Admin Panel Message Accessibility", () => {
    it("should display messages in admin panel with correct status badges", async () => {
      const { db } = require("@/lib/db");
      
      // Mock multiple messages with different statuses
      db.chatMessage.findMany.mockResolvedValue([
        {
          id: "1",
          name: "New User",
          email: "new@example.com",
          phone: "+1234567890",
          message: "New message",
          status: "NEW",
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          handler: null,
        },
        {
          id: "2",
          name: "Read User",
          email: "read@example.com",
          phone: "+1234567890",
          message: "Read message",
          status: "READ",
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          handler: { id: 1, name: "Admin User", email: "admin@upreak.com" },
        },
        {
          id: "3",
          name: "Responded User",
          email: "responded@example.com",
          phone: "+1234567890",
          message: "Responded message",
          status: "RESPONDED",
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          handler: { id: 1, name: "Admin User", email: "admin@upreak.com" },
        },
      ]);
      
      const response = await fetch("/api/admin/messages");
      expect(response.status).toBe(200);
      const data = await response.json();
      expect(data.success).toBe(true);
      expect(data.messages).toHaveLength(3);
      
      // Check that all messages are returned with correct status
      const statuses = data.messages.map((msg: any) => msg.status);
      expect(statuses).toContain("NEW");
      expect(statuses).toContain("READ");
      expect(statuses).toContain("RESPONDED");
    });

    it("should filter messages by status when requested", async () => {
      const { db } = require("@/lib/db");
      
      // Mock messages with different statuses
      db.chatMessage.findMany.mockResolvedValue([
        {
          id: "1",
          name: "New User",
          email: "new@example.com",
          phone: "+1234567890",
          message: "New message",
          status: "NEW",
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          handler: null,
        },
      ]);
      
      const response = await fetch("/api/admin/messages?status=NEW");
      expect(response.status).toBe(200);
      const data = await response.json();
      expect(data.success).toBe(true);
      expect(data.messages).toHaveLength(1);
      expect(data.messages[0].status).toBe("NEW");
    });

    it("should generate CSV download for messages", async () => {
      const { db } = require("@/lib/db");
      
      db.chatMessage.findMany.mockResolvedValue([
        {
          id: "1",
          name: "CSV User",
          email: "csv@example.com",
          phone: "+1234567890",
          message: "CSV message",
          status: "NEW",
          createdAt: "2024-01-15T10:00:00.000Z",
          updatedAt: new Date().toISOString(),
          handler: null,
        },
      ]);
      
      const response = await fetch("/api/admin/messages?download=csv");
      expect(response.status).toBe(200);
      expect(response.headers.get("Content-Type")).toBe("text/csv");
      expect(response.headers.get("Content-Disposition")).toContain("messages_");
      
      const csvContent = await response.text();
      expect(csvContent).toContain("ID,Name,Email,Phone,Message,Status,Created At");
      expect(csvContent).toContain("CSV User");
      expect(csvContent).toContain("csv@example.com");
    });
  });
});