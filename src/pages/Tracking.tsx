import { MapPin, Truck, Clock, Fuel, Navigation } from 'lucide-react';

const vehicles = [
  { id: 'فولفو FH16 - أ ب د 1234', driver: 'محمد أحمد الغامدي', location: 'الرياض - طريق الملك فهد', speed: '85 كم/س', fuel: 85, status: 'متحرك', lastUpdate: 'منذ 2 دقيقة', route: 'الرياض → جدة' },
  { id: 'مرسيدس أكتروس - هـ و ز 5678', driver: 'خالد عبدالله العمري', location: 'الدمام - ميناء الملك عبدالعزيز', speed: '0 كم/س', fuel: 72, status: 'في التحميل', lastUpdate: 'منذ 15 دقيقة', route: 'الدمام → الرياض' },
  { id: 'مان TGX - ح ط ي 9012', driver: 'فهد سعد السالم', location: 'جدة - ميناء جدة الإسلامي', speed: '0 كم/س', fuel: 93, status: 'في التفريغ', lastUpdate: 'منذ 10 دقائق', route: 'الرياض → جدة' },
  { id: 'سكانيا R450 - ك ل م 3456', driver: 'سعد محمد الحربي', location: 'طريق الرياض - الدمام السريع', speed: '110 كم/س', fuel: 67, status: 'متحرك', lastUpdate: 'منذ 1 دقيقة', route: 'الدمام → الرياض' },
  { id: 'إيسوزو FVR - ن س ع 7890', driver: 'عبدالله الشهري', location: 'مستودع الرياض الرئيسي', speed: '0 كم/س', fuel: 45, status: 'متوقف', lastUpdate: 'منذ ساعة', route: '-' },
  { id: 'هينو 500 - ف ص ق 1357', driver: 'أحمد علي المالكي', location: 'المدينة المنورة - المنطقة الصناعية', speed: '65 كم/س', fuel: 58, status: 'متحرك', lastUpdate: 'منذ 3 دقائق', route: 'المدينة → الرياض' },
  { id: 'فولفو FM - ر ش ت 2468', driver: 'ناصر سالم القحطاني', location: 'الخبر - المنطقة الصناعية الثانية', speed: '0 كم/س', fuel: 82, status: 'في التحميل', lastUpdate: 'منذ 20 دقيقة', route: 'الخبر → جدة' },
];

const statusColor = (s: string) => {
  if (s === 'متحرك') return 'bg-success';
  if (s === 'في التحميل' || s === 'في التفريغ') return 'bg-info';
  return 'bg-muted-foreground';
};

const Tracking = () => {
  return (
    <div className="space-y-6">
      <div className="page-header">
        <h1 className="page-title">التتبع والمراقبة</h1>
        <p className="page-subtitle">تتبع مباشر لحركة الشاحنات والأسطول</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="stat-card"><p className="text-2xl font-bold font-heading text-success">{vehicles.filter(v => v.status === 'متحرك').length}</p><p className="text-sm text-muted-foreground">شاحنات متحركة</p></div>
        <div className="stat-card"><p className="text-2xl font-bold font-heading">{vehicles.filter(v => v.status === 'متوقف').length}</p><p className="text-sm text-muted-foreground">شاحنات متوقفة</p></div>
        <div className="stat-card"><p className="text-2xl font-bold font-heading text-info">{vehicles.filter(v => v.status === 'في التحميل' || v.status === 'في التفريغ').length}</p><p className="text-sm text-muted-foreground">في التحميل/التفريغ</p></div>
        <div className="stat-card"><p className="text-2xl font-bold font-heading">{vehicles.length}</p><p className="text-sm text-muted-foreground">إجمالي المتتبع</p></div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-card rounded-xl border overflow-hidden">
          <div className="h-[450px] bg-muted/30 flex items-center justify-center relative">
            <div className="text-center">
              <MapPin className="w-16 h-16 mx-auto text-muted-foreground/20 mb-3" />
              <p className="text-muted-foreground font-medium">خريطة التتبع المباشر</p>
              <p className="text-sm text-muted-foreground/60 mt-1">مرتبطة بنظام GPS للأسطول</p>
            </div>
            <div className="absolute top-20 right-32 w-3 h-3 rounded-full bg-success animate-pulse" title="الرياض" />
            <div className="absolute top-40 left-40 w-3 h-3 rounded-full bg-info animate-pulse" title="جدة" />
            <div className="absolute bottom-32 right-48 w-3 h-3 rounded-full bg-success animate-pulse" title="الدمام" />
            <div className="absolute top-28 left-60 w-3 h-3 rounded-full bg-success animate-pulse" title="المدينة" />
          </div>
        </div>

        <div className="space-y-3 max-h-[500px] overflow-y-auto">
          <h3 className="font-semibold font-heading sticky top-0 bg-background py-1">المركبات ({vehicles.length})</h3>
          {vehicles.map(v => (
            <div key={v.id} className="bg-card rounded-xl border p-4 hover:shadow-md transition-shadow cursor-pointer">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div className={`w-2.5 h-2.5 rounded-full ${statusColor(v.status)}`} />
                  <span className="font-semibold text-xs">{v.id}</span>
                </div>
                <span className="text-xs text-muted-foreground">{v.lastUpdate}</span>
              </div>
              <p className="text-xs text-muted-foreground mb-1">{v.driver}</p>
              <p className="text-xs font-medium text-primary mb-2">{v.route}</p>
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
