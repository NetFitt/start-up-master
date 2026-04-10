import { MapPin, ArrowUpRight, Camera } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link' // 🚀 Import Link

export default function OfferCard({ offer }: { offer: any }) {
  const displayImage = offer.mainImage || offer.images?.[0]?.url;

  const formatPrice = (priceStr: string) => {
    if (!priceStr) return "0";
    const cleanNumber = Number(String(priceStr).replace(/,/g, ''));
    return isNaN(cleanNumber) ? priceStr : cleanNumber.toLocaleString();
  };

  return (
    <Link 
      href={`/offers/${offer.slug}`} // 🚀 Link to the slug
      className="group block h-full" // Use 'block' to ensure it takes up space
    >
      <div className="bg-white border border-slate-100 rounded-[3rem] overflow-hidden hover:shadow-2xl hover:shadow-[#22c55e]/10 transition-all duration-500 flex flex-col h-full relative">
        
        {/* Image Section */}
        <div className="relative aspect-[16/10] overflow-hidden bg-slate-50">
          {displayImage ? (
            <Image 
              src={displayImage} 
              alt={offer.title}
              fill
              className="object-cover group-hover:scale-110 transition-transform duration-700"
              sizes="(max-w-780px) 100vw, (max-w-1200px) 50vw, 33vw"
            />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center bg-slate-100 text-slate-300">
              <Camera size={32} strokeWidth={1} />
              <span className="text-[10px] font-black uppercase tracking-widest mt-2 italic">No Visuals</span>
            </div>
          )}
          
          {/* Price Tag */}
          <div className="absolute top-6 right-6">
            <div className="bg-white/90 backdrop-blur-md px-4 py-2 rounded-2xl shadow-sm border border-white/20">
               <span className="text-[#050805] font-black text-lg">
                 {formatPrice(offer.price)} 
                 <small className="text-[10px] uppercase text-slate-500 ml-1">DZD</small>
               </span>
            </div>
          </div>
        </div>

        {/* Content Section */}
        <div className="p-10 flex-1 flex flex-col">
          <div className="flex items-center gap-2 mb-3">
            <MapPin size={14} className="text-[#22c55e]" />
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">
               {offer.wilayaName || offer.wilaya?.name || 'Algeria'}
            </span>
          </div>
          
          <h1 className="text-3xl font-black text-[#050805] uppercase tracking-tighter italic mb-4 leading-[0.9]">
            {offer.title}
          </h1>

          <p className="text-slate-500 text-sm line-clamp-2 mb-8 font-medium leading-relaxed">
            {offer.description}
          </p>

          <div className="mt-auto pt-6 border-t border-slate-100 flex items-center justify-between">
             <div className="flex -space-x-2">
               <div className="w-8 h-8 rounded-full bg-slate-100 border-2 border-white flex items-center justify-center text-xs">🐗</div>
               <div className="w-8 h-8 rounded-full bg-slate-100 border-2 border-white flex items-center justify-center text-xs">🦆</div>
             </div>
             
             {/* Note: I changed 'button' to a 'div' since it's nested inside a Link 
                 (Browsers don't like buttons inside links) */}
             <div className="flex items-center gap-2 font-black uppercase text-[10px] tracking-widest group-hover:text-[#22c55e] transition-colors">
              View details <ArrowUpRight size={16} />
            </div>
          </div>
        </div>
      </div>
    </Link>
  )
}