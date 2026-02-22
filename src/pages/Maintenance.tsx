import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Search, Filter, Wrench, Clock, CheckCircle2, AlertTriangle, Eye, Edit, Ticket, MapPin, Loader2 } from 'lucide-react';
import FormDialog, { FormField } from '@/components/FormDialog';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

const workOrders = [
  { id: 'WO-001', truck: 'SH-005', type: 'صيانة دورية', desc: 'تغيير زيت وفلاتر', priority: 'عاجل', status: 'قيد التنفيذ', assigned: 'ورشة 1', date: '2024-03-15', parts: 3 },
  { id: 'WO-002', truck: 'SH-012', type: 'إصلاح', desc: 'إصلاح نظام الفرامل', priority: 'عاجل', status: 'بانتظار القطع', assigned: 'ورشة 2', date: '2024-03-14', parts: 5 },
  { id: 'WO-003', truck: 'SH-023', type: 'فحص', desc: 'فحص شامل للمحرك', priority: 'متوسط', status: 'مجدول', assigned: 'ورشة 1', date: '2024-03-16', parts: 0 },
  { id: 'WO-004', truck: 'SH-001', type: 'كفرات', desc: 'تبديل كفرات أمامية', priority: 'عادي', status: 'مكتمل', assigned: 'ورشة 3', date: '2024-03-13', parts: 2 },
  { id: 'WO-005', truck: 'SH-034', type: 'صيانة دورية', desc: 'صيانة 50,000 كم', priority: 'متوسط', status: 'قيد التنفيذ', assigned: 'ورشة 1', date: '2024-03-15', parts: 8 },
];

const stats = [
  { label: 'أوامر مفتوحة', value: '7', icon: Wrench, color: 'bg-accent/10 text-accent' },
  { label: 'قيد التنفيذ', value: '3', icon: Clock, color: 'bg-info/10 text-info' },
  { label: 'مكتملة هذا الشهر', value: '15', icon: CheckCircle2, color: 'bg-success/10 text-success' },
  { label: 'بانتظار القطع', value: '2', icon: AlertTriangle, color: 'bg-warning/10 text-warning' },
];

const statusStyle = (s: string) => { if (['مكتمل', 'resolved', 'closed'].includes(s)) return 'badge-active'; if (['قيد التنفيذ', 'مجدول', 'in_progress', 'assigned', 'open'].includes(s)) return 'badge-pending'; return 'badge-inactive'; };
const priorityStyle = (p: string) => { if (p === 'عاجل' || p === 'urgent') return 'text-destructive bg-destructive/10'; if (p === 'متوسط' || p === 'high') return 'text-warning bg-warning/10'; return 'text-info bg-info/10'; };

const ticketStatusLabels: Record<string, string> = {
  open: 'مفتوحة', assigned: 'معينة', in_progress: 'قيد التنفيذ',
  waiting_parts: 'بانتظار القطع', resolved: 'تم الحل', closed: 'مغلقة',
};
const ticketPriorityLabels: Record<string, string> = {
  urgent: 'عاجل', high: 'عالي', normal: 'عادي', low: 'منخفض',
};
const equipmentTypeLabels: Record<string, string> = {
  truck: 'شاحنة', trailer: 'مقطورة', generator: 'مولد كهربائي',
  forklift: 'رافعة شوكية', crane: 'رافعة', compressor: 'ضاغط هواء',
  pump: 'مضخة', other: 'أخرى',
};
const categoryLabels: Record<string, string> = {
  mechanical: 'ميكانيكي', electrical: 'كهربائي', tires: 'إطارات',
  body: 'هيكل', hydraulic: 'هيدروليك', ac: 'تكييف', other: 'أخرى',
};

const woFields: FormField[] = [
  { name: 'truck', label: 'الشاحنة', type: 'text', required: true, placeholder: 'رقم الشاحنة مثل SH-001' },
  { name: 'type', label: 'نوع العمل', type: 'select', required: true, options: [
    { value: 'صيانة دورية', label: 'صيانة دورية' }, { value: 'إصلاح', label: 'إصلاح' },
    { value: 'فحص', label: 'فحص' }, { value: 'كفرات', label: 'كفرات' },
  ]},
  { name: 'description', label: 'الوصف', type: 'textarea', required: true },
  { name: 'priority', label: 'الأولوية', type: 'select', required: true, options: [
    { value: 'عاجل', label: 'عاجل' }, { value: 'متوسط', label: 'متوسط' }, { value: 'عادي', label: 'عادي' },
  ]},
  { name: 'assigned_to', label: 'الورشة المسؤولة', type: 'text', placeholder: 'ورشة 1' },
];

