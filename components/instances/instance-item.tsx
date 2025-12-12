"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import type { Instance } from "@/lib/types"
import { QrCode, MessageCircle } from "lucide-react"
import Link from "next/link"

interface InstanceItemProps {
  instance: Instance
}

const STATUS_CONFIG = {
  connected: { label: "Conectado", color: "bg-green-500" },
  connecting: { label: "Conectando", color: "bg-yellow-500" },
  disconnected: { label: "Desconectado", color: "bg-red-500" },
}

export function InstanceItem({ instance }: InstanceItemProps) {
  const [showQR, setShowQR] = useState(false)
  const router = useRouter()
  const config = STATUS_CONFIG[instance.status] || STATUS_CONFIG.disconnected

  const handleGenerateQR = async () => {
    const supabase = createClient()
    const { error } = await supabase.from("instances").update({ status: "connecting" }).eq("id", instance.id)

    if (!error) {
      router.refresh()
    }
  }

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="text-lg">{instance.name}</CardTitle>
            <Badge className={config.color} variant="secondary">
              {config.label}
            </Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="text-sm text-muted-foreground">
          {instance.phone_number ? `📱 ${instance.phone_number}` : "Sem número conectado"}
        </div>

        <div className="flex gap-2">
          <Dialog open={showQR} onOpenChange={setShowQR}>
            <DialogTrigger asChild>
              <Button size="sm" variant="outline" onClick={handleGenerateQR}>
                <QrCode className="mr-2 h-4 w-4" />
                QR Code
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-sm">
              <DialogHeader>
                <DialogTitle>Conectar com QR Code</DialogTitle>
              </DialogHeader>
              <div className="flex items-center justify-center py-8">
                {instance.last_qr ? (
                  <img src={instance.last_qr || "/placeholder.svg"} alt="QR Code" className="h-64 w-64" />
                ) : (
                  <p className="text-sm text-muted-foreground">QR Code será gerado em breve...</p>
                )}
              </div>
            </DialogContent>
          </Dialog>

          <Link href={`/instances/${instance.id}/chat`}>
            <Button size="sm" variant="outline">
              <MessageCircle className="mr-2 h-4 w-4" />
              Chat
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  )
}
