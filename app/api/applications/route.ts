import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import prisma from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get Prisma user by email
    const dbUser = await prisma.user.findUnique({
      where: { email: user.email! },
    })

    if (!dbUser) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    const applications = await prisma.application.findMany({
      where: { userId: dbUser.id },
      include: { opportunity: true },
      orderBy: { updatedAt: 'desc' },
    })

    return NextResponse.json(applications)
  } catch (error) {
    console.error('Get applications error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch applications' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get Prisma user by email
    const dbUser = await prisma.user.findUnique({
      where: { email: user.email! },
    })

    if (!dbUser) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    const body = await request.json()
    const { opportunityId, notes } = body

    if (!opportunityId) {
      return NextResponse.json(
        { error: 'Opportunity ID is required' },
        { status: 400 }
      )
    }

    // Check if opportunity exists
    const opportunity = await prisma.opportunity.findUnique({
      where: { id: opportunityId },
    })

    if (!opportunity) {
      return NextResponse.json(
        { error: 'Opportunity not found' },
        { status: 404 }
      )
    }

    // Check if already tracking
    const existing = await prisma.application.findUnique({
      where: {
        userId_opportunityId: {
          userId: dbUser.id,
          opportunityId,
        },
      },
    })

    if (existing) {
      return NextResponse.json(
        { error: 'Already tracking this opportunity' },
        { status: 400 }
      )
    }

    const application = await prisma.application.create({
      data: {
        userId: dbUser.id,
        opportunityId,
        notes,
        status: 'SAVED',
      },
      include: { opportunity: true },
    })

    return NextResponse.json(application, { status: 201 })
  } catch (error) {
    console.error('Create application error:', error)
    return NextResponse.json(
      { error: 'Failed to create application' },
      { status: 500 }
    )
  }
}
