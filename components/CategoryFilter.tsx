'use client'

const CATEGORIES = ['All', 'Animals', 'Characters', 'Architecture', 'Vehicles', 'Fantasy', 'Props', 'Sci-Fi']

interface Props {
  active: string
  onChange: (cat: string) => void
}

export default function CategoryFilter({ active, onChange }: Props) {
  return (
    <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
      {CATEGORIES.map(cat => (
        <button
          key={cat}
          onClick={() => onChange(cat)}
          className={`flex-shrink-0 px-4 py-2 text-[10px] font-black tracking-widest border transition-all ${
            active === cat
              ? 'bg-[#84ff00] text-black border-[#84ff00]'
              : 'bg-transparent text-gray-400 border-[#333] hover:border-[#84ff00] hover:text-white'
          }`}
        >
          {cat.toUpperCase()}
        </button>
      ))}
    </div>
  )
}
