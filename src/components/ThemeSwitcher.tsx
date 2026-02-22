import { useTheme, themes, ThemeKey } from '@/hooks/useTheme';
import { Palette } from 'lucide-react';
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
        className="p-2 rounded-lg text-muted-foreground hover:bg-muted transition-colors" title="تغيير الثيم">
        <Palette className="w-5 h-5" />
      </button>
      {open && (
        <div className="absolute left-0 top-full mt-2 bg-card border rounded-xl shadow-lg p-2 w-44 z-50">
          {(Object.keys(themes) as ThemeKey[]).map(key => (
            <button key={key} onClick={() => { setTheme(key); setOpen(false); }}
              className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors
                ${theme === key ? 'bg-primary text-primary-foreground' : 'hover:bg-muted'}`}>
              <span>{themes[key].icon}</span>
              <span>{themes[key].label}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default ThemeSwitcher;
