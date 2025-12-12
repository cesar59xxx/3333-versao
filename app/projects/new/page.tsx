"use client"

import { useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useRouter } from "next/navigation"

export default function NewProjectPage() {
  const [name, setName] = useState("")
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  async function handleCreate() {
    if (!name.trim()) return

    setLoading(true)
    try {
      const supabase = createClient()
      const { data } = await supabase
        .from("projects")
        .insert([{ name, api_key: Math.random().toString(36).substring(7) }])
        .select()
        .single()
      if (data) {
        router.push(`/projects/${data.id}`)
      }
    } catch (error) {
      console.error("[v0] Error creating project:", error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-white p-8">
      <div className="max-w-md mx-auto">
        <h1 className="text-3xl font-bold mb-6">Novo Projeto</h1>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Nome do Projeto</label>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Meu Projeto"
              className="border-gray-300"
            />
          </div>
          <Button
            onClick={handleCreate}
            disabled={loading || !name.trim()}
            className="w-full bg-green-600 hover:bg-green-700 text-white"
          >
            {loading ? "Criando..." : "Criar Projeto"}
          </Button>
        </div>
      </div>
    </div>
  )
}
