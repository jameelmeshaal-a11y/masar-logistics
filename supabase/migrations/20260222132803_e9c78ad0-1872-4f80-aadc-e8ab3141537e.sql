
-- Notifications table
CREATE TABLE public.notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  type TEXT NOT NULL DEFAULT 'info',
  related_type TEXT,
  related_id UUID,
  is_read BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own notifications" ON public.notifications
  FOR SELECT TO authenticated USING (auth.uid() = user_id);

CREATE POLICY "Users can update own notifications" ON public.notifications
  FOR UPDATE TO authenticated USING (auth.uid() = user_id);

CREATE POLICY "Authenticated can create notifications" ON public.notifications
  FOR INSERT TO authenticated WITH CHECK (true);

CREATE INDEX idx_notifications_user ON public.notifications(user_id, is_read, created_at DESC);

-- Ticket comments
CREATE TABLE public.ticket_comments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  ticket_id UUID NOT NULL REFERENCES public.maintenance_tickets(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.ticket_comments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated can view comments" ON public.ticket_comments
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Authenticated can add comments" ON public.ticket_comments
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

-- Ticket history / audit log
CREATE TABLE public.ticket_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  ticket_id UUID NOT NULL REFERENCES public.maintenance_tickets(id) ON DELETE CASCADE,
  user_id UUID,
  action TEXT NOT NULL,
  old_value TEXT,
  new_value TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.ticket_history ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated can view history" ON public.ticket_history
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Authenticated can add history" ON public.ticket_history
  FOR INSERT TO authenticated WITH CHECK (true);

CREATE INDEX idx_ticket_comments_ticket ON public.ticket_comments(ticket_id, created_at);
CREATE INDEX idx_ticket_history_ticket ON public.ticket_history(ticket_id, created_at);

-- Enable realtime for notifications
ALTER PUBLICATION supabase_realtime ADD TABLE public.notifications;
