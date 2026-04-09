'use client'

import { useState, useRef, useEffect } from 'react'
import { Check, ChevronsUpDown, Search, MapPin, X } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

interface Daira {
  id: string;
  name: string;
  // Made this optional so it doesn't crash if the relation isn't loaded
  city?: { commune_name_ascii: string }; 
}

export default function DairaSearchSelect({ 
  dairas, 
  value, 
  onChange 
}: { 
  dairas: Daira[], 
  value: string, 
  onChange: (id: string) => void 
}) {
  const [isOpen, setIsOpen] = useState(false)
  const [search, setSearch] = useState("")
  const containerRef = useRef<HTMLDivElement>(null)

  const selectedDaira = dairas.find(d => d.id === value)
  
  const filteredDairas = dairas.filter(d => 
    d.name.toLowerCase().includes(search.toLowerCase()) || 
    d.city?.commune_name_ascii?.toLowerCase().includes(search.toLowerCase())
  )

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  return (
    <div className="relative w-full" ref={containerRef}>
      <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 ml-1 mb-3 block">
        Hunting Territory (Daira)
      </label>
      
      {/* Trigger Button */}
      <div 
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full h-16 bg-white/5 border-2 ${isOpen ? 'border-[#22c55e] bg-[#22c55e]/5' : 'border-white/10'} rounded-2xl flex items-center px-5 cursor-pointer transition-all hover:bg-white/10 group`}
      >
        <MapPin className={`mr-3 transition-colors ${isOpen ? 'text-[#22c55e]' : 'text-gray-500'}`} size={20} />
        <span className={`flex-1 font-bold text-lg ${!selectedDaira ? 'text-gray-600' : 'text-white'}`}>
          {selectedDaira ? selectedDaira.name : "Search territory..."}
        </span>
        <ChevronsUpDown size={18} className="text-gray-500" />
      </div>

      {/* Dropdown Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -10, scale: 0.98 }}
            animate={{ opacity: 1, y: 5, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.98 }}
            className="absolute z-[100] w-full mt-2 bg-[#0c0e0c] backdrop-blur-3xl border border-white/10 rounded-[2rem] overflow-hidden shadow-[0_25px_50px_-12px_rgba(0,0,0,0.7)]"
          >
            {/* Search Input */}
            <div className="p-4 border-b border-white/5 flex items-center gap-3 bg-white/[0.02]">
              <Search size={16} className="text-gray-500 ml-2" />
              <input 
                autoFocus
                type="text"
                placeholder="Type to filter territories..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-transparent border-none outline-none text-base font-bold text-white placeholder:text-gray-700 h-10"
              />
              {search && (
                <X 
                  size={16} 
                  className="text-gray-500 cursor-pointer hover:text-white transition-colors" 
                  onClick={() => setSearch("")} 
                />
              )}
            </div>

            {/* List */}
            <div className="max-h-[300px] overflow-y-auto custom-scrollbar p-3">
              {filteredDairas.length > 0 ? (
                filteredDairas.map((d) => (
                  <div 
                    key={d.id}
                    onClick={() => {
                      onChange(d.id)
                      setIsOpen(false)
                      setSearch("")
                    }}
                    className={`flex items-center justify-between px-5 py-4 rounded-[1.25rem] cursor-pointer transition-all mb-1 ${
                      value === d.id 
                        ? 'bg-[#22c55e] text-black font-black shadow-lg shadow-[#22c55e]/20' 
                        : 'text-gray-400 hover:bg-white/5 hover:text-white'
                    }`}
                  >
                    <div className="flex flex-col">
                      <span className="text-base">{d.name}</span>
                      {d.city && (
                        <span className={`text-[10px] uppercase font-bold tracking-widest ${value === d.id ? 'text-black/60' : 'text-gray-600'}`}>
                          {d.city.commune_name_ascii}
                        </span>
                      )}
                    </div>
                    {value === d.id && <Check size={18} strokeWidth={4} />}
                  </div>
                ))
              ) : (
                <div className="py-12 text-center flex flex-col items-center gap-2">
                  <Search size={32} className="text-gray-800" />
                  <span className="text-gray-600 text-sm font-bold uppercase tracking-widest">No matching Dairas</span>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}