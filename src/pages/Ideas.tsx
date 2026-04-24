import { useState, useMemo } from 'react';
import AppLayout from '@/components/layout/AppLayout';
import { useItems } from '@/hooks/useItems';
import { motion, AnimatePresence } from 'framer-motion';
import { ItemActions } from '@/components/items/ItemActions';
import { ItemEditModal } from '@/components/items/ItemEditModal';
import { TagBadge } from '@/components/tags/TagBadge';
import { Item } from '@/types';
import { Star, Sparkles, Plus, Search, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

const statusColors: Record<string, { bg: string; text: string; label: string }> = {
  raw: { bg: 'bg-gray-500/15', text: 'text-gray-400', label: '💭 Crua' },
  evolving: { bg: 'bg-emerald-500/15', text: 'text-emerald-400', label: '🌱 Evoluindo' },
  in_progress: { bg: 'bg-blue-500/15', text: 'text-blue-400', label: '🚀 Em progresso' },
  completed: { bg: 'bg-purple-500/15', text: 'text-purple-400', label: '✅ Completada' },
};

export default function Ideas() {
  const { items, updateItem, deleteItem, createItem } = useItems('idea');
  const [editingItem, setEditingItem] = useState<Item | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const [newContent, setNewContent] = useState('');

  const handleSave = async (id: string, updates: Partial<Item>) => {
    await updateItem.mutateAsync({ id, ...updates });
  };

  const handleDelete = (id: string) => deleteItem.mutate(id);
  const handleToggleImportant = (id: string, isImportant: boolean) => updateItem.mutate({ id, is_important: isImportant });

  const handleCreate = () => {
    if (!newContent.trim()) return;
    createItem.mutate({ type: 'idea', content: newContent.trim(), status: 'raw' });
    setNewContent('');
    setIsCreating(false);
  };

  const handleCycleStatus = (id: string, currentStatus: string) => {
    const cycle = ['raw', 'evolving', 'in_progress', 'completed'];
    const idx = cycle.indexOf(currentStatus);
    const next = cycle[(idx + 1) % cycle.length];
    updateItem.mutate({ id, status: next });
  };

  const filteredItems = useMemo(() => {
    if (!searchQuery) return items;
    const q = searchQuery.toLowerCase();
    return items.filter(i =>
      i.content.toLowerCase().includes(q) ||
      i.tags?.some(t => t.toLowerCase().includes(q))
    );
  }, [items, searchQuery]);

  return (
    <AppLayout>
      <div className="flex-1 p-4 md:p-6 overflow-y-auto">
        <header className="mb-5">
          <div className="flex items-center justify-between gap-3">
            <div>
              <h1 className="text-2xl md:text-3xl font-display font-bold gradient-text">💡 Ideias</h1>
              <p className="text-sm text-muted-foreground mt-0.5">
                {items.length} ideia{items.length !== 1 ? 's' : ''} · Clique no status para avançar
              </p>
            </div>
            <Button
              size="sm"
              onClick={() => setIsCreating(true)}
              className="gap-1.5 bg-gradient-to-r from-purple-500 to-indigo-500 text-white hover:from-purple-600 hover:to-indigo-600"
            >
              <Plus className="w-4 h-4" />
              <span className="hidden sm:inline">Nova Ideia</span>
            </Button>
          </div>

          <div className="relative mt-3 max-w-sm">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
            <Input
              placeholder="Buscar ideias..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8 h-8 text-sm bg-muted/50 border-white/5"
            />
          </div>
        </header>

        {/* Inline creation */}
        <AnimatePresence>
          {isCreating && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mb-4"
            >
              <div className="glass-card-elevated rounded-xl p-3 flex items-center gap-3">
                <Sparkles className="w-5 h-5 text-purple-400 shrink-0" />
                <Input
                  value={newContent}
                  onChange={(e) => setNewContent(e.target.value)}
                  placeholder="Descreva sua ideia e pressione Enter..."
                  className="border-0 bg-transparent p-0 h-auto text-sm focus-visible:ring-0"
                  autoFocus
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleCreate();
                    if (e.key === 'Escape') { setIsCreating(false); setNewContent(''); }
                  }}
                />
                <Button size="sm" variant="ghost" onClick={() => { setIsCreating(false); setNewContent(''); }}>
                  Cancelar
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Masonry grid */}
        <div className="columns-1 md:columns-2 lg:columns-3 gap-3 space-y-3">
          {filteredItems.map((idea, i) => {
            const status = statusColors[idea.status] || statusColors.raw;

            return (
              <motion.div
                key={idea.id}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.04 }}
                className="glass-card rounded-xl p-4 hover-lift group cursor-pointer break-inside-avoid transition-all relative"
                onClick={() => setEditingItem(idea)}
              >
                <Sparkles className="absolute top-3 right-3 w-4 h-4 text-purple-400/20" />

                {idea.is_important && (
                  <Star className="w-3.5 h-3.5 text-yellow-400 fill-yellow-400 mb-2" />
                )}

                <p className="text-sm text-foreground/90 mb-3 pr-5">{idea.content}</p>

                {idea.tags && idea.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1 mb-3">
                    {idea.tags.map((tag, idx) => (
                      <TagBadge key={idx} tag={tag} size="sm" />
                    ))}
                  </div>
                )}

                <div className="flex items-center justify-between">
                  <button
                    onClick={(e) => { e.stopPropagation(); handleCycleStatus(idea.id, idea.status); }}
                    className={cn(
                      'text-[11px] px-2 py-1 rounded-full transition-colors',
                      status.bg, status.text,
                      'hover:brightness-125'
                    )}
                  >
                    {status.label}
                  </button>

                  <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                    <ItemActions
                      item={idea}
                      onEdit={setEditingItem}
                      onDelete={handleDelete}
                      onToggleImportant={handleToggleImportant}
                    />
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {!filteredItems.length && (
          <div className="text-center py-16 space-y-3">
            <Sparkles className="w-12 h-12 mx-auto text-muted-foreground/30" />
            <p className="text-muted-foreground">
              {searchQuery ? 'Nenhuma ideia encontrada' : 'Nenhuma ideia ainda'}
            </p>
            {!searchQuery && (
              <Button size="sm" variant="outline" onClick={() => setIsCreating(true)} className="gap-1.5">
                <Plus className="w-4 h-4" />
                Registrar primeira ideia
              </Button>
            )}
          </div>
        )}
      </div>

      <ItemEditModal
        item={editingItem}
        isOpen={!!editingItem}
        onClose={() => setEditingItem(null)}
        onSave={handleSave}
        onDelete={handleDelete}
      />
    </AppLayout>
  );
}
