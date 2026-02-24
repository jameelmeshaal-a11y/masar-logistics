import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export type ThemeKey = 
  | 'elegant-rose' | 'royal-purple' | 'air-blue' | 'ocean-blue'
  | 'ocean-calm' | 'forest-green' | 'warm-sunset' | 'lavender-dream'
  | 'midnight' | 'royal-gold' | 'crimson-red' | 'classic';

interface ThemeContextType {
  theme: ThemeKey;
  setTheme: (t: ThemeKey) => void;
}

const ThemeContext = createContext<ThemeContextType>({ theme: 'ocean-blue', setTheme: () => {} });

export const themes: Record<ThemeKey, { label: string; icon: string; color: string }> = {
  'elegant-rose': { label: 'العدالة الأنيقة', icon: '🌸', color: '#E8A0BF' },
  'royal-purple': { label: 'البنفسجي الملكي', icon: '💜', color: '#7B2FF7' },
  'air-blue': { label: 'القانوني الهوائي', icon: '🩵', color: '#87CEEB' },
  'ocean-blue': { label: 'الأزرق الهوائي', icon: '✓', color: '#4A90D9' },
  'ocean-calm': { label: 'هدوء المحيط', icon: '🌊', color: '#2C7A8C' },
  'forest-green': { label: 'أخضر الغابة', icon: '🌲', color: '#2D6A4F' },
  'warm-sunset': { label: 'غروب دافئ', icon: '🌅', color: '#E07A5F' },
  'lavender-dream': { label: 'حلم اللافندر', icon: '💐', color: '#9B8EC5' },
  'midnight': { label: 'وضع منتصف الليل', icon: '🌙', color: '#1A1A2E' },
  'royal-gold': { label: 'الذهبي الملكي', icon: '👑', color: '#C5A43E' },
  'crimson-red': { label: 'الأحمر القرمزي', icon: '🔴', color: '#DC3545' },
  'classic': { label: 'كلاسيكي', icon: '🎨', color: '#1B3A5C' },
};

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const [theme, setThemeState] = useState<ThemeKey>(() => {
    return (localStorage.getItem('app-theme') as ThemeKey) || 'ocean-blue';
  });

  const setTheme = (t: ThemeKey) => {
    setThemeState(t);
    localStorage.setItem('app-theme', t);
  };

  useEffect(() => {
    const root = document.documentElement;
    // Use data-theme attribute for reliable theme switching
    root.setAttribute('data-theme', theme);
    // Handle dark mode class
    if (theme === 'midnight') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
