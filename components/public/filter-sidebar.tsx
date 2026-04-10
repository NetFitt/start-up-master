'use client'

import { useRouter, useSearchParams, usePathname } from 'next/navigation'
import { useTransition, useMemo } from 'react'
import { SearchableSelect } from '@/components/ui/searchable-select'

export default function FilterSidebar({ wilayas, dairas }: { wilayas: any[], dairas: any[] }) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [isPending, startTransition] = useTransition()

  // 1. Get the current Wilaya ID from the URL
  const currentWilayaId = searchParams.get('wilayaId') || ''
  console.log(dairas , 1);
  // 2. 🚀 THE FIX: Calculate available Dairas based on the UUID
  // We use useMemo to keep it fast. We check against 'wilayaId' (camelCase)
  const availableDairas = useMemo(() => {
    if (!currentWilayaId) return []
    console.log(dairas , 2);
    
    return dairas.filter(d => {
      // We compare the directorate_id from your forestDistricts schema
      // to the ID we selected in the Wilaya dropdown.
      return String(d.directorate_id) === String(currentWilayaId)
    })
  }, [dairas, currentWilayaId])

  function updateUrl(key: string, value: string) {
    const params = new URLSearchParams(searchParams.toString())
    
    if (value && value !== 'all') {
      params.set(key, value)
    } else {
      params.delete(key)
    }

    // If Wilaya changes, we MUST clear the Daira selection
    if (key === 'wilayaId') {
      params.delete('dairaId')
    }

    startTransition(() => {
      router.push(`${pathname}?${params.toString()}`, { scroll: false })
    })
  }

  return (
    <aside className="w-full lg:w-80 shrink-0">
      <div className={`bg-white border border-slate-200 rounded-[3rem] p-8 sticky top-28 shadow-sm ${isPending ? 'opacity-60' : ''}`}>
        <h2 className="text-2xl font-black text-[#050805] uppercase tracking-tighter mb-8 italic">
          Filter <span className="text-[#22c55e]">Results</span>
        </h2>

        <div className="space-y-8">
          {/* Wilaya Selection */}
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1">Select Wilaya</label>
            <SearchableSelect 
              options={wilayas} // SearchableSelect uses 'id' and 'name'
              value={currentWilayaId}
              onChange={(val) => updateUrl('wilayaId', val)}
              placeholder="All Regions"
            />
          </div>

          {/* Daira Selection (Fixed) */}
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1">Select Daira</label>
            <SearchableSelect 
              disabled={!currentWilayaId}
              options={availableDairas} // 🚀 This is now filtered by UUID
              value={searchParams.get('dairaId') || ''}
              onChange={(val) => updateUrl('dairaId', val)}
              placeholder={currentWilayaId ? "Search Districts..." : "Select Wilaya First"}
            />
          </div>

          {/* Price Filters */}
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1">Price Range (DZD)</label>
            <div className="grid grid-cols-2 gap-3">
              <input 
                type="number" 
                placeholder="Min" 
                defaultValue={searchParams.get('minPrice') || ''}
                onBlur={(e) => updateUrl('minPrice', e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-4 px-4 text-xs font-bold outline-none focus:border-[#22c55e]"
              />
              <input 
                type="number" 
                placeholder="Max" 
                defaultValue={searchParams.get('maxPrice') || ''}
                onBlur={(e) => updateUrl('maxPrice', e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-4 px-4 text-xs font-bold outline-none focus:border-[#22c55e]"
              />
            </div>
          </div>
        </div>

        <button 
          onClick={() => router.push(pathname)}
          className="w-full mt-10 bg-[#050805] text-white font-black py-5 rounded-2xl hover:bg-[#22c55e] hover:text-[#050805] transition-all uppercase tracking-widest text-[10px]"
        >
          Reset All
        </button>
      </div>
    </aside>
  )
}