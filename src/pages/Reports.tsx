import { useState } from 'react';
import { BarChart3, Download, Printer, Mail, MessageCircle, X } from 'lucide-react';
import {
  PieChart, Pie, Cell, LineChart, Line, BarChart, Bar, AreaChart, Area,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from 'recharts';

const COLORS = ['#06D6A0', '#7B2FF7', '#FF6B8A', '#FFD166', '#4ECDC4', '#FF8A5C'];

const reportDefinitions = [
  {
    name: 'تقرير استهلاك قطع الغيار', category: 'المستودعات', period: 'شهري', lastGenerated: '2026-02-20',
    chartType: 'bar' as const,
    data: [
      { name: 'إطارات بريدجستون', value: 85 }, { name: 'فلاتر زيت', value: 220 }, { name: 'زيوت موبيل', value: 185 },
      { name: 'بطاريات فارتا', value: 24 }, { name: 'فرامل', value: 48 }, { name: 'كهرباء', value: 65 },
    ],
  },
  {
    name: 'تكلفة الصيانة حسب الشاحنة', category: 'الصيانة', period: 'شهري', lastGenerated: '2026-02-19',
    chartType: 'line' as const,
    data: [
      { name: 'فولفو FH16', value: 42500 }, { name: 'مرسيدس أكتروس', value: 58000 }, { name: 'مان TGX', value: 28500 },
      { name: 'سكانيا R450', value: 65000 }, { name: 'إيسوزو FVR', value: 15000 },
    ],
  },
  {
    name: 'أداء الموردين', category: 'المشتريات', period: 'ربع سنوي', lastGenerated: '2026-02-01',
    chartType: 'bar' as const,
    data: [
      { name: 'بريدجستون', value: 96 }, { name: 'موبيل', value: 94 },
      { name: 'قطع غيار أصلية', value: 82 }, { name: 'فلاتر مان', value: 93 },
    ],
  },
  {
    name: 'تقرير الكفرات (عمر/تكلفة/كم)', category: 'الأسطول', period: 'شهري', lastGenerated: '2026-02-20',
    chartType: 'pie' as const,
    data: [
      { name: 'جديد', value: 64 }, { name: 'جيد', value: 148 }, { name: 'يحتاج تبديل', value: 32 }, { name: 'تالف', value: 8 },
    ],
  },
  {
    name: 'مستويات المخزون والتنبيهات', category: 'المستودعات', period: 'أسبوعي', lastGenerated: '2026-02-20',
    chartType: 'area' as const,
    data: [
      { name: 'الأسبوع 1', value: 1450, min: 500 }, { name: 'الأسبوع 2', value: 1280, min: 500 },
      { name: 'الأسبوع 3', value: 1620, min: 500 }, { name: 'الأسبوع 4', value: 1410, min: 500 },
    ],
  },
  {
    name: 'تقرير المدفوعات والمستحقات', category: 'المالية', period: 'شهري', lastGenerated: '2026-02-20',
    chartType: 'bar' as const,
    data: [
      { name: 'يناير', paid: 385000, due: 125000 }, { name: 'فبراير', paid: 462000, due: 88000 },
      { name: 'مارس', paid: 295000, due: 215000 },
    ],
  },
  {
    name: 'تقرير أداء السائقين', category: 'السائقين', period: 'شهري', lastGenerated: '2026-02-19',
    chartType: 'bar' as const,
    data: [
      { name: 'محمد الغامدي', value: 92 }, { name: 'خالد العمري', value: 95 },
      { name: 'فهد السالم', value: 88 }, { name: 'سعد الحربي', value: 96 },
      { name: 'أحمد المالكي', value: 91 }, { name: 'ناصر القحطاني', value: 94 },
    ],
  },
  {
    name: 'تقرير الرحلات والكيلومترات', category: 'الأسطول', period: 'أسبوعي', lastGenerated: '2026-02-20',
    chartType: 'line' as const,
    data: [
      { name: 'الأسبوع 1', value: 52500 }, { name: 'الأسبوع 2', value: 65800 },
      { name: 'الأسبوع 3', value: 41200 }, { name: 'الأسبوع 4', value: 78500 },
    ],
  },
];

const categories = ['الكل', 'المشتريات', 'الأسطول', 'الصيانة', 'المستودعات', 'المالية', 'السائقين'];

const Reports = () => {
  const [activeCategory, setActiveCategory] = useState('الكل');
  const [viewingReport, setViewingReport] = useState<number | null>(null);

  const filtered = activeCategory === 'الكل'
    ? reportDefinitions
    : reportDefinitions.filter(r => r.category === activeCategory);

  const renderChart = (report: typeof reportDefinitions[0]) => {
    switch (report.chartType) {
      case 'pie':
        return (
          <PieChart>
            <Pie data={report.data} cx="50%" cy="50%" innerRadius={50} outerRadius={80} dataKey="value"
              label={({ name, percent }) => `${name} ${(percent! * 100).toFixed(0)}%`}>
              {report.data.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
            </Pie>
            <Tooltip /><Legend />
          </PieChart>
        );
      case 'line':
        return (
          <LineChart data={report.data}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis dataKey="name" tick={{ fontSize: 11 }} /><YAxis tick={{ fontSize: 11 }} />
            <Tooltip /><Line type="monotone" dataKey="value" stroke="hsl(var(--primary))" strokeWidth={3} dot={{ fill: 'hsl(var(--primary))', r: 5 }} />
          </LineChart>
        );
      case 'area':
        return (
          <AreaChart data={report.data}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis dataKey="name" tick={{ fontSize: 11 }} /><YAxis tick={{ fontSize: 11 }} />
            <Tooltip />
            <Area type="monotone" dataKey="value" fill="#4ECDC4" fillOpacity={0.3} stroke="#4ECDC4" strokeWidth={2} />
            {'min' in (report.data[0] || {}) && <Area type="monotone" dataKey="min" fill="#FF6B8A" fillOpacity={0.1} stroke="#FF6B8A" strokeWidth={1} strokeDasharray="5 5" />}
          </AreaChart>
        );
      default:
        return (
          <BarChart data={report.data}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis dataKey="name" tick={{ fontSize: 11 }} /><YAxis tick={{ fontSize: 11 }} />
            <Tooltip />
            {'paid' in (report.data[0] || {}) ? (
              <>
                <Bar dataKey="paid" name="مدفوع" fill="#06D6A0" radius={[4, 4, 0, 0]} />
                <Bar dataKey="due" name="مستحق" fill="#FF6B8A" radius={[4, 4, 0, 0]} />
                <Legend />
              </>
            ) : (
              <Bar dataKey="value" radius={[6, 6, 0, 0]}>
                {report.data.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
              </Bar>
            )}
          </BarChart>
        );
    }
  };

  const shareWhatsApp = (name: string) => {
    const text = encodeURIComponent(`تقرير: ${name}\nتم إنشاؤه من نظام مسار الخدمات اللوجستية`);
    window.open(`https://wa.me/?text=${text}`, '_blank');
  };

  const shareEmail = (name: string) => {
    const subject = encodeURIComponent(`تقرير: ${name}`);
    const body = encodeURIComponent(`مرفق تقرير ${name}\nتم إنشاؤه من نظام مسار الخدمات اللوجستية`);
    window.open(`mailto:?subject=${subject}&body=${body}`, '_blank');
  };

  return (
    <div className="space-y-6">
      <div className="page-header">
        <h1 className="page-title">التقارير</h1>
        <p className="page-subtitle">تقارير تشغيلية وإدارية شاملة</p>
      </div>

      <div className="flex gap-2 overflow-x-auto pb-2">
        {categories.map(cat => (
          <button key={cat} onClick={() => setActiveCategory(cat)}
            className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap border transition-colors
              ${activeCategory === cat ? 'bg-primary text-primary-foreground border-primary' : 'bg-card text-muted-foreground border-border hover:bg-muted'}`}>
            {cat}
          </button>
        ))}
      </div>

      {viewingReport !== null && (
        <div className="fixed inset-0 bg-foreground/50 z-50 flex items-center justify-center p-4" onClick={() => setViewingReport(null)}>
          <div className="bg-card rounded-2xl border shadow-xl w-full max-w-2xl p-6" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold font-heading">{reportDefinitions[viewingReport].name}</h3>
              <button onClick={() => setViewingReport(null)} className="p-1 rounded hover:bg-muted"><X className="w-5 h-5" /></button>
            </div>
            <div className="flex items-center gap-2 mb-4">
              <span className="badge-status bg-muted text-muted-foreground">{reportDefinitions[viewingReport].category}</span>
              <span className="text-xs text-muted-foreground">{reportDefinitions[viewingReport].period}</span>
            </div>
            <ResponsiveContainer width="100%" height={350}>
              {renderChart(reportDefinitions[viewingReport])}
            </ResponsiveContainer>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filtered.map((report, i) => {
          const globalIdx = reportDefinitions.indexOf(report);
          return (
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
                <button onClick={() => setViewingReport(globalIdx)}
                  className="flex-1 flex items-center justify-center gap-1.5 py-2 text-sm rounded-lg bg-primary text-primary-foreground hover:opacity-90 font-medium">
                  <BarChart3 className="w-3.5 h-3.5" /> عرض
                </button>
                <button className="p-2 rounded-lg border hover:bg-muted" title="تحميل PDF"><Download className="w-4 h-4 text-muted-foreground" /></button>
                <button className="p-2 rounded-lg border hover:bg-muted" title="طباعة"><Printer className="w-4 h-4 text-muted-foreground" /></button>
                <button onClick={() => shareEmail(report.name)} className="p-2 rounded-lg border hover:bg-muted" title="إرسال بالإيميل"><Mail className="w-4 h-4 text-muted-foreground" /></button>
                <button onClick={() => shareWhatsApp(report.name)} className="p-2 rounded-lg border hover:bg-muted" title="مشاركة واتساب"><MessageCircle className="w-4 h-4 text-muted-foreground" /></button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Reports;
