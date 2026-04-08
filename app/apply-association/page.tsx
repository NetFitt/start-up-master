import { db } from "@/db"
import { forestDistricts } from "@/db/schema/forestDistricts"
import AssociationRequestForm from "@/components/apply-association/AssociationRequestForm"
import { ShieldCheck } from "lucide-react"
import Link from "next/link"

export default async function AssociationRequestPage() {
  const allDistricts = await db.query.forestDistricts.findMany({
    with: { city: true },
    orderBy: (districts, { asc }) => [asc(districts.name)]
  })

  return (
    <div className="relative min-h-screen w-full flex bg-[#050805] overflow-hidden">
      {/* ─── Immersive Background ─── */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-transform duration-[20s] scale-110 animate-pulse-slow"
        style={{ backgroundImage: `url('https://images.unsplash.com/photo-1441974231531-c6227db76b6e?q=80&w=2560&auto=format&fit=crop')` }}
      />
      {/* Dynamic Overlays for that "Dark Forest" vibe */}
      <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px]" />
      <div className="absolute inset-0 bg-gradient-to-r from-[#050805] via-transparent to-[#050805]/80" />

      {/* ─── Content Layer ─── */}
      <div className="relative z-10 w-full max-w-[1400px] mx-auto flex flex-col lg:flex-row items-center justify-between px-6 lg:px-12 py-10 lg:py-0">
        
        {/* Left Side: Branding & Headline */}
        <div className="w-full lg:w-1/2 space-y-8 mb-12 lg:mb-0">
          <Link href="/" className="flex items-center gap-3 w-fit">
            <div className="w-12 h-12 bg-[#22c55e] rounded-xl flex items-center justify-center shadow-[0_0_20px_rgba(34,197,94,0.3)]">
              <ShieldCheck className="text-black" size={28} />
            </div>
            <span className="text-3xl font-black tracking-tighter text-white uppercase">YOUHUNT</span>
          </Link>

          <div className="space-y-4">
            <h1 className="text-6xl lg:text-8xl font-black text-white leading-[0.9] tracking-tighter">
              START YOUR <br />
              <span className="text-[#22c55e] drop-shadow-[0_0_15px_rgba(34,197,94,0.4)]">LEGACY.</span>
            </h1>
            <p className="text-gray-200/80 text-xl max-w-md font-medium leading-relaxed border-l-4 border-[#22c55e] pl-6 py-2">
              Join the national network of hunting associations and contribute to Algerian wildlife preservation.
            </p>
          </div>

          <div className="pt-8">
             <div className="text-white text-xs font-black tracking-[0.4em] uppercase opacity-50">
               National Forestry Department of Algeria
             </div>
          </div>
        </div>

        {/* Right Side: The Glass Form */}
        <div className="w-full lg:w-[580px]">
          <div className="relative">
            {/* Form Header Floating Label */}
            <div className="absolute -top-12 right-0">
               <Link href="/login" className="bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/10 px-6 py-2 rounded-full text-sm font-bold text-white transition-all">
                 Member Portal
               </Link>
            </div>
            
            <AssociationRequestForm districts={allDistricts} />
          </div>
        </div>
      </div>
    </div>
  )
}