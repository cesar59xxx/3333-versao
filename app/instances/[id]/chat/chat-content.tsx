"use client"

import { useState, useEffect, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { ContactList } from "@/components/chat/contact-list"
import { ChatHeader } from "@/components/chat/chat-header"
import { MessageList } from "@/components/chat/message-list"
import { MessageInput } from "@/components/chat/message-input"
import { useContacts } from "@/lib/hooks/use-contacts"
import { useMessages } from "@/lib/hooks/use-messages"
import { useSocket } from "@/lib/hooks/use-socket"
import { apiRequest } from "@/lib/api/client"
import type { Message } from "@/lib/types/database"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"

interface ChatContentProps {
  instanceId: string
  instanceName: string
}

export function ChatContent({ instanceId, instanceName }: ChatContentProps) {
  const [selectedContactId, setSelectedContactId] = useState<string | null>(null)
  const { contacts, loading: contactsLoading, refetch: refetchContacts } = useContacts(instanceId)
  const {
    messages,
    loading: messagesLoading,
    addMessage,
    refetch: refetchMessages,
  } = useMessages(instanceId, selectedContactId)
  const { socket } = useSocket()

  const selectedContact = contacts.find((c) => c.id === selectedContactId) ?? null

  // Listen for new messages via Socket.IO
  useEffect(() => {
    if (!socket) return

    const handleMessageReceived = (data: { instanceId: string; contactId: string; message: Message }) => {
      if (data.instanceId === instanceId) {
        refetchContacts()
        if (data.contactId === selectedContactId) {
          addMessage(data.message)
        }
      }
    }

    socket.on("message_received", handleMessageReceived)

    return () => {
      socket.off("message_received", handleMessageReceived)
    }
  }, [socket, instanceId, selectedContactId, addMessage, refetchContacts])

  const handleSendMessage = useCallback(
    async (content: string) => {
      if (!selectedContactId) return

      const message = await apiRequest<Message>(`/api/instances/${instanceId}/messages`, {
        method: "POST",
        body: JSON.stringify({
          contactId: selectedContactId,
          content,
        }),
      })

      addMessage(message)
      refetchContacts()
    },
    [instanceId, selectedContactId, addMessage, refetchContacts],
  )

  return (
    <div className="flex h-screen flex-col">
      <header className="border-b bg-background">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" asChild>
              <Link href="/instances">
                <ArrowLeft className="h-5 w-5" />
              </Link>
            </Button>
            <h1 className="text-xl font-bold">WhatsApp SaaS</h1>
          </div>
          <nav className="flex items-center gap-4">
            <Button variant="ghost" asChild>
              <Link href="/dashboard">Dashboard</Link>
            </Button>
            <Button variant="ghost" asChild>
              <Link href="/instances">Instâncias</Link>
            </Button>
          </nav>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        <div className="w-80 flex-shrink-0 border-r">
          {contactsLoading ? (
            <div className="flex h-full items-center justify-center">
              <p className="text-muted-foreground">Carregando contatos...</p>
            </div>
          ) : (
            <ContactList
              contacts={contacts}
              selectedContactId={selectedContactId}
              onSelectContact={setSelectedContactId}
            />
          )}
        </div>

        <div className="flex flex-1 flex-col">
          <ChatHeader contact={selectedContact} instanceName={instanceName} />

          {selectedContactId ? (
            <>
              <MessageList messages={messages} loading={messagesLoading} />
              <MessageInput onSendMessage={handleSendMessage} />
            </>
          ) : (
            <div className="flex flex-1 items-center justify-center text-muted-foreground">
              <p>Selecione uma conversa para começar</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
