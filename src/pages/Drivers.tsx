import { Plus, Search, Phone, Truck, Calendar, Eye, Edit, FileText } from 'lucide-react';

const drivers = [
  { id: 'DRV-001', name: 'محمد أحمد الغامدي', idNumber: '1098765432', license: 'رخصة نقل ثقيل', licenseExpiry: '2025-06-15', phone: '0551234567', truck: 'SH-001', status: 'نشط', totalKm: '45,200', trips: 128 },
  { id: 'DRV-002', name: 'خالد عبدالله العمري', idNumber: '1087654321', license: 'رخصة نقل ثقيل', licenseExpiry: '2024-12-20', phone: '0559876543', truck: 'SH-005', status: 'في إجازة', totalKm: '62,800', trips: 195 },
  { id: 'DRV-003', name: 'فهد سعد السالم', idNumber: '1076543210', license: 'رخصة نقل ثقيل', licenseExpiry: '2025-03-10', phone: '0555551234', truck: 'SH-012', status: 'نشط', totalKm: '38,100', trips: 112 },
  { id: 'DRV-004', name: 'سعد محمد الحربي', idNumber: '1065432109', license: 'رخصة نقل ثقيل', licenseExpiry: '2024-08-05', phone: '0553334455', truck: 'SH-034', status: 'نشط', totalKm: '71,500', trips: 230 },
  { id: 'DRV-005', name: 'عبدالله فهد الشهري', idNumber: '1054321098', license: 'رخصة نقل ثقيل', licenseExpiry: '2025-01-28', phone: '0557778899', truck: '-', status: 'غير معين', totalKm: '15,300', trips: 45 },
];

const statusStyle = (s: string) => {
  if (s === 'نشط') return 'badge-active';
  if (s === 'في إجازة') return 'badge-pending';
  return 'badge-inactive';
};

const Drivers = () => {
  return (
    <div className="space-y-6">
      <div className="page-header flex items-center justify-between">
        <div>
          <h1 className="page-title">إدارة السائقين</h1>
          <p className="page-subtitle">بيانات السائقين وربطهم بالشاحنات وتتبع الأداء</p>
        </div>
        <button className="flex items-center gap-2 bg-accent text-accent-foreground px-4 py-2.5 rounded-lg text-sm font-medium hover:opacity-90">
          <Plus className="w-4 h-4" />
          إضافة سائق
        </button>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="stat-card"><p className="text-2xl font-bold font-heading">{drivers.length}</p><p className="text-sm text-muted-foreground">إجمالي السائقين</p></div>
        <div className="stat-card"><p className="text-2xl font-bold font-heading text-success">{drivers.filter(d => d.status === 'نشط').length}</p><p className="text-sm text-muted-foreground">نشط</p></div>
        <div className="stat-card"><p className="text-2xl font-bold font-heading text-warning">1</p><p className="text-sm text-muted-foreground">رخص قاربت على الانتهاء</p></div>
        <div className="stat-card"><p className="text-2xl font-bold font-heading">710</p><p className="text-sm text-muted-foreground">إجمالي الرحلات</p></div>
      </div>

      <div className="flex items-center gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input type="text" placeholder="بحث بالاسم أو رقم الهوية..." className="w-full bg-card border rounded-lg pr-10 pl-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20" />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {drivers.map(driver => (
          <div key={driver.id} className="bg-card rounded-xl border p-5 hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <span className="font-bold text-primary font-heading">{driver.name.charAt(0)}</span>
                </div>
                <div>
                  <p className="font-semibold text-sm">{driver.name}</p>
                  <p className="text-xs text-muted-foreground">{driver.id} | {driver.idNumber}</p>
                </div>
              </div>
              <span className={`badge-status ${statusStyle(driver.status)}`}>{driver.status}</span>
            </div>

            <div className="space-y-2 text-sm">
              <div className="flex justify-between"><span className="text-muted-foreground flex items-center gap-1.5"><Phone className="w-3.5 h-3.5" /> الجوال</span><span>{driver.phone}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground flex items-center gap-1.5"><Truck className="w-3.5 h-3.5" /> الشاحنة</span><span className="font-medium">{driver.truck}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5" /> انتهاء الرخصة</span><span>{driver.licenseExpiry}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">الكيلومترات</span><span>{driver.totalKm} كم</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">الرحلات</span><span>{driver.trips}</span></div>
            </div>

            <div className="flex items-center gap-2 mt-4 pt-3 border-t">
              <button className="flex-1 py-2 text-sm rounded-lg bg-muted hover:bg-muted/80 transition-colors font-medium">عرض الملف</button>
              <button className="p-2 rounded-lg bg-muted hover:bg-muted/80"><Edit className="w-4 h-4 text-muted-foreground" /></button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Drivers;
