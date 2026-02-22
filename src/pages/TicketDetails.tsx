import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowRight, Wrench, MapPin, Clock, MessageSquare, History, Send, Loader2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';

const statusLabels: Record<string, string> = {
  open: 'مفتوحة', assigned: 'معينة', in_progress: 'قيد التنفيذ',
  waiting_parts: 'بانتظار القطع', resolved: 'تم الحل', closed: 'مغلقة',
};
const priorityLabels: Record<string, string> = {
  urgent: 'عاجل', high: 'عالي', normal: 'عادي', low: 'منخفض',
};
const equipmentLabels: Record<string, string> = {
  truck: 'شاحنة', trailer: 'مقطورة', generator: 'مولد كهربائي',
  forklift: 'رافعة شوكية', crane: 'رافعة', compressor: 'ضاغط هواء',
  pump: 'مضخة', other: 'أخرى',
};
const categoryLabels: Record<string, string> = {
  mechanical: 'ميكانيكي', electrical: 'كهربائي', tires: 'إطارات',
  body: 'هيكل', hydraulic: 'هيدروليك', ac: 'تكييف', other: 'أخرى',
};

const statusStyle = (s: string) => {
  if (['resolved', 'closed'].includes(s)) return 'bg-success/10 text-success';
  if (['in_progress', 'assigned', 'open'].includes(s)) return 'bg-info/10 text-info';
  return 'bg-warning/10 text-warning';
};
const priorityStyle = (p: string) => {
  if (p === 'urgent') return 'bg-destructive/10 text-destructive';
  if (p === 'high') return 'bg-warning/10 text-warning';
  return 'bg-info/10 text-info';
};

interface Comment { id: string; user_id: string; content: string; created_at: string; }
interface HistoryEntry { id: string; action: string; old_value: string | null; new_value: string | null; created_at: string; }
interface Ticket {
  id: string; ticket_number: string; equipment_type: string; equipment_number: string;
  equipment_location: string; issue_category: string; issue_description: string;
  priority: string; status: string; assigned_to: string | null; created_at: string;
  resolved_at: string | null; resolution_notes: string | null;
  estimated_cost: number | null; actual_cost: number | null;
  reported_by: string | null;
}

const TicketDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const [ticket, setTicket] = useState<Ticket | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'comments' | 'history'>('comments');
  const [submitting, setSubmitting] = useState(false);

  const fetchAll = async () => {
    if (!id) return;
    setLoading(true);
    const [tRes, cRes, hRes] = await Promise.all([
      supabase.from('maintenance_tickets').select('*').eq('id', id).single(),
      supabase.from('ticket_comments').select('*').eq('ticket_id', id).order('created_at', { ascending: true }),
      supabase.from('ticket_history').select('*').eq('ticket_id', id).order('created_at', { ascending: false }),
    ]);
    if (tRes.data) setTicket(tRes.data as Ticket);
    if (cRes.data) setComments(cRes.data as Comment[]);
    if (hRes.data) setHistory(hRes.data as HistoryEntry[]);
    setLoading(false);
  };

  useEffect(() => { fetchAll(); }, [id]);

  const addComment = async () => {
    if (!newComment.trim() || !user || !id) return;
    setSubmitting(true);
    const { error } = await supabase.from('ticket_comments').insert({
      ticket_id: id, user_id: user.id, content: newComment.trim(),
    });
    if (error) {
      toast({ title: 'خطأ', description: error.message, variant: 'destructive' });
    } else {
      // Log history
      await supabase.from('ticket_history').insert({
        ticket_id: id, user_id: user.id, action: 'تعليق جديد', new_value: newComment.trim(),
      });
      setNewComment('');
      fetchAll();
    }
    setSubmitting(false);
  };

  const handleStatusChange = async (newStatus: string) => {
    if (!ticket || !user || !id) return;
    const oldStatus = ticket.status;
    const updateData: Record<string, unknown> = { status: newStatus };
    if (newStatus === 'resolved' || newStatus === 'closed') {
      updateData.resolved_at = new Date().toISOString();
    }
    const { error } = await supabase.from('maintenance_tickets').update(updateData).eq('id', id);
    if (error) {
      toast({ title: 'خطأ', description: error.message, variant: 'destructive' });
    } else {
      // Log history
      await supabase.from('ticket_history').insert({
        ticket_id: id, user_id: user.id, action: 'تغيير الحالة',
        old_value: statusLabels[oldStatus] || oldStatus,
        new_value: statusLabels[newStatus] || newStatus,
      });
      // Create notification
      if (ticket.reported_by) {
        await supabase.from('notifications').insert({
          user_id: ticket.reported_by, title: 'تحديث تذكرة صيانة',
          message: `تم تغيير حالة التذكرة ${ticket.ticket_number} إلى ${statusLabels[newStatus] || newStatus}`,
          type: 'ticket', related_type: 'maintenance_ticket', related_id: id,
        });
      }
      toast({ title: 'تم', description: 'تم تحديث الحالة' });
      fetchAll();
    }
  };

  if (loading) return <div className="flex justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-muted-foreground" /></div>;
  if (!ticket) return <div className="text-center py-20"><p className="text-muted-foreground">التذكرة غير موجودة</p></div>;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <button onClick={() => navigate('/maintenance')} className="p-2 rounded-lg hover:bg-muted">
          <ArrowRight className="w-5 h-5" />
        </button>
        <div className="flex-1">
          <h1 className="text-xl font-bold font-heading">تذكرة {ticket.ticket_number}</h1>
          <p className="text-sm text-muted-foreground">تفاصيل تذكرة الصيانة</p>
        </div>
        <span className={`badge-status px-3 py-1.5 text-sm ${statusStyle(ticket.status)}`}>
          {statusLabels[ticket.status] || ticket.status}
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main info */}
        <div className="lg:col-span-2 space-y-6">
          {/* Details card */}
          <div className="bg-card rounded-xl border p-5 space-y-4">
            <h2 className="font-semibold text-lg">معلومات التذكرة</h2>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center gap-2">
                <Wrench className="w-4 h-4 text-muted-foreground" />
                <div>
                  <p className="text-xs text-muted-foreground">المعدة</p>
                  <p className="text-sm font-medium">{equipmentLabels[ticket.equipment_type] || ticket.equipment_type} - {ticket.equipment_number}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-muted-foreground" />
                <div>
                  <p className="text-xs text-muted-foreground">الموقع</p>
                  <p className="text-sm font-medium">{ticket.equipment_location}</p>
                </div>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">التصنيف</p>
                <p className="text-sm font-medium">{categoryLabels[ticket.issue_category] || ticket.issue_category}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">الأولوية</p>
                <span className={`badge-status text-xs ${priorityStyle(ticket.priority)}`}>
                  {priorityLabels[ticket.priority] || ticket.priority}
                </span>
              </div>
              {ticket.assigned_to && (
                <div>
                  <p className="text-xs text-muted-foreground">معين إلى</p>
                  <p className="text-sm font-medium">{ticket.assigned_to}</p>
                </div>
              )}
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-muted-foreground" />
                <div>
                  <p className="text-xs text-muted-foreground">تاريخ الإنشاء</p>
                  <p className="text-sm">{new Date(ticket.created_at).toLocaleDateString('ar-SA', { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</p>
                </div>
              </div>
            </div>
            <div>
              <p className="text-xs text-muted-foreground mb-1">وصف المشكلة</p>
              <p className="text-sm bg-muted/30 rounded-lg p-3">{ticket.issue_description}</p>
            </div>
            {ticket.resolution_notes && (
              <div>
                <p className="text-xs text-muted-foreground mb-1">ملاحظات الحل</p>
                <p className="text-sm bg-success/5 border border-success/20 rounded-lg p-3">{ticket.resolution_notes}</p>
              </div>
            )}
          </div>

          {/* Tabs: Comments & History */}
          <div className="bg-card rounded-xl border">
            <div className="flex border-b">
              <button onClick={() => setActiveTab('comments')}
                className={`flex items-center gap-2 px-5 py-3 text-sm font-medium border-b-2 transition-colors ${activeTab === 'comments' ? 'border-primary text-primary' : 'border-transparent text-muted-foreground'}`}>
                <MessageSquare className="w-4 h-4" /> التعليقات ({comments.length})
              </button>
              <button onClick={() => setActiveTab('history')}
                className={`flex items-center gap-2 px-5 py-3 text-sm font-medium border-b-2 transition-colors ${activeTab === 'history' ? 'border-primary text-primary' : 'border-transparent text-muted-foreground'}`}>
                <History className="w-4 h-4" /> السجل ({history.length})
              </button>
            </div>

            <div className="p-5">
              {activeTab === 'comments' ? (
                <div className="space-y-4">
                  {comments.length === 0 && <p className="text-sm text-muted-foreground text-center py-4">لا توجد تعليقات بعد</p>}
                  {comments.map(c => (
                    <div key={c.id} className="flex gap-3">
                      <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                        <span className="text-xs font-bold text-primary">م</span>
                      </div>
                      <div className="flex-1">
                        <div className="bg-muted/30 rounded-lg p-3">
                          <p className="text-sm">{c.content}</p>
                        </div>
                        <p className="text-[10px] text-muted-foreground mt-1">
                          {new Date(c.created_at).toLocaleDateString('ar-SA', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                        </p>
                      </div>
                    </div>
                  ))}
                  {/* Add comment */}
                  <div className="flex gap-2 pt-2">
                    <input
                      value={newComment}
                      onChange={e => setNewComment(e.target.value)}
                      onKeyDown={e => e.key === 'Enter' && addComment()}
                      placeholder="اكتب تعليق..."
                      className="flex-1 bg-background border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                    />
                    <button onClick={addComment} disabled={submitting || !newComment.trim()}
                      className="p-2.5 bg-primary text-primary-foreground rounded-lg hover:opacity-90 disabled:opacity-50">
                      {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  {history.length === 0 && <p className="text-sm text-muted-foreground text-center py-4">لا يوجد سجل</p>}
                  {history.map(h => (
                    <div key={h.id} className="flex gap-3 items-start">
                      <div className="w-2 h-2 rounded-full bg-primary mt-2 shrink-0" />
                      <div className="flex-1">
                        <p className="text-sm font-medium">{h.action}</p>
                        {h.old_value && h.new_value && (
                          <p className="text-xs text-muted-foreground">
                            <span className="line-through text-destructive/70">{h.old_value}</span>
                            {' → '}
                            <span className="text-success font-medium">{h.new_value}</span>
                          </p>
                        )}
                        {!h.old_value && h.new_value && (
                          <p className="text-xs text-muted-foreground truncate max-w-md">{h.new_value}</p>
                        )}
                        <p className="text-[10px] text-muted-foreground mt-0.5">
                          {new Date(h.created_at).toLocaleDateString('ar-SA', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          {/* Status change */}
          {ticket.status !== 'closed' && (
            <div className="bg-card rounded-xl border p-5">
              <h3 className="font-semibold text-sm mb-3">تغيير الحالة</h3>
              <div className="space-y-2">
                {Object.entries(statusLabels).map(([key, label]) => (
                  <button key={key} onClick={() => handleStatusChange(key)}
                    disabled={key === ticket.status}
                    className={`w-full text-right px-3 py-2 rounded-lg text-sm transition-colors ${key === ticket.status ? 'bg-primary/10 text-primary font-medium' : 'hover:bg-muted text-muted-foreground'}`}>
                    {label}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Cost info */}
          <div className="bg-card rounded-xl border p-5">
            <h3 className="font-semibold text-sm mb-3">التكاليف</h3>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">التكلفة المقدرة</span>
                <span className="font-medium">{ticket.estimated_cost ? `${ticket.estimated_cost} ر.س` : '-'}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">التكلفة الفعلية</span>
                <span className="font-medium">{ticket.actual_cost ? `${ticket.actual_cost} ر.س` : '-'}</span>
              </div>
            </div>
          </div>

          {ticket.resolved_at && (
            <div className="bg-success/5 border border-success/20 rounded-xl p-5">
              <p className="text-sm font-medium text-success">تم الحل</p>
              <p className="text-xs text-muted-foreground mt-1">
                {new Date(ticket.resolved_at).toLocaleDateString('ar-SA', { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TicketDetails;
