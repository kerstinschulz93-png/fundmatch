import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import prisma from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const dbUser = await prisma.user.findUnique({
      where: { email: user.email },
      include: { founderProfile: true },
    })

    if (!dbUser) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    return NextResponse.json({
      user: {
        id: dbUser.id,
        name: dbUser.name,
        email: dbUser.email,
        image: dbUser.image,
      },
      profile: dbUser.founderProfile,
    })
  } catch (error) {
    console.error('Get profile error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch profile' },
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest) {
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
    console.error('Update profile error:', error)
    return NextResponse.json(
      { error: 'Failed to update profile' },
      { status: 500 }
    )
  }
}
