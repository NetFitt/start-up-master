'use client'

import { useState, useMemo, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { 
  Check, ChevronRight, ChevronLeft, Target, 
  Image as ImageIcon, DollarSign, Info, Zap, MapPin, X, Star, Loader2, Upload, Crown
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "sonner"
import { createOffer } from "@/lib/actions/offers"
import { useRouter } from "next/navigation"
import DairaSearchSelect from "./daira-search-select"
import { useUploadThing } from "@/lib/uploadthing"
import "@uploadthing/react/styles.css"

const STEPS = [
  { id: 1, name: 'Identity', icon: <Info size={18} /> },
  { id: 2, name: 'The Game', icon: <Target size={18} /> },
  { id: 3, name: 'Pricing', icon: <DollarSign size={18} /> },
  { id: 4, name: 'Media', icon: <ImageIcon size={18} /> },
  { id: 5, name: 'Launch', icon: <Check size={18} /> },
]

const ALGERIAN_GAME = [
  { id: 'sanglier', name: 'Sanglier (Boar)', desc: 'Mountain & Forest tracking' },
  { id: 'perdrix', name: 'Perdrix (Partridge)', desc: 'Upland bird hunting' },
  { id: 'lievre', name: 'Lièvre (Hare)', desc: 'Open field speed hunting' },
  { id: 'caille', name: 'Caille (Quail)', desc: 'Seasonal migratory hunt' },
]

export default function OfferStepper({ dairas }: { dairas: any[] }) {
  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [progress, setProgress] = useState(0)
  const router = useRouter()
  
  const [localFiles, setLocalFiles] = useState<File[]>([])
  const [mainFileIndex, setMainFileIndex] = useState<number>(0)

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    dairaId: '',
    price: '',
    conditions: '',
    species: [] as string[],
  })

  // 🚀 UPLOADTHING HOOK WITH REAL PROGRESS
  const { startUpload, isUploading } = useUploadThing("offerMedia", {
    onUploadProgress: (p) => {
        setProgress(p); // Capture real-time percentage from UploadThing
    }
  });

  const validateStep = () => {
    switch (step) {
      case 1:
        if (!formData.title.trim()) return "Enter a package name."
        if (!formData.dairaId) return "Select a territory (Daira)."
        if (formData.description.length < 20) return "Description is too short."
        break
      case 2:
        if (formData.species.length === 0) return "Select at least one game animal."
        break
      case 3:
        if (!formData.price || Number(formData.price) <= 0) return "Set a valid price."
        if (!formData.conditions.trim()) return "Rules and conditions are required."
        break
      case 4:
        if (localFiles.length === 0) return "Please add at least one photo."
        break
    }
    return null
  }

  const handleNext = () => {
    const error = validateStep()
    if (error) return toast.error(error)
    setStep(s => s + 1)
  }

  const previews = useMemo(() => localFiles.map(file => URL.createObjectURL(file)), [localFiles])
  useEffect(() => () => previews.forEach(url => URL.revokeObjectURL(url)), [previews])

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files)
      setLocalFiles(prev => [...prev, ...files])
    }
  }

  const handleSubmit = async () => {
    setLoading(true)
    setProgress(5) // Kickstart visual feedback

    try {
      if (localFiles.length === 0) throw new Error("No images selected.")

      // 1. Physical Upload
      const uploadRes = await startUpload(localFiles)
      
      if (!uploadRes) throw new Error("Media synchronization failed.")

      // 2. Simulated Final Sync (The final 10% while DB processes)
      const syncInterval = setInterval(() => {
        setProgress(prev => (prev < 98 ? prev + 1 : prev))
      }, 100)

      const mainImageUrl = uploadRes[mainFileIndex].url
      const galleryData = uploadRes.map(file => ({ url: file.url, key: file.key }))

      // 3. Database Persistence
      const res = await createOffer({
        ...formData,
        mainImage: mainImageUrl,
      }, galleryData)

      clearInterval(syncInterval)
      setProgress(100)

      if (res.success) {
        toast.success("Hunting package is now live!")
        router.push('/dashboard/offers')
        router.refresh()
      } else {
        throw new Error(res.error)
      }
    } catch (err: any) {
      toast.error(err.message)
      setLoading(false)
      setProgress(0)
    }
  }

  return (
    <div className="bg-[#0a0a0a] border border-white/5 rounded-[3rem] overflow-hidden shadow-2xl backdrop-blur-md">
      {/* --- Stepper Header --- */}
      <div className="flex border-b border-white/5 bg-white/[0.01]">
        {STEPS.map((s) => (
          <div key={s.id} className={`flex-1 flex flex-col items-center py-8 transition-all ${step >= s.id ? 'text-[#22c55e]' : 'text-gray-700'}`}>
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center border-2 mb-3 transition-all duration-500 ${step >= s.id ? 'border-[#22c55e] bg-[#22c55e]/10 shadow-[0_0_20px_rgba(34,197,94,0.2)]' : 'border-gray-900'}`}>
              {step > s.id ? <Check size={20} strokeWidth={3} /> : s.icon}
            </div>
            <span className="text-[10px] font-black uppercase tracking-[0.2em] hidden md:block">{s.name}</span>
          </div>
        ))}
      </div>

      <div className="p-8 md:p-20 min-h-[600px] relative">
        <AnimatePresence mode="wait">
          {/* STEP 1: IDENTITY */}
          {step === 1 && (
            <motion.div key="s1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-10">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                <div className="space-y-3">
                  <label className="text-[10px] font-black uppercase text-[#22c55e] tracking-widest ml-1">Package Designation</label>
                  <Input 
                    placeholder="e.g. Djurdjura Boar Expedition"
                    className="bg-white/[0.03] border-white/10 h-16 text-xl font-bold rounded-2xl focus:border-[#22c55e]/50 transition-all placeholder:text-gray-800"
                    value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})}
                  />
                </div>
                <DairaSearchSelect dairas={dairas} value={formData.dairaId} onChange={(id) => setFormData({...formData, dairaId: id})} />
              </div>
              <div className="space-y-3">
                <label className="text-[10px] font-black uppercase text-gray-600 tracking-widest ml-1">Detailed Itinerary & Experience</label>
                <Textarea 
                  placeholder="Describe the terrain, hunting pressure, and amenities..."
                  className="bg-white/[0.03] border-white/10 min-h-[200px] rounded-[2rem] p-8 text-lg leading-relaxed focus:border-[#22c55e]/50"
                  value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})}
                />
              </div>
            </motion.div>
          )}

          {/* STEP 2: SPECIES */}
          {step === 2 && (
            <motion.div key="s2" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {ALGERIAN_GAME.map((animal) => (
                <button
                  key={animal.id}
                  onClick={() => setFormData(prev => ({
                    ...prev, 
                    species: prev.species.includes(animal.id) ? prev.species.filter(s => s !== animal.id) : [...prev.species, animal.id]
                  }))}
                  className={`p-10 rounded-[2.5rem] border-2 text-left transition-all duration-300 ${
                    formData.species.includes(animal.id) 
                    ? 'border-[#22c55e] bg-[#22c55e]/5 text-white shadow-[0_0_40px_rgba(34,197,94,0.1)]' 
                    : 'border-white/5 bg-white/[0.02] text-gray-600 hover:border-white/20'
                  }`}
                >
                  <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-6 transition-all ${formData.species.includes(animal.id) ? 'bg-[#22c55e] text-black shadow-lg shadow-[#22c55e]/40' : 'bg-white/5'}`}>
                    <Target size={28} strokeWidth={2.5} />
                  </div>
                  <div className="font-black text-2xl tracking-tighter">{animal.name}</div>
                  <p className="text-sm mt-2 opacity-60 font-medium">{animal.desc}</p>
                </button>
              ))}
            </motion.div>
          )}

          {/* STEP 3: PRICING */}
          {step === 3 && (
            <motion.div key="s3" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-3xl mx-auto space-y-12">
               <div className="relative group">
                  <div className="absolute -inset-1 bg-[#22c55e]/20 rounded-[4rem] blur-3xl opacity-30 group-hover:opacity-60 transition duration-1000"></div>
                  <div className="relative bg-black border border-white/5 rounded-[3.5rem] p-16 text-center">
                      <div className="text-[11px] font-black uppercase tracking-[0.4em] text-[#22c55e] mb-6">Package Valuation (DZD)</div>
                      <div className="flex items-center justify-center">
                          <input 
                              type="number" 
                              className="bg-transparent border-none text-center text-[10rem] font-black outline-none w-full text-white placeholder:text-gray-900" 
                              value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})} 
                              placeholder="0" autoFocus
                          />
                      </div>
                  </div>
              </div>
              <Textarea 
                className="bg-white/[0.03] border-white/10 min-h-[140px] rounded-[2rem] p-8 text-lg" 
                placeholder="List rules (e.g. Valid hunting permit required, insurance details...)" 
                value={formData.conditions} onChange={e => setFormData({...formData, conditions: e.target.value})}
              />
            </motion.div>
          )}

          {/* STEP 4: MEDIA GALLERY */}
          {step === 4 && (
            <motion.div key="s4" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
              <label className="flex flex-col items-center justify-center border-2 border-dashed border-white/10 bg-white/[0.01] rounded-[3rem] h-64 cursor-pointer hover:bg-white/[0.03] hover:border-[#22c55e]/40 transition-all group">
                <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center mb-4 group-hover:bg-[#22c55e] group-hover:text-black transition-all">
                  <Upload size={32} strokeWidth={1.5} />
                </div>
                <span className="text-xl font-bold text-white tracking-tight">Select High-Res Images</span>
                <span className="text-gray-600 text-[10px] font-black uppercase tracking-widest mt-2">Held locally until you publish</span>
                <input type="file" multiple className="hidden" onChange={handleFileChange} accept="image/*" />
              </label>

              <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mt-8">
                {previews.map((url, i) => (
                  <div key={url} className={`group relative aspect-square rounded-[2rem] overflow-hidden border-2 transition-all ${mainFileIndex === i ? 'border-[#22c55e] shadow-[0_0_30px_rgba(34,197,94,0.3)]' : 'border-white/5'}`}>
                    <img src={url} className="object-cover w-full h-full" alt="Preview" />
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                        <button 
                          onClick={() => setMainFileIndex(i)} 
                          className={`p-3 rounded-xl transition-all ${mainFileIndex === i ? 'bg-[#22c55e] text-black' : 'bg-white/10 hover:bg-white/20'}`}
                        >
                          <Crown size={20} fill={mainFileIndex === i ? "currentColor" : "none"} />
                        </button>
                        <button onClick={() => setLocalFiles(prev => prev.filter((_, idx) => idx !== i))} className="p-3 bg-red-500 rounded-xl hover:scale-110 transition-transform">
                          <X size={20} />
                        </button>
                    </div>
                    {mainFileIndex === i && (
                      <div className="absolute bottom-4 left-4 right-4 bg-[#22c55e] text-black text-[9px] font-black uppercase py-2 rounded-xl text-center shadow-lg">
                        Hero Cover
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {/* STEP 5: SYNC & LAUNCH (Progressive) */}
          {step === 5 && (
            <motion.div key="s5" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="flex flex-col items-center justify-center min-h-[400px] text-center space-y-12">
                {(loading || isUploading) ? (
                  <div className="w-full max-w-md space-y-10">
                    {/* The Visual Radial Tracker */}
                    <div className="relative w-48 h-48 mx-auto">
                      <svg className="w-full h-full transform -rotate-90">
                        <circle
                          cx="96" cy="96" r="86"
                          stroke="currentColor" strokeWidth="6"
                          fill="transparent" className="text-white/5"
                        />
                        <motion.circle
                          cx="96" cy="96" r="86"
                          stroke="currentColor" strokeWidth="8"
                          fill="transparent" className="text-[#22c55e]"
                          strokeDasharray="540"
                          initial={{ strokeDashoffset: 540 }}
                          animate={{ strokeDashoffset: 540 - (540 * progress) / 100 }}
                          strokeLinecap="round"
                          transition={{ duration: 0.5, ease: "linear" }}
                        />
                      </svg>
                      <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <span className="text-5xl font-black text-white italic">{progress}%</span>
                        <span className="text-[10px] text-gray-500 font-black uppercase tracking-[0.3em] mt-1">Uplink</span>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="space-y-1">
                        <h2 className="text-3xl font-black text-white uppercase italic tracking-tighter">Transmitting Offer</h2>
                        <p className="text-gray-500 font-medium animate-pulse">Establishing cloud records and media assets...</p>
                      </div>
                      
                      {/* Horizontal Progress Bar */}
                      <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                        <motion.div 
                           initial={{ width: 0 }}
                           animate={{ width: `${progress}%` }}
                           className="h-full bg-gradient-to-r from-[#22c55e] to-[#4ade80] shadow-[0_0_20px_rgba(34,197,94,0.4)]"
                        />
                      </div>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="w-24 h-24 bg-[#22c55e]/10 border-2 border-[#22c55e] rounded-full flex items-center justify-center text-[#22c55e] shadow-[0_0_50px_rgba(34,197,94,0.3)]">
                        <Check size={48} strokeWidth={4} />
                    </div>
                    <div className="space-y-3">
                        <h2 className="text-5xl font-black text-white uppercase italic tracking-tighter leading-none">Ready to Deploy</h2>
                        <p className="text-gray-500 max-w-sm mx-auto font-medium">Specifications verified. Package is ready for public distribution.</p>
                    </div>
                    <Button 
                        onClick={handleSubmit} 
                        className="bg-[#22c55e] text-black font-black px-16 h-20 text-xl rounded-[2rem] hover:scale-105 transition-all shadow-2xl shadow-[#22c55e]/40"
                    >
                       Confirm & Publish
                    </Button>
                  </>
                )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* --- Footer Nav --- */}
      <div className="p-10 border-t border-white/5 bg-white/[0.01] flex justify-between items-center">
        <Button 
            variant="ghost" onClick={() => setStep(s => s - 1)} disabled={step === 1 || loading || isUploading} 
            className="text-gray-500 font-bold px-10 h-16 rounded-2xl hover:text-white"
        >
            <ChevronLeft className="mr-2"/> Back
        </Button>
        {step < 5 && (
            <Button 
                onClick={handleNext} 
                className="bg-white text-black font-black px-16 h-16 rounded-[1.5rem] hover:bg-[#22c55e] hover:text-black transition-all"
            >
                Next Step <ChevronRight className="ml-2"/>
            </Button>
        )}
      </div>
    </div>
  )
}