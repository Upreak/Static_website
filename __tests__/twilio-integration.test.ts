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

// Import the service after mocking
import { twilioService } from '@/lib/twilio/twilio.service';

describe('Twilio Integration Tests', () => {
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

  describe('TwilioService Initialization', () => {
    it('should initialize with correct credentials', () => {
      expect(mockedTwilio).toHaveBeenCalledWith('test_account_sid', 'test_auth_token');
    });

    it('should throw error if credentials are missing', () => {
      delete process.env.TWILIO_ACCOUNT_SID;
      delete process.env.TWILIO_AUTH_TOKEN;
      
      // Create a new instance to test the error case
      const TwilioService = require('@/lib/twilio/twilio.service').TwilioService;
      expect(() => {
        new TwilioService();
      }).toThrow('Twilio credentials are not configured');
    });
  });

  describe('SMS Functionality', () => {
    it('should send SMS successfully', async () => {
      const mockMessage = {
        sid: 'SM123456789',
        create: jest.fn().mockResolvedValue({ sid: 'SM123456789' })
      };

      mockedTwilio.mockReturnValue({
        messages: mockMessage
      } as any);

      const result = await twilioService.sendSMS('+1234567890', 'Test message');

      expect(result.success).toBe(true);
      expect(result.messageId).toBe('SM123456789');
      expect(mockMessage.create).toHaveBeenCalledWith({
        body: 'Test message',
        from: '+1234567890',
        to: '+1234567890'
      });
    });

    it('should validate phone number format', async () => {
      const result = await twilioService.sendSMS('invalid-phone', 'Test message');
      
      expect(result.success).toBe(false);
      expect(result.error).toBe('Invalid recipient phone number format');
    });

    it('should handle missing phone number', async () => {
      delete process.env.TWILIO_PHONE_NUMBER;
      
      const result = await twilioService.sendSMS('+1234567890', 'Test message');
      
      expect(result.success).toBe(false);
      expect(result.error).toBe('Twilio phone number is not configured');
    });
  });

  describe('WhatsApp Functionality', () => {
    it('should send WhatsApp message successfully', async () => {
      const mockMessage = {
        sid: 'WH123456789',
        create: jest.fn().mockResolvedValue({ sid: 'WH123456789' })
      };

      mockedTwilio.mockReturnValue({
        messages: mockMessage
      } as any);

      const result = await twilioService.sendWhatsApp('+1234567890', 'Test WhatsApp message');

      expect(result.success).toBe(true);
      expect(result.messageId).toBe('WH123456789');
      expect(mockMessage.create).toHaveBeenCalledWith({
        body: 'Test WhatsApp message',
        from: '+14155238886',
        to: 'whatsapp:+1234567890'
      });
    });

    it('should validate WhatsApp phone number format', async () => {
      const result = await twilioService.sendWhatsApp('invalid-phone', 'Test message');
      
      expect(result.success).toBe(false);
      expect(result.error).toBe('Invalid recipient phone number format');
    });
  });

  describe('Notification System', () => {
    it('should send SMS notification when preferred channel is SMS', async () => {
      const mockMessage = {
        create: jest.fn().mockResolvedValue({ sid: 'SM123456789' })
      };

      mockedTwilio.mockReturnValue({
        messages: mockMessage
      } as any);

      const user = { phone: '+1234567890', preferredChannel: 'sms' as const };
      const result = await twilioService.sendNotification(user, 'Test notification');

      expect(result.success).toBe(true);
      expect(mockMessage.create).toHaveBeenCalledWith({
        body: 'Test notification',
        from: '+1234567890',
        to: '+1234567890'
      });
    });

    it('should send WhatsApp notification when preferred channel is WhatsApp', async () => {
      const mockMessage = {
        create: jest.fn().mockResolvedValue({ sid: 'WH123456789' })
      };

      mockedTwilio.mockReturnValue({
        messages: mockMessage
      } as any);

      const user = { phone: '+1234567890', preferredChannel: 'whatsapp' as const };
      const result = await twilioService.sendNotification(user, 'Test notification');

      expect(result.success).toBe(true);
      expect(mockMessage.create).toHaveBeenCalledWith({
        body: 'Test notification',
        from: '+14155238886',
        to: 'whatsapp:+1234567890'
      });
    });

    it('should default to SMS when no preferred channel is specified', async () => {
      const mockMessage = {
        create: jest.fn().mockResolvedValue({ sid: 'SM123456789' })
      };

      mockedTwilio.mockReturnValue({
        messages: mockMessage
      } as any);

      const user = { phone: '+1234567890' };
      const result = await twilioService.sendNotification(user, 'Test notification');

      expect(result.success).toBe(true);
      expect(mockMessage.create).toHaveBeenCalledWith({
        body: 'Test notification',
        from: '+1234567890',
        to: '+1234567890'
      });
    });
  });

  describe('Template Messages', () => {
    it('should send job application confirmation', async () => {
      const mockMessage = {
        create: jest.fn().mockResolvedValue({ sid: 'SM123456789' })
      };

      mockedTwilio.mockReturnValue({
        messages: mockMessage
      } as any);

      const user = { name: 'John Doe', phone: '+1234567890', preferredChannel: 'sms' as const };
      const result = await twilioService.sendJobApplicationConfirmation(user, 'Software Engineer', 'Tech Corp');

      expect(result.success).toBe(true);
      expect(mockMessage.create).toHaveBeenCalledWith({
        body: 'Hi John Doe! Thank you for applying for the Software Engineer position at Tech Corp. We\'ve received your application and will review it shortly. Best regards, Upreak Team',
        from: '+1234567890',
        to: '+1234567890'
      });
    });

    it('should send interview reminder', async () => {
      const mockMessage = {
        create: jest.fn().mockResolvedValue({ sid: 'SM123456789' })
      };

      mockedTwilio.mockReturnValue({
        messages: mockMessage
      } as any);

      const user = { name: 'Jane Smith', phone: '+1234567890', preferredChannel: 'sms' as const };
      const interviewDetails = { date: '2024-01-20', time: '10:00 AM', company: 'Company', position: 'Developer' };
      const result = await twilioService.sendInterviewReminder(user, interviewDetails);

      expect(result.success).toBe(true);
      expect(mockMessage.create).toHaveBeenCalledWith({
        body: 'Hi Jane Smith! Reminder: You have an interview for the Developer position at Company on 2024-01-20 at 10:00 AM. Good luck! - Upreak Team',
        from: '+1234567890',
        to: '+1234567890'
      });
    });

    it('should send welcome message', async () => {
      const mockMessage = {
        create: jest.fn().mockResolvedValue({ sid: 'SM123456789' })
      };

      mockedTwilio.mockReturnValue({
        messages: mockMessage
      } as any);

      const user = { name: 'Alex Johnson', phone: '+1234567890', preferredChannel: 'sms' as const };
      const result = await twilioService.sendWelcomeMessage(user);

      expect(result.success).toBe(true);
      expect(mockMessage.create).toHaveBeenCalledWith({
        body: 'Welcome to Upreak, Alex Johnson! We\'re excited to help you find your dream job. Browse our latest opportunities at www.upreak.com or reply to this message for assistance.',
        from: '+1234567890',
        to: '+1234567890'
      });
    });
  });

  describe('Incoming Message Processing', () => {
    it('should process incoming SMS and generate auto-response', async () => {
      const mockMessage = {
        create: jest.fn().mockResolvedValue({ sid: 'SM123456789' })
      };

      mockedTwilio.mockReturnValue({
        messages: mockMessage
      } as any);

      const result = await twilioService.processIncomingMessage('+1234567890', 'I want to apply for a job', 'sms');

      expect(result.success).toBe(true);
      expect(result.response).toContain('Thank you for your interest in job opportunities');
      expect(mockMessage.create).toHaveBeenCalledWith({
        body: expect.stringContaining('Thank you for your interest in job opportunities'),
        from: '+1234567890',
        to: 'whatsapp:+1234567890'
      });
    });

    it('should process incoming WhatsApp and generate auto-response', async () => {
      const mockMessage = {
        create: jest.fn().mockResolvedValue({ sid: 'WH123456789' })
      };

      mockedTwilio.mockReturnValue({
        messages: mockMessage
      } as any);

      const result = await twilioService.processIncomingMessage('whatsapp:+1234567890', 'What is my application status?', 'whatsapp');

      expect(result.success).toBe(true);
      expect(result.response).toContain('To check your application status');
      expect(mockMessage.create).toHaveBeenCalledWith({
        body: expect.stringContaining('To check your application status'),
        from: '+14155238886',
        to: 'whatsapp:+1234567890'
      });
    });

    it('should handle help requests', async () => {
      const mockMessage = {
        create: jest.fn().mockResolvedValue({ sid: 'SM123456789' })
      };

      mockedTwilio.mockReturnValue({
        messages: mockMessage
      } as any);

      const result = await twilioService.processIncomingMessage('+1234567890', 'I need help', 'sms');

      expect(result.success).toBe(true);
      expect(result.response).toContain('Our support team is here to help');
    });

    it('should provide default response for unknown queries', async () => {
      const mockMessage = {
        create: jest.fn().mockResolvedValue({ sid: 'SM123456789' })
      };

      mockedTwilio.mockReturnValue({
        messages: mockMessage
      } as any);

      const result = await twilioService.processIncomingMessage('+1234567890', 'Random question', 'sms');

      expect(result.success).toBe(true);
      expect(result.response).toContain('Thank you for contacting Upreak');
    });
  });

  describe('Error Handling', () => {
    it('should handle Twilio API errors gracefully', async () => {
      const mockError = new Error('Twilio API Error');
      const mockMessage = {
        create: jest.fn().mockRejectedValue(mockError)
      };

      mockedTwilio.mockReturnValue({
        messages: mockMessage
      } as any);

      const result = await twilioService.sendSMS('+1234567890', 'Test message');

      expect(result.success).toBe(false);
      expect(result.error).toBe('Twilio API Error');
    });

    it('should handle network errors', async () => {
      const mockMessage = {
        create: jest.fn().mockRejectedValue(new Error('Network Error'))
      };

      mockedTwilio.mockReturnValue({
        messages: mockMessage
      } as any);

      const result = await twilioService.sendSMS('+1234567890', 'Test message');

      expect(result.success).toBe(false);
      expect(result.error).toBe('Network Error');
    });
  });
});