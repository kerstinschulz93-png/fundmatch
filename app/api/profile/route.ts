import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import prisma from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      include: { founderProfile: true },
    })

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    return NextResponse.json({
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        image: user.image,
      },
      profile: user.founderProfile,
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
    console.error('Update profile error:', error)
    return NextResponse.json(
      { error: 'Failed to update profile' },
      { status: 500 }
    )
  }
}
