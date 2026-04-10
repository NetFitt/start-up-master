'use client'
import { useState } from 'react'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'

export default function ImageGallery({ mainImage, images }: { mainImage: string, images: any[] }) {
  const allImages = [mainImage, ...images.map(img => img.url)].filter(Boolean)
  const [active, setActive] = useState(allImages[0])

  return (
    <div className="space-y-4">
      <div className="relative aspect-[16/9] overflow-hidden rounded-[3rem] bg-slate-100 border border-slate-200">
        <AnimatePresence mode="wait">
          <motion.div
            key={active}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="w-full h-full"
          >
            <Image src={active} alt="Territory" fill className="object-cover" priority />
          </motion.div>
        </AnimatePresence>
      </div>
      
      <div className="flex gap-4 overflow-x-auto pb-2 custom-scrollbar">
        {allImages.map((img, i) => (
          <button 
            key={i} 
            onClick={() => setActive(img)}
            className={`relative w-24 h-24 shrink-0 rounded-2xl overflow-hidden border-2 transition-all ${active === img ? 'border-[#22c55e] scale-95' : 'border-transparent'}`}
          >
            <Image src={img} alt="Thumbnail" fill className="object-cover" />
          </button>
        ))}
      </div>
    </div>
  )
}