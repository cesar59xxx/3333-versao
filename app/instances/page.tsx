import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { InstancesContent } from "./instances-content"

export default async function InstancesPage() {
  const supabase = await createClient()
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser()

  if (error || !user) {
    redirect("/auth/login")
  }

  return <InstancesContent />
}
