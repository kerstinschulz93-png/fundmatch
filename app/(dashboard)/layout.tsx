import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import prisma from '@/lib/db'
import { DashboardNav } from '@/components/dashboard/nav'
import { DashboardHeader } from '@/components/dashboard/header'

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  // Get user from database for profile info
  const dbUser = await prisma.user.findUnique({
    where: { email: user.email! },
    select: { name: true, email: true, image: true },
  })

  const userData = dbUser || {
    name: user.user_metadata?.full_name,
    email: user.email,
    image: user.user_metadata?.avatar_url,
  }

  return (
    <div className="min-h-screen bg-muted/30">
      <DashboardHeader user={userData} />
      <div className="flex">
        <DashboardNav />
        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  )
}
