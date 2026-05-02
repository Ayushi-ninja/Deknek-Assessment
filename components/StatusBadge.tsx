type Status = 'pending' | 'in_progress' | 'delivered'

const config: Record<Status, { label: string; cls: string }> = {
  pending:     { label: 'PENDING',     cls: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/40' },
  in_progress: { label: 'IN PROGRESS', cls: 'bg-blue-500/10 text-blue-400 border-blue-500/40' },
  delivered:   { label: 'DELIVERED',   cls: 'bg-[#84ff00]/10 text-[#84ff00] border-[#84ff00]/40' },
}

export default function StatusBadge({ status }: { status: Status }) {
  const { label, cls } = config[status] ?? config.pending
  return (
    <span className={`inline-block px-2 py-0.5 text-[9px] font-black tracking-widest border ${cls}`}>
      {label}
    </span>
  )
}
