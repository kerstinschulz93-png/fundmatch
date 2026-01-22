import Link from 'next/link'
import { redirect } from 'next/navigation'
import { getCurrentUser } from '@/lib/auth'
import prisma from '@/lib/db'
import { rankOpportunities } from '@/lib/matching'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { OpportunityCard } from '@/components/opportunities/opportunity-card'
import {
  ArrowRight,
  Target,
  Clock,
  TrendingUp,
  AlertCircle,
} from 'lucide-react'
import { formatDateRelative } from '@/lib/utils'

async function getDashboardData(userId: string) {
  const [profile, applications, opportunities] = await Promise.all([
    prisma.founderProfile.findUnique({
      where: { userId },
    }),
    prisma.application.findMany({
      where: { userId },
      include: { opportunity: true },
      orderBy: { updatedAt: 'desc' },
      take: 5,
    }),
    prisma.opportunity.findMany({
      where: { isActive: true },
      orderBy: { createdAt: 'desc' },
      take: 50,
    }),
  ])

  return { profile, applications, opportunities }
}

export default async function DashboardPage() {
  const user = await getCurrentUser()

  if (!user) {
    redirect('/login')
  }

  // Check if onboarding is complete
  if (!user.founderProfile?.onboardingCompleted) {
    redirect('/onboarding')
  }

  const { profile, applications, opportunities } = await getDashboardData(user.id)

  // Calculate match scores if profile exists
  const matchedOpportunities = profile
    ? rankOpportunities(profile, opportunities).slice(0, 6)
    : opportunities.slice(0, 6).map((opp) => ({
        opportunity: opp,
        score: 50,
        reasons: ['Complete your profile for better matches'],
      }))

  // Calculate profile completeness
  const profileFields = [
    profile?.companyName,
    profile?.stage,
    profile?.industries?.length,
    profile?.businessModel,
    profile?.location,
    profile?.fundingSoughtMin,
    profile?.demographics,
  ]
  const completedFields = profileFields.filter(Boolean).length
  const profileCompleteness = Math.round((completedFields / profileFields.length) * 100)

  // Get upcoming deadlines
  const upcomingDeadlines = applications
    .filter(
      (app) =>
        app.opportunity.deadline &&
        new Date(app.opportunity.deadline) > new Date() &&
        ['SAVED', 'RESEARCHING', 'APPLYING'].includes(app.status)
    )
    .sort(
      (a, b) =>
        new Date(a.opportunity.deadline!).getTime() -
        new Date(b.opportunity.deadline!).getTime()
    )
    .slice(0, 3)

  // Stats
  const stats = {
    saved: applications.filter((a) => a.status === 'SAVED').length,
    inProgress: applications.filter((a) =>
      ['RESEARCHING', 'APPLYING'].includes(a.status)
    ).length,
    submitted: applications.filter((a) =>
      ['SUBMITTED', 'INTERVIEW'].includes(a.status)
    ).length,
    funded: applications.filter((a) => a.status === 'FUNDED').length,
  }

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          Welcome back, {user.name?.split(' ')[0] || 'Founder'}!
        </h1>
        <p className="text-muted-foreground">
          Here&apos;s what&apos;s happening with your funding search.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Saved</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.saved}</div>
            <p className="text-xs text-muted-foreground">
              Opportunities to explore
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">In Progress</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.inProgress}</div>
            <p className="text-xs text-muted-foreground">
              Applications in progress
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Submitted</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.submitted}</div>
            <p className="text-xs text-muted-foreground">
              Awaiting response
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Funded</CardTitle>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              className="h-4 w-4 text-muted-foreground"
            >
              <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
            </svg>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats.funded}</div>
            <p className="text-xs text-muted-foreground">
              Successfully funded
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Top Matches */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Top Matches For You</CardTitle>
                <CardDescription>
                  Based on your profile and preferences
                </CardDescription>
              </div>
              <Link href="/opportunities">
                <Button variant="outline" size="sm">
                  View All
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2">
                {matchedOpportunities.map((match) => (
                  <OpportunityCard
                    key={match.opportunity.id}
                    opportunity={match.opportunity}
                    matchScore={match.score}
                    matchReasons={match.reasons}
                  />
                ))}
              </div>
              {matchedOpportunities.length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  <p>No opportunities found yet.</p>
                  <p className="text-sm">Check back soon for new matches!</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Profile Completeness */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Profile Completeness</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">
                  {profileCompleteness}% complete
                </span>
                {profileCompleteness < 100 && (
                  <Link href="/profile">
                    <Button variant="link" size="sm" className="h-auto p-0">
                      Complete Profile
                    </Button>
                  </Link>
                )}
              </div>
              <Progress value={profileCompleteness} className="h-2" />
              {profileCompleteness < 100 && (
                <p className="text-xs text-muted-foreground">
                  Complete your profile for better opportunity matches.
                </p>
              )}
            </CardContent>
          </Card>

          {/* Upcoming Deadlines */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Upcoming Deadlines</CardTitle>
            </CardHeader>
            <CardContent>
              {upcomingDeadlines.length > 0 ? (
                <div className="space-y-4">
                  {upcomingDeadlines.map((app) => (
                    <div
                      key={app.id}
                      className="flex items-start justify-between gap-2"
                    >
                      <div className="space-y-1">
                        <Link
                          href={`/opportunities/${app.opportunity.id}`}
                          className="text-sm font-medium hover:underline line-clamp-1"
                        >
                          {app.opportunity.name}
                        </Link>
                        <div className="flex items-center gap-2">
                          <AlertCircle className="h-3 w-3 text-orange-500" />
                          <span className="text-xs text-orange-600">
                            {formatDateRelative(app.opportunity.deadline!)}
                          </span>
                        </div>
                      </div>
                      <Badge variant="outline" className="text-xs shrink-0">
                        {app.status.toLowerCase()}
                      </Badge>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">
                  No upcoming deadlines. Save some opportunities to track them!
                </p>
              )}
              <Link href="/tracker" className="block mt-4">
                <Button variant="outline" size="sm" className="w-full">
                  View Tracker
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Link href="/opportunities" className="block">
                <Button variant="outline" className="w-full justify-start">
                  <Target className="mr-2 h-4 w-4" />
                  Browse Opportunities
                </Button>
              </Link>
              <Link href="/resources" className="block">
                <Button variant="outline" className="w-full justify-start">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    className="mr-2 h-4 w-4"
                  >
                    <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20" />
                  </svg>
                  Funding Guides
                </Button>
              </Link>
              <Link href="/stories" className="block">
                <Button variant="outline" className="w-full justify-start">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    className="mr-2 h-4 w-4"
                  >
                    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                    <circle cx="9" cy="7" r="4" />
                    <path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
                  </svg>
                  Success Stories
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
