'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { supabase } from '@/lib/supabase'
import ModelViewer from '@/components/ModelViewer'
import type { Model } from '@/types'

export default function ModelDetailPage() {
  const { id } = useParams<{ id: string }>()
  const [model, setModel] = useState<Model | null>(null)
  const [related, setRelated] = useState<Model[]>([])
  const [loading, setLoading] = useState(true)
  const [purchasing, setPurchasing] = useState(false)
  const [purchased, setPurchased] = useState(false)
  const [userId, setUserId] = useState<string | null>(null)

  useEffect(() => {
    const load = async () => {
      const [{ data: m }, { data: { session } }] = await Promise.all([
        supabase.from('models').select('*').eq('id', id).single(),
        supabase.auth.getSession(),
      ])
      setModel(m)
      setUserId(session?.user?.id ?? null)

      if (m?.category) {
        const { data: rel } = await supabase
          .from('models').select('*').eq('category', m.category).neq('id', id).limit(4)
        setRelated(rel ?? [])
      }

      if (session?.user) {
        const { data: existing } = await supabase
          .from('purchases').select('id').eq('user_id', session.user.id).eq('model_id', id).single()
        if (existing) setPurchased(true)
      }
      setLoading(false)
    }
    load()
  }, [id])

  const handleAddToLibrary = async () => {
    if (!userId) { window.location.href = '/login'; return }
    setPurchasing(true)
    await supabase.from('purchases').insert({ user_id: userId, model_id: id })
    setPurchased(true)
    setPurchasing(false)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center pt-16">
        <div className="w-10 h-10 border-2 border-[#84ff00] border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (!model) {
    return (
      <div className="min-h-screen bg-black flex flex-col items-center justify-center pt-16 text-center px-4">
        <div className="text-8xl font-black text-[#1a1a1a] mb-4">404</div>
        <p className="text-white font-black text-xl uppercase mb-8">Model not found</p>
        <Link href="/models" className="bg-[#84ff00] text-black px-8 py-3 font-black text-sm tracking-widest hover:bg-[#a1ff4d] transition-colors">
          BACK TO CATALOG
        </Link>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black text-white pt-20 pb-24 px-4">
      <div className="max-w-7xl mx-auto">

        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-[9px] font-black tracking-widest text-gray-600 mb-10">
          <Link href="/models" className="hover:text-[#84ff00] transition-colors">MODELS</Link>
          <span>/</span>
          <span className="text-gray-400">{model.name.toUpperCase()}</span>
        </div>

        {/* Main layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">

          {/* 3D Viewer */}
          <div className="h-[400px] sm:h-[520px] lg:sticky lg:top-24">
            <ModelViewer modelUrl={model.model_url} fallbackImage={model.thumbnail_url} />
          </div>

          {/* Info panel */}
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }} className="space-y-8">

            {model.category && (
              <div className="text-[9px] font-black tracking-[0.4em] text-[#84ff00] uppercase">
                {model.category}
              </div>
            )}

            <h1 className="text-5xl sm:text-7xl font-black uppercase tracking-tighter leading-none">
              {model.name}
            </h1>

            {model.description && (
              <div className="border-l-2 border-[#84ff00] pl-6">
                <p className="text-gray-400 leading-relaxed">{model.description}</p>
              </div>
            )}

            {/* Tags */}
            {model.tags && model.tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {model.tags.map(tag => (
                  <span key={tag} className="text-[9px] font-black tracking-widest text-gray-500 border border-[#2a2a2a] px-3 py-1 uppercase">
                    {tag}
                  </span>
                ))}
              </div>
            )}

            {/* Price & CTA */}
            <div className="border-y border-[#1a1a1a] py-8 flex items-center justify-between gap-6">
              <div>
                <div className="text-[9px] text-gray-600 font-black tracking-widest mb-1">PRICE</div>
                <div className="text-5xl font-black text-[#84ff00]">₹{model.price}</div>
              </div>
              <button
                onClick={handleAddToLibrary}
                disabled={purchasing || purchased}
                className={`px-8 py-4 font-black text-sm tracking-widest transition-all ${
                  purchased
                    ? 'bg-[#84ff00]/10 border border-[#84ff00]/30 text-[#84ff00] cursor-default'
                    : 'bg-white text-black hover:bg-[#84ff00] hover:shadow-[0_0_24px_#84ff00] active:scale-95'
                } disabled:opacity-70`}
              >
                {purchased ? '✓ IN LIBRARY' : purchasing ? 'ADDING...' : 'ADD TO LIBRARY'}
              </button>
            </div>

            {/* Meta grid */}
            <div className="grid grid-cols-2 gap-3">
              {[
                ['FORMAT', 'GLB / GLTF'],
                ['LICENSE', 'COMMERCIAL'],
                ['ID', model.id.slice(0, 8) + '...'],
                ['ADDED', new Date(model.created_at).toLocaleDateString('en-IN')],
              ].map(([k, v]) => (
                <div key={k} className="bg-[#0a0a0a] border border-[#1a1a1a] p-4">
                  <div className="text-[8px] font-black tracking-widest text-gray-600 mb-1">{k}</div>
                  <div className="text-xs font-bold text-gray-300">{v}</div>
                </div>
              ))}
            </div>

            <Link
              href={`/request?category=${model.category ?? ''}`}
              className="block text-center border border-[#333] text-gray-400 py-3 text-[10px] font-black tracking-widest hover:border-[#84ff00] hover:text-[#84ff00] transition-all"
            >
              REQUEST SIMILAR CUSTOM MODEL →
            </Link>
          </motion.div>
        </div>

        {/* Related models */}
        {related.length > 0 && (
          <section className="mt-24">
            <h2 className="text-2xl font-black uppercase tracking-wide mb-8">
              RELATED <span className="text-[#84ff00]">MODELS</span>
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
              {related.map(m => (
                <Link key={m.id} href={`/models/${m.id}`}>
                  <div className="group bg-[#0d0d0d] border border-[#1f1f1f] hover:border-[#84ff00] transition-all overflow-hidden">
                    <div className="aspect-square bg-[#080808]">
                      {m.thumbnail_url
                        ? <img src={m.thumbnail_url} alt={m.name} className="w-full h-full object-cover opacity-70 group-hover:opacity-100 transition-opacity" />
                        : <div className="w-full h-full flex items-center justify-center text-3xl font-black text-[#1a1a1a]">3D</div>
                      }
                    </div>
                    <div className="p-3">
                      <p className="text-xs font-black uppercase tracking-tight group-hover:text-[#84ff00] transition-colors truncate">{m.name}</p>
                      <p className="text-[10px] text-[#84ff00] font-bold mt-1">₹{m.price}</p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  )
}
