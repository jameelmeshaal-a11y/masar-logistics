import { useState, useEffect } from 'react';
import { DollarSign, TrendingUp, TrendingDown, CreditCard, Wallet, Eye, Send, Plus, Printer, Loader2, X } from 'lucide-react';
import FormDialog, { FormField } from '@/components/FormDialog';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

const statusStyle = (s: string) => s === 'completed' || s === 'مكتمل' ? 'badge-active' : 'badge-pending';
const statusLabels: Record<string, string> = { pending: 'معلق', completed: 'مكتمل' };

const paymentFields: FormField[] = [
  { name: 'vendor', label: 'المورد', type: 'text', required: true },
  { name: 'invoice', label: 'رقم الفاتورة', type: 'text' },
  { name: 'amount', label: 'المبلغ (ر.س)', type: 'number', required: true },
  { name: 'method', label: 'طريقة الدفع', type: 'select', required: true, options: [
    { value: 'bank_transfer', label: 'تحويل بنكي' }, { value: 'check', label: 'شيك' }, { value: 'cash', label: 'نقدي' },
  ]},
];

const methodLabels: Record<string, string> = { bank_transfer: 'تحويل بنكي', check: 'شيك', cash: 'نقدي' };

// Print statement modal
const StatementModal = ({ open, onClose, vendor, payments }: { open: boolean; onClose: () => void; vendor: string; payments: any[] }) => {
  if (!open) return null;
  const vendorPayments = payments.filter(p => p.vendor_id === vendor || true); // show all for now
  const handlePrint = () => window.print();

  return (
    <div className="fixed inset-0 bg-foreground/50 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-card rounded-2xl border shadow-xl w-full max-w-2xl p-6 max-h-[90vh] overflow-y-auto print:shadow-none print:border-none" onClick={e => e.stopPropagation()} id="statement-print">
        <div className="flex items-center justify-between mb-5 print:hidden">
          <h3 className="text-lg font-bold font-heading">كشف حساب مورد</h3>
          <div className="flex gap-2">
            <button onClick={handlePrint} className="flex items-center gap-2 px-3 py-2 bg-primary text-primary-foreground rounded-lg text-sm"><Printer className="w-4 h-4" /> طباعة</button>
            <button onClick={onClose} className="p-1 rounded hover:bg-muted"><X className="w-5 h-5" /></button>
          </div>
        </div>
        <div className="text-center mb-6">
          <h2 className="text-xl font-bold">كشف حساب</h2>
          <p className="text-muted-foreground text-sm mt-1">تاريخ الإصدار: {new Date().toLocaleDateString('ar-SA')}</p>
        </div>
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr className="border-b"><th className="py-2 text-right">رقم الدفعة</th><th className="py-2 text-right">المبلغ</th><th className="py-2 text-right">الطريقة</th><th className="py-2 text-right">الحالة</th><th className="py-2 text-right">التاريخ</th></tr>
          </thead>
          <tbody>
            {payments.map(p => (
              <tr key={p.id} className="border-b">
                <td className="py-2">{p.payment_number}</td>
                <td className="py-2 font-semibold">{p.amount?.toLocaleString()} ر.س</td>
                <td className="py-2">{methodLabels[p.method] || p.method}</td>
                <td className="py-2">{statusLabels[p.status] || p.status}</td>
                <td className="py-2 text-muted-foreground">{new Date(p.created_at).toLocaleDateString('ar-SA')}</td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr className="font-bold border-t-2">
              <td className="py-3">الإجمالي</td>
              <td className="py-3">{payments.reduce((s, p) => s + (p.amount || 0), 0).toLocaleString()} ر.س</td>
              <td colSpan={3}></td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
};

const Finance = () => {
  const [tab, setTab] = useState<'payments' | 'balances'>('payments');
  const [showForm, setShowForm] = useState(false);
  const [showStatement, setShowStatement] = useState(false);
  const [payments, setPayments] = useState<any[]>([]);
  const [vendors, setVendors] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const fetchData = async () => {
    setLoading(true);
    const [payRes, vendorRes] = await Promise.all([
      supabase.from('payments').select('*').order('created_at', { ascending: false }),
      supabase.from('vendors').select('*').order('name'),
    ]);
    if (payRes.data) setPayments(payRes.data);
    if (vendorRes.data) setVendors(vendorRes.data);
    setLoading(false);
  };

  useEffect(() => { fetchData(); }, []);

  const handleAdd = async (data: Record<string, string>) => {
    const payNum = `PAY-${Date.now().toString().slice(-6)}`;
    const { error } = await supabase.from('payments').insert({
      payment_number: payNum, amount: parseFloat(data.amount), method: data.method,
    });
    if (error) throw new Error(error.message);
    toast({ title: 'تم', description: 'تم تسجيل الدفعة بنجاح' });
    fetchData();
  };

  const totalPaid = payments.filter(p => p.status === 'completed').reduce((s, p) => s + (p.amount || 0), 0);
  const totalPending = payments.filter(p => p.status === 'pending').reduce((s, p) => s + (p.amount || 0), 0);

  return (
    <div className="space-y-6">
      <FormDialog open={showForm} onClose={() => setShowForm(false)} title="تسجيل دفعة جديدة" fields={paymentFields} onSubmit={handleAdd} />
      <StatementModal open={showStatement} onClose={() => setShowStatement(false)} vendor="" payments={payments} />

      <div className="page-header flex items-center justify-between">
        <div><h1 className="page-title">الإدارة المالية</h1><p className="page-subtitle">المدفوعات والأرصدة والسداد وتتبع الالتزامات</p></div>
        <div className="flex gap-2">
          <button onClick={() => setShowStatement(true)} className="flex items-center gap-2 border px-4 py-2.5 rounded-lg text-sm font-medium hover:bg-muted"><Printer className="w-4 h-4" /> كشف حساب</button>
          <button onClick={() => setShowForm(true)} className="flex items-center gap-2 bg-accent text-accent-foreground px-4 py-2.5 rounded-lg text-sm font-medium hover:opacity-90"><Plus className="w-4 h-4" /> تسجيل دفعة</button>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="stat-card"><div className="w-10 h-10 rounded-lg bg-success/10 flex items-center justify-center mb-3"><TrendingUp className="w-5 h-5 text-success" /></div><p className="text-2xl font-bold font-heading">{totalPaid.toLocaleString()}</p><p className="text-sm text-muted-foreground">إجمالي المدفوعات (ر.س)</p></div>
        <div className="stat-card"><div className="w-10 h-10 rounded-lg bg-warning/10 flex items-center justify-center mb-3"><Wallet className="w-5 h-5 text-warning" /></div><p className="text-2xl font-bold font-heading">{totalPending.toLocaleString()}</p><p className="text-sm text-muted-foreground">المستحقات المعلقة (ر.س)</p></div>
        <div className="stat-card"><div className="w-10 h-10 rounded-lg bg-destructive/10 flex items-center justify-center mb-3"><TrendingDown className="w-5 h-5 text-destructive" /></div><p className="text-2xl font-bold font-heading">{payments.filter(p => p.status === 'pending').length}</p><p className="text-sm text-muted-foreground">دفعات معلقة</p></div>
        <div className="stat-card"><div className="w-10 h-10 rounded-lg bg-info/10 flex items-center justify-center mb-3"><CreditCard className="w-5 h-5 text-info" /></div><p className="text-2xl font-bold font-heading">{vendors.length}</p><p className="text-sm text-muted-foreground">موردين</p></div>
      </div>

      <div className="flex gap-1 bg-muted/50 p-1 rounded-xl w-fit">
        <button onClick={() => setTab('payments')} className={`px-5 py-2 rounded-lg text-sm font-medium transition-all ${tab === 'payments' ? 'bg-card shadow-sm' : 'text-muted-foreground'}`}>المدفوعات</button>
        <button onClick={() => setTab('balances')} className={`px-5 py-2 rounded-lg text-sm font-medium transition-all ${tab === 'balances' ? 'bg-card shadow-sm' : 'text-muted-foreground'}`}>أرصدة الموردين</button>
      </div>

      {loading ? (
        <div className="flex justify-center py-12"><Loader2 className="w-8 h-8 animate-spin text-muted-foreground" /></div>
      ) : (
        <div className="bg-card rounded-xl border overflow-hidden">
          {tab === 'payments' ? (
            <div className="overflow-x-auto">
              <table className="data-table">
                <thead><tr><th>رقم الدفعة</th><th>المبلغ (ر.س)</th><th>طريقة الدفع</th><th>التاريخ</th><th>الحالة</th><th>إجراءات</th></tr></thead>
                <tbody>
                  {payments.map(p => (
                    <tr key={p.id}>
                      <td className="font-medium text-primary">{p.payment_number}</td>
                      <td className="font-semibold">{p.amount?.toLocaleString()}</td><td>{methodLabels[p.method] || p.method}</td>
                      <td className="text-muted-foreground text-xs">{new Date(p.created_at).toLocaleDateString('ar-SA')}</td>
                      <td><span className={`badge-status ${statusStyle(p.status)}`}>{statusLabels[p.status] || p.status}</span></td>
                      <td>
                        <div className="flex items-center gap-1">
                          <button className="p-1.5 rounded-md hover:bg-muted"><Eye className="w-4 h-4 text-muted-foreground" /></button>
                          {p.status === 'pending' && (
                            <button onClick={async () => {
                              await supabase.from('payments').update({ status: 'completed', paid_at: new Date().toISOString() }).eq('id', p.id);
                              toast({ title: 'تم', description: 'تم تأكيد الدفعة' }); fetchData();
                            }} className="px-2 py-1 text-xs bg-success/10 text-success rounded hover:bg-success/20">تأكيد الدفع</button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                  {payments.length === 0 && <tr><td colSpan={6} className="text-center py-8 text-muted-foreground">لا توجد مدفوعات</td></tr>}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="data-table">
                <thead><tr><th>المورد</th><th>الهاتف</th><th>الحالة</th><th>إجراءات</th></tr></thead>
                <tbody>
                  {vendors.map(v => (
                    <tr key={v.id}>
                      <td className="font-medium">{v.name}</td><td>{v.phone || '-'}</td>
                      <td><span className={`badge-status ${v.status === 'active' ? 'badge-active' : 'badge-inactive'}`}>{v.status === 'active' ? 'نشط' : 'غير نشط'}</span></td>
                      <td><button onClick={() => setShowStatement(true)} className="px-2 py-1 text-xs bg-primary/10 text-primary rounded hover:bg-primary/20 flex items-center gap-1"><Printer className="w-3 h-3" /> كشف حساب</button></td>
                    </tr>
                  ))}
                  {vendors.length === 0 && <tr><td colSpan={4} className="text-center py-8 text-muted-foreground">لا يوجد موردين</td></tr>}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Finance;
