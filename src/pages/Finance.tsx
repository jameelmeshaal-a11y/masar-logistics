import { useState } from 'react';
import { DollarSign, TrendingUp, TrendingDown, CreditCard, Wallet, Eye, Download, Send } from 'lucide-react';

const payments = [
  { id: 'PAY-001', vendor: 'شركة الإطارات المتقدمة', invoice: 'INV-001', amount: '51,750', method: 'تحويل بنكي', date: '2024-03-15', status: 'مكتمل' },
  { id: 'PAY-002', vendor: 'مؤسسة قطع الغيار', invoice: 'INV-002', amount: '7,360', method: 'شيك', date: '2024-03-14', status: 'معلق' },
  { id: 'PAY-003', vendor: 'شركة الزيوت الوطنية', invoice: 'INV-003', amount: '5,000', method: 'تحويل بنكي', date: '2024-03-13', status: 'مكتمل' },
];

const balances = [
  { vendor: 'شركة الإطارات المتقدمة', total: '120,000', paid: '95,000', remaining: '25,000', dueDate: '2024-04-15' },
  { vendor: 'مؤسسة قطع الغيار', total: '45,000', paid: '30,640', remaining: '14,360', dueDate: '2024-03-30' },
  { vendor: 'شركة الزيوت الوطنية', total: '35,000', paid: '30,225', remaining: '4,775', dueDate: '2024-04-01' },
];

const statusStyle = (s: string) => s === 'مكتمل' ? 'badge-active' : 'badge-pending';

const Finance = () => {
  const [tab, setTab] = useState<'payments' | 'balances'>('payments');

  return (
    <div className="space-y-6">
      <div className="page-header">
        <h1 className="page-title">الإدارة المالية</h1>
        <p className="page-subtitle">المدفوعات والأرصدة والسداد وتتبع الالتزامات</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="stat-card">
          <div className="w-10 h-10 rounded-lg bg-success/10 flex items-center justify-center mb-3"><TrendingUp className="w-5 h-5 text-success" /></div>
          <p className="text-2xl font-bold font-heading">155,865</p><p className="text-sm text-muted-foreground">إجمالي المدفوعات (ر.س)</p>
        </div>
        <div className="stat-card">
          <div className="w-10 h-10 rounded-lg bg-warning/10 flex items-center justify-center mb-3"><Wallet className="w-5 h-5 text-warning" /></div>
          <p className="text-2xl font-bold font-heading">44,135</p><p className="text-sm text-muted-foreground">المستحقات المتبقية (ر.س)</p>
        </div>
        <div className="stat-card">
          <div className="w-10 h-10 rounded-lg bg-destructive/10 flex items-center justify-center mb-3"><TrendingDown className="w-5 h-5 text-destructive" /></div>
          <p className="text-2xl font-bold font-heading">1</p><p className="text-sm text-muted-foreground">مدفوعات متأخرة</p>
        </div>
        <div className="stat-card">
          <div className="w-10 h-10 rounded-lg bg-info/10 flex items-center justify-center mb-3"><CreditCard className="w-5 h-5 text-info" /></div>
          <p className="text-2xl font-bold font-heading">3</p><p className="text-sm text-muted-foreground">موردين نشطين</p>
        </div>
      </div>

      <div className="flex gap-1 bg-muted/50 p-1 rounded-xl w-fit">
        <button onClick={() => setTab('payments')} className={`px-5 py-2 rounded-lg text-sm font-medium transition-all ${tab === 'payments' ? 'bg-card shadow-sm' : 'text-muted-foreground'}`}>المدفوعات</button>
        <button onClick={() => setTab('balances')} className={`px-5 py-2 rounded-lg text-sm font-medium transition-all ${tab === 'balances' ? 'bg-card shadow-sm' : 'text-muted-foreground'}`}>أرصدة الموردين</button>
      </div>

      <div className="bg-card rounded-xl border overflow-hidden">
        {tab === 'payments' ? (
          <div className="overflow-x-auto">
            <table className="data-table">
              <thead><tr><th>رقم الدفعة</th><th>المورد</th><th>رقم الفاتورة</th><th>المبلغ (ر.س)</th><th>طريقة الدفع</th><th>التاريخ</th><th>الحالة</th><th>إجراءات</th></tr></thead>
              <tbody>
                {payments.map(p => (
                  <tr key={p.id}>
                    <td className="font-medium text-primary">{p.id}</td>
                    <td>{p.vendor}</td>
                    <td>{p.invoice}</td>
                    <td className="font-semibold">{p.amount}</td>
                    <td>{p.method}</td>
                    <td className="text-muted-foreground">{p.date}</td>
                    <td><span className={`badge-status ${statusStyle(p.status)}`}>{p.status}</span></td>
                    <td>
                      <div className="flex items-center gap-1">
                        <button className="p-1.5 rounded-md hover:bg-muted"><Eye className="w-4 h-4 text-muted-foreground" /></button>
                        <button className="p-1.5 rounded-md hover:bg-muted"><Send className="w-4 h-4 text-muted-foreground" /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="data-table">
              <thead><tr><th>المورد</th><th>إجمالي المستحقات</th><th>المدفوع</th><th>المتبقي</th><th>تاريخ الاستحقاق</th><th>الحالة</th></tr></thead>
              <tbody>
                {balances.map((b, i) => (
                  <tr key={i}>
                    <td className="font-medium">{b.vendor}</td>
                    <td>{b.total} ر.س</td>
                    <td className="text-success">{b.paid} ر.س</td>
                    <td className="font-semibold text-destructive">{b.remaining} ر.س</td>
                    <td>{b.dueDate}</td>
                    <td>
                      <div className="w-full h-2 rounded-full bg-muted">
                        <div className="h-full rounded-full bg-success" style={{width: `${(parseInt(b.paid.replace(',','')) / parseInt(b.total.replace(',',''))) * 100}%`}} />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default Finance;
