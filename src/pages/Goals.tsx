import { useState, useMemo } from 'react';
import AppLayout from '@/components/layout/AppLayout';
import { useItems } from '@/hooks/useItems';
import { motion, AnimatePresence } from 'framer-motion';
import { ItemActions } from '@/components/items/ItemActions';
import { ItemEditModal } from '@/components/items/ItemEditModal';
import { TagBadge } from '@/components/tags/TagBadge';
import { Item } from '@/types';
import { Star, Target, Trophy, Plus, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

const statusConfig: Record<string, { label: string; color: string; ring: string }> = {
  active: { label: '🎯 Ativo', color: 'text-purple-400', ring: 'stroke-purple-500' },
  in_progress: { label: '🚀 Em progresso', color: 'text-blue-400', ring: 'stroke-blue-500' },
  completed: { label: '🏆 Alcançado', color: 'text-emerald-400', ring: 'stroke-emerald-500' },
  archived: { label: '📦 Arquivado', color: 'text-gray-400', ring: 'stroke-gray-500' },
};

const priorityConfig: Record<string, { label: string; color: string }> = {
  urgent: { label: 'Urgente', color: 'bg-red-500/20 text-red-400' },
  high: { label: 'Alta', color: 'bg-orange-500/20 text-orange-400' },
  medium: { label: 'Média', color: 'bg-yellow-500/20 text-yellow-400' },
  low: { label: 'Baixa', color: 'bg-emerald-500/20 text-emerald-400' },
};

// SVG circular progress ring
function ProgressRing({ progress, size = 48, strokeWidth = 3, className }: {
  progress: number;
  size?: number;
  strokeWidth?: number;
  className?: string;
}) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (progress / 100) * circumference;

  return (
    <svg width={size} height={size} className={cn('transform -rotate-90', className)}>
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        stroke="currentColor"
        strokeWidth={strokeWidth}
        className="text-white/5"
      />
      <motion.circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        className="stroke-purple-500"
        initial={{ strokeDashoffset: circumference }}
        animate={{ strokeDashoffset: offset }}
        transition={{ duration: 1, ease: 'easeOut' }}
        style={{ strokeDasharray: circumference }}
      />
    </svg>
  );
}

export default function Goals() {
  const { items, updateItem, deleteItem, createItem } = useItems('goal');
  const [editingItem, setEditingItem] = useState<Item | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const [newContent, setNewContent] = useState('');
  const [newTitle, setNewTitle] = useState('');

  const handleSave = async (id: string, updates: Partial<Item>) => {
    await updateItem.mutateAsync({ id, ...updates });
  };

  const handleDelete = (id: string) => deleteItem.mutate(id);
  const handleToggleImportant = (id: string, isImportant: boolean) => updateItem.mutate({ id, is_important: isImportant });

  const handleCreate = () => {
    if (!newContent.trim()) return;
    createItem.mutate({
      type: 'goal',
      content: newContent.trim(),
      title: newTitle.trim() || undefined,
      status: 'active',
    });
    setNewContent('');
    setNewTitle('');
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

  // Stats
  const completed = items.filter(g => g.status === 'completed').length;
  const total = items.length;

  return (
    <AppLayout>
      <div className="flex-1 p-4 md:p-6 overflow-y-auto">
        <header className="mb-5">
          <div className="flex items-center justify-between gap-3">
            <div>
              <h1 className="text-2xl md:text-3xl font-display font-bold gradient-text">🎯 Objetivos</h1>
              <p className="text-sm text-muted-foreground mt-0.5">
                {completed}/{total} alcançados
              </p>
            </div>
            <Button
              size="sm"
              onClick={() => setIsCreating(true)}
              className="gap-1.5 bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:from-purple-600 hover:to-pink-600"
            >
              <Plus className="w-4 h-4" />
              <span className="hidden sm:inline">Novo Objetivo</span>
            </Button>
          </div>

          <div className="relative mt-3 max-w-sm">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
            <Input
              placeholder="Buscar objetivos..."
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
                  placeholder="Título do objetivo"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="bg-muted/50 border-white/5"
                  autoFocus
                />
                <Input
                  placeholder="Descrição..."
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

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {filteredItems.map((goal, i) => {
            const status = statusConfig[goal.status] || statusConfig.active;
            const priority = priorityConfig[goal.priority || ''];
            // Simulate progress based on status
            const progress = goal.status === 'completed' ? 100
              : goal.status === 'in_progress' ? 60
              : goal.status === 'active' ? 25
              : 0;

            return (
              <motion.div
                key={goal.id}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.04 }}
                className="glass-card rounded-xl p-4 hover-lift group cursor-pointer transition-all relative"
                style={{ borderLeft: '2px solid hsl(var(--mindflow-purple) / 0.3)' }}
                onClick={() => setEditingItem(goal)}
              >
                <Target className="absolute top-3 right-3 w-4 h-4 text-purple-400/20" />

                {goal.is_important && (
                  <Star className="w-3.5 h-3.5 text-yellow-400 fill-yellow-400 mb-2" />
                )}

                <div className="flex items-start gap-3">
                  {/* Progress ring */}
                  <div className="relative shrink-0">
                    <ProgressRing progress={progress} size={42} strokeWidth={3} />
                    <span className="absolute inset-0 flex items-center justify-center text-[10px] font-bold text-foreground/70 rotate-0">
                      {progress}%
                    </span>
                  </div>

                  <div className="flex-1 min-w-0">
                    {goal.title && (
                      <h3 className="text-sm font-semibold text-foreground mb-1 font-display truncate">{goal.title}</h3>
                    )}
                    <p className="text-xs text-foreground/70 line-clamp-2">{goal.content}</p>
                  </div>
                </div>

                {goal.tags && goal.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-3">
                    {goal.tags.map((tag, idx) => (
                      <TagBadge key={idx} tag={tag} size="sm" />
                    ))}
                  </div>
                )}

                <div className="flex items-center justify-between mt-3 pt-2 border-t border-white/5">
                  <div className="flex items-center gap-1.5">
                    <span className={cn('text-[10px] px-2 py-0.5 rounded-full', status.color, 'bg-current/10')}
                      style={{ background: 'hsl(var(--muted) / 0.5)' }}
                    >
                      {status.label}
                    </span>
                    {priority && (
                      <span className={cn('text-[10px] px-2 py-0.5 rounded-full', priority.color)}>
                        {priority.label}
                      </span>
                    )}
                  </div>

                  <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                    <ItemActions
                      item={goal}
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
            <Trophy className="w-12 h-12 mx-auto text-muted-foreground/30" />
            <p className="text-muted-foreground">
              {searchQuery ? 'Nenhum objetivo encontrado' : 'Nenhum objetivo ainda'}
            </p>
            {!searchQuery && (
              <Button size="sm" variant="outline" onClick={() => setIsCreating(true)} className="gap-1.5">
                <Plus className="w-4 h-4" />
                Definir primeiro objetivo
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
