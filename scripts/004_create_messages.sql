-- Create enum for message direction
CREATE TYPE message_direction AS ENUM ('INBOUND', 'OUTBOUND');

-- Create messages table
CREATE TABLE IF NOT EXISTS public.messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  instance_id UUID NOT NULL REFERENCES public.whatsapp_instances(id) ON DELETE CASCADE,
  contact_id UUID NOT NULL REFERENCES public.contacts(id) ON DELETE CASCADE,
  direction message_direction NOT NULL,
  wa_message_id TEXT,
  content TEXT NOT NULL,
  is_from_agent BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  delivered_at TIMESTAMPTZ,
  read_at TIMESTAMPTZ
);

-- Create indexes for faster queries
CREATE INDEX idx_messages_instance_id ON public.messages(instance_id);
CREATE INDEX idx_messages_contact_id ON public.messages(contact_id);
CREATE INDEX idx_messages_created_at ON public.messages(created_at DESC);
CREATE INDEX idx_messages_direction ON public.messages(direction);

-- Enable RLS
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;

-- RLS Policies for messages
CREATE POLICY "Users can view messages from their instances"
  ON public.messages FOR SELECT
  USING (
    instance_id IN (
      SELECT wi.id FROM public.whatsapp_instances wi
      JOIN public.projects p ON wi.project_id = p.id
      WHERE p.owner_id = auth.uid()
    )
  );

CREATE POLICY "Users can create messages in their instances"
  ON public.messages FOR INSERT
  WITH CHECK (
    instance_id IN (
      SELECT wi.id FROM public.whatsapp_instances wi
      JOIN public.projects p ON wi.project_id = p.id
      WHERE p.owner_id = auth.uid()
    )
  );

CREATE POLICY "Users can update messages from their instances"
  ON public.messages FOR UPDATE
  USING (
    instance_id IN (
      SELECT wi.id FROM public.whatsapp_instances wi
      JOIN public.projects p ON wi.project_id = p.id
      WHERE p.owner_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete messages from their instances"
  ON public.messages FOR DELETE
  USING (
    instance_id IN (
      SELECT wi.id FROM public.whatsapp_instances wi
      JOIN public.projects p ON wi.project_id = p.id
      WHERE p.owner_id = auth.uid()
    )
  );
