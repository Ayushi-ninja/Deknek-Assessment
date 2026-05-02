'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { supabase } from '@/lib/supabase'
import ProtectedRoute from '@/components/ProtectedRoute'
import StatusBadge from '@/components/StatusBadge'
import type { Model, CustomRequest } from '@/types'

const CATEGORIES = ['Animals', 'Characters', 'Architecture', 'Vehicles', 'Fantasy', 'Props', 'Sci-Fi']

function AdminContent() {
  const [models, setModels] = useState<Model[]>([])
  const [requests, setRequests] = useState<(CustomRequest & { profiles?: { name: string } })[]>([])
  const [uploading, setUploading] = useState(false)
  const [uploadMsg, setUploadMsg] = useState('')

  // Form state
  const [form, setForm] = useState({ name: '', description: '', price: '', category: '', tags: '', is_featured: false })
  const [glbFile, setGlbFile] = useState<File | null>(null)
  const [thumbFile, setThumbFile] = useState<File | null>(null)

  useEffect(() => { loadData() }, [])

  const loadData = async () => {
    const [{ data: m }, { data: r }] = await Promise.all([
      supabase.from('models').select('*').order('created_at', { ascending: false }),
      supabase.from('custom_requests').select('*, profiles(name)').order('created_at', { ascending: false }),
    ])
    setModels(m ?? [])
    setRequests((r as any) ?? [])
  }

  const uploadFile = async (file: File, bucket: string, folder: string) => {
    const ext = file.name.split('.').pop()
    const path = `${folder}/${Date.now()}.${ext}`
    await supabase.storage.from(bucket).upload(path, file, { upsert: true })
    const { data: { publicUrl } } = supabase.storage.from(bucket).getPublicUrl(path)
    return publicUrl
  }

  const handleUploadModel = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.name || !form.price || !form.category) { setUploadMsg('Name, price and category are required.'); return }
    setUploading(true)
    setUploadMsg('')

    try {
      let modelUrl: string | null = null
      let thumbnailUrl: string | null = null

      if (glbFile) modelUrl = await uploadFile(glbFile, 'models', 'glb')
      if (thumbFile) thumbnailUrl = await uploadFile(thumbFile, 'thumbnails', 'thumb')

      const { error } = await supabase.from('models').insert({
        name: form.name.trim(),
        description: form.description.trim() || null,
        price: parseFloat(form.price),
        category: form.category,
        tags: form.tags ? form.tags.split(',').map(t => t.trim()).filter(Boolean) : [],
        model_url: modelUrl,
        thumbnail_url: thumbnailUrl,
        is_featured: form.is_featured,
      })

      if (error) throw error

      setUploadMsg('✓ Model uploaded successfully!')
      setForm({ name: '', description: '', price: '', category: '', tags: '', is_featured: false })
      setGlbFile(null)
      setThumbFile(null)
      loadData()
    } catch (err: any) {
      setUploadMsg(`Error: ${err.message}`)
    } finally {
      setUploading(false)
    }
  }

  const handleDeleteModel = async (id: string) => {
    if (!confirm('Delete this model?')) return
    await supabase.from('models').delete().eq('id', id)
    setModels(prev => prev.filter(m => m.id !== id))
  }

  const handleUpdateRequest = async (reqId: string, status: string, adminNotes: string) => {
    await supabase.from('custom_requests').update({ status, admin_notes: adminNotes }).eq('id', reqId)
    setRequests(prev => prev.map(r => r.id === reqId ? { ...r, status: status as any, admin_notes: adminNotes } : r))
  }

  const inputCls = 'w-full bg-black border border-[#2a2a2a] focus:border-[#84ff00] text-white px-3 py-2.5 text-sm outline-none transition-colors'
  const labelCls = 'block text-[9px] font-black tracking-widest text-gray-500 mb-1.5'

  return (
    <div className="min-h-screen bg-black text-white pt-24 pb-24 px-4">
      <div className="max-w-6xl mx-auto">

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-12">
          <p className="text-[9px] tracking-[0.4em] text-red-400 font-black mb-2">ADMIN PANEL</p>
          <h1 className="text-5xl sm:text-7xl font-black uppercase tracking-tighter leading-none">
            CONTROL <span className="text-[#84ff00]">CENTER</span>
          </h1>
        </motion.div>

        {/* ── UPLOAD MODEL ── */}
        <section className="mb-16 bg-[#080808] border border-[#1a1a1a] p-8">
          <h2 className="text-xl font-black uppercase tracking-wide mb-8 text-[#84ff00]">UPLOAD NEW MODEL</h2>
          <form onSubmit={handleUploadModel} className="space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className={labelCls}>MODEL NAME *</label>
                <input className={inputCls} value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} placeholder="Cyber Helmet" required />
              </div>
              <div>
                <label className={labelCls}>PRICE (₹) *</label>
                <input type="number" className={inputCls} value={form.price} onChange={e => setForm(p => ({ ...p, price: e.target.value }))} placeholder="999" min="0" required />
              </div>
              <div>
                <label className={labelCls}>CATEGORY *</label>
                <select className={inputCls} value={form.category} onChange={e => setForm(p => ({ ...p, category: e.target.value }))} required>
                  <option value="">Select category</option>
                  {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label className={labelCls}>TAGS (comma-separated)</label>
                <input className={inputCls} value={form.tags} onChange={e => setForm(p => ({ ...p, tags: e.target.value }))} placeholder="dragon, fantasy, low-poly" />
              </div>
            </div>

            <div>
              <label className={labelCls}>DESCRIPTION</label>
              <textarea className={`${inputCls} resize-none`} rows={3} value={form.description} onChange={e => setForm(p => ({ ...p, description: e.target.value }))} placeholder="High-fidelity 3D model..." />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className={labelCls}>GLB FILE</label>
                <label className="flex items-center gap-3 border border-dashed border-[#2a2a2a] hover:border-[#84ff00]/50 p-3 cursor-pointer transition-colors">
                  <span className="text-xs text-gray-500">{glbFile ? glbFile.name : 'Upload .glb file'}</span>
                  <input type="file" accept=".glb,.gltf" onChange={e => setGlbFile(e.target.files?.[0] ?? null)} className="hidden" />
                </label>
              </div>
              <div>
                <label className={labelCls}>THUMBNAIL IMAGE</label>
                <label className="flex items-center gap-3 border border-dashed border-[#2a2a2a] hover:border-[#84ff00]/50 p-3 cursor-pointer transition-colors">
                  <span className="text-xs text-gray-500">{thumbFile ? thumbFile.name : 'Upload thumbnail'}</span>
                  <input type="file" accept="image/*" onChange={e => setThumbFile(e.target.files?.[0] ?? null)} className="hidden" />
                </label>
              </div>
            </div>

            <label className="flex items-center gap-3 cursor-pointer">
              <input type="checkbox" checked={form.is_featured} onChange={e => setForm(p => ({ ...p, is_featured: e.target.checked }))} className="accent-[#84ff00]" />
              <span className="text-[10px] font-black tracking-widest text-gray-400">MARK AS FEATURED</span>
            </label>

            {uploadMsg && (
              <div className={`px-4 py-3 text-xs font-bold border ${uploadMsg.startsWith('✓') ? 'border-[#84ff00]/30 text-[#84ff00] bg-[#84ff00]/5' : 'border-red-500/30 text-red-400 bg-red-500/5'}`}>
                {uploadMsg}
              </div>
            )}

            <button type="submit" disabled={uploading} className="bg-[#84ff00] text-black px-8 py-3 font-black text-sm tracking-widest hover:bg-[#a1ff4d] transition-colors disabled:opacity-60">
              {uploading ? 'UPLOADING...' : 'UPLOAD MODEL'}
            </button>
          </form>
        </section>

        {/* ── MODEL LIST ── */}
        <section className="mb-16">
          <h2 className="text-xl font-black uppercase tracking-wide mb-6 text-[#84ff00]">MANAGE MODELS ({models.length})</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="border-b border-[#1a1a1a]">
                  {['NAME', 'CATEGORY', 'PRICE', 'FEATURED', 'ACTION'].map(h => (
                    <th key={h} className="text-left text-[9px] font-black tracking-widest text-gray-600 pb-3 pr-6">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {models.map(m => (
                  <tr key={m.id} className="border-b border-[#0f0f0f] hover:bg-[#0a0a0a]">
                    <td className="py-3 pr-6 font-bold text-white text-xs truncate max-w-[180px]">{m.name}</td>
                    <td className="py-3 pr-6 text-[9px] text-gray-500 font-black tracking-widest">{m.category}</td>
                    <td className="py-3 pr-6 text-[#84ff00] font-black text-xs">₹{m.price}</td>
                    <td className="py-3 pr-6 text-xs">{m.is_featured ? <span className="text-[#84ff00]">YES</span> : <span className="text-gray-700">NO</span>}</td>
                    <td className="py-3">
                      <button onClick={() => handleDeleteModel(m.id)} className="text-red-500 hover:text-red-400 text-[9px] font-black tracking-widest transition-colors">
                        DELETE
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {models.length === 0 && <p className="text-center py-12 text-gray-700 text-sm font-bold">No models yet. Upload one above.</p>}
          </div>
        </section>

        {/* ── CUSTOM REQUESTS ── */}
        <section>
          <h2 className="text-xl font-black uppercase tracking-wide mb-6 text-[#84ff00]">CUSTOM REQUESTS ({requests.length})</h2>
          <div className="space-y-4">
            {requests.length === 0 && <p className="text-center py-12 text-gray-700 text-sm font-bold">No requests yet.</p>}
            {requests.map(req => (
              <RequestRow key={req.id} req={req} onSave={handleUpdateRequest} />
            ))}
          </div>
        </section>
      </div>
    </div>
  )
}

function RequestRow({ req, onSave }: { req: any; onSave: (id: string, status: string, notes: string) => void }) {
  const [status, setStatus] = useState(req.status)
  const [notes, setNotes] = useState(req.admin_notes ?? '')
  const [saved, setSaved] = useState(false)

  const handleSave = async () => {
    await onSave(req.id, status, notes)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  return (
    <div className="bg-[#080808] border border-[#1a1a1a] p-6 space-y-4">
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="text-[9px] font-black tracking-widest text-gray-600 mb-1">
            {req.profiles?.name ?? 'ANONYMOUS'} · {new Date(req.created_at).toLocaleDateString('en-IN')}
            {req.budget && ` · ₹${req.budget}`}
            {req.deadline && ` · DUE ${new Date(req.deadline).toLocaleDateString('en-IN')}`}
          </div>
          <p className="text-sm text-gray-300 leading-snug">{req.description}</p>
        </div>
        <StatusBadge status={req.status} />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <select
          value={status}
          onChange={e => setStatus(e.target.value)}
          className="bg-black border border-[#2a2a2a] focus:border-[#84ff00] text-white px-3 py-2 text-xs outline-none"
        >
          <option value="pending">Pending</option>
          <option value="in_progress">In Progress</option>
          <option value="delivered">Delivered</option>
        </select>
        <input
          className="sm:col-span-1 bg-black border border-[#2a2a2a] focus:border-[#84ff00] text-white px-3 py-2 text-xs outline-none"
          placeholder="Admin notes..."
          value={notes}
          onChange={e => setNotes(e.target.value)}
        />
        <button
          onClick={handleSave}
          className={`px-4 py-2 text-[9px] font-black tracking-widest transition-all ${
            saved ? 'bg-[#84ff00]/20 text-[#84ff00] border border-[#84ff00]/30' : 'bg-[#84ff00] text-black hover:bg-[#a1ff4d]'
          }`}
        >
          {saved ? '✓ SAVED' : 'SAVE'}
        </button>
      </div>
    </div>
  )
}

export default function AdminPage() {
  return (
    <ProtectedRoute adminOnly>
      <AdminContent />
    </ProtectedRoute>
  )
}
