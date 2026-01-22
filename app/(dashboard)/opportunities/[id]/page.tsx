import { notFound } from 'next/navigation'
import Link from 'next/link'
import { getCurrentUser } from '@/lib/auth'
import prisma from '@/lib/db'
import { calculateMatchScore, getMatchScoreLabel } from '@/lib/matching'
import { formatCurrency, formatDate, formatDateRelative } from '@/lib/utils'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { SaveOpportunityButton } from '@/components/opportunities/save-button'
import {
  ArrowLeft,
  Building2,
  Calendar,
  DollarSign,
  ExternalLink,
  MapPin,
  CheckCircle2,
  Info,
} from 'lucide-react'

interface Eligibility {
  demographics?: string[]
  industries?: string[]
  stages?: string[]
  locations?: string[]
  revenueMin?: number
  revenueMax?: number
}

async function getOpportunity(id: string) {
  const opportunity = await prisma.opportunity.findUnique({
    where: { id },
  })

  return opportunity
}

async function getUserApplication(userId: string, opportunityId: string) {
  return prisma.application.findUnique({
    where: {
      userId_opportunityId: {
        userId,
        opportunityId,
      },
    },
  })
}

const typeColors: Record<string, string> = {
  GRANT: 'bg-green-100 text-green-800',
  INVESTOR: 'bg-blue-100 text-blue-800',
  LOAN: 'bg-orange-100 text-orange-800',
  COMPETITION: 'bg-purple-100 text-purple-800',
  CROWDFUNDING: 'bg-pink-100 text-pink-800',
}

