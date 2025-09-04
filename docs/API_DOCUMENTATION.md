# API Documentation

## Table of Contents
1. [Authentication APIs](#authentication-apis)
2. [Content Management APIs](#content-management-apis)
3. [Chat System APIs](#chat-system-apis)
4. [Admin Panel APIs](#admin-panel-apis)
5. [Error Handling](#error-handling)
6. [Rate Limiting](#rate-limiting)
7. [Authentication](#authentication-1)

---

## Authentication APIs

### POST /api/admin/auth/login

Authenticate admin users and return access token.

**Endpoint**: `POST /api/admin/auth/login`

**Description**: Admin user authentication endpoint

**Request Body**:
```json
{
  "email": "string",
  "password": "string"
}
```

**Response** (Success - 200):
```json
{
  "success": true,
  "message": "Login successful",
  "user": {
    "id": "clx1y2z3a4b5c6d7e8f9",
    "email": "admin@upreak.com",
    "name": "Admin User",
    "role": "ADMIN"
  },
  "token": "demo-token-1705324800000"
}
```

**Response** (Error - 400):
```json
{
  "error": "Email and password are required"
}
```

**Response** (Error - 500):
```json
{
  "error": "Internal server error"
}
```

**Example Usage**:
```javascript
const response = await fetch('/api/admin/auth/login', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    email: 'admin@upreak.com',
    password: 'password123'
  }),
});

const data = await response.json();
```

---

## Content Management APIs

### GET /api/admin/pages

Retrieve all pages from the database.

**Endpoint**: `GET /api/admin/pages`

**Description**: Get all pages with creator information

**Query Parameters**:
- None

**Response** (Success - 200):
```json
{
  "success": true,
  "pages": [
    {
      "id": "clx1y2z3a4b5c6d7e8f9",
      "slug": "home",
      "title": "Homepage",
      "content": "<html>Page content here</html>",
      "metaTitle": "Upreak - Talent-Sourcing Solutions",
      "metaDescription": "Preferred Recruitment Business Partner...",
      "status": "PUBLISHED",
      "publishedAt": "2024-01-15T10:30:00.000Z",
      "createdAt": "2024-01-15T10:30:00.000Z",
      "updatedAt": "2024-01-15T10:30:00.000Z",
      "creator": {
        "id": "clx1y2z3a4b5c6d7e8f9",
        "name": "Admin User",
        "email": "admin@upreak.com"
      }
    }
  ]
}
```

**Response** (Error - 500):
```json
{
  "error": "Failed to fetch pages"
}
```

**Example Usage**:
```javascript
const response = await fetch('/api/admin/pages');
const data = await response.json();
const pages = data.pages;
```

### POST /api/admin/pages

Create a new page in the database.

**Endpoint**: `POST /api/admin/pages`

**Description**: Create a new page with the provided data

**Request Body**:
```json
{
  "title": "About Us",
  "slug": "about",
  "content": "<html>About page content</html>",
  "metaTitle": "About Us - Upreak",
  "metaDescription": "Learn more about Upreak company...",
  "status": "PUBLISHED",
  "createdBy": "clx1y2z3a4b5c6d7e8f9"
}
```

**Response** (Success - 201):
```json
{
  "success": true,
  "page": {
    "id": "clx1y2z3a4b5c6d7e8f9",
    "slug": "about",
    "title": "About Us",
    "content": "<html>About page content</html>",
    "metaTitle": "About Us - Upreak",
    "metaDescription": "Learn more about Upreak company...",
    "status": "PUBLISHED",
    "publishedAt": "2024-01-15T10:30:00.000Z",
    "createdAt": "2024-01-15T10:30:00.000Z",
    "updatedAt": "2024-01-15T10:30:00.000Z",
    "creator": {
      "id": "clx1y2z3a4b5c6d7e8f9",
      "name": "Admin User",
      "email": "admin@upreak.com"
    }
  }
}
```

**Response** (Error - 400):
```json
{
  "error": "Title, slug, content, and createdBy are required"
}
```

**Response** (Error - 400):
```json
{
  "error": "Page with this slug already exists"
}
```

**Response** (Error - 500):
```json
{
  "error": "Failed to create page"
}
```

**Example Usage**:
```javascript
const response = await fetch('/api/admin/pages', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    title: 'About Us',
    slug: 'about',
    content: '<html>About page content</html>',
    metaTitle: 'About Us - Upreak',
    metaDescription: 'Learn more about Upreak company...',
    status: 'PUBLISHED',
    createdBy: 'clx1y2z3a4b5c6d7e8f9'
  }),
});

const data = await response.json();
```

### GET /api/admin/messages

Retrieve all chat messages from the database.

**Endpoint**: `GET /api/admin/messages`

**Description**: Get all messages with optional status filtering

**Query Parameters**:
- `status` (optional): Filter by message status (NEW, READ, RESPONDED, CLOSED)

**Response** (Success - 200):
```json
{
  "success": true,
  "messages": [
    {
      "id": "clx1y2z3a4b5c6d7e8f9",
      "name": "John Doe",
      "email": "john@example.com",
      "phone": "+1234567890",
      "message": "I'm interested in your services",
      "status": "NEW",
      "response": null,
      "respondedAt": null,
      "createdAt": "2024-01-15T10:30:00.000Z",
      "updatedAt": "2024-01-15T10:30:00.000Z",
      "handledBy": null,
      "handler": null
    }
  ]
}
```

**Response** (Error - 500):
```json
{
  "error": "Failed to fetch messages"
}
```

**Example Usage**:
```javascript
// Get all messages
const response = await fetch('/api/admin/messages');
const data = await response.json();
const messages = data.messages;

// Get only new messages
const responseNew = await fetch('/api/admin/messages?status=NEW');
const dataNew = await responseNew.json();
const newMessages = dataNew.messages;
```

### POST /api/admin/messages

Create a new message from contact form submission.

**Endpoint**: `POST /api/admin/messages`

**Description**: Create a new message from contact form

**Request Body**:
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "+1234567890",
  "message": "I'm interested in your recruitment services"
}
```

**Response** (Success - 201):
```json
{
  "success": true,
  "message": {
    "id": "clx1y2z3a4b5c6d7e8f9",
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "+1234567890",
    "message": "I'm interested in your recruitment services",
    "status": "NEW",
    "createdAt": "2024-01-15T10:30:00.000Z",
    "updatedAt": "2024-01-15T10:30:00.000Z"
  }
}
```

**Response** (Error - 400):
```json
{
  "error": "Name, email, and message are required"
}
```

**Response** (Error - 500):
```json
{
  "error": "Failed to create message"
}
```

**Example Usage**:
```javascript
const response = await fetch('/api/admin/messages', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    name: 'John Doe',
    email: 'john@example.com',
    phone: '+1234567890',
    message: 'I\'m interested in your recruitment services'
  }),
});

const data = await response.json();
```

### GET /api/admin/settings

Retrieve all site settings.

**Endpoint**: `GET /api/admin/settings`

**Description**: Get all site settings as key-value pairs

**Query Parameters**:
- None

**Response** (Success - 200):
```json
{
  "success": true,
  "settings": {
    "site_title": {
      "value": "Upreak",
      "type": "STRING",
      "description": "Website title",
      "updatedAt": "2024-01-15T10:30:00.000Z"
    },
    "site_description": {
      "value": "Talent-Sourcing Solutions Partnering to Deliver Exceptional Talent",
      "type": "STRING",
      "description": "Website description",
      "updatedAt": "2024-01-15T10:30:00.000Z"
    },
    "contact_email": {
      "value": "business@upreak.com",
      "type": "STRING",
      "description": "Contact email address",
      "updatedAt": "2024-01-15T10:30:00.000Z"
    },
    "contact_phone": {
      "value": "+91 79759 30773",
      "type": "STRING",
      "description": "Contact phone number",
      "updatedAt": "2024-01-15T10:30:00.000Z"
    }
  }
}
```

**Response** (Error - 500):
```json
{
  "error": "Failed to fetch settings"
}
```

**Example Usage**:
```javascript
const response = await fetch('/api/admin/settings');
const data = await response.json();
const settings = data.settings;
```

### POST /api/admin/settings

Update site settings.

**Endpoint**: `POST /api/admin/settings`

**Description**: Update multiple site settings

**Request Body**:
```json
{
  "settings": {
    "site_title": {
      "value": "Upreak Recruitment",
      "type": "STRING"
    },
    "contact_email": {
      "value": "new-email@upreak.com",
      "type": "STRING"
    },
    "contact_phone": {
      "value": "+91 9876543210",
      "type": "STRING"
    }
  },
  "updatedBy": "clx1y2z3a4b5c6d7e8f9"
}
```

**Response** (Success - 200):
```json
{
  "success": true,
  "settings": [
    {
      "id": "clx1y2z3a4b5c6d7e8f9",
      "key": "site_title",
      "value": "Upreak Recruitment",
      "type": "STRING",
      "description": "Website title",
      "createdAt": "2024-01-15T10:30:00.000Z",
      "updatedAt": "2024-01-15T10:30:00.000Z",
      "updatedBy": "clx1y2z3a4b5c6d7e8f9"
    },
    {
      "id": "clx1y2z3a4b5c6d7e8f9",
      "key": "contact_email",
      "value": "new-email@upreak.com",
      "type": "STRING",
      "description": "Contact email address",
      "createdAt": "2024-01-15T10:30:00.000Z",
      "updatedAt": "2024-01-15T10:30:00.000Z",
      "updatedBy": "clx1y2z3a4b5c6d7e8f9"
    }
  ]
}
```

**Response** (Error - 400):
```json
{
  "error": "Settings and updatedBy are required"
}
```

**Response** (Error - 500):
```json
{
  "error": "Failed to update settings"
}
```

**Example Usage**:
```javascript
const response = await fetch('/api/admin/settings', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    settings: {
      site_title: {
        value: 'Upreak Recruitment',
        type: 'STRING'
      },
      contact_email: {
        value: 'new-email@upreak.com',
        type: 'STRING'
      }
    },
    updatedBy: 'clx1y2z3a4b5c6d7e8f9'
  }),
});

