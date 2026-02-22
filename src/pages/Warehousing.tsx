import { useState } from 'react';
import { Plus, Search, Package, ArrowDownRight, ArrowUpRight, AlertTriangle, Eye, Edit } from 'lucide-react';
import FormDialog, { FormField } from '@/components/FormDialog';
import BarcodeDisplay from '@/components/BarcodeDisplay';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

const inventory = [
  { code: 'ITM-001', name: 'إطار 315/80 R22.5 ميشلان', category: 'إطارات', qty: 24, min: 10, unit: 'حبة', location: 'مستودع أ', value: '72,000', barcode: 'BC-INV-000001' },
  { code: 'ITM-002', name: 'فلتر زيت محرك - كات', category: 'قطع غيار', qty: 45, min: 20, unit: 'حبة', location: 'مستودع أ', value: '13,500', barcode: 'BC-INV-000002' },
  { code: 'ITM-003', name: 'زيت محرك 15W-40 (20L)', category: 'زيوت', qty: 8, min: 15, unit: 'جالون', location: 'مستودع ب', value: '4,800', barcode: 'BC-INV-000003' },
  { code: 'ITM-004', name: 'بطارية 200 أمبير فارتا', category: 'كهرباء', qty: 6, min: 5, unit: 'حبة', location: 'مستودع أ', value: '7,200', barcode: 'BC-INV-000004' },
  { code: 'ITM-005', name: 'ديسكات فرامل أمامية', category: 'قطع غيار', qty: 3, min: 8, unit: 'طقم', location: 'مستودع أ', value: '4,500', barcode: 'BC-INV-000005' },
  { code: 'ITM-006', name: 'فلتر هواء - فولفو', category: 'قطع غيار', qty: 30, min: 10, unit: 'حبة', location: 'مستودع ب', value: '6,000', barcode: 'BC-INV-000006' },
];

const movements = [
  { id: 'MV-001', item: 'إطار 315/80 R22.5', type: 'صرف', qty: 4, from: 'مستودع أ', to: 'ورشة 1', ref: 'WO-001', date: '2024-03-15', by: 'أحمد' },
  { id: 'MV-002', item: 'فلتر زيت محرك', type: 'استلام', qty: 50, from: 'مورد', to: 'مستودع أ', ref: 'PO-0142', date: '2024-03-14', by: 'خالد' },
  { id: 'MV-003', item: 'زيت محرك 15W-40', type: 'صرف', qty: 3, from: 'مستودع ب', to: 'ورشة 2', ref: 'WO-005', date: '2024-03-14', by: 'فهد' },
  { id: 'MV-004', item: 'بطارية 200 أمبير', type: 'إرجاع', qty: 1, from: 'ورشة 1', to: 'مستودع أ', ref: 'WO-003', date: '2024-03-13', by: 'سعد' },
];

const itemFields: FormField[] = [
  { name: 'code', label: 'رمز الصنف', type: 'text', required: true, dir: 'ltr', placeholder: 'ITM-XXX' },
  { name: 'name', label: 'اسم الصنف', type: 'text', required: true },
  { name: 'category', label: 'التصنيف', type: 'select', required: true, options: [
    { value: 'إطارات', label: 'إطارات' }, { value: 'قطع غيار', label: 'قطع غيار' },
    { value: 'زيوت', label: 'زيوت' }, { value: 'كهرباء', label: 'كهرباء' },
  ]},
  { name: 'quantity', label: 'الكمية', type: 'number', required: true },
  { name: 'min_quantity', label: 'الحد الأدنى', type: 'number', required: true },
  { name: 'unit', label: 'الوحدة', type: 'text', placeholder: 'حبة' },
  { name: 'location', label: 'الموقع', type: 'text', placeholder: 'مستودع أ' },
];

