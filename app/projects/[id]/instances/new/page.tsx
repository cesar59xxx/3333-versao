"use client"

import { useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useRouter, useParams } from "next/navigation"

export default function NewInstancePage() {
  const router = useRouter()
  const params = useParams()
  const projectId = params.id as string
  const [name, setName] = useState("")
  const [loading, setLoading] = useState(false)

  async function handleCreate() {
    if (!name.trim()) return

    setLoading(true)
    try {
      const supabase = createClient()
      const { data } = await supabase
        .from("instances")
        .insert([
          {
            project_id: projectId,
            name,
            status: "disconnected",
          },
        ])
        .select()
        .single()

      if (data) {
        router.push(`/projects/${projectId}/instances/${data.id}/qrcode`)
      }
    } catch (error) {
      console.error("[v0] Error creating instance:", error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-white p-8">
      <div className="max-w-md mx-auto">
        <h1 className="text-3xl font-bold mb-6">Nova Instância</h1>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Nome da Instância</label>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ex: WhatsApp Principal"
              className="border-gray-300"
            />
          </div>
          <Button
            onClick={handleCreate}
            disabled={loading || !name.trim()}
            className="w-full bg-green-600 hover:bg-green-700 text-white"
          >
            {loading ? "Criando..." : "Criar Instância"}
          </Button>
        </div>
      </div>
    </div>
  )
}
