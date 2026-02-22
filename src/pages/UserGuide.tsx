import { useState } from 'react';
import { BookOpen, ChevronDown, ChevronLeft, Search, Play, FileText, HelpCircle } from 'lucide-react';

interface GuideSection {
  title: string;
  icon: string;
  items: { title: string; content: string }[];
}

const guideSections: GuideSection[] = [
  {
    title: 'إدارة المشتريات',
    icon: '🛒',
    items: [
      { title: 'إنشاء طلب احتياج', content: 'من قائمة المشتريات → طلبات الاحتياج → اضغط "إضافة جديد". حدد الصنف والكمية والقسم الطالب وسبب الطلب. سيتم فحص توفر الصنف في المستودع تلقائياً قبل إرسال الطلب للاعتماد.' },
      { title: 'إنشاء أمر شراء', content: 'بعد اعتماد طلب الاحتياج، انتقل إلى أوامر الشراء → إنشاء أمر شراء. حدد المورد والأصناف والكميات والأسعار. يمكنك ربط الأمر بالشاحنة أو أمر الصيانة المعني.' },
      { title: 'إدارة الموردين', content: 'من قائمة الموردين يمكنك إضافة بيانات المورد الكاملة (الاسم، الرقم الضريبي، رقم الجوال/واتساب، شروط الدفع). يمكنك أيضاً تقييم الموردين ومقارنة أدائهم.' },
      { title: 'تسجيل الفواتير', content: 'من قائمة الفواتير → إضافة فاتورة. أدخل رقم فاتورة المورد واربطها بأمر الشراء. سيتم احتساب ضريبة القيمة المضافة تلقائياً. يمكنك تتبع حالة الدفع (مدفوعة/جزئية/غير مدفوعة).' },
    ]
  },
  {
    title: 'إدارة الأسطول',
    icon: '🚚',
    items: [
      { title: 'إضافة شاحنة جديدة', content: 'من إدارة الأسطول → الشاحنات → إضافة شاحنة. أدخل بيانات الشاحنة (الرقم، اللوحة، الموديل، النوع). يمكنك تعيين سائق وتحديد جدول الصيانة الدورية.' },
      { title: 'إدارة الكفرات', content: 'كل كفر يتم تسجيله برقم تسلسلي فريد مع بيانات الشراء والمورد والماركة. عند التركيب يتم ربط الكفر بشاحنة محددة وموقع محدد (أمام/خلف/يمين/يسار) مع تسجيل قراءة العداد.' },
      { title: 'تتبع الكيلومترات', content: 'يتم تسجيل قراءة عداد الكيلومترات عند كل عملية (تركيب كفر/صيانة/رحلة). هذا يساعد في حساب تكلفة الكفر لكل كيلومتر وعمره التشغيلي.' },
    ]
  },
  {
    title: 'الصيانة والورشة',
    icon: '🔧',
    items: [
      { title: 'إنشاء أمر عمل', content: 'من الصيانة → أوامر العمل → أمر عمل جديد. حدد الشاحنة ونوع الصيانة والأولوية والوصف. يتم ربط أمر العمل بقطع الغيار المطلوبة من المستودع.' },
      { title: 'جدولة الصيانة الدورية', content: 'يمكنك إعداد جداول صيانة تلقائية بناءً على الكيلومترات أو الفترة الزمنية. النظام ينبهك تلقائياً عند اقتراب موعد الصيانة.' },
    ]
  },
  {
    title: 'المستودعات',
    icon: '📦',
    items: [
      { title: 'استلام بضاعة', content: 'من المستودعات → حركة المخزون → استلام. امسح الباركود أو أدخل رقم الصنف يدوياً. تحقق من الكميات مقابل أمر الشراء وسجّل أي نقص أو تلف.' },
      { title: 'صرف من المستودع', content: 'يتم الصرف فقط بناءً على أمر معتمد (أمر صيانة/طلب تشغيلي). امسح كود الصنف وحدد الكمية والجهة المستلمة. لا يمكن الصرف المباشر بدون مرجع.' },
      { title: 'إعداد حد إعادة الطلب', content: 'لكل صنف يمكنك تحديد الحد الأدنى للمخزون. عند وصول الكمية لهذا الحد، يتم إنشاء تنبيه تلقائي لإعادة الطلب.' },
    ]
  },
  {
    title: 'الإدارة المالية',
    icon: '💰',
    items: [
      { title: 'تسجيل دفعة', content: 'من الإدارة المالية → المدفوعات → تسجيل دفعة. حدد المورد والفاتورة المرتبطة والمبلغ وطريقة الدفع. يدعم النظام الدفع الآجل والمقسّم والدفعات المتعددة.' },
      { title: 'متابعة الأرصدة', content: 'من أرصدة الموردين يمكنك رؤية إجمالي المستحقات والمدفوع والمتبقي لكل مورد مع تواريخ الاستحقاق.' },
    ]
  },
  {
    title: 'التقارير والمشاركة',
    icon: '📊',
    items: [
      { title: 'إنشاء تقرير', content: 'من قائمة التقارير اختر التقرير المطلوب واضغط "عرض". يمكنك تحديد الفترة والتصفية حسب الشاحنة/المورد/القسم.' },
      { title: 'مشاركة التقارير', content: 'يمكنك مشاركة أي تقرير أو فاتورة عبر البريد الإلكتروني أو الواتساب مباشرة من النظام. اضغط على أيقونة المشاركة واختر الطريقة المناسبة.' },
    ]
  },
];

const UserGuide = () => {
  const [expandedSection, setExpandedSection] = useState<number | null>(0);
  const [expandedItem, setExpandedItem] = useState<string | null>(null);

  return (
    <div className="space-y-6">
      <div className="page-header">
        <h1 className="page-title">دليل الاستخدام</h1>
        <p className="page-subtitle">شرح مفصّل وخطوة بخطوة لجميع وظائف النظام</p>
      </div>

      <div className="relative max-w-md">
        <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <input type="text" placeholder="بحث في الدليل..." className="w-full bg-card border rounded-lg pr-10 pl-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-3">
          {guideSections.map((section, si) => (
            <div key={si} className="bg-card rounded-xl border overflow-hidden">
              <button
                onClick={() => setExpandedSection(expandedSection === si ? null : si)}
                className="w-full flex items-center gap-3 px-5 py-4 text-right hover:bg-muted/30 transition-colors"
              >
                <span className="text-2xl">{section.icon}</span>
                <span className="flex-1 font-semibold font-heading">{section.title}</span>
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
                        <div className="px-5 pb-4 pr-12">
                          <p className="text-sm text-muted-foreground leading-relaxed">{item.content}</p>
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
              <Play className="w-5 h-5 text-info" />
              <h3 className="font-semibold font-heading">فيديوهات تعليمية</h3>
            </div>
            <div className="space-y-2">
              {['مقدمة عن النظام', 'دورة المشتريات', 'إدارة المستودعات', 'الصيانة والورشة'].map((v, i) => (
                <button key={i} className="w-full flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-muted text-sm text-right">
                  <Play className="w-3.5 h-3.5 text-info shrink-0" />
                  {v}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserGuide;
