'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter, usePathname } from 'next/navigation'
import { AnimatePresence, motion } from 'framer-motion'
import { supabase } from '@/lib/supabase'
import type { Profile } from '@/types'

export default function Navbar() {
  const router = useRouter()
  const pathname = usePathname()
  const [profile, setProfile] = useState<Profile | null>(null)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const loadProfile = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) return
      const { data } = await supabase.from('profiles').select('*').eq('id', session.user.id).single()
      setProfile(data)
    }
    loadProfile()

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_e, session) => {
      if (session) {
        const { data } = await supabase.from('profiles').select('*').eq('id', session.user.id).single()
        setProfile(data)
      } else {
        setProfile(null)
      }
    })
    return () => subscription.unsubscribe()
  }, [])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    setProfile(null)
    router.push('/login')
  }

  const navLinks = [
    { href: '/', label: 'HOME' },
    { href: '/models', label: 'MODELS' },
    { href: '/request', label: 'CUSTOM 3D' },
    ...(profile?.role === 'admin' ? [{ href: '/admin', label: 'ADMIN' }] : []),
  ]

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-black/95 backdrop-blur-md border-b border-[#84ff00]/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">

          {/* Logo */}
          <Link href="/" className="flex items-center gap-0.5 group">
            <span className="text-[#84ff00] font-black text-xl tracking-tighter group-hover:neon-text transition-all">DEK</span>
            <span className="text-white font-black text-xl tracking-tighter">NEK</span>
            <span className="text-[#84ff00]/50 font-bold text-[10px] tracking-widest ml-1.5 mt-0.5">3D</span>
          </Link>

          {/* Desktop links */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map(link => (
              <Link
                key={link.href}
                href={link.href}
                className={`text-[10px] font-black tracking-widest transition-colors ${
                  pathname === link.href ? 'text-[#84ff00]' : 'text-gray-500 hover:text-white'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Auth controls */}
          <div className="hidden md:flex items-center gap-4">
            {profile ? (
              <>
                <Link href="/dashboard" className="flex items-center gap-2 group">
                  <div className="w-8 h-8 bg-[#84ff00] text-black font-black text-sm flex items-center justify-center hover:shadow-[0_0_12px_#84ff00] transition-shadow">
                    {(profile.name || 'U')[0].toUpperCase()}
                  </div>
                  <span className="text-[10px] font-bold text-gray-500 group-hover:text-white transition-colors tracking-widest">
                    {profile.name?.toUpperCase() ?? 'ACCOUNT'}
                  </span>
                </Link>
                <button
                  onClick={handleLogout}
                  className="text-[10px] font-black text-red-500 hover:text-red-400 tracking-widest transition-colors"
                >
                  LOGOUT
                </button>
              </>
            ) : (
              <Link
                href="/login"
                className="bg-[#84ff00] text-black px-4 py-2 text-[10px] font-black tracking-widest hover:bg-[#a1ff4d] hover:shadow-[0_0_16px_#84ff00] transition-all"
              >
                LOGIN
              </Link>
            )}
          </div>

          {/* Mobile hamburger */}
          <button
            className="md:hidden flex flex-col gap-1.5 p-1"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
          >
            <span className={`block w-6 h-0.5 bg-white transition-all origin-center ${menuOpen ? 'rotate-45 translate-y-2' : ''}`} />
            <span className={`block w-6 h-0.5 bg-white transition-all ${menuOpen ? 'opacity-0 scale-x-0' : ''}`} />
            <span className={`block w-6 h-0.5 bg-white transition-all origin-center ${menuOpen ? '-rotate-45 -translate-y-2' : ''}`} />
          </button>
        </div>
      </div>

      {/* Mobile drawer */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="md:hidden overflow-hidden border-t border-[#84ff00]/10 bg-black"
          >
            <div className="px-4 py-6 space-y-5">
              {navLinks.map(link => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMenuOpen(false)}
                  className={`block text-sm font-black tracking-widest ${pathname === link.href ? 'text-[#84ff00]' : 'text-gray-400'}`}
                >
                  {link.label}
                </Link>
              ))}
              <div className="pt-4 border-t border-[#1a1a1a]">
                {profile ? (
                  <>
                    <Link href="/dashboard" onClick={() => setMenuOpen(false)} className="block text-sm font-black text-white mb-3 tracking-widest">
                      DASHBOARD
                    </Link>
                    <button onClick={handleLogout} className="text-sm font-black text-red-500 tracking-widest">
                      LOGOUT
                    </button>
                  </>
                ) : (
                  <Link href="/login" onClick={() => setMenuOpen(false)} className="block text-sm font-black text-[#84ff00] tracking-widest">
                    LOGIN / SIGN UP
                  </Link>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  )
}
