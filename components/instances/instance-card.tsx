"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import type { Instance } from "@/lib/types"
import { QrCode, MessageSquare, Trash2 } from "lucide-react"
import Link from "next/link"

interface InstanceCardProps {
  instance: Instance
  onShowQR: () => void
  onDelete: () => void
}

const statusConfig = {
  connected: { label: "Conectado", variant: "default" as const, color: "bg-green-500" },
  connecting: { label: "Conectando...", variant: "secondary" as const, color: "bg-yellow-500" },
  disconnected: { label: "Desconectado", variant: "outline" as const, color: "bg-red-500" },
}

export function InstanceCard({ instance, onShowQR, onDelete }: InstanceCardProps) {
  const status = statusConfig[instance.status] || statusConfig.disconnected

  return (
    <Card>
      <CardHeader className="flex flex-row items-start justify-between space-y-0">
        <div className="space-y-1">
          <CardTitle>{instance.name}</CardTitle>
          <p className="text-sm text-muted-foreground">{instance.phone_number || "Sem número"}</p>
        </div>
        <Badge variant={status.variant}>{status.label}</Badge>
      </CardHeader>
      <CardContent>
        <div className="flex gap-2">
          <Button size="sm" variant="outline" onClick={onShowQR} disabled={instance.status === "connected"}>
            <QrCode className="w-4 h-4 mr-1" />
            QR Code
          </Button>
          <Link href={`/instances/${instance.id}/chat`}>
            <Button size="sm" disabled={instance.status !== "connected"}>
              <MessageSquare className="w-4 h-4 mr-1" />
              Chat
            </Button>
          </Link>
          <Button size="sm" variant="destructive" onClick={onDelete}>
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
