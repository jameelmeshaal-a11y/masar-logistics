import { useTheme, themes, ThemeKey } from '@/hooks/useTheme';
import { Palette, Check } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';

const ThemeSwitcher = () => {
  const { theme, setTheme } = useTheme();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  return (
    <div ref={ref} className="relative">
      <button onClick={() => setOpen(!open)}
        className="p-2 rounded-lg text-muted-foreground hover:bg-muted transition-colors" title="اختيار المظهر">
        <Palette className="w-5 h-5" />
      </button>
      {open && (
        <div className="absolute left-0 top-full mt-2 bg-card border rounded-xl shadow-lg p-2 w-52 z-50 max-h-[400px] overflow-y-auto">
          <p className="text-xs text-muted-foreground px-3 py-1.5 font-medium flex items-center gap-1.5">
            <Palette className="w-3.5 h-3.5" /> اختيار المظهر
          </p>
          {(Object.keys(themes) as ThemeKey[]).map(key => (
            <button key={key} onClick={() => { setTheme(key); setOpen(false); }}
              className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-colors
                ${theme === key ? 'bg-primary/10 text-primary font-medium' : 'hover:bg-muted text-foreground'}`}>
              <div className="w-4 h-4 rounded-full border-2 border-border shrink-0" style={{ backgroundColor: themes[key].color }} />
              <span className="flex-1 text-right">{themes[key].label}</span>
              {theme === key && <Check className="w-3.5 h-3.5 text-primary shrink-0" />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default ThemeSwitcher;
