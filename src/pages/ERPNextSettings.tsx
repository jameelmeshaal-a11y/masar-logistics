import { useState } from 'react';
import { Save, RefreshCw, CheckCircle2, XCircle, Loader2 } from 'lucide-react';
import { getERPNextConfig, saveERPNextConfig, type ERPNextConfig } from '@/lib/erpnext-config';
import { testConnection } from '@/lib/erpnext-api';
import { useToast } from '@/hooks/use-toast';

const ERPNextSettings = () => {
  const [config, setConfig] = useState<ERPNextConfig>(getERPNextConfig());
  const [testing, setTesting] = useState(false);
  const [testResult, setTestResult] = useState<boolean | null>(null);
  const { toast } = useToast();

  const handleSave = () => {
    saveERPNextConfig(config);
    toast({ title: 'تم الحفظ', description: 'تم حفظ إعدادات سلاسة بنجاح' });
  };

  const handleTest = async () => {
    setTesting(true);
    setTestResult(null);
    const result = await testConnection();
    setTestResult(result);
    setTesting(false);
    toast({
      title: result ? 'متصل' : 'فشل الاتصال',
      description: result ? 'تم الاتصال بسيرفر سلاسة بنجاح' : 'تعذر الاتصال، تحقق من البيانات',
      variant: result ? 'default' : 'destructive',
    });
  };

  return (
    <div className="space-y-6">
      <div className="page-header">
        <h1 className="page-title">إعدادات سلاسة</h1>
        <p className="page-subtitle">ربط النظام مع نظام سلاسة لمزامنة البيانات</p>
      </div>

      <div className="max-w-2xl space-y-6">
        <div className="bg-card rounded-xl border p-6 space-y-4">
          <h2 className="text-lg font-bold font-heading">بيانات الاتصال</h2>

          <div>
            <label className="block text-sm font-medium mb-1">رابط سيرفر سلاسة</label>
            <input value={config.serverUrl} onChange={e => setConfig({ ...config, serverUrl: e.target.value })}
              placeholder="https://erp.example.com" dir="ltr"
              className="w-full border rounded-lg px-3 py-2 text-sm bg-background focus:outline-none focus:ring-2 focus:ring-primary/20" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">API Key</label>
              <input value={config.apiKey} onChange={e => setConfig({ ...config, apiKey: e.target.value })}
                placeholder="API Key" dir="ltr"
                className="w-full border rounded-lg px-3 py-2 text-sm bg-background focus:outline-none focus:ring-2 focus:ring-primary/20" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">API Secret</label>
              <input type="password" value={config.apiSecret} onChange={e => setConfig({ ...config, apiSecret: e.target.value })}
                placeholder="API Secret" dir="ltr"
                className="w-full border rounded-lg px-3 py-2 text-sm bg-background focus:outline-none focus:ring-2 focus:ring-primary/20" />
            </div>
          </div>

          <div className="flex items-center gap-4">
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" checked={config.enabled} onChange={e => setConfig({ ...config, enabled: e.target.checked })}
                className="w-4 h-4 rounded border-border" />
              تفعيل المزامنة
            </label>
            <select value={config.syncMode} onChange={e => setConfig({ ...config, syncMode: e.target.value as 'manual' | 'auto' })}
              className="border rounded-lg px-3 py-1.5 text-sm bg-background">
              <option value="manual">يدوي</option>
              <option value="auto">تلقائي</option>
            </select>
          </div>

          <div className="flex gap-2 pt-2">
            <button onClick={handleSave} className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-lg text-sm font-medium hover:opacity-90">
              <Save className="w-4 h-4" /> حفظ الإعدادات
            </button>
            <button onClick={handleTest} disabled={testing || !config.serverUrl}
              className="flex items-center gap-2 border px-4 py-2 rounded-lg text-sm font-medium hover:bg-muted disabled:opacity-50">
              {testing ? <Loader2 className="w-4 h-4 animate-spin" /> : <RefreshCw className="w-4 h-4" />}
              اختبار الاتصال
            </button>
            {testResult !== null && (
              testResult ? <CheckCircle2 className="w-5 h-5 text-success self-center" /> : <XCircle className="w-5 h-5 text-destructive self-center" />
            )}
          </div>
        </div>

        <div className="bg-card rounded-xl border p-6">
          <h2 className="text-lg font-bold font-heading mb-4">جدول المزامنة</h2>
          <div className="space-y-3">
            {[
              { local: 'أوامر الشراء', remote: 'Purchase Order' },
              { local: 'الموردين', remote: 'Supplier' },
              { local: 'الأصناف', remote: 'Item' },
              { local: 'حركة المخزون', remote: 'Stock Entry' },
              { local: 'أوامر الصيانة', remote: 'Maintenance Visit' },
              { local: 'الشاحنات', remote: 'Vehicle' },
              { local: 'السائقين', remote: 'Employee' },
            ].map((m, i) => (
              <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-muted/30">
                <span className="text-sm font-medium">{m.local}</span>
                <span className="text-xs text-muted-foreground font-mono">{m.remote}</span>
                <button className="text-xs text-accent hover:underline">مزامنة</button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ERPNextSettings;
