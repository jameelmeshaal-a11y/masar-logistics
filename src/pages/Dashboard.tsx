import { Link } from 'react-router-dom';
import {
  Truck, ShoppingCart, Wrench, Warehouse, Users, MapPin,
  Shield, DollarSign, BarChart3, TrendingUp, TrendingDown,
  AlertTriangle, Clock
} from 'lucide-react';
import {
  PieChart, Pie, Cell, LineChart, Line, BarChart, Bar, AreaChart, Area,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from 'recharts';

const stats = [
  { label: 'إجمالي الشاحنات', value: '48', change: '+3', up: true, icon: Truck, color: 'bg-primary/10 text-primary' },
  { label: 'أوامر شراء نشطة', value: '12', change: '+5', up: true, icon: ShoppingCart, color: 'bg-accent/10 text-accent' },
  { label: 'أوامر صيانة مفتوحة', value: '7', change: '-2', up: false, icon: Wrench, color: 'bg-info/10 text-info' },
  { label: 'تنبيهات المخزون', value: '4', change: '+1', up: true, icon: AlertTriangle, color: 'bg-warning/10 text-warning' },
];

const truckStatusData = [
  { name: 'نشط', value: 35, color: '#06D6A0' },
  { name: 'في الصيانة', value: 8, color: '#FFD166' },
  { name: 'متوقف', value: 5, color: '#FF6B8A' },
];

const maintenanceCostData = [
  { month: 'يناير', cost: 45000 }, { month: 'فبراير', cost: 38000 },
  { month: 'مارس', cost: 52000 }, { month: 'أبريل', cost: 41000 },
  { month: 'مايو', cost: 48000 }, { month: 'يونيو', cost: 35000 },
];

const vendorPerformanceData = [
  { name: 'الإطارات المتقدمة', score: 96, color: '#7B2FF7' },
  { name: 'قطع الغيار', score: 82, color: '#4ECDC4' },
  { name: 'الزيوت الوطنية', score: 94, color: '#FF8A5C' },
  { name: 'الفلاتر', score: 88, color: '#FFD166' },
  { name: 'البطاريات', score: 91, color: '#06D6A0' },
];

const inventoryMovementData = [
  { month: 'يناير', inbound: 120, outbound: 95 }, { month: 'فبراير', inbound: 98, outbound: 110 },
  { month: 'مارس', inbound: 145, outbound: 88 }, { month: 'أبريل', inbound: 110, outbound: 102 },
  { month: 'مايو', inbound: 130, outbound: 120 }, { month: 'يونيو', inbound: 115, outbound: 98 },
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

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Truck Status Pie Chart */}
        <div className="bg-card rounded-xl border p-5">
          <h2 className="text-lg font-bold font-heading mb-4">توزيع حالات الشاحنات</h2>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie data={truckStatusData} cx="50%" cy="50%" innerRadius={60} outerRadius={90} dataKey="value" label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}>
                {truckStatusData.map((entry, i) => <Cell key={i} fill={entry.color} />)}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Maintenance Cost Line Chart */}
        <div className="bg-card rounded-xl border p-5">
          <h2 className="text-lg font-bold font-heading mb-4">تكاليف الصيانة الشهرية (ر.س)</h2>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={maintenanceCostData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="month" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip formatter={(v: number) => `${v.toLocaleString()} ر.س`} />
              <Line type="monotone" dataKey="cost" stroke="#7B2FF7" strokeWidth={3} dot={{ fill: '#7B2FF7', r: 5 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Charts Row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Vendor Performance Bar Chart */}
        <div className="bg-card rounded-xl border p-5">
          <h2 className="text-lg font-bold font-heading mb-4">أداء الموردين</h2>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={vendorPerformanceData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="name" tick={{ fontSize: 11 }} />
              <YAxis domain={[0, 100]} tick={{ fontSize: 12 }} />
              <Tooltip formatter={(v: number) => `${v}%`} />
              <Bar dataKey="score" radius={[6, 6, 0, 0]}>
                {vendorPerformanceData.map((entry, i) => <Cell key={i} fill={entry.color} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Inventory Movement Area Chart */}
        <div className="bg-card rounded-xl border p-5">
          <h2 className="text-lg font-bold font-heading mb-4">حركة المخزون</h2>
          <ResponsiveContainer width="100%" height={250}>
            <AreaChart data={inventoryMovementData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="month" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip />
              <Legend />
              <Area type="monotone" dataKey="inbound" name="وارد" fill="#06D6A0" fillOpacity={0.3} stroke="#06D6A0" strokeWidth={2} />
              <Area type="monotone" dataKey="outbound" name="صادر" fill="#FFD166" fillOpacity={0.3} stroke="#FFD166" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
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
                  alert.priority === 'عاجل' ? 'bg-destructive' : alert.priority === 'متوسط' ? 'bg-warning' : 'bg-info'
                }`} />
                <div>
                  <p className="text-sm font-medium">{alert.truck}</p>
                  <p className="text-xs text-muted-foreground">{alert.type}</p>
                  <div className="flex items-center gap-1 mt-1 text-xs text-muted-foreground">
                    <Clock className="w-3 h-3" />{alert.due}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Links */}
        <div className="lg:col-span-2">
          <h2 className="text-lg font-bold font-heading mb-4">الوصول السريع</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
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
    </div>
  );
};

export default Dashboard;
