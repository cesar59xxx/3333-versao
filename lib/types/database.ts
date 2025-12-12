export type InstanceStatus = "CREATED" | "QR_PENDING" | "CONNECTED" | "DISCONNECTED" | "ERROR"
export type MessageDirection = "INBOUND" | "OUTBOUND"

export interface User {
  id: string
  email: string
  created_at: string
}

export interface Project {
  id: string
  owner_id: string
  name: string
  created_at: string
}

export interface WhatsAppInstance {
  id: string
  project_id: string
  name: string
  phone_number: string | null
  status: InstanceStatus
  last_qr: string | null
  session_data: any | null
  last_connected_at: string | null
  created_at: string
  updated_at: string
}

export interface Contact {
  id: string
  instance_id: string
  wa_id: string
  phone_number: string
  name: string | null
  created_at: string
  last_message_at: string | null
}

export interface Message {
  id: string
  instance_id: string
  contact_id: string
  direction: MessageDirection
  wa_message_id: string | null
  content: string
  is_from_agent: boolean
  created_at: string
  delivered_at: string | null
  read_at: string | null
}

export interface SalesEvent {
  id: string
  project_id: string
  external_sale_id: string
  amount: number
  currency: string
  status: string
  metadata: any | null
  created_at: string
  event_date: string
}

export interface DashboardMetrics {
  date: string
  messages_received_today: number
  unique_contacts_today: number
  response_rate_today: number
  sales_amount_today: number
}
