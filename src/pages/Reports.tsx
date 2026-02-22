import { BarChart3, Download, Send, Filter, Printer, Mail, MessageCircle } from 'lucide-react';

const reports = [
  { name: 'تقرير استهلاك قطع الغيار', category: 'المستودعات', period: 'شهري', lastGenerated: '2024-03-15' },
  { name: 'تكلفة الصيانة حسب الشاحنة', category: 'الصيانة', period: 'شهري', lastGenerated: '2024-03-14' },
  { name: 'أداء الموردين', category: 'المشتريات', period: 'ربع سنوي', lastGenerated: '2024-03-01' },
  { name: 'تقرير الكفرات (عمر/تكلفة/كم)', category: 'الأسطول', period: 'شهري', lastGenerated: '2024-03-15' },
  { name: 'مستويات المخزون والتنبيهات', category: 'المستودعات', period: 'أسبوعي', lastGenerated: '2024-03-15' },
  { name: 'تقرير المدفوعات والمستحقات', category: 'المالية', period: 'شهري', lastGenerated: '2024-03-15' },
  { name: 'تقرير أداء السائقين', category: 'السائقين', period: 'شهري', lastGenerated: '2024-03-14' },
  { name: 'تقرير الرحلات والكيلومترات', category: 'الأسطول', period: 'أسبوعي', lastGenerated: '2024-03-15' },
];

const categories = ['الكل', 'المشتريات', 'الأسطول', 'الصيانة', 'المستودعات', 'المالية', 'السائقين'];

const Reports = () => {
  return (
    <div className="space-y-6">
      <div className="page-header">
        <h1 className="page-title">التقارير</h1>
        <p className="page-subtitle">تقارير تشغيلية وإدارية شاملة مع إمكانية المشاركة</p>
      </div>

      <div className="flex gap-2 overflow-x-auto pb-2">
        {categories.map(cat => (
          <button key={cat} className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap border transition-colors
            ${cat === 'الكل' ? 'bg-primary text-primary-foreground border-primary' : 'bg-card text-muted-foreground border-border hover:bg-muted'}`}>
            {cat}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {reports.map((report, i) => (
          <div key={i} className="bg-card rounded-xl border p-5 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <BarChart3 className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="font-semibold text-sm">{report.name}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="badge-status bg-muted text-muted-foreground">{report.category}</span>
                    <span className="text-xs text-muted-foreground">{report.period}</span>
                  </div>
                </div>
              </div>
            </div>
            
            <p className="text-xs text-muted-foreground mb-4">آخر إنشاء: {report.lastGenerated}</p>

            <div className="flex items-center gap-2">
              <button className="flex-1 flex items-center justify-center gap-1.5 py-2 text-sm rounded-lg bg-primary text-primary-foreground hover:opacity-90 font-medium">
                <BarChart3 className="w-3.5 h-3.5" /> عرض
              </button>
              <button className="p-2 rounded-lg border hover:bg-muted" title="تحميل PDF">
                <Download className="w-4 h-4 text-muted-foreground" />
              </button>
              <button className="p-2 rounded-lg border hover:bg-muted" title="طباعة">
                <Printer className="w-4 h-4 text-muted-foreground" />
              </button>
              <button className="p-2 rounded-lg border hover:bg-muted" title="إرسال بالإيميل">
                <Mail className="w-4 h-4 text-muted-foreground" />
              </button>
              <button className="p-2 rounded-lg border hover:bg-muted" title="مشاركة واتساب">
                <MessageCircle className="w-4 h-4 text-muted-foreground" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Reports;
