'use client'

import { format } from "date-fns"
import { 
  ExternalLink, 
  UserCircle2, 
  Phone, 
  Mail, 
  MoreVertical,
  ShieldCheck
} from "lucide-react"
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { connectToAssociationAdmin } from "@/lib/actions/impersonation"
import { toast } from "sonner"

export default function AssociationsTable({ data }: { data: any[] }) {
  
  const handleImpersonate = async (assocId: string, name: string) => {
    toast.loading(`Connecting to ${name}...`)
    try {
      const res = await connectToAssociationAdmin(assocId)
      if (res.success) {
        toast.success(`Now managing ${name}`)
        window.location.href = "/dashboard" // Refresh to enter association context
      }
    } catch (err: any) {
      toast.error(err.message)
    }
  }

  return (
    <div className="rounded-2xl border border-white/5 bg-white/[0.02] overflow-hidden">
      <Table>
        <TableHeader className="bg-white/[0.03]">
          <TableRow className="hover:bg-transparent border-white/5">
            <TableHead className="text-gray-400 font-bold uppercase text-[10px] tracking-widest px-6">Association Name</TableHead>
            <TableHead className="text-gray-400 font-bold uppercase text-[10px] tracking-widest">Leadership</TableHead>
            <TableHead className="text-gray-400 font-bold uppercase text-[10px] tracking-widest">Contact Details</TableHead>
            <TableHead className="text-gray-400 font-bold uppercase text-[10px] tracking-widest">Joined</TableHead>
            <TableHead className="text-right text-gray-400 font-bold uppercase text-[10px] tracking-widest px-6">Access</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.length === 0 ? (
            <TableRow>
              <TableCell colSpan={5} className="h-40 text-center text-gray-500 italic">
                No associations registered yet.
              </TableCell>
            </TableRow>
          ) : (
            data.map((assoc) => (
              <TableRow key={assoc.id} className="border-white/5 hover:bg-white/[0.01] transition-colors">
                <TableCell className="py-5 px-6">
                  <div className="font-bold text-white text-lg tracking-tight">{assoc.name}</div>
                  <div className="text-xs text-[#22c55e] font-medium uppercase tracking-tighter">Official License Active</div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2 text-gray-200 font-medium">
                    <UserCircle2 size={16} className="text-gray-500" />
                    {assoc.presidentName}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-xs text-gray-400">
                      <Mail size={12} /> {assoc.email}
                    </div>
                    <div className="flex items-center gap-2 text-xs text-gray-400">
                      <Phone size={12} /> {assoc.phone}
                    </div>
                  </div>
                </TableCell>
                <TableCell className="text-sm text-gray-500">
                  {format(new Date(assoc.createdAt), 'MMM 2026')}
                </TableCell>
                <TableCell className="text-right px-6">
                  <div className="flex justify-end gap-2">
                    <Button 
                      onClick={() => handleImpersonate(assoc.id, assoc.name)}
                      variant="outline" 
                      className="bg-[#22c55e]/5 border-[#22c55e]/20 text-[#22c55e] hover:bg-[#22c55e] hover:text-black font-bold h-9 rounded-lg gap-2 transition-all"
                    >
                      <ShieldCheck size={16} />
                      Connect As Admin
                    </Button>
                    
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-9 w-9 p-0 text-gray-500 hover:bg-white/5">
                          <MoreVertical size={18} />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="bg-[#0f110f] border-white/10 text-white w-48">
                        <DropdownMenuItem className="gap-2 cursor-pointer">
                          <ExternalLink size={14} /> View Club Profile
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  )
}