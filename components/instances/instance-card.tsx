"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Phone, QrCode, AlertCircle, CheckCircle, Clock, LogOut } from "lucide-react"
import type { WhatsAppInstance } from "@/lib/types/database"
import { apiRequest } from "@/lib/api/client"
import Link from "next/link"

interface InstanceCardProps {
  instance: WhatsAppInstance
  onRefresh: () => void
  onQrCodeClick: (instance: WhatsAppInstance) => void
}

export function InstanceCard({ instance, onRefresh, onQrCodeClick }: InstanceCardProps) {
  const [isStarting, setIsStarting] = useState(false)
  const [isLoggingOut, setIsLoggingOut] = useState(false)

  const rawStatus = instance?.status ?? "disconnected"
  const status = typeof rawStatus === "string" ? rawStatus.toLowerCase() : "disconnected"

  const getStatusConfig = () => {
    switch (status) {
      case "created":
        return { label: "Criado", Icon: Clock, variant: "secondary" as const, className: "" }
      case "qr_pending":
        return { label: "Aguardando QR", Icon: QrCode, variant: "default" as const, className: "" }
      case "connected":
        return {
          label: "Conectado",
          Icon: CheckCircle,
          variant: "default" as const,
          className: "bg-green-600 text-white hover:bg-green-700",
        }
      case "disconnected":
        return { label: "Desconectado", Icon: AlertCircle, variant: "secondary" as const, className: "" }
      case "error":
        return { label: "Erro", Icon: AlertCircle, variant: "destructive" as const, className: "" }
      default:
        return { label: "Desconhecido", Icon: AlertCircle, variant: "secondary" as const, className: "" }
    }
  }

  const { label, Icon, variant, className } = getStatusConfig()

  const handleStart = async () => {
    setIsStarting(true)
    try {
      await apiRequest(`/api/instances/${instance.id}/start`, { method: "POST" })
      onRefresh()
    } catch (error) {
      console.error("Error starting instance:", error)
    } finally {
      setIsStarting(false)
    }
  }

  const handleLogout = async () => {
    setIsLoggingOut(true)
    try {
      await apiRequest(`/api/instances/${instance.id}/logout`, { method: "POST" })
      onRefresh()
    } catch (error) {
      console.error("Error logging out:", error)
    } finally {
      setIsLoggingOut(false)
    }
  }

  const showStartButton = status === "created" || status === "disconnected" || status === "error"
  const showQrButton = status === "qr_pending"
  const showChatButton = status === "connected"

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-2 min-w-0">
            <Phone className="h-5 w-5 shrink-0 text-muted-foreground" />
            <CardTitle className="text-lg truncate">{instance?.name ?? "Sem nome"}</CardTitle>
          </div>
          <Badge variant={variant} className={className}>
            <Icon className="mr-1 h-3 w-3" />
            {label}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-4">
          {instance?.phone_number && (
            <p className="text-sm">
              <span className="text-muted-foreground">Número: </span>
              <span className="font-medium">{instance.phone_number}</span>
            </p>
          )}

          {instance?.last_connected_at && (
            <p className="text-sm text-muted-foreground">
              Última conexão: {new Date(instance.last_connected_at).toLocaleString("pt-BR")}
            </p>
          )}

          <div className="flex gap-2">
            {showStartButton && (
              <Button onClick={handleStart} disabled={isStarting} className="flex-1">
                {isStarting ? "Iniciando..." : "Iniciar"}
              </Button>
            )}

            {showQrButton && (
              <Button onClick={() => onQrCodeClick(instance)} className="flex-1">
                <QrCode className="mr-2 h-4 w-4" />
                Ver QR Code
              </Button>
            )}

            {showChatButton && (
              <>
                <Button variant="outline" asChild className="flex-1 bg-transparent">
                  <Link href={`/instances/${instance.id}/chat`}>Abrir chat</Link>
                </Button>
                <Button variant="ghost" size="icon" onClick={handleLogout} disabled={isLoggingOut} title="Desconectar">
                  <LogOut className="h-4 w-4" />
                </Button>
              </>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
