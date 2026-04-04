'use client'

import { useState, useTransition } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { UserPlus, X, Edit2, Loader2 } from 'lucide-react'
import { upsertUser } from '@/lib/actions/users'
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table"


export default function UserTableClient({ initialData ,currentUserRole }: { initialData: any[] , currentUserRole?: string}) {
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
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Account Management</h2>
          <p className="text-gray-500 text-sm">Control system access and permissions</p>
        </div>
        <button 
          onClick={() => handleOpen()}
          className="bg-[#22c55e] hover:bg-[#16a34a] cursor-pointer text-gray-950 font-bold px-5 py-2.5 rounded-xl flex items-center gap-2 transition-all text-sm active:scale-95"
        >
          <UserPlus size={18} />
          Create account
        </button>
      </div>

      <div className="rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-black/20 overflow-hidden shadow-sm transition-colors">
        {/* 🚀 Scrollable Container: Adjust max-h-[500px] to your liking */}
        <div className="max-h-150 overflow-auto custom-scrollbar">
          <Table>
            <TableHeader className="sticky top-0 bg-slate-50 dark:bg-[#0a0a0a] z-10 shadow-sm">
              <TableRow className="border-b border-slate-200 dark:border-white/10 hover:bg-transparent">
                <TableHead className="px-6 py-4 font-bold uppercase tracking-widest text-[10px] text-slate-500 dark:text-gray-400">
                  User Details
                </TableHead>
                <TableHead className="px-6 py-4 font-bold uppercase tracking-widest text-[10px] text-slate-500 dark:text-gray-400">
                  Role
                </TableHead>
                <TableHead className="px-6 py-4 font-bold uppercase tracking-widest text-[10px] text-slate-500 dark:text-gray-400 text-right">
                  Actions
                </TableHead>
              </TableRow>
            </TableHeader>

            <TableBody className="divide-y divide-slate-100 dark:divide-white/5">
              {initialData.map((user, idx) => (
                <TableRow 
                  key={user.id}
                  className="hover:bg-slate-50 dark:hover:bg-white/[0.03] transition-colors group border-none"
                >
                  <TableCell className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-emerald-100 dark:bg-emerald-900/50 flex items-center justify-center text-[#22c55e] border border-[#22c55e]/20 font-bold">
                        {user.name?.charAt(0) || 'U'}
                      </div>
                      <div>
                        <p className="font-medium text-sm text-slate-800 dark:text-gray-200">{user.name}</p>
                        <p className="text-xs text-slate-500 dark:text-gray-500">{user.email}</p>
                      </div>
                    </div>
                  </TableCell>

                  <TableCell className="px-6 py-4">
                    <span className="text-[10px] px-2 py-1 rounded bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 font-bold uppercase text-[#22c55e] tracking-tighter">
                      {user.role}
                    </span>
                  </TableCell>

                  <TableCell className="px-6 py-4 text-right">
                    <button 
                      onClick={() => handleOpen(user)} 
                      className="p-2 hover:bg-slate-200 dark:hover:bg-white/10 rounded-lg text-slate-400 hover:text-slate-900 dark:text-gray-500 dark:hover:text-white transition-colors cursor-pointer"
                    >
                      <Edit2 size={16} />
                    </button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
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
                    <select name="role" defaultValue={selectedUser?.role || 'user'} >
                      {/* Only show Super Admin option if Mohamed is actually the one looking */}
                      {currentUserRole === 'super_admin' && (
                        <option value="super_admin">Super Admin</option>
                      )}
                      
                      <option value="wilaya_admin">Wilaya Admin (Directorate)</option>
                      <option value="staff">Staff Member</option>
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