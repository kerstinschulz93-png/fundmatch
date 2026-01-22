import { createClient } from '@/lib/supabase/server'
import prisma from './db'

export async function getSession() {
  const supabase = await createClient()
  const { data: { session } } = await supabase.auth.getSession()
  return session
}

export async function getUser() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  return user
}

export async function getCurrentUser() {
  const user = await getUser()
  if (!user?.email) return null

  const dbUser = await prisma.user.findUnique({
    where: { email: user.email },
    include: { founderProfile: true },
  })

  return dbUser
}

export async function requireAuth() {
  const user = await getUser()
  if (!user) {
    throw new Error('Unauthorized')
  }
  return user
}
