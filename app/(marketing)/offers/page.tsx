import { getPublicOffers } from "@/lib/actions/public-offers"
import { getFilterData } from "@/lib/actions/get-locations"
import FilterSidebar from "@/components/public/filter-sidebar"
import OfferCard from "@/components/public/offer-card"
import Image from "next/image" // 🚀 Import Image

export default async function OffersPage({ 
  searchParams 
}: { 
  searchParams: Promise<{ [key: string]: string | string[] | undefined }> 
}) {
  const [filters, { wilayas, dairas }] = await Promise.all([
    searchParams,
    getFilterData()
  ])

  const results = await getPublicOffers({
    wilayaId: filters.wilayaId as string,
    dairaId: filters.dairaId as string,
    minPrice: filters.minPrice ? Number(filters.minPrice) : undefined,
    maxPrice: filters.maxPrice ? Number(filters.maxPrice) : undefined,
  })

  return (
    <div className="min-h-screen bg-slate-50">
      
      {/* 🌲 HERO SECTION WITH BACKGROUND IMAGE */}
      <section className="relative h-[60dvh] min-h-[400px] flex items-center justify-center overflow-hidden bg-[#050805]">
        {/* The Background Image */}
        <Image 
          src="/images/home/home_hero_1.jpg" // 🚀 Change this to your preferred landscape
          alt="Hunting grounds"
          fill
          priority
          className="object-cover opacity-60" // Lower opacity to make text pop
        />

        {/* 🌑 Premium Overlays */}
        {/* Top shade for header visibility */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-transparent to-transparent" />
        {/* Bottom shade for depth */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#050805] via-transparent to-transparent" />

        {/* Content Area */}
        <div className="relative z-10 max-w-7xl mx-auto text-center px-6">
          <h1 className="text-7xl md:text-9xl font-black text-white tracking-tighter uppercase italic leading-none drop-shadow-2xl">
            Hunt <span className="text-[#22c55e]">Algeria</span>
          </h1>
          <p className="mt-6 text-white font-bold uppercase tracking-[0.3em] text-xs md:text-sm">
            Explore {results.length} Premium Territories
          </p>
        </div>
      </section>

      {/* 📊 MAIN RESULTS AREA */}
      <main className="max-w-7xl mx-auto px-6 py-24">
        <div className="flex flex-col lg:flex-row gap-16">
          
          {/* Sidebar */}
          <FilterSidebar wilayas={wilayas} dairas={dairas} />
          
          <div className="flex-1">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              {results.map((offer) => (
                <OfferCard key={offer.id} offer={offer} />
              ))}
            </div>

            {/* Empty State */}
            {results.length === 0 && (
              <div className="py-40 text-center bg-white rounded-[3rem] border border-slate-100 shadow-sm">
                <p className="text-slate-400 font-black uppercase italic tracking-widest">
                  No territories found in this sector
                </p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}