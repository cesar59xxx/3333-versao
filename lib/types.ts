export type Instance = {
  id: string
  project_id: string
  user_id: string
  name: string
  phone_number: string | null
  status: "disconnected" | "connecting" | "connected"
  last_qr: string | null
  last_connected_at: string | null
  created_at: string
  updated_at: string
}

export type Contact = {
  id: string
  instance_id: string
  wa_id: string
  phone_number: string
  name: string | null
  last_message_at: string | null
  created_at: string
}

export type Message = {
  id: string
  instance_id: string
  contact_id: string
  content: string
  direction: "inbound" | "outbound"
  is_from_agent: boolean
  wa_message_id: string | null
  delivered_at: string | null
  read_at: string | null
  created_at: string
}

export type Project = {
  id: string
  owner_id: string
  name: string
  created_at: string
}
