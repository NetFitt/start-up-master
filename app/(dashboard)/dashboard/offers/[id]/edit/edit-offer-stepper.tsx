'use client'

import { useState, useMemo, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { 
  Check, ChevronRight, ChevronLeft, Target, 
  Image as ImageIcon, DollarSign, Info, Zap, X, Star, Loader2, Upload, Crown, Trash2
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "sonner"
import { updateOffer } from "@/lib/actions/offers"
import { useRouter } from "next/navigation"
import DairaSearchSelect from "../../new/daira-search-select"
import { useUploadThing } from "@/lib/uploadthing"
import "@uploadthing/react/styles.css"

const STEPS = [
  { id: 1, name: 'Identity', icon: <Info size={18} /> },
  { id: 2, name: 'Species', icon: <Target size={18} /> },
  { id: 3, name: 'Pricing', icon: <DollarSign size={18} /> },
  { id: 4, name: 'Media', icon: <ImageIcon size={18} /> },
  { id: 5, name: 'Sync', icon: <Check size={18} /> },
]

const ALGERIAN_GAME = [
  { id: 'sanglier', name: 'Sanglier (Boar)', desc: 'Mountain & Forest tracking' },
  { id: 'perdrix', name: 'Perdrix (Partridge)', desc: 'Upland bird hunting' },
  { id: 'lievre', name: 'Lièvre (Hare)', desc: 'Open field speed hunting' },
  { id: 'caille', name: 'Caille (Quail)', desc: 'Seasonal migratory hunt' },
]

interface EditOfferStepperProps {
  initialData: any
  dairas: any[]
}

export default function EditOfferStepper({ initialData, dairas }: EditOfferStepperProps) {
  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [progress, setProgress] = useState(0)
  const router = useRouter()
  
  // 📸 MEDIA MANAGEMENT
  const [existingImages, setExistingImages] = useState<any[]>(initialData.images || [])
  const [localFiles, setLocalFiles] = useState<File[]>([])
  
  // Tracks if the "Hero" image is an existing URL or a new file index
  const [mainImageSource, setMainImageSource] = useState<{type: 'existing' | 'new', identifier: string | number}>({
    type: 'existing',
    identifier: initialData.mainImage
  })

  const [formData, setFormData] = useState({
    title: initialData.title || '',
    description: initialData.description || '',
    dairaId: initialData.dairaId || '',
    price: initialData.price?.toString() || '',
    conditions: initialData.conditions || '',
    species: (initialData.species as string[]) || [],
  })

  // 🚀 UPLOADTHING HOOK WITH PROGRESS
  const { startUpload, isUploading } = useUploadThing("offerMedia", {
    onUploadProgress: (p) => {
        setProgress(p); 
    }
  });

  const localPreviews = useMemo(() => localFiles.map(file => URL.createObjectURL(file)), [localFiles])
  useEffect(() => () => localPreviews.forEach(url => URL.revokeObjectURL(url)), [localPreviews])

  const validateStep = () => {
    switch (step) {
      case 1:
        if (!formData.title.trim()) return "Enter a package name."
        if (!formData.dairaId) return "Select a territory."
        break
      case 2:
        if (formData.species.length === 0) return "Select at least one species."
        break
      case 3:
        if (!formData.price || Number(formData.price) <= 0) return "Set a valid price."
        break
      case 4:
        if (existingImages.length === 0 && localFiles.length === 0) return "Package must have photos."
        break
    }
    return null
  }

  const handleNext = () => {
    const error = validateStep()
    if (error) return toast.error(error)
    setStep(s => s + 1)
  }

  const handleSubmit = async () => {
    setLoading(true)
    setProgress(5)
    const toastId = toast.loading("Establishing secure uplink for data sync...")

    try {
      let finalMainImage = ""
      let finalGallery = [...existingImages]

      // 1. Upload New Files if they exist
      if (localFiles.length > 0) {
        const uploadRes = await startUpload(localFiles)
        if (!uploadRes) throw new Error("Media sync failed. Check connection.")
        
        finalGallery = [...finalGallery, ...uploadRes.map(f => ({ url: f.url, key: f.key }))]

        if (mainImageSource.type === 'new') {
            finalMainImage = uploadRes[mainImageSource.identifier as number].url
        }
      }

      // 2. Final 10% simulation for database write
      const syncInterval = setInterval(() => {
          setProgress(prev => (prev < 98 ? prev + 1 : prev))
      }, 150)

      if (mainImageSource.type === 'existing') {
          finalMainImage = mainImageSource.identifier as string
      }

      // 3. Persist Changes
      const res = await updateOffer(initialData.id, {
        ...formData,
        mainImage: finalMainImage,
      }, finalGallery)

      clearInterval(syncInterval)
      setProgress(100)

      if (res.success) {
        toast.success("Territory specifications updated!", { id: toastId })
        router.push('/dashboard/offers')
        router.refresh()
      } else {
        throw new Error(res.error)
      }
    } catch (err: any) {
      toast.error(err.message, { id: toastId })
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
              {step > s.id ? <Check size={20} strokeWidth={3} /> : s.id}
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
                    className="bg-white/[0.03] border-white/10 h-16 text-xl font-bold rounded-2xl focus:border-[#22c55e]/50"
                    value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})}
                  />
                </div>
                <DairaSearchSelect dairas={dairas} value={formData.dairaId} onChange={(id) => setFormData({...formData, dairaId: id})} />
              </div>
              <Textarea 
                placeholder="Experience description..."
                className="bg-white/[0.03] border-white/10 min-h-[200px] rounded-[2rem] p-8 text-lg"
                value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})}
              />
            </motion.div>
          )}

          {/* STEP 2: SPECIES */}
          {step === 2 && (
            <motion.div key="s2" className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {ALGERIAN_GAME.map((animal) => (
                <button
                  key={animal.id}
                  onClick={() => setFormData(prev => ({
                    ...prev, 
                    species: prev.species.includes(animal.id) ? prev.species.filter(s => s !== animal.id) : [...prev.species, animal.id]
                  }))}
                  className={`p-10 rounded-[2.5rem] border-2 text-left transition-all ${
                    formData.species.includes(animal.id) 
                    ? 'border-[#22c55e] bg-[#22c55e]/5 text-white shadow-[0_0_30px_rgba(34,197,94,0.1)]' 
                    : 'border-white/5 bg-white/[0.02] text-gray-600'
                  }`}
                >
                  <Zap size={32} className={formData.species.includes(animal.id) ? 'text-[#22c55e]' : 'text-gray-800'} />
                  <div className="mt-6 font-black text-2xl tracking-tighter">{animal.name}</div>
                  <p className="text-sm mt-2 opacity-60">{animal.desc}</p>
                </button>
              ))}
            </motion.div>
          )}

          {/* STEP 3: PRICING */}
          {step === 3 && (
            <motion.div key="s3" className="max-w-3xl mx-auto space-y-12">
               <div className="relative bg-black border border-white/5 rounded-[3.5rem] p-16 text-center">
                  <div className="text-[11px] font-black uppercase tracking-[0.4em] text-[#22c55e] mb-6">Price (DZD)</div>
                  <input 
                      type="number" 
                      className="bg-transparent border-none text-center text-[8rem] font-black outline-none w-full text-white" 
                      value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})} 
                  />
              </div>
              <Textarea 
                className="bg-white/[0.03] border-white/10 rounded-[2rem] p-8" 
                placeholder="Terms & Conditions..." 
                value={formData.conditions} onChange={e => setFormData({...formData, conditions: e.target.value})}
              />
            </motion.div>
          )}

          {/* STEP 4: MEDIA MANAGEMENT */}
          {step === 4 && (
            <motion.div key="s4" className="space-y-8">
              <div className="grid grid-cols-2 lg:grid-cols-5 gap-6">
                {/* 1. Existing Server Images */}
                {existingImages.map((img) => (
                  <div key={img.url} className={`group relative aspect-square rounded-[2rem] overflow-hidden border-2 transition-all ${mainImageSource.identifier === img.url ? 'border-[#22c55e] shadow-[0_0_30px_rgba(34,197,94,0.3)]' : 'border-white/5'}`}>
                    <img src={img.url} className="object-cover w-full h-full" alt="Server asset" />
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                        <button onClick={() => setMainImageSource({type: 'existing', identifier: img.url})} className="p-3 bg-white/10 rounded-xl hover:text-[#22c55e]"><Crown size={20} fill={mainImageSource.identifier === img.url ? "currentColor" : "none"} /></button>
                        <button onClick={() => setExistingImages(existingImages.filter(i => i.url !== img.url))} className="p-3 bg-red-500 rounded-xl"><Trash2 size={20}/></button>
                    </div>
                  </div>
                ))}

                {/* 2. New Local Previews */}
                {localPreviews.map((url, i) => (
                   <div key={url} className={`group relative aspect-square rounded-[2rem] overflow-hidden border-2 ${mainImageSource.type === 'new' && mainImageSource.identifier === i ? 'border-[#22c55e] shadow-[0_0_30px_rgba(34,197,94,0.3)]' : 'border-white/5 opacity-80'}`}>
                      <img src={url} className="object-cover w-full h-full" alt="New asset" />
                      <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                        <button onClick={() => setMainImageSource({type: 'new', identifier: i})} className="p-3 bg-white/10 rounded-xl hover:text-[#22c55e]"><Crown size={20} fill={mainImageSource.type === 'new' && mainImageSource.identifier === i ? "currentColor" : "none"} /></button>
                        <button onClick={() => setLocalFiles(localFiles.filter((_, idx) => idx !== i))} className="p-3 bg-red-500 rounded-xl"><X size={20}/></button>
                      </div>
                      <div className="absolute top-3 right-3 bg-[#22c55e] text-black text-[8px] font-black px-2 py-1 rounded-lg uppercase">Unsynced</div>
                   </div>
                ))}

                {/* 3. Add Photo Button */}
                <label className="aspect-square border-2 border-dashed border-white/10 rounded-[2rem] flex flex-col items-center justify-center cursor-pointer hover:bg-white/[0.03] transition-colors">
                   <Upload size={32} strokeWidth={1} className="text-gray-700" />
                   <span className="text-[10px] font-black text-gray-600 mt-3 uppercase tracking-widest">Add Media</span>
                   <input type="file" multiple className="hidden" onChange={e => e.target.files && setLocalFiles([...localFiles, ...Array.from(e.target.files)])} />
                </label>
              </div>
            </motion.div>
          )}

          {/* STEP 5: SYNC & PROGRESS TRACKER */}
          {step === 5 && (
            <motion.div key="s5" className="flex flex-col items-center justify-center min-h-[400px] text-center space-y-12">
                {(loading || isUploading) ? (
                  <div className="w-full max-w-md space-y-8">
                    {/* Radial Tracker */}
                    <div className="relative w-44 h-44 mx-auto">
                        <svg className="w-full h-full transform -rotate-90">
                            <circle cx="88" cy="88" r="78" stroke="currentColor" strokeWidth="6" fill="transparent" className="text-white/5" />
                            <motion.circle 
                                cx="88" cy="88" r="78" stroke="currentColor" strokeWidth="8" fill="transparent" className="text-[#22c55e]"
                                strokeDasharray="490" initial={{ strokeDashoffset: 490 }}
                                animate={{ strokeDashoffset: 490 - (490 * progress) / 100 }}
                                strokeLinecap="round"
                            />
                        </svg>
                        <div className="absolute inset-0 flex flex-col items-center justify-center">
                            <span className="text-5xl font-black text-white italic">{progress}%</span>
                            <span className="text-[9px] text-gray-500 font-black uppercase tracking-[0.3em] mt-1">Uploaded</span>
                        </div>
                    </div>

                    <div className="space-y-4">
                      <div className="space-y-1">
                        <h2 className="text-3xl font-black text-white uppercase italic tracking-tighter">Synchronizing Territory</h2>
                        <p className="text-gray-500 font-medium tracking-tight animate-pulse">Updating cloud storage and database entries...</p>
                      </div>
                      <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                        <motion.div initial={{ width: 0 }} animate={{ width: `${progress}%` }} className="h-full bg-[#22c55e] shadow-[0_0_15px_rgba(34,197,94,0.5)]" />
                      </div>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="w-24 h-24 bg-[#22c55e]/10 border-2 border-[#22c55e] rounded-full flex items-center justify-center text-[#22c55e] shadow-[0_0_50px_rgba(34,197,94,0.3)]">
                        <Check size={48} strokeWidth={4} />
                    </div>
                    <div className="space-y-3">
                        <h2 className="text-5xl font-black text-white uppercase italic tracking-tighter leading-none">Update Authorized</h2>
                        <p className="text-gray-500 max-w-sm mx-auto font-medium">Specifications have been cross-checked and are ready for publishing.</p>
                    </div>
                    <Button onClick={handleSubmit} className="bg-[#22c55e] text-black font-black px-16 h-20 text-xl rounded-[2rem] hover:scale-105 transition-all shadow-2xl shadow-[#22c55e]/40">Apply Specifications</Button>
                  </>
                )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* --- Global Navigation Footer --- */}
      <div className="p-10 border-t border-white/5 bg-white/[0.01] flex justify-between items-center">
        <Button variant="ghost" onClick={() => setStep(s => s - 1)} disabled={step === 1 || loading || isUploading} className="text-gray-500 font-bold px-10 h-16 rounded-2xl hover:text-white">
            <ChevronLeft className="mr-2"/> Back
        </Button>
        {step < 5 && (
            <Button onClick={handleNext} className="bg-white text-black font-black px-16 h-16 rounded-[1.5rem] hover:bg-[#22c55e] hover:text-black transition-all">
                Next Step <ChevronRight className="ml-2"/>
            </Button>
        )}
      </div>
    </div>
  )
}