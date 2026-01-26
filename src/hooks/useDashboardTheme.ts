import { useState, useEffect, useCallback } from 'react';

export type DashboardTheme = 'light' | 'dark';

const STORAGE_KEY = 'dashboard-theme';

export function useDashboardTheme() {
  const [theme, setThemeState] = useState<DashboardTheme>('light');
  const [isLoaded, setIsLoaded] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY) as DashboardTheme | null;
      if (saved && (saved === 'light' || saved === 'dark')) {
        setThemeState(saved);
      }
    } catch (error) {
      console.error('Failed to load dashboard theme:', error);
    }
    setIsLoaded(true);
  }, []);

  const setTheme = useCallback((newTheme: DashboardTheme) => {
    setThemeState(newTheme);
    try {
      localStorage.setItem(STORAGE_KEY, newTheme);
    } catch (error) {
      console.error('Failed to save dashboard theme:', error);
    }
  }, []);

  const toggleTheme = useCallback(() => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  }, [theme, setTheme]);

  return {
    theme,
    setTheme,
    toggleTheme,
    isLoaded,
    isDark: theme === 'dark',
  };
}