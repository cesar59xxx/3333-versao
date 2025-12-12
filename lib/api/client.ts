import { createClient as createSupabaseClient } from "@/lib/supabase/client"

const BACKEND_URL =
  process.env.NEXT_PUBLIC_BACKEND_URL || "https://incredible-exploration-production-5a86.up.railway.app"

async function getAuthToken() {
  const supabase = createSupabaseClient()
  const {
    data: { session },
  } = await supabase.auth.getSession()
  return session?.access_token
}

export async function apiRequest(endpoint: string, options: RequestInit = {}) {
  const token = await getAuthToken()

  const headers = {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  }

  const response = await fetch(`${BACKEND_URL}${endpoint}`, {
    ...options,
    headers,
  })

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: "Unknown error" }))
    throw new Error(error.error || "Request failed")
  }

  return response.json()
}
