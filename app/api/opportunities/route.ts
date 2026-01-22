import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const search = searchParams.get('search')
    const type = searchParams.get('type')
    const minAmount = searchParams.get('minAmount')
    const maxAmount = searchParams.get('maxAmount')
    const deadline = searchParams.get('deadline')
    const limit = parseInt(searchParams.get('limit') || '50')
    const offset = parseInt(searchParams.get('offset') || '0')

    const where: any = { isActive: true }

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
        { organization: { contains: search, mode: 'insensitive' } },
      ]
    }

    if (type) {
      const types = type.split(',')
      where.type = { in: types }
    }

    if (minAmount) {
      where.amountMax = { gte: parseInt(minAmount) }
    }

    if (maxAmount) {
      where.amountMin = { lte: parseInt(maxAmount) }
    }

    if (deadline === 'upcoming') {
      where.deadline = { gte: new Date() }
    } else if (deadline === 'rolling') {
      where.deadline = null
    }

    const [opportunities, total] = await Promise.all([
      prisma.opportunity.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        take: limit,
        skip: offset,
      }),
      prisma.opportunity.count({ where }),
    ])

    return NextResponse.json({
      data: opportunities,
      total,
      page: Math.floor(offset / limit) + 1,
      pageSize: limit,
      totalPages: Math.ceil(total / limit),
    })
  } catch (error) {
    console.error('Get opportunities error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch opportunities' },
      { status: 500 }
    )
  }
}
