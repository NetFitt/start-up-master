'use client'

import { useState, useTransition } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { MoreVertical, UserPlus, X, Edit2, Mail, Shield, Lock, Loader2 } from 'lucide-react'
import { upsertUser } from '@/lib/actions/users'

export default function UserTableClient({ initialData }: { initialData: any[] }) {
  const [isOpen, setIsOpen] = useState(false)
  const [selectedUser, setSelectedUser] = useState<any>(null)
  const [isPending, startTransition] = useTransition()

  const handleOpen = (user = null) => {
    setSelectedUser(user)
    setIsOpen(true)
  }

  return (
    <>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-white">Account Management</h2>
          <p className="text-gray-500 text-sm">Control system access and permissions</p>
        </div>
        <button 
          onClick={() => handleOpen()}
          className="bg-[#22c55e] hover:bg-[#16a34a] text-black font-bold px-5 py-2.5 rounded-xl flex items-center gap-2 transition-all text-sm active:scale-95"
        >
          <UserPlus size={18} />
          CREATE ACCOUNT
        </button>
      </div>

      <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden backdrop-blur-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-white/5 text-gray-400 text-xs uppercase tracking-widest">
                <th className="px-6 py-4 font-semibold">User Details</th>
                <th className="px-6 py-4 font-semibold">Role</th>
                <th className="px-6 py-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {initialData.map((user, idx) => (
                <motion.tr 
                  key={user.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  className="hover:bg-white/[0.03] transition-colors group"
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-emerald-900/50 flex items-center justify-center text-[#22c55e] border border-[#22c55e]/20 font-bold">
                        {user.name?.charAt(0) || 'U'}
                      </div>
                      <div>
                        <p className="font-medium text-sm text-gray-200">{user.name}</p>
                        <p className="text-xs text-gray-500">{user.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-[10px] px-2 py-1 rounded bg-white/5 border border-white/10 font-bold uppercase text-emerald-400 tracking-tighter">
                      {user.role}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button onClick={() => handleOpen(user)} className="p-2 hover:bg-white/10 rounded-lg text-gray-500 hover:text-white transition-colors">
                      <Edit2 size={16} />
                    </button>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ─── SLIDE-OVER FORM ─── */}
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
            />
            <motion.div 
              initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 30, stiffness: 300 }}
              className="fixed right-0 top-0 h-full w-full max-w-md bg-[#080c08] border-l border-white/10 z-[60] p-10 shadow-2xl"
            >
              <div className="flex justify-between items-center mb-10">
                <h2 className="text-2xl font-bold text-white tracking-tighter">
                  {selectedUser ? 'Modify Member' : 'New Expedition Member'}
                </h2>
                <button onClick={() => setIsOpen(false)} className="text-gray-500 hover:text-white"><X /></button>
              </div>

              <form action={(fd) => {
                startTransition(async () => {
                  const data = Object.fromEntries(fd);
                  await upsertUser({ ...data, id: selectedUser?.id });
                  setIsOpen(false);
                });
              }} className="space-y-6">
                
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Full Name</label>
                  <input name="name" defaultValue={selectedUser?.name} className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-white focus:border-[#22c55e] transition-all outline-none" required />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Email Address</label>
                  <input name="email" type="email" defaultValue={selectedUser?.email} className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-white focus:border-[#22c55e] transition-all outline-none" required />
                </div>

                {!selectedUser && (
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Temporary Password</label>
                    <input name="password" type="password" className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-white focus:border-[#22c55e] transition-all outline-none" required />
                  </div>
                )}

                <div className="space-y-2">
                    <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Assigned Role</label>
                    <select name="role" defaultValue={selectedUser?.role || 'user'} className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-white focus:border-[#22c55e] outline-none appearance-none">
                        <option value="admin">Super Admin</option> {/* Match 'admin' from your error params */}
                        <option value="staff">Staff</option>
                        <option value="user">Hunter</option>
                    </select>
                </div>

                <button 
                  disabled={isPending}
                  type="submit" 
                  className="w-full bg-[#22c55e] hover:bg-[#16a34a] text-black font-extrabold py-4 rounded-xl transition-all mt-10 flex items-center justify-center gap-2"
                >
                  {isPending ? <Loader2 className="animate-spin" /> : selectedUser ? 'SAVE CHANGES' : 'CREATE ACCOUNT'}
                </button>
              </form>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}