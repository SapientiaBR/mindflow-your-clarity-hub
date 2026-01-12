import { useMemo, useState, useCallback } from 'react';
import { useItems } from './useItems';
import { Item, getItemTypeConfig } from '@/types';

export interface SearchResult {
  item: Item;
  matchedText: string;
  highlightRanges: { start: number; end: number }[];
}

export function useGlobalSearch() {
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const { items, isLoading } = useItems();

  const results = useMemo(() => {
    if (!query.trim()) return [];
    
    const searchTerm = query.toLowerCase();
    
    return items
      .filter(item => {
        const content = item.content?.toLowerCase() || '';
        const title = item.title?.toLowerCase() || '';
        const tags = item.tags?.join(' ').toLowerCase() || '';
        
        return content.includes(searchTerm) || 
               title.includes(searchTerm) || 
               tags.includes(searchTerm);
      })
      .map(item => {
        const content = item.content || item.title || '';
        const lowerContent = content.toLowerCase();
        const matchIndex = lowerContent.indexOf(searchTerm);
        
        return {
          item,
          matchedText: content,
          highlightRanges: matchIndex >= 0 ? [{ 
            start: matchIndex, 
            end: matchIndex + searchTerm.length 
          }] : []
        };
      })
      .slice(0, 20);
  }, [items, query]);

  const groupedResults = useMemo(() => {
    const groups: Record<string, SearchResult[]> = {};
    
    results.forEach(result => {
      const type = result.item.type;
      if (!groups[type]) {
        groups[type] = [];
      }
      groups[type].push(result);
    });
    
    return groups;
  }, [results]);

  const open = useCallback(() => setIsOpen(true), []);
  const close = useCallback(() => {
    setIsOpen(false);
    setQuery('');
  }, []);
  const toggle = useCallback(() => setIsOpen(prev => !prev), []);

  return {
    query,
    setQuery,
    results,
    groupedResults,
    isLoading,
    isOpen,
    open,
    close,
    toggle
  };
}
