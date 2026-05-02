'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { supabase } from '@/lib/supabase'
import ProtectedRoute from '@/components/ProtectedRoute'

function RequestForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [description, setDescription] = useState('')
  const [budget, setBudget] = useState('')
  const [deadline, setDeadline] = useState('')
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState('')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    const cat = searchParams.get('category')
    if (cat) setDescription(`I need a custom 3D model in the ${cat} category. `)
  }, [searchParams])

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setImageFile(file)
    setImagePreview(URL.createObjectURL(file))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!description.trim()) { setError('Please describe your model.'); return }
    setLoading(true)
    setError('')

    try {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) { router.push('/login'); return }

      let imageUrl: string | null = null

      if (imageFile) {
        const ext = imageFile.name.split('.').pop()
        const path = `${session.user.id}/${Date.now()}.${ext}`
        const { error: uploadError } = await supabase.storage
          .from('reference-images')
          .upload(path, imageFile, { upsert: true })

        if (!uploadError) {
          const { data: { publicUrl } } = supabase.storage
            .from('reference-images')
            .getPublicUrl(path)
          imageUrl = publicUrl
        }
      }

      const { error: insertError } = await supabase.from('custom_requests').insert({
        user_id: session.user.id,
        description: description.trim(),
        reference_image_url: imageUrl,
        budget: budget ? parseFloat(budget) : null,
        deadline: deadline || null,
        status: 'pending',
      })

      if (insertError) throw insertError

      setSuccess(true)
      setTimeout(() => router.push('/dashboard'), 2500)
    } catch (err: any) {
      setError(err.message ?? 'Failed to submit request. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-black text-white pt-24 pb-20 px-4">
      <div className="max-w-2xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <p className="text-[9px] tracking-[0.4em] text-[#84ff00] font-black mb-3">STUDIO REQUEST</p>
          <h1 className="text-5xl sm:text-6xl font-black uppercase tracking-tighter leading-none mb-2">
            CUSTOM <span className="text-[#84ff00]">3D MODEL</span>
          </h1>
          <p className="text-gray-600 text-sm mb-12">Describe your vision. Our team delivers a production-ready .GLB file.</p>
        </motion.div>

        <AnimatePresence>
          {success ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="border border-[#84ff00]/30 bg-[#84ff00]/5 p-12 text-center"
            >
              <div className="text-6xl mb-6">✓</div>
              <h2 className="text-2xl font-black uppercase text-[#84ff00] tracking-wide mb-3">Request Submitted!</h2>
              <p className="text-gray-500 text-sm">Our studio team will review your request shortly.</p>
              <p className="text-gray-700 text-xs mt-4 tracking-widest">REDIRECTING TO DASHBOARD...</p>
            </motion.div>
          ) : (
            <motion.form key="form" onSubmit={handleSubmit} className="space-y-6">

              {/* Description */}
              <div>
                <label className="block text-[9px] font-black tracking-widest text-gray-500 mb-2">
                  DESCRIBE YOUR MODEL <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                  rows={5}
                  placeholder="E.g. A low-poly fantasy dragon with wings spread, dark scales, glowing red eyes. For use in a mobile game..."
                  className="w-full bg-[#0a0a0a] border border-[#2a2a2a] focus:border-[#84ff00] text-white px-4 py-3 text-sm outline-none transition-colors resize-none"
                  required
                />
              </div>

              {/* Reference image */}
              <div>
                <label className="block text-[9px] font-black tracking-widest text-gray-500 mb-2">
                  REFERENCE IMAGE (OPTIONAL)
                </label>
                <label className="block border border-dashed border-[#2a2a2a] hover:border-[#84ff00]/50 cursor-pointer transition-colors p-6 text-center">
                  {imagePreview ? (
                    <img src={imagePreview} alt="Preview" className="max-h-40 mx-auto object-contain" />
                  ) : (
                    <div>
                      <div className="text-3xl text-gray-700 mb-2">↑</div>
                      <p className="text-xs text-gray-600 font-bold">Click to upload · JPG, PNG, WEBP</p>
                    </div>
                  )}
                  <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
                </label>
              </div>

              {/* Budget & Deadline */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[9px] font-black tracking-widest text-gray-500 mb-2">BUDGET (₹)</label>
                  <input
                    type="number"
                    value={budget}
                    onChange={e => setBudget(e.target.value)}
                    placeholder="e.g. 5000"
                    min="0"
                    className="w-full bg-[#0a0a0a] border border-[#2a2a2a] focus:border-[#84ff00] text-white px-4 py-3 text-sm outline-none transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-[9px] font-black tracking-widest text-gray-500 mb-2">DEADLINE</label>
                  <input
                    type="date"
                    value={deadline}
                    onChange={e => setDeadline(e.target.value)}
                    min={new Date().toISOString().split('T')[0]}
                    className="w-full bg-[#0a0a0a] border border-[#2a2a2a] focus:border-[#84ff00] text-white px-4 py-3 text-sm outline-none transition-colors"
                  />
                </div>
              </div>

              {error && (
                <div className="bg-red-500/5 border border-red-500/30 text-red-400 px-4 py-3 text-xs font-bold">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#84ff00] text-black py-4 font-black text-sm tracking-widest hover:bg-[#a1ff4d] hover:shadow-[0_0_24px_#84ff00] transition-all disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
                    SUBMITTING...
                  </span>
                ) : 'SUBMIT REQUEST'}
              </button>

              <p className="text-center text-[9px] text-gray-700 tracking-widest">
                You&apos;ll track your request status on the dashboard
              </p>
            </motion.form>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}

export default function RequestPage() {
  return (
    <ProtectedRoute>
      <RequestForm />
    </ProtectedRoute>
  )
}
