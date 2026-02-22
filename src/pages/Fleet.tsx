import { useState } from 'react';
import { Plus, Search, Filter, Truck, Fuel, MapPin, Calendar, Eye, Edit, Settings } from 'lucide-react';

const trucks = [
  { id: 'SH-001', plate: 'أ ب ج 1234', model: 'مرسيدس أكتروس 2024', type: 'شاحنة نقل', km: '125,430', status: 'نشط', driver: 'محمد أحمد', fuel: 85, nextMaintenance: '2024-04-01' },
  { id: 'SH-005', plate: 'د هـ و 5678', model: 'فولفو FH16', type: 'رأس قاطرة', km: '230,100', status: 'في الصيانة', driver: 'خالد العمري', fuel: 42, nextMaintenance: '2024-03-20' },
  { id: 'SH-012', plate: 'ز ح ط 9012', model: 'سكانيا R500', type: 'شاحنة مبردة', km: '89,750', status: 'نشط', driver: 'فهد السالم', fuel: 93, nextMaintenance: '2024-05-15' },
  { id: 'SH-023', plate: 'ي ك ل 3456', model: 'مان TGX', type: 'شاحنة نقل', km: '310,200', status: 'متوقف', driver: '-', fuel: 12, nextMaintenance: '2024-03-18' },
  { id: 'SH-034', plate: 'م ن س 7890', model: 'داف XF', type: 'رأس قاطرة', km: '178,900', status: 'نشط', driver: 'سعد الحربي', fuel: 67, nextMaintenance: '2024-04-10' },
];

const tires = [
  { serial: 'TR-00145', brand: 'ميشلان', size: '315/80 R22.5', truck: 'SH-001', position: 'أمام يمين', kmInstalled: '120,000', currentKm: '125,430', status: 'جيد' },
  { serial: 'TR-00146', brand: 'ميشلان', size: '315/80 R22.5', truck: 'SH-001', position: 'أمام يسار', kmInstalled: '120,000', currentKm: '125,430', status: 'جيد' },
  { serial: 'TR-00098', brand: 'بريدجستون', size: '315/80 R22.5', truck: 'SH-005', position: 'خلف يمين', kmInstalled: '200,000', currentKm: '230,100', status: 'يحتاج تبديل' },
  { serial: 'TR-00201', brand: 'كونتيننتال', size: '295/80 R22.5', truck: 'SH-012', position: 'أمام يمين', kmInstalled: '85,000', currentKm: '89,750', status: 'جيد' },
];

const statusStyle = (s: string) => {
  if (['نشط', 'جيد'].includes(s)) return 'badge-active';
  if (['في الصيانة', 'يحتاج تبديل'].includes(s)) return 'badge-pending';
  return 'badge-inactive';
};

const Fleet = () => {
  const [tab, setTab] = useState<'trucks' | 'tires'>('trucks');

  return (
    <div className="space-y-6">
      <div className="page-header flex items-center justify-between">
        <div>
          <h1 className="page-title">إدارة الأسطول</h1>
          <p className="page-subtitle">إدارة الشاحنات والكفرات وتتبع الأصول</p>
        </div>
        <button className="flex items-center gap-2 bg-accent text-accent-foreground px-4 py-2.5 rounded-lg text-sm font-medium hover:opacity-90">
          <Plus className="w-4 h-4" />
          {tab === 'trucks' ? 'إضافة شاحنة' : 'إضافة كفر'}
        </button>
      </div>

      <div className="flex gap-1 bg-muted/50 p-1 rounded-xl w-fit">
        <button onClick={() => setTab('trucks')} className={`px-5 py-2 rounded-lg text-sm font-medium transition-all ${tab === 'trucks' ? 'bg-card shadow-sm text-foreground' : 'text-muted-foreground'}`}>
          الشاحنات
        </button>
        <button onClick={() => setTab('tires')} className={`px-5 py-2 rounded-lg text-sm font-medium transition-all ${tab === 'tires' ? 'bg-card shadow-sm text-foreground' : 'text-muted-foreground'}`}>
          الكفرات
        </button>
      </div>

      <div className="flex items-center gap-3 flex-wrap">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input type="text" placeholder="بحث..." className="w-full bg-card border rounded-lg pr-10 pl-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20" />
        </div>
        <button className="flex items-center gap-2 px-3 py-2 border rounded-lg text-sm text-muted-foreground hover:bg-muted transition-colors">
          <Filter className="w-4 h-4" /> تصفية
        </button>
      </div>

      {tab === 'trucks' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {trucks.map(truck => (
            <div key={truck.id} className="bg-card rounded-xl border p-5 hover:shadow-lg transition-shadow">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Truck className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-semibold text-sm">{truck.id}</p>
                    <p className="text-xs text-muted-foreground">{truck.plate}</p>
                  </div>
                </div>
                <span className={`badge-status ${statusStyle(truck.status)}`}>{truck.status}</span>
              </div>
              
              <p className="text-sm font-medium mb-3">{truck.model}</p>
              
              <div className="space-y-2 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5" /> الكيلومترات</span>
                  <span className="font-medium">{truck.km} كم</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground flex items-center gap-1.5"><Fuel className="w-3.5 h-3.5" /> الوقود</span>
                  <div className="flex items-center gap-2">
                    <div className="w-20 h-2 rounded-full bg-muted">
                      <div className={`h-full rounded-full ${truck.fuel > 50 ? 'bg-success' : truck.fuel > 20 ? 'bg-warning' : 'bg-destructive'}`} style={{width: `${truck.fuel}%`}} />
                    </div>
                    <span className="font-medium text-xs">{truck.fuel}%</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5" /> الصيانة القادمة</span>
                  <span className="font-medium text-xs">{truck.nextMaintenance}</span>
                </div>
              </div>

              <div className="flex items-center gap-2 mt-4 pt-3 border-t">
                <button className="flex-1 py-2 text-sm rounded-lg bg-muted hover:bg-muted/80 transition-colors font-medium">عرض التفاصيل</button>
                <button className="p-2 rounded-lg bg-muted hover:bg-muted/80 transition-colors"><Settings className="w-4 h-4 text-muted-foreground" /></button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-card rounded-xl border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="data-table">
              <thead><tr><th>الرقم التسلسلي</th><th>الماركة</th><th>المقاس</th><th>الشاحنة</th><th>الموقع</th><th>كم عند التركيب</th><th>كم الحالي</th><th>الحالة</th></tr></thead>
              <tbody>
                {tires.map(t => (
                  <tr key={t.serial}>
                    <td className="font-medium text-primary">{t.serial}</td>
                    <td>{t.brand}</td>
                    <td className="text-xs">{t.size}</td>
                    <td>{t.truck}</td>
                    <td>{t.position}</td>
                    <td>{t.kmInstalled}</td>
                    <td>{t.currentKm}</td>
                    <td><span className={`badge-status ${statusStyle(t.status)}`}>{t.status}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default Fleet;
