import { useState, useEffect, useCallback } from 'react';

export type DashboardCardId = 'tasks' | 'ideas' | 'events' | 'projects' | 'notes';

const DEFAULT_ORDER: DashboardCardId[] = ['tasks', 'ideas', 'events', 'projects', 'notes'];
const STORAGE_KEY = 'dashboard-card-order';

export function useDashboardLayout() {
  const [cardOrder, setCardOrderState] = useState<DashboardCardId[]>(DEFAULT_ORDER);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved) as DashboardCardId[];
        // Validate that all default cards exist in saved order
        const isValid = DEFAULT_ORDER.every(id => parsed.includes(id)) && 
                       parsed.length === DEFAULT_ORDER.length;
        if (isValid) {
          setCardOrderState(parsed);
        }
      }
    } catch (error) {
      console.error('Failed to load dashboard layout:', error);
    }
    setIsLoaded(true);
  }, []);

  // Save to localStorage when order changes
  const setCardOrder = useCallback((newOrder: DashboardCardId[]) => {
    setCardOrderState(newOrder);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newOrder));
    } catch (error) {
      console.error('Failed to save dashboard layout:', error);
    }
  }, []);

  const resetToDefault = useCallback(() => {
    setCardOrderState(DEFAULT_ORDER);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (error) {
      console.error('Failed to reset dashboard layout:', error);
    }
  }, []);

  const moveCard = useCallback((fromIndex: number, toIndex: number) => {
    setCardOrderState(prev => {
      const newOrder = [...prev];
      const [moved] = newOrder.splice(fromIndex, 1);
      newOrder.splice(toIndex, 0, moved);
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(newOrder));
      } catch (error) {
        console.error('Failed to save dashboard layout:', error);
      }
      return newOrder;
    });
  }, []);

  return {
    cardOrder,
    setCardOrder,
    resetToDefault,
    moveCard,
    isLoaded,
  };
}
