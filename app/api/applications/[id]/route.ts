import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import prisma from '@/lib/db'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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

    const application = await prisma.application.findFirst({
      where: {
        id: params.id,
        userId: dbUser.id,
      },
      include: { opportunity: true },
    })

    if (!application) {
      return NextResponse.json(
        { error: 'Application not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(application)
  } catch (error) {
    console.error('Get application error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch application' },
      { status: 500 }
    )
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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
    const { status, notes, documents } = body

    // Verify ownership
    const existing = await prisma.application.findFirst({
      where: {
        id: params.id,
        userId: dbUser.id,
      },
    })

    if (!existing) {
      return NextResponse.json(
        { error: 'Application not found' },
        { status: 404 }
      )
    }

    const updateData: any = {}
    if (status) updateData.status = status
    if (notes !== undefined) updateData.notes = notes
    if (documents !== undefined) updateData.documents = documents
    if (status === 'SUBMITTED') updateData.submittedAt = new Date()

    const application = await prisma.application.update({
      where: { id: params.id },
      data: updateData,
      include: { opportunity: true },
    })

    return NextResponse.json(application)
  } catch (error) {
    console.error('Update application error:', error)
    return NextResponse.json(
      { error: 'Failed to update application' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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

    // Try to find by application ID first
    let application = await prisma.application.findFirst({
      where: {
        id: params.id,
        userId: dbUser.id,
      },
    })

    // If not found, try to find by opportunity ID (for the save button)
    if (!application) {
      application = await prisma.application.findFirst({
        where: {
          opportunityId: params.id,
          userId: dbUser.id,
        },
      })
    }

    if (!application) {
      return NextResponse.json(
        { error: 'Application not found' },
        { status: 404 }
      )
    }

    await prisma.application.delete({
      where: { id: application.id },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Delete application error:', error)
    return NextResponse.json(
      { error: 'Failed to delete application' },
      { status: 500 }
    )
  }
}