export default async function OpportunityDetailPage({
  params,
}: {
  params: { id: string }
}) {
  const opportunity = await getOpportunity(params.id)

  if (!opportunity) {
    notFound()
  }

  const user = await getCurrentUser()
  const application = user
    ? await getUserApplication(user.id, opportunity.id)
    : null

  // Calculate match score if user has profile
  let matchResult = null
  if (user?.founderProfile) {
    matchResult = calculateMatchScore(user.founderProfile, opportunity)
  }

  const eligibility = (opportunity.eligibility as Eligibility) || {}
  const scoreLabel = matchResult ? getMatchScoreLabel(matchResult.score) : null

  return (
    <div className="max-w-4xl mx-auto">
      {/* Back Button */}
      <Link
        href="/opportunities"
        className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-6"
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Opportunities
      </Link>

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Badge className={typeColors[opportunity.type] || ''} variant="secondary">
              {opportunity.type.toLowerCase()}
            </Badge>
            {opportunity.isVerified && (
              <Badge variant="outline" className="gap-1">
                <CheckCircle2 className="h-3 w-3" />
                Verified
              </Badge>
            )}
          </div>
          <h1 className="text-3xl font-bold tracking-tight mb-2">
            {opportunity.name}
          </h1>
          {opportunity.organization && (
            <div className="flex items-center gap-2 text-muted-foreground">
              <Building2 className="h-4 w-4" />
              <span>{opportunity.organization}</span>
            </div>
          )}
        </div>

        <div className="flex gap-2">
          {user && (
            <SaveOpportunityButton
              opportunityId={opportunity.id}
              isSaved={!!application}
              applicationStatus={application?.status}
            />
          )}
          {opportunity.applicationUrl && (
            <a
              href={opportunity.applicationUrl}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button>
                Apply Now
                <ExternalLink className="ml-2 h-4 w-4" />
              </Button>
            </a>
          )}
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {/* Main Content */}
        <div className="md:col-span-2 space-y-6">
          {/* Match Score Card (if logged in) */}
          {matchResult && (
            <Card className="border-primary/20 bg-primary/5">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Info className="h-5 w-5 text-primary" />
                  Match Score
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-4 mb-3">
                  <div
                    className={`text-4xl font-bold ${scoreLabel?.color}`}
                  >
                    {matchResult.score}%
                  </div>
                  <div>
                    <p className={`font-semibold ${scoreLabel?.color}`}>
                      {scoreLabel?.label}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Based on your profile
                    </p>
                  </div>
                </div>
                <div className="space-y-1">
                  {matchResult.reasons.map((reason, i) => (
                    <div key={i} className="flex items-center gap-2 text-sm">
                      <CheckCircle2 className="h-4 w-4 text-green-500" />
                      <span>{reason}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Description */}
          <Card>
            <CardHeader>
              <CardTitle>About This Opportunity</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="whitespace-pre-wrap">{opportunity.description}</p>
            </CardContent>
          </Card>

          {/* Eligibility */}
          {Object.keys(eligibility).length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Eligibility Requirements</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {eligibility.demographics && eligibility.demographics.length > 0 && (
                  <div>
                    <h4 className="font-medium mb-2">Target Demographics</h4>
                    <div className="flex flex-wrap gap-2">
                      {eligibility.demographics.map((demo) => (
                        <Badge key={demo} variant="secondary">
                          {demo}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {eligibility.industries && eligibility.industries.length > 0 && (
                  <div>
                    <h4 className="font-medium mb-2">Industries</h4>
                    <div className="flex flex-wrap gap-2">
                      {eligibility.industries.map((industry) => (
                        <Badge key={industry} variant="outline">
                          {industry}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {eligibility.stages && eligibility.stages.length > 0 && (
                  <div>
                    <h4 className="font-medium mb-2">Business Stages</h4>
                    <div className="flex flex-wrap gap-2">
                      {eligibility.stages.map((stage) => (
                        <Badge key={stage} variant="outline">
                          {stage.toLowerCase().replace('_', '-')}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {eligibility.locations && eligibility.locations.length > 0 && (
                  <div>
                    <h4 className="font-medium mb-2">Locations</h4>
                    <div className="flex flex-wrap gap-2">
                      {eligibility.locations.map((location) => (
                        <Badge key={location} variant="outline">
                          <MapPin className="mr-1 h-3 w-3" />
                          {location}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {(eligibility.revenueMin !== undefined ||
                  eligibility.revenueMax !== undefined) && (
                  <div>
                    <h4 className="font-medium mb-2">Revenue Requirements</h4>
                    <p className="text-muted-foreground">
                      {eligibility.revenueMin !== undefined &&
                      eligibility.revenueMax !== undefined
                        ? `${formatCurrency(eligibility.revenueMin)} - ${formatCurrency(
                            eligibility.revenueMax
                          )}`
                        : eligibility.revenueMax !== undefined
                        ? `Up to ${formatCurrency(eligibility.revenueMax)}`
                        : `Minimum ${formatCurrency(eligibility.revenueMin!)}`}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Tags */}
          {opportunity.tags.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Tags</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {opportunity.tags.map((tag) => (
                    <Badge key={tag} variant="secondary">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Key Details */}
          <Card>
            <CardHeader>
              <CardTitle>Key Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Amount */}
              {(opportunity.amountMin || opportunity.amountMax) && (
                <div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                    <DollarSign className="h-4 w-4" />
                    <span>Funding Amount</span>
                  </div>
                  <p className="font-semibold">
                    {opportunity.amountMin && opportunity.amountMax
                      ? `${formatCurrency(opportunity.amountMin)} - ${formatCurrency(
                          opportunity.amountMax
                        )}`
                      : opportunity.amountMax
                      ? `Up to ${formatCurrency(opportunity.amountMax)}`
                      : `From ${formatCurrency(opportunity.amountMin!)}`}
                  </p>
                </div>
              )}

              <Separator />

              {/* Deadline */}
              <div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                  <Calendar className="h-4 w-4" />
                  <span>Deadline</span>
                </div>
                <p className="font-semibold">
                  {opportunity.deadline
                    ? formatDate(opportunity.deadline)
                    : 'Rolling / Open'}
                </p>
                {opportunity.deadline && (
                  <p className="text-sm text-muted-foreground">
                    {formatDateRelative(opportunity.deadline)}
                  </p>
                )}
              </div>

              <Separator />

              {/* Type */}
              <div>
                <div className="text-sm text-muted-foreground mb-1">Type</div>
                <Badge
                  className={typeColors[opportunity.type] || ''}
                  variant="secondary"
                >
                  {opportunity.type.toLowerCase()}
                </Badge>
              </div>
            </CardContent>
          </Card>

          {/* CTA */}
          <Card>
            <CardContent className="pt-6">
              <div className="space-y-3">
                {user && (
                  <SaveOpportunityButton
                    opportunityId={opportunity.id}
                    isSaved={!!application}
                    applicationStatus={application?.status}
                    className="w-full"
                  />
                )}
                {opportunity.applicationUrl && (
                  <a
                    href={opportunity.applicationUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block"
                  >
                    <Button className="w-full">
                      Apply Now
                      <ExternalLink className="ml-2 h-4 w-4" />
                    </Button>
                  </a>
                )}
                {!user && (
                  <div className="text-center">
                    <p className="text-sm text-muted-foreground mb-2">
                      Sign in to save and track this opportunity
                    </p>
                    <Link href="/login">
                      <Button variant="outline" className="w-full">
                        Sign In
                      </Button>
                    </Link>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
