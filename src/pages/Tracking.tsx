import { MapPin, Truck, Clock, Fuel, Navigation } from 'lucide-react';

const vehicles = [
  { id: 'SH-001', driver: 'محمد أحمد', location: 'الرياض - طريق الملك فهد', speed: '85 كم/س', fuel: 85, status: 'متحرك', lastUpdate: 'منذ 2 دقيقة' },
  { id: 'SH-005', driver: 'خالد العمري', location: 'في الورشة', speed: '0 كم/س', fuel: 42, status: 'متوقف', lastUpdate: 'منذ 5 ساعات' },
  { id: 'SH-012', driver: 'فهد السالم', location: 'جدة - ميناء جدة الإسلامي', speed: '0 كم/س', fuel: 93, status: 'في التحميل', lastUpdate: 'منذ 15 دقيقة' },
  { id: 'SH-023', driver: '-', location: 'المستودع الرئيسي', speed: '0 كم/س', fuel: 12, status: 'متوقف', lastUpdate: 'منذ 3 أيام' },
  { id: 'SH-034', driver: 'سعد الحربي', location: 'الدمام - طريق الظهران', speed: '110 كم/س', fuel: 67, status: 'متحرك', lastUpdate: 'منذ 1 دقيقة' },
];

const statusColor = (s: string) => {
  if (s === 'متحرك') return 'bg-success';
  if (s === 'في التحميل') return 'bg-info';
  return 'bg-muted-foreground';
};

const Tracking = () => {
  return (
    <div className="space-y-6">
      <div className="page-header">
        <h1 className="page-title">التتبع والمراقبة</h1>
        <p className="page-subtitle">تتبع مباشر لحركة الشاحنات والسائقين</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="stat-card"><p className="text-2xl font-bold font-heading text-success">2</p><p className="text-sm text-muted-foreground">شاحنات متحركة</p></div>
        <div className="stat-card"><p className="text-2xl font-bold font-heading">2</p><p className="text-sm text-muted-foreground">شاحنات متوقفة</p></div>
        <div className="stat-card"><p className="text-2xl font-bold font-heading text-info">1</p><p className="text-sm text-muted-foreground">في التحميل</p></div>
        <div className="stat-card"><p className="text-2xl font-bold font-heading">5</p><p className="text-sm text-muted-foreground">إجمالي المتتبع</p></div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Map placeholder */}
        <div className="lg:col-span-2 bg-card rounded-xl border overflow-hidden">
          <div className="h-[450px] bg-muted/30 flex items-center justify-center relative">
            <div className="text-center">
              <MapPin className="w-16 h-16 mx-auto text-muted-foreground/20 mb-3" />
              <p className="text-muted-foreground font-medium">خريطة التتبع المباشر</p>
              <p className="text-sm text-muted-foreground/60 mt-1">سيتم ربطها بنظام GPS الخاص بالأسطول</p>
            </div>
            {/* Simulated markers */}
            <div className="absolute top-20 right-32 w-3 h-3 rounded-full bg-success animate-pulse" title="SH-001" />
            <div className="absolute top-40 left-40 w-3 h-3 rounded-full bg-info animate-pulse" title="SH-012" />
            <div className="absolute bottom-32 right-48 w-3 h-3 rounded-full bg-success animate-pulse" title="SH-034" />
          </div>
        </div>

        {/* Vehicle list */}
        <div className="space-y-3">
          <h3 className="font-semibold font-heading">المركبات</h3>
          {vehicles.map(v => (
            <div key={v.id} className="bg-card rounded-xl border p-4 hover:shadow-md transition-shadow cursor-pointer">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div className={`w-2.5 h-2.5 rounded-full ${statusColor(v.status)}`} />
                  <span className="font-semibold text-sm">{v.id}</span>
                </div>
                <span className="text-xs text-muted-foreground">{v.lastUpdate}</span>
              </div>
              <p className="text-xs text-muted-foreground mb-2">{v.driver}</p>
              <div className="flex items-center gap-1 text-xs text-muted-foreground mb-2">
                <MapPin className="w-3 h-3" />
                <span className="truncate">{v.location}</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="flex items-center gap-1"><Navigation className="w-3 h-3" /> {v.speed}</span>
                <span className="flex items-center gap-1"><Fuel className="w-3 h-3" /> {v.fuel}%</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Tracking;
