import { useState, useEffect } from 'react';
import { Plus, Search, Filter, Truck, Fuel, MapPin, Calendar, Settings, LayoutGrid, List, ArrowRightLeft, Loader2 } from 'lucide-react';
import FormDialog, { FormField } from '@/components/FormDialog';
import BarcodeDisplay from '@/components/BarcodeDisplay';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

const statusStyle = (s: string) => {
  if (['نشط', 'جيد', 'active', 'good', 'new'].includes(s)) return 'badge-active';
  if (['في الصيانة', 'يحتاج تبديل', 'maintenance', 'needs_replacement'].includes(s)) return 'badge-pending';
  return 'badge-inactive';
};
const statusLabels: Record<string, string> = { active: 'نشط', maintenance: 'في الصيانة', inactive: 'متوقف', new: 'جديد', good: 'جيد', needs_replacement: 'يحتاج تبديل', worn: 'مستهلك' };

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
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showTruckForm, setShowTruckForm] = useState(false);
  const [showTireForm, setShowTireForm] = useState(false);
  const [expandedTruck, setExpandedTruck] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('');
  const [filterStatus, setFilterStatus] = useState('');

  const [trucks, setTrucks] = useState<any[]>([]);
  const [tires, setTires] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const fetchData = async () => {
    setLoading(true);
    const [truckRes, tireRes] = await Promise.all([
      supabase.from('trucks').select('*').order('created_at', { ascending: false }),
      supabase.from('tires').select('*, trucks(plate_number)').order('created_at', { ascending: false }),
    ]);
    if (truckRes.data) setTrucks(truckRes.data);
    if (tireRes.data) setTires(tireRes.data);
    setLoading(false);
  };

  useEffect(() => { fetchData(); }, []);

  const handleAddTruck = async (data: Record<string, string>) => {
    const { error } = await supabase.from('trucks').insert({
      plate_number: data.plate_number, model: data.model, type: data.type,
      year: data.year ? parseInt(data.year) : null, fuel_type: data.fuel_type || 'diesel',
    });
    if (error) throw new Error(error.message);
    toast({ title: 'تم', description: 'تم إضافة الشاحنة بنجاح' });
    fetchData();
  };

  const handleAddTire = async (data: Record<string, string>) => {
    const { error } = await supabase.from('tires').insert({
      serial_number: data.serial_number, brand: data.brand, size: data.size, position: data.position,
    });
    if (error) throw new Error(error.message);
    toast({ title: 'تم', description: 'تم إضافة الكفر بنجاح' });
    fetchData();
  };

  // Filters
  const filteredTrucks = trucks.filter(t => {
    if (searchTerm && !t.plate_number?.includes(searchTerm) && !t.model?.includes(searchTerm)) return false;
    if (filterType && t.type !== filterType) return false;
    if (filterStatus && t.status !== filterStatus) return false;
    return true;
  });

  const truckTypes = [...new Set(trucks.map(t => t.type).filter(Boolean))];
  const truckStatuses = [...new Set(trucks.map(t => t.status).filter(Boolean))];

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

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="stat-card"><p className="text-2xl font-bold font-heading">{trucks.length}</p><p className="text-sm text-muted-foreground">إجمالي الشاحنات</p></div>
        <div className="stat-card"><p className="text-2xl font-bold font-heading text-success">{trucks.filter(t => t.status === 'active').length}</p><p className="text-sm text-muted-foreground">نشط</p></div>
        <div className="stat-card"><p className="text-2xl font-bold font-heading text-warning">{trucks.filter(t => t.status === 'maintenance').length}</p><p className="text-sm text-muted-foreground">في الصيانة</p></div>
        <div className="stat-card"><p className="text-2xl font-bold font-heading">{tires.length}</p><p className="text-sm text-muted-foreground">إجمالي الكفرات</p></div>
      </div>

      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div className="flex gap-1 bg-muted/50 p-1 rounded-xl">
          <button onClick={() => setTab('trucks')} className={`px-5 py-2 rounded-lg text-sm font-medium transition-all ${tab === 'trucks' ? 'bg-card shadow-sm text-foreground' : 'text-muted-foreground'}`}>الشاحنات</button>
          <button onClick={() => setTab('tires')} className={`px-5 py-2 rounded-lg text-sm font-medium transition-all ${tab === 'tires' ? 'bg-card shadow-sm text-foreground' : 'text-muted-foreground'}`}>الكفرات</button>
        </div>
        {tab === 'trucks' && (
          <div className="flex gap-1 bg-muted/50 p-1 rounded-lg">
            <button onClick={() => setViewMode('grid')} className={`p-2 rounded ${viewMode === 'grid' ? 'bg-card shadow-sm' : ''}`}><LayoutGrid className="w-4 h-4" /></button>
            <button onClick={() => setViewMode('list')} className={`p-2 rounded ${viewMode === 'list' ? 'bg-card shadow-sm' : ''}`}><List className="w-4 h-4" /></button>
          </div>
        )}
      </div>

      <div className="flex items-center gap-3 flex-wrap">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input type="text" value={searchTerm} onChange={e => setSearchTerm(e.target.value)} placeholder="بحث..." className="w-full bg-card border rounded-lg pr-10 pl-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20" />
        </div>
        {tab === 'trucks' && (
          <>
            <select value={filterType} onChange={e => setFilterType(e.target.value)} className="border rounded-lg px-3 py-2 text-sm bg-card">
              <option value="">جميع الأنواع</option>
              {truckTypes.map(t => <option key={t} value={t}>{t}</option>)}
            </select>
            <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)} className="border rounded-lg px-3 py-2 text-sm bg-card">
              <option value="">جميع الحالات</option>
              {truckStatuses.map(s => <option key={s} value={s}>{statusLabels[s] || s}</option>)}
            </select>
          </>
        )}
      </div>

      {loading ? (
        <div className="flex justify-center py-12"><Loader2 className="w-8 h-8 animate-spin text-muted-foreground" /></div>
      ) : tab === 'trucks' ? (
        viewMode === 'grid' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {filteredTrucks.map(truck => (
              <div key={truck.id} className="bg-card rounded-xl border p-5 hover:shadow-lg transition-shadow">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                      <Truck className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-semibold text-sm">{truck.plate_number}</p>
                      <p className="text-xs text-muted-foreground">{truck.type || '-'}</p>
                    </div>
                  </div>
                  <span className={`badge-status ${statusStyle(truck.status)}`}>{statusLabels[truck.status] || truck.status}</span>
                </div>
                <p className="text-sm font-medium mb-3">{truck.model || '-'} {truck.year ? `(${truck.year})` : ''}</p>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5" /> الكيلومترات</span>
                    <span className="font-medium">{truck.mileage?.toLocaleString() || 0} كم</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground flex items-center gap-1.5"><Fuel className="w-3.5 h-3.5" /> الوقود</span>
                    <span className="font-medium text-xs">{truck.fuel_type === 'diesel' ? 'ديزل' : 'بنزين'}</span>
                  </div>
                </div>
                {expandedTruck === truck.id && (
                  <div className="mt-3 pt-3 border-t flex justify-center">
                    <BarcodeDisplay value={truck.barcode_id || truck.plate_number} label={truck.plate_number} />
                  </div>
                )}
                <div className="flex items-center gap-2 mt-4 pt-3 border-t">
                  <button onClick={() => setExpandedTruck(expandedTruck === truck.id ? null : truck.id)}
                    className="flex-1 py-2 text-sm rounded-lg bg-muted hover:bg-muted/80 transition-colors font-medium">
                    {expandedTruck === truck.id ? 'إخفاء الباركود' : 'عرض الباركود'}
                  </button>
                </div>
              </div>
            ))}
            {filteredTrucks.length === 0 && <div className="col-span-full text-center py-12 text-muted-foreground">لا توجد شاحنات مطابقة</div>}
          </div>
        ) : (
          <div className="bg-card rounded-xl border overflow-hidden">
            <div className="overflow-x-auto">
              <table className="data-table">
                <thead><tr><th>اللوحة</th><th>الموديل</th><th>النوع</th><th>السنة</th><th>الكيلومترات</th><th>الوقود</th><th>الحالة</th></tr></thead>
                <tbody>
                  {filteredTrucks.map(t => (
                    <tr key={t.id}>
                      <td className="font-medium text-primary">{t.plate_number}</td>
                      <td>{t.model || '-'}</td><td>{t.type || '-'}</td><td>{t.year || '-'}</td>
                      <td>{t.mileage?.toLocaleString() || 0} كم</td>
                      <td>{t.fuel_type === 'diesel' ? 'ديزل' : 'بنزين'}</td>
                      <td><span className={`badge-status ${statusStyle(t.status)}`}>{statusLabels[t.status] || t.status}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )
      ) : (
        <div className="bg-card rounded-xl border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="data-table">
              <thead><tr><th>الرقم التسلسلي</th><th>الماركة</th><th>المقاس</th><th>الشاحنة</th><th>الموقع</th><th>الكيلومترات</th><th>الحالة</th><th>الباركود</th></tr></thead>
              <tbody>
                {tires.map(t => (
                  <tr key={t.id}>
                    <td className="font-medium text-primary">{t.serial_number}</td><td>{t.brand || '-'}</td><td className="text-xs">{t.size || '-'}</td>
                    <td>{(t.trucks as any)?.plate_number || '-'}</td><td>{t.position || '-'}</td><td>{t.mileage?.toLocaleString() || 0}</td>
                    <td><span className={`badge-status ${statusStyle(t.status)}`}>{statusLabels[t.status] || t.status}</span></td>
                    <td><BarcodeDisplay value={t.barcode_id || t.serial_number} width={120} height={40} /></td>
                  </tr>
                ))}
                {tires.length === 0 && <tr><td colSpan={8} className="text-center py-8 text-muted-foreground">لا توجد كفرات مسجلة</td></tr>}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default Fleet;
