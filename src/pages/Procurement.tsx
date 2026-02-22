import { useState, useEffect } from 'react';
import { Plus, Search, Filter, Download, Send, FileText, Eye, Edit, X, Loader2 } from 'lucide-react';
import FormDialog, { FormField } from '@/components/FormDialog';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

const tabs = ['طلبات الاحتياج', 'عروض الأسعار', 'أوامر الشراء', 'الموردين', 'الفواتير'];

const statusStyle = (s: string) => {
  if (['معتمد', 'تم التوريد', 'مدفوعة', 'approved', 'delivered', 'paid'].includes(s)) return 'badge-active';
  if (['قيد المراجعة', 'جديد', 'مدفوعة جزئياً', 'pending', 'draft', 'partial'].includes(s)) return 'badge-pending';
  return 'badge-inactive';
};

const statusLabels: Record<string, string> = {
  pending: 'قيد المراجعة', approved: 'معتمد', rejected: 'مرفوض', draft: 'مسودة',
  delivered: 'تم التوريد', paid: 'مدفوعة', partial: 'مدفوعة جزئياً', unpaid: 'غير مدفوعة',
  active: 'نشط', inactive: 'غير نشط',
};

const reqFields: FormField[] = [
  { name: 'department', label: 'القسم', type: 'select', required: true, options: [
    { value: 'التشغيل', label: 'التشغيل' }, { value: 'الصيانة', label: 'الصيانة' }, { value: 'الإدارة', label: 'الإدارة' },
  ]},
  { name: 'item_name', label: 'الصنف', type: 'text', required: true, placeholder: 'اسم الصنف المطلوب' },
  { name: 'quantity', label: 'الكمية', type: 'number', required: true, placeholder: '1' },
  { name: 'notes', label: 'ملاحظات', type: 'textarea', placeholder: 'ملاحظات إضافية...' },
];

const rfqFields: FormField[] = [
  { name: 'title', label: 'عنوان طلب عرض السعر', type: 'text', required: true, placeholder: 'مثال: طلب عرض سعر إطارات' },
  { name: 'vendor_name', label: 'المورد', type: 'text', required: true },
  { name: 'items', label: 'الأصناف المطلوبة', type: 'textarea', required: true, placeholder: 'اسم الصنف - الكمية\nمثال: إطار 315/80 - 12 حبة' },
  { name: 'deadline', label: 'آخر موعد للرد', type: 'date', required: true },
  { name: 'notes', label: 'ملاحظات', type: 'textarea', placeholder: 'شروط أو ملاحظات إضافية...' },
];

const poFields: FormField[] = [
  { name: 'vendor_name', label: 'المورد', type: 'text', required: true },
  { name: 'items_desc', label: 'الأصناف', type: 'textarea', required: true, placeholder: 'اسم الصنف - الكمية - السعر' },
  { name: 'total_amount', label: 'الإجمالي (ر.س)', type: 'number', required: true },
  { name: 'notes', label: 'ملاحظات', type: 'textarea' },
];

const vendorFields: FormField[] = [
  { name: 'name', label: 'اسم المورد', type: 'text', required: true },
  { name: 'tax_number', label: 'الرقم الضريبي', type: 'text', dir: 'ltr' },
  { name: 'phone', label: 'الهاتف', type: 'tel', dir: 'ltr' },
  { name: 'email', label: 'البريد الإلكتروني', type: 'email', dir: 'ltr' },
  { name: 'address', label: 'العنوان', type: 'text' },
];

const invoiceFields: FormField[] = [
  { name: 'invoice_number', label: 'رقم الفاتورة', type: 'text', required: true, dir: 'ltr' },
  { name: 'vendor_name', label: 'المورد', type: 'text', required: true },
  { name: 'amount', label: 'المبلغ (ر.س)', type: 'number', required: true },
  { name: 'due_date', label: 'تاريخ الاستحقاق', type: 'date' },
];

// Detail modal component
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

