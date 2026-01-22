import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import prisma from '@/lib/db'

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const {
      name,
      location,
      companyName,
      stage,
      industries,
      businessModel,
      teamSize,
      fundingSoughtMin,
      fundingSoughtMax,
      geographicFocus,
      revenue,
      demographics,
    } = body

    // Update user name if provided
    const dbUser = await prisma.user.update({
      where: { email: user.email },
      data: { name },
    })

    // Upsert founder profile
    const profile = await prisma.founderProfile.upsert({
      where: { userId: dbUser.id },
      update: {
        companyName,
        stage,
        industries,
        businessModel,
        teamSize,
        fundingSoughtMin,
        fundingSoughtMax,
        geographicFocus,
        revenue,
        location,
        demographics,
        onboardingCompleted: true,
      },
      create: {
        userId: dbUser.id,
        companyName,
        stage,
        industries,
        businessModel,
        teamSize,
        fundingSoughtMin,
        fundingSoughtMax,
        geographicFocus,
        revenue,
        location,
        demographics,
        onboardingCompleted: true,
      },
    })

    return NextResponse.json({ success: true, profile })
  } catch (error) {
    console.error('Onboarding error:', error)
    return NextResponse.json(
      { error: 'Failed to save profile' },
      { status: 500 }
    )
  }
}
