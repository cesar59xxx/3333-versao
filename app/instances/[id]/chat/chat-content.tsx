"use client"

import { useState, useEffect } from "react"
import { useMessages } from "@/lib/hooks/use-messages"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { createBrowserClient } from "@supabase/ssr"
import { ArrowLeft, Send } from "lucide-react"
import Link from "next/link"
import type { Contact } from "@/lib/types"

interface ChatContentProps {
  instanceId: string
  instanceName: string
}

export function ChatContent({ instanceId, instanceName }: ChatContentProps) {
  const [contacts, setContacts] = useState<Contact[]>([])
  const [selectedContactId, setSelectedContactId] = useState<string | null>(null)
  const [messageInput, setMessageInput] = useState("")
  const [contactsLoading, setContactsLoading] = useState(true)

  const { messages, loading: messagesLoading, sendMessage } = useMessages(instanceId, selectedContactId)

  // Fetch contacts
  useEffect(() => {
    async function fetchContacts() {
      try {
        const supabase = createBrowserClient(
          process.env.NEXT_PUBLIC_SUPABASE_URL!,
          process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        )

        const { data, error } = await supabase
          .from("contacts")
          .select("*")
          .eq("instance_id", instanceId)
          .order("last_message_at", { ascending: false, nullsFirst: false })

        if (error) throw error
        setContacts(data || [])
      } catch (err) {
        console.error("Erro ao buscar contatos:", err)
      } finally {
        setContactsLoading(false)
      }
    }

    fetchContacts()
  }, [instanceId])

  // Auto-select first contact
  useEffect(() => {
    if (contacts.length > 0 && !selectedContactId) {
      setSelectedContactId(contacts[0].id)
    }
  }, [contacts, selectedContactId])

  async function handleSendMessage() {
    if (!messageInput.trim() || !selectedContactId) return

    const success = await sendMessage(messageInput)
    if (success) {
      setMessageInput("")
    }
  }

  const selectedContact = contacts.find((c) => c.id === selectedContactId)

  return (
    <div className="flex h-screen flex-col bg-background">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-4">
            <Link href="/instances">
              <Button variant="ghost" size="icon">
                <ArrowLeft className="h-5 w-5" />
              </Button>
            </Link>
            <div>
              <h1 className="font-bold">{instanceName}</h1>
              <p className="text-xs text-muted-foreground">WhatsApp</p>
            </div>
          </div>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Contacts Sidebar */}
        <div className="w-72 border-r bg-muted/30 overflow-y-auto">
          {contactsLoading ? (
            <div className="flex items-center justify-center h-full">
              <p className="text-sm text-muted-foreground">Carregando contatos...</p>
            </div>
          ) : contacts.length === 0 ? (
            <div className="flex items-center justify-center h-full">
              <p className="text-sm text-muted-foreground">Nenhum contato</p>
            </div>
          ) : (
            <div className="divide-y">
              {contacts.map((contact) => (
                <button
                  key={contact.id}
                  onClick={() => setSelectedContactId(contact.id)}
                  className={`w-full px-4 py-3 text-left hover:bg-accent transition-colors ${
                    selectedContactId === contact.id ? "bg-primary/10" : ""
                  }`}
                >
                  <p className="font-medium text-sm">{contact.name || contact.phone_number}</p>
                  <p className="text-xs text-muted-foreground truncate">{contact.wa_id}</p>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Chat Area */}
        <div className="flex flex-1 flex-col">
          {selectedContact ? (
            <>
              {/* Chat Header */}
              <div className="border-b bg-card px-4 py-3">
                <p className="font-medium">{selectedContact.name || selectedContact.phone_number}</p>
                <p className="text-xs text-muted-foreground">{selectedContact.wa_id}</p>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messagesLoading ? (
                  <div className="flex items-center justify-center h-full">
                    <p className="text-sm text-muted-foreground">Carregando mensagens...</p>
                  </div>
                ) : messages.length === 0 ? (
                  <div className="flex items-center justify-center h-full">
                    <p className="text-sm text-muted-foreground">Nenhuma mensagem</p>
                  </div>
                ) : (
                  messages.map((msg) => (
                    <div
                      key={msg.id}
                      className={`flex ${msg.direction === "outbound" ? "justify-end" : "justify-start"}`}
                    >
                      <Card
                        className={`max-w-xs px-4 py-2 ${msg.direction === "outbound" ? "bg-primary text-primary-foreground" : ""}`}
                      >
                        <p className="text-sm">{msg.content}</p>
                        <p className="text-xs opacity-70 mt-1">
                          {new Date(msg.created_at).toLocaleTimeString("pt-BR")}
                        </p>
                      </Card>
                    </div>
                  ))
                )}
              </div>

              {/* Input */}
              <div className="border-t bg-card p-4">
                <div className="flex gap-2">
                  <Input
                    placeholder="Digite uma mensagem..."
                    value={messageInput}
                    onChange={(e) => setMessageInput(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
                  />
                  <Button onClick={handleSendMessage} size="icon">
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </>
          ) : (
            <div className="flex items-center justify-center flex-1">
              <p className="text-muted-foreground">Selecione um contato para começar</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
