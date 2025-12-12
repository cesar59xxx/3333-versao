-- Create enum for instance status
CREATE TYPE instance_status AS ENUM (
  'CREATED',
  'QR_PENDING',
  'CONNECTED',
  'DISCONNECTED',
  'ERROR'
);

-- Create whatsapp_instances table
CREATE TABLE IF NOT EXISTS public.whatsapp_instances (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  phone_number TEXT,
  status instance_status DEFAULT 'CREATED',
  last_qr TEXT,
  session_data JSONB,
  last_connected_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create index for faster queries
CREATE INDEX idx_whatsapp_instances_project_id ON public.whatsapp_instances(project_id);
CREATE INDEX idx_whatsapp_instances_status ON public.whatsapp_instances(status);

-- Enable RLS
ALTER TABLE public.whatsapp_instances ENABLE ROW LEVEL SECURITY;

-- RLS Policies for whatsapp_instances
CREATE POLICY "Users can view instances from their projects"
  ON public.whatsapp_instances FOR SELECT
  USING (
    project_id IN (
      SELECT id FROM public.projects WHERE owner_id = auth.uid()
    )
  );

CREATE POLICY "Users can create instances in their projects"
  ON public.whatsapp_instances FOR INSERT
  WITH CHECK (
    project_id IN (
      SELECT id FROM public.projects WHERE owner_id = auth.uid()
    )
  );

CREATE POLICY "Users can update instances from their projects"
  ON public.whatsapp_instances FOR UPDATE
  USING (
    project_id IN (
      SELECT id FROM public.projects WHERE owner_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete instances from their projects"
  ON public.whatsapp_instances FOR DELETE
  USING (
    project_id IN (
      SELECT id FROM public.projects WHERE owner_id = auth.uid()
    )
  );

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to auto-update updated_at
CREATE TRIGGER update_whatsapp_instances_updated_at
  BEFORE UPDATE ON public.whatsapp_instances
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
