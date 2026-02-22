import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export type ThemeKey = 'classic' | 'ocean' | 'desert' | 'dark';

interface ThemeContextType {
  theme: ThemeKey;
  setTheme: (t: ThemeKey) => void;
}

const ThemeContext = createContext<ThemeContextType>({ theme: 'classic', setTheme: () => {} });

export const themes: Record<ThemeKey, { label: string; icon: string }> = {
  classic: { label: 'كلاسيكي', icon: '🎨' },
  ocean: { label: 'محيطي', icon: '🌊' },
  desert: { label: 'صحراوي', icon: '🏜️' },
  dark: { label: 'داكن', icon: '🌙' },
};

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const [theme, setThemeState] = useState<ThemeKey>(() => {
    return (localStorage.getItem('app-theme') as ThemeKey) || 'classic';
  });

  const setTheme = (t: ThemeKey) => {
    setThemeState(t);
    localStorage.setItem('app-theme', t);
  };

  useEffect(() => {
    const root = document.documentElement;
    root.classList.remove('theme-classic', 'theme-ocean', 'theme-desert', 'dark');
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.add(`theme-${theme}`);
    }
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
