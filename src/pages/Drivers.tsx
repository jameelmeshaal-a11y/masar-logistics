import { useState } from 'react';
import { Plus, Search, Phone, Truck, Calendar, Edit } from 'lucide-react';
import FormDialog, { FormField } from '@/components/FormDialog';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

const drivers = [
  { id: 'DRV-001', name: 'محمد أحمد الغامدي', idNumber: '1098765432', license: 'رخصة نقل ثقيل', licenseExpiry: '2025-06-15', phone: '0551234567', truck: 'فولفو FH16 - أ ب د 1234', status: 'نشط', totalKm: '145,200', trips: 428 },
  { id: 'DRV-002', name: 'خالد عبدالله العمري', idNumber: '1087654321', license: 'رخصة نقل ثقيل', licenseExpiry: '2026-12-20', phone: '0559876543', truck: 'مرسيدس أكتروس - هـ و ز 5678', status: 'نشط', totalKm: '262,800', trips: 595 },
  { id: 'DRV-003', name: 'فهد سعد السالم', idNumber: '1076543210', license: 'رخصة نقل ثقيل', licenseExpiry: '2025-03-10', phone: '0555551234', truck: 'مان TGX - ح ط ي 9012', status: 'في مهمة', totalKm: '198,100', trips: 412 },
  { id: 'DRV-004', name: 'سعد محمد الحربي', idNumber: '1065432109', license: 'رخصة نقل ثقيل', licenseExpiry: '2026-08-05', phone: '0553334455', truck: 'سكانيا R450 - ك ل م 3456', status: 'نشط', totalKm: '321,500', trips: 730 },
  { id: 'DRV-005', name: 'عبدالله فهد الشهري', idNumber: '1054321098', license: 'رخصة نقل ثقيل', licenseExpiry: '2025-01-28', phone: '0557778899', truck: 'إيسوزو FVR - ن س ع 7890', status: 'في إجازة', totalKm: '85,300', trips: 245 },
  { id: 'DRV-006', name: 'أحمد علي المالكي', idNumber: '1043210987', license: 'رخصة نقل ثقيل', licenseExpiry: '2026-04-18', phone: '0556667788', truck: 'هينو 500 - ف ص ق 1357', status: 'نشط', totalKm: '178,600', trips: 389 },
  { id: 'DRV-007', name: 'يوسف حسن الدوسري', idNumber: '1032109876', license: 'رخصة نقل ثقيل', licenseExpiry: '2025-09-22', phone: '0554443322', truck: '-', status: 'غير معين', totalKm: '52,300', trips: 145 },
  { id: 'DRV-008', name: 'ناصر سالم القحطاني', idNumber: '1021098765', license: 'رخصة نقل ثقيل', licenseExpiry: '2026-02-14', phone: '0552221100', truck: 'فولفو FM - ر ش ت 2468', status: 'نشط', totalKm: '215,900', trips: 512 },
];

const statusStyle = (s: string) => { if (s === 'نشط' || s === 'في مهمة') return 'badge-active'; if (s === 'في إجازة') return 'badge-pending'; return 'badge-inactive'; };

const driverFields: FormField[] = [
  { name: 'name', label: 'الاسم الكامل', type: 'text', required: true },
  { name: 'id_number', label: 'رقم الهوية', type: 'text', required: true, dir: 'ltr' },
  { name: 'license_number', label: 'رقم الرخصة', type: 'text', dir: 'ltr' },
  { name: 'license_expiry', label: 'تاريخ انتهاء الرخصة', type: 'date' },
  { name: 'phone', label: 'رقم الجوال', type: 'tel', required: true, dir: 'ltr' },
];

const Drivers = () => {
  const [showForm, setShowForm] = useState(false);
  const { toast } = useToast();

  const handleAdd = async (data: Record<string, string>) => {
    const { error } = await supabase.from('drivers').insert({
      name: data.name, id_number: data.id_number, license_number: data.license_number,
      license_expiry: data.license_expiry || null, phone: data.phone,
    });
    if (error) throw new Error(error.message);
    toast({ title: 'تم', description: 'تم إضافة السائق بنجاح' });
  };

  return (
    <div className="space-y-6">
      <FormDialog open={showForm} onClose={() => setShowForm(false)} title="إضافة سائق جديد" fields={driverFields} onSubmit={handleAdd} />

      <div className="page-header flex items-center justify-between">
        <div><h1 className="page-title">إدارة السائقين</h1><p className="page-subtitle">بيانات السائقين وربطهم بالشاحنات وتتبع الأداء - {drivers.length} سائق</p></div>
        <button onClick={() => setShowForm(true)} className="flex items-center gap-2 bg-accent text-accent-foreground px-4 py-2.5 rounded-lg text-sm font-medium hover:opacity-90"><Plus className="w-4 h-4" /> إضافة سائق</button>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="stat-card"><p className="text-2xl font-bold font-heading">{drivers.length}</p><p className="text-sm text-muted-foreground">إجمالي السائقين</p></div>
        <div className="stat-card"><p className="text-2xl font-bold font-heading text-success">{drivers.filter(d => d.status === 'نشط' || d.status === 'في مهمة').length}</p><p className="text-sm text-muted-foreground">نشط ومتاح</p></div>
        <div className="stat-card"><p className="text-2xl font-bold font-heading text-warning">2</p><p className="text-sm text-muted-foreground">رخص قاربت على الانتهاء</p></div>
        <div className="stat-card"><p className="text-2xl font-bold font-heading">{drivers.reduce((s, d) => s + d.trips, 0).toLocaleString()}</p><p className="text-sm text-muted-foreground">إجمالي الرحلات</p></div>
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
                <div><p className="font-semibold text-sm">{driver.name}</p><p className="text-xs text-muted-foreground">{driver.id} | {driver.idNumber}</p></div>
              </div>
              <span className={`badge-status ${statusStyle(driver.status)}`}>{driver.status}</span>
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between"><span className="text-muted-foreground flex items-center gap-1.5"><Phone className="w-3.5 h-3.5" /> الجوال</span><span dir="ltr">{driver.phone}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground flex items-center gap-1.5"><Truck className="w-3.5 h-3.5" /> الشاحنة</span><span className="font-medium text-xs">{driver.truck}</span></div>
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
