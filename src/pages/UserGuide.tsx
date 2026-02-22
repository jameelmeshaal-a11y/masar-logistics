import { useState } from 'react';
import { BookOpen, ChevronDown, ChevronLeft, Search, Play, FileText, HelpCircle, ShoppingCart, Truck, Wrench, Warehouse as WarehouseIcon, DollarSign, BarChart3, Shield, Users, MessageCircle, Settings } from 'lucide-react';

interface GuideStep {
  step: string;
  detail: string;
}

interface GuideItem {
  title: string;
  content: string;
  steps?: GuideStep[];
}

interface GuideSection {
  title: string;
  icon: React.ElementType;
  color: string;
  items: GuideItem[];
}

const guideSections: GuideSection[] = [
  {
    title: 'إدارة المشتريات',
    icon: ShoppingCart,
    color: 'bg-blue-500/10 text-blue-600',
    items: [
      { title: 'إنشاء طلب احتياج', content: 'إنشاء طلب احتياج لصنف من المستودع أو صنف جديد', steps: [
        { step: 'الدخول لقسم المشتريات', detail: 'من القائمة الجانبية اختر "إدارة المشتريات"' },
        { step: 'اختيار طلبات الاحتياج', detail: 'اضغط على تبويب "طلبات الاحتياج"' },
        { step: 'إضافة طلب جديد', detail: 'اضغط زر "إضافة طلب احتياج" وحدد القسم والصنف والكمية' },
        { step: 'متابعة حالة الطلب', detail: 'يمكنك متابعة حالة الطلب (جديد/قيد المراجعة/معتمد/مرفوض)' },
      ]},
      { title: 'إنشاء طلب عرض سعر', content: 'إرسال طلبات عروض أسعار للموردين ومقارنة العروض', steps: [
        { step: 'فتح عروض الأسعار', detail: 'انتقل لتبويب "عروض الأسعار"' },
        { step: 'إنشاء طلب جديد', detail: 'اضغط "إنشاء طلب عرض سعر" وحدد الأصناف والمورد وآخر موعد' },
        { step: 'إرسال ومتابعة', detail: 'يتم إرسال الطلب للمورد ويمكنك متابعة الحالة' },
      ]},
      { title: 'إنشاء أمر شراء', content: 'إنشاء أمر شراء بعد اعتماد طلب الاحتياج', steps: [
        { step: 'فتح أوامر الشراء', detail: 'انتقل لتبويب "أوامر الشراء"' },
        { step: 'إنشاء أمر جديد', detail: 'حدد المورد والأصناف والمبلغ الإجمالي' },
        { step: 'دورة الاعتماد', detail: 'أمر الشراء يمر بمراحل: مسودة ← قيد المراجعة ← معتمد ← تم التوريد' },
      ]},
      { title: 'إدارة الموردين', content: 'إضافة وإدارة بيانات الموردين وتقييمهم', steps: [
        { step: 'إضافة مورد', detail: 'اضغط "إضافة مورد" وأدخل البيانات (الاسم، الرقم الضريبي، الهاتف)' },
        { step: 'تقييم الموردين', detail: 'يمكنك تقييم الموردين بناءً على جودة الخدمة والالتزام' },
        { step: 'إيقاف/تفعيل', detail: 'يمكنك إيقاف مورد مؤقتاً أو إعادة تفعيله' },
      ]},
      { title: 'تسجيل الفواتير', content: 'تسجيل فواتير الموردين وتتبع حالة الدفع', steps: [
        { step: 'إضافة فاتورة', detail: 'أدخل رقم الفاتورة والمبلغ وتاريخ الاستحقاق' },
        { step: 'الضريبة', detail: 'يتم احتساب ضريبة القيمة المضافة (15%) تلقائياً' },
        { step: 'تتبع السداد', detail: 'متابعة حالة الفاتورة (غير مدفوعة/مدفوعة جزئياً/مدفوعة)' },
      ]},
    ]
  },
  {
    title: 'إدارة الأسطول',
    icon: Truck,
    color: 'bg-emerald-500/10 text-emerald-600',
    items: [
      { title: 'إضافة شاحنة جديدة', content: 'تسجيل شاحنة جديدة في النظام', steps: [
        { step: 'فتح إدارة الأسطول', detail: 'من القائمة الجانبية اختر "إدارة الأسطول"' },
        { step: 'إضافة شاحنة', detail: 'اضغط "إضافة شاحنة" وأدخل البيانات (اللوحة، الموديل، النوع، السنة)' },
        { step: 'عرض الشاحنات', detail: 'يمكنك التبديل بين العرض كشبكة أو كقائمة' },
        { step: 'التصفية', detail: 'فلترة الشاحنات حسب النوع أو الحالة' },
      ]},
      { title: 'إدارة الكفرات', content: 'تتبع الكفرات ودورة حياتها', steps: [
        { step: 'تسجيل كفر', detail: 'أدخل الرقم التسلسلي والماركة والمقاس والموقع' },
        { step: 'ربط بشاحنة', detail: 'يتم ربط الكفر بشاحنة محددة وموقع محدد' },
        { step: 'متابعة الاستهلاك', detail: 'تتبع الكيلومترات لكل كفر وحالته' },
      ]},
    ]
  },
  {
    title: 'الصيانة والورشة',
    icon: Wrench,
    color: 'bg-orange-500/10 text-orange-600',
    items: [
      { title: 'فتح تذكرة صيانة', content: 'الإبلاغ عن عطل أو مشكلة في معدة', steps: [
        { step: 'فتح تذكرة', detail: 'اضغط "فتح تذكرة" وحدد نوع المعدة ورقمها وموقعها' },
        { step: 'وصف المشكلة', detail: 'اشرح المشكلة بالتفصيل وحدد التصنيف والأولوية' },
        { step: 'متابعة التذكرة', detail: 'تابع حالة التذكرة: مفتوحة ← معينة ← قيد التنفيذ ← تم الحل' },
        { step: 'التعليقات', detail: 'يمكنك إضافة تعليقات وملاحظات على التذكرة' },
      ]},
      { title: 'إنشاء أمر عمل', content: 'إنشاء أمر عمل للورشة', steps: [
        { step: 'أمر عمل جديد', detail: 'حدد الشاحنة ونوع العمل والأولوية والوصف' },
        { step: 'تعيين ورشة', detail: 'حدد الورشة المسؤولة والفني المعين' },
        { step: 'ربط بالقطع', detail: 'يتم ربط أمر العمل بقطع الغيار المطلوبة' },
      ]},
    ]
  },
  {
    title: 'المستودعات',
    icon: WarehouseIcon,
    color: 'bg-purple-500/10 text-purple-600',
    items: [
      { title: 'إدارة المخزون', content: 'إضافة وتعديل الأصناف في المستودع', steps: [
        { step: 'إضافة صنف', detail: 'أدخل رمز الصنف واسمه وتصنيفه وكميته وحده الأدنى' },
        { step: 'تعديل صنف', detail: 'اضغط أيقونة التعديل لتحديث بيانات أي صنف' },
        { step: 'تنبيهات', detail: 'النظام ينبهك عند وصول الكمية للحد الأدنى' },
      ]},
      { title: 'حركة المخزون', content: 'تسجيل حركات الصرف والاستلام والتحويل', steps: [
        { step: 'صرف', detail: 'صرف كمية من صنف مع تحديد المرجع (أمر عمل/أمر شراء)' },
        { step: 'استلام', detail: 'تسجيل استلام بضاعة جديدة من المورد' },
        { step: 'تحويل', detail: 'تحويل أصناف بين المشاريع أو المستودعات المختلفة' },
        { step: 'إرجاع', detail: 'تسجيل إرجاع أصناف للمستودع' },
      ]},
    ]
  },
  {
    title: 'الإدارة المالية',
    icon: DollarSign,
    color: 'bg-green-500/10 text-green-600',
    items: [
      { title: 'تسجيل دفعة', content: 'تسجيل مدفوعات للموردين', steps: [
        { step: 'تسجيل دفعة', detail: 'حدد المورد والمبلغ وطريقة الدفع (تحويل/شيك/نقدي)' },
        { step: 'تأكيد الدفع', detail: 'بعد تنفيذ الدفعة اضغط "تأكيد الدفع" لتحديث الحالة' },
      ]},
      { title: 'كشف حساب مورد', content: 'طباعة كشف حساب تفصيلي لأي مورد', steps: [
        { step: 'فتح كشف الحساب', detail: 'اضغط "كشف حساب" من صفحة الإدارة المالية' },
        { step: 'الطباعة', detail: 'اضغط زر الطباعة لطباعة الكشف أو حفظه كملف PDF' },
      ]},
    ]
  },
  {
    title: 'التقارير',
    icon: BarChart3,
    color: 'bg-indigo-500/10 text-indigo-600',
    items: [
      { title: 'عرض التقارير', content: 'تقارير شاملة لجميع أقسام النظام', steps: [
        { step: 'اختيار التقرير', detail: 'اختر نوع التقرير المطلوب من القائمة' },
        { step: 'تحديد الفترة', detail: 'حدد الفترة الزمنية والفلاتر المطلوبة' },
        { step: 'التصدير', detail: 'يمكنك تصدير التقارير أو مشاركتها' },
      ]},
    ]
  },
  {
    title: 'إدارة المستخدمين',
    icon: Users,
    color: 'bg-rose-500/10 text-rose-600',
    items: [
      { title: 'الصلاحيات والأدوار', content: 'نظام صلاحيات متعدد المستويات', steps: [
        { step: 'الأدوار المتاحة', detail: 'مدير النظام - مدير - مشاهد - سائق - أمين مستودع - فني صيانة' },
        { step: 'تعيين دور', detail: 'يقوم مدير النظام بتعيين الأدوار للمستخدمين الجدد' },
        { step: 'مصفوفة الصلاحيات', detail: 'راجع مصفوفة الصلاحيات لمعرفة صلاحيات كل دور في كل قسم' },
      ]},
    ]
  },
  {
    title: 'ربط الأنظمة',
    icon: Settings,
    color: 'bg-slate-500/10 text-slate-600',
    items: [
      { title: 'ربط نظام سلاسة', content: 'ربط النظام مع سلاسة لمزامنة البيانات', steps: [
        { step: 'إعداد الاتصال', detail: 'أدخل رابط السيرفر ومفتاح API' },
        { step: 'اختبار الاتصال', detail: 'اضغط "اختبار الاتصال" للتأكد من صحة البيانات' },
        { step: 'المزامنة', detail: 'اختر الجداول المطلوب مزامنتها وحدد الوضع (يدوي/تلقائي)' },
      ]},
    ]
  },
];

