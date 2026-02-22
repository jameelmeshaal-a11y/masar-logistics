import { useState } from 'react';
import { Plus, Search, Filter, Truck, Fuel, MapPin, Calendar, Settings } from 'lucide-react';
import FormDialog, { FormField } from '@/components/FormDialog';
import BarcodeDisplay from '@/components/BarcodeDisplay';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

const trucks = [
  { id: 'SH-001', plate: 'أ ب ج 1234', model: 'مرسيدس أكتروس 2024', type: 'شاحنة نقل', km: '125,430', status: 'نشط', driver: 'محمد أحمد', fuel: 85, nextMaintenance: '2024-04-01', barcode: 'BC-TRU-001234' },
  { id: 'SH-005', plate: 'د هـ و 5678', model: 'فولفو FH16', type: 'رأس قاطرة', km: '230,100', status: 'في الصيانة', driver: 'خالد العمري', fuel: 42, nextMaintenance: '2024-03-20', barcode: 'BC-TRU-005678' },
  { id: 'SH-012', plate: 'ز ح ط 9012', model: 'سكانيا R500', type: 'شاحنة مبردة', km: '89,750', status: 'نشط', driver: 'فهد السالم', fuel: 93, nextMaintenance: '2024-05-15', barcode: 'BC-TRU-009012' },
  { id: 'SH-023', plate: 'ي ك ل 3456', model: 'مان TGX', type: 'شاحنة نقل', km: '310,200', status: 'متوقف', driver: '-', fuel: 12, nextMaintenance: '2024-03-18', barcode: 'BC-TRU-003456' },
  { id: 'SH-034', plate: 'م ن س 7890', model: 'داف XF', type: 'رأس قاطرة', km: '178,900', status: 'نشط', driver: 'سعد الحربي', fuel: 67, nextMaintenance: '2024-04-10', barcode: 'BC-TRU-007890' },
];

const tires = [
  { serial: 'TR-00145', brand: 'ميشلان', size: '315/80 R22.5', truck: 'SH-001', position: 'أمام يمين', kmInstalled: '120,000', currentKm: '125,430', status: 'جيد', barcode: 'BC-TIR-000145' },
  { serial: 'TR-00146', brand: 'ميشلان', size: '315/80 R22.5', truck: 'SH-001', position: 'أمام يسار', kmInstalled: '120,000', currentKm: '125,430', status: 'جيد', barcode: 'BC-TIR-000146' },
  { serial: 'TR-00098', brand: 'بريدجستون', size: '315/80 R22.5', truck: 'SH-005', position: 'خلف يمين', kmInstalled: '200,000', currentKm: '230,100', status: 'يحتاج تبديل', barcode: 'BC-TIR-000098' },
  { serial: 'TR-00201', brand: 'كونتيننتال', size: '295/80 R22.5', truck: 'SH-012', position: 'أمام يمين', kmInstalled: '85,000', currentKm: '89,750', status: 'جيد', barcode: 'BC-TIR-000201' },
];

const statusStyle = (s: string) => {
  if (['نشط', 'جيد'].includes(s)) return 'badge-active';
  if (['في الصيانة', 'يحتاج تبديل'].includes(s)) return 'badge-pending';
  return 'badge-inactive';
};

const truckFields: FormField[] = [
  { name: 'plate_number', label: 'رقم اللوحة', type: 'text', required: true },
  { name: 'model', label: 'الموديل', type: 'text', required: true },
  { name: 'type', label: 'النوع', type: 'select', required: true, options: [
    { value: 'شاحنة نقل', label: 'شاحنة نقل' }, { value: 'رأس قاطرة', label: 'رأس قاطرة' }, { value: 'شاحنة مبردة', label: 'شاحنة مبردة' },
  ]},
  { name: 'year', label: 'سنة الصنع', type: 'number', placeholder: '2024' },
  { name: 'fuel_type', label: 'نوع الوقود', type: 'select', options: [
    { value: 'diesel', label: 'ديزل' }, { value: 'gasoline', label: 'بنزين' },
  ]},
];

const tireFields: FormField[] = [
  { name: 'serial_number', label: 'الرقم التسلسلي', type: 'text', required: true, dir: 'ltr' },
  { name: 'brand', label: 'الماركة', type: 'text', required: true },
  { name: 'size', label: 'المقاس', type: 'text', required: true, dir: 'ltr' },
  { name: 'position', label: 'الموقع', type: 'select', options: [
    { value: 'أمام يمين', label: 'أمام يمين' }, { value: 'أمام يسار', label: 'أمام يسار' },
    { value: 'خلف يمين', label: 'خلف يمين' }, { value: 'خلف يسار', label: 'خلف يسار' },
  ]},
];