const data = await response.json();
```

---

## Chat System APIs

### POST /api/chat/send

Send chat message with Twilio notifications.

**Endpoint**: `POST /api/chat/send`

**Description**: Send chat message and trigger Twilio notifications

**Request Body**:
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "+1234567890",
  "message": "I'm interested in your services"
}
```

**Response** (Success - 200):
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

**Response** (Error - 400):
```json
{
  "error": "Name, email, and message are required"
}
```

**Response** (Error - 500):
```json
{
  "error": "Failed to send message"
}
```

**Example Usage**:
```javascript
const response = await fetch('/api/chat/send', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    name: 'John Doe',
    email: 'john@example.com',
    phone: '+1234567890',
    message: 'I\'m interested in your services'
  }),
});

const data = await response.json();
```

---

## Admin Panel APIs

### Health Check

### GET /api/health

Check API health status.

**Endpoint**: `GET /api/health`

**Description**: Health check endpoint for monitoring

**Response** (Success - 200):
```json
{
  "status": "healthy",
  "timestamp": "2024-01-15T10:30:00.000Z",
  "version": "1.0.0"
}
```

**Example Usage**:
```javascript
const response = await fetch('/api/health');
const data = await response.json();
console.log(data.status); // "healthy"
```

---

## Error Handling

### Standard Error Response Format