const Procurement = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [showReqForm, setShowReqForm] = useState(false);
  const [showRfqForm, setShowRfqForm] = useState(false);
  const [showPoForm, setShowPoForm] = useState(false);
  const [showVendorForm, setShowVendorForm] = useState(false);
  const [showInvoiceForm, setShowInvoiceForm] = useState(false);
  const [detailModal, setDetailModal] = useState<{ title: string; data: Record<string, string> } | null>(null);

  // DB data
  const [requisitions, setRequisitions] = useState<any[]>([]);
  const [purchaseOrders, setPurchaseOrders] = useState<any[]>([]);
  const [vendors, setVendors] = useState<any[]>([]);
  const [invoices, setInvoices] = useState<any[]>([]);
  const [inventoryItems, setInventoryItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const { toast } = useToast();

  const fetchData = async () => {
    setLoading(true);
    const [reqRes, poRes, vendorRes, invRes, itemRes] = await Promise.all([
      supabase.from('requisitions').select('*').order('created_at', { ascending: false }),
      supabase.from('purchase_orders').select('*').order('created_at', { ascending: false }),
      supabase.from('vendors').select('*').order('created_at', { ascending: false }),
      supabase.from('invoices').select('*').order('created_at', { ascending: false }),
      supabase.from('inventory_items').select('code, name').order('name'),
    ]);
    if (reqRes.data) setRequisitions(reqRes.data);
    if (poRes.data) setPurchaseOrders(poRes.data);
    if (vendorRes.data) setVendors(vendorRes.data);
    if (invRes.data) setInvoices(invRes.data);
    if (itemRes.data) setInventoryItems(itemRes.data);
    setLoading(false);
  };

  useEffect(() => { fetchData(); }, []);

  const handleAddReq = async (data: Record<string, string>) => {
    const { data: user } = await supabase.auth.getUser();
    const reqNum = `REQ-${Date.now().toString().slice(-6)}`;
    const { error } = await supabase.from('requisitions').insert({
      req_number: reqNum, department: data.department, item_name: data.item_name,
      quantity: parseInt(data.quantity) || 1, notes: data.notes, requested_by: user.user?.id,
    });
    if (error) throw new Error(error.message);
    toast({ title: 'تم', description: 'تم إضافة طلب الاحتياج بنجاح' });
    fetchData();
  };

  const handleAddRfq = async (data: Record<string, string>) => {
    // Store as a purchase order with status draft (as RFQ)
    const poNum = `RFQ-${Date.now().toString().slice(-6)}`;
    const { error } = await supabase.from('purchase_orders').insert({
      po_number: poNum, status: 'draft', notes: `عرض سعر: ${data.title}\nالأصناف: ${data.items}\nآخر موعد: ${data.deadline}\n${data.notes || ''}`,
      total_amount: 0,
    });
    if (error) throw new Error(error.message);
    toast({ title: 'تم', description: 'تم إنشاء طلب عرض السعر بنجاح' });
    fetchData();
  };

  const handleAddPo = async (data: Record<string, string>) => {
    const poNum = `PO-${Date.now().toString().slice(-6)}`;
    const { error } = await supabase.from('purchase_orders').insert({
      po_number: poNum, total_amount: parseFloat(data.total_amount) || 0,
      notes: data.notes, status: 'pending',
    });
    if (error) throw new Error(error.message);
    toast({ title: 'تم', description: 'تم إنشاء أمر الشراء بنجاح' });
    fetchData();
  };

  const handleAddVendor = async (data: Record<string, string>) => {
    const { error } = await supabase.from('vendors').insert({
      name: data.name, tax_number: data.tax_number, phone: data.phone, email: data.email, address: data.address,
    });
    if (error) throw new Error(error.message);
    toast({ title: 'تم', description: 'تم إضافة المورد بنجاح' });
    fetchData();
  };

  const handleAddInvoice = async (data: Record<string, string>) => {
    const { error } = await supabase.from('invoices').insert({
      invoice_number: data.invoice_number, amount: parseFloat(data.amount) || 0,
      due_date: data.due_date || null, status: 'pending',
    });
    if (error) throw new Error(error.message);
    toast({ title: 'تم', description: 'تم إضافة الفاتورة بنجاح' });
    fetchData();
  };

  const handleAdd = () => {
    if (activeTab === 0) setShowReqForm(true);
    else if (activeTab === 1) setShowRfqForm(true);
    else if (activeTab === 2) setShowPoForm(true);
    else if (activeTab === 3) setShowVendorForm(true);
    else if (activeTab === 4) setShowInvoiceForm(true);
  };

  const handleUpdateStatus = async (table: 'requisitions' | 'purchase_orders' | 'vendors' | 'invoices', id: string, status: string) => {
    const { error } = await supabase.from(table).update({ status } as any).eq('id', id);
    if (error) toast({ title: 'خطأ', description: error.message, variant: 'destructive' });
    else { toast({ title: 'تم', description: 'تم تحديث الحالة' }); fetchData(); }
  };

  const addLabels = ['إضافة طلب احتياج', 'إنشاء طلب عرض سعر', 'إنشاء أمر شراء', 'إضافة مورد', 'إضافة فاتورة'];

  return (
    <div className="space-y-6">
      <FormDialog open={showReqForm} onClose={() => setShowReqForm(false)} title="إضافة طلب احتياج" fields={reqFields} onSubmit={handleAddReq} />
      <FormDialog open={showRfqForm} onClose={() => setShowRfqForm(false)} title="إنشاء طلب عرض سعر" fields={rfqFields} onSubmit={handleAddRfq} />
      <FormDialog open={showPoForm} onClose={() => setShowPoForm(false)} title="إنشاء أمر شراء" fields={poFields} onSubmit={handleAddPo} />
      <FormDialog open={showVendorForm} onClose={() => setShowVendorForm(false)} title="إضافة مورد جديد" fields={vendorFields} onSubmit={handleAddVendor} />
      <FormDialog open={showInvoiceForm} onClose={() => setShowInvoiceForm(false)} title="إضافة فاتورة" fields={invoiceFields} onSubmit={handleAddInvoice} />
      {detailModal && <DetailModal open={true} onClose={() => setDetailModal(null)} title={detailModal.title} data={detailModal.data} />}

      <div className="page-header flex items-center justify-between">
        <div>
          <h1 className="page-title">إدارة المشتريات</h1>
          <p className="page-subtitle">إدارة كاملة لدورة المشتريات من الاحتياج حتى السداد</p>
        </div>
        <button onClick={handleAdd} className="flex items-center gap-2 bg-accent text-accent-foreground px-4 py-2.5 rounded-lg text-sm font-medium hover:opacity-90 transition-opacity">
          <Plus className="w-4 h-4" /> {addLabels[activeTab]}
        </button>
      </div>

      <div className="flex gap-1 bg-muted/50 p-1 rounded-xl overflow-x-auto">
        {tabs.map((tab, i) => (
          <button key={tab} onClick={() => setActiveTab(i)}
            className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all
              ${activeTab === i ? 'bg-card text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'}`}>
            {tab}
          </button>
        ))}
      </div>

      <div className="flex items-center gap-3 flex-wrap">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input type="text" value={searchTerm} onChange={e => setSearchTerm(e.target.value)} placeholder="بحث..." className="w-full bg-card border rounded-lg pr-10 pl-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20" />
        </div>
        <button className="flex items-center gap-2 px-3 py-2 border rounded-lg text-sm text-muted-foreground hover:bg-muted transition-colors"><Download className="w-4 h-4" /> تصدير</button>
      </div>

      {loading ? (
        <div className="flex justify-center py-12"><Loader2 className="w-8 h-8 animate-spin text-muted-foreground" /></div>
      ) : (
        <div className="bg-card rounded-xl border overflow-hidden">
          {/* Requisitions */}
          {activeTab === 0 && (
            <div className="overflow-x-auto">
              <table className="data-table">
                <thead><tr><th>رقم الطلب</th><th>القسم</th><th>الصنف</th><th>الكمية</th><th>التاريخ</th><th>الحالة</th><th>إجراءات</th></tr></thead>
                <tbody>
                  {requisitions.map(r => (
                    <tr key={r.id}>
                      <td className="font-medium text-primary">{r.req_number}</td><td>{r.department}</td><td>{r.item_name}</td><td>{r.quantity}</td>
                      <td className="text-muted-foreground text-xs">{new Date(r.created_at).toLocaleDateString('ar-SA')}</td>
                      <td><span className={`badge-status ${statusStyle(r.status)}`}>{statusLabels[r.status] || r.status}</span></td>
                      <td>
                        <div className="flex items-center gap-1">
                          <button onClick={() => setDetailModal({ title: `طلب ${r.req_number}`, data: { 'القسم': r.department, 'الصنف': r.item_name, 'الكمية': String(r.quantity), 'الحالة': statusLabels[r.status] || r.status, 'ملاحظات': r.notes || '-' } })} className="p-1.5 rounded-md hover:bg-muted"><Eye className="w-4 h-4 text-muted-foreground" /></button>
                          {r.status === 'pending' && (
                            <>
                              <button onClick={() => handleUpdateStatus('requisitions', r.id, 'approved')} className="px-2 py-1 text-xs bg-success/10 text-success rounded hover:bg-success/20">اعتماد</button>
                              <button onClick={() => handleUpdateStatus('requisitions', r.id, 'rejected')} className="px-2 py-1 text-xs bg-destructive/10 text-destructive rounded hover:bg-destructive/20">رفض</button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                  {requisitions.length === 0 && <tr><td colSpan={7} className="text-center py-8 text-muted-foreground">لا توجد طلبات احتياج</td></tr>}
                </tbody>
              </table>
            </div>
          )}

          {/* RFQ */}
          {activeTab === 1 && (
            <div className="overflow-x-auto">
              <table className="data-table">
                <thead><tr><th>الرقم</th><th>التفاصيل</th><th>الحالة</th><th>التاريخ</th><th>إجراءات</th></tr></thead>
                <tbody>
                  {purchaseOrders.filter(po => po.po_number?.startsWith('RFQ')).map(rfq => (
                    <tr key={rfq.id}>
                      <td className="font-medium text-primary">{rfq.po_number}</td>
                      <td className="max-w-[300px] truncate text-sm">{rfq.notes?.split('\n')[0] || '-'}</td>
                      <td><span className={`badge-status ${statusStyle(rfq.status)}`}>{statusLabels[rfq.status] || rfq.status}</span></td>
                      <td className="text-muted-foreground text-xs">{new Date(rfq.created_at).toLocaleDateString('ar-SA')}</td>
                      <td>
                        <div className="flex items-center gap-1">
                          <button onClick={() => setDetailModal({ title: `عرض سعر ${rfq.po_number}`, data: { 'التفاصيل': rfq.notes || '-', 'الحالة': statusLabels[rfq.status] || rfq.status } })} className="p-1.5 rounded-md hover:bg-muted"><Eye className="w-4 h-4 text-muted-foreground" /></button>
                          {rfq.status === 'draft' && (
                            <button onClick={() => handleUpdateStatus('purchase_orders', rfq.id, 'pending')} className="px-2 py-1 text-xs bg-info/10 text-info rounded hover:bg-info/20">إرسال</button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                  {purchaseOrders.filter(po => po.po_number?.startsWith('RFQ')).length === 0 && (
                    <tr><td colSpan={5} className="text-center py-8">
                      <FileText className="w-10 h-10 mx-auto mb-2 text-muted-foreground/30" />
                      <p className="text-muted-foreground">لا توجد طلبات عروض أسعار</p>
                      <button onClick={() => setShowRfqForm(true)} className="mt-3 px-4 py-2 bg-accent text-accent-foreground rounded-lg text-sm font-medium">إنشاء طلب عرض سعر</button>
                    </td></tr>
                  )}
                </tbody>
              </table>
            </div>
          )}

          {/* Purchase Orders */}
          {activeTab === 2 && (
            <div className="overflow-x-auto">
              <table className="data-table">
                <thead><tr><th>رقم الأمر</th><th>الإجمالي (ر.س)</th><th>التاريخ</th><th>الحالة</th><th>إجراءات</th></tr></thead>
                <tbody>
                  {purchaseOrders.filter(po => po.po_number?.startsWith('PO')).map(po => (
                    <tr key={po.id}>
                      <td className="font-medium text-primary">{po.po_number}</td>
                      <td>{po.total_amount?.toLocaleString() || '0'}</td>
                      <td className="text-muted-foreground text-xs">{new Date(po.created_at).toLocaleDateString('ar-SA')}</td>
                      <td><span className={`badge-status ${statusStyle(po.status)}`}>{statusLabels[po.status] || po.status}</span></td>
                      <td>
                        <div className="flex items-center gap-1">
                          <button onClick={() => setDetailModal({ title: `أمر شراء ${po.po_number}`, data: { 'الإجمالي': `${po.total_amount?.toLocaleString() || 0} ر.س`, 'الحالة': statusLabels[po.status] || po.status, 'ملاحظات': po.notes || '-' } })} className="p-1.5 rounded-md hover:bg-muted"><Eye className="w-4 h-4 text-muted-foreground" /></button>
                          {po.status === 'pending' && (
                            <>
                              <button onClick={() => handleUpdateStatus('purchase_orders', po.id, 'approved')} className="px-2 py-1 text-xs bg-success/10 text-success rounded hover:bg-success/20">اعتماد</button>
                              <button onClick={() => handleUpdateStatus('purchase_orders', po.id, 'rejected')} className="px-2 py-1 text-xs bg-destructive/10 text-destructive rounded hover:bg-destructive/20">رفض</button>
                            </>
                          )}
                          {po.status === 'approved' && (
                            <button onClick={() => handleUpdateStatus('purchase_orders', po.id, 'delivered')} className="px-2 py-1 text-xs bg-info/10 text-info rounded hover:bg-info/20">تم التوريد</button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                  {purchaseOrders.filter(po => po.po_number?.startsWith('PO')).length === 0 && <tr><td colSpan={5} className="text-center py-8 text-muted-foreground">لا توجد أوامر شراء</td></tr>}
                </tbody>
              </table>
            </div>
          )}

          {/* Vendors */}
          {activeTab === 3 && (
            <div className="overflow-x-auto">
              <table className="data-table">
                <thead><tr><th>اسم المورد</th><th>الرقم الضريبي</th><th>الهاتف</th><th>البريد</th><th>الحالة</th><th>التقييم</th><th>إجراءات</th></tr></thead>
                <tbody>
                  {vendors.map(v => (
                    <tr key={v.id}>
                      <td className="font-medium text-primary">{v.name}</td>
                      <td className="text-muted-foreground text-xs">{v.tax_number || '-'}</td><td>{v.phone || '-'}</td><td>{v.email || '-'}</td>
                      <td><span className={`badge-status ${statusStyle(v.status)}`}>{statusLabels[v.status] || v.status}</span></td>
                      <td><div className="flex items-center gap-1"><span className="text-warning">★</span><span className="text-sm">{v.rating || 0}</span></div></td>
                      <td>
                        <div className="flex items-center gap-1">
                          <button onClick={() => setDetailModal({ title: v.name, data: { 'الرقم الضريبي': v.tax_number || '-', 'الهاتف': v.phone || '-', 'البريد': v.email || '-', 'العنوان': v.address || '-', 'التقييم': `${v.rating || 0}/5` } })} className="p-1.5 rounded-md hover:bg-muted"><Eye className="w-4 h-4 text-muted-foreground" /></button>
                          {v.status === 'active' ? (
                            <button onClick={() => handleUpdateStatus('vendors', v.id, 'inactive')} className="px-2 py-1 text-xs bg-destructive/10 text-destructive rounded">إيقاف</button>
                          ) : (
                            <button onClick={() => handleUpdateStatus('vendors', v.id, 'active')} className="px-2 py-1 text-xs bg-success/10 text-success rounded">تفعيل</button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                  {vendors.length === 0 && <tr><td colSpan={7} className="text-center py-8 text-muted-foreground">لا يوجد موردين</td></tr>}
                </tbody>
              </table>
            </div>
          )}

          {/* Invoices */}
          {activeTab === 4 && (
            <div className="overflow-x-auto">
              <table className="data-table">
                <thead><tr><th>رقم الفاتورة</th><th>المبلغ (ر.س)</th><th>الضريبة (15%)</th><th>الإجمالي</th><th>تاريخ الاستحقاق</th><th>الحالة</th><th>إجراءات</th></tr></thead>
                <tbody>
                  {invoices.map(inv => {
                    const vat = inv.amount * 0.15;
                    const total = inv.amount + vat;
                    return (
                      <tr key={inv.id}>
                        <td className="font-medium text-primary">{inv.invoice_number}</td>
                        <td>{inv.amount?.toLocaleString()}</td><td>{vat.toLocaleString()}</td>
                        <td className="font-semibold">{total.toLocaleString()}</td>
                        <td className="text-muted-foreground">{inv.due_date || '-'}</td>
                        <td><span className={`badge-status ${statusStyle(inv.status)}`}>{statusLabels[inv.status] || inv.status}</span></td>
                        <td>
                          <div className="flex items-center gap-1">
                            <button onClick={() => setDetailModal({ title: `فاتورة ${inv.invoice_number}`, data: { 'المبلغ': `${inv.amount?.toLocaleString()} ر.س`, 'الضريبة': `${vat.toLocaleString()} ر.س`, 'الإجمالي': `${total.toLocaleString()} ر.س`, 'الحالة': statusLabels[inv.status] || inv.status } })} className="p-1.5 rounded-md hover:bg-muted"><Eye className="w-4 h-4 text-muted-foreground" /></button>
                            {inv.status === 'pending' && (
                              <button onClick={() => handleUpdateStatus('invoices', inv.id, 'paid')} className="px-2 py-1 text-xs bg-success/10 text-success rounded">تسديد</button>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                  {invoices.length === 0 && <tr><td colSpan={7} className="text-center py-8 text-muted-foreground">لا توجد فواتير</td></tr>}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Procurement;
