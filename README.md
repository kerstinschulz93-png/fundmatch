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
- **Authentication**: NextAuth.js
- **Database**: PostgreSQL with Prisma ORM
- **Deployment**: Vercel (recommended)

## Getting Started

### Prerequisites

- Node.js 18+
- PostgreSQL database
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

Edit `.env` with your configuration:
```
DATABASE_URL="postgresql://user:password@localhost:5432/fundmatch"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key"
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
│   ├── auth.ts           # NextAuth configuration
│   ├── db.ts             # Prisma client
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

### Authentication
- `POST /api/auth/signup` - Create account
- `POST /api/auth/[...nextauth]` - NextAuth handlers

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
3. Configure environment variables
4. Deploy

### Database

For production, use a hosted PostgreSQL service:
- [Supabase](https://supabase.com)
- [Neon](https://neon.tech)
- [Railway](https://railway.app)
- [PlanetScale](https://planetscale.com) (MySQL)

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## License

MIT License - see LICENSE file for details.
