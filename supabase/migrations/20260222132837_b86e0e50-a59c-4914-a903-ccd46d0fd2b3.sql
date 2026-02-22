
-- Tighten notification insert: only allow creating notifications for others (system use)
DROP POLICY "Authenticated can create notifications" ON public.notifications;
CREATE POLICY "Authenticated can create notifications" ON public.notifications
  FOR INSERT TO authenticated WITH CHECK (auth.uid() IS NOT NULL);

-- Tighten history insert
DROP POLICY "Authenticated can add history" ON public.ticket_history;
CREATE POLICY "Authenticated can add history" ON public.ticket_history
  FOR INSERT TO authenticated WITH CHECK (auth.uid() IS NOT NULL);
