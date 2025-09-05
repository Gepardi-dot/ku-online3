'use client'
import { Auth } from '@supabase/auth-ui-react'
import { ThemeSupa } from '@supabase/auth-ui-shared'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import type { Session } from '@supabase/supabase-js'

export default function AuthPage() {
  const [supabase] = useState(() => createClientComponentClient())
  const router = useRouter()
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const getSession = async () => {
      const { data } = await supabase.auth.getSession()
      setSession(data.session)
      setLoading(false)
      if (data.session) {
        router.push('/')
      }
    }

    getSession()

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session)
        if (event === 'SIGNED_IN') {
          router.push('/')
        }
      }
    )

    return () => subscription.unsubscribe()
  }, [supabase.auth, router])

  if (loading) {
    return <div>Loading...</div>
  }

  if (session) {
    return null
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-md">
      <h1 className="text-3xl font-bold text-center mb-8">Sign In</h1>
      <Auth
        supabaseClient={supabase}
        appearance={{ theme: ThemeSupa }}
        theme="default"
        providers={['google', 'github']}
        redirectTo={`${location.origin}/auth/callback`}
      />
    </div>
  )
}