All API endpoints return errors in a consistent format:

```json
{
  "error": "Error message describing what went wrong",
  "code": "ERROR_CODE", // Optional error code
  "details": {} // Optional error details
}
```

### Common Error Codes

| HTTP Status | Error Code | Description |
|-------------|-------------|-------------|
| 400 | BAD_REQUEST | Invalid request parameters |
| 401 | UNAUTHORIZED | Authentication required |
| 403 | FORBIDDEN | Insufficient permissions |
| 404 | NOT_FOUND | Resource not found |
| 422 | VALIDATION_ERROR | Request validation failed |
| 429 | RATE_LIMITED | Too many requests |
| 500 | INTERNAL_ERROR | Server internal error |

### Error Examples

#### Validation Error (422)
```json
{
  "error": "Validation failed",
  "code": "VALIDATION_ERROR",
  "details": {
    "email": "Email is required",
    "password": "Password must be at least 8 characters"
  }
}
```

#### Authentication Error (401)
```json
{
  "error": "Authentication required",
  "code": "UNAUTHORIZED"
}
```

#### Not Found Error (404)
```json
{
  "error": "Page not found",
  "code": "NOT_FOUND"
}
```

---

## Rate Limiting

### Current Implementation

Rate limiting is not currently implemented but should be added in production. Recommended limits:

