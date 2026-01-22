'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { useToast } from '@/components/ui/use-toast'
import { Bookmark, BookmarkCheck, Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'

interface SaveOpportunityButtonProps {
  opportunityId: string
  isSaved: boolean
  applicationStatus?: string
  className?: string
}

export function SaveOpportunityButton({
  opportunityId,
  isSaved: initialSaved,
  applicationStatus,
  className,
}: SaveOpportunityButtonProps) {
  const [isSaved, setIsSaved] = useState(initialSaved)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const { toast } = useToast()

  const handleSave = async () => {
    setIsLoading(true)

    try {
      if (isSaved) {
        // Remove from tracker
        const response = await fetch(`/api/applications/${opportunityId}`, {
          method: 'DELETE',
        })

        if (!response.ok) throw new Error('Failed to remove')

        setIsSaved(false)
        toast({
          title: 'Removed',
          description: 'Opportunity removed from your tracker.',
        })
      } else {
        // Add to tracker
        const response = await fetch('/api/applications', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ opportunityId }),
        })

        if (!response.ok) throw new Error('Failed to save')

        setIsSaved(true)
        toast({
          title: 'Saved!',
          description: 'Opportunity added to your tracker.',
        })
      }

      router.refresh()
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Something went wrong. Please try again.',
      })
    } finally {
      setIsLoading(false)
    }
  }

  // If already tracking (not just saved), show status
  if (applicationStatus && applicationStatus !== 'SAVED') {
    return (
      <Button variant="outline" className={cn(className)} disabled>
        <BookmarkCheck className="mr-2 h-4 w-4" />
        Tracking ({applicationStatus.toLowerCase()})
      </Button>
    )
  }

  return (
    <Button
      variant={isSaved ? 'secondary' : 'outline'}
      onClick={handleSave}
      disabled={isLoading}
      className={cn(className)}
    >
      {isLoading ? (
        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
      ) : isSaved ? (
        <BookmarkCheck className="mr-2 h-4 w-4" />
      ) : (
        <Bookmark className="mr-2 h-4 w-4" />
      )}
      {isSaved ? 'Saved' : 'Save'}
    </Button>
  )
}
