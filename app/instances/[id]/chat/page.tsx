import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { ChatContent } from "./chat-content"

interface ChatPageProps {
  params: Promise<{
    id: string
  }>
}

export default async function ChatPage({ params }: ChatPageProps) {
  const supabase = await createClient()
  const { id } = await params

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser()

  if (error || !user) {
    redirect("/auth/login")
  }

  // Verify instance exists and user has access
  const { data: instance, error: instanceError } = await supabase
    .from("whatsapp_instances")
    .select("*, projects!inner(owner_id)")
    .eq("id", id)
    .single()

  if (instanceError || !instance || (instance.projects as any).owner_id !== user.id) {
    redirect("/instances")
  }

  return <ChatContent instanceId={id} instanceName={instance.name} />
}
