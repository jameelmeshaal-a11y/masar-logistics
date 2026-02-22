
-- Fix user_roles policies - they should be PERMISSIVE (default), not RESTRICTIVE
DROP POLICY "Users can view own role" ON public.user_roles;
DROP POLICY "Admins can manage roles" ON public.user_roles;

CREATE POLICY "Users can view own role" ON public.user_roles
  FOR SELECT TO authenticated USING (auth.uid() = user_id);

CREATE POLICY "Admins can manage roles" ON public.user_roles
  FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin'));
