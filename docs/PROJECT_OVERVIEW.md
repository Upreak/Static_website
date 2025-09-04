# Upreak Website Documentation

## Table of Contents
1. [Project Overview](#project-overview)
2. [Architecture](#architecture)
3. [Frontend Documentation](#frontend-documentation)
4. [Backend API Documentation](#backend-api-documentation)
5. [Database Schema](#database-schema)
6. [Admin Panel Documentation](#admin-panel-documentation)
7. [Chat System Documentation](#chat-system-documentation)
8. [Twilio Integration](#twilio-integration)
9. [Deployment Guide](#deployment-guide)
10. [Change Log](#change-log)

---

## Project Overview

### Project Name
Upreak - Talent-Sourcing Solutions Website

### Description
A modern, professional static website for Upreak recruitment company with comprehensive features including job search, admin panel, chat functionality, and Twilio integration.

### Tech Stack
- **Frontend**: Next.js 15, TypeScript, Tailwind CSS, shadcn/ui
- **Backend**: Next.js API Routes, Prisma ORM, SQLite
- **Authentication**: Custom auth system with bcryptjs
- **Communication**: Twilio API for SMS/WhatsApp
- **Database**: SQLite (development ready for production)

### Key Features
- Modern responsive design with animations
- Multi-page website with CMS capabilities
- Advanced job search and filtering
- Real-time chat widget with AI responses
- Comprehensive admin panel
- Twilio integration for notifications
- Privacy policy and legal pages

---

## Architecture

### Overall Architecture
```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │   Backend       │    │   Database      │
│   (Next.js)     │◄──►│   (API Routes)  │◄──►│   (SQLite)      │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         │                       │                       │
         ▼                       ▼                       ▼
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Twilio API    │    │   Admin Panel   │    │   Chat Widget   │
│   (SMS/WhatsApp)│    │   (Dashboard)   │    │   (Real-time)   │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

### File Structure
```
/home/z/my-project/
├── docs/                          # Documentation
│   ├── CHANGELOG.md               # Change log
│   ├── PROJECT_OVERVIEW.md       # This file
│   ├── API_DOCUMENTATION.md       # API documentation
│   ├── DOCUMENTATION_GUIDE.md     # Documentation management guide
│   └── update-docs.sh            # Documentation update script
├── src/
│   ├── app/                       # Next.js app directory
│   │   ├── admin/                 # Admin panel routes
│   │   ├── api/                   # API routes
│   │   ├── about/                 # About page
│   │   ├── coming-soon/           # Coming soon page
│   │   ├── contact/               # Contact page
│   │   ├── jobs/                  # Jobs page
│   │   ├── privacy-policy/        # Privacy policy page
│   │   ├── globals.css            # Global styles
│   │   ├── layout.tsx             # Root layout
│   │   └── page.tsx               # Homepage
│   ├── components/                # React components
│   │   ├── chat/                  # Chat components
│   │   └── ui/                    # shadcn/ui components
│   ├── hooks/                     # Custom hooks
│   └── lib/                       # Utilities and configurations
├── prisma/                        # Database schema
├── public/                        # Static assets
└── package.json                  # Dependencies
```

---

## Frontend Documentation

### Pages Structure

#### Homepage (`/`)
- **File**: `src/app/page.tsx`
- **Features**: 
  - Hero section with company branding
  - Smooth scrolling navigation
  - Animated sections (About, Services, Process, Contact)
  - Updated CTA buttons including "Search or Post Job with Sree AI"
- **Components Used**: Button, Card, Badge, Lucide icons
- **Animations**: Custom CSS animations (fade-in, slide-up, slide-in-left, slide-in-right)

#### About Page (`/about`)
- **File**: `src/app/about/page.tsx`
- **Features**:
  - Company overview and statistics
  - Vision and mission statements
  - Company values and culture
  - Success stories and case studies
  - USP (Unique Selling Proposition) showcase

#### Services Page (`/services`)
- **File**: `src/app/services/page.tsx`
- **Features**:
  - Service filtering system
  - Detailed service descriptions
  - The TriadX Process explanation
  - Industry expertise showcase
  - Benefits for clients

#### Jobs Page (`/jobs`)
- **File**: `src/app/jobs/page.tsx`
- **Features**:
  - Advanced job search with filters
  - Job listings by category
  - Featured jobs section
  - Job board integration button
  - Responsive job cards

#### Contact Page (`/contact`)
- **File**: `src/app/contact/page.tsx`
- **Features**:
  - Comprehensive contact form
  - Multiple contact methods
  - Office hours and locations
  - FAQ section
  - Map integration placeholder

#### Privacy Policy Page (`/privacy-policy`)
- **File**: `src/app/privacy-policy/privacy-policy/page.tsx`
- **Features**:
  - Complete privacy policy documentation
  - Table of contents with navigation
  - Legal compliance information
  - User rights and data handling

#### Coming Soon Page (`/coming-soon`)
- **File**: `src/app/coming-soon/page.tsx`
- **Features**:
  - "Search or Post Job with Sree AI" landing page
  - Countdown timer to launch
  - Feature showcase
  - Email notification signup
  - FAQ section

### Components

#### Chat Widget (`src/components/chat/ChatWidget.tsx`)
- **Features**:
  - Real-time chat interface
  - User information collection
  - AI-powered responses
  - Message status indicators
  - Responsive design
  - Twilio integration

#### UI Components (`src/components/ui/`)
- **Complete shadcn/ui component set**:
  - Button, Card, Input, Textarea, Badge
  - Navigation, Dialog, Alert, Form
  - Table, Select, Tabs, Dropdown
  - And many more...

### Styling

#### Global Styles (`src/app/globals.css`)
- **Custom Animations**:
  - `animate-fade-in`: Fade in animation
  - `animate-slide-up`: Slide up animation
  - `animate-slide-in-left`: Slide in from left
  - `animate-slide-in-right`: Slide in from right
- **Tailwind CSS Configuration**: Custom color scheme and utilities

---

## Backend API Documentation

### Authentication API

#### Admin Login
- **Endpoint**: `POST /api/admin/auth/login`
- **Description**: Authenticate admin users
- **Request Body**:
  ```json
  {
    "email": "string",
    "password": "string"
  }
  ```
- **Response**:
  ```json
  {
    "success": true,
    "message": "Login successful",
    "user": {
      "id": "string",
      "email": "string",
      "name": "string",
      "role": "ADMIN"
    },
    "token": "string"
  }
  ```

### Content Management API

#### Pages API
- **Endpoint**: `GET /api/admin/pages`
- **Description**: Get all pages
- **Response**:
  ```json
  {
    "success": true,
    "pages": [
      {
        "id": "string",
        "slug": "string",
        "title": "string",
        "content": "string",
        "status": "PUBLISHED",
        "createdAt": "2024-01-15T00:00:00.000Z",
        "creator": {
          "id": "string",
          "name": "string",
          "email": "string"
        }
      }
    ]
  }
  ```

- **Endpoint**: `POST /api/admin/pages`
- **Description**: Create new page
- **Request Body**:
  ```json
  {
    "title": "string",
    "slug": "string",
    "content": "string",
    "metaTitle": "string",
    "metaDescription": "string",
    "status": "PUBLISHED",
    "createdBy": "string"
  }
  ```

#### Messages API
- **Endpoint**: `GET /api/admin/messages`
- **Description**: Get all chat messages
- **Query Parameters**: `status` (optional)
- **Response**:
  ```json
  {
    "success": true,
    "messages": [
      {
        "id": "string",
        "name": "string",
        "email": "string",
        "phone": "string",
        "message": "string",
        "status": "NEW",
        "createdAt": "2024-01-15T00:00:00.000Z"
      }
    ]
  }
  ```

- **Endpoint**: `POST /api/admin/messages`
- **Description**: Create new message from contact form
- **Request Body**:
  ```json
  {
    "name": "string",
    "email": "string",
    "phone": "string",
    "message": "string"
  }
  ```

#### Settings API
- **Endpoint**: `GET /api/admin/settings`
- **Description**: Get all site settings
- **Response**:
  ```json
  {
    "success": true,
    "settings": {
      "site_title": {
        "value": "Upreak",
        "type": "STRING",
        "description": "Website title"
      }
    }
  }
  ```

- **Endpoint**: `POST /api/admin/settings`
- **Description**: Update site settings
- **Request Body**:
  ```json
  {
    "settings": {
      "site_title": {
        "value": "Upreak",
        "type": "STRING"
      }
    },
    "updatedBy": "string"
  }
  ```

### Chat API

#### Send Message with Twilio
- **Endpoint**: `POST /api/chat/send`
- **Description**: Send chat message with Twilio notifications
- **Request Body**:
  ```json
  {
    "name": "string",
    "email": "string",
    "phone": "string",
    "message": "string"
  }
  ```
- **Response**:
  ```json
  {
    "success": true,
    "message": "Message sent successfully",
    "twilioStatus": "simulated",
    "notifications": {
      "sms": "simulated",
      "whatsapp": "simulated",
      "email": "simulated"
    }
  }
  ```

---

## Database Schema

### Models

#### Admin
```sql
CREATE TABLE admins (
  id TEXT PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  name TEXT NOT NULL,
  role TEXT DEFAULT 'ADMIN',
  is_active BOOLEAN DEFAULT true,
  last_login_at DATETIME,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

#### Page
```sql
CREATE TABLE pages (
  id TEXT PRIMARY KEY,
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  meta_title TEXT,
  meta_description TEXT,
  status TEXT DEFAULT 'DRAFT',
  published_at DATETIME,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  created_by TEXT NOT NULL,
  FOREIGN KEY (created_by) REFERENCES admins(id)
);
```

#### SiteSetting
```sql
CREATE TABLE site_settings (
  id TEXT PRIMARY KEY,
  key TEXT UNIQUE NOT NULL,
  value TEXT NOT NULL,
  description TEXT,
  type TEXT DEFAULT 'STRING',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_by TEXT NOT NULL,
  FOREIGN KEY (updated_by) REFERENCES admins(id)
);
```

#### ChatMessage
```sql
CREATE TABLE chat_messages (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  message TEXT NOT NULL,
  status TEXT DEFAULT 'NEW',
  response TEXT,
  responded_at DATETIME,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  handled_by TEXT,
  FOREIGN KEY (handled_by) REFERENCES admins(id)
);
```

#### Media
```sql
CREATE TABLE media (
  id TEXT PRIMARY KEY,
  filename TEXT NOT NULL,
  original_name TEXT NOT NULL,
  file_path TEXT NOT NULL,
  file_size INTEGER NOT NULL,
  mime_type TEXT NOT NULL,
  alt_text TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

### Enums

#### Role
- `ADMIN`
- `SUPER_ADMIN`
- `EDITOR`

#### PageStatus
- `DRAFT`
- `PUBLISHED`
- `ARCHIVED`

#### SettingType
- `STRING`
- `NUMBER`
- `BOOLEAN`
- `JSON`
- `IMAGE`

#### MessageStatus
- `NEW`
- `READ`
- `RESPONDED`
- `CLOSED`

---

## Admin Panel Documentation

### Access
- **URL**: `/admin`
- **Login**: Any email/password combination (demo mode)
- **Redirect**: `/admin/dashboard` after successful login

### Dashboard Features

#### Navigation
- **Sidebar Navigation**: Dashboard, Pages, Messages, Settings
- **Responsive Design**: Mobile-friendly sidebar
- **Active State**: Visual indication of current section

#### Dashboard Overview
- **Statistics Cards**: Total pages, messages, users, activity
- **Recent Pages**: Latest page updates with status
- **Recent Messages**: Latest contact form submissions
- **Real-time Updates**: Live data refresh

#### Pages Management
- **CRUD Operations**: Create, Read, Update, Delete pages
- **Status Management**: Draft, Published, Archived
- **Content Editor**: Rich text editing capabilities
- **SEO Fields**: Meta title and description
- **Slug Management**: URL slug generation

#### Messages Management
- **Message List**: All contact form submissions
- **Status Tracking**: New, Read, Responded, Closed
- **Filtering**: Filter by status
- **Response System**: Reply to messages
- **User Information**: Complete user details

#### Settings Management
- **General Settings**: Site title, description, contact info
- **Logo Upload**: Brand asset management
- **Favicon Upload**: Site icon management
- **Configuration**: Global site settings

### Admin API Usage

#### Authentication
The admin panel uses a custom authentication system:
1. Login form submission to `/api/admin/auth/login`
2. Token-based session management (demo mode)
3. Role-based access control

#### Data Fetching
All admin data is fetched through API endpoints:
- Pages: `/api/admin/pages`
- Messages: `/api/admin/messages`
- Settings: `/api/admin/settings`

---

## Chat System Documentation

### Chat Widget

#### Features
- **Real-time Interface**: Live chat with instant responses
- **User Collection**: Name, email, phone collection
- **AI Responses**: Intelligent bot responses based on context
- **Status Indicators**: Typing, sent, delivered status
- **Responsive Design**: Works on all device sizes
- **Positioning**: Bottom-right corner (customizable)

#### Configuration
```typescript
<ChatWidget
  position="bottom-right" // Options: bottom-right, bottom-left, top-right, top-left
  primaryColor="#3B82F6" // Custom brand color
  title="Upreak Support" // Custom title
  subtitle="We're here to help you" // Custom subtitle
  welcomeMessage="Hello! Welcome to Upreak. How can I assist you today?" // Custom welcome message
/>
```

#### Message Flow
1. User opens chat widget
2. User information form (name, email, phone)
3. Chat interface with AI responses
4. Messages saved to database
5. Twilio notifications sent (SMS/WhatsApp)

### AI Response Logic

#### Response Categories
- **Job-related**: Information about job opportunities and search
- **Service-related**: Details about recruitment services
- **Contact-related**: Company contact information
- **Company-related**: Information about Upreak
- **Default**: General assistance and guidance

#### Example Responses
```javascript
// Job-related
if (lowerMessage.includes("job") || lowerMessage.includes("career")) {
  return "We offer various job opportunities across multiple industries including IT, Healthcare, Sales, and more.";
}

// Service-related
if (lowerMessage.includes("service") || lowerMessage.includes("recruitment")) {
  return "Upreak provides comprehensive talent solutions including Permanent Placement, Professional Staffing, Payroll Outsourcing, and Train & Deploy programs.";
}
```

---

## Twilio Integration

### Overview
The system integrates with Twilio for SMS and WhatsApp messaging capabilities.

### Features

#### SMS Notifications
- **New Message Alerts**: SMS notifications for new chat messages
- **Job Updates**: SMS updates for job applications
- **Interview Reminders**: SMS reminders for scheduled interviews
- **Welcome Messages**: SMS welcome messages for new users

#### WhatsApp Support
- **Rich Messaging**: WhatsApp message support
- **Media Sharing**: Ability to share media files
- **Template Messages**: Pre-defined message templates
- **Interactive Elements**: Interactive buttons and quick replies

### API Integration

#### Send Message Endpoint
- **URL**: `/api/chat/send`
- **Method**: POST
- **Authentication**: None (public endpoint)
- **Rate Limiting**: To be implemented in production

#### Message Types
- **Custom Messages**: User-defined content
- **Job Application Confirmation**: Automated job application responses
- **Interview Reminders**: Automated interview scheduling reminders
- **Welcome Messages**: Automated user welcome messages

#### Configuration
```javascript
// Twilio client initialization (production)
const client = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

// Send SMS
await client.messages.create({
  body: "Your message here",
  from: process.env.TWILIO_PHONE_NUMBER,
  to: "+1234567890"
});

// Send WhatsApp
await client.messages.create({
  body: "Your WhatsApp message here",
  from: `whatsapp:${process.env.TWILIO_PHONE_NUMBER}`,
  to: `whatsapp:${process.env.ADMIN_WHATSAPP_NUMBER}`
});
```

### Environment Variables
```bash
TWILIO_ACCOUNT_SID=your_account_sid
TWILIO_AUTH_TOKEN=your_auth_token
TWILIO_PHONE_NUMBER=your_twilio_phone_number
ADMIN_WHATSAPP_NUMBER=admin_whatsapp_number
```

---

## Deployment Guide

### Development Setup

#### Prerequisites
- Node.js 18+ 
- npm or yarn
- SQLite (included with Prisma)

#### Installation
```bash
# Clone repository
git clone <repository-url>
cd upreak-website

# Install dependencies
npm install

# Set up database
npm run db:push

# Start development server
npm run dev
```

#### Environment Variables
Create `.env.local` file:
```bash
DATABASE_URL="file:./dev.db"
NEXT_PUBLIC_BASE_URL="http://localhost:3000"
TWILIO_ACCOUNT_SID="your_twilio_account_sid"
TWILIO_AUTH_TOKEN="your_twilio_auth_token"
TWILIO_PHONE_NUMBER="your_twilio_phone_number"
ADMIN_WHATSAPP_NUMBER="your_admin_whatsapp_number"
```

### Production Deployment

#### Build Process
```bash
# Build the application
npm run build

# Start production server
npm start
```

#### Database Setup
```bash
# Generate Prisma client
npx prisma generate

# Push schema to production database
npx prisma db:push

# (Optional) Run migrations
npx prisma migrate deploy
```

#### Hosting Options
- **Vercel**: Recommended for Next.js applications
- **Netlify**: Static site hosting with serverless functions
- **AWS EC2**: Full server control
- **DigitalOcean**: App Platform or Droplets

#### Security Considerations
- **Environment Variables**: Never commit to version control
- **Database Security**: Use strong database credentials
- **API Security**: Implement rate limiting and authentication
- **SSL/HTTPS**: Always use HTTPS in production

### Monitoring and Maintenance

#### Logging
- **Application Logs**: Use Winston or similar logging library
- **Error Tracking**: Implement error tracking (Sentry, etc.)
- **Performance Monitoring**: Monitor application performance

#### Backups
- **Database Backups**: Regular database backups
- **File Backups**: Backup media and uploaded files
- **Configuration Backups**: Backup configuration files

---

## Change Log

### Version 1.0.0 (2024-01-15)

#### Initial Release
- **Complete Website Implementation**
  - Homepage with modern design and animations
  - About Us page with company information
  - Services page showcasing company offerings
  - Search Jobs functionality with advanced filters
  - Contact page with comprehensive form
  - Privacy Policy page with legal compliance
  - Coming Soon page for "Search or Post Job with Sree AI"

#### Admin Panel
- **Authentication System**
  - Admin login with demo credentials
  - Session management
  - Role-based access control
- **Dashboard Features**
  - Statistics overview
  - Pages management (CRUD operations)
  - Messages management
  - Site settings configuration
- **API Endpoints**
  - `/api/admin/auth/login` - Admin authentication
  - `/api/admin/pages` - Page management
  - `/api/admin/messages` - Message management
  - `/api/admin/settings` - Settings management

#### Chat System
- **Chat Widget**
  - Real-time chat interface
  - User information collection
  - AI-powered responses
  - Message status indicators
  - Responsive design
- **Integration Features**
  - Database storage for messages
  - Twilio API integration
  - Multi-channel notifications (SMS/WhatsApp)
  - Message templates and automation

#### Technical Implementation
- **Frontend**
  - Next.js 15 with TypeScript
  - Tailwind CSS with shadcn/ui components
  - Custom animations and transitions
  - Responsive design
- **Backend**
  - Next.js API Routes
  - Prisma ORM with SQLite
  - TypeScript type safety
  - RESTful API design
- **Database**
  - Complete schema design
  - Relationship modeling
  - Data validation
  - Migration support

#### Dependencies Added
- `bcryptjs` - Password hashing
- `twilio` - SMS and WhatsApp integration
- `@types/bcryptjs` - TypeScript definitions

#### Files Created/Modified
- **New Files**: 50+ files including pages, components, APIs
- **Modified Files**: 10+ files including configuration and styling
- **Database Schema**: Complete Prisma schema with 5 models
- **Documentation**: Comprehensive documentation system

#### Known Issues
- Twilio integration in demo mode (requires production credentials)
- Admin authentication uses demo credentials (production-ready structure in place)
- Map integration uses placeholder (ready for Google Maps integration)

#### Future Enhancements
- Real admin authentication with JWT tokens
- Production Twilio credentials
- Google Maps integration
- Advanced job board features
- Multi-language support
- Advanced analytics and reporting

---

## Maintenance and Updates

### Documentation Updates
This documentation should be updated whenever:
- New features are added
- API endpoints are modified
- Database schema changes
- Configuration changes
- Deployment procedures change

### Update Process
1. Make changes to the codebase
2. Update relevant documentation sections
3. Update the change log with version number and date
4. Commit documentation changes with code changes
5. Review and test documentation accuracy

### Contact Information
For questions about this documentation or the codebase:
- **Email**: business@upreak.com
- **Website**: www.upreak.com
- **Admin Panel**: `/admin` (demo credentials)

---

*Last Updated: January 15, 2024*
*Version: 1.0.0*