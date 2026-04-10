'use client'

import { useState, useRef, useEffect } from 'react'
import { Check, ChevronDown, Search } from 'lucide-react'

interface Option {
  id: string
  name: string
}

interface Props {
  options: Option[]
  value: string
  onChange: (value: string) => void
  placeholder: string
  disabled?: boolean
}

export function SearchableSelect({ options, value, onChange, placeholder, disabled }: Props) {
  const [isOpen, setIsOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const containerRef = useRef<HTMLDivElement>(null)

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const selectedOption = options.find(opt => opt.id === value)
  const filteredOptions = options.filter(opt => 
    opt.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="relative w-full" ref={containerRef}>
      <button
        type="button"
        disabled={disabled}
        onClick={() => setIsOpen(!isOpen)}
        className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-4 px-5 text-sm font-bold flex items-center justify-between hover:border-[#22c55e] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <span className={selectedOption ? "text-[#050805]" : "text-slate-400"}>
          {selectedOption ? selectedOption.name : placeholder}
        </span>
        <ChevronDown size={18} className={`transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute z-[100] w-full mt-2 bg-white border border-slate-200 rounded-[2rem] shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
          <div className="p-4 border-b border-slate-100 flex items-center gap-3 bg-slate-50/50">
            <Search size={16} className="text-slate-400" />
            <input
              autoFocus
              className="bg-transparent border-none outline-none text-sm font-medium w-full"
              placeholder="Search..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="max-h-60 overflow-y-auto p-2 custom-scrollbar">
            {filteredOptions.length > 0 ? (
              filteredOptions.map((opt) => (
                <button
                  key={opt.id}
                  onClick={() => {
                    onChange(opt.id)
                    setIsOpen(false)
                    setSearchTerm('')
                  }}
                  className="w-full text-left px-4 py-3 rounded-xl text-sm font-bold flex items-center justify-between hover:bg-[#22c55e]/5 transition-colors group"
                >
                  <span className={value === opt.id ? "text-[#22c55e]" : "text-slate-600"}>
                    {opt.name}
                  </span>
                  {value === opt.id && <Check size={16} className="text-[#22c55e]" />}
                </button>
              ))
            ) : (
              <div className="p-4 text-center text-xs font-bold text-slate-400 uppercase tracking-widest">
                Nothing found
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}