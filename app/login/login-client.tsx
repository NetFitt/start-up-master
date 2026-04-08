'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { Mail, Lock, Eye, EyeOff, AlertCircle, ArrowRight, ShieldCheck } from 'lucide-react'
import Link from 'next/link'
// ─── Animation Config ──────────────────────────────────────────
const ease = [0.22, 1, 0.36, 1] as const

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.2 }
  }
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease } }
}

export function LoginClient() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPass, setShowPass] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')

    const res = await signIn('credentials', {
      email,
      password,
      redirect: false,
    })

    if (res?.error) {
      setError('Invalid credentials. Please check your hunting ID/email.')
      setLoading(false)
    } else {
      router.push('/dashboard')
      router.refresh()
    }
  }

  return (
    <div className="relative min-h-screen w-full flex overflow-hidden bg-[#050805]">
      {/* ─── Background Section (Left 60%) ─── */}
      <div className="relative hidden lg:block w-[60%] overflow-hidden">
        {/* Replace this URL with your forest image from image 2 */}
        <div 
          className="absolute inset-0 bg-cover bg-center transition-transform duration-[10s] hover:scale-105"
          style={{ backgroundImage: `url('https://images.unsplash.com/photo-1441974231531-c6227db76b6e?q=80&w=2560&auto=format&fit=crop')` }}
        />
        {/* Dark Forest Overlay */}
        <div className="absolute inset-0 bg-linear-to-r from-black/60 via-black/20 to-[#050805]" />
        
        {/* Branding Overlay */}
        <motion.div 
          className="relative z-10 h-full flex flex-col justify-between p-16"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1 }}
        >
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-[#22c55e] rounded-lg flex items-center justify-center">
              <ShieldCheck className="text-black" size={24} />
            </div>
            <span className="text-2xl font-bold tracking-tighter text-white">YOUHUNT</span>
          </div>

          <div>
            <h1 className="text-6xl font-bold text-white leading-tight max-w-xl">
              Authentic Algerian <br />
              <span className="text-[#22c55e]">Expeditions.</span>
            </h1>
            <p className="text-gray-300 mt-6 text-lg max-w-md border-l-2 border-[#22c55e] pl-6 italic">
              "Respect the wild, master the hunt."
            </p>
          </div>

          <div className="text-gray-500 text-sm tracking-widest uppercase">
            National Hunting Management System
          </div>
        </motion.div>
      </div>

      {/* ─── Login Form Section (Right 40%) ─── */}
      <div className="flex-1 flex items-center justify-center p-8 bg-[#050805]">
        <motion.div 
          className="w-full max-w-100"
          variants={containerVariants}
          initial="hidden"
          animate="show"
        >
          <motion.div variants={itemVariants} className="mb-10 text-center lg:text-left">
            <h2 className="text-3xl font-bold text-white mb-2">Member Portal</h2>
            <p className="text-gray-400">Enter your credentials to access your dashboard</p>
          </motion.div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email Field */}
            <motion.div variants={itemVariants}>
              <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-2 ml-1">
                Expedition Email
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                <input 
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@hunting.dz"
                  className="w-full bg-white/5 border border-white/10 rounded-xl py-4 pl-12 pr-4 text-white focus:outline-none focus:border-[#22c55e] focus:ring-1 focus:ring-[#22c55e] transition-all"
                  required
                />
              </div>
            </motion.div>

            {/* Password Field */}
            <motion.div variants={itemVariants}>
              <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-2 ml-1">
                Security Key
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                <input 
                  type={showPass ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-white/5 border border-white/10 rounded-xl py-4 pl-12 pr-12 text-white focus:outline-none focus:border-[#22c55e] focus:ring-1 focus:ring-[#22c55e] transition-all"
                  required
                />
                <button 
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white transition-colors"
                >
                  {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </motion.div>

            {/* Error Message */}
            <AnimatePresence>
              {error && (
                <motion.div 
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="bg-red-500/10 border border-red-500/20 text-red-400 p-3 rounded-lg flex items-center gap-3 text-sm"
                >
                  <AlertCircle size={16} />
                  {error}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Submit Button */}
            <motion.button
              variants={itemVariants}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              disabled={loading}
              className="w-full bg-[#22c55e] hover:bg-[#16a34a] text-black font-bold py-4 rounded-xl flex items-center justify-center gap-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed mt-4"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-black/30 border-t-black rounded-full animate-spin" />
              ) : (
                <>
                  SIGN IN TO DASHBOARD
                  <ArrowRight size={18} />
                </>
              )}
            </motion.button>
          </form>

          <motion.div variants={itemVariants} className="mt-8 text-center">
            <p className="text-sm text-gray-500">
              Not a registered hunter? 
              <Link 
                href="/apply-association" // 🚀 Updated path
                className="text-[#22c55e] font-bold cursor-pointer hover:underline"
              >
                Apply for access
              </Link>
            </p>
          </motion.div>
        </motion.div>
      </div>
    </div>
  )
}