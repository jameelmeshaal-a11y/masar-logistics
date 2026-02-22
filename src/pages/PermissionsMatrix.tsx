import { Shield, Check, X, Eye } from 'lucide-react';
import { PERMISSIONS, roleLabels, type AppRole } from '@/lib/supabase-helpers';

const modules: Record<string, string> = {
  dashboard: 'لوحة التحكم',
  procurement: 'المشتريات',
  fleet: 'الأسطول',
  maintenance: 'الصيانة',
  warehouse: 'المستودعات',
  drivers: 'السائقين',
  finance: 'الإدارة المالية',
  reports: 'التقارير',
  settings: 'الإعدادات',
};

const roles: AppRole[] = ['admin', 'manager', 'viewer', 'driver', 'warehouse_keeper', 'mechanic'];

const permIcon = (perm: 'full' | 'read' | 'none') => {
  if (perm === 'full') return <div className="flex items-center gap-1 text-success"><Check className="w-4 h-4" /><span className="text-xs">كامل</span></div>;
  if (perm === 'read') return <div className="flex items-center gap-1 text-info"><Eye className="w-4 h-4" /><span className="text-xs">قراءة</span></div>;
  return <div className="flex items-center gap-1 text-destructive"><X className="w-4 h-4" /><span className="text-xs">لا يوجد</span></div>;
};

const PermissionsMatrix = () => {
  return (
    <div className="space-y-6">
      <div className="page-header">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
            <Shield className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h1 className="page-title">مصفوفة الصلاحيات</h1>
            <p className="page-subtitle">عرض صلاحيات كل دور في جميع أقسام النظام</p>
          </div>
        </div>
      </div>

      <div className="bg-card rounded-xl border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="data-table">
            <thead>
              <tr>
                <th className="sticky right-0 bg-card z-10">القسم</th>
                {roles.map(role => (
                  <th key={role} className="text-center">
                    <div className="flex flex-col items-center gap-1">
                      <span className="text-xs font-semibold">{roleLabels[role]}</span>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {Object.entries(modules).map(([key, label]) => (
                <tr key={key}>
                  <td className="font-medium sticky right-0 bg-card">{label}</td>
                  {roles.map(role => (
                    <td key={role} className="text-center">
                      {permIcon(PERMISSIONS[key]?.[role] || 'none')}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="bg-card rounded-xl border p-5">
        <h3 className="font-semibold font-heading mb-3">شرح مستويات الصلاحيات</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="flex items-start gap-3 p-3 rounded-lg bg-success/5 border border-success/20">
            <Check className="w-5 h-5 text-success shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-medium">كامل (Full)</p>
              <p className="text-xs text-muted-foreground">إمكانية العرض والإضافة والتعديل والحذف</p>
            </div>
          </div>
          <div className="flex items-start gap-3 p-3 rounded-lg bg-info/5 border border-info/20">
            <Eye className="w-5 h-5 text-info shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-medium">قراءة (Read)</p>
              <p className="text-xs text-muted-foreground">إمكانية العرض فقط بدون تعديل</p>
            </div>
          </div>
          <div className="flex items-start gap-3 p-3 rounded-lg bg-destructive/5 border border-destructive/20">
            <X className="w-5 h-5 text-destructive shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-medium">لا يوجد (None)</p>
              <p className="text-xs text-muted-foreground">لا يمكن الوصول لهذا القسم</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PermissionsMatrix;
