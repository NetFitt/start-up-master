'use client'

import React, { useState, useTransition } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Button } from "@/components/ui/button"
import { Check, ChevronsUpDown, User, Mail, Building, Loader2, Plus } from "lucide-react"
import { cn } from "@/lib/utils"
import { createDistrictAdmin } from "@/lib/actions/districts"
import { toast } from "sonner"

export default function CreateDistrictModal({ availableCities, directorateId }: { availableCities: any[], directorateId: string }) {
  const [open, setOpen] = useState(false)
  const [comboOpen, setComboOpen] = useState(false)
  const [isPending, startTransition] = useTransition()
  
  const [selectedCityId, setSelectedCityId] = useState<number | null>(null)
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")

  const handleCreate = () => {
    if (!selectedCityId || !name || !email) return toast.error("Please fill all fields")

    startTransition(async () => {
      const res = await createDistrictAdmin({
        name,
        email,
        location_id: selectedCityId,
        directorate_id: directorateId
      })

      if (res?.error) {
        toast.error(res.error)
      } else {
        toast.success("District Office deployed successfully!")
        setOpen(false)
        setSelectedCityId(null); setName(""); setEmail("");
      }
    })
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-[#22c55e] text-black hover:bg-[#1fae53] gap-2 rounded-xl h-12 px-6 font-bold">
          <Plus size={20} /> Add District Office
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[450px] bg-white dark:bg-[#0a0a0a] border-slate-200 dark:border-white/10 rounded-2xl">
        <DialogHeader><DialogTitle className="text-2xl font-bold">Deploy New Office</DialogTitle></DialogHeader>

        <div className="space-y-6 pt-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-500">Select Baladia</label>
            <Popover open={comboOpen} onOpenChange={setComboOpen}>
              <PopoverTrigger asChild>
                <Button variant="outline" className="w-full justify-between h-12 rounded-xl bg-slate-100 dark:bg-white/5">
                  {selectedCityId ? availableCities.find(c => c.id === selectedCityId)?.commune_name_ascii : "Search Baladia..."}
                  <ChevronsUpDown className="ml-2 h-4 w-4 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-[400px] p-0 rounded-xl overflow-hidden border-slate-200 dark:border-white/10 shadow-2xl">
                <Command>
                  <CommandInput placeholder="Type commune name..." />
                  <CommandList className="max-h-[300px] overflow-y-auto custom-scrollbar">
        <CommandEmpty className="py-6 text-center text-sm text-slate-500">
            No Baladia found.
        </CommandEmpty>
        
        <CommandGroup>
            {availableCities.map((city) => (
            <CommandItem
                key={city.id}
                value={city.commune_name_ascii.toLowerCase()}
                onSelect={() => {
                setSelectedCityId(city.id)
                setComboOpen(false)
                }}
                className="py-3 px-4 cursor-pointer hover:bg-[#22c55e]/10 transition-colors"
            >
                <div className="flex items-center w-full">
                <Check 
                    className={cn(
                    "mr-2 h-4 w-4 text-[#22c55e]", 
                    selectedCityId === city.id ? "opacity-100" : "opacity-0"
                    )} 
                />
                <div className="flex flex-col">
                    <span className="font-medium text-slate-900 dark:text-white">
                    {city.commune_name_ascii}
                    </span>
                    <span className="text-xs text-slate-500">
                    {city.daira_name_ascii}
                    </span>
                </div>
                </div>
            </CommandItem>
            ))}
        </CommandGroup>
        </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-500">First Admin Name</label>
            <div className="relative">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input value={name} onChange={(e) => setName(e.target.value)} className="w-full bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl py-3 pl-12 pr-4 focus:border-[#22c55e] outline-none transition-all" placeholder="Full Name" />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-500">Admin Email</label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl py-3 pl-12 pr-4 focus:border-[#22c55e] outline-none transition-all" placeholder="admin@youhunt.dz" />
            </div>
          </div>

          <Button onClick={handleCreate} disabled={isPending} className="w-full bg-[#22c55e] text-black hover:bg-[#1fae53] font-bold h-14 rounded-xl">
            {isPending ? <Loader2 className="animate-spin" /> : "Confirm Office Deployment"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}