const UserGuide = () => {
  const [expandedSection, setExpandedSection] = useState<number | null>(0);
  const [expandedItem, setExpandedItem] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredSections = searchTerm
    ? guideSections.map(s => ({
        ...s,
        items: s.items.filter(i => i.title.includes(searchTerm) || i.content.includes(searchTerm) || i.steps?.some(st => st.step.includes(searchTerm) || st.detail.includes(searchTerm)))
      })).filter(s => s.items.length > 0)
    : guideSections;

  return (
    <div className="space-y-6">
      <div className="page-header">
        <h1 className="page-title">دليل الاستخدام</h1>
        <p className="page-subtitle">شرح مفصّل وخطوة بخطوة لجميع وظائف النظام مع أمثلة عملية</p>
      </div>

      <div className="relative max-w-md">
        <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <input type="text" value={searchTerm} onChange={e => setSearchTerm(e.target.value)} placeholder="بحث في الدليل..." className="w-full bg-card border rounded-lg pr-10 pl-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-3">
          {filteredSections.map((section, si) => (
            <div key={si} className="bg-card rounded-xl border overflow-hidden">
              <button
                onClick={() => setExpandedSection(expandedSection === si ? null : si)}
                className="w-full flex items-center gap-3 px-5 py-4 text-right hover:bg-muted/30 transition-colors"
              >
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${section.color}`}>
                  <section.icon className="w-5 h-5" />
                </div>
                <span className="flex-1 font-semibold font-heading">{section.title}</span>
                <span className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded-full">{section.items.length} موضوع</span>
                <ChevronDown className={`w-5 h-5 text-muted-foreground transition-transform ${expandedSection === si ? 'rotate-180' : ''}`} />
              </button>
              {expandedSection === si && (
                <div className="border-t">
                  {section.items.map((item, ii) => (
                    <div key={ii} className="border-b last:border-0">
                      <button
                        onClick={() => setExpandedItem(expandedItem === `${si}-${ii}` ? null : `${si}-${ii}`)}
                        className="w-full flex items-center gap-3 px-5 py-3 text-right hover:bg-muted/20"
                      >
                        <FileText className="w-4 h-4 text-accent shrink-0" />
                        <span className="flex-1 text-sm font-medium">{item.title}</span>
                        <ChevronLeft className={`w-4 h-4 text-muted-foreground transition-transform ${expandedItem === `${si}-${ii}` ? '-rotate-90' : ''}`} />
                      </button>
                      {expandedItem === `${si}-${ii}` && (
                        <div className="px-5 pb-4 pr-12 space-y-3">
                          <p className="text-sm text-muted-foreground leading-relaxed">{item.content}</p>
                          {item.steps && (
                            <div className="space-y-2">
                              {item.steps.map((step, i) => (
                                <div key={i} className="flex gap-3 items-start">
                                  <div className="w-6 h-6 rounded-full bg-accent/10 text-accent flex items-center justify-center shrink-0 text-xs font-bold mt-0.5">{i + 1}</div>
                                  <div>
                                    <p className="text-sm font-medium">{step.step}</p>
                                    <p className="text-xs text-muted-foreground mt-0.5">{step.detail}</p>
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="space-y-4">
          <div className="bg-card rounded-xl border p-5">
            <div className="flex items-center gap-2 mb-3">
              <HelpCircle className="w-5 h-5 text-accent" />
              <h3 className="font-semibold font-heading">تحتاج مساعدة؟</h3>
            </div>
            <p className="text-sm text-muted-foreground mb-4">إذا لم تجد إجابة لسؤالك في الدليل، يمكنك التواصل مع فريق الدعم الفني.</p>
            <button className="w-full py-2.5 bg-accent text-accent-foreground rounded-lg text-sm font-medium hover:opacity-90">تواصل مع الدعم</button>
          </div>

          <div className="bg-card rounded-xl border p-5">
            <div className="flex items-center gap-2 mb-3">
              <BookOpen className="w-5 h-5 text-info" />
              <h3 className="font-semibold font-heading">نصائح سريعة</h3>
            </div>
            <div className="space-y-3">
              {[
                'استخدم البحث للوصول السريع لأي معلومة',
                'تأكد من تحديث بيانات الشاحنات والكفرات دورياً',
                'راجع تنبيهات المخزون يومياً لتجنب النقص',
                'استخدم نظام التذاكر لتوثيق جميع الأعطال',
                'قم بتصدير التقارير شهرياً للأرشفة',
              ].map((tip, i) => (
                <div key={i} className="flex items-start gap-2">
                  <span className="text-accent text-sm">💡</span>
                  <p className="text-sm text-muted-foreground">{tip}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserGuide;
