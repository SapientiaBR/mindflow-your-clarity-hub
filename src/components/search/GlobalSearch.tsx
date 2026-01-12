import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, X, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { useGlobalSearch } from '@/hooks/useGlobalSearch';
import { getItemTypeConfig } from '@/types';
import { cn } from '@/lib/utils';
import { TagBadge } from '@/components/tags/TagBadge';

interface GlobalSearchProps {
  isOpen: boolean;
  onClose: () => void;
  onEditItem?: (item: any) => void;
}

export function GlobalSearch({ isOpen, onClose, onEditItem }: GlobalSearchProps) {
  const { query, setQuery, groupedResults, isLoading } = useGlobalSearch();
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  // Flatten results for keyboard navigation
  const flatResults = Object.values(groupedResults).flat();

  useEffect(() => {
    if (isOpen) {
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 100);
    } else {
      setQuery('');
    }
  }, [isOpen, setQuery]);

  useEffect(() => {
    setSelectedIndex(0);
  }, [query]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex(prev => Math.min(prev + 1, flatResults.length - 1));
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex(prev => Math.max(prev - 1, 0));
        break;
      case 'Enter':
        e.preventDefault();
        if (flatResults[selectedIndex]) {
          handleSelectResult(flatResults[selectedIndex]);
        }
        break;
      case 'Escape':
        onClose();
        break;
    }
  };

  const handleSelectResult = (result: any) => {
    if (onEditItem) {
      onEditItem(result.item);
    } else {
      // Navigate to the appropriate page
      const typeRoutes: Record<string, string> = {
        task: '/tasks',
        idea: '/ideas',
        project: '/projects',
        goal: '/goals',
        event: '/events',
        note: '/timeline',
        thought: '/timeline',
        insight: '/timeline',
        reflection: '/timeline'
      };
      navigate(typeRoutes[result.item.type] || '/dashboard');
    }
    onClose();
  };

  const highlightText = (text: string, ranges: { start: number; end: number }[]) => {
    if (!ranges.length) return text;
    
    const range = ranges[0];
    return (
      <>
        {text.slice(0, range.start)}
        <span className="bg-mindflow-purple/30 text-mindflow-purple font-medium">
          {text.slice(range.start, range.end)}
        </span>
        {text.slice(range.end)}
      </>
    );
  };

  let flatIndex = 0;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-2xl p-0 gap-0 overflow-hidden bg-card/95 backdrop-blur-xl border-white/10">
        <div className="flex items-center gap-3 px-4 py-3 border-b border-white/10">
          <Search className="w-5 h-5 text-muted-foreground" />
          <Input
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Buscar tarefas, ideias, projetos..."
            className="border-0 bg-transparent focus-visible:ring-0 text-lg placeholder:text-muted-foreground/50"
          />
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <kbd className="px-1.5 py-0.5 rounded bg-muted/50 border border-white/10">ESC</kbd>
          </div>
        </div>

        <div className="max-h-[60vh] overflow-y-auto">
          {isLoading ? (
            <div className="p-8 text-center text-muted-foreground">
              Carregando...
            </div>
          ) : !query.trim() ? (
            <div className="p-8 text-center text-muted-foreground">
              <p className="text-sm">Digite para buscar em todos os seus itens</p>
              <div className="mt-4 flex justify-center gap-2 text-xs">
                <kbd className="px-2 py-1 rounded bg-muted/50 border border-white/10">↑↓</kbd>
                <span>navegar</span>
                <kbd className="px-2 py-1 rounded bg-muted/50 border border-white/10">↵</kbd>
                <span>selecionar</span>
              </div>
            </div>
          ) : flatResults.length === 0 ? (
            <div className="p-8 text-center text-muted-foreground">
              <p>Nenhum resultado encontrado para "{query}"</p>
            </div>
          ) : (
            <div className="py-2">
              {Object.entries(groupedResults).map(([type, results]) => {
                const config = getItemTypeConfig(type as any);
                
                return (
                  <div key={type}>
                    <div className="px-4 py-2 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      {config.icon} {config.label}
                    </div>
                    {results.map((result) => {
                      const currentIndex = flatIndex++;
                      const isSelected = currentIndex === selectedIndex;
                      
                      return (
                        <motion.button
                          key={result.item.id}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          className={cn(
                            "w-full px-4 py-3 flex items-start gap-3 text-left transition-colors",
                            isSelected 
                              ? "bg-mindflow-purple/20" 
                              : "hover:bg-white/5"
                          )}
                          onClick={() => handleSelectResult(result)}
                        >
                          <span className="text-lg mt-0.5">{config.icon}</span>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm line-clamp-2">
                              {highlightText(result.matchedText, result.highlightRanges)}
                            </p>
                            {result.item.tags && result.item.tags.length > 0 && (
                              <div className="flex flex-wrap gap-1 mt-1">
                                {result.item.tags.slice(0, 3).map((tag, i) => (
                                  <TagBadge key={i} tag={tag} size="sm" />
                                ))}
                              </div>
                            )}
                          </div>
                          {isSelected && (
                            <ArrowRight className="w-4 h-4 text-mindflow-purple mt-1" />
                          )}
                        </motion.button>
                      );
                    })}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