- **Authentication endpoints**: 5 requests per minute
- **Chat endpoints**: 10 requests per minute
- **Content management endpoints**: 100 requests per hour
- **General endpoints**: 1000 requests per hour

### Future Implementation

```javascript
// Example rate limiting middleware
import rateLimit from 'express-rate-limit';

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: {
    error: "Too many requests",
    code": "RATE_LIMITED"
  }
});

app.use('/api/', limiter);
```

---

## Authentication

### Current Implementation

The current implementation uses a simple demo authentication system:

1. **Login**: Any email/password combination is accepted
2. **Token Generation**: Simple demo token is generated
3. **Session Management**: No real session management (demo mode)

### Production Implementation

For production, implement proper authentication:

```javascript
// JWT Token Implementation
import jwt from 'jsonwebtoken';

// Generate JWT token
const token = jwt.sign(
  { userId: user.id, email: user.email, role: user.role },
  process.env.JWT_SECRET,
  { expiresIn: '24h' }
);

// Verify JWT token
const decoded = jwt.verify(token, process.env.JWT_SECRET);
```

### Authentication Middleware

```javascript
// Middleware for protected routes
function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: "Authentication required" });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ error: "Invalid token" });
    }
    req.user = user;
    next();
  });
}
```

### Security Best Practices

1. **Environment Variables**: Store secrets in environment variables
2. **HTTPS**: Always use HTTPS in production
3. **Token Expiration**: Set reasonable token expiration times
4. **Password Hashing**: Use bcrypt for password hashing
5. **Rate Limiting**: Implement rate limiting on authentication endpoints
6. **Input Validation**: Validate all input parameters
7. **SQL Injection**: Use parameterized queries (Prisma handles this)

---

## API Versioning

### Current Version

All current APIs are version 1.0.0.

### Future Versioning

Future API changes should follow semantic versioning:

- **MAJOR version**: Incompatible changes
- **MINOR version**: Added functionality in a backward compatible manner
- **PATCH version**: Backward compatible bug fixes

### Versioning Strategy

```javascript
// URL-based versioning
GET /api/v1/admin/pages
GET /api/v2/admin/pages

// Header-based versioning
GET /api/admin/pages
Headers: {
  "Accept-Version": "v1"
}
```

---

## Testing

### API Testing

All endpoints should be tested with:

1. **Unit Tests**: Test individual functions
2. **Integration Tests**: Test API endpoints
3. **End-to-End Tests**: Test complete workflows

### Example Test Cases

```javascript
// Example test for login endpoint
describe('POST /api/admin/auth/login', () => {
  it('should authenticate with valid credentials', async () => {
    const response = await request(app)
      .post('/api/admin/auth/login')
      .send({
        email: 'admin@upreak.com',
        password: 'password123'
      });
    
    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.token).toBeDefined();
  });

  it('should reject invalid credentials', async () => {
    const response = await request(app)
      .post('/api/admin/auth/login')
      .send({
        email: 'invalid@example.com',
        password: 'invalid'
      });
    
    expect(response.status).toBe(500);
  });
});
```

---

## Monitoring

### Logging

Implement comprehensive logging:

```javascript
// Example logging middleware
const morgan = require('morgan');
const { createLogger, format, transports } = require('winston');

const logger = createLogger({
  level: 'info',
  format: format.combine(
    format.timestamp(),
    format.errors({ stack: true }),
    format.json()
  ),
  transports: [
    new transports.File({ filename: 'error.log', level: 'error' }),
    new transports.File({ filename: 'combined.log' })
  ]
});

// Log API requests
app.use((req, res, next) => {
  logger.info(`${req.method} ${req.path}`, {
    ip: req.ip,
    userAgent: req.get('User-Agent'),
    timestamp: new Date().toISOString()
  });
  next();
});
```

### Metrics

Track important metrics:

- **Response Times**: API response times
- **Error Rates**: Error percentages
- **Request Volume**: Number of requests per endpoint
- **Database Performance**: Query execution times
- **Twilio API**: Success/failure rates

---

*Last Updated: January 15, 2024*
*Version: 1.0.0*