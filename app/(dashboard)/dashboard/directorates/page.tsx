// src/app/(dashboard)/dashboard/directorates/page.tsx
import { db } from "@/db";
import { stateDirectorates } from "@/db/schema/stateDirectorate";
// import { users } from "@/db/schema/auth"; // Uncomment later for stats join
import { Button } from "@/components/ui/button"; // Or your customized button component
import { MapPin, Users, Building, ShieldCheck, Search, Filter } from "lucide-react";
import { ImpersonateButton } from "@/components/dashboard/ImpersonateButton";

// Assuming you have shadcn table components, if not, replace with standard styled div structure
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default async function DirectoratesPage() {
  // Fetch all 58 Directorates
  const directorates = await db.select().from(stateDirectorates).orderBy(stateDirectorates.wilaya_code);

  return (
    <div className="space-y-10">
      {/* ─── 1. Modern Page Header ─── */}
      <div className="flex justify-between items-start gap-6">
        <div>
          {/* Changed: text-slate-900 (light) / text-white (dark) */}
          <h1 className="text-4xl font-bold tracking-tighter text-slate-900 dark:text-white">State Directorates</h1>
          <p className="text-slate-500 dark:text-gray-400 mt-2 max-w-2xl text-lg">
            National HQ Command Center. Overlook, manage, and audit the 58 official administrative centers.
          </p>
        </div>
        
        {/* "Create New" or "Audit Logs" button would go here */}
        <Button className="bg-[#22c55e] cursor-pointer text-black hover:bg-[#1fae53] gap-2 rounded-xl h-12 px-6 font-semibold shadow-lg shadow-[#22c55e]/20">
          <Building size={20} />
          View Global Audit
        </Button>
      </div>

      {/* ─── 2. Key Stats Cards (Modern SaaS style) ─── */}
      {/* <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard 
          icon={<Building size={26} className="text-[#22c55e]" />} 
          label="Total Directorates" 
          value="58 / 58" 
          change="+0 this month"
        />
        <StatCard 
          icon={<ShieldCheck size={26} className="text-emerald-400" />} 
          label="Active Admins" 
          value="58" // Placeholder for real user count join
          change="97% Online"
        />
        <StatCard 
          icon={<Users size={26} className="text-emerald-500" />} 
          label="Local Departments Controlled" 
          value="452" // Placeholder for departments count join
          change="+8 New Dairas"
        />
      </div> */}

      {/* ─── 3. Modern Table Container ─── */}
      <div className="border border-slate-200 dark:border-white/5 rounded-2xl bg-white dark:bg-black/20 backdrop-blur-xl shadow-sm dark:shadow-[0_0_60px_-15px_rgba(34,197,94,0.08)] overflow-hidden transition-colors">
        
        {/* Table Controls (Search/Filter inner table) */}
        <div className="p-6 border-b border-slate-100 dark:border-white/5 flex items-center justify-between gap-6 bg-slate-50/50 dark:bg-black/10">
          <div className="relative w-96">
             <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
             <input 
               type="text" 
               placeholder="Filter directorates by name or code..." 
               className="w-full bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-full py-3 pl-12 pr-4 text-sm focus:outline-none focus:border-[#22c55e] transition-all text-slate-900 dark:text-white"
             />
          </div>
          <Button variant="outline" className="border-slate-200 dark:border-white/10 text-slate-500 dark:text-gray-400 gap-2 hover:bg-slate-50 dark:hover:bg-white/5 rounded-full">
            <Filter size={16} />
            Filter Status
          </Button>
        </div>

        {/* ─── The Modern Table ─── */}
        <Table>
          <TableHeader className="bg-slate-50/50 dark:bg-black/30">
            <TableRow className="border-b border-slate-200 dark:border-white/10 hover:bg-transparent">
              <TableHead className="w-25 text-slate-400 dark:text-gray-400 font-bold uppercase tracking-widest text-xs py-5 pl-8">Wilaya Code</TableHead>
              <TableHead className="text-slate-400 dark:text-gray-400 font-bold uppercase tracking-widest text-xs py-5">Directorate Center</TableHead>
              <TableHead className="text-slate-400 dark:text-gray-400 font-bold uppercase tracking-widest text-xs py-5">Departments</TableHead>
              <TableHead className="text-slate-400 dark:text-gray-400 font-bold uppercase tracking-widest text-xs py-5">Account Status</TableHead>
              <TableHead className="text-right text-slate-400 dark:text-gray-400 font-bold uppercase tracking-widest text-xs py-5 pr-8">Control Panel</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {directorates.map((dir) => (
              <TableRow key={dir.id} className="border-b border-slate-100 dark:border-white/5 last:border-0 group hover:bg-slate-50 dark:hover:bg-white/[0.02] transition-colors">
                
                <TableCell className="py-6 pl-8 font-mono text-3xl font-bold text-[#22c55e]">
                  {String(dir.wilaya_code).padStart(2, '0')}
                </TableCell>
                
                <TableCell className="py-6">
                  <div className="flex flex-col gap-0.5">
                    <span className="text-xl font-medium text-slate-900 dark:text-white group-hover:text-[#22c55e] transition">{dir.name}</span>
                    <div className="flex items-center gap-1.5 text-slate-500">
                        <MapPin size={14} className="text-[#22c55e]/60" />
                        <span className="text-sm">Official Hunting Affairs Authority</span>
                    </div>
                  </div>
                </TableCell>

                <TableCell className="py-6">
                  <span className="text-slate-600 dark:text-gray-300 font-medium">8 Departments</span>
                </TableCell>

                <TableCell className="py-6">
                  {dir.is_active ? (
                    <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#22c55e]/10 text-[#22c55e] text-sm font-semibold border border-[#22c55e]/20">
                      <div className="w-1.5 h-1.5 rounded-full bg-[#22c55e]" />
                      Active
                    </div>
                  ) : (
                    <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-red-100 dark:bg-red-950/50 text-red-600 dark:text-red-400 text-sm font-semibold border border-red-200 dark:border-red-800">
                      <div className="w-1.5 h-1.5 rounded-full bg-red-500 dark:bg-red-400" />
                      Suspended
                    </div>
                  )}
                </TableCell>

                <TableCell className="py-6 pr-8 text-right">
                  <ImpersonateButton directorateId={dir.id} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

// ─── Helper StatCard Component ───
function StatCard({ icon, label, value, change }: { icon: any, label: string, value: string, change: string }) {
    return (
        <div className="border border-white/5 rounded-2xl p-6 bg-black/20 backdrop-blur-xl flex flex-col gap-1 transition hover:border-[#22c55e]/20 hover:bg-black/30 group">
            <div className="flex items-center justify-between mb-4">
               <div className="p-3 bg-black/30 rounded-xl border border-white/5 group-hover:border-[#22c55e]/20 transition">
                  {icon}
               </div>
               <p className="text-xs text-emerald-400 font-bold uppercase tracking-widest">{change}</p>
            </div>
            <p className="text-sm text-gray-500 font-medium">{label}</p>
            <p className="text-3xl font-extrabold text-white tracking-tighter">{value}</p>
        </div>
    )
}