const Warehousing = () => {
  const [tab, setTab] = useState<'inventory' | 'movements'>('inventory');
  const [showForm, setShowForm] = useState(false);
  const lowStock = inventory.filter(i => i.qty <= i.min);
  const { toast } = useToast();

  const handleAdd = async (data: Record<string, string>) => {
    const { error } = await supabase.from('inventory_items').insert({
      code: data.code, name: data.name, category: data.category,
      quantity: parseInt(data.quantity) || 0, min_quantity: parseInt(data.min_quantity) || 5,
      unit: data.unit || 'قطعة', location: data.location,
    });
    if (error) throw new Error(error.message);
    toast({ title: 'تم', description: 'تم إضافة الصنف بنجاح' });
  };

  return (
    <div className="space-y-6">
      <FormDialog open={showForm} onClose={() => setShowForm(false)} title="إضافة صنف جديد" fields={itemFields} onSubmit={handleAdd} />

      <div className="page-header flex items-center justify-between">
        <div><h1 className="page-title">إدارة المستودعات</h1><p className="page-subtitle">المخزون وحركة الأصناف وتتبع القطع</p></div>
        <button onClick={() => setShowForm(true)} className="flex items-center gap-2 bg-accent text-accent-foreground px-4 py-2.5 rounded-lg text-sm font-medium hover:opacity-90"><Plus className="w-4 h-4" /> إضافة صنف</button>
      </div>

      {lowStock.length > 0 && (
        <div className="bg-warning/5 border border-warning/20 rounded-xl p-4 flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-warning shrink-0 mt-0.5" />
          <div><p className="font-medium text-sm">تنبيه: أصناف وصلت لحد إعادة الطلب</p><p className="text-sm text-muted-foreground mt-1">{lowStock.map(i => i.name).join('، ')}</p></div>
        </div>
      )}

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="stat-card"><p className="text-2xl font-bold font-heading">{inventory.length}</p><p className="text-sm text-muted-foreground">إجمالي الأصناف</p></div>
        <div className="stat-card"><p className="text-2xl font-bold font-heading text-warning">{lowStock.length}</p><p className="text-sm text-muted-foreground">أصناف تحت الحد</p></div>
        <div className="stat-card"><p className="text-2xl font-bold font-heading">108,000</p><p className="text-sm text-muted-foreground">قيمة المخزون (ر.س)</p></div>
        <div className="stat-card"><p className="text-2xl font-bold font-heading">{movements.length}</p><p className="text-sm text-muted-foreground">حركات اليوم</p></div>
      </div>

      <div className="flex gap-1 bg-muted/50 p-1 rounded-xl w-fit">
        <button onClick={() => setTab('inventory')} className={`px-5 py-2 rounded-lg text-sm font-medium transition-all ${tab === 'inventory' ? 'bg-card shadow-sm' : 'text-muted-foreground'}`}>المخزون</button>
        <button onClick={() => setTab('movements')} className={`px-5 py-2 rounded-lg text-sm font-medium transition-all ${tab === 'movements' ? 'bg-card shadow-sm' : 'text-muted-foreground'}`}>حركة المخزون</button>
      </div>

      <div className="bg-card rounded-xl border overflow-hidden">
        {tab === 'inventory' ? (
          <div className="overflow-x-auto">
            <table className="data-table">
              <thead><tr><th>الرمز</th><th>الصنف</th><th>التصنيف</th><th>الكمية</th><th>الحد الأدنى</th><th>الوحدة</th><th>الموقع</th><th>القيمة</th><th>الباركود</th><th>إجراءات</th></tr></thead>
              <tbody>
                {inventory.map(item => (
                  <tr key={item.code}>
                    <td className="font-medium text-primary">{item.code}</td><td className="font-medium">{item.name}</td>
                    <td><span className="badge-status bg-muted text-muted-foreground">{item.category}</span></td>
                    <td className={item.qty <= item.min ? 'text-destructive font-semibold' : ''}>{item.qty}</td>
                    <td className="text-muted-foreground">{item.min}</td><td>{item.unit}</td><td>{item.location}</td><td>{item.value} ر.س</td>
                    <td><BarcodeDisplay value={item.barcode} width={110} height={35} /></td>
                    <td><div className="flex items-center gap-1"><button className="p-1.5 rounded-md hover:bg-muted"><Eye className="w-4 h-4 text-muted-foreground" /></button><button className="p-1.5 rounded-md hover:bg-muted"><Edit className="w-4 h-4 text-muted-foreground" /></button></div></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="data-table">
              <thead><tr><th>رقم الحركة</th><th>الصنف</th><th>النوع</th><th>الكمية</th><th>من</th><th>إلى</th><th>المرجع</th><th>التاريخ</th><th>بواسطة</th></tr></thead>
              <tbody>
                {movements.map(m => (
                  <tr key={m.id}>
                    <td className="font-medium">{m.id}</td><td>{m.item}</td>
                    <td><span className={`badge-status ${m.type === 'استلام' ? 'badge-active' : m.type === 'صرف' ? 'badge-pending' : 'bg-info/10 text-info'}`}>{m.type === 'استلام' ? <ArrowDownRight className="w-3 h-3 inline ml-1" /> : <ArrowUpRight className="w-3 h-3 inline ml-1" />}{m.type}</span></td>
                    <td className="font-medium">{m.qty}</td><td>{m.from}</td><td>{m.to}</td><td className="text-primary">{m.ref}</td><td className="text-muted-foreground">{m.date}</td><td>{m.by}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default Warehousing;
