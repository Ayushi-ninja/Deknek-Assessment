'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { supabase } from '@/lib/supabase'

type Mode = 'login' | 'signup'

export default function LoginPage() {
  const router = useRouter()
  const [mode, setMode] = useState<Mode>('login')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) router.push('/dashboard')
    })
  }, [router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setMessage('')

    try {
      if (mode === 'signup') {
        if (!name.trim()) { setError('Name is required'); setLoading(false); return }

        const { data, error: signUpError } = await supabase.auth.signUp({ email, password })
        if (signUpError) throw signUpError

        if (data.user) {
          await supabase.from('profiles').upsert({
            id: data.user.id,
            name: name.trim(),
            role: 'customer',
          })
          setMessage('Account created! Redirecting...')
          setTimeout(() => router.push('/dashboard'), 1200)
        }
      } else {
        const { error: loginError } = await supabase.auth.signInWithPassword({ email, password })
        if (loginError) throw loginError
        router.push('/dashboard')
      }
    } catch (err: any) {
      const msg = err?.message ?? 'Something went wrong'
      setError(
        msg.includes('Invalid login') ? 'Incorrect email or password.' :
        msg.includes('already registered') ? 'Email already in use. Try logging in.' :
        msg.includes('Password should') ? 'Password must be at least 6 characters.' :
        msg
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-4 pt-20">
      {/* Grid bg */}
      <div
        className="fixed inset-0 opacity-[0.03] pointer-events-none"
        style={{ backgroundImage: 'linear-gradient(#84ff00 1px,transparent 1px),linear-gradient(90deg,#84ff00 1px,transparent 1px)', backgroundSize: '40px 40px' }}
      />

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md relative z-10"
      >
        {/* Branding */}
        <div className="text-center mb-10">
          <div className="flex items-center justify-center gap-0.5 mb-2">
            <span className="text-[#84ff00] font-black text-3xl tracking-tighter">DEK</span>
            <span className="text-white font-black text-3xl tracking-tighter">NEK</span>
            <span className="text-[#84ff00]/50 font-bold text-[10px] tracking-widest ml-1 mt-1">3D</span>
          </div>
          <p className="text-[9px] tracking-[0.4em] text-gray-600">IMAGINATION TO REALITY</p>
        </div>

        <div className="bg-[#0a0a0a] border border-[#1f1f1f] p-8">
          {/* Tab toggle */}
          <div className="flex mb-8 border-b border-[#1f1f1f]">
            {(['login', 'signup'] as Mode[]).map(m => (
              <button
                key={m}
                onClick={() => { setMode(m); setError(''); setMessage('') }}
                className={`flex-1 pb-3 text-[10px] font-black tracking-widest transition-colors ${
                  mode === m ? 'text-[#84ff00] border-b-2 border-[#84ff00]' : 'text-gray-600'
                }`}
              >
                {m === 'login' ? 'LOGIN' : 'SIGN UP'}
              </button>
            ))}
          </div>

          <AnimatePresence mode="wait">
            <motion.form
              key={mode}
              initial={{ opacity: 0, x: mode === 'login' ? -10 : 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onSubmit={handleSubmit}
              className="space-y-5"
            >
              {mode === 'signup' && (
                <div>
                  <label className="block text-[9px] font-black tracking-widest text-gray-500 mb-2">FULL NAME</label>
                  <input
                    type="text"
                    value={name}
                    onChange={e => setName(e.target.value)}
                    placeholder="Your name"
                    className="w-full bg-black border border-[#2a2a2a] focus:border-[#84ff00] text-white px-4 py-3 text-sm font-medium outline-none transition-colors"
                    required
                  />
                </div>
              )}

              <div>
                <label className="block text-[9px] font-black tracking-widest text-gray-500 mb-2">EMAIL ADDRESS</label>
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full bg-black border border-[#2a2a2a] focus:border-[#84ff00] text-white px-4 py-3 text-sm font-medium outline-none transition-colors"
                  required
                />
              </div>

              <div>
                <label className="block text-[9px] font-black tracking-widest text-gray-500 mb-2">PASSWORD</label>
                <input
                  type="password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="Min. 6 characters"
                  className="w-full bg-black border border-[#2a2a2a] focus:border-[#84ff00] text-white px-4 py-3 text-sm font-medium outline-none transition-colors"
                  required
                  minLength={6}
                />
              </div>

              {error && (
                <div className="bg-red-500/5 border border-red-500/30 text-red-400 px-4 py-3 text-xs font-bold">
                  {error}
                </div>
              )}
              {message && (
                <div className="bg-[#84ff00]/5 border border-[#84ff00]/30 text-[#84ff00] px-4 py-3 text-xs font-bold">
                  {message}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#84ff00] text-black py-4 font-black text-sm tracking-widest hover:bg-[#a1ff4d] hover:shadow-[0_0_24px_#84ff00] transition-all disabled:opacity-50 disabled:cursor-not-allowed mt-2"
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
                    PROCESSING...
                  </span>
                ) : mode === 'login' ? 'ACCESS SYSTEM' : 'CREATE ACCOUNT'}
              </button>
            </motion.form>
          </AnimatePresence>
        </div>

        <p className="text-center text-[9px] text-gray-700 mt-6 tracking-widest">
          DEKNEK 3D · DEKNEK3D.IN
        </p>
      </motion.div>
    </div>
  )
}
