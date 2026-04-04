// components/Header.tsx
"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Menu, X, Crosshair } from "lucide-react";
import Link from "next/link";

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  // Logic to detect scroll
  useEffect(() => {
    const handleScroll = () => {
      // Changes color after scrolling 100px (typically the end of a hero top section)
      if (window.scrollY > 100) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);
  // Navigation Links
  const navLinks = [
    { name: "Home", href: "/" },
    { name: "Territories", href: "/territories" },
    { name: "Equipment", href: "/equipment" },
    { name: "Contact", href: "/contact" },
  ];

  return (
    <header className={`fixed top-0 w-full transition-all duration-300 z-[9999] ${
      isScrolled 
        ? "bg-[#1c1c1d] shadow-lg " // Scrolled state: Dark background
        : "bg-transparent "        // Top state: Transparent
    }`}>
      <div className="max-w-7xl mx-auto flex items-center justify-between p-4 md:px-8 h-20">
        
        {/* 1. Logo Area */}
        <Link href="/" className="flex items-center gap-2 z-50 group">
          <div className="bg-green-800 p-1.5 rounded-lg group-hover:bg-green-700 transition-colors">
            <Crosshair className="text-white w-5 h-5" />
          </div>
          <span className="font-serif text-xl text-white font-black tracking-tighter uppercase italic">
            you<span className="text-green-600 font-light">hunt</span>
          </span>
        </Link>

        {/* 2. DESKTOP NAVIGATION (Visible on md+ screens) */}
        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className="text-sm font-bold uppercase tracking-widest text-gray-300 hover:text-white transition-colors relative group"
            >
              {link.name}
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-green-600 transition-all group-hover:w-full" />
            </Link>
          ))}
          
          {/* Desktop CTA */}
          <a href="/login" className="ml-4 bg-green-800 cursor-pointer hover:bg-green-700 text-white px-6 py-2 rounded-full text-xs font-black uppercase tracking-widest transition-all">
            Join Now
          </a>
        </nav>

        {/* 3. MOBILE BURGER BUTTON (Hidden on md+ screens) */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="md:hidden z-50 p-2 focus:outline-none bg-white/5 rounded-lg border border-white/10"
          aria-label="Toggle Menu"
        >
          {isOpen ? <X className="w-6 h-6  text-white" /> : <Menu className="w-6 h-6 text-white" />}
        </button>
      </div>

      {/* 4. MOBILE MENU OVERLAY */}
      <AnimatePresence>
        {isOpen && (
          <motion.nav
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed inset-0 bg-[#1c1c1d] pt-28 px-8 flex flex-col gap-8 h-screen md:hidden"
          >
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                onClick={() => setIsOpen(false)}
                className="text-3xl font-black text-white uppercase tracking-tighter border-b border-white/5 pb-4"
              >
                {link.name}
              </Link>
            ))}
            <button className="mt-4 bg-green-800 text-white py-4 rounded-xl font-bold text-xl w-full active:scale-95 transition-transform">
              Join Now
            </button>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
} 