"use client"

import { useState, useEffect, useRef } from "react"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useParams } from "next/navigation"
import type { Contact, Message } from "@/lib/types"
import { Send } from "lucide-react"

export default function ChatPage() {
  const params = useParams()
  const projectId = params.id as string
  const instanceId = params.instanceId as string
  const [contacts, setContacts] = useState<Contact[]>([])
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [messageInput, setMessageInput] = useState("")
  const [loading, setLoading] = useState(true)
  const [sending, setSending] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    async function loadContacts() {
      try {
        const supabase = createClient()
        const { data } = await supabase
          .from("contacts")
          .select("*")
          .eq("instance_id", instanceId)
          .order("last_message_at", { ascending: false })

        setContacts(data || [])
        if (data && data.length > 0) {
          setSelectedContact(data[0])
        }
      } catch (error) {
        console.error("[v0] Error loading contacts:", error)
      } finally {
        setLoading(false)
      }
    }

    loadContacts()
  }, [instanceId])

  useEffect(() => {
    async function loadMessages() {
      if (!selectedContact) return

      try {
        const supabase = createClient()
        const { data } = await supabase
          .from("messages")
          .select("*")
          .eq("contact_id", selectedContact.id)
          .order("created_at", { ascending: true })

        setMessages(data || [])
        setTimeout(() => messagesEndRef.current?.scrollIntoView({ behavior: "smooth" }), 100)
      } catch (error) {
        console.error("[v0] Error loading messages:", error)
      }
    }

    loadMessages()

    // Subscribe to new messages
    if (selectedContact) {
      const supabase = createClient()
      const channel = supabase
        .channel(`messages-${selectedContact.id}`)
        .on(
          "postgres_changes",
          {
            event: "INSERT",
            schema: "public",
            table: "messages",
            filter: `contact_id=eq.${selectedContact.id}`,
          },
          (payload) => {
            setMessages((prev) => [...prev, payload.new as Message])
            setTimeout(() => messagesEndRef.current?.scrollIntoView({ behavior: "smooth" }), 100)
          },
        )
        .subscribe()

      return () => {
        supabase.removeChannel(channel)
      }
    }
  }, [selectedContact])

  async function handleSendMessage() {
    if (!messageInput.trim() || !selectedContact) return

    setSending(true)
    try {
      const supabase = createClient()
      await supabase.from("messages").insert([
        {
          instance_id: instanceId,
          contact_id: selectedContact.id,
          content: messageInput,
          direction: "outbound",
          is_from_agent: true,
        },
      ])
      setMessageInput("")
    } catch (error) {
      console.error("[v0] Error sending message:", error)
    } finally {
      setSending(false)
    }
  }

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <p>Carregando...</p>
      </div>
    )
  }

  return (
    <div className="flex h-screen bg-white">
      {/* Sidebar - Contacts */}
      <div className="w-80 border-r border-gray-200 flex flex-col">
        <div className="p-4 border-b border-gray-200">
          <h2 className="text-xl font-bold text-black">Contatos</h2>
        </div>
        <div className="flex-1 overflow-y-auto">
          {contacts.length === 0 ? (
            <div className="p-4 text-center text-gray-500">
              <p>Nenhum contato ainda</p>
            </div>
          ) : (
            contacts.map((contact) => (
              <div
                key={contact.id}
                onClick={() => setSelectedContact(contact)}
                className={`p-4 border-b border-gray-100 cursor-pointer hover:bg-gray-50 ${
                  selectedContact?.id === contact.id ? "bg-blue-50 border-l-4 border-blue-500" : ""
                }`}
              >
                <p className="font-medium text-black">{contact.name || contact.phone_number}</p>
                <p className="text-sm text-gray-500">{contact.phone_number}</p>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col">
        {selectedContact ? (
          <>
            {/* Header */}
            <div className="h-16 border-b border-gray-200 flex items-center px-6">
              <h2 className="text-lg font-semibold text-black">
                {selectedContact.name || selectedContact.phone_number}
              </h2>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.direction === "outbound" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-xs px-4 py-2 rounded-lg ${
                      message.direction === "outbound" ? "bg-green-600 text-white" : "bg-gray-200 text-black"
                    }`}
                  >
                    <p>{message.content}</p>
                    <p className="text-xs opacity-75 mt-1">
                      {new Date(message.created_at).toLocaleTimeString("pt-BR")}
                    </p>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="h-20 border-t border-gray-200 p-4 flex gap-2">
              <Input
                value={messageInput}
                onChange={(e) => setMessageInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && handleSendMessage()}
                placeholder="Digite sua mensagem..."
                className="flex-1 border-gray-300"
              />
              <Button
                onClick={handleSendMessage}
                disabled={sending || !messageInput.trim()}
                className="bg-green-600 hover:bg-green-700 text-white"
              >
                <Send className="w-4 h-4" />
              </Button>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <p className="text-gray-500">Selecione um contato para começar</p>
          </div>
        )}
      </div>
    </div>
  )
}
