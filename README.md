# FundMatch

A platform connecting underrepresented founders with funding opportunities.

## Features

- **Smart Discovery**: AI-powered matching to find funding opportunities tailored to your profile
- **Opportunity Database**: Grants, investors, loans, competitions, and crowdfunding opportunities
- **Application Tracker**: Kanban-style board to track your funding applications
- **Founder Profiles**: Detailed profiles for better opportunity matching
- **Resources Library**: Guides, templates, and FAQs for funding success
- **Success Stories**: Learn from founders who have successfully secured funding

## Tech Stack

- **Frontend**: Next.js 14 (App Router), TypeScript, Tailwind CSS
- **UI Components**: shadcn/ui (Radix UI primitives)
- **Backend**: Supabase (Auth, Database, Storage, Real-time)
- **Database**: PostgreSQL with Supabase + Prisma ORM
- **Deployment**: Vercel (recommended)

## Getting Started

### Prerequisites

- Node.js 18+
- Supabase account (free tier available at [supabase.com](https://supabase.com))
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd fundmatch
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env
```

Edit `.env` with your Supabase configuration (from your Supabase project settings):
```
NEXT_PUBLIC_SUPABASE_URL="https://your-project.supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="your-anon-key"
SUPABASE_SERVICE_ROLE_KEY="your-service-role-key"
DATABASE_URL="postgresql://postgres:[password]@db.your-project.supabase.co:5432/postgres"
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

4. Set up the database:
```bash
npm run db:generate
npm run db:push
npm run db:seed
```

5. Start the development server:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

## Project Structure

```
fundmatch/
├── app/                    # Next.js App Router pages
│   ├── (auth)/            # Authentication pages
│   ├── (dashboard)/       # Protected dashboard pages
│   ├── api/               # API routes
│   └── page.tsx           # Landing page
├── components/            # React components
│   ├── ui/               # shadcn/ui components
│   ├── dashboard/        # Dashboard-specific components
│   ├── opportunities/    # Opportunity-related components
│   └── tracker/          # Kanban tracker components
├── lib/                   # Utility functions
│   ├── supabase/         # Supabase client configuration
│   │   ├── client.ts     # Browser client
│   │   └── server.ts     # Server client
│   ├── db.ts             # Prisma client (for migrations)
│   ├── matching.ts       # Matching algorithm
│   └── utils.ts          # Helper functions
├── prisma/               # Database schema and seeds
├── types/                # TypeScript type definitions
└── public/               # Static assets
```

## Key Pages

| Route | Description |
|-------|-------------|
| `/` | Landing page |
| `/login` | Sign in |
| `/signup` | Create account |
| `/onboarding` | Profile setup wizard |
| `/dashboard` | Main dashboard |
| `/opportunities` | Browse opportunities |
| `/opportunities/[id]` | Opportunity details |
| `/tracker` | Application tracker |
| `/profile` | Edit profile |
| `/resources` | Resource library |
| `/stories` | Success stories |
| `/settings` | Account settings |

## API Endpoints

### Authentication (via Supabase Client SDK)
- `supabase.auth.signUp()` - Create account
- `supabase.auth.signInWithPassword()` - Sign in
- `supabase.auth.signOut()` - Sign out
- `GET /api/auth/callback` - OAuth/magic link callback handler

### Profile
- `GET /api/profile` - Get current user profile
- `PUT /api/profile` - Update profile
- `POST /api/profile/onboarding` - Complete onboarding

### Opportunities
- `GET /api/opportunities` - List with filters
- `GET /api/opportunities/[id]` - Single opportunity
- `GET /api/opportunities/recommended` - AI-matched opportunities

### Applications
- `GET /api/applications` - User's tracked applications
- `POST /api/applications` - Save an opportunity
- `PATCH /api/applications/[id]` - Update status
- `DELETE /api/applications/[id]` - Remove from tracking

## Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Import the project to Vercel
3. Configure environment variables (Supabase keys from your project dashboard)
4. Deploy

### Supabase Setup

1. Create a new project at [supabase.com](https://supabase.com)
2. Copy your project URL and API keys from Project Settings > API
3. Enable the authentication providers you need (Email, Google, etc.)
4. Run database migrations: `npm run db:push`
5. Configure Row-Level Security policies in the Supabase dashboard

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## License

MIT License - see LICENSE file for details.
