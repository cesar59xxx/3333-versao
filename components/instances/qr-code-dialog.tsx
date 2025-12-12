"use client"

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import Image from "next/image"

interface QRCodeDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  qrCode: string | null
  instanceName: string
}

export function QRCodeDialog({ open, onOpenChange, qrCode, instanceName }: QRCodeDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle>QR Code - {instanceName}</DialogTitle>
          <DialogDescription>Escaneie o código QR com seu WhatsApp para conectar a instância</DialogDescription>
        </DialogHeader>
        <div className="flex justify-center">
          {qrCode ? (
            <Image src={qrCode || "/placeholder.svg"} alt="QR Code" width={256} height={256} className="border p-2" />
          ) : (
            <div className="w-64 h-64 bg-muted flex items-center justify-center rounded-lg">
              <p className="text-sm text-muted-foreground">Carregando QR Code...</p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
