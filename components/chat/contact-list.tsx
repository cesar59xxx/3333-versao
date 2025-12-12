"use client"

import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import type { Contact } from "@/lib/types/database"
import { cn } from "@/lib/utils"
import { User } from "lucide-react"

interface ContactListProps {
  contacts: Contact[]
  selectedContactId: string | null
  onSelectContact: (contactId: string) => void
}

export function ContactList({ contacts, selectedContactId, onSelectContact }: ContactListProps) {
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

  const formatTime = (timestamp: string | null) => {
    if (!timestamp) return ""
    const date = new Date(timestamp)
    const now = new Date()
    const diff = now.getTime() - date.getTime()
    const days = Math.floor(diff / (1000 * 60 * 60 * 24))

    if (days === 0) {
      return date.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })
    } else if (days === 1) {
      return "Ontem"
    } else if (days < 7) {
      return date.toLocaleDateString("pt-BR", { weekday: "short" })
    } else {
      return date.toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit" })
    }
  }

  return (
    <div className="flex flex-col h-full border-r bg-muted/30">
      <div className="p-4 border-b bg-background">
        <h2 className="text-lg font-semibold">Conversas</h2>
      </div>
      <ScrollArea className="flex-1">
        <div className="flex flex-col">
          {contacts.length === 0 ? (
            <div className="p-8 text-center text-muted-foreground">
              <User className="mx-auto h-12 w-12 mb-2 opacity-20" />
              <p>Nenhuma conversa ainda</p>
            </div>
          ) : (
            contacts.map((contact) => (
              <button
                key={contact.id}
                onClick={() => onSelectContact(contact.id)}
                className={cn(
                  "flex items-center gap-3 p-4 hover:bg-accent/50 transition-colors border-b text-left",
                  selectedContactId === contact.id && "bg-accent",
                )}
              >
                <Avatar>
                  <AvatarFallback className="bg-primary/10 text-primary">
                    {getInitials(contact.name, contact.phone_number)}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <p className="font-medium truncate">{contact.name || contact.phone_number}</p>
                    {contact.last_message_at && (
                      <span className="text-xs text-muted-foreground">{formatTime(contact.last_message_at)}</span>
                    )}
                  </div>
                  {contact.phone_number && contact.name && (
                    <p className="text-sm text-muted-foreground truncate">{contact.phone_number}</p>
                  )}
                </div>
              </button>
            ))
          )}
        </div>
      </ScrollArea>
    </div>
  )
}
