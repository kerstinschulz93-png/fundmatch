'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import {
  DndContext,
  DragOverlay,
  closestCorners,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragStartEvent,
  DragEndEvent,
} from '@dnd-kit/core'
import {
  SortableContext,
  verticalListSortingStrategy,
  useSortable,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { Application, Opportunity, ApplicationStatus } from '@prisma/client'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { useToast } from '@/components/ui/use-toast'
import { formatCurrency, formatDateRelative } from '@/lib/utils'
import { MoreHorizontal, Calendar, DollarSign, ExternalLink, Trash2 } from 'lucide-react'

type ApplicationWithOpportunity = Application & { opportunity: Opportunity }

interface KanbanColumn {
  id: ApplicationStatus
  title: string
  applications: ApplicationWithOpportunity[]
}

interface KanbanBoardProps {
  columns: KanbanColumn[]
}

function KanbanCard({
  application,
  isDragging,
}: {
  application: ApplicationWithOpportunity
  isDragging?: boolean
}) {
  const router = useRouter()
  const { toast } = useToast()

  const handleDelete = async () => {
    try {
      const response = await fetch(`/api/applications/${application.id}`, {
        method: 'DELETE',
      })

      if (!response.ok) throw new Error('Failed to delete')

      toast({
        title: 'Removed',
        description: 'Application removed from tracker.',
      })
      router.refresh()
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to remove application.',
      })
    }
  }

  return (
    <Card
      className={`kanban-card ${isDragging ? 'kanban-card-dragging' : ''}`}
    >
      <div className="flex items-start justify-between gap-2">
        <Link
          href={`/opportunities/${application.opportunity.id}`}
          className="flex-1 min-w-0"
        >
          <h4 className="font-medium text-sm line-clamp-2 hover:text-primary transition-colors">
            {application.opportunity.name}
          </h4>
        </Link>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8 shrink-0">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem asChild>
              <Link href={`/opportunities/${application.opportunity.id}`}>
                View Details
              </Link>
            </DropdownMenuItem>
            {application.opportunity.applicationUrl && (
              <DropdownMenuItem asChild>
                <a
                  href={application.opportunity.applicationUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <ExternalLink className="mr-2 h-4 w-4" />
                  Apply
                </a>
              </DropdownMenuItem>
            )}
            <DropdownMenuItem
              className="text-destructive focus:text-destructive"
              onClick={handleDelete}
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Remove
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {application.opportunity.organization && (
        <p className="text-xs text-muted-foreground mt-1 line-clamp-1">
          {application.opportunity.organization}
        </p>
      )}

      <div className="flex flex-wrap gap-2 mt-2 text-xs text-muted-foreground">
        {application.opportunity.amountMax && (
          <div className="flex items-center gap-1">
            <DollarSign className="h-3 w-3" />
            <span>{formatCurrency(application.opportunity.amountMax)}</span>
          </div>
        )}
        {application.opportunity.deadline && (
          <div className="flex items-center gap-1">
            <Calendar className="h-3 w-3" />
            <span>{formatDateRelative(application.opportunity.deadline)}</span>
          </div>
        )}
      </div>

      {application.notes && (
        <p className="text-xs text-muted-foreground mt-2 line-clamp-2 italic">
          {application.notes}
        </p>
      )}
    </Card>
  )
}

function SortableCard({
  application,
}: {
  application: ApplicationWithOpportunity
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: application.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  }

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      <KanbanCard application={application} />
    </div>
  )
}

function KanbanColumn({ column }: { column: KanbanColumn }) {
  const statusColors: Record<string, string> = {
    SAVED: 'bg-gray-100',
    RESEARCHING: 'bg-blue-100',
    APPLYING: 'bg-yellow-100',
    SUBMITTED: 'bg-purple-100',
    INTERVIEW: 'bg-orange-100',
    FUNDED: 'bg-green-100',
    REJECTED: 'bg-red-100',
  }

  return (
    <div className="kanban-column flex-shrink-0 w-72">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <h3 className="font-semibold">{column.title}</h3>
          <Badge variant="secondary" className={statusColors[column.id]}>
            {column.applications.length}
          </Badge>
        </div>
      </div>

      <SortableContext
        items={column.applications.map((a) => a.id)}
        strategy={verticalListSortingStrategy}
      >
        <div className="space-y-3">
          {column.applications.map((application) => (
            <SortableCard key={application.id} application={application} />
          ))}
        </div>
      </SortableContext>

      {column.applications.length === 0 && (
        <div className="text-center py-8 text-sm text-muted-foreground">
          No applications
        </div>
      )}
    </div>
  )
}

export function KanbanBoard({ columns }: KanbanBoardProps) {
  const router = useRouter()
  const { toast } = useToast()
  const [activeId, setActiveId] = useState<string | null>(null)

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor)
  )

  const allApplications = columns.flatMap((col) => col.applications)
  const activeApplication = activeId
    ? allApplications.find((a) => a.id === activeId)
    : null

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string)
  }

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event
    setActiveId(null)

    if (!over) return

    const activeApp = allApplications.find((a) => a.id === active.id)
    if (!activeApp) return

    // Find which column the item was dropped into
    let newStatus: ApplicationStatus | null = null

    // Check if dropped directly on a column
    for (const column of columns) {
      if (column.id === over.id) {
        newStatus = column.id
        break
      }
      // Check if dropped on an item in this column
      if (column.applications.some((a) => a.id === over.id)) {
        newStatus = column.id
        break
      }
    }

    if (!newStatus || newStatus === activeApp.status) return

    try {
      const response = await fetch(`/api/applications/${activeApp.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      })

      if (!response.ok) throw new Error('Failed to update')

      toast({
        title: 'Updated',
        description: `Moved to ${newStatus.toLowerCase()}`,
      })
      router.refresh()
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to update application status.',
      })
    }
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className="flex gap-4 overflow-x-auto pb-4">
        {columns.map((column) => (
          <KanbanColumn key={column.id} column={column} />
        ))}
      </div>

      <DragOverlay>
        {activeApplication && (
          <KanbanCard application={activeApplication} isDragging />
        )}
      </DragOverlay>
    </DndContext>
  )
}
