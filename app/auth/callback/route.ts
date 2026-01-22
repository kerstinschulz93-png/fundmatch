import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'
import prisma from '@/lib/db'

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  const next = searchParams.get('next') ?? '/dashboard'

  if (code) {
    const supabase = await createClient()
    const { data, error } = await supabase.auth.exchangeCodeForSession(code)

    if (!error && data.user) {
      // Check if user exists in our database
      const existingUser = await prisma.user.findUnique({
        where: { email: data.user.email! },
      })

      if (!existingUser) {
        // Create user and founder profile for OAuth users
        const newUser = await prisma.user.create({
          data: {
            email: data.user.email!,
            name: data.user.user_metadata?.full_name || data.user.user_metadata?.name,
            image: data.user.user_metadata?.avatar_url,
            emailVerified: new Date(),
          },
        })

        await prisma.founderProfile.create({
          data: { userId: newUser.id },
        })

        // Redirect new OAuth users to onboarding
        return NextResponse.redirect(`${origin}/onboarding`)
      }

      // Existing user - check if onboarding is complete
      const profile = await prisma.founderProfile.findUnique({
        where: { userId: existingUser.id },
      })

      if (!profile?.onboardingCompleted) {
        return NextResponse.redirect(`${origin}/onboarding`)
      }

      return NextResponse.redirect(`${origin}${next}`)
    }
  }

  // Return to login with error
  return NextResponse.redirect(`${origin}/login?error=auth_callback_error`)
}
