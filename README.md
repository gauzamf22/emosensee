# EmoSense - Mental Health Companion Platform

## 📋 Table of Contents
- [Overview](#overview)
- [Architecture](#architecture)
- [Technology Stack](#technology-stack)
- [System Components](#system-components)
- [AI Integration](#ai-integration)
- [Database Schema](#database-schema)
- [Local Development Setup](#local-development-setup)
- [Feature Workflows](#feature-workflows)
- [API Documentation](#api-documentation)
- [Deployment](#deployment)

---

## Overview

**EmoSense** is a comprehensive mental health companion platform that combines AI-powered counseling, mood tracking, journaling, and community support. The platform provides personalized mental health insights and connects users with nearby mental health facilities.

### Key Features
- 🤖 **AI Counselor**: Real-time chat with emotion-aware AI counselor
- 📊 **Mood Tracking**: Daily mood logging with trend analysis
- 📝 **Journaling**: Secure personal journaling with AI-powered insights
- 🗺️ **Facility Finder**: Geolocation-based mental health facility discovery
- 🚨 **Emergency Support**: Quick access to crisis hotlines
- 👥 **Community**: Mental health resources and support groups
- 🌐 **Multilingual**: Support for Indonesian and English

---

## Architecture

### High-Level Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                         CLIENT LAYER                             │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │  React SPA (Vite + TypeScript)                           │   │
│  │  - State Management: React Hooks                         │   │
│  │  - Routing: React Router v7                              │   │
│  │  - UI: Tailwind CSS + Radix UI + Motion                  │   │
│  │  - Auth: JWT Token (localStorage)                        │   │
│  └──────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
                              ↕ HTTPS/REST API
┌─────────────────────────────────────────────────────────────────┐
│                       BACKEND LAYER                              │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │  Express.js API Server (Node.js)                         │   │
│  │  - Authentication Middleware (JWT)                       │   │
│  │  - RESTful API Endpoints                                 │   │
│  │  - Error Handling & Logging                              │   │
│  │  - CORS & Security (Helmet)                              │   │
│  └──────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
                    ↕                              ↕
        ┌───────────────────┐          ┌──────────────────────┐
        │  DATABASE LAYER   │          │     AI LAYER         │
        │                   │          │                      │
        │  Supabase         │          │  Hugging Face        │
        │  (PostgreSQL)     │          │  Gradio Space        │
        │                   │          │                      │
        │  - Users          │          │  - Chat API          │
        │  - Moods          │          │  - Text Analysis     │
        │  - Journals       │          │  - Memory Context    │
        │  - Chat Sessions  │          │  - Emotion Detection │
        │  - Facilities     │          │                      │
        └───────────────────┘          └──────────────────────┘
```

### Component Architecture

```
Frontend (React)
├── src/
│   ├── app/                    # Main application components
│   │   ├── App.tsx            # Root component with routing
│   │   ├── Auth.tsx           # Authentication UI
│   │   ├── Home.tsx           # Dashboard/Home page
│   │   ├── AiChat.tsx         # AI Counselor chat interface
│   │   ├── Journaling.tsx     # Journal management
│   │   ├── Profile.tsx        # User profile
│   │   ├── Settings.tsx       # App settings
│   │   └── ...
│   ├── services/              # API integration layer
│   │   ├── api.ts            # Axios client + interceptors
│   │   ├── auth.ts           # Authentication service
│   │   ├── aiService.ts      # AI chat & analysis
│   │   ├── facilities.ts     # Facility search
│   │   └── ...
│   ├── config/               # Configuration
│   │   └── api.ts           # API endpoints
│   ├── translations/         # i18n support
│   └── components/           # Reusable UI components

Backend (Express.js)
├── src/
│   ├── app.js                # Express app setup
│   ├── routes/               # API route definitions
│   │   ├── index.js         # Route aggregator
│   │   ├── authRoutes.js    # /api/auth/*
│   │   ├── aiRoutes.js      # /api/ai/*
│   │   ├── moodRoutes.js    # /api/moods/*
│   │   ├── journalRoutes.js # /api/journals/*
│   │   └── ...
│   ├── controllers/          # Request handlers
│   │   ├── authController.js
│   │   ├── aiController.js
│   │   └── ...
│   ├── services/            # Business logic
│   │   └── aiService.js    # Gradio AI integration
│   ├── middlewares/         # Express middlewares
│   │   ├── authMiddleware.js  # JWT verification
│   │   └── errorHandler.js    # Global error handler
│   └── config/              # Configuration
│       └── supabase.js     # Supabase client
```

---

## Technology Stack

### Frontend
| Technology | Version | Purpose |
|------------|---------|---------|
| React | 18.3.1 | UI framework |
| TypeScript | Latest | Type safety |
| Vite | 6.3.5 | Build tool & dev server |
| React Router | 7.13.0 | Client-side routing |
| Tailwind CSS | 4.1.12 | Styling framework |
| Radix UI | Latest | Accessible UI components |
| Motion | 12.23.24 | Animations |
| Axios | 1.16.1 | HTTP client |
| Lucide React | 0.487.0 | Icon library |

### Backend
| Technology | Version | Purpose |
|------------|---------|---------|
| Node.js | 18+ | Runtime environment |
| Express.js | 5.2.1 | Web framework |
| Supabase JS | 2.105.4 | Database client |
| @gradio/client | 2.2.0 | AI model integration |
| Helmet | 8.1.0 | Security headers |
| CORS | 2.8.6 | Cross-origin requests |
| Morgan | 1.10.1 | HTTP logging |

### Database & Services
- **Supabase (PostgreSQL)**: Primary database
- **Hugging Face Gradio**: AI model hosting
- **JWT**: Authentication tokens

---

## System Components

### 1. Authentication System

**Flow:**
```
User Login → Backend validates credentials → Supabase query
→ Generate JWT token → Return token + user data
→ Frontend stores in localStorage → Add to all API requests
```

**Implementation:**
- **Frontend**: `src/services/auth.ts` - Token management
- **Backend**: `src/middlewares/authMiddleware.js` - JWT verification
- **Storage**: localStorage keys: `auth_token`, `auth_user`

### 2. AI Counselor System

**Architecture:**
```
User Message → Frontend (AiChat.tsx)
    ↓
API Request: POST /api/ai/chat
    ↓
Backend (aiController.js)
    ↓
1. Fetch today's memory from Supabase (chat_sessions table)
2. Call Gradio AI with message + memory context
    ↓
Gradio AI Processing
    ↓
3. Receive: counselor_reply + analytics + updated_memory
4. Save to Supabase (upsert chat_sessions)
    ↓
Return response to frontend
    ↓
Display in chat UI + Show analytics
```

**Memory Management:**
- **Storage**: `chat_sessions` table in Supabase
- **Key**: `(user_id, chat_date)` - unique per user per day
- **Refresh**: Automatic daily reset (new date = new session)
- **Format**: JSON object with conversation history

**AI Service Integration:**
```javascript
// Backend: src/services/aiService.js
const connectToAI = async () => {
  const { Client } = await import("@gradio/client");
  return await Client.connect(process.env.HF_SPACE_URL);
};

const getChatResponse = async (message, memoryData) => {
  const client = await connectToAI();
  const result = await client.predict("/api_chat", { 
    text: message, 
    memory_json: JSON.stringify(memoryData || {})
  });
  return {
    counselorReply: result.counselor_reply,
    analytics: result.analytics,
    updatedMemory: result.updated_memory
  };
};
```

### 3. Mood Tracking System

**Flow:**
```
User logs mood → POST /api/moods
→ Save to moods table with timestamp
→ Frontend fetches 7-day trend → GET /api/moods?start_date&end_date
→ Display mood calendar + trend chart
```

**Data Structure:**
```typescript
interface Mood {
  id: string;
  user_id: string;
  mood: 'happy' | 'neutral' | 'sad' | 'anxious' | 'angry';
  note?: string;
  created_at: timestamp;
}
```

### 4. Journaling System

**Features:**
- Create, read, update, delete journals
- AI-powered sentiment analysis
- Daily insights generation

**Flow:**
```
User writes journal → POST /api/journals
→ Optional: Analyze text → POST /api/ai/analyze
→ Save journal + analytics
→ Generate daily insight → GET /api/ai/insight
```

### 5. Facility Finder

**Geolocation-based search:**
```
User location (lat, lng) → GET /api/facilities?lat=X&lng=Y&radius=Z
→ Query Supabase with PostGIS
→ Return nearby mental health facilities
→ Display on map with directions
```

---

## AI Integration

### Gradio AI Model

**Connection:**
- **Platform**: Hugging Face Spaces
- **Protocol**: Gradio Client API
- **Model Type**: Custom mental health counselor

**Endpoints:**
1. `/api_chat` - Conversational AI with memory
2. `/gradio_analyze_only` - Text sentiment analysis

**Request Format:**
```json
{
  "text": "User message",
  "memory_json": "{\"conversation_history\": [...]}"
}
```

**Response Format:**
```json
{
  "counselor_reply": "AI response text",
  "analytics": {
    "emotions": [{"label": "happy", "score": 0.8}],
    "keywords": [{"keyword": "stress", "score": 0.6}],
    "severity": "medium",
    "severity_score": 0.5
  },
  "updated_memory": {
    "conversation_history": [
      {
        "user_message": "...",
        "counselor_reply": "..."
      }
    ]
  }
}
```

### Memory Context System

**Purpose**: Maintain conversation continuity within a day

**Storage Strategy:**
- **Table**: `chat_sessions`
- **Primary Key**: `(user_id, chat_date)`
- **Memory Field**: `memory_data` (JSONB)
- **Reset**: Automatic at midnight (new date)

**Workflow:**
1. User sends message
2. Backend fetches today's memory
3. AI processes with context
4. Backend saves updated memory
5. Next message uses updated context

---

## Database Schema

### Core Tables

**users**
```sql
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email VARCHAR(255) UNIQUE NOT NULL,
  username VARCHAR(100) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

**moods**
```sql
CREATE TABLE moods (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  mood VARCHAR(20) NOT NULL,
  note TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);
CREATE INDEX idx_moods_user_date ON moods(user_id, created_at);
```

**journals**
```sql
CREATE TABLE journals (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  analytics JSONB,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

**chat_sessions**
```sql
CREATE TABLE chat_sessions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  chat_date DATE NOT NULL,
  last_message TEXT,
  memory_data JSONB,
  analysis_data JSONB,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(user_id, chat_date)
);
```

**facilities**
```sql
CREATE TABLE facilities (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL,
  type VARCHAR(100),
  address TEXT,
  phone VARCHAR(50),
  latitude DECIMAL(10, 8),
  longitude DECIMAL(11, 8),
  created_at TIMESTAMP DEFAULT NOW()
);
CREATE INDEX idx_facilities_location ON facilities(latitude, longitude);
```

---

## Local Development Setup

### Prerequisites
- **Node.js**: v18 or higher
- **pnpm**: v8 or higher (recommended) or npm
- **Supabase Account**: For database
- **Hugging Face Account**: For AI model access

### Step 1: Clone Repository
```bash
git clone <repository-url>
cd emosensee
```

### Step 2: Frontend Setup

```bash
# Install dependencies
pnpm install

# Create .env file
cat > .env << EOF
VITE_API_BASE_URL=http://localhost:5000
VITE_APP_URL=http://localhost:5174
EOF

# Start development server
pnpm run dev
```

Frontend will run on: `http://localhost:5174`

### Step 3: Backend Setup

```bash
cd backend

# Install dependencies
npm install

# Create .env file
cat > .env << EOF
PORT=5000
SUPABASE_URL=your_supabase_project_url
SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
HF_SPACE_URL=your_huggingface_space_url
BASE_URL=http://localhost:5000
FRONTEND_URL=http://localhost:5174
EOF

# Start backend server
npm run dev
```

Backend will run on: `http://localhost:5000`

### Step 4: Database Setup

1. **Create Supabase Project**
   - Go to https://supabase.com
   - Create new project
   - Copy project URL and API keys

2. **Run Migrations**
   ```bash
   cd backend
   node migrations/create_tables.js
   ```

3. **Verify Tables**
   ```bash
   node verify_table.js
   ```

### Step 5: AI Model Setup

1. **Deploy Gradio Model to Hugging Face Spaces**
   - Create a Hugging Face account
   - Deploy your mental health counselor model
   - Copy the Space URL

2. **Update Backend .env**
   ```bash
   HF_SPACE_URL=https://your-username-your-space.hf.space
   ```

### Required API Keys

| Service | Key Name | Where to Get | Purpose |
|---------|----------|--------------|---------|
| Supabase | SUPABASE_URL | Supabase Dashboard → Settings → API | Database connection |
| Supabase | SUPABASE_ANON_KEY | Supabase Dashboard → Settings → API | Client-side queries |
| Supabase | SUPABASE_SERVICE_ROLE_KEY | Supabase Dashboard → Settings → API | Server-side admin queries |
| Hugging Face | HF_SPACE_URL | Hugging Face Spaces | AI model endpoint |

---

## Feature Workflows

### 1. Application Initialization (Lazy Loading)

```
App Start → Splash Screen (2s animation)
    ↓
Check localStorage: splash_done?
    ↓ No
Show Onboarding (3 slides)
    ↓
Set splash_done = true
    ↓ Yes
Check localStorage: auth_token?
    ↓ No
Show Auth Screen (Login/Register)
    ↓ Yes
Verify token with backend
    ↓ Valid
Load user session
    ↓
Fetch initial data:
  - User profile
  - Today's mood
  - 7-day mood trend
  - Daily AI insight
    ↓
Render Main App (Home page)
```

**Implementation:**
- `App.tsx:220-240` - Splash screen logic
- `App.tsx:242-260` - Onboarding logic
- `App.tsx:262-310` - Auth check & session load

### 2. User Authentication Flow

**Registration:**
```
User fills form → Validate input
    ↓
POST /api/auth/register
    ↓
Backend: Hash password → Save to Supabase
    ↓
Generate JWT token
    ↓
Return { token, user }
    ↓
Frontend: Save to localStorage
    ↓
Redirect to Home
```

**Login:**
```
User enters credentials
    ↓
POST /api/auth/login
    ↓
Backend: Verify password → Query Supabase
    ↓
Generate JWT token
    ↓
Return { token, user }
    ↓
Frontend: Save to localStorage
    ↓
Redirect to Home
```

**Auto-login:**
```
App loads → Check localStorage.auth_token
    ↓ Exists
Add to axios interceptor headers
    ↓
All API requests include: Authorization: Bearer <token>
    ↓ 401 Response
Clear localStorage → Redirect to /auth
```

### 3. AI Chat Workflow

**Sending Message:**
```
User types message → Click send
    ↓
AiChat.tsx:162 - send() function
    ↓
1. Add user message to UI (optimistic update)
2. Show loading indicator
    ↓
POST /api/ai/chat
Body: { message, language }
    ↓
Backend: aiController.chatWithAI()
    ↓
1. Extract user_id from JWT
2. Get today's date (YYYY-MM-DD)
3. Query chat_sessions for existing memory
    ↓
aiService.getChatResponse(message, memory)
    ↓
Gradio AI processes:
  - Analyze emotions
  - Generate empathetic response
  - Update conversation memory
    ↓
Backend saves to chat_sessions:
  - Upsert (user_id, chat_date)
  - Update memory_data
  - Update analysis_data
    ↓
Return { reply, analytics }
    ↓
Frontend: AiChat.tsx:174
  - Add bot message to UI
  - Hide loading indicator
  - Show notification
```

**Loading Chat History:**
```
AiChat.tsx mounts → useEffect (line 51)
    ↓
GET /api/ai/memory
    ↓
Backend: aiController.getMemory()
    ↓
Query chat_sessions:
  WHERE user_id = ? AND chat_date = today
    ↓
Return memory_data.conversation_history
    ↓
Frontend transforms to UI format:
  [
    { id: 0, from: "user", text: "..." },
    { id: 1, from: "bot", text: "..." },
    ...
  ]
    ↓
Render chat history
```

**Daily Reset:**
- Memory is keyed by `(user_id, chat_date)`
- New day = new chat_date = empty memory
- Previous days' data remains in database
- No manual reset needed

### 4. Mood Tracking Workflow

```
User clicks mood emoji on Home page
    ↓
App.tsx:450 - handleMoodSelect()
    ↓
POST /api/moods
Body: { mood: "happy", note: "..." }
    ↓
Backend saves to moods table
    ↓
Frontend refreshes mood data:
  - Update today's mood in calendar
  - Recalculate 7-day trend
  - Update mood distribution chart
    ↓
Show success notification
```

### 5. Journaling Workflow

**Create Journal:**
```
User navigates to Journey tab
    ↓
Click "New Journal"
    ↓
Fill title + description
    ↓
POST /api/journals
    ↓
Backend saves to journals table
    ↓
Optional: Analyze sentiment
  POST /api/ai/analyze
    ↓
Return to journal list
```

**View Daily Insight:**
```
Home page loads
    ↓
GET /api/ai/insight
    ↓
Backend aggregates:
  - Today's chat messages
  - Today's journals
  - Today's mood logs
    ↓
Generate AI summary
    ↓
Display insight card on Home
```

### 6. Settings Workflow

```
User clicks Profile → Settings
    ↓
App.tsx:sub = "settings"
    ↓
Render Settings.tsx
    ↓
Available options:
  - Language (ID/EN)
  - Notifications
  - Theme (future)
  - Account management
    ↓
Changes saved to:
  - localStorage (preferences)
  - Backend API (account data)
```

### 7. Facility Finder Workflow

```
User clicks Support → Nearby Facilities
    ↓
Request geolocation permission
    ↓
Get user coordinates (lat, lng)
    ↓
GET /api/facilities?lat=X&lng=Y&radius=5000
    ↓
Backend queries with PostGIS:
  Calculate distance from user location
  Filter by radius
  Sort by distance
    ↓
Display facilities on map
    ↓
User clicks facility → Show details + directions
```

---

## API Documentation

### Authentication Endpoints

**POST /api/auth/register**
```json
Request:
{
  "email": "user@example.com",
  "username": "johndoe",
  "password": "securepassword"
}

Response:
{
  "success": true,
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIs...",
    "user": {
      "id": "uuid",
      "email": "user@example.com",
      "username": "johndoe"
    }
  }
}
```

**POST /api/auth/login**
```json
Request:
{
  "email": "user@example.com",
  "password": "securepassword"
}

Response:
{
  "success": true,
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIs...",
    "user": { ... }
  }
}
```

### AI Endpoints (Requires Auth)

**POST /api/ai/chat**
```json
Request:
{
  "message": "I'm feeling anxious today",
  "language": "en-US"
}

Response:
{
  "success": true,
  "data": {
    "reply": "I understand you're feeling anxious...",
    "analytics": {
      "emotions": [
        {"label": "anxious", "score": 0.85},
        {"label": "worried", "score": 0.62}
      ],
      "keywords": [
        {"keyword": "anxious", "score": 0.9}
      ],
      "severity": "medium",
      "severity_score": 0.6
    }
  }
}
```

**GET /api/ai/memory**
```json
Response:
{
  "success": true,
  "data": {
    "conversation_history": [
      {
        "user_message": "Hello",
        "counselor_reply": "Hi! How are you?"
      }
    ],
    "lastUpdated": "2026-05-28T10:30:00Z"
  }
}
```

**POST /api/ai/analyze**
```json
Request:
{
  "text": "I had a great day today!"
}

Response:
{
  "success": true,
  "data": {
    "emotions": [...],
    "keywords": [...],
    "severity": "low"
  }
}
```

**GET /api/ai/insight**
```json
Response:
{
  "success": true,
  "data": {
    "summary": "Today you expressed...",
    "mood_trend": "positive",
    "recommendations": [...]
  }
}
```

### Mood Endpoints (Requires Auth)

**POST /api/moods**
```json
Request:
{
  "mood": "happy",
  "note": "Had a productive day"
}

Response:
{
  "success": true,
  "data": {
    "id": "uuid",
    "mood": "happy",
    "created_at": "2026-05-28T10:00:00Z"
  }
}
```

**GET /api/moods?start_date=2026-05-21&end_date=2026-05-28**
```json
Response:
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "mood": "happy",
      "note": "...",
      "created_at": "2026-05-28T10:00:00Z"
    }
  ]
}
```

### Journal Endpoints (Requires Auth)

**POST /api/journals**
**GET /api/journals**
**PUT /api/journals/:id**
**DELETE /api/journals/:id**

### Facility Endpoints

**GET /api/facilities?lat=-6.2088&lng=106.8456&radius=5000**
```json
Response:
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "name": "Mental Health Clinic",
      "type": "clinic",
      "address": "123 Main St",
      "phone": "+62-21-1234567",
      "latitude": -6.2088,
      "longitude": 106.8456,
      "distance": 1250
    }
  ]
}
```

---

## Deployment

### Frontend Deployment (Vercel)

```bash
# Build production bundle
pnpm run build

# Deploy to Vercel
vercel --prod

# Environment variables in Vercel:
VITE_API_BASE_URL=https://your-backend-url.com
VITE_APP_URL=https://your-frontend-url.vercel.app
```

### Backend Deployment (VPS/Cloud)

```bash
# Install dependencies
npm install --production

# Set environment variables
export PORT=5000
export SUPABASE_URL=...
export SUPABASE_ANON_KEY=...
export SUPABASE_SERVICE_ROLE_KEY=...
export HF_SPACE_URL=...

# Start with PM2
pm2 start server.js --name emosense-backend
pm2 save
pm2 startup
```

### Production Checklist
- [ ] Set secure JWT secret
- [ ] Enable HTTPS
- [ ] Configure CORS for production domain
- [ ] Set up database backups
- [ ] Configure rate limiting
- [ ] Enable error monitoring (Sentry)
- [ ] Set up logging (Winston)
- [ ] Configure CDN for static assets

---

## Security Considerations

1. **Authentication**: JWT tokens with expiration
2. **Password Storage**: Bcrypt hashing
3. **API Security**: Helmet.js security headers
4. **CORS**: Restricted to frontend domain
5. **Input Validation**: Server-side validation
6. **SQL Injection**: Parameterized queries via Supabase
7. **XSS Protection**: React auto-escaping
8. **Rate Limiting**: Implement for production

---

## Contributing

1. Fork the repository
2. Create feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open Pull Request

---

## License

This project is proprietary software. All rights reserved.

---

## Support

For issues and questions:
- Email: support@emosense.com
- Documentation: https://docs.emosense.com
- Issue Tracker: GitHub Issues

---

**Built with ❤️ for mental health awareness**
