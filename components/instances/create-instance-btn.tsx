"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Plus } from "lucide-react"

interface CreateInstanceBtnProps {
  projectId: string
}

export function CreateInstanceBtn({ projectId }: CreateInstanceBtnProps) {
  const [open, setOpen] = useState(false)
  const [name, setName] = useState("")
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleCreate = async () => {
    if (!name.trim()) return

    setLoading(true)
    try {
      const supabase = createClient()
      const { error } = await supabase.from("instances").insert({
        project_id: projectId,
        name,
        status: "disconnected",
      })

      if (error) throw error
      setName("")
      setOpen(false)
      router.refresh()
    } catch (err) {
      console.error("Erro ao criar instância:", err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="default" size="sm">
          <Plus className="mr-2 h-4 w-4" />
          Nova Instância
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Criar Nova Instância</DialogTitle>
          <DialogDescription>Digite um nome para a nova instância WhatsApp</DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label htmlFor="name">Nome da Instância</Label>
            <Input id="name" placeholder="Ex: Suporte 01" value={name} onChange={(e) => setName(e.target.value)} />
          </div>
          <Button onClick={handleCreate} disabled={loading} className="w-full">
            {loading ? "Criando..." : "Criar Instância"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
