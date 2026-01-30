# FundMatch System Architecture

## Table of Contents

1. [Overview](#overview)
2. [System Architecture Diagram](#system-architecture-diagram)
3. [Technology Stack](#technology-stack)
4. [Application Layers](#application-layers)
5. [Data Architecture](#data-architecture)
6. [Authentication & Authorization](#authentication--authorization)
7. [API Design](#api-design)
8. [Matching Algorithm](#matching-algorithm)
9. [Frontend Architecture](#frontend-architecture)
10. [Deployment Architecture](#deployment-architecture)
11. [Security Considerations](#security-considerations)
12. [Scalability & Performance](#scalability--performance)
13. [Future Enhancements](#future-enhancements)

---

## Overview

FundMatch is a full-stack web application designed to connect underrepresented founders with funding opportunities. The platform uses a modern JAMstack architecture built on Next.js 14 and Supabase, leveraging server-side rendering, API routes, and a PostgreSQL database with real-time capabilities.

### Key Design Principles

- **User-Centric**: Designed around the founder's journey from discovery to funding
- **Performance-First**: Server-side rendering and optimized data fetching
- **Secure by Default**: Authentication, authorization, and data protection built-in
- **Scalable**: Stateless architecture ready for horizontal scaling
- **Maintainable**: Clear separation of concerns and TypeScript throughout

---

## System Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                                  CLIENTS                                     │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐        │
│  │   Browser   │  │   Mobile    │  │   Tablet    │  │   PWA       │        │
│  │   (React)   │  │  (Responsive)│  │ (Responsive)│  │  (Future)   │        │
│  └──────┬──────┘  └──────┬──────┘  └──────┬──────┘  └──────┬──────┘        │
└─────────┼────────────────┼────────────────┼────────────────┼────────────────┘
          │                │                │                │
          └────────────────┴────────────────┴────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                              CDN / EDGE NETWORK                              │
│                         (Vercel Edge Network)                                │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │  • Static Asset Caching    • Image Optimization    • Edge Functions  │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                           APPLICATION LAYER                                  │
│                         (Next.js 14 App Router)                             │
│                                                                              │
│  ┌──────────────────────────────────────────────────────────────────────┐  │
│  │                         MIDDLEWARE LAYER                              │  │
│  │  ┌────────────────┐  ┌────────────────┐  ┌────────────────┐         │  │
│  │  │  Auth Guard    │  │  Rate Limiting │  │  Request       │         │  │
│  │  │ (Supabase Auth)│  │  (Future)      │  │  Validation    │         │  │
│  │  └────────────────┘  └────────────────┘  └────────────────┘         │  │
│  └──────────────────────────────────────────────────────────────────────┘  │
│                                                                              │
│  ┌─────────────────────────┐  ┌─────────────────────────────────────────┐  │
│  │    SERVER COMPONENTS    │  │           API ROUTES                     │  │
│  │  ┌───────────────────┐  │  │  ┌─────────────────────────────────┐   │  │
│  │  │ • Landing Page    │  │  │  │  /api/auth/*     Authentication │   │  │
│  │  │ • Dashboard       │  │  │  │  /api/profile    User Profiles  │   │  │
│  │  │ • Opportunities   │  │  │  │  /api/opportunities  Funding DB │   │  │
│  │  │ • Tracker         │  │  │  │  /api/applications  Tracking    │   │  │
│  │  │ • Profile         │  │  │  │  /api/resources  Content        │   │  │
│  │  │ • Resources       │  │  │  │  /api/stories    Success Stories│   │  │
│  │  └───────────────────┘  │  │  └─────────────────────────────────┘   │  │
│  └─────────────────────────┘  └─────────────────────────────────────────┘  │
│                                                                              │
│  ┌──────────────────────────────────────────────────────────────────────┐  │
│  │                      CLIENT COMPONENTS                                │  │
│  │  ┌────────────┐ ┌────────────┐ ┌────────────┐ ┌────────────┐        │  │
│  │  │ Onboarding │ │ Kanban     │ │ Filters    │ │ Forms      │        │  │
│  │  │ Wizard     │ │ Board      │ │ & Search   │ │ & Inputs   │        │  │
│  │  └────────────┘ └────────────┘ └────────────┘ └────────────┘        │  │
│  └──────────────────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                            SERVICE LAYER                                     │
│                                                                              │
│  ┌────────────────┐  ┌────────────────┐  ┌────────────────────────────┐    │
│  │   Auth Service │  │ Matching       │  │  Data Access Layer         │    │
│  │ (Supabase Auth)│  │ Algorithm      │  │  (Supabase Client + Prisma)│    │
│  │                │  │                │  │                            │    │
│  │  • JWT Tokens  │  │  • Profile     │  │  • Type-safe queries       │    │
│  │  • OAuth 2.0   │  │    Analysis    │  │  • Real-time subscriptions │    │
│  │  • Sessions    │  │  • Scoring     │  │  • Row-level security      │    │
│  │  • Magic Links │  │  • Ranking     │  │  • Connection pooling      │    │
│  └────────────────┘  └────────────────┘  └────────────────────────────┘    │
└─────────────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                            DATA LAYER (SUPABASE)                             │
│                                                                              │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │                    PostgreSQL Database                               │   │
│  │  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐ ┌─────────────┐   │   │
│  │  │   Users     │ │  Profiles   │ │Opportunities│ │Applications │   │   │
│  │  └─────────────┘ └─────────────┘ └─────────────┘ └─────────────┘   │   │
│  │  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐ ┌─────────────┐   │   │
│  │  │  Sessions   │ │  Accounts   │ │  Resources  │ │   Stories   │   │   │
│  │  └─────────────┘ └─────────────┘ └─────────────┘ └─────────────┘   │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                              │
│  ┌──────────────────────┐  ┌──────────────────────┐  ┌─────────────────┐   │
│  │   Supabase Auth      │  │   Supabase Storage   │  │   Real-time     │   │
│  │  • User management   │  │  • Document uploads  │  │  • Live updates │   │
│  │  • OAuth providers   │  │  • Profile images    │  │  • Subscriptions│   │
│  │  • Row-level security│  │  • Secure URLs       │  │  • Presence     │   │
│  └──────────────────────┘  └──────────────────────┘  └─────────────────┘   │
└─────────────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                        EXTERNAL SERVICES (Future)                            │
│                                                                              │
│  ┌────────────────┐  ┌────────────────┐  ┌────────────────┐                │
│  │  Email Service │  │  OpenAI API    │  │  Analytics     │                │
│  │  (Resend)      │  │  (Embeddings)  │  │  (PostHog)     │                │
│  └────────────────┘  └────────────────┘  └────────────────┘                │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## Technology Stack

### Frontend

| Technology | Purpose | Version |
|------------|---------|---------|
| Next.js | React Framework with App Router | 14.1.0 |
| React | UI Library | 18.2.0 |
| TypeScript | Type Safety | 5.3.3 |
| Tailwind CSS | Utility-first CSS | 3.4.1 |
| shadcn/ui | Component Library | Latest |
| Radix UI | Headless UI Primitives | Various |
| Lucide React | Icon Library | 0.344.0 |
| dnd-kit | Drag and Drop | 6.1.0 |
| react-hook-form | Form Management | 7.50.1 |
| Zod | Schema Validation | 3.22.4 |

### Backend

| Technology | Purpose | Version |
|------------|---------|---------|
| Supabase | Backend-as-a-Service | Latest |
| Next.js API Routes | REST API | 14.1.0 |
| Supabase Auth | Authentication | Latest |
| Supabase Client | Database & Real-time | Latest |
| Prisma | Schema Management & Migrations | 5.10.0 |

### Database & Storage

| Technology | Purpose |
|------------|---------|
| Supabase PostgreSQL | Primary Database |
| Supabase Auth | User Authentication & Management |
| Supabase Storage | File Storage (documents, images) |
| Supabase Realtime | Live Subscriptions |
| Row-Level Security | Data Access Control |

### Infrastructure

| Service | Purpose |
|---------|---------|
| Vercel | Hosting & Deployment |
| Supabase | Database, Auth, Storage, Real-time |
| GitHub | Version Control |

---

## Application Layers

### 1. Presentation Layer

```
app/
├── (auth)/                 # Public authentication pages
│   ├── login/
│   └── signup/
├── (dashboard)/            # Protected application pages
│   ├── dashboard/
│   ├── opportunities/
│   ├── tracker/
│   ├── profile/
│   ├── resources/
│   └── settings/
├── onboarding/             # Onboarding flow
├── stories/                # Public success stories
└── page.tsx                # Landing page
```

**Responsibilities:**
- Render UI components
- Handle user interactions
- Manage client-side state
- Form validation and submission

### 2. API Layer

```
app/api/
├── auth/
│   ├── callback/           # OAuth/magic link callback handler
│   └── signup/             # User registration
├── profile/
│   ├── route.ts            # GET/PUT profile
│   └── onboarding/         # POST onboarding data
├── opportunities/
│   ├── route.ts            # GET list with filters
│   ├── [id]/               # GET single opportunity
│   └── recommended/        # GET AI-matched opportunities
└── applications/
    ├── route.ts            # GET/POST applications
    └── [id]/               # GET/PATCH/DELETE single
```

**Responsibilities:**
- Request validation
- Authentication verification
- Business logic execution
- Response formatting

### 3. Service Layer

```
lib/
├── supabase/
│   ├── client.ts           # Supabase browser client
│   ├── server.ts           # Supabase server client
│   └── middleware.ts       # Supabase auth middleware
├── db.ts                   # Prisma client (for migrations/complex queries)
├── matching.ts             # Matching algorithm
└── utils.ts                # Utility functions
```

**Responsibilities:**
- Business logic implementation
- Data transformation
- Algorithm execution
- Cross-cutting concerns
- Supabase client management

### 4. Data Access Layer

```
prisma/
├── schema.prisma           # Database schema
└── seed.ts                 # Seed data
```

**Responsibilities:**
- Database queries
- Data persistence
- Schema management
- Migrations

---

## Data Architecture

### Entity Relationship Diagram

```
┌─────────────────┐       ┌─────────────────┐
│      User       │       │    Account      │
├─────────────────┤       ├─────────────────┤
│ id (PK)         │──┐    │ id (PK)         │
│ email           │  │    │ userId (FK)     │──┐
│ name            │  │    │ provider        │  │
│ password        │  │    │ providerAcctId  │  │
│ image           │  │    │ access_token    │  │
│ emailVerified   │  │    │ refresh_token   │  │
│ createdAt       │  │    └─────────────────┘  │
│ updatedAt       │  │                         │
└────────┬────────┘  └─────────────────────────┘
         │
         │ 1:1
         ▼
┌─────────────────┐
│ FounderProfile  │
├─────────────────┤
│ id (PK)         │
│ userId (FK)     │
│ companyName     │
│ stage           │
│ industries[]    │
│ businessModel   │
│ fundingSought   │
│ teamSize        │
│ location        │
│ demographics    │
│ onboarding      │
└─────────────────┘
         │
         │ 1:N
         ▼
┌─────────────────┐       ┌─────────────────┐
│   Application   │       │  Opportunity    │
├─────────────────┤       ├─────────────────┤
│ id (PK)         │       │ id (PK)         │
│ userId (FK)     │───────│ name            │
│ opportunityId   │──────▶│ type            │
│ status          │       │ organization    │
│ notes           │       │ description     │
│ documents       │       │ amountMin/Max   │
│ submittedAt     │       │ eligibility     │
│ createdAt       │       │ deadline        │
└─────────────────┘       │ applicationUrl  │
                          │ tags[]          │
                          │ isVerified      │
                          │ isActive        │
                          └─────────────────┘
                                   │
                                   │ 1:N
                                   ▼
                          ┌─────────────────┐
                          │  SuccessStory   │
                          ├─────────────────┤
                          │ id (PK)         │
                          │ userId (FK)     │
                          │ opportunityId   │
                          │ title           │
                          │ story           │
                          │ tips            │
                          │ fundingAmount   │
                          │ isFeatured      │
                          │ isPublished     │
                          └─────────────────┘
```

### Database Schema Details

#### Users Table
```sql
CREATE TABLE users (
  id            VARCHAR PRIMARY KEY,
  email         VARCHAR UNIQUE NOT NULL,
  name          VARCHAR,
  password      VARCHAR,          -- Hashed with bcrypt
  image         VARCHAR,
  email_verified TIMESTAMP,
  created_at    TIMESTAMP DEFAULT NOW(),
  updated_at    TIMESTAMP
);
```

#### Founder Profiles Table
```sql
CREATE TABLE founder_profiles (
  id                  VARCHAR PRIMARY KEY,
  user_id             VARCHAR UNIQUE REFERENCES users(id),
  company_name        VARCHAR,
  stage               ENUM('IDEA','PRE_SEED','SEED','SERIES_A','SERIES_B','GROWTH'),
  industries          VARCHAR[],
  business_model      VARCHAR,
  funding_sought_min  INTEGER,
  funding_sought_max  INTEGER,
  team_size           INTEGER,
  revenue             INTEGER,
  location            VARCHAR,
  geographic_focus    VARCHAR,
  demographics        JSONB,        -- Flexible schema for optional data
  onboarding_completed BOOLEAN DEFAULT FALSE,
  created_at          TIMESTAMP DEFAULT NOW(),
  updated_at          TIMESTAMP
);
```

#### Opportunities Table
```sql
CREATE TABLE opportunities (
  id                    VARCHAR PRIMARY KEY,
  name                  VARCHAR NOT NULL,
  type                  ENUM('GRANT','INVESTOR','LOAN','COMPETITION','CROWDFUNDING'),
  organization          VARCHAR,
  description           TEXT,
  amount_min            INTEGER,
  amount_max            INTEGER,
  eligibility           JSONB,      -- Flexible eligibility criteria
  deadline              DATE,
  application_url       VARCHAR,
  tags                  VARCHAR[],
  is_verified           BOOLEAN DEFAULT FALSE,
  is_active             BOOLEAN DEFAULT TRUE,
  opportunity_embedding TEXT,       -- For future AI matching
  created_at            TIMESTAMP DEFAULT NOW(),
  updated_at            TIMESTAMP
);

-- Indexes for common queries
CREATE INDEX idx_opportunities_type ON opportunities(type);
CREATE INDEX idx_opportunities_active ON opportunities(is_active);
CREATE INDEX idx_opportunities_deadline ON opportunities(deadline);
```

#### Applications Table
```sql
CREATE TABLE applications (
  id                     VARCHAR PRIMARY KEY,
  user_id                VARCHAR REFERENCES users(id),
  opportunity_id         VARCHAR REFERENCES opportunities(id),
  status                 ENUM('SAVED','RESEARCHING','APPLYING','SUBMITTED','INTERVIEW','FUNDED','REJECTED'),
  notes                  TEXT,
  documents              JSONB,      -- Document checklist
  deadline_reminder_sent BOOLEAN DEFAULT FALSE,
  submitted_at           TIMESTAMP,
  created_at             TIMESTAMP DEFAULT NOW(),
  updated_at             TIMESTAMP,

  UNIQUE(user_id, opportunity_id)   -- One application per user per opportunity
);

CREATE INDEX idx_applications_user ON applications(user_id);
CREATE INDEX idx_applications_status ON applications(status);
```

---

## Authentication & Authorization

### Authentication Flow (Supabase Auth)

```
┌──────────┐     ┌──────────────┐     ┌──────────────┐     ┌──────────┐
│  Client  │     │ Supabase Auth│     │OAuth Provider│     │ Supabase │
└────┬─────┘     └──────┬───────┘     └──────┬───────┘     │    DB    │
     │                  │                    │             └────┬─────┘
     │  Login Request   │                    │                  │
     │─────────────────▶│                    │                  │
     │                  │                    │                  │
     │                  │  Email/Password    │                  │
     │                  │  OR Magic Link     │                  │
     │                  │  OR OAuth Flow     │                  │
     │                  │───────────────────▶│                  │
     │                  │                    │                  │
     │                  │  User Data         │                  │
     │                  │◀───────────────────│                  │
     │                  │                    │                  │
     │                  │  Create/Update User (auth.users)      │
     │                  │─────────────────────────────────────▶│
     │                  │                    │                  │
     │                  │  Create Session    │                  │
     │                  │─────────────────────────────────────▶│
     │                  │                    │                  │
     │  JWT + Refresh   │                    │                  │
     │◀─────────────────│                    │                  │
     │                  │                    │                  │
```

### Supported Authentication Methods

1. **Email/Password**
   - Password hashed by Supabase (bcrypt)
   - Email verification with confirmation link
   - Password reset flow via email

2. **Magic Link**
   - Passwordless authentication
   - Email-based one-time login links
   - Configurable expiration

3. **OAuth Providers**
   - Google OAuth 2.0
   - GitHub (optional)
   - Additional providers as needed

### Supabase Session Structure

```typescript
interface Session {
  access_token: string;     // JWT for API access
  refresh_token: string;    // For token refresh
  expires_in: number;       // Token expiration (seconds)
  expires_at: number;       // Expiration timestamp
  user: {
    id: string;             // User UUID
    email: string;          // User email
    email_confirmed_at: string;
    user_metadata: {
      name?: string;
      avatar_url?: string;
    };
    app_metadata: {
      provider: string;
    };
  };
}
```

### Authorization Matrix

| Resource | Public | Authenticated | Owner Only |
|----------|--------|---------------|------------|
| Landing Page | ✅ | ✅ | - |
| Opportunities List | ✅ | ✅ | - |
| Opportunity Detail | ✅ | ✅ | - |
| Success Stories | ✅ | ✅ | - |
| Resources | ✅ | ✅ | - |
| Dashboard | ❌ | ✅ | - |
| Profile | ❌ | ✅ | ✅ |
| Applications | ❌ | ✅ | ✅ |
| Settings | ❌ | ✅ | ✅ |

### Middleware Protection

```typescript
// middleware.ts
import { createServerClient } from '@supabase/ssr'
import { NextResponse } from 'next/server'

export async function middleware(request) {
  const supabase = createServerClient(/* config */)
  const { data: { session } } = await supabase.auth.getSession()

  // Redirect unauthenticated users to login
  if (!session && isProtectedRoute(request.nextUrl.pathname)) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/tracker/:path*',
    '/profile/:path*',
    '/settings/:path*',
    '/onboarding/:path*',
  ],
}
```

### Row-Level Security (RLS)

Supabase enforces data access at the database level using RLS policies:

```sql
-- Users can only read their own profile
CREATE POLICY "Users can view own profile"
  ON founder_profiles FOR SELECT
  USING (auth.uid() = user_id);

-- Users can only update their own profile
CREATE POLICY "Users can update own profile"
  ON founder_profiles FOR UPDATE
  USING (auth.uid() = user_id);

-- Users can only access their own applications
CREATE POLICY "Users can manage own applications"
  ON applications FOR ALL
  USING (auth.uid() = user_id);

-- Everyone can read active opportunities
CREATE POLICY "Anyone can view active opportunities"
  ON opportunities FOR SELECT
  USING (is_active = true);
```

---

## API Design

### RESTful Endpoints

#### Authentication (Supabase Auth)

Authentication is handled directly via Supabase client SDK:

| Method | Supabase Function | Description |
|--------|-------------------|-------------|
| - | `supabase.auth.signUp()` | Create new account |
| - | `supabase.auth.signInWithPassword()` | Sign in with email/password |
| - | `supabase.auth.signInWithOtp()` | Magic link sign in |
| - | `supabase.auth.signInWithOAuth()` | OAuth provider sign in |
| - | `supabase.auth.signOut()` | Sign out |
| - | `supabase.auth.getSession()` | Get current session |
| - | `supabase.auth.onAuthStateChange()` | Listen for auth changes |

#### Auth Callback Route

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/auth/callback` | Handle OAuth/magic link redirects |

#### Profile

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/profile` | Get current user profile |
| PUT | `/api/profile` | Update profile |
| POST | `/api/profile/onboarding` | Complete onboarding |

#### Opportunities

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/opportunities` | List with filters |
| GET | `/api/opportunities/:id` | Get single opportunity |
| GET | `/api/opportunities/recommended` | Get AI-matched list |

#### Applications

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/applications` | List user's applications |
| POST | `/api/applications` | Save opportunity |
| PATCH | `/api/applications/:id` | Update status/notes |
| DELETE | `/api/applications/:id` | Remove from tracking |

### Request/Response Examples

#### List Opportunities

**Request:**
```http
GET /api/opportunities?type=GRANT,INVESTOR&minAmount=10000&deadline=upcoming&limit=20
```

**Response:**
```json
{
  "data": [
    {
      "id": "clx123...",
      "name": "Amber Grant for Women",
      "type": "GRANT",
      "organization": "WomensNet",
      "description": "Monthly $10,000 grants...",
      "amountMin": 10000,
      "amountMax": 25000,
      "deadline": "2025-03-31T00:00:00Z",
      "tags": ["Women", "Monthly"],
      "isVerified": true
    }
  ],
  "total": 45,
  "page": 1,
  "pageSize": 20,
  "totalPages": 3
}
```

#### Create Application

**Request:**
```http
POST /api/applications
Content-Type: application/json
Authorization: Bearer <token>

{
  "opportunityId": "clx123...",
  "notes": "Need to gather financial documents"
}
```

**Response:**
```json
{
  "id": "cly456...",
  "userId": "usr789...",
  "opportunityId": "clx123...",
  "status": "SAVED",
  "notes": "Need to gather financial documents",
  "createdAt": "2024-01-15T10:30:00Z"
}
```

### Error Handling

```typescript
// Standard error response format
interface ApiError {
  error: string;
  message?: string;
  details?: Record<string, string[]>;
}

// HTTP Status Codes
// 200 - Success
// 201 - Created
// 400 - Bad Request (validation errors)
// 401 - Unauthorized (not authenticated)
// 403 - Forbidden (not authorized)
// 404 - Not Found
// 500 - Internal Server Error
```

---

## Matching Algorithm

### Overview

The matching algorithm calculates a compatibility score (0-100) between a founder's profile and each funding opportunity based on multiple weighted factors.

### Scoring Components

```
┌─────────────────────────────────────────────────────────────┐
│                    MATCH SCORE (0-100)                       │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  ┌─────────────────┐  ┌─────────────────┐                   │
│  │  Stage Match    │  │  Industry Match │                   │
│  │  Weight: 25%    │  │  Weight: 25%    │                   │
│  └─────────────────┘  └─────────────────┘                   │
│                                                              │
│  ┌─────────────────┐  ┌─────────────────┐                   │
│  │ Location Match  │  │  Amount Match   │                   │
│  │  Weight: 15%    │  │  Weight: 20%    │                   │
│  └─────────────────┘  └─────────────────┘                   │
│                                                              │
│  ┌─────────────────┐                                        │
│  │ Demographics    │                                        │
│  │  Weight: 15%    │                                        │
│  └─────────────────┘                                        │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

### Algorithm Implementation

```typescript
function calculateMatchScore(profile: FounderProfile, opportunity: Opportunity): MatchResult {
  const eligibility = opportunity.eligibility;
  let totalScore = 0;
  let totalWeight = 0;
  const reasons: string[] = [];

  // 1. Stage Matching (25%)
  if (eligibility.stages?.includes(profile.stage)) {
    totalScore += 25;
    reasons.push(`Matches your business stage`);
  }
  totalWeight += 25;

  // 2. Industry Matching (25%)
  const matchingIndustries = profile.industries.filter(
    ind => eligibility.industries?.includes(ind)
  );
  if (matchingIndustries.length > 0) {
    totalScore += 25 * (matchingIndustries.length / eligibility.industries.length);
    reasons.push(`Industry match: ${matchingIndustries.join(', ')}`);
  }
  totalWeight += 25;

  // 3. Location Matching (15%)
  if (eligibility.locations?.some(loc =>
    loc === profile.location || loc === 'National' || loc === 'Global'
  )) {
    totalScore += 15;
    reasons.push('Location eligible');
  }
  totalWeight += 15;

  // 4. Funding Amount Matching (20%)
  if (rangesOverlap(profile.fundingSought, opportunity.amount)) {
    totalScore += 20;
    reasons.push('Funding amount aligns');
  }
  totalWeight += 20;

  // 5. Demographics Matching (15%)
  if (demographicsMatch(profile.demographics, eligibility.demographics)) {
    totalScore += 15;
    reasons.push('Targeted for your background');
  }
  totalWeight += 15;

  return {
    opportunity,
    score: Math.round((totalScore / totalWeight) * 100),
    reasons
  };
}
```

### Score Interpretation

| Score Range | Label | Color |
|-------------|-------|-------|
| 80-100 | Excellent Match | Green |
| 60-79 | Good Match | Blue |
| 40-59 | Potential Match | Yellow |
| 0-39 | Low Match | Gray |

### Future Enhancements (Phase 2)

- **AI-Powered Matching**: Use OpenAI embeddings for semantic similarity
- **Learning from Behavior**: Adjust weights based on user interactions
- **Success Rate Prediction**: Incorporate historical success data

---

## Frontend Architecture

### Component Hierarchy

```
App
├── Providers (Auth, Toast)
│   └── Layout
│       ├── Header
│       │   ├── Logo
│       │   ├── Navigation
│       │   └── UserMenu
│       ├── Sidebar (Dashboard only)
│       │   └── NavLinks
│       └── Main Content
│           ├── Page Components
│           │   ├── Dashboard
│           │   │   ├── StatsCards
│           │   │   ├── MatchedOpportunities
│           │   │   └── UpcomingDeadlines
│           │   ├── Opportunities
│           │   │   ├── FilterBar
│           │   │   ├── OpportunityGrid
│           │   │   └── OpportunityCard
│           │   ├── Tracker
│           │   │   └── KanbanBoard
│           │   │       └── KanbanColumn
│           │   │           └── KanbanCard
│           │   └── Profile
│           │       └── ProfileForm
│           └── UI Components
│               ├── Button, Input, Card...
│               └── Dialog, Toast, Dropdown...
```

### State Management

```
┌─────────────────────────────────────────────────────────────┐
│                    STATE ARCHITECTURE                        │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  ┌─────────────────────────────────────────────────────┐   │
│  │              SERVER STATE (React Server Components)  │   │
│  │  • User Profile                                      │   │
│  │  • Opportunities List                                │   │
│  │  • Applications                                      │   │
│  │  • Fetched via Supabase in Server Components        │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                              │
│  ┌─────────────────────────────────────────────────────┐   │
│  │              AUTH STATE (Supabase Auth)              │   │
│  │  • Session (access_token, refresh_token)            │   │
│  │  • User                                              │   │
│  │  • Managed by Supabase client + onAuthStateChange   │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                              │
│  ┌─────────────────────────────────────────────────────┐   │
│  │              REAL-TIME STATE (Supabase Realtime)     │   │
│  │  • Application status updates                        │   │
│  │  • New opportunity notifications                     │   │
│  │  • Managed via Supabase subscriptions               │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                              │
│  ┌─────────────────────────────────────────────────────┐   │
│  │              UI STATE (React useState/useReducer)    │   │
│  │  • Form inputs                                       │   │
│  │  • Modal open/close                                  │   │
│  │  • Filter selections                                 │   │
│  │  • Drag and drop state                              │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                              │
│  ┌─────────────────────────────────────────────────────┐   │
│  │              URL STATE (Next.js searchParams)        │   │
│  │  • Filters                                           │   │
│  │  • Sort order                                        │   │
│  │  • Search query                                      │   │
│  │  • Pagination                                        │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

### Data Fetching Patterns

#### Server Components (Preferred)

```typescript
// app/(dashboard)/dashboard/page.tsx
import { createServerClient } from '@/lib/supabase/server'

export default async function DashboardPage() {
  const supabase = createServerClient();
  const { data: { user } } = await supabase.auth.getUser();

  const { data: opportunities } = await supabase
    .from('opportunities')
    .select('*')
    .eq('is_active', true)
    .limit(10);

  const { data: applications } = await supabase
    .from('applications')
    .select('*, opportunity:opportunities(*)')
    .eq('user_id', user.id);

  return <Dashboard data={{ user, opportunities, applications }} />;
}
```

#### Client Components (When Needed)

```typescript
// components/opportunities/save-button.tsx
'use client';

import { createBrowserClient } from '@/lib/supabase/client'

export function SaveButton({ opportunityId }) {
  const [isSaved, setIsSaved] = useState(false);
  const supabase = createBrowserClient();

  const handleSave = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    await supabase
      .from('applications')
      .insert({ user_id: user.id, opportunity_id: opportunityId, status: 'SAVED' });
    setIsSaved(true);
  };

  return <Button onClick={handleSave}>Save</Button>;
}
```

#### Real-time Subscriptions

```typescript
// components/tracker/kanban-board.tsx
'use client';

import { createBrowserClient } from '@/lib/supabase/client'

export function KanbanBoard({ userId }) {
  const [applications, setApplications] = useState([]);
  const supabase = createBrowserClient();

  useEffect(() => {
    // Subscribe to changes on user's applications
    const channel = supabase
      .channel('applications')
      .on('postgres_changes',
        { event: '*', schema: 'public', table: 'applications', filter: `user_id=eq.${userId}` },
        (payload) => {
          // Handle real-time updates
          setApplications(current => updateApplications(current, payload));
        }
      )
      .subscribe();

    return () => { supabase.removeChannel(channel) };
  }, [userId]);

  return <Board applications={applications} />;
}
```

---

## Deployment Architecture

### Production Environment

```
┌─────────────────────────────────────────────────────────────┐
│                        VERCEL                                │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  ┌─────────────────────────────────────────────────────┐   │
│  │                   Edge Network                       │   │
│  │  • Global CDN (300+ locations)                      │   │
│  │  • Static asset caching                             │   │
│  │  • Image optimization                               │   │
│  │  • DDoS protection                                  │   │
│  └─────────────────────────────────────────────────────┘   │
│                          │                                   │
│                          ▼                                   │
│  ┌─────────────────────────────────────────────────────┐   │
│  │              Serverless Functions                    │   │
│  │  • Next.js API Routes                               │   │
│  │  • Server Components                                │   │
│  │  • Auto-scaling (0 to ∞)                           │   │
│  │  • Cold start optimization                          │   │
│  └─────────────────────────────────────────────────────┘   │
│                          │                                   │
└──────────────────────────┼──────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────────┐
│                        SUPABASE                              │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  ┌───────────────────────┐  ┌───────────────────────────┐  │
│  │   PostgreSQL Database │  │      Supabase Auth        │  │
│  │  • Connection pooling │  │  • User management        │  │
│  │  • Automatic backups  │  │  • OAuth providers        │  │
│  │  • Point-in-time      │  │  • Magic links            │  │
│  │    recovery           │  │  • JWT token management   │  │
│  │  • Row-level security │  │  • Session handling       │  │
│  └───────────────────────┘  └───────────────────────────┘  │
│                                                              │
│  ┌───────────────────────┐  ┌───────────────────────────┐  │
│  │   Supabase Storage    │  │    Supabase Realtime      │  │
│  │  • Document uploads   │  │  • WebSocket connections  │  │
│  │  • Profile images     │  │  • Database changes       │  │
│  │  • Secure signed URLs │  │  • Broadcast messages     │  │
│  │  • CDN delivery       │  │  • Presence tracking      │  │
│  └───────────────────────┘  └───────────────────────────┘  │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

### Environment Configuration

```bash
# Production Environment Variables

# Supabase
NEXT_PUBLIC_SUPABASE_URL="https://your-project.supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="your-anon-key"
SUPABASE_SERVICE_ROLE_KEY="your-service-role-key"  # Server-side only

# Database (for Prisma migrations)
DATABASE_URL="postgresql://postgres:[password]@db.your-project.supabase.co:5432/postgres"

# Application
NEXT_PUBLIC_APP_URL="https://fundmatch.com"
```

### CI/CD Pipeline

```
┌──────────┐     ┌──────────┐     ┌──────────┐     ┌──────────┐
│  Push to │────▶│  GitHub  │────▶│  Vercel  │────▶│Production│
│  GitHub  │     │  Actions │     │   Build  │     │  Deploy  │
└──────────┘     └──────────┘     └──────────┘     └──────────┘
                      │
                      ▼
               ┌──────────┐
               │  Lint &  │
               │  Type    │
               │  Check   │
               └──────────┘
```

---

## Security Considerations

### Authentication Security (Supabase Auth)

- **Password Hashing**: bcrypt (managed by Supabase)
- **JWT Security**: Signed JWTs with configurable expiration
- **Session Management**: Access tokens + refresh tokens, automatic refresh
- **OAuth Security**: PKCE enabled by default, state parameter validation
- **Row-Level Security**: Database-level access control policies

### Data Protection

- **HTTPS**: Enforced on all routes
- **Input Validation**: Zod schemas on API inputs
- **SQL Injection**: Prevented by Prisma parameterized queries
- **XSS Prevention**: React's automatic escaping, CSP headers (future)

### Sensitive Data Handling

```typescript
// Demographics data is optional and encrypted at rest
demographics: {
  genderIdentity?: string;      // Not shared externally
  raceEthnicity?: string[];     // Used only for matching
  veteranStatus?: boolean;
  disabilityStatus?: boolean;
}
```

### OWASP Top 10 Mitigations

| Vulnerability | Mitigation |
|---------------|------------|
| Injection | Supabase client parameterized queries, Prisma ORM |
| Broken Auth | Supabase Auth with JWT + Row-Level Security |
| Sensitive Data | HTTPS, Supabase encryption at rest |
| XXE | Not applicable (JSON only) |
| Broken Access Control | RLS policies + middleware authorization |
| Security Misconfig | Environment variables, Supabase secure defaults |
| XSS | React escaping, input validation |
| Insecure Deserialization | JSON.parse with validation |
| Vulnerable Components | Regular npm audits |
| Logging & Monitoring | Vercel logs, Supabase dashboard, error tracking |

---

## Scalability & Performance

### Current Architecture Limits

| Metric | Current Capacity | Bottleneck |
|--------|-----------------|------------|
| Concurrent Users | ~1,000 | Database connections |
| Opportunities | ~10,000 | Query performance |
| Applications/User | ~100 | UI rendering |
| API Requests | 100 req/sec | Serverless limits |

### Performance Optimizations

1. **Server Components**: Reduced client-side JavaScript
2. **Static Generation**: Landing page, resources pre-rendered
3. **Database Indexes**: On frequently queried columns
4. **Connection Pooling**: Prisma connection limit management
5. **Image Optimization**: Next.js Image component (future)

### Scaling Strategy

```
Phase 1 (Current): Single region, managed DB
     │
     ▼
Phase 2: Connection pooling, caching layer
     │
     ▼
Phase 3: Read replicas, CDN for API responses
     │
     ▼
Phase 4: Multi-region deployment, edge caching
```

### Caching Strategy (Future)

```typescript
// Example: Cache opportunity list
const opportunities = await redis.get('opportunities:active');
if (!opportunities) {
  const data = await prisma.opportunity.findMany({...});
  await redis.set('opportunities:active', data, 'EX', 300); // 5 min TTL
  return data;
}
return opportunities;
```

---

## Future Enhancements

### Phase 2: AI-Powered Matching

Supabase supports pgvector extension for AI embeddings:

```
┌─────────────────────────────────────────────────────────────┐
│                    AI MATCHING PIPELINE                      │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  Profile Text ──▶ OpenAI Embeddings ──▶ Supabase pgvector   │
│                                                              │
│  Opportunity Text ──▶ OpenAI Embeddings ──▶ Supabase pgvector│
│                                                              │
│  -- Enable pgvector in Supabase                             │
│  CREATE EXTENSION IF NOT EXISTS vector;                      │
│                                                              │
│  -- Similarity search                                        │
│  SELECT * FROM opportunities                                 │
│  ORDER BY embedding <=> profile_embedding                    │
│  LIMIT 10;                                                   │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

### Phase 3: Community Features

- **Founder Directory**: Opt-in public profiles
- **Messaging**: Direct founder-to-founder communication
- **Mentor Matching**: Connect with successful founders

### Phase 4: Advanced Features

- **Calendar Integration**: Sync deadlines with Google/Outlook
- **Document Management**: Store application materials
- **Analytics Dashboard**: Track success rates, trends
- **Mobile App**: React Native or PWA

### Technical Debt & Improvements

| Item | Priority | Effort |
|------|----------|--------|
| Add comprehensive test suite | High | Medium |
| Implement rate limiting | High | Low |
| Add error boundary components | Medium | Low |
| Set up monitoring/alerting | Medium | Medium |
| Add internationalization (i18n) | Low | High |
| Implement offline support (PWA) | Low | High |

---

## Appendix

### A. File Structure Reference

```
fundmatch/
├── app/
│   ├── (auth)/
│   │   ├── login/page.tsx
│   │   ├── signup/page.tsx
│   │   └── auth/
│   │       └── callback/route.ts    # Supabase auth callback
│   ├── (dashboard)/
│   │   ├── dashboard/page.tsx
│   │   ├── opportunities/
│   │   │   ├── page.tsx
│   │   │   └── [id]/page.tsx
│   │   ├── tracker/page.tsx
│   │   ├── profile/page.tsx
│   │   ├── resources/page.tsx
│   │   ├── settings/page.tsx
│   │   └── layout.tsx
│   ├── api/
│   │   ├── applications/route.ts
│   │   ├── opportunities/route.ts
│   │   └── profile/route.ts
│   ├── onboarding/page.tsx
│   ├── stories/page.tsx
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx
├── components/
│   ├── ui/                    # 20+ shadcn components
│   ├── dashboard/
│   ├── opportunities/
│   ├── tracker/
│   └── providers/
│       └── supabase-provider.tsx  # Supabase client provider
├── lib/
│   ├── supabase/
│   │   ├── client.ts          # Browser client
│   │   ├── server.ts          # Server client
│   │   └── middleware.ts      # Auth middleware helpers
│   ├── db.ts                  # Prisma client (migrations)
│   ├── matching.ts
│   └── utils.ts
├── prisma/
│   ├── schema.prisma
│   └── seed.ts
├── supabase/
│   └── migrations/            # Supabase SQL migrations
├── types/
│   ├── index.ts
│   └── supabase.ts            # Generated Supabase types
├── middleware.ts
├── package.json
├── tsconfig.json
└── tailwind.config.ts
```

### B. API Response Codes

| Code | Meaning | When Used |
|------|---------|-----------|
| 200 | OK | Successful GET, PUT, PATCH |
| 201 | Created | Successful POST |
| 204 | No Content | Successful DELETE |
| 400 | Bad Request | Validation errors |
| 401 | Unauthorized | Missing/invalid auth |
| 403 | Forbidden | Insufficient permissions |
| 404 | Not Found | Resource doesn't exist |
| 409 | Conflict | Duplicate resource |
| 500 | Server Error | Unexpected errors |

### C. Environment Variables Reference

| Variable | Required | Description |
|----------|----------|-------------|
| `NEXT_PUBLIC_SUPABASE_URL` | Yes | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Yes | Supabase anonymous/public key |
| `SUPABASE_SERVICE_ROLE_KEY` | Yes | Supabase service role key (server-only) |
| `DATABASE_URL` | Yes | PostgreSQL connection string (for Prisma) |
| `NEXT_PUBLIC_APP_URL` | Yes | Application URL |
| `OPENAI_API_KEY` | No | For AI matching (Phase 2) |
| `RESEND_API_KEY` | No | For email notifications |

---

*Document Version: 1.2*
*Last Updated: January 2026*
*Architecture Review: Quarterly*
*Backend: Supabase*
