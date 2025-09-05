'use client'

import { Auth } from '@supabase/auth-ui-react'
import { ThemeSupa } from '@supabase/auth-ui-shared'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

export default function AuthPage() {
  const [supabase] = useState(() => createClientComponentClient())
  const router = useRouter()
  const [session, setSession] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const getSession = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      setSession(session)
      setLoading(false)

      if (session) {
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
  }, [supabase, router])

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (session) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full">
          <h1 className="text-2xl font-bold text-center mb-4">Welcome!</h1>
          <p className="text-gray-600 text-center mb-6">
            You are already signed in as {session.user.email}
          </p>
          <button
            onClick={() => supabase.auth.signOut()}
            className="w-full bg-red-600 text-white py-2 px-4 rounded hover:bg-red-700 transition-colors"
          >
            Sign Out
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-md mx-auto bg-white rounded-lg shadow-md p-8">
          <h1 className="text-2xl font-bold text-center mb-8 text-gray-900">
            Sign in to KU Online
          </h1>
          
          <Auth
            supabaseClient={supabase}
            appearance={{
              theme: ThemeSupa,
              variables: {
                default: {
                  colors: {
                    brand: '#2563eb',
                    brandAccent: '#1d4ed8',
                  },
                },
              },
            }}
            providers={['google']}
            redirectTo={`${window.location.origin}/auth/callback`}
            showLinks={true}
            view="sign_in"
          />
        </div>
      </div>
    </div>
  )
}
