import { Link } from 'react-router-dom';
import {
  Truck, ShoppingCart, Wrench, Warehouse, Users, MapPin,
  Shield, DollarSign, BarChart3, TrendingUp, TrendingDown,
  AlertTriangle, CheckCircle2, Clock, Package, Fuel
} from 'lucide-react';

const stats = [
  { label: 'إجمالي الشاحنات', value: '48', change: '+3', up: true, icon: Truck, color: 'bg-primary/10 text-primary' },
  { label: 'أوامر شراء نشطة', value: '12', change: '+5', up: true, icon: ShoppingCart, color: 'bg-accent/10 text-accent' },
  { label: 'أوامر صيانة مفتوحة', value: '7', change: '-2', up: false, icon: Wrench, color: 'bg-info/10 text-info' },
  { label: 'تنبيهات المخزون', value: '4', change: '+1', up: true, icon: AlertTriangle, color: 'bg-warning/10 text-warning' },
];

const recentOrders = [
  { id: 'PO-2024-0142', vendor: 'شركة الإطارات المتقدمة', amount: '45,000 ر.س', status: 'معتمد', statusClass: 'badge-active' },
  { id: 'PO-2024-0141', vendor: 'مؤسسة قطع الغيار', amount: '12,800 ر.س', status: 'قيد المراجعة', statusClass: 'badge-pending' },
  { id: 'PO-2024-0140', vendor: 'شركة الزيوت الوطنية', amount: '8,500 ر.س', status: 'تم التوريد', statusClass: 'badge-active' },
  { id: 'PO-2024-0139', vendor: 'مصنع الفلاتر', amount: '3,200 ر.س', status: 'ملغي', statusClass: 'badge-inactive' },
];

const maintenanceAlerts = [
  { truck: 'شاحنة SH-012', type: 'صيانة دورية', due: 'اليوم', priority: 'عاجل' },
  { truck: 'شاحنة SH-005', type: 'تغيير زيت', due: 'غداً', priority: 'متوسط' },
  { truck: 'شاحنة SH-023', type: 'فحص كفرات', due: 'بعد 3 أيام', priority: 'عادي' },
];

const quickLinks = [
  { label: 'إدارة المشتريات', path: '/procurement', icon: ShoppingCart, desc: 'طلبات وأوامر الشراء' },
  { label: 'إدارة الأسطول', path: '/fleet', icon: Truck, desc: 'الشاحنات والكفرات' },
  { label: 'الصيانة والورشة', path: '/maintenance', icon: Wrench, desc: 'أوامر العمل والصيانة' },
  { label: 'المستودعات', path: '/warehouse', icon: Warehouse, desc: 'المخزون والأصناف' },
  { label: 'السائقين', path: '/drivers', icon: Users, desc: 'بيانات السائقين' },
  { label: 'التتبع والمراقبة', path: '/tracking', icon: MapPin, desc: 'تتبع المركبات' },
  { label: 'الجودة', path: '/quality', icon: Shield, desc: 'معايير الجودة' },
  { label: 'الإدارة المالية', path: '/finance', icon: DollarSign, desc: 'المدفوعات والأرصدة' },
  { label: 'التقارير', path: '/reports', icon: BarChart3, desc: 'التقارير والإحصائيات' },
];

const Dashboard = () => {
  return (
    <div className="space-y-6">
      <div className="page-header">
        <h1 className="page-title">لوحة التحكم</h1>
        <p className="page-subtitle">نظرة عامة على العمليات والأداء</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <div key={stat.label} className="stat-card">
            <div className="flex items-center justify-between mb-3">
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${stat.color}`}>
                <stat.icon className="w-5 h-5" />
              </div>
              <div className={`flex items-center gap-1 text-xs font-medium ${stat.up ? 'text-success' : 'text-destructive'}`}>
                {stat.up ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                {stat.change}
              </div>
            </div>
            <p className="text-2xl font-bold text-foreground font-heading">{stat.value}</p>
            <p className="text-sm text-muted-foreground mt-1">{stat.label}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Purchase Orders */}
        <div className="lg:col-span-2 bg-card rounded-xl border p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold font-heading">أحدث أوامر الشراء</h2>
            <Link to="/procurement/orders" className="text-sm text-accent hover:underline">عرض الكل</Link>
          </div>
          <div className="overflow-x-auto">
            <table className="data-table">
              <thead>
                <tr>
                  <th>رقم الأمر</th>
                  <th>المورد</th>
                  <th>المبلغ</th>
                  <th>الحالة</th>
                </tr>
              </thead>
              <tbody>
                {recentOrders.map((order) => (
                  <tr key={order.id}>
                    <td className="font-medium">{order.id}</td>
                    <td>{order.vendor}</td>
                    <td>{order.amount}</td>
                    <td><span className={`badge-status ${order.statusClass}`}>{order.status}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Maintenance Alerts */}
        <div className="bg-card rounded-xl border p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold font-heading">تنبيهات الصيانة</h2>
            <Link to="/maintenance" className="text-sm text-accent hover:underline">عرض الكل</Link>
          </div>
          <div className="space-y-3">
            {maintenanceAlerts.map((alert, i) => (
              <div key={i} className="flex items-start gap-3 p-3 rounded-lg bg-muted/30">
                <div className={`w-2 h-2 rounded-full mt-2 shrink-0 ${
                  alert.priority === 'عاجل' ? 'bg-destructive' : 
                  alert.priority === 'متوسط' ? 'bg-warning' : 'bg-info'
                }`} />
                <div>
                  <p className="text-sm font-medium">{alert.truck}</p>
                  <p className="text-xs text-muted-foreground">{alert.type}</p>
                  <div className="flex items-center gap-1 mt-1 text-xs text-muted-foreground">
                    <Clock className="w-3 h-3" />
                    {alert.due}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Links */}
      <div>
        <h2 className="text-lg font-bold font-heading mb-4">الوصول السريع</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          {quickLinks.map((link) => (
            <Link key={link.path} to={link.path} className="module-card text-center group">
              <div className="w-12 h-12 mx-auto rounded-xl bg-primary/5 flex items-center justify-center mb-3 group-hover:bg-accent/10 transition-colors">
                <link.icon className="w-6 h-6 text-primary group-hover:text-accent transition-colors" />
              </div>
              <p className="text-sm font-semibold">{link.label}</p>
              <p className="text-xs text-muted-foreground mt-1">{link.desc}</p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
