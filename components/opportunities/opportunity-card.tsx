'use client'

import Link from 'next/link'
import { Opportunity } from '@prisma/client'
import { Card, CardContent, CardFooter } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { formatCurrency, formatDateRelative } from '@/lib/utils'
import { getMatchScoreLabel } from '@/lib/matching'
import { Calendar, Building2, DollarSign, Info, ExternalLink } from 'lucide-react'

interface OpportunityCardProps {
  opportunity: Opportunity
  matchScore?: number
  matchReasons?: string[]
  showSaveButton?: boolean
  onSave?: () => void
}

const typeColors: Record<string, string> = {
  GRANT: 'bg-green-100 text-green-800',
  INVESTOR: 'bg-blue-100 text-blue-800',
  LOAN: 'bg-orange-100 text-orange-800',
  COMPETITION: 'bg-purple-100 text-purple-800',
  CROWDFUNDING: 'bg-pink-100 text-pink-800',
}

export function OpportunityCard({
  opportunity,
  matchScore,
  matchReasons,
  showSaveButton = true,
  onSave,
}: OpportunityCardProps) {
  const scoreLabel = matchScore ? getMatchScoreLabel(matchScore) : null

  return (
    <Card className="flex flex-col h-full hover:shadow-md transition-shadow">
      <CardContent className="flex-1 pt-4">
        <div className="flex items-start justify-between gap-2 mb-3">
          <Badge className={typeColors[opportunity.type] || ''} variant="secondary">
            {opportunity.type.toLowerCase()}
          </Badge>
          {matchScore !== undefined && (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="flex items-center gap-1">
                    <span className={`text-sm font-semibold ${scoreLabel?.color}`}>
                      {matchScore}%
                    </span>
                    <Info className="h-3 w-3 text-muted-foreground" />
                  </div>
                </TooltipTrigger>
                <TooltipContent className="max-w-xs">
                  <p className="font-semibold mb-1">{scoreLabel?.label}</p>
                  {matchReasons && matchReasons.length > 0 && (
                    <ul className="text-xs space-y-1">
                      {matchReasons.map((reason, i) => (
                        <li key={i}>• {reason}</li>
                      ))}
                    </ul>
                  )}
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
        </div>

        <Link href={`/opportunities/${opportunity.id}`}>
          <h3 className="font-semibold mb-2 line-clamp-2 hover:text-primary transition-colors">
            {opportunity.name}
          </h3>
        </Link>

        {opportunity.organization && (
          <div className="flex items-center gap-1 text-sm text-muted-foreground mb-2">
            <Building2 className="h-3 w-3" />
            <span className="line-clamp-1">{opportunity.organization}</span>
          </div>
        )}

        <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
          {opportunity.description}
        </p>

        <div className="space-y-1">
          {(opportunity.amountMin || opportunity.amountMax) && (
            <div className="flex items-center gap-1 text-sm">
              <DollarSign className="h-3 w-3 text-muted-foreground" />
              <span>
                {opportunity.amountMin && opportunity.amountMax
                  ? `${formatCurrency(opportunity.amountMin)} - ${formatCurrency(
                      opportunity.amountMax
                    )}`
                  : opportunity.amountMax
                  ? `Up to ${formatCurrency(opportunity.amountMax)}`
                  : `From ${formatCurrency(opportunity.amountMin!)}`}
              </span>
            </div>
          )}

          <div className="flex items-center gap-1 text-sm">
            <Calendar className="h-3 w-3 text-muted-foreground" />
            <span>
              {opportunity.deadline
                ? formatDateRelative(opportunity.deadline)
                : 'Rolling deadline'}
            </span>
          </div>
        </div>

        {opportunity.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-3">
            {opportunity.tags.slice(0, 3).map((tag) => (
              <Badge key={tag} variant="outline" className="text-xs">
                {tag}
              </Badge>
            ))}
            {opportunity.tags.length > 3 && (
              <Badge variant="outline" className="text-xs">
                +{opportunity.tags.length - 3}
              </Badge>
            )}
          </div>
        )}
      </CardContent>

      <CardFooter className="pt-0 gap-2">
        <Link href={`/opportunities/${opportunity.id}`} className="flex-1">
          <Button variant="outline" size="sm" className="w-full">
            View Details
          </Button>
        </Link>
        {opportunity.applicationUrl && (
          <a
            href={opportunity.applicationUrl}
            target="_blank"
            rel="noopener noreferrer"
          >
            <Button size="sm" variant="ghost">
              <ExternalLink className="h-4 w-4" />
            </Button>
          </a>
        )}
      </CardFooter>
    </Card>
  )
}
