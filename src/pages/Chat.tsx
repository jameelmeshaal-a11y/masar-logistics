import { useState, useEffect, useRef } from 'react';
import { Send, Search, Plus, Users, AtSign, Paperclip, Smile, Loader2, X } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';

const Chat = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [rooms, setRooms] = useState<any[]>([]);
  const [messages, setMessages] = useState<any[]>([]);
  const [selectedRoom, setSelectedRoom] = useState<any>(null);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [showNewRoom, setShowNewRoom] = useState(false);
  const [newRoomName, setNewRoomName] = useState('');
  const messagesEnd = useRef<HTMLDivElement>(null);

  const fetchRooms = async () => {
    const { data } = await supabase.from('chat_rooms').select('*').order('created_at', { ascending: false });
    if (data) {
      setRooms(data);
      if (!selectedRoom && data.length > 0) setSelectedRoom(data[0]);
    }
  };

  const fetchMessages = async (roomId: string) => {
    setLoading(true);
    const { data } = await supabase.from('chat_messages').select('*').eq('room_id', roomId).order('created_at');
    if (data) setMessages(data);
    setLoading(false);
    setTimeout(() => messagesEnd.current?.scrollIntoView({ behavior: 'smooth' }), 100);
  };

  useEffect(() => { fetchRooms(); }, []);
  useEffect(() => { if (selectedRoom) fetchMessages(selectedRoom.id); }, [selectedRoom]);

  // Realtime
  useEffect(() => {
    if (!selectedRoom) return;
    const channel = supabase.channel(`room-${selectedRoom.id}`).on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'chat_messages', filter: `room_id=eq.${selectedRoom.id}` }, payload => {
      setMessages(prev => [...prev, payload.new]);
      setTimeout(() => messagesEnd.current?.scrollIntoView({ behavior: 'smooth' }), 100);
    }).subscribe();
    return () => { supabase.removeChannel(channel); };
  }, [selectedRoom]);

  const handleSend = async () => {
    if (!message.trim() || !selectedRoom || !user) return;
    const { error } = await supabase.from('chat_messages').insert({ content: message, room_id: selectedRoom.id, sender_id: user.id });
    if (error) toast({ title: 'خطأ', description: error.message, variant: 'destructive' });
    else setMessage('');
  };

  const handleCreateRoom = async () => {
    if (!newRoomName.trim() || !user) return;
    const { data, error } = await supabase.from('chat_rooms').insert({ name: newRoomName, created_by: user.id }).select().single();
    if (error) toast({ title: 'خطأ', description: error.message, variant: 'destructive' });
    else {
      setShowNewRoom(false);
      setNewRoomName('');
      fetchRooms();
      if (data) setSelectedRoom(data);
    }
  };

  return (
    <div className="space-y-6">
      <div className="page-header">
        <h1 className="page-title">المحادثات</h1>
        <p className="page-subtitle">تواصل مع فريق العمل</p>
      </div>

      <div className="bg-card rounded-xl border overflow-hidden" style={{ height: 'calc(100vh - 220px)' }}>
        <div className="flex h-full">
          {/* Contacts sidebar */}
          <div className="w-80 border-l flex flex-col">
            <div className="p-3 border-b">
              <div className="relative">
                <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input type="text" placeholder="بحث في المحادثات..." className="w-full bg-muted/50 rounded-lg pr-10 pl-4 py-2 text-sm focus:outline-none" />
              </div>
            </div>
            <div className="flex-1 overflow-y-auto">
              {rooms.map(room => (
                <button key={room.id} onClick={() => setSelectedRoom(room)}
                  className={`w-full flex items-center gap-3 px-4 py-3 text-right hover:bg-muted/30 transition-colors border-b border-border/30
                    ${selectedRoom?.id === room.id ? 'bg-muted/50' : ''}`}>
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                    <Users className="w-4 h-4 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm truncate">{room.name}</p>
                    <p className="text-xs text-muted-foreground truncate mt-0.5">{room.type === 'group' ? 'مجموعة' : 'محادثة'}</p>
                  </div>
                </button>
              ))}
              {rooms.length === 0 && <p className="text-center py-8 text-sm text-muted-foreground">لا توجد محادثات</p>}
            </div>
            <div className="p-3 border-t">
              {showNewRoom ? (
                <div className="flex gap-2">
                  <input value={newRoomName} onChange={e => setNewRoomName(e.target.value)} placeholder="اسم المحادثة..."
                    className="flex-1 bg-muted/50 rounded-lg px-3 py-2 text-sm focus:outline-none" onKeyDown={e => e.key === 'Enter' && handleCreateRoom()} />
                  <button onClick={handleCreateRoom} className="px-3 py-2 bg-accent text-accent-foreground rounded-lg text-sm font-medium">إنشاء</button>
                  <button onClick={() => setShowNewRoom(false)} className="p-2 rounded-lg hover:bg-muted"><X className="w-4 h-4" /></button>
                </div>
              ) : (
                <button onClick={() => setShowNewRoom(true)} className="w-full flex items-center justify-center gap-2 py-2 rounded-lg bg-accent text-accent-foreground text-sm font-medium hover:opacity-90">
                  <Plus className="w-4 h-4" /> محادثة جديدة
                </button>
              )}
            </div>
          </div>

          {/* Chat area */}
          <div className="flex-1 flex flex-col">
            {selectedRoom ? (
              <>
                <div className="px-5 py-3 border-b flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center">
                    <Users className="w-4 h-4 text-primary" />
                  </div>
                  <div>
                    <p className="font-semibold text-sm">{selectedRoom.name}</p>
                    <p className="text-xs text-muted-foreground">{messages.length} رسالة</p>
                  </div>
                </div>

                <div className="flex-1 overflow-y-auto p-5 space-y-4">
                  {loading && <div className="flex justify-center"><Loader2 className="w-6 h-6 animate-spin text-muted-foreground" /></div>}
                  {messages.map(msg => (
                    <div key={msg.id} className={`flex ${msg.sender_id === user?.id ? 'justify-start' : 'justify-end'}`}>
                      <div className={`max-w-[70%] rounded-2xl px-4 py-2.5 ${
                        msg.sender_id === user?.id ? 'bg-accent text-accent-foreground rounded-br-md' : 'bg-muted rounded-bl-md'
                      }`}>
                        <p className="text-sm">{msg.content}</p>
                        <p className={`text-[11px] mt-1 ${msg.sender_id === user?.id ? 'opacity-70' : 'text-muted-foreground'}`}>
                          {new Date(msg.created_at).toLocaleTimeString('ar-SA', { hour: '2-digit', minute: '2-digit' })}
                        </p>
                      </div>
                    </div>
                  ))}
                  <div ref={messagesEnd} />
                </div>

                <div className="p-4 border-t">
                  <div className="flex items-center gap-2">
                    <input type="text" value={message} onChange={e => setMessage(e.target.value)}
                      onKeyDown={e => e.key === 'Enter' && handleSend()}
                      placeholder="اكتب رسالتك..."
                      className="flex-1 bg-muted/50 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20" />
                    <button onClick={handleSend} className="p-2.5 rounded-lg bg-accent text-accent-foreground hover:opacity-90">
                      <Send className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center text-muted-foreground">
                <p>اختر محادثة أو أنشئ محادثة جديدة</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chat;
