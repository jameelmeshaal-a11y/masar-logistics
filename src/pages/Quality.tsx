import { Shield, CheckCircle2, XCircle, AlertTriangle, ClipboardCheck, Eye } from 'lucide-react';

const inspections = [
  { id: 'QC-001', truck: 'SH-001', type: 'فحص استلام', inspector: 'أحمد المالكي', date: '2024-03-15', result: 'مطابق', items: 12, passed: 12 },
  { id: 'QC-002', truck: 'SH-005', type: 'فحص بعد الصيانة', inspector: 'خالد الزهراني', date: '2024-03-14', result: 'مطابق جزئياً', items: 15, passed: 13 },
  { id: 'QC-003', truck: 'SH-012', type: 'فحص دوري', inspector: 'فهد العتيبي', date: '2024-03-13', result: 'غير مطابق', items: 20, passed: 14 },
  { id: 'QC-004', truck: 'SH-034', type: 'فحص استلام مواد', inspector: 'سعد القحطاني', date: '2024-03-12', result: 'مطابق', items: 8, passed: 8 },
];

const vendorQuality = [
  { vendor: 'شركة الإطارات المتقدمة', orders: 25, onTime: 23, qualityRate: 96, priceRate: 88 },
  { vendor: 'مؤسسة قطع الغيار', orders: 18, onTime: 14, qualityRate: 82, priceRate: 90 },
  { vendor: 'شركة الزيوت الوطنية', orders: 32, onTime: 30, qualityRate: 94, priceRate: 85 },
];

const resultStyle = (r: string) => {
  if (r === 'مطابق') return 'badge-active';
  if (r === 'مطابق جزئياً') return 'badge-pending';
  return 'badge-inactive';
};

const Quality = () => {
  return (
    <div className="space-y-6">
      <div className="page-header">
        <h1 className="page-title">إدارة الجودة</h1>
        <p className="page-subtitle">فحوصات الجودة وتقييم الموردين ومعايير الأداء</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="stat-card">
          <div className="w-10 h-10 rounded-lg bg-success/10 flex items-center justify-center mb-3"><CheckCircle2 className="w-5 h-5 text-success" /></div>
          <p className="text-2xl font-bold font-heading">91%</p><p className="text-sm text-muted-foreground">نسبة المطابقة</p>
        </div>
        <div className="stat-card">
          <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center mb-3"><ClipboardCheck className="w-5 h-5 text-accent" /></div>
          <p className="text-2xl font-bold font-heading">{inspections.length}</p><p className="text-sm text-muted-foreground">فحوصات هذا الشهر</p>
        </div>
        <div className="stat-card">
          <div className="w-10 h-10 rounded-lg bg-warning/10 flex items-center justify-center mb-3"><AlertTriangle className="w-5 h-5 text-warning" /></div>
          <p className="text-2xl font-bold font-heading">1</p><p className="text-sm text-muted-foreground">ملاحظات مفتوحة</p>
        </div>
        <div className="stat-card">
          <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mb-3"><Shield className="w-5 h-5 text-primary" /></div>
          <p className="text-2xl font-bold font-heading">3</p><p className="text-sm text-muted-foreground">موردين مقيمين</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-card rounded-xl border p-5">
          <h2 className="text-lg font-bold font-heading mb-4">سجل الفحوصات</h2>
          <div className="overflow-x-auto">
            <table className="data-table">
              <thead><tr><th>الرقم</th><th>الشاحنة</th><th>النوع</th><th>الفاحص</th><th>النتيجة</th><th>البنود</th></tr></thead>
              <tbody>
                {inspections.map(i => (
                  <tr key={i.id}>
                    <td className="font-medium text-primary">{i.id}</td>
                    <td>{i.truck}</td>
                    <td>{i.type}</td>
                    <td>{i.inspector}</td>
                    <td><span className={`badge-status ${resultStyle(i.result)}`}>{i.result}</span></td>
                    <td>{i.passed}/{i.items}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="bg-card rounded-xl border p-5">
          <h2 className="text-lg font-bold font-heading mb-4">تقييم الموردين</h2>
          <div className="space-y-4">
            {vendorQuality.map((v, i) => (
              <div key={i} className="p-4 rounded-lg bg-muted/30">
                <p className="font-semibold text-sm mb-3">{v.vendor}</p>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <p className="text-muted-foreground text-xs">الالتزام بالتوريد</p>
                    <div className="flex items-center gap-2 mt-1">
                      <div className="flex-1 h-2 rounded-full bg-muted"><div className="h-full rounded-full bg-success" style={{width: `${(v.onTime/v.orders)*100}%`}} /></div>
                      <span className="text-xs font-medium">{Math.round((v.onTime/v.orders)*100)}%</span>
                    </div>
                  </div>
                  <div>
                    <p className="text-muted-foreground text-xs">جودة المنتجات</p>
                    <div className="flex items-center gap-2 mt-1">
                      <div className="flex-1 h-2 rounded-full bg-muted"><div className="h-full rounded-full bg-info" style={{width: `${v.qualityRate}%`}} /></div>
                      <span className="text-xs font-medium">{v.qualityRate}%</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Quality;
