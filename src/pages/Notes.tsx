import { useState, useMemo } from 'react';
import AppLayout from '@/components/layout/AppLayout';
import { useItems } from '@/hooks/useItems';
import { motion } from 'framer-motion';
import { ItemActions } from '@/components/items/ItemActions';
import { ItemEditModal } from '@/components/items/ItemEditModal';
import { TagBadge } from '@/components/tags/TagBadge';
import { Item } from '@/types';
import { FileText, Star, Plus, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export default function Notes() {
  const { items, updateItem, deleteItem, createItem } = useItems('note');
  const [editingItem, setEditingItem] = useState<Item | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newContent, setNewContent] = useState('');

  const handleSave = async (id: string, updates: Partial<Item>) => {
    await updateItem.mutateAsync({ id, ...updates });
  };

  const handleDelete = (id: string) => {
    deleteItem.mutate(id);
  };

  const handleToggleImportant = (id: string, isImportant: boolean) => {
    updateItem.mutate({ id, is_important: isImportant });
  };

  const handleCreate = () => {
    if (!newContent.trim()) return;
    createItem.mutate({
      type: 'note',
      content: newContent.trim(),
      title: newTitle.trim() || undefined,
    });
    setNewTitle('');
    setNewContent('');
    setIsCreating(false);
  };

  const filteredItems = useMemo(() => {
    if (!searchQuery) return items;
    const q = searchQuery.toLowerCase();
    return items.filter(i =>
      i.content.toLowerCase().includes(q) ||
      i.title?.toLowerCase().includes(q) ||
      i.tags?.some(t => t.toLowerCase().includes(q))
    );
  }, [items, searchQuery]);

  // Color rotation for cards
  const cardColors = [
    'border-l-blue-400/50',
    'border-l-purple-400/50',
    'border-l-emerald-400/50',
    'border-l-amber-400/50',
    'border-l-pink-400/50',
    'border-l-cyan-400/50',
  ];

  return (
    <AppLayout>
      <div className="flex-1 p-4 md:p-6 overflow-y-auto">
        {/* Header */}
        <header className="mb-5">
          <div className="flex items-center justify-between gap-3">
            <div>
              <h1 className="text-2xl md:text-3xl font-display font-bold gradient-text">📝 Notas</h1>
              <p className="text-sm text-muted-foreground mt-0.5">
                {items.length} nota{items.length !== 1 ? 's' : ''}
              </p>
            </div>
            <Button
              size="sm"
              onClick={() => setIsCreating(true)}
              className="gap-1.5 bg-gradient-to-r from-indigo-500 to-blue-500 text-white hover:from-indigo-600 hover:to-blue-600"
            >
              <Plus className="w-4 h-4" />
              <span className="hidden sm:inline">Nova Nota</span>
            </Button>
          </div>

          {/* Search */}
          <div className="relative mt-3 max-w-sm">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
            <Input
              placeholder="Buscar notas..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8 h-8 text-sm bg-muted/50 border-white/5"
            />
          </div>
        </header>

        {/* Inline creation */}
        {isCreating && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-card-elevated rounded-xl p-4 mb-4 space-y-3"
          >
            <Input
              placeholder="Título (opcional)"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              className="bg-muted/50 border-white/5"
              autoFocus
            />
            <Textarea
              placeholder="Escreva sua nota..."
              value={newContent}
              onChange={(e) => setNewContent(e.target.value)}
              rows={3}
              className="bg-muted/50 border-white/5 resize-none"
            />
            <div className="flex gap-2 justify-end">
              <Button variant="ghost" size="sm" onClick={() => { setIsCreating(false); setNewTitle(''); setNewContent(''); }}>
                Cancelar
              </Button>
              <Button size="sm" onClick={handleCreate} disabled={!newContent.trim()}>
                Salvar
              </Button>
            </div>
          </motion.div>
        )}

        {/* Notes grid — masonry-like with 3 columns */}
        <div className="columns-1 md:columns-2 lg:columns-3 gap-3 space-y-3">
          {filteredItems.map((note, i) => (
            <motion.div
              key={note.id}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.04 }}
              className={cn(
                'glass-card rounded-xl p-4 hover-lift group cursor-pointer break-inside-avoid transition-all border-l-2',
                cardColors[i % cardColors.length]
              )}
              onClick={() => setEditingItem(note)}
            >
              {/* Important */}
              {note.is_important && (
                <Star className="w-3.5 h-3.5 text-yellow-400 fill-yellow-400 mb-2" />
              )}

              {/* Title */}
              {note.title && (
                <h3 className="text-sm font-semibold text-foreground mb-1.5 font-display">{note.title}</h3>
              )}

              {/* Content */}
              <p className="text-sm text-foreground/80 whitespace-pre-wrap line-clamp-6">{note.content}</p>

              {/* Tags */}
              {note.tags && note.tags.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-3">
                  {note.tags.map((tag, idx) => (
                    <TagBadge key={idx} tag={tag} size="sm" />
                  ))}
                </div>
              )}

              {/* Footer */}
              <div className="flex items-center justify-between mt-3 pt-2 border-t border-white/5">
                <span className="text-[10px] text-muted-foreground">
                  {formatDistanceToNow(new Date(note.created_at), { addSuffix: true, locale: ptBR })}
                </span>
                <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                  <ItemActions
                    item={note}
                    onEdit={setEditingItem}
                    onDelete={handleDelete}
                    onToggleImportant={handleToggleImportant}
                  />
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Empty */}
        {!filteredItems.length && (
          <div className="text-center py-16 space-y-3">
            <FileText className="w-12 h-12 mx-auto text-muted-foreground/30" />
            <p className="text-muted-foreground">
              {searchQuery ? 'Nenhuma nota encontrada' : 'Nenhuma nota ainda'}
            </p>
            {!searchQuery && (
              <Button size="sm" variant="outline" onClick={() => setIsCreating(true)} className="gap-1.5">
                <Plus className="w-4 h-4" />
                Criar primeira nota
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
