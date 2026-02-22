import { useState } from 'react';
import { Plus, Search, Filter, Download, Send, FileText, Eye, Edit, Trash2 } from 'lucide-react';

const tabs = ['طلبات الاحتياج', 'عروض الأسعار', 'أوامر الشراء', 'الموردين', 'الفواتير'];

const requisitions = [
  { id: 'REQ-001', department: 'التشغيل', item: 'إطارات 315/80', qty: 12, status: 'معتمد', date: '2024-03-15', requester: 'أحمد محمد' },
  { id: 'REQ-002', department: 'الصيانة', item: 'فلتر زيت - كاتربيلر', qty: 20, status: 'قيد المراجعة', date: '2024-03-14', requester: 'خالد العمري' },
  { id: 'REQ-003', department: 'الإدارة', item: 'بطارية 200 أمبير', qty: 5, status: 'جديد', date: '2024-03-13', requester: 'فهد السالم' },
  { id: 'REQ-004', department: 'التشغيل', item: 'زيت محرك 15W-40', qty: 100, status: 'مرفوض', date: '2024-03-12', requester: 'سعد الحربي' },
  { id: 'REQ-005', department: 'الصيانة', item: 'ديسكات فرامل', qty: 8, status: 'معتمد', date: '2024-03-11', requester: 'عبدالله الشهري' },
];

const purchaseOrders = [
  { id: 'PO-0142', vendor: 'شركة الإطارات المتقدمة', total: '45,000', items: 4, status: 'معتمد', date: '2024-03-15' },
  { id: 'PO-0141', vendor: 'مؤسسة قطع الغيار', total: '12,800', items: 8, status: 'قيد المراجعة', date: '2024-03-14' },
  { id: 'PO-0140', vendor: 'شركة الزيوت الوطنية', total: '8,500', items: 3, status: 'تم التوريد', date: '2024-03-13' },
];

const vendors = [
  { id: 'V-001', name: 'شركة الإطارات المتقدمة', tax: '300012345600003', phone: '0512345678', orders: 25, rating: 4.5 },
  { id: 'V-002', name: 'مؤسسة قطع الغيار', tax: '300098765400003', phone: '0598765432', orders: 18, rating: 3.8 },
  { id: 'V-003', name: 'شركة الزيوت الوطنية', tax: '300055667700003', phone: '0555667788', orders: 32, rating: 4.2 },
];

const invoices = [
  { id: 'INV-001', vendor: 'شركة الإطارات المتقدمة', amount: '45,000', vat: '6,750', total: '51,750', status: 'مدفوعة', date: '2024-03-15' },
  { id: 'INV-002', vendor: 'مؤسسة قطع الغيار', amount: '12,800', vat: '1,920', total: '14,720', status: 'غير مدفوعة', date: '2024-03-14' },
  { id: 'INV-003', vendor: 'شركة الزيوت الوطنية', amount: '8,500', vat: '1,275', total: '9,775', status: 'مدفوعة جزئياً', date: '2024-03-13' },
];

const statusStyle = (s: string) => {
  if (['معتمد', 'تم التوريد', 'مدفوعة'].includes(s)) return 'badge-active';
  if (['قيد المراجعة', 'جديد', 'مدفوعة جزئياً'].includes(s)) return 'badge-pending';
  return 'badge-inactive';
};

