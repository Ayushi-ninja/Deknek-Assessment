'use client'

import StatusBadge from './StatusBadge'
import type { CustomRequest } from '@/types'

export default function RequestCard({ request }: { request: CustomRequest }) {
  return (
    <div className="bg-[#0d0d0d] border border-[#1f1f1f] p-5 hover:border-[#84ff00]/30 transition-colors">
      <div className="flex items-start justify-between gap-4 mb-3">
        <p className="text-sm text-gray-300 font-medium leading-snug line-clamp-2 flex-1">
          {request.description}
        </p>
        <StatusBadge status={request.status} />
      </div>
      <div className="flex flex-wrap gap-4 text-[10px] text-gray-600 font-bold tracking-widest">
        {request.budget && <span>BUDGET: ₹{request.budget}</span>}
        {request.deadline && <span>DUE: {new Date(request.deadline).toLocaleDateString('en-IN')}</span>}
        <span>{new Date(request.created_at).toLocaleDateString('en-IN')}</span>
      </div>
      {request.admin_notes && (
        <div className="mt-3 pt-3 border-t border-[#1f1f1f]">
          <p className="text-[10px] text-[#84ff00] font-black tracking-widest mb-1">ADMIN NOTE</p>
          <p className="text-xs text-gray-400">{request.admin_notes}</p>
        </div>
      )}
    </div>
  )
}
