"use client";
import { motion } from "motion/react";
import { Quote, Star } from "lucide-react";

const testimonials = [
  {
    name: "Ahmed Belkacem",
    role: "Professional Hunter",
    content: "The most organized hunting expeditions I've joined in Algeria. The Batna territory was breathtaking.",
    rating: 5
  },
  {
    name: "Smain Rouiba",
    role: "Outdoor Enthusiast",
    content: "Excellent platform. Finding legal hunting grounds and connecting with local guides has never been easier.",
    rating: 5
  },
  {
    name: "Karim Djelfa",
    role: "Equipment Specialist",
    content: "A game changer for the Algerian hunting community. Authentic, safe, and highly professional.",
    rating: 5
  }
];

export function WitnessesSection() {
  return (
    <section className="py-24 bg-[#050805] overflow-hidden">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex flex-col items-center mb-16 text-center">
          <span className="text-[#22c55e] font-bold tracking-widest text-xs uppercase mb-3">Community</span>
          <h2 className="text-4xl font-bold text-white tracking-tighter">Hunter Witnesses</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((t, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.2 }}
              viewport={{ once: true }}
              className="bg-white/5 border border-white/10 p-8 rounded-3xl relative group hover:border-[#22c55e]/30 transition-colors"
            >
              <Quote className="absolute top-6 right-8 text-[#22c55e]/20 group-hover:text-[#22c55e]/40 transition-colors" size={40} />
              <div className="flex gap-1 mb-4">
                {[...Array(t.rating)].map((_, i) => (
                  <Star key={i} size={14} className="fill-[#22c55e] text-[#22c55e]" />
                ))}
              </div>
              <p className="text-gray-300 italic mb-8 leading-relaxed">"{t.content}"</p>
              <div>
                <p className="text-white font-bold">{t.name}</p>
                <p className="text-[#22c55e] text-xs font-medium uppercase tracking-wider">{t.role}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}