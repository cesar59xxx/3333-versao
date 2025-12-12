-- Create sales_events table
CREATE TABLE IF NOT EXISTS public.sales_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  external_sale_id TEXT UNIQUE NOT NULL,
  amount NUMERIC(12, 2) NOT NULL,
  currency TEXT DEFAULT 'BRL',
  status TEXT NOT NULL,
  metadata JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  event_date TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for faster queries
CREATE INDEX idx_sales_events_project_id ON public.sales_events(project_id);
CREATE INDEX idx_sales_events_event_date ON public.sales_events(event_date DESC);
CREATE INDEX idx_sales_events_status ON public.sales_events(status);

-- Enable RLS
ALTER TABLE public.sales_events ENABLE ROW LEVEL SECURITY;

-- RLS Policies for sales_events
CREATE POLICY "Users can view sales from their projects"
  ON public.sales_events FOR SELECT
  USING (
    project_id IN (
      SELECT id FROM public.projects WHERE owner_id = auth.uid()
    )
  );

CREATE POLICY "Allow webhook to insert sales" 
  ON public.sales_events FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Users can update sales from their projects"
  ON public.sales_events FOR UPDATE
  USING (
    project_id IN (
      SELECT id FROM public.projects WHERE owner_id = auth.uid()
    )
  );
