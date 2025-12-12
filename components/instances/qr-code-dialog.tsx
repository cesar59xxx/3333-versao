"use client"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import type { WhatsAppInstance } from "@/lib/types/database"
import { QRCodeSVG } from "qrcode.react"
import { Loader2 } from "lucide-react"

interface QrCodeDialogProps {
  instance: WhatsAppInstance | null
  open: boolean
  onOpenChange: (open: boolean) => void
  qrCode: string | null
}

export function QrCodeDialog({ instance, open, onOpenChange, qrCode }: QrCodeDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Escanear QR Code</DialogTitle>
          <DialogDescription>
            Abra o WhatsApp no seu celular e escaneie o QR code para conectar a instância{" "}
            {instance?.name || "desconhecida"}.
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col items-center justify-center py-8">
          {qrCode ? (
            <div className="rounded-lg border bg-white p-4">
              <QRCodeSVG value={qrCode} size={256} level="H" />
            </div>
          ) : (
            <div className="flex flex-col items-center gap-4">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
              <p className="text-sm text-muted-foreground">Gerando QR code...</p>
            </div>
          )}
        </div>
        <div className="text-center text-sm text-muted-foreground">
          <p>1. Abra o WhatsApp no seu celular</p>
          <p>2. Toque em Menu ou Configurações e selecione Aparelhos conectados</p>
          <p>3. Toque em Conectar um aparelho</p>
          <p>4. Aponte seu telefone para esta tela para capturar o código</p>
        </div>
      </DialogContent>
    </Dialog>
  )
}
