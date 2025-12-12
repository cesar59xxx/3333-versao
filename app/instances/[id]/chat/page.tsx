import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { ChatContent } from "./chat-content"

interface ChatPageProps {
  params: Promise<{ id: string }>
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

  // Verify instance exists - now checking user_id since project_id can be null
  const { data: instance, error: instanceError } = await supabase
    .from("whatsapp_instances")
    .select("id, name, user_id")
    .eq("id", id)
    .single()

  if (instanceError || !instance) {
    redirect("/instances")
  }

  // Check if user owns this instance directly or via project
  if (instance.user_id !== user.id) {
    // Try checking via project ownership
    const { data: instanceWithProject } = await supabase
      .from("whatsapp_instances")
      .select("*, projects!inner(owner_id)")
      .eq("id", id)
      .single()

    if (!instanceWithProject || (instanceWithProject.projects as { owner_id: string }).owner_id !== user.id) {
      redirect("/instances")
    }
  }

  return <ChatContent instanceId={id} instanceName={instance.name} />
}
