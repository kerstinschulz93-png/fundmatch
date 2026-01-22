import { FounderProfile, Opportunity, Stage } from '@prisma/client'

interface MatchResult {
  opportunity: Opportunity
  score: number
  reasons: string[]
}

interface Eligibility {
  demographics?: string[]
  industries?: string[]
  stages?: string[]
  locations?: string[]
  revenueMin?: number
  revenueMax?: number
}

interface Demographics {
  genderIdentity?: string
  raceEthnicity?: string[]
  veteranStatus?: boolean
  disabilityStatus?: boolean
}

const stageOrder: Stage[] = ['IDEA', 'PRE_SEED', 'SEED', 'SERIES_A', 'SERIES_B', 'GROWTH']

export function calculateMatchScore(
  profile: FounderProfile,
  opportunity: Opportunity
): MatchResult {
  const reasons: string[] = []
  let totalScore = 0
  let totalWeight = 0

  const eligibility = (opportunity.eligibility as Eligibility) || {}
  const demographics = (profile.demographics as Demographics) || {}

  // Stage matching (weight: 25)
  if (eligibility.stages && eligibility.stages.length > 0) {
    totalWeight += 25
    if (eligibility.stages.includes(profile.stage)) {
      totalScore += 25
      reasons.push(`Matches your business stage (${profile.stage.toLowerCase().replace('_', '-')})`)
    }
  }

  // Industry matching (weight: 25)
  if (eligibility.industries && eligibility.industries.length > 0 && profile.industries.length > 0) {
    totalWeight += 25
    const matchingIndustries = profile.industries.filter((ind) =>
      eligibility.industries!.some(
        (eli) => eli.toLowerCase() === ind.toLowerCase()
      )
    )
    if (matchingIndustries.length > 0) {
      const industryScore = Math.min(25, (matchingIndustries.length / eligibility.industries.length) * 25)
      totalScore += industryScore
      reasons.push(`Industry match: ${matchingIndustries.join(', ')}`)
    }
  }

  // Location matching (weight: 15)
  if (eligibility.locations && eligibility.locations.length > 0 && profile.location) {
    totalWeight += 15
    const locationMatch = eligibility.locations.some(
      (loc) =>
        loc.toLowerCase() === profile.location?.toLowerCase() ||
        loc.toLowerCase() === 'national' ||
        loc.toLowerCase() === 'global'
    )
    if (locationMatch) {
      totalScore += 15
      reasons.push('Location eligible')
    }
  }

  // Funding amount matching (weight: 20)
  if (opportunity.amountMin !== null || opportunity.amountMax !== null) {
    totalWeight += 20
    const soughtMin = profile.fundingSoughtMin || 0
    const soughtMax = profile.fundingSoughtMax || Infinity
    const oppMin = opportunity.amountMin || 0
    const oppMax = opportunity.amountMax || Infinity

    // Check if ranges overlap
    if (soughtMin <= oppMax && soughtMax >= oppMin) {
      totalScore += 20
      reasons.push('Funding amount aligns with your needs')
    }
  }

  // Demographics matching (weight: 15)
  if (eligibility.demographics && eligibility.demographics.length > 0) {
    totalWeight += 15
    const demographicMatches: string[] = []

    eligibility.demographics.forEach((demo) => {
      const demoLower = demo.toLowerCase()
      if (demoLower.includes('women') && demographics.genderIdentity === 'woman') {
        demographicMatches.push('Women founders')
      }
      if (demoLower.includes('bipoc') && demographics.raceEthnicity?.length) {
        demographicMatches.push('BIPOC founders')
      }
      if (demoLower.includes('veteran') && demographics.veteranStatus) {
        demographicMatches.push('Veteran founders')
      }
      if (demoLower.includes('lgbtq') && demographics.genderIdentity?.includes('lgbtq')) {
        demographicMatches.push('LGBTQ+ founders')
      }
      if (demoLower.includes('disab') && demographics.disabilityStatus) {
        demographicMatches.push('Founders with disabilities')
      }
    })

    if (demographicMatches.length > 0) {
      totalScore += 15
      reasons.push(`Targeted for: ${demographicMatches.join(', ')}`)
    }
  }

  // Revenue requirements (if applicable)
  if (eligibility.revenueMin !== undefined || eligibility.revenueMax !== undefined) {
    const userRevenue = profile.revenue || 0
    const revenueMin = eligibility.revenueMin || 0
    const revenueMax = eligibility.revenueMax || Infinity

    if (userRevenue >= revenueMin && userRevenue <= revenueMax) {
      reasons.push('Meets revenue requirements')
    }
  }

  // If no eligibility criteria, give base score
  if (totalWeight === 0) {
    totalScore = 50
    totalWeight = 100
    reasons.push('Open opportunity - review eligibility details')
  }

  const finalScore = Math.round((totalScore / totalWeight) * 100)

  return {
    opportunity,
    score: finalScore,
    reasons: reasons.length > 0 ? reasons : ['General opportunity'],
  }
}

export function rankOpportunities(
  profile: FounderProfile,
  opportunities: Opportunity[]
): MatchResult[] {
  return opportunities
    .map((opp) => calculateMatchScore(profile, opp))
    .sort((a, b) => b.score - a.score)
}

export function getMatchScoreLabel(score: number): {
  label: string
  color: string
} {
  if (score >= 80) return { label: 'Excellent Match', color: 'text-green-600' }
  if (score >= 60) return { label: 'Good Match', color: 'text-blue-600' }
  if (score >= 40) return { label: 'Potential Match', color: 'text-yellow-600' }
  return { label: 'Low Match', color: 'text-gray-500' }
}
