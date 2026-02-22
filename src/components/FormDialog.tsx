import React, { useState } from 'react';
import { X, Loader2 } from 'lucide-react';

export interface FormField {
  name: string;
  label: string;
  type: 'text' | 'number' | 'email' | 'tel' | 'date' | 'select' | 'textarea';
  required?: boolean;
  placeholder?: string;
  options?: { value: string; label: string }[];
  dir?: string;
}

interface FormDialogProps {
  open: boolean;
  onClose: () => void;
  title: string;
  fields: FormField[];
  onSubmit: (data: Record<string, string>) => Promise<void>;
}

const FormDialog: React.FC<FormDialogProps> = ({ open, onClose, title, fields, onSubmit }) => {
  const [values, setValues] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  if (!open) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: Record<string, string> = {};
    fields.forEach(f => {
      if (f.required && !values[f.name]?.trim()) {
        newErrors[f.name] = 'هذا الحقل مطلوب';
      }
    });
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    setSaving(true);
    try {
      await onSubmit(values);
      setValues({});
      setErrors({});
      onClose();
    } catch (err: any) {
      setErrors({ _form: err?.message || 'حدث خطأ' });
    }
    setSaving(false);
  };

  return (
    <div className="fixed inset-0 bg-foreground/50 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-card rounded-2xl border shadow-xl w-full max-w-lg p-6 max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-lg font-bold font-heading">{title}</h3>
          <button onClick={onClose} className="p-1 rounded hover:bg-muted"><X className="w-5 h-5" /></button>
        </div>

        {errors._form && <p className="text-sm text-destructive mb-3 bg-destructive/10 px-3 py-2 rounded-lg">{errors._form}</p>}

        <form onSubmit={handleSubmit} className="space-y-4">
          {fields.map(field => (
            <div key={field.name}>
              <label className="block text-sm font-medium mb-1">{field.label} {field.required && <span className="text-destructive">*</span>}</label>
              {field.type === 'select' ? (
                <select value={values[field.name] || ''} onChange={e => setValues({ ...values, [field.name]: e.target.value })}
                  className="w-full border rounded-lg px-3 py-2 text-sm bg-background focus:outline-none focus:ring-2 focus:ring-primary/20">
                  <option value="">اختر...</option>
                  {field.options?.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                </select>
              ) : field.type === 'textarea' ? (
                <textarea value={values[field.name] || ''} onChange={e => setValues({ ...values, [field.name]: e.target.value })}
                  placeholder={field.placeholder} rows={3}
                  className="w-full border rounded-lg px-3 py-2 text-sm bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 resize-none" />
              ) : (
                <input type={field.type} value={values[field.name] || ''} onChange={e => setValues({ ...values, [field.name]: e.target.value })}
                  placeholder={field.placeholder} dir={field.dir}
                  className="w-full border rounded-lg px-3 py-2 text-sm bg-background focus:outline-none focus:ring-2 focus:ring-primary/20" />
              )}
              {errors[field.name] && <p className="text-xs text-destructive mt-1">{errors[field.name]}</p>}
            </div>
          ))}

          <div className="flex gap-2 pt-2">
            <button type="submit" disabled={saving}
              className="flex-1 bg-primary text-primary-foreground py-2.5 rounded-lg text-sm font-semibold hover:opacity-90 disabled:opacity-50 flex items-center justify-center gap-2">
              {saving && <Loader2 className="w-4 h-4 animate-spin" />} حفظ
            </button>
            <button type="button" onClick={onClose} className="flex-1 border py-2.5 rounded-lg text-sm font-medium hover:bg-muted">إلغاء</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default FormDialog;
