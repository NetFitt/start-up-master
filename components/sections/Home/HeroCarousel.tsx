"use client";

import * as React from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "motion/react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import Fade from "embla-carousel-fade";

const slides = [
  { id: 1, src: "/images/home/home_hero_1.jpg", title: "Master the Wild Instinct", subtitle: "Algeria's premier hunting grounds." },
  { id: 2, src: "/images/home/home_hero_1.jpg", title: "Pro-Grade Gear", subtitle: "Equip yourself for the Atlas expedition." },
];

export function HeroCarousel() {
  // 1. Initialize Embla with Swiper-like Fade and Autoplay
  const [emblaRef, emblaApi] = useEmblaCarousel(
    { loop: true, duration: 40 }, // Higher duration = smoother landing
    [Autoplay({ delay: 6000 }), Fade()]
  );

  const [selectedIndex, setSelectedIndex] = React.useState(0);

  // Sync the dots with the current slide
  const onSelect = React.useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  React.useEffect(() => {
    if (!emblaApi) return;
    emblaApi.on("select", onSelect);
  }, [emblaApi, onSelect]);

  return (
    <section className="relative w-full lg:max-h-[700px] h-[90dvh] overflow-hidden bg-black">
      {/* The Viewport */}
      <div className="overflow-hidden h-full" ref={emblaRef}>
        <div className="flex h-full">
          {slides.map((slide) => (
            <div key={slide.id} className="relative flex-[0_0_100%] min-w-0 h-full">
              <Image
                src={slide.src}
                alt={slide.title}
                fill
                priority
                className="object-cover"
              />
              {/* The "Swiper" Shadow Gradient */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/2 to-transparent" />
              <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/5 to-transparent" />

              {/* Content Container (MAX-WIDTH 7XL) */}
              <div className="absolute inset-0 flex flex-col justify-center">
                <div className="max-w-7xl mx-auto w-full px-8 lg:px-24">
                  <motion.div
                    key={selectedIndex} // Triggers animation on slide change
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className="max-w-xl space-y-4 px-12 "
                  >
                    <h1 className="text-4xl  text-shadow-premium font-inter md:text-7xl font-black text-white uppercase tracking-tighter">
                      {slide.title}
                    </h1>
                    <p className="text-[1rem] text-white text-shadow-premium ">{slide.subtitle}</p>
                    
                  </motion.div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 2. CUSTOM NAVIGATION (Aligned to Max-Width) */}
      <div className="absolute inset-0 pointer-events-none flex items-center">
        <div className="max-w-7xl mx-auto w-full px-4 md:px-8 flex justify-between items-center">
          <button 
            onClick={() => emblaApi?.scrollPrev()}
            className="pointer-events-auto cursor-pointer p-2 rounded-full bg-white/5 hover:bg-green-800 border border-white/10 text-white transition-all backdrop-blur-sm"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <button 
            onClick={() => emblaApi?.scrollNext()}
            className="pointer-events-auto cursor-pointer p-2 rounded-full bg-white/5 hover:bg-green-800 border border-white/10 text-white transition-all backdrop-blur-sm"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        </div>
      </div>

      {/* 3. PAGINATION DOTS (The Swiper Look) */}
      <div className="absolute bottom-10 left-0 w-full flex justify-center gap-3">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => emblaApi?.scrollTo(i)}
            className={`h-1.5 transition-all duration-500 rounded-full ${
              selectedIndex === i ? "w-8 bg-green-500" : "w-2 bg-white/30"
            }`}
          />
        ))}
      </div>
    </section>
  );
}