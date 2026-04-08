'use client'

import { useState, useTransition } from 'react'
import { motion, Variants } from 'framer-motion'
import { submitAssociationRequest } from "@/lib/actions/requests"
import { Button } from "@/components/ui/button"
import { Building2, MapPin, FileText, Loader2, ArrowUpRight, Search, Landmark } from "lucide-react"
import { toast } from "sonner"
import Link from 'next/link'
import DistrictSearchSelect from "./DistrictSearchSelect"

const container: Variants = {
    hidden: { opacity: 0, x: 50 },
    show: { 
      opacity: 1, 
      x: 0, 
      transition: { 
        staggerChildren: 0.1, 
        duration: 0.6, 
        ease: [0.22, 1, 0.36, 1] as const // 🚀 The FIX: Add "as const"
      } 
    }
}
const item: Variants = {
    hidden: { opacity: 0, y: 10 },
    show: { opacity: 1, y: 0 }
}

export default function AssociationRequestForm({ districts }: { districts: any[] }) {
  const [isPending, startTransition] = useTransition()
  const [formData, setFormData] = useState({
    districtId: '',
    associationName: '',
    description: '',
    address: '',
    presidentName: '',
    presidentEmail: '',
    presidentPhone: '',
    presidentNIN: ''
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    // 1. Basic Validation
    if (!formData.districtId) {
      toast.error("Please select a Forest District first.")
      return
    }
  
    startTransition(async () => {
      console.log("Submitting data...", formData) // 🚀 Debug log
      
      try {
        const res = await submitAssociationRequest(formData)
        
        if (res?.success) {
          toast.success("Application Sent!", {
            description: "Your request is now pending review by the Daira."
          })
          // Clear the form
          setFormData({ 
            districtId: '', 
            associationName: '', 
            description: '', 
            address: '', 
            presidentName: '', 
            presidentEmail: '', 
            presidentPhone: '', 
            presidentNIN: '' 
          })
        } else {
          toast.error(res?.error || "Something went wrong.")
        }
      } catch (err) {
        toast.error("Critical connection error. Please refresh.")
      }
    })
  }

  return (
    <motion.div 
      variants={container}
      initial="hidden"
      animate="show"
      className="bg-black/40 backdrop-blur-xl border border-white/10 p-8 lg:p-10 rounded-[2.5rem] shadow-2xl relative overflow-hidden"
    >
      {/* Form Decoration */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-[#22c55e]/10 blur-[60px] rounded-full" />

      <div className="mb-8">
        <span className="text-[#22c55e] font-black tracking-widest text-[10px] uppercase">Official Application</span>
        <h2 className="text-3xl font-bold text-white tracking-tight mt-1">Association Portal</h2>
        <p className="text-gray-400 text-sm mt-1">Join the network contributing to Algerian preservation.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* President Name */}
          <motion.div variants={item} className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 ml-1">President Full Name</label>
            <input 
              required
              value={formData.presidentName}
              onChange={(e) => setFormData({...formData, presidentName: e.target.value})}
              placeholder="Mister President Name"
              className="w-full bg-white/5 border border-white/10 rounded-2xl h-14 px-5 text-white focus:border-[#22c55e] transition-all font-bold"
            />
          </motion.div>

          {/* President Phone */}
          <motion.div variants={item} className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 ml-1">Contact Phone</label>
            <input 
              required
              value={formData.presidentPhone}
              onChange={(e) => setFormData({...formData, presidentPhone: e.target.value})}
              placeholder="05 / 06 / 07 ..."
              className="w-full bg-white/5 border border-white/10 rounded-2xl h-14 px-5 text-white focus:border-[#22c55e] transition-all font-bold"
            />
          </motion.div>
        </div>

        <motion.div variants={item} className="space-y-2">
          <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 ml-1">President Email (For Admin Login)</label>
          <input 
            required
            type="email"
            value={formData.presidentEmail}
            onChange={(e) => setFormData({...formData, presidentEmail: e.target.value})}
            placeholder="president@email.com"
            className="w-full bg-white/5 border border-white/10 rounded-2xl h-14 px-5 text-white focus:border-[#22c55e] transition-all font-bold"
          />
        </motion.div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Association Name */}
          <motion.div variants={item} className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 ml-1">Association Name</label>
            <div className="relative group">
              <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-[#22c55e] transition-colors" size={16} />
              <input 
                required
                value={formData.associationName}
                onChange={(e) => setFormData({...formData, associationName: e.target.value})}
                placeholder="Ex: Club de Chasse"
                className="w-full bg-white/5 border border-white/10 rounded-2xl h-14 pl-12 text-white placeholder:text-gray-600 focus:outline-none focus:border-[#22c55e] focus:bg-white/10 transition-all font-bold"
              />
            </div>
          </motion.div>

          {/* 🚀 NEW SEARCHABLE DISTRICT SELECT 🚀 */}
          <motion.div variants={item}>
            <DistrictSearchSelect 
              districts={districts}
              value={formData.districtId}
              onChange={(id) => setFormData({...formData, districtId: id})}
            />
          </motion.div>
        </div>

        {/* Full Address */}
        <motion.div variants={item} className="space-y-2">
          <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 ml-1">Headquarters Address</label>
          <div className="relative group">
            <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-[#22c55e] transition-colors" size={16} />
            <input 
              required
              value={formData.address}
              onChange={(e) => setFormData({...formData, address: e.target.value})}
              placeholder="City, Street, Building Number"
              className="w-full bg-white/5 border border-white/10 rounded-2xl h-14 pl-12 text-white placeholder:text-gray-600 focus:outline-none focus:border-[#22c55e] focus:bg-white/10 transition-all font-bold"
            />
          </div>
        </motion.div>

        {/* Description */}
        <motion.div variants={item} className="space-y-2">
          <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 ml-1">Application Summary</label>
          <div className="relative group">
            <FileText className="absolute left-4 top-4 text-gray-500 group-focus-within:text-[#22c55e] transition-colors" size={16} />
            <textarea 
              required
              rows={4}
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              placeholder="Provide a brief description of the association's goals..."
              className="w-full bg-white/5 border border-white/10 rounded-2xl pl-12 pr-4 pt-4 text-white placeholder:text-gray-600 focus:outline-none focus:border-[#22c55e] focus:bg-white/10 transition-all font-bold resize-none"
            />
          </div>
        </motion.div>

        {/* Submit Button */}
        <motion.div variants={item} className="pt-2">
          <Button 
            type="submit" 
            disabled={isPending}
            className="w-full cursor-pointer h-16 bg-[#22c55e] hover:bg-[#16a34a] text-black font-black text-lg rounded-[1.5rem] flex items-center justify-center gap-3 transition-all shadow-[0_10px_30px_rgba(34,197,94,0.2)]"
          >
            {isPending ? <Loader2 className="animate-spin" /> : (
              <>
                SUBMIT REGISTRATION <ArrowUpRight size={20} />
              </>
            )}
          </Button>
        </motion.div>
      </form>

      <div className="mt-8 text-center">
         <Link href="/login" className="text-gray-500 text-xs font-bold hover:text-white transition-colors">
            Already have an account? <span className="text-[#22c55e]">Sign in here</span>
         </Link>
      </div>
    </motion.div>
  )
}