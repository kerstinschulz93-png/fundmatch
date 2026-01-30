import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import prisma from '@/lib/db'
import { rankOpportunities } from '@/lib/matching'

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const dbUser = await prisma.user.findUnique({
      where: { email: user.email! },
    })

    if (!dbUser) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const searchParams = request.nextUrl.searchParams
    const limit = parseInt(searchParams.get('limit') || '10')

    // Get user profile
    const profile = await prisma.founderProfile.findUnique({
      where: { userId: dbUser.id },
    })

    if (!profile) {
      return NextResponse.json(
        { error: 'Profile not found. Please complete your profile.' },
        { status: 400 }
      )
    }

    // Get active opportunities
    const opportunities = await prisma.opportunity.findMany({
      where: { isActive: true },
      orderBy: { createdAt: 'desc' },
      take: 100, // Get more to rank
    })

    // Rank opportunities
    const rankedOpportunities = rankOpportunities(profile, opportunities).slice(
      0,
      limit
    )

    return NextResponse.json({
      data: rankedOpportunities,
      total: rankedOpportunities.length,
    })
  } catch (error) {
    console.error('Get recommended opportunities error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch recommendations' },
      { status: 500 }
    )
  }
}