const Fleet = () => {
  const [tab, setTab] = useState<'trucks' | 'tires'>('trucks');
  const [showTruckForm, setShowTruckForm] = useState(false);
  const [showTireForm, setShowTireForm] = useState(false);
  const [expandedTruck, setExpandedTruck] = useState<string | null>(null);
  const { toast } = useToast();

  const handleAddTruck = async (data: Record<string, string>) => {
    const { error } = await supabase.from('trucks').insert({
      plate_number: data.plate_number, model: data.model, type: data.type,
      year: data.year ? parseInt(data.year) : null, fuel_type: data.fuel_type || 'diesel',
    });
    if (error) throw new Error(error.message);
    toast({ title: 'تم', description: 'تم إضافة الشاحنة بنجاح' });
  };

  const handleAddTire = async (data: Record<string, string>) => {
    const { error } = await supabase.from('tires').insert({
      serial_number: data.serial_number, brand: data.brand, size: data.size, position: data.position,
    });
    if (error) throw new Error(error.message);
    toast({ title: 'تم', description: 'تم إضافة الكفر بنجاح' });
  };

  return (
    <div className="space-y-6">
      <FormDialog open={showTruckForm} onClose={() => setShowTruckForm(false)} title="إضافة شاحنة جديدة" fields={truckFields} onSubmit={handleAddTruck} />
      <FormDialog open={showTireForm} onClose={() => setShowTireForm(false)} title="إضافة كفر جديد" fields={tireFields} onSubmit={handleAddTire} />

      <div className="page-header flex items-center justify-between">
        <div>
          <h1 className="page-title">إدارة الأسطول</h1>
          <p className="page-subtitle">إدارة الشاحنات والكفرات وتتبع الأصول</p>
        </div>
        <button onClick={() => tab === 'trucks' ? setShowTruckForm(true) : setShowTireForm(true)}
          className="flex items-center gap-2 bg-accent text-accent-foreground px-4 py-2.5 rounded-lg text-sm font-medium hover:opacity-90">
          <Plus className="w-4 h-4" /> {tab === 'trucks' ? 'إضافة شاحنة' : 'إضافة كفر'}
        </button>
      </div>

      <div className="flex gap-1 bg-muted/50 p-1 rounded-xl w-fit">
        <button onClick={() => setTab('trucks')} className={`px-5 py-2 rounded-lg text-sm font-medium transition-all ${tab === 'trucks' ? 'bg-card shadow-sm text-foreground' : 'text-muted-foreground'}`}>الشاحنات</button>
        <button onClick={() => setTab('tires')} className={`px-5 py-2 rounded-lg text-sm font-medium transition-all ${tab === 'tires' ? 'bg-card shadow-sm text-foreground' : 'text-muted-foreground'}`}>الكفرات</button>
      </div>

      <div className="flex items-center gap-3 flex-wrap">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input type="text" placeholder="بحث..." className="w-full bg-card border rounded-lg pr-10 pl-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20" />
        </div>
        <button className="flex items-center gap-2 px-3 py-2 border rounded-lg text-sm text-muted-foreground hover:bg-muted transition-colors"><Filter className="w-4 h-4" /> تصفية</button>
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
                      <div className={`h-full rounded-full ${truck.fuel > 50 ? 'bg-success' : truck.fuel > 20 ? 'bg-warning' : 'bg-destructive'}`} style={{ width: `${truck.fuel}%` }} />
                    </div>
                    <span className="font-medium text-xs">{truck.fuel}%</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5" /> الصيانة القادمة</span>
                  <span className="font-medium text-xs">{truck.nextMaintenance}</span>
                </div>
              </div>

              {/* Barcode section */}
              {expandedTruck === truck.id && (
                <div className="mt-3 pt-3 border-t flex justify-center">
                  <BarcodeDisplay value={truck.barcode} label={truck.id} />
                </div>
              )}

              <div className="flex items-center gap-2 mt-4 pt-3 border-t">
                <button onClick={() => setExpandedTruck(expandedTruck === truck.id ? null : truck.id)}
                  className="flex-1 py-2 text-sm rounded-lg bg-muted hover:bg-muted/80 transition-colors font-medium">
                  {expandedTruck === truck.id ? 'إخفاء الباركود' : 'عرض الباركود'}
                </button>
                <button className="p-2 rounded-lg bg-muted hover:bg-muted/80 transition-colors"><Settings className="w-4 h-4 text-muted-foreground" /></button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-card rounded-xl border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="data-table">
              <thead><tr><th>الرقم التسلسلي</th><th>الماركة</th><th>المقاس</th><th>الشاحنة</th><th>الموقع</th><th>كم عند التركيب</th><th>كم الحالي</th><th>الحالة</th><th>الباركود</th></tr></thead>
              <tbody>
                {tires.map(t => (
                  <tr key={t.serial}>
                    <td className="font-medium text-primary">{t.serial}</td><td>{t.brand}</td><td className="text-xs">{t.size}</td>
                    <td>{t.truck}</td><td>{t.position}</td><td>{t.kmInstalled}</td><td>{t.currentKm}</td>
                    <td><span className={`badge-status ${statusStyle(t.status)}`}>{t.status}</span></td>
                    <td><BarcodeDisplay value={t.barcode} width={120} height={40} /></td>
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
