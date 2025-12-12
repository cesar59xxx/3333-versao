"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import { Card } from "@/components/ui/card"
import { useParams, useRouter } from "next/navigation"
import { Loader2 } from "lucide-react"

export default function QRCodePage() {
  const params = useParams()
  const router = useRouter()
  const projectId = params.id as string
  const instanceId = params.instanceId as string
  const [qrCode, setQrCode] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [instanceStatus, setInstanceStatus] = useState("disconnected")

  useEffect(() => {
    async function loadQRCode() {
      try {
        const supabase = createClient()

        // Load QR code
        const { data } = await supabase.from("instances").select("last_qr, status").eq("id", instanceId).single()

        if (data) {
          setQrCode(data.last_qr)
          setInstanceStatus(data.status)
        }
      } catch (error) {
        console.error("[v0] Error loading QR code:", error)
      } finally {
        setLoading(false)
      }
    }

    loadQRCode()

    // Poll for QR code updates and status changes
    const interval = setInterval(loadQRCode, 2000)
    return () => clearInterval(interval)
  }, [instanceId])

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <p>Carregando...</p>
      </div>
    )
  }

  if (instanceStatus === "connected") {
    return (
      <div className="flex h-screen items-center justify-center bg-green-50">
        <Card className="p-8 text-center max-w-md">
          <div className="text-5xl mb-4">✅</div>
          <h1 className="text-2xl font-bold text-green-700 mb-4">Instância Conectada!</h1>
          <p className="text-gray-600 mb-6">Sua instância WhatsApp está pronta para usar.</p>
          <button
            onClick={() => router.push(`/projects/${projectId}/instances/${instanceId}/chat`)}
            className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded"
          >
            Ir para Chat
          </button>
        </Card>
      </div>
    )
  }

  return (
    <div className="flex h-screen items-center justify-center bg-gray-50">
      <Card className="p-8 max-w-md w-full mx-4">
        <h1 className="text-2xl font-bold mb-6 text-center">Conectar Instância</h1>
        <div className="bg-gray-100 p-4 rounded flex items-center justify-center min-h-96">
          {qrCode ? (
            <img src={qrCode || "/placeholder.svg"} alt="QR Code" className="max-w-full h-auto" />
          ) : (
            <div className="text-center text-gray-500">
              <Loader2 className="w-8 h-8 animate-spin mx-auto mb-2" />
              <p>Gerando QR Code...</p>
            </div>
          )}
        </div>
        <div className="mt-6 text-center text-sm text-gray-600">
          <p className="font-medium mb-2">Escaneie com seu WhatsApp:</p>
          <ol className="text-left space-y-1">
            <li>1. Abra WhatsApp no seu celular</li>
            <li>2. Toque em Mais opções → Aparelhos conectados</li>
            <li>3. Toque em Conectar um aparelho</li>
            <li>4. Escaneie este código QR</li>
          </ol>
        </div>
      </Card>
    </div>
  )
}
