
-- Create maintenance tickets table
CREATE TABLE public.maintenance_tickets (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  ticket_number TEXT NOT NULL,
  equipment_type TEXT NOT NULL DEFAULT 'truck', -- truck, trailer, generator, forklift, etc.
  equipment_id UUID NULL, -- reference to trucks table if applicable
  equipment_number TEXT NOT NULL, -- manual equipment number entry
  equipment_location TEXT NOT NULL, -- site/location of equipment
  issue_category TEXT NOT NULL DEFAULT 'mechanical', -- mechanical, electrical, tires, body, hydraulic, ac, other
  issue_description TEXT NOT NULL,
  priority TEXT NOT NULL DEFAULT 'normal', -- urgent, high, normal, low
  status TEXT NOT NULL DEFAULT 'open', -- open, assigned, in_progress, waiting_parts, resolved, closed
  reported_by UUID NULL,
  assigned_to TEXT NULL,
  resolved_at TIMESTAMP WITH TIME ZONE NULL,
  resolution_notes TEXT NULL,
  estimated_cost NUMERIC NULL DEFAULT 0,
  actual_cost NUMERIC NULL DEFAULT 0,
  photos_urls TEXT[] NULL DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  CONSTRAINT fk_ticket_truck FOREIGN KEY (equipment_id) REFERENCES public.trucks(id) ON DELETE SET NULL
);

-- Enable RLS
ALTER TABLE public.maintenance_tickets ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Authenticated can view tickets" ON public.maintenance_tickets
  FOR SELECT USING (true);

CREATE POLICY "Authenticated can create tickets" ON public.maintenance_tickets
  FOR INSERT WITH CHECK (auth.uid() = reported_by);

CREATE POLICY "Admins/managers/mechanics can manage tickets" ON public.maintenance_tickets
  FOR ALL USING (
    has_role(auth.uid(), 'admin'::app_role) OR 
    has_role(auth.uid(), 'manager'::app_role) OR 
    has_role(auth.uid(), 'mechanic'::app_role)
  );

-- Auto-update updated_at
CREATE TRIGGER update_maintenance_tickets_updated_at
  BEFORE UPDATE ON public.maintenance_tickets
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
