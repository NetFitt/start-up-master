'use client'

import { format } from "date-fns"
import Link from "next/link" // 🚀 Essential for navigation
import { 
  MapPin, 
  Eye, 
  Edit3, 
  MoreHorizontal, 
  ImageIcon, 
  Archive, 
  Zap, 
  ZapOff 
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
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import Image from "next/image"
import { toast } from "sonner"
import { toggleOfferStatus } from "@/lib/actions/offers"

interface OffersTableProps {
  data: any[]
}

export default function OffersTable({ data }: OffersTableProps) {
  
  const handleToggle = async (id: string, currentStatus: string) => {
    const actionLabel = currentStatus === 'ACTIVE' ? "Stopping" : "Activating"
    toast.loading(`${actionLabel} offer...`)
    
    try {
      const res = await toggleOfferStatus(id, currentStatus)
      if (res.success) {
        toast.success(`Offer is now ${currentStatus === 'ACTIVE' ? 'Disabled' : 'Live'}`)
      } else {
        toast.error("Failed to update status")
      }
    } catch (err) {
      toast.error("An unexpected error occurred")
    }
  }

  return (
    <div className="rounded-[2rem] border border-white/5 bg-white/[0.02] overflow-hidden shadow-2xl backdrop-blur-sm">
      <Table>
        <TableHeader className="bg-white/[0.03]">
          <TableRow className="hover:bg-transparent border-white/5">
            <TableHead className="text-gray-400 font-bold uppercase text-[10px] tracking-widest px-8 py-5">Package Details</TableHead>
            <TableHead className="text-gray-400 font-bold uppercase text-[10px] tracking-widest">Territory (Daira)</TableHead>
            <TableHead className="text-gray-400 font-bold uppercase text-[10px] tracking-widest">Pricing</TableHead>
            <TableHead className="text-gray-400 font-bold uppercase text-[10px] tracking-widest">Status</TableHead>
            <TableHead className="text-right text-gray-400 font-bold uppercase text-[10px] tracking-widest px-8">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.length === 0 ? (
            <TableRow>
              <TableCell colSpan={5} className="h-64 text-center text-gray-600 italic bg-white/[0.01]">
                No active hunting offers found for your Wilaya.
              </TableCell>
            </TableRow>
          ) : (
            data.map((offer) => (
              <TableRow key={offer.id} className="border-white/5 hover:bg-white/[0.01] transition-colors group">
                <TableCell className="py-6 px-8">
                  <div className="flex items-center gap-5">
                    {/* Thumbnail Preview */}
                    <div className="relative w-16 h-16 rounded-2xl overflow-hidden border border-white/10 bg-white/5 flex items-center justify-center shrink-0 shadow-lg">
                      {offer.mainImage || offer.images?.[0]?.url ? (
                        <Image 
                          src={offer.mainImage || offer.images[0].url} 
                          alt={offer.title} 
                          fill 
                          className="object-cover group-hover:scale-110 transition-transform duration-700"
                        />
                      ) : (
                        <ImageIcon size={24} className="text-gray-800" />
                      )}
                    </div>
                    <div className="space-y-1">
                      <div className="font-black text-white text-base tracking-tight leading-none uppercase italic">{offer.title}</div>
                      <div className="text-[11px] text-gray-500 line-clamp-1 max-w-[250px] font-medium">
                        {offer.description}
                      </div>
                      <div className="text-[9px] text-[#22c55e] font-black uppercase tracking-widest flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#22c55e] animate-pulse" />
                        Updated {format(new Date(offer.updatedAt), 'MMM dd')}
                      </div>
                    </div>
                  </div>
                </TableCell>
                
                <TableCell>
                  <div className="flex items-center gap-2 text-white font-bold text-sm">
                    <MapPin size={14} className="text-[#22c55e]" />
                    {offer.daira?.name || "Global Wilaya"}
                  </div>
                </TableCell>

                <TableCell>
                  <div className="flex flex-col">
                    <span className="text-white font-black text-xl leading-none">
                      {Number(offer.price).toLocaleString()} 
                      <span className="ml-1.5 text-[10px] text-gray-500 font-bold uppercase tracking-tighter">DZD</span>
                    </span>
                    <span className="text-[9px] text-gray-600 uppercase font-black mt-1 tracking-widest">Seasonal Fee</span>
                  </div>
                </TableCell>

                <TableCell>
                  <Badge 
                    variant="outline"
                    className={`
                      px-4 py-1.5 rounded-full text-[9px] font-black tracking-[0.15em] uppercase border-2
                      ${offer.status === 'ACTIVE' 
                        ? 'bg-[#22c55e]/10 text-[#22c55e] border-[#22c55e]/20' 
                        : 'bg-amber-500/10 text-amber-500 border-amber-500/20'}
                    `}
                  >
                    {offer.status}
                  </Badge>
                </TableCell>

                <TableCell className="text-right px-8">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-12 w-12 p-0 text-gray-500 hover:bg-white/10 hover:text-white rounded-2xl transition-all">
                        <MoreHorizontal size={24} />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="bg-[#0c0e0c] border-white/10 text-white w-64 p-3 rounded-[1.5rem] shadow-2xl backdrop-blur-xl">
                      <div className="px-3 py-2 text-[9px] font-black text-gray-600 uppercase tracking-[0.25em] mb-1">Command Menu</div>
                      
                      <DropdownMenuItem className="gap-3 cursor-pointer py-4 px-4 rounded-xl focus:bg-white/5 font-bold text-sm">
                        <Eye size={18} className="text-gray-500" /> View Live Preview
                      </DropdownMenuItem>

                      <DropdownMenuItem 
                        onClick={() => handleToggle(offer.id, offer.status)}
                        className={`gap-3 cursor-pointer py-4 px-4 rounded-xl font-black text-sm focus:bg-white/5 ${
                          offer.status === 'ACTIVE' ? 'text-amber-500' : 'text-[#22c55e]'
                        }`}
                      >
                        {offer.status === 'ACTIVE' ? <ZapOff size={18} /> : <Zap size={18} />}
                        {offer.status === 'ACTIVE' ? 'Suspend Package' : 'Authorize & Go Live'}
                      </DropdownMenuItem>

                      <div className="h-px bg-white/5 my-2 mx-2" />

                      {/* 🚀 THE EDIT LINK FIX */}
                      <DropdownMenuItem asChild className="gap-3 cursor-pointer py-4 px-4 rounded-xl focus:bg-white/5 font-bold text-sm">
                        <Link href={`/dashboard/offers/${offer.id}/edit`}>
                          <Edit3 size={18} className="text-gray-500" /> Edit Specifications
                        </Link>
                      </DropdownMenuItem>
                      
                      <DropdownMenuItem className="gap-3 cursor-pointer py-4 px-4 rounded-xl text-red-500 focus:bg-red-500/10 focus:text-red-500 font-bold text-sm">
                        <Archive size={18} /> Archive Package
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  )
}