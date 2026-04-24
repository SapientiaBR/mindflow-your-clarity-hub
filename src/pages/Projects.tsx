import { useState, useMemo } from 'react';
import AppLayout from '@/components/layout/AppLayout';
import { useItems } from '@/hooks/useItems';
import { motion, AnimatePresence } from 'framer-motion';
import { ItemActions } from '@/components/items/ItemActions';
import { ItemEditModal } from '@/components/items/ItemEditModal';
import { TagBadge } from '@/components/tags/TagBadge';
import { Item } from '@/types';
import { Star, FolderOpen, Plus, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

export default function Projects() {
  const { items, updateItem, deleteItem, createItem } = useItems('project');
  const [editingItem, setEditingItem] = useState<Item | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newContent, setNewContent] = useState('');

  const handleSave = async (id: string, updates: Partial<Item>) => {
    await updateItem.mutateAsync({ id, ...updates });
  };

  const handleDelete = (id: string) => deleteItem.mutate(id);
  const handleToggleImportant = (id: string, isImportant: boolean) => updateItem.mutate({ id, is_important: isImportant });

  const handleCreate = () => {
    if (!newContent.trim()) return;
    createItem.mutate({
      type: 'project',
      content: newContent.trim(),
      title: newTitle.trim() || undefined,
      status: 'active',
    });
    setNewTitle('');
    setNewContent('');
    setIsCreating(false);
  };

  const getProgressColor = (progress: number) => {
    if (progress >= 80) return 'from-emerald-500 to-emerald-400';
    if (progress >= 50) return 'from-blue-500 to-cyan-400';
    if (progress >= 25) return 'from-amber-500 to-orange-400';
    return 'from-gray-500 to-gray-400';
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

  const activeCount = items.filter(p => p.status === 'active' || p.status === 'in_progress').length;

  return (
    <AppLayout>
      <div className="flex-1 p-4 md:p-6 overflow-y-auto">
        <header className="mb-5">
          <div className="flex items-center justify-between gap-3">
            <div>
              <h1 className="text-2xl md:text-3xl font-display font-bold gradient-text">📁 Projetos</h1>
              <p className="text-sm text-muted-foreground mt-0.5">
                {activeCount} ativo{activeCount !== 1 ? 's' : ''} de {items.length}
              </p>
            </div>
            <Button
              size="sm"
              onClick={() => setIsCreating(true)}
              className="gap-1.5 bg-gradient-to-r from-cyan-500 to-blue-500 text-white hover:from-cyan-600 hover:to-blue-600"
            >
              <Plus className="w-4 h-4" />
              <span className="hidden sm:inline">Novo Projeto</span>
            </Button>
          </div>

          <div className="relative mt-3 max-w-sm">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
            <Input
              placeholder="Buscar projetos..."
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
              <div className="glass-card-elevated rounded-xl p-4 space-y-3">
                <Input
                  placeholder="Nome do projeto"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="bg-muted/50 border-white/5"
                  autoFocus
                />
                <Input
                  placeholder="Descrição breve..."
                  value={newContent}
                  onChange={(e) => setNewContent(e.target.value)}
                  className="bg-muted/50 border-white/5"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleCreate();
                    if (e.key === 'Escape') { setIsCreating(false); setNewContent(''); setNewTitle(''); }
                  }}
                />
                <div className="flex gap-2 justify-end">
                  <Button variant="ghost" size="sm" onClick={() => { setIsCreating(false); setNewContent(''); setNewTitle(''); }}>Cancelar</Button>
                  <Button size="sm" onClick={handleCreate} disabled={!newContent.trim()}>Criar</Button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {filteredItems.map((project, i) => {
            const progress = project.progress || 0;

            return (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.04 }}
                className="glass-card rounded-xl p-5 hover-lift group cursor-pointer transition-all relative"
                onClick={() => setEditingItem(project)}
              >
                <FolderOpen className="absolute top-4 right-4 w-5 h-5 text-cyan-400/20" />

                {project.is_important && (
                  <Star className="w-3.5 h-3.5 text-yellow-400 fill-yellow-400 mb-2" />
                )}

                <h3 className="font-display font-semibold text-base mb-1 pr-8">
                  {project.title || project.content}
                </h3>

                <p className="text-xs text-muted-foreground mb-4 line-clamp-2">{project.content}</p>

                {project.tags && project.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1 mb-3">
                    {project.tags.map((tag, idx) => (
                      <TagBadge key={idx} tag={tag} size="sm" />
                    ))}
                  </div>
                )}

                {/* Progress bar */}
                <div className="mb-2">
                  <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                    <motion.div
                      className={cn('h-full bg-gradient-to-r rounded-full', getProgressColor(progress))}
                      initial={{ width: 0 }}
                      animate={{ width: `${progress}%` }}
                      transition={{ duration: 0.6, delay: i * 0.08 }}
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <p className="text-[10px] text-muted-foreground">{progress}% concluído</p>
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                    <ItemActions
                      item={project}
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
            <FolderOpen className="w-12 h-12 mx-auto text-muted-foreground/30" />
            <p className="text-muted-foreground">
              {searchQuery ? 'Nenhum projeto encontrado' : 'Nenhum projeto ainda'}
            </p>
            {!searchQuery && (
              <Button size="sm" variant="outline" onClick={() => setIsCreating(true)} className="gap-1.5">
                <Plus className="w-4 h-4" />
                Criar primeiro projeto
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
