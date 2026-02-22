import { useState, useEffect } from 'react';
import { Plus, Search, Package, ArrowDownRight, ArrowUpRight, AlertTriangle, Eye, Edit, X, Loader2, ArrowRightLeft } from 'lucide-react';
import FormDialog, { FormField } from '@/components/FormDialog';
import BarcodeDisplay from '@/components/BarcodeDisplay';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

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

const movementFields: FormField[] = [
  { name: 'type', label: 'نوع الحركة', type: 'select', required: true, options: [
    { value: 'صرف', label: 'صرف' }, { value: 'استلام', label: 'استلام' },
    { value: 'إرجاع', label: 'إرجاع' }, { value: 'تحويل', label: 'تحويل بين مشاريع' },
  ]},
  { name: 'quantity', label: 'الكمية', type: 'number', required: true },
  { name: 'reference', label: 'المرجع', type: 'text', placeholder: 'رقم أمر العمل أو الشراء' },
  { name: 'notes', label: 'ملاحظات', type: 'textarea', placeholder: 'مثل: تحويل من مشروع أ إلى مشروع ب' },
];

// Detail modal
const DetailModal = ({ open, onClose, title, data }: { open: boolean; onClose: () => void; title: string; data: Record<string, string> }) => {
  if (!open) return null;
  return (
    <div className="fixed inset-0 bg-foreground/50 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-card rounded-2xl border shadow-xl w-full max-w-lg p-6" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-lg font-bold font-heading">{title}</h3>
          <button onClick={onClose} className="p-1 rounded hover:bg-muted"><X className="w-5 h-5" /></button>
        </div>
        <div className="space-y-3">
          {Object.entries(data).map(([key, value]) => (
            <div key={key} className="flex justify-between py-2 border-b last:border-0">
              <span className="text-sm text-muted-foreground">{key}</span>
              <span className="text-sm font-medium">{value}</span>
            </div>
          ))}
        </div>
        <button onClick={onClose} className="mt-4 w-full py-2.5 border rounded-lg text-sm font-medium hover:bg-muted">إغلاق</button>
      </div>
    </div>
  );
};

