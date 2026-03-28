"use client";
import dynamic from "next/dynamic";
import Image from "next/image";

const DynamicMap = dynamic(() => import("./AlgeriaMap"), { 
  ssr: false,
  loading: () => <div className="h-full w-full bg-gray-100 animate-pulse" />
});

const wilayas = [
  { id:1,name: "Batna", hunts: 196, src: "/images/home/batna.png" }, // Replace with your Algerian images
  { id:2,name: "Batna", hunts: 653, src: "/images/home/batna.png" },
  { id:3,name: "Batna", hunts: 980, src: "/images/home/batna.png" },
];

export default function DiscoverySection() {
  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4">
        
        <h2 className="text-3xl font-bold text-center mb-8 text-black">Popular destinations</h2>

        {/* MAP CONTAINER */}
        <div className="relative w-full h-[500px] rounded-xl overflow-hidden shadow-sm border border-gray-200 mb-8">
          <DynamicMap />
          
          {/* "View Bigger Map" Button like in your image */}
          <button className="absolute top-4 right-4 z-[500] bg-black text-white px-4 py-2 rounded shadow-lg text-sm font-bold">
            View bigger map
          </button>
        </div>

        {/* WILAYA GRID (The 3 Cards) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {wilayas.map((wilaya) => (
            <div key={wilaya.id} className="relative h-64 rounded-2xl overflow-hidden group cursor-pointer shadow-md">
              <Image 
                src={wilaya.src} 
                alt={wilaya.name} 
                fill 
                className="object-cover transition-transform group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-black/30 group-hover:bg-black/20 transition-all" />
              
              <div className="absolute inset-0 flex flex-col items-center justify-center text-white">
                <h3 className="text-2xl font-bold">{wilaya.name}</h3>
                <p className="text-sm opacity-90">{wilaya.hunts} hunts</p>
              </div>
            </div>
          ))}
        </div>

        <div className="flex justify-center mt-10">
          <button className="border border-gray-300 px-12 py-3 rounded-lg font-bold text-gray-700 hover:bg-gray-50 transition-all">
            All destinations
          </button>
        </div>
      </div>
    </section>
  );
}