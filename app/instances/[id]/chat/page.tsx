"use client"

import type React from "react"

import { useParams, useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { useMessages } from "@/lib/hooks/use-messages"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ArrowLeft, Send } from "lucide-react"
import type { Contact, Instance } from "@/lib/types"

export default function ChatPage() {
  const params = useParams()
  const router = useRouter()
  const instanceId = params.id as string
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null)
  const [contacts, setContacts] = useState<Contact[]>([])
  const [instance, setInstance] = useState<Instance | null>(null)
  const [messageText, setMessageText] = useState("")
  const [loading, setLoading] = useState(true)

  const { messages } = useMessages(instanceId, selectedContact?.id || "")

  useEffect(() => {
    async function loadData() {
      const supabase = createClient()

      // Carregar instância
      const { data: instData } = await supabase.from("instances").select("*").eq("id", instanceId).single()
      setInstance(instData)

      // Carregar contatos
      const { data: contactsData } = await supabase
        .from("contacts")
        .select("*")
        .eq("instance_id", instanceId)
        .order("last_message_at", { ascending: false })

      setContacts(contactsData || [])
      if (contactsData?.length > 0) setSelectedContact(contactsData[0])
      setLoading(false)
    }

    loadData()
  }, [instanceId])

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!messageText.trim() || !selectedContact) return

    const supabase = createClient()
    await supabase.from("messages").insert({
      instance_id: instanceId,
      contact_id: selectedContact.id,
      content: messageText,
      direction: "outbound",
      is_from_agent: true,
    })

    setMessageText("")
  }

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <p className="text-lg text-muted-foreground">Carregando chat...</p>
      </div>
    )
  }

  if (!instance) {
    return (
      <div className="flex h-screen items-center justify-center">
        <p className="text-lg text-muted-foreground">Instância não encontrada</p>
      </div>
    )
  }

  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar de Contatos */}
      <div className="w-64 border-r bg-muted/50 flex flex-col">
        <div className="border-b p-4">
          <Button variant="ghost" size="sm" onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h2 className="mt-2 font-semibold">{instance.name}</h2>
        </div>

        <div className="flex-1 overflow-y-auto">
          {contacts.map((contact) => (
            <button
              key={contact.id}
              onClick={() => setSelectedContact(contact)}
              className={`w-full border-b px-4 py-3 text-left transition-colors ${
                selectedContact?.id === contact.id ? "bg-primary/10" : "hover:bg-muted"
              }`}
            >
              <p className="font-medium text-sm">{contact.name || contact.phone_number}</p>
              <p className="text-xs text-muted-foreground">{contact.wa_id}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col">
        {selectedContact ? (
          <>
            <div className="border-b bg-card p-4">
              <h3 className="font-semibold">{selectedContact.name || selectedContact.phone_number}</h3>
              <p className="text-sm text-muted-foreground">{selectedContact.wa_id}</p>
            </div>

            <div className="flex-1 overflow-y-auto space-y-4 p-4">
              {messages.map((msg) => (
                <div key={msg.id} className={`flex ${msg.direction === "outbound" ? "justify-end" : "justify-start"}`}>
                  <div
                    className={`max-w-xs rounded-lg px-4 py-2 ${
                      msg.direction === "outbound" ? "bg-primary text-primary-foreground" : "bg-muted text-foreground"
                    }`}
                  >
                    <p className="text-sm">{msg.content}</p>
                    <p className="text-xs opacity-70 mt-1">{new Date(msg.created_at).toLocaleTimeString("pt-BR")}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="border-t bg-card p-4">
              <form onSubmit={handleSendMessage} className="flex gap-2">
                <Input
                  placeholder="Digite uma mensagem..."
                  value={messageText}
                  onChange={(e) => setMessageText(e.target.value)}
                />
                <Button type="submit" size="icon" disabled={!messageText.trim()}>
                  <Send className="h-4 w-4" />
                </Button>
              </form>
            </div>
          </>
        ) : (
          <div className="flex items-center justify-center flex-1">
            <p className="text-muted-foreground">Selecione um contato para iniciar</p>
          </div>
        )}
      </div>
    </div>
  )
}
