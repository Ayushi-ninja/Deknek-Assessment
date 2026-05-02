'use client'

import { useState, useRef } from 'react'

interface Props {
  onSearch: (query: string) => void
  loading?: boolean
}

export default function AISearchBar({ onSearch, loading }: Props) {
  const [query, setQuery] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (query.trim()) onSearch(query.trim())
  }

  const handleClear = () => {
    setQuery('')
    onSearch('')
    inputRef.current?.focus()
  }

  return (
    <form onSubmit={handleSubmit} className="relative w-full">
      <div className="relative flex items-center border border-[#333] hover:border-[#84ff00]/50 focus-within:border-[#84ff00] transition-colors bg-[#0d0d0d]">
        {/* AI badge */}
        <div className="flex-shrink-0 flex items-center gap-1 pl-3 pr-2 border-r border-[#222]">
          <div className="w-1.5 h-1.5 bg-[#84ff00] rounded-full animate-pulse" />
          <span className="text-[8px] font-black text-[#84ff00] tracking-widest">AI</span>
        </div>

        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={e => setQuery(e.target.value)}
          placeholder='Try "fantasy dragon under ₹500" or "sci-fi helmet"'
          className="flex-1 bg-transparent text-white text-sm font-medium px-4 py-3.5 outline-none placeholder:text-gray-600"
        />

        {query && !loading && (
          <button
            type="button"
            onClick={handleClear}
            className="px-3 text-gray-600 hover:text-white transition-colors text-lg leading-none"
          >
            ×
          </button>
        )}

        <button
          type="submit"
          disabled={loading || !query.trim()}
          className="flex-shrink-0 bg-[#84ff00] text-black px-5 py-3.5 text-[10px] font-black tracking-widest hover:bg-[#a1ff4d] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? (
            <span className="flex items-center gap-1.5">
              <div className="w-3 h-3 border border-black border-t-transparent rounded-full animate-spin" />
              SEARCHING
            </span>
          ) : 'SEARCH'}
        </button>
      </div>
    </form>
  )
}
