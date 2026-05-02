'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import type { Model } from '@/types'

export default function ModelCard({ model }: { model: Model }) {
  return (
    <motion.div whileHover={{ y: -4 }} transition={{ duration: 0.2 }}>
      <Link
        href={`/models/${model.id}`}
        className="group block bg-[#0d0d0d] border border-[#1f1f1f] hover:border-[#84ff00] transition-all overflow-hidden hover:shadow-[0_0_24px_rgba(132,255,0,0.12)]"
      >
        <div className="aspect-square relative overflow-hidden bg-[#080808]">
          {model.thumbnail_url ? (
            <img
              src={model.thumbnail_url}
              alt={model.name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-80 group-hover:opacity-100"
            />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center gap-2">
              <span className="text-5xl font-black text-[#1a1a1a]">3D</span>
              <span className="text-[9px] tracking-widest text-gray-700">NO PREVIEW</span>
            </div>
          )}
          {model.is_featured && (
            <div className="absolute top-2 left-2 bg-[#84ff00] text-black px-2 py-0.5 text-[8px] font-black tracking-widest">
              FEATURED
            </div>
          )}
          <div className="absolute top-2 right-2 bg-black/80 backdrop-blur-sm text-[#84ff00] px-2 py-0.5 text-[10px] font-black border border-[#84ff00]/20">
            ₹{model.price}
          </div>
        </div>

        <div className="p-4">
          {model.category && (
            <div className="text-[9px] text-[#84ff00] font-black tracking-widest mb-1 uppercase">
              {model.category}
            </div>
          )}
          <h3 className="text-sm font-black text-white group-hover:text-[#84ff00] transition-colors uppercase tracking-tight truncate">
            {model.name}
          </h3>
          {model.tags && model.tags.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-2">
              {model.tags.slice(0, 3).map(tag => (
                <span key={tag} className="text-[8px] text-gray-600 border border-[#2a2a2a] px-1.5 py-0.5 uppercase">
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>
      </Link>
    </motion.div>
  )
}