const Warehousing = () => {
  const [tab, setTab] = useState<'inventory' | 'movements'>('inventory');
  const [showForm, setShowForm] = useState(false);
  const [showMovementForm, setShowMovementForm] = useState(false);
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [editItem, setEditItem] = useState<any>(null);
  const [detailModal, setDetailModal] = useState<{ title: string; data: Record<string, string> } | null>(null);

  const [inventory, setInventory] = useState<any[]>([]);
  const [movements, setMovements] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const fetchData = async () => {
    setLoading(true);
    const [invRes, movRes] = await Promise.all([
      supabase.from('inventory_items').select('*').order('created_at', { ascending: false }),
      supabase.from('inventory_movements').select('*, inventory_items(name, code)').order('created_at', { ascending: false }),
    ]);
    if (invRes.data) setInventory(invRes.data);
    if (movRes.data) setMovements(movRes.data);
    setLoading(false);
  };

  useEffect(() => { fetchData(); }, []);

  const lowStock = inventory.filter(i => i.quantity <= (i.min_quantity || 5));

  const handleAdd = async (data: Record<string, string>) => {
    const { error } = await supabase.from('inventory_items').insert({
      code: data.code, name: data.name, category: data.category,
      quantity: parseInt(data.quantity) || 0, min_quantity: parseInt(data.min_quantity) || 5,
      unit: data.unit || 'قطعة', location: data.location,
    });
    if (error) throw new Error(error.message);
    toast({ title: 'تم', description: 'تم إضافة الصنف بنجاح' });
    fetchData();
  };

  const handleAddMovement = async (data: Record<string, string>) => {
    if (!selectedItem) { toast({ title: 'خطأ', description: 'اختر صنف أولاً', variant: 'destructive' }); return; }
    const { data: user } = await supabase.auth.getUser();
    const { error } = await supabase.from('inventory_movements').insert({
      item_id: selectedItem.id, type: data.type, quantity: parseInt(data.quantity) || 0,
      reference: data.reference, notes: data.notes, created_by: user.user?.id,
    });
    if (error) throw new Error(error.message);

    // Update inventory quantity
    const qtyChange = data.type === 'استلام' || data.type === 'إرجاع' ? parseInt(data.quantity) : -parseInt(data.quantity);
    await supabase.from('inventory_items').update({ quantity: selectedItem.quantity + qtyChange }).eq('id', selectedItem.id);

    toast({ title: 'تم', description: 'تم تسجيل الحركة بنجاح' });
    setSelectedItem(null);
    fetchData();
  };

  const handleUpdateItem = async (data: Record<string, string>) => {
    if (!editItem) return;
    const { error } = await supabase.from('inventory_items').update({
      name: data.name, category: data.category, quantity: parseInt(data.quantity) || 0,
      min_quantity: parseInt(data.min_quantity) || 5, unit: data.unit, location: data.location,
    }).eq('id', editItem.id);
    if (error) throw new Error(error.message);
    toast({ title: 'تم', description: 'تم تحديث الصنف' });
    setEditItem(null);
    fetchData();
  };

  const editFields: FormField[] = editItem ? [
    { name: 'name', label: 'اسم الصنف', type: 'text', required: true, placeholder: editItem.name },
    { name: 'category', label: 'التصنيف', type: 'select', required: true, options: [
      { value: 'إطارات', label: 'إطارات' }, { value: 'قطع غيار', label: 'قطع غيار' },
      { value: 'زيوت', label: 'زيوت' }, { value: 'كهرباء', label: 'كهرباء' },
    ]},
    { name: 'quantity', label: 'الكمية', type: 'number', required: true, placeholder: String(editItem.quantity) },
    { name: 'min_quantity', label: 'الحد الأدنى', type: 'number', required: true, placeholder: String(editItem.min_quantity) },
    { name: 'unit', label: 'الوحدة', type: 'text', placeholder: editItem.unit },
    { name: 'location', label: 'الموقع', type: 'text', placeholder: editItem.location },
  ] : [];

  return (
    <div className="space-y-6">
      <FormDialog open={showForm} onClose={() => setShowForm(false)} title="إضافة صنف جديد" fields={itemFields} onSubmit={handleAdd} />
      <FormDialog open={showMovementForm} onClose={() => { setShowMovementForm(false); setSelectedItem(null); }} title={`حركة مخزون - ${selectedItem?.name || ''}`} fields={movementFields} onSubmit={handleAddMovement} />
      {editItem && <FormDialog open={true} onClose={() => setEditItem(null)} title={`تعديل - ${editItem.name}`} fields={editFields} onSubmit={handleUpdateItem} />}
      {detailModal && <DetailModal open={true} onClose={() => setDetailModal(null)} title={detailModal.title} data={detailModal.data} />}

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
        <div className="stat-card"><p className="text-2xl font-bold font-heading">{inventory.reduce((s, i) => s + (i.quantity || 0), 0)}</p><p className="text-sm text-muted-foreground">إجمالي القطع</p></div>
        <div className="stat-card"><p className="text-2xl font-bold font-heading">{movements.length}</p><p className="text-sm text-muted-foreground">إجمالي الحركات</p></div>
      </div>

      <div className="flex gap-1 bg-muted/50 p-1 rounded-xl w-fit">
        <button onClick={() => setTab('inventory')} className={`px-5 py-2 rounded-lg text-sm font-medium transition-all ${tab === 'inventory' ? 'bg-card shadow-sm' : 'text-muted-foreground'}`}>المخزون</button>
        <button onClick={() => setTab('movements')} className={`px-5 py-2 rounded-lg text-sm font-medium transition-all ${tab === 'movements' ? 'bg-card shadow-sm' : 'text-muted-foreground'}`}>حركة المخزون</button>
      </div>

      {loading ? (
        <div className="flex justify-center py-12"><Loader2 className="w-8 h-8 animate-spin text-muted-foreground" /></div>
      ) : (
        <div className="bg-card rounded-xl border overflow-hidden">
          {tab === 'inventory' ? (
            <div className="overflow-x-auto">
              <table className="data-table">
                <thead><tr><th>الرمز</th><th>الصنف</th><th>التصنيف</th><th>الكمية</th><th>الحد الأدنى</th><th>الوحدة</th><th>الموقع</th><th>الباركود</th><th>إجراءات</th></tr></thead>
                <tbody>
                  {inventory.map(item => (
                    <tr key={item.id}>
                      <td className="font-medium text-primary">{item.code}</td><td className="font-medium">{item.name}</td>
                      <td><span className="badge-status bg-muted text-muted-foreground">{item.category || '-'}</span></td>
                      <td className={item.quantity <= (item.min_quantity || 5) ? 'text-destructive font-semibold' : ''}>{item.quantity}</td>
                      <td className="text-muted-foreground">{item.min_quantity}</td><td>{item.unit}</td><td>{item.location || '-'}</td>
                      <td>{item.barcode_id && <BarcodeDisplay value={item.barcode_id} width={110} height={35} />}</td>
                      <td>
                        <div className="flex items-center gap-1">
                          <button onClick={() => setDetailModal({ title: item.name, data: { 'الرمز': item.code, 'التصنيف': item.category || '-', 'الكمية': String(item.quantity), 'الحد الأدنى': String(item.min_quantity), 'الوحدة': item.unit || '-', 'الموقع': item.location || '-' } })} className="p-1.5 rounded-md hover:bg-muted"><Eye className="w-4 h-4 text-muted-foreground" /></button>
                          <button onClick={() => setEditItem(item)} className="p-1.5 rounded-md hover:bg-muted"><Edit className="w-4 h-4 text-muted-foreground" /></button>
                          <button onClick={() => { setSelectedItem(item); setShowMovementForm(true); }} className="p-1.5 rounded-md hover:bg-muted" title="حركة مخزون"><ArrowRightLeft className="w-4 h-4 text-muted-foreground" /></button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {inventory.length === 0 && <tr><td colSpan={9} className="text-center py-8 text-muted-foreground">لا توجد أصناف مسجلة</td></tr>}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="data-table">
                <thead><tr><th>الصنف</th><th>النوع</th><th>الكمية</th><th>المرجع</th><th>ملاحظات</th><th>التاريخ</th></tr></thead>
                <tbody>
                  {movements.map(m => (
                    <tr key={m.id}>
                      <td className="font-medium">{(m.inventory_items as any)?.name || '-'}</td>
                      <td><span className={`badge-status ${m.type === 'استلام' || m.type === 'إرجاع' ? 'badge-active' : m.type === 'تحويل' ? 'bg-info/10 text-info' : 'badge-pending'}`}>
                        {m.type === 'استلام' ? <ArrowDownRight className="w-3 h-3 inline ml-1" /> : <ArrowUpRight className="w-3 h-3 inline ml-1" />}{m.type}
                      </span></td>
                      <td className="font-medium">{m.quantity}</td><td className="text-primary">{m.reference || '-'}</td>
                      <td className="text-sm text-muted-foreground max-w-[200px] truncate">{m.notes || '-'}</td>
                      <td className="text-muted-foreground text-xs">{new Date(m.created_at).toLocaleDateString('ar-SA')}</td>
                    </tr>
                  ))}
                  {movements.length === 0 && <tr><td colSpan={6} className="text-center py-8 text-muted-foreground">لا توجد حركات مخزون</td></tr>}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Warehousing;
