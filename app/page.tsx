'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { supabase } from '@/lib/supabase'
import ModelCard from '@/components/ModelCard'
import type { Model } from '@/types'

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.6, delay },
})

const CATEGORIES = [
  { name: 'Animals', icon: '🐉' },
  { name: 'Characters', icon: '🤖' },
  { name: 'Architecture', icon: '🏛️' },
  { name: 'Vehicles', icon: '🚀' },
  { name: 'Fantasy', icon: '⚔️' },
]

const STEPS = [
  { step: '01', title: 'BROWSE', desc: 'Explore thousands of high-quality 3D assets across all categories.' },
  { step: '02', title: 'REQUEST', desc: 'Submit a custom order — describe your vision, upload a reference image.' },
  { step: '03', title: 'DOWNLOAD', desc: 'Get your model delivered as a production-ready .GLB file.' },
]

export default function LandingPage() {
  const [featured, setFeatured] = useState<Model[]>([])

  useEffect(() => {
    supabase.from('models').select('*').eq('is_featured', true).limit(4)
      .then(({ data }) => setFeatured(data ?? []))
  }, [])

  return (
    <div className="bg-black text-white overflow-x-hidden">

      {/* ── HERO ── */}
      <section className="relative min-h-screen flex flex-col items-center justify-center text-center px-4 pt-24 pb-20">
        {/* Grid bg */}
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{ backgroundImage: 'linear-gradient(#84ff00 1px,transparent 1px),linear-gradient(90deg,#84ff00 1px,transparent 1px)', backgroundSize: '60px 60px' }}
        />
        {/* Glow orb */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#84ff00]/5 rounded-full blur-[120px] pointer-events-none" />

        <div className="relative z-10 max-w-5xl mx-auto">
          <motion.div {...fadeUp(0)}>
            <span className="inline-block text-[10px] font-black tracking-[0.4em] text-[#84ff00] border border-[#84ff00]/30 px-4 py-1.5 mb-8">
              IMAGINATION TO REALITY
            </span>
          </motion.div>

          <motion.h1 {...fadeUp(0.1)} className="text-5xl sm:text-7xl lg:text-9xl font-black uppercase leading-[0.9] tracking-tighter mb-8">
            UNLIMITED<br />
            <span className="text-[#84ff00]">3D MODELS</span><br />
            FOR DESIGN
          </motion.h1>

          <motion.p {...fadeUp(0.2)} className="text-gray-400 text-lg max-w-xl mx-auto mb-12 leading-relaxed">
            AI-powered marketplace for premium 3D assets. Browse the catalog or request fully custom models from our studio team.
          </motion.p>

          <motion.div {...fadeUp(0.3)} className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/models"
              className="bg-[#84ff00] text-black px-10 py-4 font-black text-sm tracking-widest hover:bg-[#a1ff4d] hover:shadow-[0_0_30px_#84ff00] transition-all"
            >
              BROWSE MODELS
            </Link>
            <Link
              href="/request"
              className="border border-[#333] text-white px-10 py-4 font-black text-sm tracking-widest hover:border-[#84ff00] hover:text-[#84ff00] transition-all"
            >
              REQUEST CUSTOM 3D
            </Link>
          </motion.div>
        </div>

        {/* Scroll hint */}
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.5 }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
        >
          <div className="w-px h-12 bg-gradient-to-b from-[#84ff00] to-transparent" />
          <span className="text-[8px] tracking-[0.4em] text-gray-600">SCROLL</span>
        </motion.div>
      </section>

      {/* ── FEATURED MODELS ── */}
      {featured.length > 0 && (
        <section className="py-24 px-4 max-w-7xl mx-auto">
          <motion.div {...fadeUp()} className="flex items-end justify-between mb-12">
            <div>
              <p className="text-[9px] tracking-[0.4em] text-[#84ff00] font-black mb-3">HANDPICKED</p>
              <h2 className="text-4xl sm:text-6xl font-black uppercase tracking-tight">
                FEATURED<br /><span className="text-[#84ff00]">ASSETS</span>
              </h2>
            </div>
            <Link href="/models" className="text-[10px] font-black tracking-widest text-gray-500 hover:text-[#84ff00] transition-colors hidden sm:block">
              VIEW ALL →
            </Link>
          </motion.div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            {featured.map((m, i) => (
              <motion.div key={m.id} {...fadeUp(i * 0.08)}>
                <ModelCard model={m} />
              </motion.div>
            ))}
          </div>
          <div className="text-center mt-8 sm:hidden">
            <Link href="/models" className="text-[10px] font-black tracking-widest text-[#84ff00]">VIEW ALL MODELS →</Link>
          </div>
        </section>
      )}

      {/* ── HOW IT WORKS ── */}
      <section className="py-24 px-4 border-y border-[#111]">
        <div className="max-w-5xl mx-auto">
          <motion.div {...fadeUp()} className="text-center mb-16">
            <p className="text-[9px] tracking-[0.4em] text-[#84ff00] font-black mb-3">SIMPLE PROCESS</p>
            <h2 className="text-4xl sm:text-6xl font-black uppercase tracking-tight">HOW IT <span className="text-[#84ff00]">WORKS</span></h2>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {STEPS.map((s, i) => (
              <motion.div key={s.step} {...fadeUp(i * 0.1)} className="relative p-8 border border-[#1a1a1a] hover:border-[#84ff00]/30 transition-colors group">
                <div className="text-7xl font-black text-[#0d0d0d] group-hover:text-[#84ff00]/10 transition-colors absolute top-4 right-4 leading-none select-none">
                  {s.step}
                </div>
                <div className="relative z-10">
                  <div className="w-10 h-0.5 bg-[#84ff00] mb-6" />
                  <h3 className="text-2xl font-black tracking-widest mb-3">{s.title}</h3>
                  <p className="text-gray-500 text-sm leading-relaxed">{s.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CATEGORIES ── */}
      <section className="py-24 px-4">
        <div className="max-w-5xl mx-auto">
          <motion.div {...fadeUp()} className="text-center mb-16">
            <p className="text-[9px] tracking-[0.4em] text-[#84ff00] font-black mb-3">EXPLORE</p>
            <h2 className="text-4xl sm:text-6xl font-black uppercase tracking-tight">BROWSE BY <span className="text-[#84ff00]">CATEGORY</span></h2>
          </motion.div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
            {CATEGORIES.map((cat, i) => (
              <motion.div key={cat.name} {...fadeUp(i * 0.08)}>
                <Link
                  href={`/models?category=${cat.name}`}
                  className="group block border border-[#1a1a1a] hover:border-[#84ff00] p-6 text-center transition-all hover:shadow-[0_0_20px_rgba(132,255,0,0.1)]"
                >
                  <div className="text-4xl mb-3 group-hover:scale-110 transition-transform block">{cat.icon}</div>
                  <div className="text-[10px] font-black tracking-widest text-gray-500 group-hover:text-[#84ff00] transition-colors">
                    {cat.name.toUpperCase()}
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA BANNER ── */}
      <section className="py-24 px-4">
        <motion.div {...fadeUp()} className="max-w-4xl mx-auto text-center border border-[#84ff00]/20 p-12 md:p-20 relative overflow-hidden">
          <div className="absolute inset-0 bg-[#84ff00]/3 pointer-events-none" />
          <div className="relative z-10">
            <h2 className="text-4xl sm:text-6xl font-black uppercase tracking-tight mb-6">
              NEED A <span className="text-[#84ff00]">CUSTOM</span> 3D MODEL?
            </h2>
            <p className="text-gray-400 mb-10 max-w-lg mx-auto">
              Describe your idea, upload a reference, and our team delivers a production-ready .GLB file tailored to your spec.
            </p>
            <Link
              href="/request"
              className="inline-block bg-[#84ff00] text-black px-12 py-4 font-black text-sm tracking-widest hover:bg-[#a1ff4d] hover:shadow-[0_0_40px_#84ff00] transition-all"
            >
              START YOUR REQUEST
            </Link>
          </div>
        </motion.div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="border-t border-[#111] py-12 px-4">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-1 mb-1">
              <span className="text-[#84ff00] font-black text-lg">DEK</span>
              <span className="text-white font-black text-lg">NEK</span>
              <span className="text-[#84ff00]/50 font-bold text-[9px] tracking-widest ml-1">3D</span>
            </div>
            <p className="text-[9px] text-gray-600 tracking-widest">IMAGINATION TO REALITY</p>
          </div>
          <div className="flex gap-8">
            {['/', '/models', '/request', '/login'].map((href, i) => (
              <Link key={href} href={href} className="text-[9px] font-black tracking-widest text-gray-600 hover:text-[#84ff00] transition-colors">
                {['HOME', 'MODELS', 'CUSTOM 3D', 'LOGIN'][i]}
              </Link>
            ))}
          </div>
          <div className="text-[9px] text-gray-700 tracking-widest">
            © 2026 DEKNEK3D.IN — ALL RIGHTS RESERVED
          </div>
        </div>
      </footer>
    </div>
  )
}
