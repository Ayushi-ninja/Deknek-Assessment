'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'

interface Props {
  children: React.ReactNode
  adminOnly?: boolean
}

export default function ProtectedRoute({ children, adminOnly = false }: Props) {
  const router = useRouter()
  const [authorized, setAuthorized] = useState(false)
  const [checking, setChecking] = useState(true)

  useEffect(() => {
    const check = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) { router.push('/login'); return }

      if (adminOnly) {
        const { data: profile } = await supabase
          .from('profiles').select('role').eq('id', session.user.id).single()
        if (profile?.role !== 'admin') { router.push('/dashboard'); return }
      }

      setAuthorized(true)
      setChecking(false)
    }
    check()
  }, [router, adminOnly])

  if (checking) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-2 border-[#84ff00] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-[#84ff00] font-black text-xs tracking-[0.3em]">AUTHENTICATING...</p>
        </div>
      </div>
    )
  }

  if (!authorized) return null
  return <>{children}</>
}