const Procurement = () => {
  const [activeTab, setActiveTab] = useState(0);

  return (
    <div className="space-y-6">
      <div className="page-header flex items-center justify-between">
        <div>
          <h1 className="page-title">إدارة المشتريات</h1>
          <p className="page-subtitle">إدارة كاملة لدورة المشتريات من الاحتياج حتى السداد</p>
        </div>
        <button className="flex items-center gap-2 bg-accent text-accent-foreground px-4 py-2.5 rounded-lg text-sm font-medium hover:opacity-90 transition-opacity">
          <Plus className="w-4 h-4" />
          إضافة جديد
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-muted/50 p-1 rounded-xl overflow-x-auto">
        {tabs.map((tab, i) => (
          <button
            key={tab}
            onClick={() => setActiveTab(i)}
            className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all
              ${activeTab === i ? 'bg-card text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'}`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Search/Filter bar */}
      <div className="flex items-center gap-3 flex-wrap">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input type="text" placeholder="بحث..." className="w-full bg-card border rounded-lg pr-10 pl-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20" />
        </div>
        <button className="flex items-center gap-2 px-3 py-2 border rounded-lg text-sm text-muted-foreground hover:bg-muted transition-colors">
          <Filter className="w-4 h-4" /> تصفية
        </button>
        <button className="flex items-center gap-2 px-3 py-2 border rounded-lg text-sm text-muted-foreground hover:bg-muted transition-colors">
          <Download className="w-4 h-4" /> تصدير
        </button>
      </div>

      {/* Tables */}
      <div className="bg-card rounded-xl border overflow-hidden">
        {activeTab === 0 && (
          <div className="overflow-x-auto">
            <table className="data-table">
              <thead><tr><th>رقم الطلب</th><th>القسم</th><th>الصنف</th><th>الكمية</th><th>مقدم الطلب</th><th>التاريخ</th><th>الحالة</th><th>إجراءات</th></tr></thead>
              <tbody>
                {requisitions.map(r => (
                  <tr key={r.id}>
                    <td className="font-medium text-primary">{r.id}</td>
                    <td>{r.department}</td>
                    <td>{r.item}</td>
                    <td>{r.qty}</td>
                    <td>{r.requester}</td>
                    <td className="text-muted-foreground">{r.date}</td>
                    <td><span className={`badge-status ${statusStyle(r.status)}`}>{r.status}</span></td>
                    <td>
                      <div className="flex items-center gap-1">
                        <button className="p-1.5 rounded-md hover:bg-muted"><Eye className="w-4 h-4 text-muted-foreground" /></button>
                        <button className="p-1.5 rounded-md hover:bg-muted"><Edit className="w-4 h-4 text-muted-foreground" /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === 1 && (
          <div className="p-8 text-center text-muted-foreground">
            <FileText className="w-12 h-12 mx-auto mb-3 opacity-30" />
            <p className="font-medium">عروض الأسعار</p>
            <p className="text-sm mt-1">إرسال طلبات عروض أسعار للموردين ومقارنة العروض</p>
            <button className="mt-4 px-4 py-2 bg-accent text-accent-foreground rounded-lg text-sm font-medium">إنشاء طلب عرض سعر</button>
          </div>
        )}

        {activeTab === 2 && (
          <div className="overflow-x-auto">
            <table className="data-table">
              <thead><tr><th>رقم الأمر</th><th>المورد</th><th>عدد الأصناف</th><th>الإجمالي (ر.س)</th><th>التاريخ</th><th>الحالة</th><th>إجراءات</th></tr></thead>
              <tbody>
                {purchaseOrders.map(po => (
                  <tr key={po.id}>
                    <td className="font-medium text-primary">{po.id}</td>
                    <td>{po.vendor}</td>
                    <td>{po.items}</td>
                    <td>{po.total}</td>
                    <td className="text-muted-foreground">{po.date}</td>
                    <td><span className={`badge-status ${statusStyle(po.status)}`}>{po.status}</span></td>
                    <td>
                      <div className="flex items-center gap-1">
                        <button className="p-1.5 rounded-md hover:bg-muted"><Eye className="w-4 h-4 text-muted-foreground" /></button>
                        <button className="p-1.5 rounded-md hover:bg-muted"><Send className="w-4 h-4 text-muted-foreground" /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === 3 && (
          <div className="overflow-x-auto">
            <table className="data-table">
              <thead><tr><th>الرمز</th><th>اسم المورد</th><th>الرقم الضريبي</th><th>الهاتف</th><th>عدد الطلبات</th><th>التقييم</th><th>إجراءات</th></tr></thead>
              <tbody>
                {vendors.map(v => (
                  <tr key={v.id}>
                    <td className="font-medium">{v.id}</td>
                    <td className="font-medium text-primary">{v.name}</td>
                    <td className="text-muted-foreground text-xs">{v.tax}</td>
                    <td>{v.phone}</td>
                    <td>{v.orders}</td>
                    <td>
                      <div className="flex items-center gap-1">
                        <span className="text-warning">★</span>
                        <span className="text-sm">{v.rating}</span>
                      </div>
                    </td>
                    <td>
                      <div className="flex items-center gap-1">
                        <button className="p-1.5 rounded-md hover:bg-muted"><Eye className="w-4 h-4 text-muted-foreground" /></button>
                        <button className="p-1.5 rounded-md hover:bg-muted"><Edit className="w-4 h-4 text-muted-foreground" /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === 4 && (
          <div className="overflow-x-auto">
            <table className="data-table">
              <thead><tr><th>رقم الفاتورة</th><th>المورد</th><th>المبلغ</th><th>الضريبة</th><th>الإجمالي</th><th>التاريخ</th><th>الحالة</th><th>إجراءات</th></tr></thead>
              <tbody>
                {invoices.map(inv => (
                  <tr key={inv.id}>
                    <td className="font-medium text-primary">{inv.id}</td>
                    <td>{inv.vendor}</td>
                    <td>{inv.amount}</td>
                    <td>{inv.vat}</td>
                    <td className="font-semibold">{inv.total}</td>
                    <td className="text-muted-foreground">{inv.date}</td>
                    <td><span className={`badge-status ${statusStyle(inv.status)}`}>{inv.status}</span></td>
                    <td>
                      <div className="flex items-center gap-1">
                        <button className="p-1.5 rounded-md hover:bg-muted"><Eye className="w-4 h-4 text-muted-foreground" /></button>
                        <button className="p-1.5 rounded-md hover:bg-muted"><Send className="w-4 h-4 text-muted-foreground" /></button>
                      </div>
                    </td>
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

export default Procurement;
