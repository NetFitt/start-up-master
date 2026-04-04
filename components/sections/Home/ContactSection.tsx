"use client";
import { useState } from "react";

import { Send, Loader2, Mail, Phone, MapPin } from "lucide-react";
import { sendContactMessage } from "@/lib/actions/contact";

export function ContactSection() {
  const [status, setStatus] = useState<"idle" | "loading" | "success">("idle");

  async function handleSubmit(formData: FormData) {
    setStatus("loading");
    await sendContactMessage(formData);
    setStatus("success");
    setTimeout(() => setStatus("idle"), 5000);
  }

  return (
    <section id="contact" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4">
        <div className="bg-[#050805] rounded-[40px] overflow-hidden shadow-2xl flex flex-col lg:flex-row">
          {/* Info Side */}
          <div className="lg:w-1/3 bg-[#0a0f0a] p-12 text-white">
            <h2 className="text-3xl font-bold mb-8 tracking-tighter">Get in Touch</h2>
            <div className="space-y-8">
              <ContactInfo icon={<Mail className="text-[#22c55e]" />} title="Email" detail="expeditions@youhunt.dz" />
              <ContactInfo icon={<Phone className="text-[#22c55e]" />} title="Phone" detail="+213 (0) 550 00 00 00" />
              <ContactInfo icon={<MapPin className="text-[#22c55e]" />} title="Base" detail="Algiers, Algeria" />
            </div>
          </div>

          {/* Form Side */}
          <div className="lg:w-2/3 p-12 bg-white/5 backdrop-blur-sm">
            <form action={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Full Name</label>
                <input name="name" required className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-white focus:border-[#22c55e] outline-none transition-all" placeholder="Mohamed Amine" />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Email</label>
                <input name="email" type="email" required className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-white focus:border-[#22c55e] outline-none transition-all" placeholder="mohamed@example.dz" />
              </div>
              <div className="md:col-span-2 space-y-2">
                <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Message</label>
                <textarea name="message" rows={4} required className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-white focus:border-[#22c55e] outline-none transition-all" placeholder="How can we help you plan your next hunt?" />
              </div>
              <div className="md:col-span-2">
                <button 
                  disabled={status === "loading"}
                  className="w-full cursor-pointer bg-[#22c55e] hover:bg-[#16a34a] text-black font-black py-5 rounded-2xl flex items-center justify-center gap-3 transition-all disabled:opacity-50"
                >
                  {status === "loading" ? <Loader2 className="animate-spin" /> : status === "success" ? "MESSAGE SENT!" : "SEND EXPEDITION REQUEST"}
                  <Send size={18} />
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}

function ContactInfo({ icon, title, detail }: { icon: any, title: string, detail: string }) {
  return (
    <div className="flex items-center gap-4">
      <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center border border-white/10">{icon}</div>
      <div>
        <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">{title}</p>
        <p className="font-medium">{detail}</p>
      </div>
    </div>
  );
}