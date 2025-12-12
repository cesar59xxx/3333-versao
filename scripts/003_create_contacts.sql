-- Create contacts table
CREATE TABLE IF NOT EXISTS public.contacts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  instance_id UUID NOT NULL REFERENCES public.whatsapp_instances(id) ON DELETE CASCADE,
  wa_id TEXT NOT NULL,
  phone_number TEXT NOT NULL,
  name TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  last_message_at TIMESTAMPTZ,
  UNIQUE(instance_id, wa_id)
);

-- Create indexes for faster queries
CREATE INDEX idx_contacts_instance_id ON public.contacts(instance_id);
CREATE INDEX idx_contacts_wa_id ON public.contacts(wa_id);
CREATE INDEX idx_contacts_last_message_at ON public.contacts(last_message_at DESC);

-- Enable RLS
ALTER TABLE public.contacts ENABLE ROW LEVEL SECURITY;

-- RLS Policies for contacts
CREATE POLICY "Users can view contacts from their instances"
  ON public.contacts FOR SELECT
  USING (
    instance_id IN (
      SELECT wi.id FROM public.whatsapp_instances wi
      JOIN public.projects p ON wi.project_id = p.id
      WHERE p.owner_id = auth.uid()
    )
  );

CREATE POLICY "Users can create contacts in their instances"
  ON public.contacts FOR INSERT
  WITH CHECK (
    instance_id IN (
      SELECT wi.id FROM public.whatsapp_instances wi
      JOIN public.projects p ON wi.project_id = p.id
      WHERE p.owner_id = auth.uid()
    )
  );

CREATE POLICY "Users can update contacts from their instances"
  ON public.contacts FOR UPDATE
  USING (
    instance_id IN (
      SELECT wi.id FROM public.whatsapp_instances wi
      JOIN public.projects p ON wi.project_id = p.id
      WHERE p.owner_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete contacts from their instances"
  ON public.contacts FOR DELETE
  USING (
    instance_id IN (
      SELECT wi.id FROM public.whatsapp_instances wi
      JOIN public.projects p ON wi.project_id = p.id
      WHERE p.owner_id = auth.uid()
    )
  );
