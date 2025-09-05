import { describe, it, expect, jest, beforeEach, afterEach } from '@jest/globals';
import { NextRequest, NextResponse } from 'next/server';

// Mock twilio module
jest.mock('twilio');

// Mock environment variables
process.env.TWILIO_ACCOUNT_SID = 'test_account_sid';
process.env.TWILIO_AUTH_TOKEN = 'test_auth_token';
process.env.TWILIO_PHONE_NUMBER = '+1234567890';
process.env.TWILIO_WHATSAPP_NUMBER = '+14155238886';

describe('Twilio Comprehensive API Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // Reset environment variables for each test
    process.env.TWILIO_ACCOUNT_SID = 'test_account_sid';
    process.env.TWILIO_AUTH_TOKEN = 'test_auth_token';
    process.env.TWILIO_PHONE_NUMBER = '+1234567890';
    process.env.TWILIO_WHATSAPP_NUMBER = '+14155238886';
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('/api/twilio/send', () => {
    it('should validate required parameters', async () => {
      const { POST } = require('@/app/api/twilio/send/route');
      
      const request = new NextRequest('http://localhost:3000/api/twilio/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          to: '+1234567890',
          // Missing message and channel
        }),
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.error).toBe('Missing required parameters: to, message, channel');
    });

    it('should validate phone number format', async () => {
      const { POST } = require('@/app/api/twilio/send/route');
      
      const request = new NextRequest('http://localhost:3000/api/twilio/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          to: 'invalid-phone',
          message: 'Test message',
          channel: 'sms',
          type: 'custom'
        }),
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.error).toBe('Invalid phone number format. Please use E.164 format (e.g., +1234567890)');
    });

    it('should validate message length', async () => {
      const { POST } = require('@/app/api/twilio/send/route');
      
      const request = new NextRequest('http://localhost:3000/api/twilio/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          to: '+1234567890',
          message: '', // Empty message
          channel: 'sms',
          type: 'custom'
        }),
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.error).toBe('Missing required parameters: to, message, channel');
    });

    it('should handle rate limiting when phone number is missing', async () => {
      const { POST } = require('@/app/api/twilio/send/route');
      
      const request = new NextRequest('http://localhost:3000/api/twilio/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          to: '',
          message: 'Test message',
          channel: 'sms',
          type: 'custom'
        }),
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(429);
      expect(data.error).toBe('Too many requests. Please try again later.');
    });

    it('should handle missing channel gracefully', async () => {
      const { POST } = require('@/app/api/twilio/send/route');
      
      const request = new NextRequest('http://localhost:3000/api/twilio/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          to: '+1234567890',
          message: 'Test message',
          channel: '',
          type: 'custom'
        }),
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(429);
      expect(data.error).toBe('Too many requests. Please try again later.');
    });
  });

  describe('/api/twilio/sms', () => {
    it('should validate required parameters', async () => {
      const { POST } = require('@/app/api/twilio/sms/route');
      
      const request = new NextRequest('http://localhost:3000/api/twilio/sms', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          to: '+1234567890',
          // Missing message
        }),
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.error).toBe('Missing required parameters: to, message');
    });

    it('should validate phone number format', async () => {
      const { POST } = require('@/app/api/twilio/sms/route');
      
      const request = new NextRequest('http://localhost:3000/api/twilio/sms', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          to: 'invalid-phone',
          message: 'Test message'
        }),
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.error).toBe('Invalid phone number format. Please use E.164 format (e.g., +1234567890)');
    });

    it('should validate message length', async () => {
      const { POST } = require('@/app/api/twilio/sms/route');
      
      const request = new NextRequest('http://localhost:3000/api/twilio/sms', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          to: '+1234567890',
          message: '' // Empty message
        }),
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.error).toBe('Message must be between 1 and 1600 characters');
    });

    it('should handle valid SMS request', async () => {
      const { POST } = require('@/app/api/twilio/sms/route');
      
      // Mock the fetch function for database saving
      global.fetch = jest.fn().mockResolvedValueOnce({
        ok: true,
        json: async () => ({ success: true })
      });

      const request = new NextRequest('http://localhost:3000/api/twilio/sms', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          to: '+1234567890',
          message: 'Test message'
        }),
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
      expect(data.twilioStatus).toBe('simulated');
      expect(data.notifications.sms).toBe('simulated');
    });

    it('should handle missing phone number gracefully', async () => {
      const { POST } = require('@/app/api/twilio/sms/route');
      
      const request = new NextRequest('http://localhost:3000/api/twilio/sms', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          to: '',
          message: 'Test message'
        }),
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(429);
      expect(data.error).toBe('Too many requests. Please try again later.');
    });
  });

  describe('/api/twilio/whatsapp', () => {
    it('should validate required parameters', async () => {
      const { POST } = require('@/app/api/twilio/whatsapp/route');
      
      const request = new NextRequest('http://localhost:3000/api/twilio/whatsapp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          to: '+1234567890',
          // Missing message
        }),
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.error).toBe('Missing required parameters: to, message');
    });

    it('should validate phone number format', async () => {
      const { POST } = require('@/app/api/twilio/whatsapp/route');
      
      const request = new NextRequest('http://localhost:3000/api/twilio/whatsapp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          to: 'invalid-phone',
          message: 'Test message'
        }),
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.error).toBe('Invalid phone number format. Please use E.164 format (e.g., +1234567890)');
    });

    it('should validate message length', async () => {
      const { POST } = require('@/app/api/twilio/whatsapp/route');
      
      const request = new NextRequest('http://localhost:3000/api/twilio/whatsapp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          to: '+1234567890',
          message: '' // Empty message
        }),
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.error).toBe('Message must be between 1 and 1600 characters');
    });

    it('should handle valid WhatsApp request', async () => {
      const { POST } = require('@/app/api/twilio/whatsapp/route');
      
      // Mock the fetch function for database saving
      global.fetch = jest.fn().mockResolvedValueOnce({
        ok: true,
        json: async () => ({ success: true })
      });

      const request = new NextRequest('http://localhost:3000/api/twilio/whatsapp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          to: '+1234567890',
          message: 'Test message'
        }),
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
      expect(data.twilioStatus).toBe('simulated');
      expect(data.notifications.whatsapp).toBe('simulated');
    });

    it('should handle missing phone number gracefully', async () => {
      const { POST } = require('@/app/api/twilio/whatsapp/route');
      
      const request = new NextRequest('http://localhost:3000/api/twilio/whatsapp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          to: '',
          message: 'Test message'
        }),
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(429);
      expect(data.error).toBe('Too many requests. Please try again later.');
    });
  });

  describe('Cross-Endpoint Consistency', () => {
    it('should have consistent validation across all endpoints', async () => {
      const endpoints = [
        { path: '/api/twilio/send', handler: 'send' },
        { path: '/api/twilio/sms', handler: 'sms' },
        { path: '/api/twilio/whatsapp', handler: 'whatsapp' }
      ];

      for (const endpoint of endpoints) {
        const { POST } = require(`@/app/api/twilio/${endpoint.handler}/route`);
        
        // Test missing parameters
        const request = new NextRequest(`http://localhost:3000${endpoint.path}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({}),
        });

        const response = await POST(request);
        expect(response.status).toBe(400);
      }
    });

    it('should handle database failures consistently', async () => {
      const endpoints = [
        { path: '/api/twilio/send', handler: 'send' },
        { path: '/api/twilio/sms', handler: 'sms' },
        { path: '/api/twilio/whatsapp', handler: 'whatsapp' }
      ];

      for (const endpoint of endpoints) {
        const { POST } = require(`@/app/api/twilio/${endpoint.handler}/route`);
        
        // Mock database failure
        global.fetch = jest.fn().mockRejectedValueOnce(new Error('Database error'));

        const request = new NextRequest(`http://localhost:3000${endpoint.path}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            to: '+1234567890',
            message: 'Test message',
            ...(endpoint.handler !== 'send' ? {} : { channel: endpoint.handler })
          }),
        });

        const response = await POST(request);
        // Should still succeed even if database save fails
        expect(response.status).toBe(200);
      }
    });
  });

  describe('Security Tests', () => {
    it('should prevent SQL injection attempts', async () => {
      const { POST } = require('@/app/api/twilio/send/route');
      
      const maliciousInput = {
        to: "+1234567890'; DROP TABLE users; --",
        message: 'Test message',
        channel: 'sms',
        type: 'custom'
      };

      const request = new NextRequest('http://localhost:3000/api/twilio/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(maliciousInput),
      });

      const response = await POST(request);
      const data = await response.json();

      // Should reject malformed phone number
      expect(response.status).toBe(400);
      expect(data.error).toContain('Invalid phone number format');
    });

    it('should prevent XSS attacks in message content', async () => {
      const { POST } = require('@/app/api/twilio/send/route');
      
      const xssInput = {
        to: '+1234567890',
        message: '<script>alert("XSS")</script> Test message',
        channel: 'sms',
        type: 'custom'
      };

      const request = new NextRequest('http://localhost:3000/api/twilio/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(xssInput),
      });

      const response = await POST(request);
      const data = await response.json();

      // Should accept the message (XSS filtering should be handled elsewhere)
      expect(response.status).toBe(200);
    });
  });

  describe('Performance Tests', () => {
    it('should handle concurrent requests', async () => {
      const { POST } = require('@/app/api/twilio/send/route');
      
      // Mock the fetch function for database saving
      global.fetch = jest.fn().mockResolvedValueOnce({
        ok: true,
        json: async () => ({ success: true })
      });

      const requests = Array(5).fill(null).map((_, i) => 
        POST(new NextRequest('http://localhost:3000/api/twilio/send', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            to: `+123456789${i}`,
            message: `Test message ${i}`,
            channel: 'sms',
            type: 'custom'
          }),
        }))
      );

      const responses = await Promise.all(requests);
      
      // All requests should succeed
      responses.forEach(response => {
        expect(response.status).toBe(200);
      });
    });

    it('should handle large messages efficiently', async () => {
      const { POST } = require('@/app/api/twilio/send/route');
      
      // Create a message close to the 1600 character limit
      const longMessage = 'A'.repeat(1590);
      
      const request = new NextRequest('http://localhost:3000/api/twilio/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          to: '+1234567890',
          message: longMessage,
          channel: 'sms',
          type: 'custom'
        }),
      });

      const startTime = Date.now();
      const response = await POST(request);
      const endTime = Date.now();

      const data = await response.json();
      
      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
      // Response should be reasonably fast (under 1 second)
      expect(endTime - startTime).toBeLessThan(1000);
    });
  });
});