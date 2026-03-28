"use client";

import * as React from "react";
import Image from "next/image";
import { motion } from "motion/react";
import { ChevronRight, ShieldCheck } from "lucide-react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"; // Adjust path based on your folder structure
import Autoplay from "embla-carousel-autoplay";

const slides = [
  {
    id: 1,
    src: "/images/home/home_hero_1.jpg",
    title: "Master the Wild Instinct",
    subtitle: "Algeria's premier hunting grounds, curated for the elite marksman.",
  },
  {
    id: 2,
    src: "/images/home/home_hero_1.jpg", 
    title: "Pro-Grade Gear & Guides",
    subtitle: "Equip yourself with world-class gear for your next Atlas expedition.",
  },
  {
    id: 3,
    src: "/images/home/home_hero_1.jpg",
    title: "Heritage & Territory",
    subtitle: "Discover ancient trails and diverse game across the North African terrain.",
  },
];

export function HeroCarousel() {
  // Autoplay plugin for that "premium" feel
  const plugin = React.useRef(
    Autoplay({ delay: 5000, stopOnInteraction: true })
  );

  return (
    <section className="relative w-full h-[80dvh] bg-hunter-green overflow-hidden">
      <Carousel
        plugins={[plugin.current]}
        className="w-full h-full"
        opts={{
          align: "start",
          loop: true,
        }}
      >
        <CarouselContent className="-ml-0 h-[80dvh]">
          {slides.map((slide) => (
            <CarouselItem key={slide.id} className="pl-0 relative w-full h-full">
              <div className="relative w-full h-full">
                {/* Optimized Image */}
                <Image
                  src={slide.src}
                  alt={slide.title}
                  fill
                  priority={slide.id === 1}
                  className="object-cover"
                  sizes="100vw"
                />

                {/* Scrim/Overlay for Readability */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />

                {/* Content */}
                <div className="absolute inset-0 flex flex-col justify-end p-8 pb-20">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="max-w-md space-y-4"
                  >
                    {/* <div className="flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/20 w-fit px-3 py-1 rounded-full">
                      <ShieldCheck className="w-4 h-4 text-green" />
                      <span className="text-bone-white text-[10px] font-bold uppercase tracking-[0.2em]">
                        TuChassou Premium
                      </span>
                    </div> */}

                    <h1 className="text-4xl font-black text-bone-white leading-tight uppercase">
                      {slide.title}
                    </h1>
                    
                    <p className="text-desert-sand font-medium text-lg leading-relaxed">
                      {slide.subtitle}
                    </p>

                    <div className="pt-4">
                      <button className="group flex items-center justify-center gap-3 bg-green-800 text-white py-4 px-8 rounded-xl font-bold text-lg w-full shadow-xl active:scale-95 transition-all">
                        Réserver Maintenant
                        <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                      </button>
                    </div>
                  </motion.div>
                </div>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>

        {/* Navigation Arrows - Hidden on small mobile, visible on tablet+ */}
        <div className="hidden md:block">
          <CarouselPrevious className="left-8 bg-white/10 border-white/20 text-white hover:bg-green-900" />
          <CarouselNext className="right-8 bg-white/10 border-white/20 text-white hover:bg-green-900" />
        </div>
      </Carousel>
    </section>
  );
}