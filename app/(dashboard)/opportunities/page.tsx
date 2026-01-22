import { Suspense } from 'react'
import { getCurrentUser } from '@/lib/auth'
import prisma from '@/lib/db'
import { rankOpportunities } from '@/lib/matching'
import { OpportunityCard } from '@/components/opportunities/opportunity-card'
import { OpportunityFilters } from '@/components/opportunities/opportunity-filters'
import { Card, CardContent } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'

interface SearchParams {
  search?: string
  type?: string
  minAmount?: string
  maxAmount?: string
  stage?: string
  deadline?: string
  sort?: string
}

async function getOpportunities(searchParams: SearchParams, userId?: string) {
  const where: any = { isActive: true }

  if (searchParams.search) {
    where.OR = [
      { name: { contains: searchParams.search, mode: 'insensitive' } },
      { description: { contains: searchParams.search, mode: 'insensitive' } },
      { organization: { contains: searchParams.search, mode: 'insensitive' } },
    ]
  }

  if (searchParams.type) {
    const types = searchParams.type.split(',')
    where.type = { in: types }
  }

  if (searchParams.minAmount) {
    where.amountMax = { gte: parseInt(searchParams.minAmount) }
  }

  if (searchParams.maxAmount) {
    where.amountMin = { lte: parseInt(searchParams.maxAmount) }
  }

  if (searchParams.deadline === 'upcoming') {
    where.deadline = { gte: new Date() }
  } else if (searchParams.deadline === 'rolling') {
    where.deadline = null
  }

  const orderBy: any = {}
  switch (searchParams.sort) {
    case 'deadline':
      orderBy.deadline = 'asc'
      break
    case 'amount':
      orderBy.amountMax = 'desc'
      break
    case 'newest':
    default:
      orderBy.createdAt = 'desc'
  }

  const opportunities = await prisma.opportunity.findMany({
    where,
    orderBy,
    take: 50,
  })

  // Get user profile for matching if logged in
  if (userId) {
    const profile = await prisma.founderProfile.findUnique({
      where: { userId },
    })

    if (profile && searchParams.sort !== 'deadline' && searchParams.sort !== 'amount') {
      // Sort by match score if no specific sort is selected
      return rankOpportunities(profile, opportunities)
    }
  }

  return opportunities.map((opp) => ({
    opportunity: opp,
    score: 50,
    reasons: ['Sign in for personalized matching'],
  }))
}

function OpportunityListSkeleton() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: 6 }).map((_, i) => (
        <Card key={i}>
          <CardContent className="pt-4">
            <Skeleton className="h-6 w-20 mb-3" />
            <Skeleton className="h-5 w-full mb-2" />
            <Skeleton className="h-4 w-3/4 mb-2" />
            <Skeleton className="h-16 w-full mb-3" />
            <Skeleton className="h-4 w-1/2 mb-2" />
            <Skeleton className="h-4 w-1/3" />
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

export default async function OpportunitiesPage({
  searchParams,
}: {
  searchParams: SearchParams
}) {
  const user = await getCurrentUser()
  const matches = await getOpportunities(searchParams, user?.id)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Funding Opportunities</h1>
        <p className="text-muted-foreground">
          Browse and filter opportunities that match your profile.
        </p>
      </div>

      <OpportunityFilters />

      <Suspense fallback={<OpportunityListSkeleton />}>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {matches.map((match) => (
            <OpportunityCard
              key={match.opportunity.id}
              opportunity={match.opportunity}
              matchScore={match.score}
              matchReasons={match.reasons}
            />
          ))}
        </div>

        {matches.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">
              No opportunities found matching your criteria.
            </p>
            <p className="text-sm text-muted-foreground mt-1">
              Try adjusting your filters or check back later.
            </p>
          </div>
        )}
      </Suspense>
    </div>
  )
}