const ticketFields: FormField[] = [
  { name: 'equipment_type', label: 'نوع المعدة', type: 'select', required: true, options: Object.entries(equipmentTypeLabels).map(([v, l]) => ({ value: v, label: l })) },
  { name: 'equipment_number', label: 'رقم المعدة', type: 'text', required: true, placeholder: 'مثال: SH-001 أو GEN-003' },
  { name: 'equipment_location', label: 'موقع المعدة', type: 'select', required: true, options: [
    { value: 'المستودع الرئيسي', label: 'المستودع الرئيسي' },
    { value: 'موقع العمل أ', label: 'موقع العمل أ' },
    { value: 'موقع العمل ب', label: 'موقع العمل ب' },
    { value: 'ورشة الصيانة', label: 'ورشة الصيانة' },
    { value: 'في الطريق', label: 'في الطريق' },
    { value: 'مقر الشركة', label: 'مقر الشركة' },
  ]},
  { name: 'issue_category', label: 'تصنيف العطل', type: 'select', required: true, options: Object.entries(categoryLabels).map(([v, l]) => ({ value: v, label: l })) },
  { name: 'priority', label: 'الأولوية', type: 'select', required: true, options: Object.entries(ticketPriorityLabels).map(([v, l]) => ({ value: v, label: l })) },
  { name: 'issue_description', label: 'وصف المشكلة', type: 'textarea', required: true, placeholder: 'اشرح المشكلة بالتفصيل...' },
  { name: 'assigned_to', label: 'تعيين إلى (اختياري)', type: 'text', placeholder: 'اسم الفني أو الورشة' },
];

interface TicketRow {
  id: string;
  ticket_number: string;
  equipment_type: string;
  equipment_number: string;
  equipment_location: string;
  issue_category: string;
  issue_description: string;
  priority: string;
  status: string;
  assigned_to: string | null;
  created_at: string;
}

