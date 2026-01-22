import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import prisma from '@/lib/db'

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.email) {
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
    const user = await prisma.user.update({
      where: { email: session.user.email },
      data: { name },
    })

    // Upsert founder profile
    const profile = await prisma.founderProfile.upsert({
      where: { userId: user.id },
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
        userId: user.id,
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
