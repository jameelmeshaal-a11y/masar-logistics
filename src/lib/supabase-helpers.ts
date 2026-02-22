import { supabase } from "@/integrations/supabase/client";

export type AppRole = 'admin' | 'manager' | 'viewer' | 'driver' | 'warehouse_keeper' | 'mechanic';

export async function getUserRole(userId: string): Promise<AppRole | null> {
  const { data } = await supabase
    .from('user_roles')
    .select('role')
    .eq('user_id', userId)
    .single();
  return data?.role as AppRole | null;
}

export async function getCurrentUserRole(): Promise<AppRole | null> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;
  return getUserRole(user.id);
}

export const roleLabels: Record<AppRole, string> = {
  admin: 'مدير النظام',
  manager: 'مدير',
  viewer: 'مشاهد',
  driver: 'سائق',
  warehouse_keeper: 'أمين مستودع',
  mechanic: 'فني صيانة',
};

export const PERMISSIONS: Record<string, Record<AppRole, 'full' | 'read' | 'none'>> = {
  dashboard: { admin: 'full', manager: 'full', viewer: 'read', driver: 'read', warehouse_keeper: 'read', mechanic: 'read' },
  procurement: { admin: 'full', manager: 'full', viewer: 'read', driver: 'none', warehouse_keeper: 'read', mechanic: 'none' },
  fleet: { admin: 'full', manager: 'full', viewer: 'read', driver: 'read', warehouse_keeper: 'none', mechanic: 'read' },
  maintenance: { admin: 'full', manager: 'full', viewer: 'read', driver: 'none', warehouse_keeper: 'none', mechanic: 'full' },
  warehouse: { admin: 'full', manager: 'full', viewer: 'read', driver: 'none', warehouse_keeper: 'full', mechanic: 'read' },
  drivers: { admin: 'full', manager: 'full', viewer: 'read', driver: 'read', warehouse_keeper: 'none', mechanic: 'none' },
  finance: { admin: 'full', manager: 'full', viewer: 'read', driver: 'none', warehouse_keeper: 'none', mechanic: 'none' },
  reports: { admin: 'full', manager: 'full', viewer: 'read', driver: 'read', warehouse_keeper: 'read', mechanic: 'read' },
  settings: { admin: 'full', manager: 'none', viewer: 'none', driver: 'none', warehouse_keeper: 'none', mechanic: 'none' },
};

export function hasPermission(role: AppRole | null, module: string, level: 'read' | 'full' = 'read'): boolean {
  if (!role) return false;
  const perm = PERMISSIONS[module]?.[role];
  if (!perm) return false;
  if (level === 'read') return perm !== 'none';
  return perm === 'full';
}
