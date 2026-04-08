'use client'

import { useState, useRef, useEffect } from 'react'
import { Check, ChevronsUpDown, Search, Landmark, X } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

interface District {
  id: string;
  name: string;
  city?: { commune_name_ascii: string };
}

export default function DistrictSearchSelect({ 
  districts, 
  value, 
  onChange 
}: { 
  districts: District[], 
  value: string, 
  onChange: (id: string) => void 
}) {
  const [isOpen, setIsOpen] = useState(false)
  const [search, setSearch] = useState("")
  const containerRef = useRef<HTMLDivElement>(null)

  const selectedDistrict = districts.find(d => d.id === value)
  
  const filteredDistricts = districts.filter(d => 
    d.name.toLowerCase().includes(search.toLowerCase()) || 
    d.city?.commune_name_ascii.toLowerCase().includes(search.toLowerCase())
  )

  // Close when clicking outside
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
      <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 ml-1 mb-2 block">
        Primary District (Daira)
      </label>
      
      {/* Trigger Button */}
      <div 
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full h-14 bg-white/5 border ${isOpen ? 'border-[#22c55e]' : 'border-white/10'} rounded-2xl flex items-center px-4 cursor-pointer transition-all hover:bg-white/10 group`}
      >
        <Landmark className={`mr-3 transition-colors ${isOpen ? 'text-[#22c55e]' : 'text-gray-500'}`} size={18} />
        <span className={`flex-1 font-bold text-sm ${!selectedDistrict ? 'text-gray-600' : 'text-white'}`}>
          {selectedDistrict ? `${selectedDistrict.name}` : "Select Daira..."}
        </span>
        <ChevronsUpDown size={16} className="text-gray-500" />
      </div>

      {/* Dropdown Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 5 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute z-[100] w-full mt-2 bg-[#0a0a0a]/95 backdrop-blur-2xl border border-white/10 rounded-2xl overflow-hidden shadow-2xl"
          >
            {/* Search Input inside dropdown */}
            <div className="p-3 border-b border-white/5 flex items-center gap-2">
              <Search size={14} className="text-gray-500 ml-2" />
              <input 
                autoFocus
                type="text"
                placeholder="Search districts..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-transparent border-none outline-none text-sm font-bold text-white placeholder:text-gray-700 h-10"
              />
              {search && (
                <X 
                  size={14} 
                  className="text-gray-500 cursor-pointer hover:text-white" 
                  onClick={() => setSearch("")} 
                />
              )}
            </div>

            {/* List */}
            <div className="max-h-[250px] overflow-y-auto custom-scrollbar p-2">
              {filteredDistricts.length > 0 ? (
                filteredDistricts.map((d) => (
                  <div 
                    key={d.id}
                    onClick={() => {
                      onChange(d.id)
                      setIsOpen(false)
                      setSearch("")
                    }}
                    className={`flex items-center justify-between px-4 py-3 rounded-xl cursor-pointer transition-colors mb-1 ${
                      value === d.id ? 'bg-[#22c55e] text-black font-black' : 'text-gray-400 hover:bg-white/5 hover:text-white'
                    }`}
                  >
                    <div className="flex flex-col">
                      <span className="text-sm">{d.name}</span>
                      <span className={`text-[10px] uppercase tracking-tighter ${value === d.id ? 'text-black/60' : 'text-gray-600'}`}>
                        {d.city?.commune_name_ascii}
                      </span>
                    </div>
                    {value === d.id && <Check size={16} strokeWidth={3} />}
                  </div>
                ))
              ) : (
                <div className="py-8 text-center text-gray-600 text-sm italic font-medium">
                  No districts found.
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}