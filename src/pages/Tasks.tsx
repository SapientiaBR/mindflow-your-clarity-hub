import { useState, useMemo } from 'react';
import AppLayout from '@/components/layout/AppLayout';
import { useItems } from '@/hooks/useItems';
import { motion, AnimatePresence } from 'framer-motion';
import { ItemActions } from '@/components/items/ItemActions';
import { ItemEditModal } from '@/components/items/ItemEditModal';
import { TagBadge } from '@/components/tags/TagBadge';
import { Item } from '@/types';
import {
  CheckCircle2, Circle, Star, LayoutList, LayoutGrid,
  Plus, Filter, Search, Clock, ArrowUpDown
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import KanbanBoard from '@/components/tasks/KanbanBoard';
import { cn } from '@/lib/utils';

type ViewMode = 'list' | 'kanban';
type SortBy = 'date' | 'priority' | 'name';
type FilterPriority = 'all' | 'urgent' | 'high' | 'medium' | 'low';

export default function Tasks() {
  const { items, updateItem, deleteItem, createItem } = useItems('task');
  const [editingItem, setEditingItem] = useState<Item | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>('list');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterPriority, setFilterPriority] = useState<FilterPriority>('all');
  const [sortBy, setSortBy] = useState<SortBy>('date');
  const [isAddingInline, setIsAddingInline] = useState(false);
  const [newTaskContent, setNewTaskContent] = useState('');

  const handleSave = async (id: string, updates: Partial<Item>) => {
    await updateItem.mutateAsync({ id, ...updates });
  };

  const handleDelete = (id: string) => {
    deleteItem.mutate(id);
  };

  const handleToggleImportant = (id: string, isImportant: boolean) => {
    updateItem.mutate({ id, is_important: isImportant });
  };

  const handleToggleComplete = (id: string, currentStatus: string) => {
    const newStatus = currentStatus === 'completed' ? 'active' : 'completed';
    updateItem.mutate({ id, status: newStatus });
  };

  const handleCreateTask = (content: string, status: string = 'active') => {
    createItem.mutate({
      type: 'task',
      content,
      status,
    });
  };

  const handleAddInline = () => {
    if (!newTaskContent.trim()) return;
    handleCreateTask(newTaskContent.trim());
    setNewTaskContent('');
    setIsAddingInline(false);
  };

  // Filter and sort
  const filteredItems = useMemo(() => {
    let filtered = [...items];

    // Search
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      filtered = filtered.filter(i =>
        i.content.toLowerCase().includes(q) ||
        i.title?.toLowerCase().includes(q) ||
        i.tags?.some(t => t.toLowerCase().includes(q))
      );
    }

    // Priority filter
    if (filterPriority !== 'all') {
      filtered = filtered.filter(i => i.priority === filterPriority);
    }

    // Sort
    filtered.sort((a, b) => {
      if (a.status === 'completed' && b.status !== 'completed') return 1;
      if (a.status !== 'completed' && b.status === 'completed') return -1;

      switch (sortBy) {
        case 'priority': {
          const order = { urgent: 0, high: 1, medium: 2, low: 3 };
          return (order[a.priority as keyof typeof order] ?? 4) - (order[b.priority as keyof typeof order] ?? 4);
        }
        case 'name':
          return (a.content || '').localeCompare(b.content || '');
        case 'date':
        default:
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      }
    });

    return filtered;
  }, [items, searchQuery, filterPriority, sortBy]);

  const completedCount = items.filter(i => i.status === 'completed').length;
  const totalCount = items.length;
  const completionPct = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  return (
    <AppLayout>
      <div className="flex-1 p-4 md:p-6 overflow-y-auto">
        {/* Header */}
        <header className="mb-5">
          <div className="flex items-center justify-between gap-3 flex-wrap">
            <div>
              <h1 className="text-2xl md:text-3xl font-display font-bold gradient-text">Tarefas</h1>
              <p className="text-sm text-muted-foreground mt-0.5">
                {completedCount}/{totalCount} concluídas · {completionPct}%
              </p>
            </div>
            <div className="flex items-center gap-2">
              {/* View toggle */}
              <div className="flex items-center glass-card rounded-lg p-0.5">
                <button
                  onClick={() => setViewMode('list')}
                  className={cn(
                    'p-1.5 rounded-md transition-all',
                    viewMode === 'list' ? 'bg-primary text-primary-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'
                  )}
                >
                  <LayoutList className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode('kanban')}
                  className={cn(
                    'p-1.5 rounded-md transition-all',
                    viewMode === 'kanban' ? 'bg-primary text-primary-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'
                  )}
                >
                  <LayoutGrid className="w-4 h-4" />
                </button>
              </div>

              {/* Add button */}
              <Button
                size="sm"
                onClick={() => setIsAddingInline(true)}
                className="gap-1.5 bg-gradient-to-r from-indigo-500 to-purple-500 text-white hover:from-indigo-600 hover:to-purple-600"
              >
                <Plus className="w-4 h-4" />
                <span className="hidden sm:inline">Nova</span>
              </Button>
            </div>
          </div>

          {/* Progress bar */}
          <div className="mt-3 h-1.5 bg-muted rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-indigo-500 to-emerald-500 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${completionPct}%` }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
            />
          </div>

          {/* Filters (list view only) */}
          {viewMode === 'list' && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="flex items-center gap-2 mt-3 flex-wrap"
            >
              <div className="relative flex-1 min-w-[180px] max-w-xs">
                <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
                <Input
                  placeholder="Buscar tarefas..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-8 h-8 text-sm bg-muted/50 border-white/5"
                />
              </div>
              <div className="flex items-center gap-1">
                {(['all', 'urgent', 'high', 'medium', 'low'] as const).map(p => (
                  <button
                    key={p}
                    onClick={() => setFilterPriority(p)}
                    className={cn(
                      'text-[11px] px-2 py-1 rounded-full transition-colors',
                      filterPriority === p
                        ? 'bg-primary/20 text-primary font-medium'
                        : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                    )}
                  >
                    {p === 'all' ? 'Todas' : p.charAt(0).toUpperCase() + p.slice(1)}
                  </button>
                ))}
              </div>
              <button
                onClick={() => setSortBy(s => s === 'date' ? 'priority' : s === 'priority' ? 'name' : 'date')}
                className="flex items-center gap-1 text-[11px] text-muted-foreground hover:text-foreground px-2 py-1 rounded-full hover:bg-muted transition-colors"
              >
                <ArrowUpDown className="w-3 h-3" />
                {sortBy === 'date' ? 'Data' : sortBy === 'priority' ? 'Prioridade' : 'Nome'}
              </button>
            </motion.div>
          )}
        </header>

        {/* Inline add */}
        <AnimatePresence>
          {isAddingInline && viewMode === 'list' && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mb-4"
            >
              <div className="glass-card rounded-xl p-3 flex items-center gap-3">
                <Circle className="w-5 h-5 text-muted-foreground shrink-0" />
                <Input
                  value={newTaskContent}
                  onChange={(e) => setNewTaskContent(e.target.value)}
                  placeholder="Descreva a tarefa e pressione Enter..."
                  className="border-0 bg-transparent p-0 h-auto text-sm focus-visible:ring-0 focus-visible:ring-offset-0"
                  autoFocus
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleAddInline();
                    if (e.key === 'Escape') {
                      setIsAddingInline(false);
                      setNewTaskContent('');
                    }
                  }}
                />
                <Button size="sm" variant="ghost" onClick={() => { setIsAddingInline(false); setNewTaskContent(''); }}>
                  Cancelar
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Content */}
        {viewMode === 'kanban' ? (
          <KanbanBoard
            items={items}
            onUpdateItem={(id, updates) => updateItem.mutate({ id, ...updates })}
            onCreateItem={handleCreateTask}
            onEditItem={setEditingItem}
          />
        ) : (
          <div className="space-y-2">
            {filteredItems.map((task, i) => (
              <motion.div
                key={task.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.03 }}
                className={cn(
                  'glass-card rounded-xl p-3 group hover-lift cursor-pointer flex items-start gap-3 transition-all',
                  task.status === 'completed' && 'opacity-60'
                )}
              >
                {/* Checkbox */}
                <button
                  onClick={(e) => { e.stopPropagation(); handleToggleComplete(task.id, task.status); }}
                  className="mt-0.5 shrink-0 transition-colors"
                >
                  {task.status === 'completed' ? (
                    <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                  ) : (
                    <Circle className="w-5 h-5 text-muted-foreground hover:text-indigo-400" />
                  )}
                </button>

                {/* Content */}
                <div className="flex-1 min-w-0" onClick={() => setEditingItem(task)}>
                  <p className={cn(
                    'text-sm leading-snug',
                    task.status === 'completed' && 'line-through text-muted-foreground'
                  )}>
                    {task.content}
                  </p>

                  <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                    {task.is_important && (
                      <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
                    )}
                    {task.priority && (
                      <span className={cn(
                        'text-[10px] px-1.5 py-0.5 rounded-full',
                        task.priority === 'urgent' && 'bg-red-500/20 text-red-400',
                        task.priority === 'high' && 'bg-orange-500/20 text-orange-400',
                        task.priority === 'medium' && 'bg-yellow-500/20 text-yellow-400',
                        task.priority === 'low' && 'bg-emerald-500/20 text-emerald-400',
                      )}>
                        {task.priority}
                      </span>
                    )}
                    {task.due_date && (
                      <span className="flex items-center gap-1 text-[10px] text-muted-foreground">
                        <Clock className="w-2.5 h-2.5" />
                        {new Date(task.due_date).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' })}
                      </span>
                    )}
                    {task.tags?.map((tag, idx) => (
                      <TagBadge key={idx} tag={tag} size="sm" />
                    ))}
                  </div>
                </div>

                {/* Actions */}
                <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                  <ItemActions
                    item={task}
                    onEdit={setEditingItem}
                    onDelete={handleDelete}
                    onToggleImportant={handleToggleImportant}
                  />
                </div>
              </motion.div>
            ))}

            {!filteredItems.length && (
              <div className="text-center py-16 space-y-3">
                <CheckCircle2 className="w-12 h-12 mx-auto text-muted-foreground/30" />
                <p className="text-muted-foreground">
                  {searchQuery ? 'Nenhuma tarefa encontrada' : 'Nenhuma tarefa ainda'}
                </p>
                {!searchQuery && (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setIsAddingInline(true)}
                    className="gap-1.5"
                  >
                    <Plus className="w-4 h-4" />
                    Criar primeira tarefa
                  </Button>
                )}
              </div>
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
