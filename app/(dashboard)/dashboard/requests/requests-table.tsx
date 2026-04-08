'use client'

import { format } from "date-fns"
import { 
  Eye, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  MoreHorizontal,
  Phone,
  User
} from "lucide-react"
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { createAssociationFromRequest } from "@/lib/actions/associations"
import { toast } from "sonner"

export default function RequestsTable({ data }: { data: any[] }) {
  
  const handleApprove = async (id: string) => {
    const res = await createAssociationFromRequest(id)
    if ('success' in res && res.success) {
      toast.success("Association created successfully!")
    } else {
      toast.error("An error occurred while creating the association.")
    }
  }

  return (
    <div className="rounded-2xl border border-white/5 bg-white/[0.02] overflow-hidden">
      <Table>
        <TableHeader className="bg-white/[0.03]">
          <TableRow className="hover:bg-transparent border-white/5">
            <TableHead className="text-gray-400 font-bold uppercase text-[10px] tracking-widest">Association</TableHead>
            <TableHead className="text-gray-400 font-bold uppercase text-[10px] tracking-widest">President</TableHead>
            <TableHead className="text-gray-400 font-bold uppercase text-[10px] tracking-widest">Date Submitted</TableHead>
            <TableHead className="text-gray-400 font-bold uppercase text-[10px] tracking-widest">Status</TableHead>
            <TableHead className="text-right text-gray-400 font-bold uppercase text-[10px] tracking-widest">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.length === 0 ? (
            <TableRow>
              <TableCell colSpan={5} className="h-32 text-center text-gray-500 italic">
                No pending requests found for your district.
              </TableCell>
            </TableRow>
          ) : (
            data.map((req) => {
              const details = req.data as any
              return (
                <TableRow key={req.id} className="border-white/5 hover:bg-white/[0.02] transition-colors">
                  <TableCell className="py-4">
                    <div className="font-bold text-white">{details.name || details.associationName}</div>
                    <div className="text-xs text-gray-500">{details.address}</div>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center gap-2 text-sm text-gray-300">
                        <User size={12} className="text-[#22c55e]" />
                        {details.presidentName}
                      </div>
                      <div className="flex items-center gap-2 text-[11px] text-gray-500">
                        <Phone size={12} />
                        {details.presidentPhone}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="text-sm text-gray-400">
                    {format(new Date(req.createdAt), 'MMM dd, yyyy')}
                  </TableCell>
                  <TableCell>
                    <StatusBadge status={req.status} />
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0 hover:bg-white/10 text-gray-400">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="bg-[#0f110f] border-white/10 text-white">
                        <DropdownMenuLabel>Options</DropdownMenuLabel>
                        <DropdownMenuItem className="cursor-pointer gap-2 focus:bg-white/5">
                          <Eye size={14} /> View Details
                        </DropdownMenuItem>
                        {req.status === 'PENDING' && (
                          <>
                            <DropdownMenuItem 
                              onClick={() => handleApprove(req.id)}
                              className="cursor-pointer gap-2 text-[#22c55e] focus:bg-[#22c55e]/10 focus:text-[#22c55e]"
                            >
                              <CheckCircle2 size={14} /> Approve & Create
                            </DropdownMenuItem>
                            <DropdownMenuItem className="cursor-pointer gap-2 text-red-400 focus:bg-red-400/10 focus:text-red-400">
                              <XCircle size={14} /> Reject
                            </DropdownMenuItem>
                          </>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              )
            })
          )}
        </TableBody>
      </Table>
    </div>
  )
}

function StatusBadge({ status }: { status: string }) {
  switch (status) {
    case 'APPROVED':
      return (
        <Badge className="bg-[#22c55e]/10 text-[#22c55e] border-[#22c55e]/20 gap-1 hover:bg-[#22c55e]/10">
          <CheckCircle2 size={12} /> Approved
        </Badge>
      )
    case 'REJECTED':
      return (
        <Badge className="bg-red-500/10 text-red-400 border-red-500/20 gap-1 hover:bg-red-500/10">
          <XCircle size={12} /> Rejected
        </Badge>
      )
    default:
      return (
        <Badge className="bg-amber-500/10 text-amber-500 border-amber-500/20 gap-1 hover:bg-amber-500/10">
          <Clock size={12} /> Pending
        </Badge>
      )
  }
}