import { redirect } from 'next/navigation'
import { getCurrentUser } from '@/lib/auth'
import prisma from '@/lib/db'
import { KanbanBoard } from '@/components/tracker/kanban-board'
import { ApplicationStatus } from '@prisma/client'

const columns: { id: ApplicationStatus; title: string }[] = [
  { id: 'SAVED', title: 'Saved' },
  { id: 'RESEARCHING', title: 'Researching' },
  { id: 'APPLYING', title: 'Applying' },
  { id: 'SUBMITTED', title: 'Submitted' },
  { id: 'INTERVIEW', title: 'Interview' },
  { id: 'FUNDED', title: 'Funded' },
  { id: 'REJECTED', title: 'Rejected' },
]

async function getApplications(userId: string) {
  return prisma.application.findMany({
    where: { userId },
    include: { opportunity: true },
    orderBy: { updatedAt: 'desc' },
  })
}

export default async function TrackerPage() {
  const user = await getCurrentUser()

  if (!user) {
    redirect('/login')
  }

  const applications = await getApplications(user.id)

  // Group applications by status
  const groupedApplications = columns.map((column) => ({
    ...column,
    applications: applications.filter((app) => app.status === column.id),
  }))

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Application Tracker</h1>
        <p className="text-muted-foreground">
          Track your funding applications through each stage of the process.
        </p>
      </div>

      <KanbanBoard columns={groupedApplications} />
    </div>
  )
}