const Maintenance = () => {
  const [showForm, setShowForm] = useState(false);
  const [showTicketForm, setShowTicketForm] = useState(false);
  const [activeTab, setActiveTab] = useState<'orders' | 'tickets'>('orders');
  const [tickets, setTickets] = useState<TicketRow[]>([]);
  const [loadingTickets, setLoadingTickets] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const fetchTickets = async () => {
    setLoadingTickets(true);
    const { data, error } = await supabase
      .from('maintenance_tickets')
      .select('*')
      .order('created_at', { ascending: false });
    if (!error && data) setTickets(data as TicketRow[]);
    setLoadingTickets(false);
  };

  useEffect(() => {
    if (activeTab === 'tickets') fetchTickets();
  }, [activeTab]);

  const handleAdd = async (data: Record<string, string>) => {
    const woNum = `WO-${Date.now().toString().slice(-6)}`;
    const { error } = await supabase.from('work_orders').insert({
      wo_number: woNum, type: data.type, description: data.description,
      priority: data.priority, assigned_to: data.assigned_to,
    });
    if (error) throw new Error(error.message);
    toast({ title: 'تم', description: 'تم إنشاء أمر العمل بنجاح' });
  };

  const handleAddTicket = async (data: Record<string, string>) => {
    const { data: user } = await supabase.auth.getUser();
    const ticketNum = `TKT-${Date.now().toString().slice(-6)}`;
    const { error } = await supabase.from('maintenance_tickets').insert({
      ticket_number: ticketNum,
      equipment_type: data.equipment_type,
      equipment_number: data.equipment_number,
      equipment_location: data.equipment_location,
      issue_category: data.issue_category,
      issue_description: data.issue_description,
      priority: data.priority,
      assigned_to: data.assigned_to || null,
      reported_by: user.user?.id,
    });
    if (error) throw new Error(error.message);
    toast({ title: 'تم', description: 'تم فتح تذكرة الصيانة بنجاح' });
    fetchTickets();
  };

  const handleStatusChange = async (ticketId: string, newStatus: string) => {
    const updateData: Record<string, unknown> = { status: newStatus };
    if (newStatus === 'resolved' || newStatus === 'closed') {
      updateData.resolved_at = new Date().toISOString();
    }
    const { error } = await supabase.from('maintenance_tickets').update(updateData).eq('id', ticketId);
    if (error) {
      toast({ title: 'خطأ', description: error.message, variant: 'destructive' });
    } else {
      toast({ title: 'تم', description: 'تم تحديث حالة التذكرة' });
      fetchTickets();
    }
  };

  return (
    <div className="space-y-6">
      <FormDialog open={showForm} onClose={() => setShowForm(false)} title="أمر عمل جديد" fields={woFields} onSubmit={handleAdd} />
      <FormDialog open={showTicketForm} onClose={() => setShowTicketForm(false)} title="فتح تذكرة صيانة" fields={ticketFields} onSubmit={handleAddTicket} />

      <div className="page-header flex items-center justify-between">
        <div><h1 className="page-title">الصيانة والورشة</h1><p className="page-subtitle">إدارة أوامر العمل وتذاكر الصيانة والإصلاحات</p></div>
        <div className="flex items-center gap-2">
          <button onClick={() => setShowTicketForm(true)} className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2.5 rounded-lg text-sm font-medium hover:opacity-90"><Ticket className="w-4 h-4" /> فتح تذكرة</button>
          <button onClick={() => setShowForm(true)} className="flex items-center gap-2 bg-accent text-accent-foreground px-4 py-2.5 rounded-lg text-sm font-medium hover:opacity-90"><Plus className="w-4 h-4" /> أمر عمل جديد</button>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map(s => (
          <div key={s.label} className="stat-card">
            <div className={`w-10 h-10 rounded-lg flex items-center justify-center mb-3 ${s.color}`}><s.icon className="w-5 h-5" /></div>
            <p className="text-2xl font-bold font-heading">{s.value}</p><p className="text-sm text-muted-foreground">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-muted/50 p-1 rounded-xl w-fit">
        <button onClick={() => setActiveTab('orders')} className={`px-5 py-2 rounded-lg text-sm font-medium transition-all ${activeTab === 'orders' ? 'bg-card shadow-sm text-foreground' : 'text-muted-foreground'}`}>أوامر العمل</button>
        <button onClick={() => setActiveTab('tickets')} className={`px-5 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2 ${activeTab === 'tickets' ? 'bg-card shadow-sm text-foreground' : 'text-muted-foreground'}`}>
          <Ticket className="w-4 h-4" /> تذاكر الصيانة
          {tickets.length > 0 && <span className="bg-primary text-primary-foreground text-xs rounded-full px-1.5 py-0.5">{tickets.filter(t => t.status !== 'closed' && t.status !== 'resolved').length}</span>}
        </button>
      </div>

      <div className="flex items-center gap-3 flex-wrap">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input type="text" placeholder={activeTab === 'orders' ? 'بحث في أوامر العمل...' : 'بحث في التذاكر...'} className="w-full bg-card border rounded-lg pr-10 pl-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20" />
        </div>
        <button className="flex items-center gap-2 px-3 py-2 border rounded-lg text-sm text-muted-foreground hover:bg-muted transition-colors"><Filter className="w-4 h-4" /> تصفية</button>
      </div>

      {activeTab === 'orders' ? (
        <div className="bg-card rounded-xl border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="data-table">
              <thead><tr><th>رقم الأمر</th><th>الشاحنة</th><th>النوع</th><th>الوصف</th><th>الأولوية</th><th>الحالة</th><th>الورشة</th><th>القطع</th><th>التاريخ</th><th>إجراءات</th></tr></thead>
              <tbody>
                {workOrders.map(wo => (
                  <tr key={wo.id}>
                    <td className="font-medium text-primary">{wo.id}</td><td className="font-medium">{wo.truck}</td><td>{wo.type}</td>
                    <td className="max-w-[200px] truncate">{wo.desc}</td>
                    <td><span className={`badge-status ${priorityStyle(wo.priority)}`}>{wo.priority}</span></td>
                    <td><span className={`badge-status ${statusStyle(wo.status)}`}>{wo.status}</span></td>
                    <td>{wo.assigned}</td><td>{wo.parts}</td><td className="text-muted-foreground">{wo.date}</td>
                    <td><div className="flex items-center gap-1"><button className="p-1.5 rounded-md hover:bg-muted"><Eye className="w-4 h-4 text-muted-foreground" /></button><button className="p-1.5 rounded-md hover:bg-muted"><Edit className="w-4 h-4 text-muted-foreground" /></button></div></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {loadingTickets ? (
            <div className="flex justify-center py-12"><Loader2 className="w-8 h-8 animate-spin text-muted-foreground" /></div>
          ) : tickets.length === 0 ? (
            <div className="bg-card rounded-xl border p-12 text-center">
              <Ticket className="w-12 h-12 mx-auto mb-3 text-muted-foreground/30" />
              <p className="font-semibold text-muted-foreground">لا توجد تذاكر صيانة</p>
              <p className="text-sm text-muted-foreground mt-1">اضغط على "فتح تذكرة" لإنشاء تذكرة صيانة جديدة</p>
              <button onClick={() => setShowTicketForm(true)} className="mt-4 px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:opacity-90">
                <Ticket className="w-4 h-4 inline ml-2" /> فتح تذكرة
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {tickets.map(ticket => (
                <div key={ticket.id} className="bg-card rounded-xl border p-5 hover:shadow-lg transition-shadow cursor-pointer" onClick={() => navigate(`/maintenance/ticket/${ticket.id}`)}>
                  <div className="flex items-center justify-between mb-3">
                    <span className="font-mono text-sm font-semibold text-primary">{ticket.ticket_number}</span>
                    <span className={`badge-status ${statusStyle(ticket.status)}`}>{ticketStatusLabels[ticket.status] || ticket.status}</span>
                  </div>

                  <div className="space-y-2.5">
                    <div className="flex items-center gap-2">
                      <Wrench className="w-4 h-4 text-muted-foreground shrink-0" />
                      <span className="text-sm">
                        <span className="font-medium">{equipmentTypeLabels[ticket.equipment_type] || ticket.equipment_type}</span>
                        {' - '}
                        <span className="text-primary font-semibold">{ticket.equipment_number}</span>
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-muted-foreground shrink-0" />
                      <span className="text-sm">{ticket.equipment_location}</span>
                    </div>

                    <div className="flex items-center gap-2 flex-wrap">
                      <span className={`badge-status ${priorityStyle(ticket.priority)}`}>{ticketPriorityLabels[ticket.priority] || ticket.priority}</span>
                      <span className="badge-status bg-muted text-muted-foreground">{categoryLabels[ticket.issue_category] || ticket.issue_category}</span>
                    </div>

                    <p className="text-sm text-muted-foreground line-clamp-2">{ticket.issue_description}</p>

                    {ticket.assigned_to && (
                      <p className="text-xs text-muted-foreground">معين إلى: <span className="font-medium text-foreground">{ticket.assigned_to}</span></p>
                    )}

                    <p className="text-xs text-muted-foreground">{new Date(ticket.created_at).toLocaleDateString('ar-SA', { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</p>
                  </div>

                  {/* Status change */}
                  {ticket.status !== 'closed' && ticket.status !== 'resolved' && (
                    <div className="mt-4 pt-3 border-t" onClick={e => e.stopPropagation()}>
                      <select
                        value={ticket.status}
                        onChange={e => handleStatusChange(ticket.id, e.target.value)}
                        className="w-full border rounded-lg px-3 py-2 text-sm bg-background focus:outline-none focus:ring-2 focus:ring-primary/20"
                      >
                        <option value="open">مفتوحة</option>
                        <option value="assigned">معينة</option>
                        <option value="in_progress">قيد التنفيذ</option>
                        <option value="waiting_parts">بانتظار القطع</option>
                        <option value="resolved">تم الحل</option>
                        <option value="closed">مغلقة</option>
                      </select>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Maintenance;
