// components/Footer.tsx
import Link from "next/link";
import { Crosshair } from "lucide-react";
import { FaFacebook, FaTwitter, FaYoutube, FaInstagram } from "react-icons/fa";
import Image from "next/image";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-black text-white border-t border-green-900/30 pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-8">
        
        {/* Top Section: Links Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 mb-16">
          
          {/* Brand Column */}
          <div className="lg:col-span-1 space-y-6">
            <Link href="/" className="flex items-center gap-2 group">
              <Crosshair className="text-green-600 w-6 h-6" />
              <span className="font-serif text-2xl font-black tracking-tighter uppercase italic">
                you<span className="text-green-600 font-light">hunt</span>
              </span>
            </Link>
            <p className="text-xs font-bold uppercase tracking-widest text-green-600">
              Authentic Algerian Expeditions
            </p>
            
            {/* Language/Currency Pickers (Matching the screenshot) */}
            <div className="flex gap-2">
              <select className="bg-[#1c1c1d] border border-white/10 text-[10px] uppercase font-bold px-3 py-2 rounded-md outline-none focus:border-green-600">
                <option>DZD (DA)</option>
                <option>USD ($)</option>
                <option>EUR (€)</option>
              </select>
              <select className="bg-[#1c1c1d] border border-white/10 text-[10px] uppercase font-bold px-3 py-2 rounded-md outline-none focus:border-green-600">
                <option>ENG</option>
                <option>FR</option>
                <option>AR</option>
              </select>
            </div>
          </div>

          {/* Links Columns */}
          <div>
            <h4 className="font-black uppercase tracking-widest text-sm mb-6 text-green-600">you<span className="text-green-600 font-light">hunt</span></h4>
            <ul className="space-y-4 text-sm text-gray-400 font-medium">
              <li><Link href="/about" className="hover:text-white transition-colors">About us</Link></li>
              <li><Link href="/blog" className="hover:text-white transition-colors">Wild Blog</Link></li>
              <li><Link href="/mission" className="hover:text-white transition-colors">Our mission</Link></li>
              <li><Link href="/contact" className="hover:text-white transition-colors">Contact us</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-black uppercase tracking-widest text-sm mb-6 text-green-600">Website</h4>
            <ul className="space-y-4 text-sm text-gray-400 font-medium">
              <li><Link href="/map" className="hover:text-white transition-colors">Hunting map</Link></li>
              <li><Link href="/catalog" className="hover:text-white transition-colors">Expeditions catalog</Link></li>
              <li><Link href="/terms" className="hover:text-white transition-colors">Terms & conditions</Link></li>
              <li><Link href="/privacy" className="hover:text-white transition-colors">Privacy policy</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-black uppercase tracking-widest text-sm mb-6 text-green-600">Why Join</h4>
            <ul className="space-y-4 text-sm text-gray-400 font-medium">
              <li><Link href="/subs" className="hover:text-white transition-colors">Pro Subscriptions</Link></li>
              <li><Link href="/recs" className="hover:text-white transition-colors">Recommendations</Link></li>
              <li><Link href="/refer" className="hover:text-white transition-colors">Invite your friend</Link></li>
              <li><Link href="/faq" className="hover:text-white transition-colors">FAQ</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-black uppercase tracking-widest text-sm mb-6 text-green-600">Account</h4>
            <ul className="space-y-4 text-sm text-gray-400 font-medium">
              <li><Link href="/login" className="hover:text-white transition-colors">Log in</Link></li>
              <li><Link href="/signup" className="hover:text-white transition-colors">Sign up</Link></li>
              <li><Link href="/partner" className="hover:text-white transition-colors">Become a guide</Link></li>
            </ul>
          </div>
        </div>

        {/* Bottom Section: Apps & Socials */}
        <div className="border-t border-white/5 pt-8 flex flex-col md:flex-row justify-between items-center gap-8">
          
          <div className="text-gray-500 text-[10px] uppercase font-bold tracking-widest">
            Copyright © {currentYear} youHunt.dz - All Rights Reserved
          </div>

          {/* App Store Buttons (Using simple placeholder style) */}
          {/* <div className="flex gap-4 items-center">
             <div className="bg-white/5 border border-white/10 px-4 py-2 rounded-lg flex items-center gap-2 cursor-pointer hover:bg-white/10 transition-all">
                <div className="w-5 h-5 bg-gray-400 rounded-sm" /> 
                <span className="text-[10px] font-bold uppercase leading-none">App Store</span>
             </div>
             <div className="bg-white/5 border border-white/10 px-4 py-2 rounded-lg flex items-center gap-2 cursor-pointer hover:bg-white/10 transition-all">
                <div className="w-5 h-5 bg-gray-400 rounded-sm" /> 
                <span className="text-[10px] font-bold uppercase leading-none">Google Play</span>
             </div>
          </div> */}

          {/* Social Icons */}
          <div className="flex gap-6">
            <FaFacebook className="w-5 h-5 text-gray-500 hover:text-white cursor-pointer transition-all" />
            <FaTwitter className="w-5 h-5 text-gray-500 hover:text-white cursor-pointer transition-all" />
            <FaYoutube className="w-5 h-5 text-gray-500 hover:text-white cursor-pointer transition-all" />
            <FaInstagram className="w-5 h-5 text-gray-500 hover:text-white cursor-pointer transition-all" />
          </div>

        </div>
      </div>
    </footer>
  );
}