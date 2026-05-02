'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { supabase } from '@/lib/supabase'
import ProtectedRoute from '@/components/ProtectedRoute'
import RequestCard from '@/components/RequestCard'
import ModelCard from '@/components/ModelCard'
import type { Profile, Purchase, CustomRequest, Model } from '@/types'

function DashboardContent() {
  const [profile, setProfile] = useState<Profile | null>(null)
  const [purchases, setPurchases] = useState<(Purchase & { model: Model })[]>([])
  const [requests, setRequests] = useState<CustomRequest[]>([])
  const [totalModels, setTotalModels] = useState(0)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const load = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) return

      const uid = session.user.id

      const [{ data: prof }, { data: purch }, { data: reqs }, { count }] = await Promise.all([
        supabase.from('profiles').select('*').eq('id', uid).single(),
        supabase.from('purchases').select('*, model:models(*)').eq('user_id', uid).order('purchased_at', { ascending: false }),
        supabase.from('custom_requests').select('*').eq('user_id', uid).order('created_at', { ascending: false }),
        supabase.from('models').select('*', { count: 'exact', head: true }),
      ])

      setProfile(prof)
      setPurchases((purch as any) ?? [])
      setRequests(reqs ?? [])
      setTotalModels(count ?? 0)
      setLoading(false)
    }
    load()
  }, [])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    window.location.href = '/login'
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="w-10 h-10 border-2 border-[#84ff00] border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  const stats = [
    { label: 'MY PURCHASES', value: purchases.length, color: 'text-[#84ff00]' },
    { label: 'ACTIVE REQUESTS', value: requests.filter(r => r.status !== 'delivered').length, color: 'text-blue-400' },
    { label: 'MODELS AVAILABLE', value: totalModels, color: 'text-white' },
  ]

  return (
    <div className="min-h-screen bg-black text-white pt-24 pb-20 px-4">
      <div className="max-w-6xl mx-auto">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          className="flex flex-col sm:flex-row sm:items-start justify-between gap-6 mb-16"
        >
          <div>
            <p className="text-[9px] tracking-[0.4em] text-[#84ff00] font-black mb-2">SYSTEM STATUS: ONLINE</p>
            <h1 className="text-5xl sm:text-7xl font-black uppercase tracking-tighter leading-none">
              WELCOME,<br />
              <span className="text-[#84ff00]">{profile?.name?.toUpperCase() ?? 'USER'}</span>
            </h1>
          </div>
          <button
            onClick={handleLogout}
            className="self-start border border-red-500/40 text-red-400 px-6 py-2.5 text-[10px] font-black tracking-widest hover:bg-red-500/10 transition-colors"
          >
            LOGOUT
          </button>
        </motion.div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-16">
          {stats.map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
              className="bg-[#0a0a0a] border border-[#1a1a1a] p-6 hover:border-[#84ff00]/30 transition-colors"
            >
              <div className={`text-4xl font-black mb-2 ${s.color}`}>{s.value}</div>
              <div className="text-[9px] tracking-widest text-gray-600 font-black">{s.label}</div>
            </motion.div>
          ))}
        </div>

        {/* Quick actions */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-16">
          <Link href="/models" className="group bg-[#0a0a0a] border border-[#1a1a1a] hover:border-[#84ff00] p-8 transition-all hover:shadow-[0_0_20px_rgba(132,255,0,0.08)] relative overflow-hidden">
            <div className="absolute right-4 bottom-4 text-8xl font-black text-[#0d0d0d] group-hover:text-[#84ff00]/5 transition-colors select-none">3D</div>
            <div className="relative z-10">
              <h3 className="text-2xl font-black uppercase tracking-wide mb-2 group-hover:text-[#84ff00] transition-colors">BROWSE MODELS</h3>
              <p className="text-gray-600 text-sm">Explore the full 3D asset library.</p>
            </div>
          </Link>
          <Link href="/request" className="group bg-[#0a0a0a] border border-[#1a1a1a] hover:border-[#84ff00] p-8 transition-all hover:shadow-[0_0_20px_rgba(132,255,0,0.08)] relative overflow-hidden">
            <div className="absolute right-4 bottom-4 text-8xl font-black text-[#0d0d0d] group-hover:text-[#84ff00]/5 transition-colors select-none">✦</div>
            <div className="relative z-10">
              <h3 className="text-2xl font-black uppercase tracking-wide mb-2 group-hover:text-[#84ff00] transition-colors">REQUEST CUSTOM 3D</h3>
              <p className="text-gray-600 text-sm">Describe your vision and let us build it.</p>
            </div>
          </Link>
        </div>

        {/* My Purchases */}
        <section className="mb-16">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-black uppercase tracking-wide">MY <span className="text-[#84ff00]">PURCHASES</span></h2>
            <span className="text-[9px] text-gray-600 font-black tracking-widest">{purchases.length} ITEMS</span>
          </div>
          {purchases.length === 0 ? (
            <div className="border border-dashed border-[#1a1a1a] py-16 text-center">
              <p className="text-gray-700 text-sm font-bold uppercase tracking-widest mb-4">No purchases yet</p>
              <Link href="/models" className="text-[10px] text-[#84ff00] font-black tracking-widest hover:underline">BROWSE MODELS →</Link>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {purchases.map(p => (
                <div key={p.id} className="relative">
                  {p.model && <ModelCard model={p.model} />}
                  {p.model?.model_url && (
                    <a
                      href={p.model.model_url}
                      download
                      className="mt-2 block w-full bg-[#84ff00]/10 border border-[#84ff00]/20 text-[#84ff00] py-2 text-[9px] font-black tracking-widest text-center hover:bg-[#84ff00]/20 transition-colors"
                    >
                      ↓ DOWNLOAD
                    </a>
                  )}
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Custom Requests */}
        <section>
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-black uppercase tracking-wide">MY <span className="text-[#84ff00]">REQUESTS</span></h2>
            <Link href="/request" className="text-[10px] text-[#84ff00] font-black tracking-widest hover:underline">+ NEW REQUEST</Link>
          </div>
          {requests.length === 0 ? (
            <div className="border border-dashed border-[#1a1a1a] py-16 text-center">
              <p className="text-gray-700 text-sm font-bold uppercase tracking-widest mb-4">No requests yet</p>
              <Link href="/request" className="text-[10px] text-[#84ff00] font-black tracking-widest hover:underline">SUBMIT A REQUEST →</Link>
            </div>
          ) : (
            <div className="space-y-3">
              {requests.map(r => <RequestCard key={r.id} request={r} />)}
            </div>
          )}
        </section>
      </div>
    </div>
  )
}

export default function DashboardPage() {
  return (
    <ProtectedRoute>
      <DashboardContent />
    </ProtectedRoute>
  )
}
