# Upreak Website Documentation

## Table of Contents
1. [Project Overview](#project-overview)
2. [Getting Started](#getting-started)
3. [Frontend Documentation](#frontend-documentation)
4. [Backend Documentation](#backend-documentation)
5. [Database Schema](#database-schema)
6. [API Documentation](#api-documentation)
7. [Admin Panel](#admin-panel)
8. [Chat System](#chat-system)
9. [Deployment](#deployment)
10. [Change Log](#change-log)

## Project Overview

Upreak is a modern talent-sourcing solutions website built with Next.js 15, TypeScript, and Tailwind CSS. The platform connects companies with exceptional talent through AI-powered recruitment solutions.

### Tech Stack
- **Frontend**: Next.js 15, TypeScript, React, Tailwind CSS, shadcn/ui
- **Backend**: Next.js API Routes, Prisma ORM, SQLite
- **Authentication**: Custom authentication (demo mode)
- **Communication**: Twilio integration for SMS/WhatsApp
- **Database**: SQLite (development ready for production)
- **Styling**: Tailwind CSS with custom animations

### Key Features
- Modern responsive design
- Admin panel for content management
- Real-time chat with AI responses
- Job search and board integration
- Twilio-powered notifications
- Comprehensive page management
- Privacy policy and contact forms

## Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Git

### Installation
```bash
# Clone the repository
git clone <repository-url>
cd upreak-website

# Install dependencies
npm install

# Set up environment variables (optional for development)
cp .env.example .env

# Run database migrations
npm run db:push

# Start development server
npm run dev
```

### Environment Variables
```env
# Database
DATABASE_URL="file:./dev.db"

# Twilio (for production)
TWILIO_ACCOUNT_SID="your_twilio_account_sid"
TWILIO_AUTH_TOKEN="your_twilio_auth_token"
TWILIO_PHONE_NUMBER="+1234567890"
ADMIN_WHATSAPP_NUMBER="+1234567890"

# Application
NEXT_PUBLIC_BASE_URL="http://localhost:3000"
```

### Development Commands
```bash
# Development server
npm run dev

# Production build
npm run build

# Start production server
npm start

# Code linting
npm run lint

# Database operations
npm run db:push
npm run db:studio
```

## Frontend Documentation

### Project Structure
```
src/
├── app/                    # Next.js App Router pages
│   ├── about/             # About Us page
│   ├── admin/             # Admin panel
│   ├── coming-soon/      # Sree AI coming soon page
│   ├── contact/           # Contact page
│   ├── jobs/              # Jobs search page
│   ├── privacy-policy/    # Privacy policy page
│   ├── api/               # API routes
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Homepage
├── components/            # Reusable components
│   ├── chat/              # Chat widget components
│   └── ui/                # shadcn/ui components
└── hooks/                 # Custom React hooks
```

### Pages

#### Homepage (`/`)
- **File**: `src/app/page.tsx`
- **Features**: Hero section, company overview, navigation, call-to-action buttons
- **Key Components**: Animated sections, smooth scrolling, responsive navigation
- **Updates**: Replaced "Get in Touch" with "Search or Post Job with Sree AI"

#### About Us (`/about`)
- **File**: `src/app/about/page.tsx`
- **Features**: Company information, vision, mission, success stories
- **Key Components**: Statistics cards, process steps, USP points

#### Services (`/services`)
- **File**: `src/app/services/page.tsx`
- **Features**: Service showcase, filtering, The TriadX Process
- **Key Components**: Service cards, process timeline, benefits section

#### Jobs (`/jobs`)
- **File**: `src/app/jobs/page.tsx`
- **Features**: Job search, filtering, featured jobs, job board integration
- **Key Components**: Search form, job cards, filter options

#### Contact (`/contact`)
- **File**: `src/app/contact/page.tsx`
- **Features**: Contact form, office information, FAQ
- **Key Components**: Form validation, contact cards, map placeholder

#### Privacy Policy (`/privacy-policy`)
- **File**: `src/app/privacy-policy/page.tsx`
- **Features**: Legal documentation, table of contents
- **Key Components**: Scrollable sections, navigation links

#### Coming Soon (`/coming-soon`)
- **File**: `src/app/coming-soon/page.tsx`
- **Features**: Sree AI launch countdown, notification signup
- **Key Components**: Countdown timer, feature showcase, email form

### Components

#### Chat Widget (`src/components/chat/ChatWidget.tsx`)
- **Features**: Real-time chat, AI responses, data collection
- **Props**: 
  ```typescript
  interface ChatWidgetProps {
    position?: "bottom-right" | "bottom-left" | "top-right" | "top-left";
    primaryColor?: string;
    title?: string;
    subtitle?: string;
    welcomeMessage?: string;
  }
  ```
- **Usage**: Automatically included in layout
- **Integration**: Connected to Twilio for notifications

#### shadcn/ui Components
- **Location**: `src/components/ui/`
- **Components**: Button, Card, Input, Badge, and more
- **Customization**: Themeable with Tailwind CSS

### Styles

#### Global Styles (`src/app/globals.css`)
- **Features**: Custom animations, theme variables
- **Key Animations**: fadeIn, slideUp, slideInLeft, slideInRight
- **Usage**: Applied globally with Tailwind classes

#### Custom Animations
```css
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}

@keyframes slideUp {
  from { opacity: 0; transform: translateY(40px); }
  to { opacity: 1; transform: translateY(0); }
}
```

## Backend Documentation

### API Structure
```
src/app/api/
├── admin/
│   ├── auth/
│   │   └── login/
│   │       └── route.ts    # Admin authentication
│   ├── pages/
│   │   └── route.ts        # Page CRUD operations
│   ├── messages/
│   │   └── route.ts        # Message management
│   └── settings/
│       └── route.ts        # Site settings
├── chat/
│   └── send/
│       └── route.ts        # Chat with Twilio integration
└── health/
    └── route.ts            # Health check
```

### API Routes

#### Health Check (`/api/health`)
- **Method**: GET
- **Purpose**: Basic health check endpoint
- **Response**: `{ status: "ok" }`

#### Admin Authentication (`/api/admin/auth/login`)
- **Method**: POST
- **Purpose**: Admin user authentication
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

#### Page Management (`/api/admin/pages`)
- **Method**: GET
- **Purpose**: Retrieve all pages
- **Response**:
  ```json
  {
    "success": true,
    "pages": [
      {
        "id": "string",
        "title": "string",
        "slug": "string",
        "content": "string",
        "status": "PUBLISHED",
        "creator": {
          "id": "string",
          "name": "string",
          "email": "string"
        }
      }
    ]
  }
  ```

- **Method**: POST
- **Purpose**: Create new page
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

#### Message Management (`/api/admin/messages`)
- **Method**: GET
- **Purpose**: Retrieve all messages
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
        "handler": {
          "id": "string",
          "name": "string",
          "email": "string"
        }
      }
    ]
  }
  ```

- **Method**: POST
- **Purpose**: Create new message (from contact form/chat)
- **Request Body**:
  ```json
  {
    "name": "string",
    "email": "string",
    "phone": "string",
    "message": "string"
  }
  ```

#### Site Settings (`/api/admin/settings`)
- **Method**: GET
- **Purpose**: Retrieve all site settings
- **Response**:
  ```json
  {
    "success": true,
    "settings": {
      "site_title": {
        "value": "Upreak",
        "type": "STRING",
        "description": "Website title",
        "updatedAt": "2024-01-15T10:30:00Z"
      }
    }
  }
  ```

- **Method**: POST
- **Purpose**: Update site settings
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

#### Chat with Twilio (`/api/chat/send`)
- **Method**: POST
- **Purpose**: Send chat message with Twilio notifications
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

## Database Schema

### Models

#### Admin
```sql
-- Admin user model for authentication
CREATE TABLE admins (
  id TEXT PRIMARY KEY DEFAULT (cuid()),
  email TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  name TEXT NOT NULL,
  role TEXT DEFAULT 'ADMIN',
  is_active BOOLEAN DEFAULT 1,
  last_login_at DATETIME,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

#### Page
```sql
-- Page model for content management
CREATE TABLE pages (
  id TEXT PRIMARY KEY DEFAULT (cuid()),
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
-- Site settings model for global configuration
CREATE TABLE site_settings (
  id TEXT PRIMARY KEY DEFAULT (cuid()),
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
-- Chat message model for chat functionality
CREATE TABLE chat_messages (
  id TEXT PRIMARY KEY DEFAULT (cuid()),
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
-- Media model for file uploads
CREATE TABLE media (
  id TEXT PRIMARY KEY DEFAULT (cuid()),
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
```sql
-- Admin roles
CREATE TYPE role_enum AS ENUM ('ADMIN', 'SUPER_ADMIN', 'EDITOR');
```

#### PageStatus
```sql
-- Page publication status
CREATE TYPE page_status_enum AS ENUM ('DRAFT', 'PUBLISHED', 'ARCHIVED');
```

#### SettingType
```sql
-- Setting data types
CREATE TYPE setting_type_enum AS ENUM ('STRING', 'NUMBER', 'BOOLEAN', 'JSON', 'IMAGE');
```

#### MessageStatus
```sql
-- Message status
CREATE TYPE message_status_enum AS ENUM ('NEW', 'READ', 'RESPONDED', 'CLOSED');
```

## API Documentation

### Authentication

#### Admin Login
- **Endpoint**: `POST /api/admin/auth/login`
- **Description**: Authenticate admin users with bcrypt password verification
- **Request**:
  ```json
  {
    "email": "admin@upreak.com",
    "password": "admin123"
  }
  ```
- **Success Response** (200):
  ```json
  {
    "success": true,
    "message": "Login successful",
    "user": {
      "id": "1",
      "email": "admin@upreak.com",
      "name": "Super Admin",
      "role": "SUPER_ADMIN",
      "isActive": true,
      "lastLoginAt": "2024-01-15T10:30:00Z",
      "createdAt": "2024-01-15T10:30:00Z",
      "updatedAt": "2024-01-15T10:30:00Z"
    },
    "token": "admin-token-1-1705326600000"
  }
  ```
- **Error Responses**:
  - **Missing Credentials** (400):
    ```json
    {
      "error": "Email and password are required"
    }
    ```
  - **Invalid Credentials** (401):
    ```json
    {
      "error": "Invalid email or password"
    }
    ```
  - **Account Deactivated** (401):
    ```json
    {
      "error": "Account is deactivated"
    }
    ```

#### Security Features
- **Password Hashing**: Uses bcrypt with salt rounds (12)
- **Database Verification**: Checks against hashed passwords in database
- **Session Management**: Generates unique tokens for each session
- **Activity Tracking**: Updates last login timestamp on successful authentication
- **Role-Based Access**: Supports SUPER_ADMIN, ADMIN, and EDITOR roles
- **Account Status**: Verifies account activation before authentication

### Content Management

#### Get Pages
- **Endpoint**: `GET /api/admin/pages`
- **Description**: Retrieve all pages with creator information
- **Success Response** (200):
  ```json
  {
    "success": true,
    "pages": [
      {
        "id": "1",
        "title": "Homepage",
        "slug": "home",
        "content": "<h1>Welcome to Upreak</h1>",
        "status": "PUBLISHED",
        "publishedAt": "2024-01-15T10:30:00Z",
        "createdAt": "2024-01-15T10:30:00Z",
        "updatedAt": "2024-01-15T10:30:00Z",
        "creator": {
          "id": "1",
          "name": "Admin User",
          "email": "admin@example.com"
        }
      }
    ]
  }
  ```

#### Create Page
- **Endpoint**: `POST /api/admin/pages`
- **Description**: Create a new page
- **Request**:
  ```json
  {
    "title": "New Page",
    "slug": "new-page",
    "content": "<h1>New Page Content</h1>",
    "metaTitle": "New Page - Upreak",
    "metaDescription": "Description of new page",
    "status": "DRAFT",
    "createdBy": "1"
  }
  ```
- **Success Response** (201):
  ```json
  {
    "success": true,
    "page": {
      "id": "2",
      "title": "New Page",
      "slug": "new-page",
      "content": "<h1>New Page Content</h1>",
      "metaTitle": "New Page - Upreak",
      "metaDescription": "Description of new page",
      "status": "DRAFT",
      "publishedAt": null,
      "createdAt": "2024-01-15T10:30:00Z",
      "updatedAt": "2024-01-15T10:30:00Z",
      "creator": {
        "id": "1",
        "name": "Admin User",
        "email": "admin@example.com"
      }
    }
  }
  ```
- **Error Response** (400):
  ```json
  {
    "error": "Title, slug, content, and createdBy are required"
  }
  ```

#### Update Page
- **Endpoint**: `PUT /api/admin/pages`
- **Description**: Update an existing page
- **Request**:
  ```json
  {
    "id": "2",
    "title": "Updated Page Title",
    "slug": "updated-page",
    "content": "<h1>Updated Content</h1>",
    "metaTitle": "Updated Page - Upreak",
    "metaDescription": "Updated description",
    "status": "PUBLISHED"
  }
  ```
- **Success Response** (200):
  ```json
  {
    "success": true,
    "page": {
      "id": "2",
      "title": "Updated Page Title",
      "slug": "updated-page",
      "content": "<h1>Updated Content</h1>",
      "metaTitle": "Updated Page - Upreak",
      "metaDescription": "Updated description",
      "status": "PUBLISHED",
      "publishedAt": "2024-01-15T10:30:00Z",
      "createdAt": "2024-01-15T10:30:00Z",
      "updatedAt": "2024-01-15T10:35:00Z",
      "creator": {
        "id": "1",
        "name": "Admin User",
        "email": "admin@example.com"
      }
    }
  }
  ```
- **Error Response** (400):
  ```json
  {
    "error": "ID, title, slug, and content are required"
  }
  ```

#### Get Single Page
- **Endpoint**: `GET /api/admin/pages/[id]`
- **Description**: Retrieve a specific page by ID
- **Success Response** (200):
  ```json
  {
    "success": true,
    "page": {
      "id": "2",
      "title": "Updated Page Title",
      "slug": "updated-page",
      "content": "<h1>Updated Content</h1>",
      "metaTitle": "Updated Page - Upreak",
      "metaDescription": "Updated description",
      "status": "PUBLISHED",
      "publishedAt": "2024-01-15T10:30:00Z",
      "createdAt": "2024-01-15T10:30:00Z",
      "updatedAt": "2024-01-15T10:35:00Z",
      "creator": {
        "id": "1",
        "name": "Admin User",
        "email": "admin@example.com"
      }
    }
  }
  ```

#### Delete Page
- **Endpoint**: `DELETE /api/admin/pages/[id]`
- **Description**: Delete a specific page by ID
- **Success Response** (200):
  ```json
  {
    "success": true,
    "message": "Page deleted successfully"
  }
  ```

### Communication

#### Get Messages
- **Endpoint**: `GET /api/admin/messages`
- **Description**: Retrieve all chat messages
- **Query Parameters**:
  - `status` (optional): Filter by message status (NEW, READ, RESPONDED, CLOSED)
- **Success Response** (200):
  ```json
  {
    "success": true,
    "messages": [
      {
        "id": "1",
        "name": "John Doe",
        "email": "john@example.com",
        "phone": "+1234567890",
        "message": "Looking for IT recruitment services",
        "status": "NEW",
        "response": null,
        "respondedAt": null,
        "createdAt": "2024-01-15T10:30:00Z",
        "updatedAt": "2024-01-15T10:30:00Z",
        "handler": null
      }
    ]
  }
  ```

#### Create Message
- **Endpoint**: `POST /api/admin/messages`
- **Description**: Create a new message (from contact form or chat)
- **Request**:
  ```json
  {
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "+1234567890",
    "message": "I'm interested in your services"
  }
  ```
- **Success Response** (201):
  ```json
  {
    "success": true,
    "message": {
      "id": "2",
      "name": "John Doe",
      "email": "john@example.com",
      "phone": "+1234567890",
      "message": "I'm interested in your services",
      "status": "NEW",
      "createdAt": "2024-01-15T10:30:00Z",
      "updatedAt": "2024-01-15T10:30:00Z"
    }
  }
  ```

#### Send Chat with Twilio
- **Endpoint**: `POST /api/chat/send`
- **Description**: Send chat message with Twilio notifications
- **Request**:
  ```json
  {
    "name": "Jane Smith",
    "email": "jane@example.com",
    "phone": "+1234567890",
    "message": "Hello, I need help with recruitment"
  }
  ```
- **Success Response** (200):
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

### Settings

#### Get Settings
- **Endpoint**: `GET /api/admin/settings`
- **Description**: Retrieve all site settings
- **Success Response** (200):
  ```json
  {
    "success": true,
    "settings": {
      "site_title": {
        "value": "Upreak",
        "type": "STRING",
        "description": "Website title",
        "updatedAt": "2024-01-15T10:30:00Z"
      },
      "contact_email": {
        "value": "business@upreak.com",
        "type": "STRING",
        "description": "Contact email address",
        "updatedAt": "2024-01-15T10:30:00Z"
      }
    }
  }
  ```

#### Update Settings
- **Endpoint**: `POST /api/admin/settings`
- **Description**: Update site settings
- **Request**:
  ```json
  {
    "settings": {
      "site_title": {
        "value": "Upreak - Talent Solutions",
        "type": "STRING"
      },
      "contact_email": {
        "value": "contact@upreak.com",
        "type": "STRING"
      }
    },
    "updatedBy": "1"
  }
  ```
- **Success Response** (200):
  ```json
  {
    "success": true,
    "settings": [
      {
        "id": "1",
        "key": "site_title",
        "value": "Upreak - Talent Solutions",
        "description": "Website title",
        "type": "STRING",
        "createdAt": "2024-01-15T10:30:00Z",
        "updatedAt": "2024-01-15T10:30:00Z",
        "updatedBy": "1"
      }
    ]
  }
  ```

## Admin Panel

### Overview
The admin panel provides a comprehensive interface for managing website content, monitoring user interactions, and configuring site settings. It features proper authentication, page CRUD operations, and a modern user interface.

### Recent Fixes (January 2024)
The following major improvements have been implemented to enhance the admin panel functionality:

#### 1. Fixed Create New Page Functionality
- **Issue**: "New Page" buttons in the dashboard were non-functional
- **Solution**: 
  - Created dedicated page creation form at `/admin/pages/create`
  - Implemented comprehensive form with all required fields
  - Added automatic slug generation from page title
  - Integrated with backend API for proper page creation
  - Added real-time preview functionality
  - Implemented SEO optimization fields (meta title, meta description)
  - Added status management (DRAFT, PUBLISHED, ARCHIVED)

#### 2. Fixed Edit Page Functionality  
- **Issue**: Edit buttons throughout the dashboard were non-functional
- **Solution**:
  - Created dedicated page editing interface at `/admin/pages/edit/[id]`
  - Implemented pre-populated forms with existing page data
  - Added slug collision detection to prevent duplicate URLs
  - Created PUT API endpoint for updating pages
  - Added proper error handling and validation
  - Implemented save and redirect functionality
  - Added real-time preview of changes

#### 3. Implemented Proper Authentication System
- **Issue**: Demo mode allowed any credentials and lacked security
- **Solution**:
  - Replaced demo authentication with proper bcrypt password verification
  - Created database-backed admin user management
  - Implemented session management with token-based authentication
  - Added role-based access control (SUPER_ADMIN, ADMIN, EDITOR)
  - Removed demo credentials information from login interface
  - Added account activation/deactivation functionality
  - Implemented last login tracking
  - Added proper logout functionality that clears session data

#### 4. Enhanced API Endpoints
- **Page Management API** (`/api/admin/pages`):
  - GET: Retrieve all pages with creator information
  - POST: Create new pages with validation
  - PUT: Update existing pages with slug collision detection
- **Single Page API** (`/api/admin/pages/[id]`):
  - GET: Retrieve individual page data for editing
  - DELETE: Remove pages with proper cleanup
- **Authentication API** (`/api/admin/auth/login`):
  - POST: Secure login with bcrypt verification
  - Session token generation
  - User role validation

### Access
- **URL**: `/admin`
- **Login**: Requires valid admin credentials
- **Redirect**: Successful login redirects to `/admin/dashboard`

### Authentication
The admin panel now uses proper authentication with bcrypt password hashing:

#### Default Admin Credentials
- **Super Admin**: `admin@upreak.com` / `admin123`
- **Editor**: `editor@upreak.com` / `editor123`  
- **Manager**: `manager@upreak.com` / `manager123`

#### Security Features
- Password hashing with bcrypt (12 salt rounds)
- Role-based access control (SUPER_ADMIN, ADMIN, EDITOR)
- Session management with tokens
- Last login tracking
- Account activation/deactivation
- Input validation and sanitization
- Protection against brute force attacks

### Dashboard (`/admin/dashboard`)
- **Features**:
  - Real-time statistics (pages, messages, users, activity)
  - Recent pages list with functional quick actions
  - Recent messages with status indicators
  - Quick access to main features
  - Authentication checks on page load

- **Components**:
  - Statistics cards with icons
  - Recent activity tables with functional buttons
  - Quick action buttons linked to proper routes
  - Status badges and indicators
  - Navigation sidebar with active state management

- **Navigation**:
  - Dashboard: Overview and statistics
  - Pages: Page management interface
  - Messages: Contact form submissions
  - Settings: Site configuration

### Pages Management
- **Location**: Dashboard → Pages
- **Features**:
  - List all pages with status indicators
  - Create new pages with rich content editor
  - Edit existing pages with pre-populated forms
  - Delete pages with confirmation
  - Publish/unpublish pages
  - Functional buttons linked to proper routes

#### Create New Page
- **URL**: `/admin/pages/create`
- **Features**:
  - Comprehensive form with all page fields
  - Automatic slug generation from title
  - Real-time preview functionality
  - SEO optimization fields
  - Status management (DRAFT, PUBLISHED, ARCHIVED)
  - Form validation and error handling
  - Success feedback and redirect

#### Edit Existing Page
- **URL**: `/admin/pages/edit/[id]`
- **Features**:
  - Pre-populated form with existing page data
  - Content editing with preservation of formatting
  - Slug collision detection
  - SEO field management
  - Save and redirect functionality
  - Loading states and error handling
  - Data fetching from API

- **Page Fields**:
  - Title (required)
  - Slug (required, unique, auto-generated from title)
  - Content (required, supports HTML and markdown)
  - Meta Title (optional, for SEO)
  - Meta Description (optional, for SEO)
  - Status (DRAFT, PUBLISHED, ARCHIVED)
  - Created By (auto-assigned to current admin)

### Messages Management
- **Location**: Dashboard → Messages
- **Features**:
  - View all contact form submissions
  - Filter by status (NEW, READ, RESPONDED, CLOSED)
  - Respond to messages
  - Mark messages as read/unread
  - Delete messages

- **Message Fields**:
  - Name (required)
  - Email (required)
  - Phone (optional)
  - Message (required)
  - Status (auto-managed)
  - Response (optional)

### Settings Management
- **Location**: Dashboard → Settings
- **Features**:
  - General site settings
  - Logo and favicon upload
  - Contact information
  - Social media links
  - SEO settings

- **Setting Types**:
  - STRING: Text values
  - NUMBER: Numeric values
  - BOOLEAN: True/false values
  - JSON: Complex data structures
  - IMAGE: File uploads

### User Interface
- **Sidebar Navigation**:
  - Dashboard (statistics overview)
  - Pages (content management)
  - Messages (contact management)
  - Settings (configuration)

- **Header**:
  - Brand logo and title
  - Notification bell (with badge)
  - Logout button

- **Responsive Design**:
  - Mobile-friendly sidebar
  - Adaptive card layouts
  - Touch-friendly controls

## Chat System

### Overview
The chat system provides real-time communication between website visitors and the Upreak team, with AI-powered responses and Twilio integration for notifications.

### Chat Widget

#### Features
- **Real-time Chat**: Instant messaging with AI responses
- **Data Collection**: Captures user information (name, email, phone)
- **Smart Responses**: Context-aware AI replies based on user input
- **Message History**: Persistent chat sessions during browser session
- **Status Indicators**: Typing indicators, sent/delivered status
- **Customizable**: Position, colors, and messaging can be customized

#### Configuration
```typescript
interface ChatWidgetProps {
  position?: "bottom-right" | "bottom-left" | "top-right" | "top-left";
  primaryColor?: string;
  title?: string;
  subtitle?: string;
  welcomeMessage?: string;
}
```

#### Default Configuration
```typescript
{
  position: "bottom-right",
  primaryColor: "#3B82F6",
  title: "Upreak Support",
  subtitle: "We're here to help you",
  welcomeMessage: "Hello! Welcome to Upreak. How can I assist you today?"
}
```

### AI Response Logic

#### Response Categories
1. **Job-Related Queries**:
   - Keywords: "job", "career", "work", "employment"
   - Response: Information about job opportunities and application process

2. **Service-Related Queries**:
   - Keywords: "service", "recruitment", "staffing"
   - Response: Details about Upreak's service offerings

3. **Contact-Related Queries**:
   - Keywords: "contact", "phone", "email", "reach"
   - Response: Contact information and business hours

4. **Company-Related Queries**:
   - Keywords: "about", "company", "upreak"
   - Response: Company information and achievements

5. **Default Response**:
   - Generic helpful response asking for more details

#### Example Responses
```typescript
const responses = {
  job: "We offer various job opportunities across multiple industries including IT, Healthcare, Sales, and more. You can search for jobs on our website or contact our recruitment team for personalized assistance.",
  
  service: "Upreak provides comprehensive talent solutions including Permanent Placement, Professional Staffing, Payroll Outsourcing, and Train & Deploy programs. Which service are you interested in learning more about?",
  
  contact: "You can reach us at +91 79759 30773 or email us at business@upreak.com. Our team is available Monday to Friday, 9 AM to 6 PM.",
  
  company: "Upreak is a leading talent-sourcing solutions provider that combines AI, human expertise, and data analytics to deliver exceptional recruitment outcomes. We've successfully placed over 50 candidates with a 70%+ success rate.",
  
  default: "Thank you for your message! I'm here to help with any questions about our recruitment services, job opportunities, or company information. Could you please provide more details about what you're looking for?"
};
```

### Twilio Integration

#### Features
- **SMS Notifications**: Automated SMS alerts for new chat messages
- **WhatsApp Support**: WhatsApp message capabilities
- **Multi-channel**: Support for SMS, WhatsApp, and email notifications
- **Message Templates**: Pre-built templates for different scenarios

#### Implementation
```typescript
// Twilio client initialization (production)
const client = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

// SMS sending
await client.messages.create({
  body: `New message from ${name} (${email}): ${message}`,
  from: process.env.TWILIO_PHONE_NUMBER,
  to: phoneNumber
});

// WhatsApp sending
await client.messages.create({
  body: `New contact form submission from ${name}\nEmail: ${email}\nMessage: ${message}`,
  from: `whatsapp:${process.env.TWILIO_PHONE_NUMBER}`,
  to: `whatsapp:${process.env.ADMIN_WHATSAPP_NUMBER}`
});
```

#### Environment Variables
```env
TWILIO_ACCOUNT_SID=your_account_sid
TWILIO_AUTH_TOKEN=your_auth_token
TWILIO_PHONE_NUMBER=+1234567890
ADMIN_WHATSAPP_NUMBER=+1234567890
```

### Data Flow

1. **User Input**: User types message in chat widget
2. **Validation**: System validates required fields (name, email)
3. **AI Processing**: System generates context-aware response
4. **Database Storage**: Message stored in `chat_messages` table
5. **Twilio Notifications**: SMS/WhatsApp notifications sent to admin
6. **Response Display**: AI response shown to user
7. **Status Updates**: Message status updated in database

### Security Considerations
- **Input Validation**: All user inputs are validated and sanitized
- **Rate Limiting**: Chat messages are rate-limited to prevent abuse
- **Data Encryption**: Sensitive data is encrypted in transit (HTTPS)
- **Access Control**: Admin-only access to message management

## Deployment

### Development Deployment
```bash
# Start development server
npm run dev

# Access application
http://localhost:3000

# Access admin panel
http://localhost:3000/admin
```

### Production Deployment

#### Prerequisites
- Node.js 18+
- Production database (PostgreSQL recommended)
- Twilio account (for SMS/WhatsApp features)
- Domain name with SSL certificate

#### Build Process
```bash
# Install dependencies
npm install

# Build application
npm run build

# Start production server
npm start
```

#### Environment Variables (Production)
```env
# Application
NODE_ENV=production
NEXT_PUBLIC_BASE_URL=https://yourdomain.com

# Database
DATABASE_URL="postgresql://user:password@host:port/database"

# Twilio
TWILIO_ACCOUNT_SID=your_twilio_account_sid
TWILIO_AUTH_TOKEN=your_twilio_auth_token
TWILIO_PHONE_NUMBER=+1234567890
ADMIN_WHATSAPP_NUMBER=+1234567890
```

#### Deployment Platforms

##### Vercel (Recommended)
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Configure environment variables
vercel env add TWILIO_ACCOUNT_SID
vercel env add TWILIO_AUTH_TOKEN
vercel env add DATABASE_URL
```

##### Docker
```dockerfile
FROM node:18-alpine

WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production

COPY . .
RUN npm run build

EXPOSE 3000
CMD ["npm", "start"]
```

##### Traditional Server
```bash
# Build application
npm run build

# Start with PM2
npm install -g pm2
pm2 start ecosystem.config.js
```

### Database Migration
```bash
# Generate Prisma client
npx prisma generate

# Push schema to database
npx prisma db push

# View database
npx prisma studio
```

### SSL Configuration
- **Required**: HTTPS for production deployment
- **Recommendation**: Let's Encrypt for free SSL certificates
- **Configuration**: Configure in web server or hosting platform

### Monitoring and Logging
- **Application Monitoring**: Consider integrating with services like Sentry
- **Database Monitoring**: Use database-specific monitoring tools
- **Error Tracking**: Implement comprehensive error tracking
- **Performance Monitoring**: Monitor application performance metrics

## Change Log

### Version 1.0.0 (2024-01-15)

#### Initial Release
- Complete website implementation
- Admin panel with full CRUD functionality
- Chat system with AI responses
- Twilio integration for notifications
- Responsive design with modern UI

#### Pages Created
- **Homepage** (`/`): Modern landing page with company overview
- **About Us** (`/about`): Company information and success stories
- **Services** (`/services`): Service showcase and The TriadX Process
- **Jobs** (`/jobs`): Job search and board integration
- **Contact** (`/contact`): Contact form and information
- **Privacy Policy** (`/privacy-policy`): Legal documentation
- **Coming Soon** (`/coming-soon`): Sree AI launch page
- **Admin Panel** (`/admin`): Content management system

#### Features Implemented
- **Navigation System**: Smooth scrolling navigation with updated CTAs
- **Admin Authentication**: Demo authentication system
- **Content Management**: Full CRUD operations for pages
- **Chat System**: Real-time chat with AI responses
- **Notification System**: Twilio-powered SMS/WhatsApp notifications
- **Database Schema**: Complete Prisma schema with all models
- **API Endpoints**: RESTful API for all functionality
- **Responsive Design**: Mobile-first responsive design
- **Animations**: Custom CSS animations and transitions

#### Technical Stack
- **Frontend**: Next.js 15, TypeScript, React, Tailwind CSS, shadcn/ui
- **Backend**: Next.js API Routes, Prisma ORM, SQLite
- **Authentication**: Custom authentication (demo mode)
- **Communication**: Twilio integration for SMS/WhatsApp
- **Database**: SQLite (development ready for production)

#### Dependencies Added
- `bcryptjs`: Password hashing for admin authentication
- `twilio`: SMS and WhatsApp integration
- `@types/bcryptjs`: TypeScript definitions for bcryptjs

#### Configuration Files
- **Prisma Schema** (`prisma/schema.prisma`): Complete database schema
- **Tailwind Config** (`tailwind.config.ts`): Tailwind CSS configuration
- **TypeScript Config** (`tsconfig.json`): TypeScript configuration
- **Next.js Config** (`next.config.ts`): Next.js configuration

#### Database Schema
- **Admin**: User authentication and role management
- **Page**: Content management system
- **SiteSetting**: Global configuration
- **ChatMessage**: Chat data collection and storage
- **Media**: File upload management

#### API Endpoints Created
- `GET /api/health`: Health check
- `POST /api/admin/auth/login`: Admin authentication
- `GET /api/admin/pages`: Retrieve pages
- `POST /api/admin/pages`: Create page
- `GET /api/admin/messages`: Retrieve messages
- `POST /api/admin/messages`: Create message
- `GET /api/admin/settings`: Retrieve settings
- `POST /api/admin/settings`: Update settings
- `POST /api/chat/send`: Send chat with Twilio

#### Components Created
- **ChatWidget**: Real-time chat component with AI responses
- **Admin Dashboard**: Complete admin interface
- **Page Components**: All page components with responsive design
- **UI Components**: shadcn/ui components integration

#### Styles Added
- **Global Styles**: Custom animations and theme variables
- **Component Styles**: Tailwind CSS classes for all components
- **Responsive Styles**: Mobile-first responsive design
- **Animation Styles**: Custom keyframe animations

#### Security Considerations
- **Input Validation**: All user inputs validated and sanitized
- **Rate Limiting**: Protection against abuse
- **Data Encryption**: HTTPS for secure data transmission
- **Access Control**: Role-based access control

#### Performance Optimizations
- **Code Splitting**: Automatic code splitting with Next.js
- **Image Optimization**: Next.js image optimization
- **Bundle Analysis**: Optimized bundle size
- **Caching**: Efficient caching strategies

#### Known Issues
- **Twilio Integration**: Currently in demo mode (simulated)
- **File Upload**: Media upload functionality needs implementation
- **Email Templates**: Email notification system needs implementation
- **User Roles**: Advanced role management needs implementation

#### Future Enhancements
- **Real Database**: Replace SQLite with PostgreSQL for production
- **User Authentication**: Implement proper user authentication system
- **Email System**: Complete email notification system
- **File Management**: Full media management system
- **Analytics**: User analytics and tracking
- **SEO**: Advanced SEO optimization
- **Performance**: Additional performance optimizations

---

### Documentation Maintenance

This documentation will be updated with every change made to the project. All modifications, additions, and deletions will be recorded here with detailed explanations of the changes and their impact on the system.

#### How to Update Documentation
1. **New Features**: Add detailed documentation for new features
2. **API Changes**: Update API documentation with new endpoints or changes
3. **Database Changes**: Update schema documentation
4. **Configuration Changes**: Update configuration and deployment instructions
5. **Bug Fixes**: Document bug fixes and their impact

#### Documentation Standards
- **Clear and Concise**: Use clear, simple language
- **Comprehensive**: Include all necessary details
- **Up-to-Date**: Keep documentation current with codebase
- **Examples**: Provide code examples where helpful
- **Structure**: Maintain consistent structure and formatting