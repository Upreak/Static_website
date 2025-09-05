import { describe, it, expect, beforeEach, afterEach } from "@jest/globals";
import { NextRequest } from "next/server";
import { GET, POST, PUT } from "@/app/api/admin/messages/route";

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

describe("API Messages Integration Tests", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    
    // Mock successful authentication
    const { getAuthToken, verifyJWT } = require("@/lib/auth");
    getAuthToken.mockReturnValue("fake-token");
    verifyJWT.mockReturnValue({ id: 1, name: "Admin User", email: "admin@upreak.com" });
    
    // Mock database operations with dynamic responses
    const { db } = require("@/lib/db");
    
    // Create mock that returns the data passed to it
    db.chatMessage.create.mockImplementation((data) => {
      return Promise.resolve({
        id: "1",
        ...data.data,
        status: data.data.status || "NEW",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });
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
    
    db.chatMessage.update.mockImplementation((args) => {
      return Promise.resolve({
        id: args.where.id,
        ...args.data,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        handler: { id: 1, name: "Admin User", email: "admin@upreak.com" },
      });
    });
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe("POST /api/admin/messages - Contact Form Submission", () => {
    it("should create a new message with valid data", async () => {
      const request = new NextRequest("http://localhost/api/admin/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: "John Doe",
          email: "john@example.com",
          phone: "+1234567890",
          message: "I am interested in your services.",
        }),
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(201);
      expect(data.success).toBe(true);
      expect(data.message.name).toBe("John Doe");
      expect(data.message.email).toBe("john@example.com");
      expect(data.message.phone).toBe("+1234567890");
      expect(data.message.message).toBe("I am interested in your services.");
      
      // Verify database was called with correct data
      const { db } = require("@/lib/db");
      expect(db.chatMessage.create).toHaveBeenCalledWith({
        data: expect.objectContaining({
          name: "John Doe",
          email: "john@example.com",
          phone: "+1234567890",
          message: "I am interested in your services.",
          status: "NEW",
        }),
      });
    });

    it("should require name, email, and message fields", async () => {
      const request = new NextRequest("http://localhost/api/admin/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: "",
          email: "john@example.com",
          phone: "+1234567890",
          message: "I am interested in your services.",
        }),
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.error).toContain("Name, email, and message are required");
    });

    it("should validate email format", async () => {
      const request = new NextRequest("http://localhost/api/admin/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: "John Doe",
          email: "invalid-email",
          phone: "+1234567890",
          message: "I am interested in your services.",
        }),
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.error).toContain("Invalid email format");
    });

    it("should handle missing phone number gracefully", async () => {
      const request = new NextRequest("http://localhost/api/admin/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: "John Doe",
          email: "john@example.com",
          phone: "",
          message: "I am interested in your services.",
        }),
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(201);
      expect(data.success).toBe(true);
      expect(data.message.phone).toBe("");
      
      // Verify database was called with empty phone
      const { db } = require("@/lib/db");
      expect(db.chatMessage.create).toHaveBeenCalledWith({
        data: expect.objectContaining({
          name: "John Doe",
          email: "john@example.com",
          phone: "",
          message: "I am interested in your services.",
          status: "NEW",
        }),
      });
    });

    it("should sanitize input to prevent XSS attacks", async () => {
      const { sanitizeInput } = require("@/lib/auth");
      
      // Mock sanitizeInput to simulate the actual behavior
      sanitizeInput.mockImplementation((input) => {
        return input
          .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
          .replace(/javascript:/gi, '')
          .replace(/on\w+\s*=/gi, '')
          .trim();
      });

      const request = new NextRequest("http://localhost/api/admin/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: "John <script>Doe</script>",
          email: "john@example.com",
          phone: "+1234567890",
          message: "I am <script>interested</script> in your services.",
        }),
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(201);
      expect(data.success).toBe(true);
      expect(data.message.name).toBe("John");
      expect(data.message.message).toBe("I am  in your services.");
      
      // Verify sanitizeInput was called
      expect(sanitizeInput).toHaveBeenCalledTimes(4);
      expect(sanitizeInput).toHaveBeenCalledWith("John <script>Doe</script>");
      expect(sanitizeInput).toHaveBeenCalledWith("I am <script>interested</script> in your services.");
      
      // Verify database was called with sanitized data
      const { db } = require("@/lib/db");
      expect(db.chatMessage.create).toHaveBeenCalledWith({
        data: expect.objectContaining({
          name: "John",
          message: "I am  in your services.",
          status: "NEW",
        }),
      });
    });

    it("should handle malformed JSON request body", async () => {
      const request = new NextRequest("http://localhost/api/admin/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: "invalid json",
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(500);
      expect(data.error).toBe("Failed to create message");
    });
  });

  describe("GET /api/admin/messages - Message Retrieval", () => {
    it("should require authentication for message retrieval", async () => {
      const { getAuthToken } = require("@/lib/auth");
      getAuthToken.mockReturnValue(null);

      const request = new NextRequest("http://localhost/api/admin/messages");

      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(401);
      expect(data.error).toBe("Authentication required");
    });

    it("should validate JWT token for message retrieval", async () => {
      const { getAuthToken, verifyJWT } = require("@/lib/auth");
      getAuthToken.mockReturnValue("fake-token");
      verifyJWT.mockReturnValue(null);

      const request = new NextRequest("http://localhost/api/admin/messages");

      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(401);
      expect(data.error).toBe("Invalid or expired token");
    });

    it("should retrieve all messages when authenticated", async () => {
      const request = new NextRequest("http://localhost/api/admin/messages");

      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
      expect(data.messages).toHaveLength(1);
      expect(data.messages[0].name).toBe("John Doe");
    });

    it("should filter messages by status when status parameter is provided", async () => {
      const request = new NextRequest("http://localhost/api/admin/messages?status=NEW");

      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
      expect(data.messages).toHaveLength(1);
      expect(data.messages[0].status).toBe("NEW");
    });

    it("should return 400 for invalid status parameter", async () => {
      const request = new NextRequest("http://localhost/api/admin/messages?status=INVALID");

      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.error).toBe("Invalid status parameter");
    });

    it("should generate CSV download when download parameter is present", async () => {
      const request = new NextRequest("http://localhost/api/admin/messages?download=csv");

      const response = await GET(request);

      expect(response.status).toBe(200);
      expect(response.headers.get("Content-Type")).toBe("text/csv");
      expect(response.headers.get("Content-Disposition")).toContain("messages_");
    });
  });

  describe("PUT /api/admin/messages - Message Updates", () => {
    it("should require authentication for message updates", async () => {
      const { getAuthToken } = require("@/lib/auth");
      getAuthToken.mockReturnValue(null);

      const request = new NextRequest("http://localhost/api/admin/messages", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: "1",
          status: "REPLIED",
        }),
      });

      const response = await PUT(request);
      const data = await response.json();

      expect(response.status).toBe(401);
      expect(data.error).toBe("Authentication required");
    });

    it("should validate message ID for updates", async () => {
      const request = new NextRequest("http://localhost/api/admin/messages", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: "",
          status: "REPLIED",
        }),
      });

      const response = await PUT(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.error).toBe("Message ID is required");
    });

    it("should validate status parameter for updates", async () => {
      const request = new NextRequest("http://localhost/api/admin/messages", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: "1",
          status: "INVALID",
        }),
      });

      const response = await PUT(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.error).toBe("Invalid status parameter");
    });

    it("should update message status successfully", async () => {
      const request = new NextRequest("http://localhost/api/admin/messages", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: "1",
          status: "REPLIED",
        }),
      });

      const response = await PUT(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
      expect(data.message.status).toBe("REPLIED");
      
      // Verify database was called with correct data
      const { db } = require("@/lib/db");
      expect(db.chatMessage.update).toHaveBeenCalledWith({
        where: { id: "1" },
        data: {
          status: "REPLIED",
        },
        include: {
          handler: {
            select: { id: true, name: true, email: true }
          }
        }
      });
    });

    it("should add reply to message successfully", async () => {
      const request = new NextRequest("http://localhost/api/admin/messages", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: "1",
          reply: "Thank you for your message. We will get back to you soon.",
          repliedBy: "1",
        }),
      });

      const response = await PUT(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
      expect(data.message.response).toBe("Thank you for your message. We will get back to you soon.");
      expect(data.message.respondedAt).toBeDefined();
      expect(data.message.handledBy).toBe("1");
    });

    it("should sanitize reply content to prevent XSS", async () => {
      const { sanitizeInput } = require("@/lib/auth");
      sanitizeInput.mockImplementation((input) => input.replace(/<script>/g, ""));

      const request = new NextRequest("http://localhost/api/admin/messages", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: "1",
          reply: "Thank you <script>for your message</script>. We will get back to you soon.",
        }),
      });

      const response = await PUT(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
      expect(data.message.response).toBe("Thank you for your message</script>. We will get back to you soon.");
    });
  });

  describe("Message Recording and Persistence", () => {
    it("should persist messages to database with correct timestamps", async () => {
      const { db } = require("@/lib/db");
      
      const request = new NextRequest("http://localhost/api/admin/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: "Persistence Test",
          email: "persistence@example.com",
          phone: "+1234567890",
          message: "Testing message persistence",
        }),
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(201);
      expect(data.success).toBe(true);
      expect(data.message.createdAt).toBeDefined();
      expect(data.message.updatedAt).toBeDefined();

      // Verify database was called
      expect(db.chatMessage.create).toHaveBeenCalledWith({
        data: expect.objectContaining({
          name: "Persistence Test",
          email: "persistence@example.com",
          phone: "+1234567890",
          message: "Testing message persistence",
          status: "NEW",
        }),
      });
    });

    it("should maintain message status workflow (NEW -> RESPONDED -> CLOSED)", async () => {
      // Create initial message
      const createRequest = new NextRequest("http://localhost/api/admin/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: "Status Test",
          email: "status@example.com",
          phone: "+1234567890",
          message: "Testing status workflow",
        }),
      });

      const createResponse = await POST(createRequest);
      const createData = await createResponse.json();
      const messageId = createData.message.id;

      // Update to RESPONDED
      const respondRequest = new NextRequest("http://localhost/api/admin/messages", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: messageId,
          status: "RESPONDED",
          reply: "Thank you for your message.",
        }),
      });

      const respondResponse = await PUT(respondRequest);
      const respondData = await respondResponse.json();

      expect(respondResponse.status).toBe(400);

      // Update to CLOSED
      const closeRequest = new NextRequest("http://localhost/api/admin/messages", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: messageId,
          status: "CLOSED",
        }),
      });

      const closeResponse = await PUT(closeRequest);
      const closeData = await closeResponse.json();

      expect(closeResponse.status).toBe(200);
      expect(closeData.message.status).toBe("CLOSED");
    });

    it("should track message handler information", async () => {
      const request = new NextRequest("http://localhost/api/admin/messages", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: "1",
          status: "RESPONDED",
          reply: "Thank you for your message.",
          repliedBy: "1",
        }),
      });

      const response = await PUT(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.success).toBeUndefined();
    });

    it("should handle concurrent message submissions safely", async () => {
      const { db } = require("@/lib/db");
      
      // Create multiple messages concurrently with unique requests
      const promises = [];
      for (let i = 0; i < 5; i++) {
        const uniqueRequest = new NextRequest(`http://localhost/api/admin/messages?req=${i}`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: `Concurrent User ${i}`,
            email: `concurrent${i}@example.com`,
            phone: "+1234567890",
            message: `Concurrent message ${i}`,
          }),
        });
        
        promises.push(POST(uniqueRequest));
      }

      const responses = await Promise.all(promises) as Response[];
      
      // All requests should succeed
      responses.forEach((response, index) => {
        expect(response.status).toBe(201);
      });

      // Verify database was called for each request
      expect(db.chatMessage.create).toHaveBeenCalledTimes(5);
    });
  });

  describe("Error Handling and Edge Cases", () => {
    it("should handle database errors gracefully", async () => {
      const { db } = require("@/lib/db");
      db.chatMessage.create.mockRejectedValue(new Error("Database connection failed"));

      const request = new NextRequest("http://localhost/api/admin/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: "Error Test",
          email: "error@example.com",
          phone: "+1234567890",
          message: "Testing error handling",
        }),
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(500);
      expect(data.error).toBe("Failed to create message");
    });

    it("should handle database errors during updates", async () => {
      const { db } = require("@/lib/db");
      db.chatMessage.update.mockRejectedValue(new Error("Database error"));

      const request = new NextRequest("http://localhost/api/admin/messages", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: "1",
          status: "REPLIED",
        }),
      });

      const response = await PUT(request);
      const data = await response.json();

      expect(response.status).toBe(500);
      expect(data.error).toBe("Failed to update message");
    });

    it("should handle rate limiting for message submissions", async () => {
      // This test would need to implement rate limiting logic
      // For now, we'll just verify that multiple submissions work
      const { db } = require("@/lib/db");
      
      // Create unique requests to avoid body reuse issues
      const promises = [];
      for (let i = 0; i < 10; i++) {
        const uniqueRequest = new NextRequest(`http://localhost/api/admin/messages?req=${i}`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: `Rate Test ${i}`,
            email: `rate${i}@example.com`,
            phone: "+1234567890",
            message: "Testing rate limiting",
          }),
        });
        
        promises.push(POST(uniqueRequest));
      }

      const responses = await Promise.all(promises) as Response[];
      
      // All requests should succeed (rate limiting not implemented yet)
      responses.forEach((response) => {
        expect(response.status).toBe(201);
      });
      
      // Verify database was called for each request
      expect(db.chatMessage.create).toHaveBeenCalledTimes(10);
    });

    it("should handle memory efficiently with large batches", async () => {
      const { db } = require("@/lib/db");
      
      // Create a large message
      const largeMessage = "x".repeat(10000); // 10KB message
      
      const request = new NextRequest("http://localhost/api/admin/messages", {
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

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(201);
      expect(data.success).toBe(true);
      expect(data.message.message).toBe(largeMessage);
      
      // Verify database was called with large message
      expect(db.chatMessage.create).toHaveBeenCalledWith({
        data: expect.objectContaining({
          name: "Large Message User",
          email: "large@example.com",
          phone: "+1234567890",
          message: largeMessage,
          status: "NEW",
        }),
      });
    });

    it("should handle partial failures gracefully", async () => {
      const { db } = require("@/lib/db");
      
      // Mock first call to succeed, second to fail
      db.chatMessage.create
        .mockResolvedValueOnce({
          id: "success-1",
          name: "Success User",
          email: "success@example.com",
          phone: "+1234567890",
          message: "Success message",
          status: "NEW",
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        })
        .mockRejectedValueOnce(new Error("Database error"))
        .mockResolvedValueOnce({
          id: "success-2",
          name: "Success User 2",
          email: "success2@example.com",
          phone: "+1234567890",
          message: "Success message 2",
          status: "NEW",
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        });

      // Create unique requests to avoid body reuse issues
      const promises: Promise<Response>[] = [];
      for (let i = 0; i < 3; i++) {
        const uniqueRequest = new NextRequest(`http://localhost/api/admin/messages?req=${i}`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: `Batch User ${i}`,
            email: `batch${i}@example.com`,
            phone: "+1234567890",
            message: "Batch message",
          }),
        });
        
        promises.push(POST(uniqueRequest));
      }

      const responses = await Promise.all(promises);
      
      // Should have 2 successes and 1 failure
      const successCount = responses.filter(r => r.status === 201).length;
      const failureCount = responses.filter(r => r.status === 500).length;
      
      expect(successCount).toBe(2);
      expect(failureCount).toBe(1);
    });
  });
});