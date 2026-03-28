// components/Header.tsx
"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Menu, X, Crosshair } from "lucide-react";
import Link from "next/link";

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="fixed top-0 w-full z-50 bg-[#1c1c1d] text-bone-white shadow-md">
      <div className="flex items-center justify-between p-4">
        {/* Logo Area */}
        <Link href="/" className="flex items-center gap-2 z-50">
          <Crosshair className="text-green w-6 h-6" />
          <span className="font-bold text-xl tracking-wide font-sans uppercase">YouHunting</span>
        </Link>

        {/* Burger Button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="z-50 p-2 focus:outline-none"
          aria-label="Toggle Menu"
        >
          {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.nav
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed inset-0 bg-[#1c1c1d] pt-24 px-6 flex flex-col gap-6 h-screen"
          >
            {["Accueil", "Équipement", "Réservations", "Contact"].map((item) => (
              <Link
                key={item}
                href={`/${item.toLowerCase()}`}
                onClick={() => setIsOpen(false)}
                className="text-2xl font-semibold border-b border-earth-brown/30 pb-4"
              >
                {item}
              </Link>
            ))}
            <button className="mt-8 bg-green-800 text-bone-white py-3 rounded-lg font-bold text-lg w-full active:scale-95 transition-transform">
              Rejoindre
            </button>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
}