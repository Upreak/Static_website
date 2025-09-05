import { describe, it, expect, jest, beforeEach, afterEach } from '@jest/globals';
import { NextRequest, NextResponse } from 'next/server';

// Mock twilio module
jest.mock('twilio');
const mockedTwilio = twilio as jest.MockedFunction<typeof twilio>;

// Mock environment variables
process.env.TWILIO_ACCOUNT_SID = 'test_account_sid';
process.env.TWILIO_AUTH_TOKEN = 'test_auth_token';
process.env.TWILIO_PHONE_NUMBER = '+1234567890';
process.env.TWILIO_WHATSAPP_NUMBER = '+14155238886';

// Import the API route handlers
import { POST as sendTwilioMessage } from '@/app/api/twilio/send/route';

describe('Twilio API Tests', () => {
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
    it('should send SMS message successfully', async () => {
      // Mock the fetch function for database saving
      global.fetch = jest.fn().mockResolvedValueOnce({
        ok: true,
        json: async () => ({ success: true })
      });

      const request = new NextRequest('http://localhost:3000/api/twilio/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          to: '+1234567890',
          message: 'Test message',
          channel: 'sms',
          type: 'custom'
        }),
      });

      const response = await sendTwilioMessage(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
      expect(data.twilioStatus).toBe('simulated');
      expect(data.notifications.sms).toBe('simulated');
      expect(data.notifications.whatsapp).toBe('simulated');
    });

    it('should validate required parameters', async () => {
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

      const response = await sendTwilioMessage(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.error).toBe('Missing required parameters: to, message, channel');
    });

    it('should validate phone number format', async () => {
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

      const response = await sendTwilioMessage(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.error).toBe('Invalid phone number format. Please use E.164 format (e.g., +1234567890)');
    });

    it('should validate message length', async () => {
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

      const response = await sendTwilioMessage(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.error).toBe('Message must be between 1 and 1600 characters');
    });

    it('should handle job application confirmation type', async () => {
      const request = new NextRequest('http://localhost:3000/api/twilio/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          to: '+1234567890',
          message: '',
          channel: 'sms',
          type: 'job_application_confirmation',
          name: 'John Doe',
          jobTitle: 'Software Engineer',
          companyName: 'Tech Corp'
        }),
      });

      const response = await sendTwilioMessage(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
      expect(data.notifications.sms).toBe('simulated');
    });

    it('should handle interview reminder type', async () => {
      const request = new NextRequest('http://localhost:3000/api/twilio/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          to: '+1234567890',
          message: '',
          channel: 'sms',
          type: 'interview_reminder',
          name: 'Jane Smith',
          jobTitle: 'Developer',
          companyName: 'Company',
          date: '2024-01-20',
          time: '10:00 AM'
        }),
      });

      const response = await sendTwilioMessage(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
      expect(data.notifications.sms).toBe('simulated');
    });

    it('should handle welcome message type', async () => {
      const request = new NextRequest('http://localhost:3000/api/twilio/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          to: '+1234567890',
          message: '',
          channel: 'sms',
          type: 'welcome_message',
          name: 'Alex Johnson'
        }),
      });

      const response = await sendTwilioMessage(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
      expect(data.notifications.sms).toBe('simulated');
    });

    it('should handle database save failure gracefully', async () => {
      // Mock the fetch function to simulate database failure
      global.fetch = jest.fn().mockRejectedValueOnce(new Error('Database error'));

      const request = new NextRequest('http://localhost:3000/api/twilio/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          to: '+1234567890',
          message: 'Test message',
          channel: 'sms',
          type: 'custom'
        }),
      });

      const response = await sendTwilioMessage(request);
      const data = await response.json();

      // Should still succeed even if database save fails
      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
      expect(data.twilioStatus).toBe('simulated');
    });

    it('should handle WhatsApp channel', async () => {
      const request = new NextRequest('http://localhost:3000/api/twilio/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          to: '+1234567890',
          message: 'Test message',
          channel: 'whatsapp',
          type: 'custom'
        }),
      });

      const response = await sendTwilioMessage(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
      expect(data.notifications.whatsapp).toBe('simulated');
    });

    it('should handle missing phone number gracefully', async () => {
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

      const response = await sendTwilioMessage(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
      expect(data.notifications.sms).toBe('skipped (no phone provided)');
    });
  });
});