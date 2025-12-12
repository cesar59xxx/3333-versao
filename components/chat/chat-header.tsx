import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import type { Contact } from "@/lib/types/database"
import { Phone } from "lucide-react"

interface ChatHeaderProps {
  contact: Contact | null
  instanceName: string
}

export function ChatHeader({ contact, instanceName }: ChatHeaderProps) {
  const getInitials = (name: string | null, phone: string) => {
    if (name) {
      return name
        .split(" ")
        .slice(0, 2)
        .map((n) => n[0])
        .join("")
        .toUpperCase()
    }
    return phone.slice(-2)
  }

  if (!contact) {
    return (
      <div className="border-b p-4 bg-background">
        <div className="flex items-center gap-3">
          <Phone className="h-5 w-5 text-muted-foreground" />
          <div>
            <h3 className="font-semibold">{instanceName}</h3>
            <p className="text-sm text-muted-foreground">Selecione uma conversa</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="border-b p-4 bg-background">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Avatar>
            <AvatarFallback className="bg-primary/10 text-primary">
              {getInitials(contact.name, contact.phone_number)}
            </AvatarFallback>
          </Avatar>
          <div>
            <h3 className="font-semibold">{contact.name || contact.phone_number}</h3>
            <p className="text-sm text-muted-foreground">{contact.phone_number}</p>
          </div>
        </div>
        <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">
          {instanceName}
        </Badge>
      </div>
    </div>
  )
}
