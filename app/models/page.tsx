'use client'

import { Suspense, useEffect, useState, useCallback } from 'react'
import { useSearchParams } from 'next/navigation'
import { motion } from 'framer-motion'
import { supabase } from '@/lib/supabase'
import ModelCard from '@/components/ModelCard'
import CategoryFilter from '@/components/CategoryFilter'
import AISearchBar from '@/components/AISearchBar'
import LoadingSkeleton from '@/components/LoadingSkeleton'
import type { Model } from '@/types'

// Inner component that uses useSearchParams — must be inside <Suspense>
function ModelsContent() {
  const searchParams = useSearchParams()
  const [models, setModels] = useState<Model[]>([])
  const [filtered, setFiltered] = useState<Model[]>([])
  const [loading, setLoading] = useState(true)
  const [aiLoading, setAiLoading] = useState(false)
  const [category, setCategory] = useState(searchParams.get('category') ?? 'All')
  const [maxPrice, setMaxPrice] = useState(10000)
  const [aiQuery, setAiQuery] = useState('')

  useEffect(() => {
    supabase.from('models').select('*').order('created_at', { ascending: false })
      .then(({ data }) => {
        setModels(data ?? [])
        setLoading(false)
      })
  }, [])

  const applyFilters = useCallback((all: Model[], cat: string, price: number) => {
    let result = all
    if (cat !== 'All') result = result.filter(m => m.category === cat)
    result = result.filter(m => m.price <= price)
    setFiltered(result)
  }, [])

  useEffect(() => {
    if (!aiQuery) applyFilters(models, category, maxPrice)
  }, [models, category, maxPrice, aiQuery, applyFilters])

  const handleAISearch = async (query: string) => {
    if (!query) { setAiQuery(''); applyFilters(models, category, maxPrice); return }
    setAiQuery(query)
    setAiLoading(true)
    try {
      const res = await fetch('/api/ai-search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query,
          models: models.map(m => ({
            id: m.id, name: m.name, description: m.description,
            category: m.category, tags: m.tags, price: m.price,
          })),
        }),
      })
      const { ids } = await res.json()
      setFiltered(ids?.length ? models.filter(m => ids.includes(m.id)) : [])
    } catch {
      applyFilters(models, category, maxPrice)
    } finally {
      setAiLoading(false)
    }
  }

  const highestPrice = models.length ? Math.max(...models.map(m => m.price)) : 10000

  return (
    <div className="min-h-screen bg-black text-white pt-24 pb-20 px-4">
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-12">
          <p className="text-[9px] tracking-[0.4em] text-[#84ff00] font-black mb-3">DEKNEK 3D MARKETPLACE</p>
          <h1 className="text-5xl sm:text-7xl font-black uppercase tracking-tighter leading-none mb-2">
            3D <span className="text-[#84ff00]">MODELS</span>
          </h1>
          <p className="text-gray-600 text-sm">{models.length} assets available</p>
        </motion.div>

        {/* AI Search */}
        <div className="mb-8">
          <AISearchBar onSearch={handleAISearch} loading={aiLoading} />
          {aiQuery && !aiLoading && (
            <div className="flex items-center gap-2 mt-3">
              <div className="w-1.5 h-1.5 bg-[#84ff00] rounded-full" />
              <p className="text-[10px] text-gray-500 font-bold">
                AI found <span className="text-[#84ff00]">{filtered.length}</span> results for &quot;{aiQuery}&quot;
              </p>
              <button onClick={() => handleAISearch('')} className="text-[10px] text-gray-600 hover:text-white ml-2 tracking-widest font-bold">
                CLEAR
              </button>
            </div>
          )}
        </div>

        {/* Filters */}
        {!aiQuery && (
          <div className="flex flex-col sm:flex-row gap-6 mb-10">
            <div className="flex-1">
              <CategoryFilter active={category} onChange={cat => setCategory(cat)} />
            </div>
            <div className="sm:w-64">
              <div className="flex justify-between text-[9px] font-black tracking-widest text-gray-500 mb-2">
                <span>MAX PRICE</span>
                <span className="text-[#84ff00]">₹{maxPrice.toLocaleString('en-IN')}</span>
              </div>
              <input
                type="range" min={0} max={highestPrice || 10000}
                value={maxPrice} onChange={e => setMaxPrice(Number(e.target.value))}
                className="w-full"
              />
            </div>
          </div>
        )}

        {/* Grid */}
        {loading ? (
          <LoadingSkeleton count={8} />
        ) : filtered.length === 0 ? (
          <div className="border border-dashed border-[#1a1a1a] py-32 text-center">
            <p className="text-gray-700 font-black uppercase tracking-widest text-sm mb-3">
              {aiQuery ? 'No AI matches found' : 'No models in this category'}
            </p>
            <p className="text-gray-800 text-xs">
              {aiQuery ? 'Try a different query.' : 'Adjust the category or price range.'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {filtered.map((m, i) => (
              <motion.div key={m.id} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}>
                <ModelCard model={m} />
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

// Outer page wraps inner in Suspense — required by Next.js 14 for useSearchParams
export default function ModelsPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-black pt-24 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="h-20 w-64 skeleton rounded mb-12" />
          <LoadingSkeleton count={8} />
        </div>
      </div>
    }>
      <ModelsContent />
    </Suspense>
  )
}
