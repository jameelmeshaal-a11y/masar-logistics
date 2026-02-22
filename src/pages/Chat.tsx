import { useState } from 'react';
import { Send, Search, Plus, Users, AtSign, Paperclip, Smile } from 'lucide-react';

const contacts = [
  { id: 1, name: 'فريق التشغيل', type: 'group', lastMessage: 'تم تسليم الشحنة بنجاح', time: '10:30 ص', unread: 3 },
  { id: 2, name: 'أحمد المالكي', type: 'user', lastMessage: 'أحتاج موافقة على أمر الشراء', time: '9:45 ص', unread: 1 },
  { id: 3, name: 'فريق الصيانة', type: 'group', lastMessage: 'الشاحنة SH-005 جاهزة', time: 'أمس', unread: 0 },
  { id: 4, name: 'خالد العمري', type: 'user', lastMessage: 'شكراً على التحديث', time: 'أمس', unread: 0 },
  { id: 5, name: 'فريق المستودعات', type: 'group', lastMessage: 'تم استلام الشحنة من المورد', time: 'الأحد', unread: 0 },
];

const messages = [
  { id: 1, sender: 'أحمد المالكي', text: 'السلام عليكم، أحتاج موافقة على أمر الشراء PO-0143 لشراء إطارات', time: '9:30 ص', isMine: false },
  { id: 2, sender: 'أنت', text: 'وعليكم السلام، كم عدد الإطارات المطلوبة؟', time: '9:35 ص', isMine: true },
  { id: 3, sender: 'أحمد المالكي', text: '16 إطار ميشلان 315/80 للشاحنات SH-012 و SH-034', time: '9:38 ص', isMine: false },
  { id: 4, sender: 'أحمد المالكي', text: '@مدير_المشتريات يرجى مراجعة العرض المرفق', time: '9:40 ص', isMine: false, mention: true },
  { id: 5, sender: 'أنت', text: 'تم المراجعة والموافقة. يرجى المتابعة مع المورد', time: '9:45 ص', isMine: true },
];

const Chat = () => {
  const [selectedContact, setSelectedContact] = useState(contacts[1]);
  const [message, setMessage] = useState('');

  return (
    <div className="space-y-6">
      <div className="page-header">
        <h1 className="page-title">المحادثات</h1>
        <p className="page-subtitle">تواصل مع فريق العمل وإمكانية المنشن للأفراد والمجموعات</p>
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
              {contacts.map(contact => (
                <button
                  key={contact.id}
                  onClick={() => setSelectedContact(contact)}
                  className={`w-full flex items-center gap-3 px-4 py-3 text-right hover:bg-muted/30 transition-colors border-b border-border/30
                    ${selectedContact.id === contact.id ? 'bg-muted/50' : ''}`}
                >
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                    {contact.type === 'group' ? <Users className="w-4 h-4 text-primary" /> : <span className="text-sm font-semibold text-primary">{contact.name.charAt(0)}</span>}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <p className="font-medium text-sm truncate">{contact.name}</p>
                      <span className="text-[11px] text-muted-foreground shrink-0">{contact.time}</span>
                    </div>
                    <p className="text-xs text-muted-foreground truncate mt-0.5">{contact.lastMessage}</p>
                  </div>
                  {contact.unread > 0 && (
                    <span className="w-5 h-5 rounded-full bg-accent text-accent-foreground text-[11px] flex items-center justify-center font-medium shrink-0">{contact.unread}</span>
                  )}
                </button>
              ))}
            </div>
            <div className="p-3 border-t">
              <button className="w-full flex items-center justify-center gap-2 py-2 rounded-lg bg-accent text-accent-foreground text-sm font-medium hover:opacity-90">
                <Plus className="w-4 h-4" /> محادثة جديدة
              </button>
            </div>
          </div>

          {/* Chat area */}
          <div className="flex-1 flex flex-col">
            <div className="px-5 py-3 border-b flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center">
                <span className="text-sm font-semibold text-primary">{selectedContact.name.charAt(0)}</span>
              </div>
              <div>
                <p className="font-semibold text-sm">{selectedContact.name}</p>
                <p className="text-xs text-muted-foreground">متصل الآن</p>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-5 space-y-4">
              {messages.map(msg => (
                <div key={msg.id} className={`flex ${msg.isMine ? 'justify-start' : 'justify-end'}`}>
                  <div className={`max-w-[70%] rounded-2xl px-4 py-2.5 ${
                    msg.isMine ? 'bg-accent text-accent-foreground rounded-br-md' : 'bg-muted rounded-bl-md'
                  }`}>
                    {!msg.isMine && <p className="text-xs font-medium mb-1 opacity-70">{msg.sender}</p>}
                    <p className="text-sm">{msg.mention ? (
                      <>
                        <span className="text-info font-medium">@مدير_المشتريات</span> {msg.text.replace('@مدير_المشتريات ', '')}
                      </>
                    ) : msg.text}</p>
                    <p className={`text-[11px] mt-1 ${msg.isMine ? 'opacity-70' : 'text-muted-foreground'}`}>{msg.time}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="p-4 border-t">
              <div className="flex items-center gap-2">
                <button className="p-2 rounded-lg hover:bg-muted"><Paperclip className="w-5 h-5 text-muted-foreground" /></button>
                <button className="p-2 rounded-lg hover:bg-muted"><AtSign className="w-5 h-5 text-muted-foreground" /></button>
                <input
                  type="text"
                  value={message}
                  onChange={e => setMessage(e.target.value)}
                  placeholder="اكتب رسالتك... استخدم @ للمنشن"
                  className="flex-1 bg-muted/50 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
                <button className="p-2.5 rounded-lg bg-accent text-accent-foreground hover:opacity-90">
                  <Send className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chat;
