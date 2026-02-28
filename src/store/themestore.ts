import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Theme } from '@/types';

export const themes: Theme[] = [
  {
    id: 'light',
    name: 'Light', nameEs: 'Claro', nameFr: 'Clair', isPremium: false,
    colors: { background: '#ffffff', foreground: '#0f172a', primary: '#3b82f6', secondary: '#f1f5f9', accent: '#8b5cf6', muted: '#f8fafc', card: '#ffffff', border: '#e2e8f0' }
  },
  {
    id: 'dark',
    name: 'Dark', nameEs: 'Oscuro', nameFr: 'Sombre', isPremium: false,
    colors: { background: '#0f172a', foreground: '#f8fafc', primary: '#3b82f6', secondary: '#1e293b', accent: '#8b5cf6', muted: '#1e293b', card: '#1e293b', border: '#334155' }
  },
  {
    id: 'ocean',
    name: 'Ocean', nameEs: 'Océano', nameFr: 'Océan', isPremium: true,
    colors: { background: '#0c4a6e', foreground: '#f0f9ff', primary: '#0ea5e9', secondary: '#075985', accent: '#22d3ee', muted: '#075985', card: '#075985', border: '#0369a1' }
  },
  {
    id: 'forest',
    name: 'Forest', nameEs: 'Bosque', nameFr: 'Forêt', isPremium: true,
    colors: { background: '#064e3b', foreground: '#ecfdf5', primary: '#10b981', secondary: '#065f46', accent: '#34d399', muted: '#065f46', card: '#065f46', border: '#047857' }
  },
  {
    id: 'sunset',
    name: 'Sunset', nameEs: 'Atardecer', nameFr: 'Coucher', isPremium: true,
    colors: { background: '#4c0519', foreground: '#fff1f2', primary: '#f43f5e', secondary: '#881337', accent: '#fb7185', muted: '#881337', card: '#881337', border: '#9f1239' }
  }
];

interface ThemeState {
  currentTheme: string;
  unlockedThemes: string[];
  setTheme: (themeId: string) => void;
  unlockPremiumThemes: (code: string) => boolean;
  getCurrentTheme: () => Theme;
  applyTheme: () => void;
}

export const useThemeStore = create<ThemeState>()(
  persist(
    (set, get) => ({
      currentTheme: 'light',
      unlockedThemes: ['light', 'dark'],
      setTheme: (themeId) => {
        if (get().unlockedThemes.includes(themeId)) set({ currentTheme: themeId });
      },
      unlockPremiumThemes: (code) => {
        if (code === '2002') {
          const premium = themes.filter(t => t.isPremium).map(t => t.id);
          set({ unlockedThemes: ['light', 'dark', ...premium] });
          return true;
        }
        return false;
      },
      getCurrentTheme: () => themes.find(t => t.id === get().currentTheme) || themes[0],
      applyTheme: () => {
        const theme = get().getCurrentTheme();
        const root = document.documentElement;
        root.className = '';
        if (theme.id !== 'light') {
          root.classList.add(`theme-${theme.id}`);
        }
      }
    }),
    { name: 'theme-storage' }
  )
);

export const applyTheme = (theme: Theme) => {
  const root = document.documentElement;
  root.style.setProperty('--background', theme.colors.background);
  root.style.setProperty('--foreground', theme.colors.foreground);
  root.style.setProperty('--primary', theme.colors.primary);
  root.style.setProperty('--secondary', theme.colors.secondary);
  root.style.setProperty('--accent', theme.colors.accent);
  root.style.setProperty('--muted', theme.colors.muted);
  root.style.setProperty('--card', theme.colors.card);
  root.style.setProperty('--border', theme.colors.border);
};
