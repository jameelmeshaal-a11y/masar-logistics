import { useState } from 'react';
import { Plus, Search, Filter, Wrench, Clock, CheckCircle2, AlertTriangle, Eye, Edit } from 'lucide-react';

const workOrders = [
  { id: 'WO-001', truck: 'SH-005', type: 'صيانة دورية', desc: 'تغيير زيت وفلاتر', priority: 'عاجل', status: 'قيد التنفيذ', assigned: 'ورشة 1', date: '2024-03-15', parts: 3 },
  { id: 'WO-002', truck: 'SH-012', type: 'إصلاح', desc: 'إصلاح نظام الفرامل', priority: 'عاجل', status: 'بانتظار القطع', assigned: 'ورشة 2', date: '2024-03-14', parts: 5 },
  { id: 'WO-003', truck: 'SH-023', type: 'فحص', desc: 'فحص شامل للمحرك', priority: 'متوسط', status: 'مجدول', assigned: 'ورشة 1', date: '2024-03-16', parts: 0 },
  { id: 'WO-004', truck: 'SH-001', type: 'كفرات', desc: 'تبديل كفرات أمامية', priority: 'عادي', status: 'مكتمل', assigned: 'ورشة 3', date: '2024-03-13', parts: 2 },
  { id: 'WO-005', truck: 'SH-034', type: 'صيانة دورية', desc: 'صيانة 50,000 كم', priority: 'متوسط', status: 'قيد التنفيذ', assigned: 'ورشة 1', date: '2024-03-15', parts: 8 },
];

const stats = [
  { label: 'أوامر مفتوحة', value: '7', icon: Wrench, color: 'bg-accent/10 text-accent' },
  { label: 'قيد التنفيذ', value: '3', icon: Clock, color: 'bg-info/10 text-info' },
  { label: 'مكتملة هذا الشهر', value: '15', icon: CheckCircle2, color: 'bg-success/10 text-success' },
  { label: 'بانتظار القطع', value: '2', icon: AlertTriangle, color: 'bg-warning/10 text-warning' },
];

const statusStyle = (s: string) => {
  if (['مكتمل'].includes(s)) return 'badge-active';
  if (['قيد التنفيذ', 'مجدول'].includes(s)) return 'badge-pending';
  return 'badge-inactive';
};

const priorityStyle = (p: string) => {
  if (p === 'عاجل') return 'text-destructive bg-destructive/10';
  if (p === 'متوسط') return 'text-warning bg-warning/10';
  return 'text-info bg-info/10';
};

const Maintenance = () => {
  return (
    <div className="space-y-6">
      <div className="page-header flex items-center justify-between">
        <div>
          <h1 className="page-title">الصيانة والورشة</h1>
          <p className="page-subtitle">إدارة أوامر العمل والصيانة الدورية والإصلاحات</p>
        </div>
        <button className="flex items-center gap-2 bg-accent text-accent-foreground px-4 py-2.5 rounded-lg text-sm font-medium hover:opacity-90">
          <Plus className="w-4 h-4" />
          أمر عمل جديد
        </button>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map(s => (
          <div key={s.label} className="stat-card">
            <div className={`w-10 h-10 rounded-lg flex items-center justify-center mb-3 ${s.color}`}>
              <s.icon className="w-5 h-5" />
            </div>
            <p className="text-2xl font-bold font-heading">{s.value}</p>
            <p className="text-sm text-muted-foreground">{s.label}</p>
          </div>
        ))}
      </div>

      <div className="flex items-center gap-3 flex-wrap">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input type="text" placeholder="بحث في أوامر العمل..." className="w-full bg-card border rounded-lg pr-10 pl-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20" />
        </div>
        <button className="flex items-center gap-2 px-3 py-2 border rounded-lg text-sm text-muted-foreground hover:bg-muted transition-colors">
          <Filter className="w-4 h-4" /> تصفية
        </button>
      </div>

      <div className="bg-card rounded-xl border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="data-table">
            <thead>
              <tr>
                <th>رقم الأمر</th><th>الشاحنة</th><th>النوع</th><th>الوصف</th><th>الأولوية</th><th>الحالة</th><th>الورشة</th><th>القطع</th><th>التاريخ</th><th>إجراءات</th>
              </tr>
            </thead>
            <tbody>
              {workOrders.map(wo => (
                <tr key={wo.id}>
                  <td className="font-medium text-primary">{wo.id}</td>
                  <td className="font-medium">{wo.truck}</td>
                  <td>{wo.type}</td>
                  <td className="max-w-[200px] truncate">{wo.desc}</td>
                  <td><span className={`badge-status ${priorityStyle(wo.priority)}`}>{wo.priority}</span></td>
                  <td><span className={`badge-status ${statusStyle(wo.status)}`}>{wo.status}</span></td>
                  <td>{wo.assigned}</td>
                  <td>{wo.parts}</td>
                  <td className="text-muted-foreground">{wo.date}</td>
                  <td>
                    <div className="flex items-center gap-1">
                      <button className="p-1.5 rounded-md hover:bg-muted"><Eye className="w-4 h-4 text-muted-foreground" /></button>
                      <button className="p-1.5 rounded-md hover:bg-muted"><Edit className="w-4 h-4 text-muted-foreground" /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Maintenance;
