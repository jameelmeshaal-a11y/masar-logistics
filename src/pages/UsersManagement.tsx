import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Plus, Trash2, Loader2, Shield } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { roleLabels, type AppRole } from '@/lib/supabase-helpers';

interface UserRow {
  user_id: string;
  email: string;
  full_name: string;
  role: AppRole;
}

const ADMIN_EMAIL = 'ceo@salasah.sa';

const UsersManagement = () => {
  const [users, setUsers] = useState<UserRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAdd, setShowAdd] = useState(false);
  const [newEmail, setNewEmail] = useState('');
  const [newName, setNewName] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [newRole, setNewRole] = useState<AppRole>('viewer');
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();

  const fetchUsers = async () => {
    const { data: roles } = await supabase.from('user_roles').select('user_id, role');
    const { data: profiles } = await supabase.from('profiles').select('user_id, full_name');
    if (roles && profiles) {
      const combined: UserRow[] = roles.map((r: any) => {
        const profile = profiles.find((p: any) => p.user_id === r.user_id);
        return {
          user_id: r.user_id,
          email: profile?.full_name || '',
          full_name: profile?.full_name || '',
          role: r.role as AppRole,
        };
      });
      setUsers(combined);
    }
    setLoading(false);
  };

  useEffect(() => { fetchUsers(); }, []);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEmail || !newPassword || !newName) return;
    setSaving(true);

    // Sign up user
    const { data: signUpData, error: signUpErr } = await supabase.auth.signUp({
      email: newEmail,
      password: newPassword,
      options: { data: { full_name: newName } },
    });

    if (signUpErr || !signUpData.user) {
      toast({ title: 'خطأ', description: signUpErr?.message || 'فشل إنشاء المستخدم', variant: 'destructive' });
      setSaving(false);
      return;
    }

    // Add role
    await supabase.from('user_roles').insert({ user_id: signUpData.user.id, role: newRole });

    // Update profile name
    await supabase.from('profiles').update({ full_name: newName }).eq('user_id', signUpData.user.id);

    toast({ title: 'تم', description: 'تم إضافة المستخدم بنجاح' });
    setShowAdd(false);
    setNewEmail('');
    setNewName('');
    setNewPassword('');
    setNewRole('viewer');
    fetchUsers();
    setSaving(false);
  };

  const handleDelete = async (userId: string) => {
    const user = users.find(u => u.user_id === userId);
    if (user?.full_name === ADMIN_EMAIL || user?.email === ADMIN_EMAIL) {
      toast({ title: 'غير مسموح', description: 'لا يمكن حذف حساب مدير النظام الرئيسي', variant: 'destructive' });
      return;
    }
    await supabase.from('user_roles').delete().eq('user_id', userId);
    toast({ title: 'تم', description: 'تم إزالة صلاحيات المستخدم' });
    fetchUsers();
  };

  const handleRoleChange = async (userId: string, role: AppRole) => {
    await supabase.from('user_roles').update({ role }).eq('user_id', userId);
    toast({ title: 'تم', description: 'تم تحديث الصلاحية' });
    fetchUsers();
  };

  return (
    <div className="space-y-6">
      <div className="page-header flex items-center justify-between">
        <div>
          <h1 className="page-title">إدارة المستخدمين</h1>
          <p className="page-subtitle">إضافة وإدارة مستخدمي النظام وصلاحياتهم</p>
        </div>
        <button onClick={() => setShowAdd(true)}
          className="flex items-center gap-2 bg-accent text-accent-foreground px-4 py-2.5 rounded-lg text-sm font-medium hover:opacity-90">
          <Plus className="w-4 h-4" /> إضافة مستخدم
        </button>
      </div>

      {/* Add user modal */}
      {showAdd && (
        <div className="fixed inset-0 bg-foreground/50 z-50 flex items-center justify-center p-4" onClick={() => setShowAdd(false)}>
          <div className="bg-card rounded-2xl border shadow-xl w-full max-w-md p-6" onClick={e => e.stopPropagation()}>
            <h3 className="text-lg font-bold font-heading mb-4">إضافة مستخدم جديد</h3>
            <form onSubmit={handleAdd} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">الاسم الكامل</label>
                <input value={newName} onChange={e => setNewName(e.target.value)} required
                  className="w-full border rounded-lg px-3 py-2 text-sm bg-background focus:outline-none focus:ring-2 focus:ring-primary/20" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">البريد الإلكتروني</label>
                <input type="email" value={newEmail} onChange={e => setNewEmail(e.target.value)} required dir="ltr"
                  className="w-full border rounded-lg px-3 py-2 text-sm bg-background focus:outline-none focus:ring-2 focus:ring-primary/20" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">كلمة المرور</label>
                <input type="password" value={newPassword} onChange={e => setNewPassword(e.target.value)} required minLength={6} dir="ltr"
                  className="w-full border rounded-lg px-3 py-2 text-sm bg-background focus:outline-none focus:ring-2 focus:ring-primary/20" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">الصلاحية</label>
                <select value={newRole} onChange={e => setNewRole(e.target.value as AppRole)}
                  className="w-full border rounded-lg px-3 py-2 text-sm bg-background focus:outline-none focus:ring-2 focus:ring-primary/20">
                  {Object.entries(roleLabels).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
                </select>
              </div>
              <div className="flex gap-2 pt-2">
                <button type="submit" disabled={saving}
                  className="flex-1 bg-primary text-primary-foreground py-2 rounded-lg text-sm font-semibold hover:opacity-90 disabled:opacity-50 flex items-center justify-center gap-2">
                  {saving && <Loader2 className="w-4 h-4 animate-spin" />} إضافة
                </button>
                <button type="button" onClick={() => setShowAdd(false)}
                  className="flex-1 border py-2 rounded-lg text-sm font-medium hover:bg-muted">إلغاء</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {loading ? (
        <div className="flex justify-center py-12"><Loader2 className="w-8 h-8 animate-spin text-muted-foreground" /></div>
      ) : (
        <div className="bg-card rounded-xl border overflow-hidden">
          <table className="data-table">
            <thead>
              <tr><th>المستخدم</th><th>الصلاحية</th><th>إجراءات</th></tr>
            </thead>
            <tbody>
              {users.map(u => (
                <tr key={u.user_id}>
                  <td>
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                        <span className="text-xs font-semibold text-primary">{u.full_name?.charAt(0) || '?'}</span>
                      </div>
                      <div>
                        <p className="font-medium text-sm">{u.full_name}</p>
                      </div>
                    </div>
                  </td>
                  <td>
                    <div className="flex items-center gap-2">
                      <Shield className="w-4 h-4 text-muted-foreground" />
                      <select value={u.role} onChange={e => handleRoleChange(u.user_id, e.target.value as AppRole)}
                        className="border rounded px-2 py-1 text-sm bg-background">
                        {Object.entries(roleLabels).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
                      </select>
                    </div>
                  </td>
                  <td>
                    <button onClick={() => handleDelete(u.user_id)}
                      disabled={u.role === 'admin'}
                      className="p-1.5 rounded-md hover:bg-destructive/10 text-destructive disabled:opacity-30 disabled:cursor-not-allowed"
                      title={u.role === 'admin' ? 'لا يمكن حذف الأدمن' : 'حذف'}>
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default UsersManagement;
