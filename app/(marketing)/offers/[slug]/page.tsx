import { getOfferBySlug } from "@/lib/actions/public-offers"
import ImageGallery from "@/components/public/details/image-gallery"
import { MapPin, Phone, Mail, ShieldCheck, Info, FileText, Users } from 'lucide-react'
import { notFound } from "next/navigation"

// 🚀 NEXT.JS 15/16 REQUIREMENT: Params is now a Promise
interface PageProps {
  params: Promise<{ slug: string }>;
}

export default async function OfferDetailsPage({ params }: PageProps) {
  // 🚀 CRITICAL FIX: You must await params to get the actual slug
  const awaitedParams = await params;
  const slug = awaitedParams.slug;

  const offer = await getOfferBySlug(slug);

  // If the DB returns null, we trigger the 404 page
  if (!offer) notFound();

  return (
    <div className="min-h-screen bg-white pb-20">
      {/* 🌲 HEADER SPACE - Clean dark background for the nav transition */}
      <div className="h-20 bg-[#1c1c1d]" />

      <main className="max-w-7xl mx-auto px-6 pt-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
          
          {/* LEFT: CONTENT (2/3 of the screen) */}
          <div className="lg:col-span-2 space-y-12">
            
            {/* Image Gallery Component */}
            <ImageGallery 
              mainImage={offer.mainImage!} 
              images={offer.images as any[]} 
            />
            
            <div className="space-y-6">
              <h1 className="text-5xl md:text-6xl font-black text-[#050805] uppercase tracking-tighter italic leading-[0.9]">
                {offer.title}
              </h1>
              
              <div className="flex flex-wrap gap-4">
                <span className="bg-slate-100 px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest text-slate-500 flex items-center gap-2">
                  <MapPin size={12} className="text-[#22c55e]" /> 
                  {offer.wilaya?.name || "Territory"} • {offer.daira?.name || "Local Sector"}
                </span>
                <span className="bg-[#22c55e]/10 px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest text-[#22c55e] flex items-center gap-2">
                  <ShieldCheck size={12} /> Authorized Territory
                </span>
              </div>
            </div>

            <div className="prose prose-slate max-w-none">
              <h3 className="text-xl font-black uppercase italic flex items-center gap-2">
                <FileText className="text-[#22c55e]" size={20} /> Description
              </h3>
              <p className="text-slate-600 leading-relaxed text-lg">
                {offer.description}
              </p>
              
              <h3 className="text-xl font-black uppercase italic flex items-center gap-2 mt-10">
                <Info className="text-[#22c55e]" size={20} /> Conditions & Rules
              </h3>
              <div className="bg-slate-50 p-8 rounded-[2rem] border border-slate-100 text-slate-600">
                {offer.conditions || "Standard hunting regulations apply for this season. Please ensure all permits are valid."}
              </div>
            </div>

            {/* ASSOCIATIONS SECTION - Fetched via Wilaya Relation */}
            <section className="pt-10 border-t border-slate-100">
              <h3 className="text-2xl font-black uppercase italic mb-8 flex items-center gap-3">
                <Users className="text-[#22c55e]" size={24} /> Active Associations
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {offer.wilaya?.associations?.length ? (
                  offer.wilaya.associations.map((ass: any) => (
                    <div 
                      key={ass.id} 
                      className="p-6 rounded-3xl border border-slate-100 bg-slate-50 flex items-center justify-between group hover:border-[#22c55e] transition-colors"
                    >
                      <div>
                        <p className="font-bold text-[#050805] uppercase text-sm">{ass.name}</p>
                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">
                          Authorized Partner
                        </p>
                      </div>
                      <a 
                        href={`tel:${ass.phone}`} 
                        className="w-10 h-10 rounded-full bg-white flex items-center justify-center border border-slate-200 group-hover:bg-[#22c55e] group-hover:text-white transition-all shadow-sm"
                      >
                        <Phone size={16} />
                      </a>
                    </div>
                  ))
                ) : (
                  <div className="col-span-2 p-10 border-2 border-dashed border-slate-100 rounded-[2rem] text-center">
                    <p className="text-slate-400 text-sm font-bold uppercase tracking-widest">
                      No associations registered for {offer.wilaya?.name}
                    </p>
                  </div>
                )}
              </div>
            </section>
          </div>

          {/* RIGHT: STICKY BOOKING CARD (1/3 of the screen) */}
          <div className="lg:col-span-1">
            <div className="sticky top-32 space-y-6">
              <div className="bg-[#050805] rounded-[3rem] p-10 text-white shadow-2xl">
                <p className="text-[10px] font-black uppercase tracking-[0.3em] text-[#22c55e] mb-2">
                  Package Price
                </p>
                <div className="flex items-baseline gap-2 mb-8">
                  <span className="text-5xl font-black italic">
                    {Number(offer.price).toLocaleString()}
                  </span>
                  <span className="text-xl font-bold text-slate-400 uppercase">DZD</span>
                </div>
                
                <button className="w-full bg-[#22c55e] text-[#050805] font-black py-5 rounded-2xl hover:scale-[1.02] active:scale-95 transition-all uppercase tracking-widest text-xs shadow-lg shadow-[#22c55e]/20 mb-6">
                  Apply for Permit
                </button>

                <div className="space-y-4 pt-6 border-t border-white/10">
                  <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">
                    Contact Directorate
                  </p>
                  
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-[#22c55e]">
                      <Phone size={18} />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-400">Official Phone</p>
                      <p className="text-sm font-black">+213 (0) 24 12 34 56</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-[#22c55e]">
                      <Mail size={18} />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-400">Official Email</p>
                      <p className="text-sm font-black">
                        contact@{offer.wilaya?.name?.toLowerCase().replace(/\s+/g, '')}.gov.dz
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Verified Badge Section */}
              <div className="bg-slate-50 rounded-[2.5rem] p-8 border border-slate-100">
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-4 text-center italic">
                  Season valid until Dec 2026
                </p>
                <div className="flex justify-center gap-4 grayscale opacity-50">
                  <div className="w-8 h-8 rounded bg-slate-200" />
                  <div className="w-8 h-8 rounded bg-slate-200" />
                  <div className="w-8 h-8 rounded bg-slate-200" />
                </div>
              </div>
            </div>
          </div>

        </div>
      </main>
    </div>
  )
}