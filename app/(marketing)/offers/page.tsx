import { getPublicOffers } from "@/lib/actions/public-offers"
import { getFilterData } from "@/lib/actions/get-locations"
import FilterSidebar from "@/components/public/filter-sidebar"
import OfferCard from "@/components/public/offer-card"

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
      <section className="bg-[#050805] pt-32 pb-20 px-6 border-b border-white/5">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-6xl md:text-8xl font-black text-white tracking-tighter uppercase italic leading-none">
            Hunt <span className="text-[#22c55e]">Algeria</span>
          </h1>
        </div>
      </section>

      <main className="max-w-7xl mx-auto px-6 py-24">
        <div className="flex flex-col lg:flex-row gap-16">
          {/* 🚀 Passing pure DB arrays here */}
          <FilterSidebar wilayas={wilayas} dairas={dairas} />
          
          <div className="flex-1">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              {results.map((offer) => (
                <OfferCard key={offer.id} offer={offer} />
              ))}
            </div>
            {results.length === 0 && (
              <div className="py-40 text-center bg-white rounded-[3rem] border border-slate-100">
                <p className="text-slate-400 font-black uppercase italic tracking-widest">No territories found</p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}