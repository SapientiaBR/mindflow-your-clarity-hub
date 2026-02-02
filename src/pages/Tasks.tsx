import { useState, useCallback, useMemo } from 'react';
import AppLayout from '@/components/layout/AppLayout';
import { useItems } from '@/hooks/useItems';
import { motion, AnimatePresence } from 'framer-motion';
import { Checkbox } from '@/components/ui/checkbox';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { DraggableItem } from '@/components/items/DraggableItem';
import { ItemActions } from '@/components/items/ItemActions';
import { ItemEditModal } from '@/components/items/ItemEditModal';
import { TagBadge } from '@/components/tags/TagBadge';
import { Item } from '@/types';
import { Star, Clock, Bell, ChevronDown, ChevronUp, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';

export default function Tasks() {
  const { items, updateItem, deleteItem } = useItems('task');
  const [editingItem, setEditingItem] = useState<Item | null>(null);
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);
  const [orderedItems, setOrderedItems] = useState<Item[]>([]);
  const [showCompleted, setShowCompleted] = useState(true);

  // Split tasks into active and completed
  const { activeTasks, completedTasks } = useMemo(() => {
    const active = items.filter(item => item.status !== 'completed');
    const completed = items.filter(item => item.status === 'completed');
    return { activeTasks: active, completedTasks: completed };
  }, [items]);

  // Initialize ordered items
  const displayItems = orderedItems.length > 0 ? orderedItems : activeTasks;

  const toggleTask = (id: string, completed: boolean) => {
    updateItem.mutate({ id, status: completed ? 'completed' : 'active' });
  };

  const handleDragStart = useCallback((index: number) => {
    setDraggedIndex(index);
    setOrderedItems([...activeTasks]);
  }, [activeTasks]);

  const handleDragOver = useCallback((index: number) => {
    if (draggedIndex === null || draggedIndex === index) return;
    setDragOverIndex(index);
    
    // Reorder items
    const newItems = [...orderedItems.length > 0 ? orderedItems : activeTasks];
    const [draggedItem] = newItems.splice(draggedIndex, 1);
    newItems.splice(index, 0, draggedItem);
    setOrderedItems(newItems);
    setDraggedIndex(index);
  }, [draggedIndex, orderedItems, activeTasks]);

  const handleDragEnd = useCallback(() => {
    // Save new order to database
    orderedItems.forEach((item, index) => {
      if (item.sort_order !== index) {
        updateItem.mutate({ id: item.id, sort_order: index });
      }
    });
    
    setDraggedIndex(null);
    setDragOverIndex(null);
  }, [orderedItems, updateItem]);

  const handleSave = async (id: string, updates: Partial<Item>) => {
    await updateItem.mutateAsync({ id, ...updates });
  };

  const handleDelete = (id: string) => {
    deleteItem.mutate(id);
  };

  const handleToggleImportant = (id: string, isImportant: boolean) => {
    updateItem.mutate({ id, is_important: isImportant });
  };

  const getPriorityColor = (priority: string | undefined) => {
    switch (priority) {
      case 'urgent': return 'text-red-400 bg-red-500/20';
      case 'high': return 'text-orange-400 bg-orange-500/20';
      case 'medium': return 'text-yellow-400 bg-yellow-500/20';
      case 'low': return 'text-green-400 bg-green-500/20';
      default: return 'text-muted-foreground bg-muted/20';
    }
  };

  const TaskItem = ({ task, index, isDraggable = true }: { task: Item; index: number; isDraggable?: boolean }) => {
    const content = (
      <div 
        className={`glass-card rounded-xl p-4 flex items-start gap-3 group cursor-pointer transition-all hover:border-primary/30 ${
          task.status === 'completed' ? 'opacity-60' : ''
        }`}
        onClick={() => setEditingItem(task)}
      >
        <Checkbox 
          checked={task.status === 'completed'} 
          onCheckedChange={(c) => {
            toggleTask(task.id, !!c);
          }}
          onClick={(e) => e.stopPropagation()}
          className="mt-1" 
        />
        
        <div className="flex-1 min-w-0">
          <div className="flex items-start gap-2">
            {task.is_important && (
              <Star className="w-4 h-4 text-yellow-400 fill-yellow-400 mt-0.5 flex-shrink-0" />
            )}
            <p className={`flex-1 ${task.status === 'completed' ? 'line-through text-muted-foreground' : ''}`}>
              {task.content}
            </p>
          </div>
          
          <div className="flex flex-wrap items-center gap-2 mt-2">
            {task.due_date && (
              <span className="flex items-center gap-1 text-xs text-muted-foreground">
                <Clock className="w-3 h-3" />
                {format(new Date(task.due_date), "dd MMM yyyy 'às' HH:mm", { locale: ptBR })}
              </span>
            )}
            
            {task.reminder_at && (
              <span className="flex items-center gap-1 text-xs text-orange-400">
                <Bell className="w-3 h-3" />
                {format(new Date(task.reminder_at), "dd MMM HH:mm", { locale: ptBR })}
              </span>
            )}
            
            {task.tags && task.tags.length > 0 && (
              <div className="flex flex-wrap gap-1">
                {task.tags.map((tag, idx) => (
                  <TagBadge key={idx} tag={tag} size="sm" />
                ))}
              </div>
            )}
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <span className={`text-xs px-2 py-1 rounded-full ${getPriorityColor(task.priority)}`}>
            {task.priority || 'medium'}
          </span>
          
          <ItemActions
            item={task}
            onEdit={setEditingItem}
            onDelete={handleDelete}
            onToggleImportant={handleToggleImportant}
          />
        </div>
      </div>
    );

    if (isDraggable) {
      return (
        <DraggableItem
          id={task.id}
          index={index}
          onDragStart={handleDragStart}
          onDragOver={handleDragOver}
          onDragEnd={handleDragEnd}
          isDragging={draggedIndex === index}
          isDraggedOver={dragOverIndex === index}
        >
          {content}
        </DraggableItem>
      );
    }

    return (
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        transition={{ duration: 0.2 }}
      >
        {content}
      </motion.div>
    );
  };

  return (
    <AppLayout>
      <div className="flex-1 p-4 md:p-6 overflow-y-auto">
        <header className="mb-6">
          <h1 className="text-2xl md:text-3xl font-display font-bold gradient-text">✅ Tarefas</h1>
          <p className="text-muted-foreground">Arraste para reordenar • Clique para editar</p>
        </header>
        
        <div className="space-y-6 max-w-2xl">
          {/* Active Tasks */}
          <div className="space-y-2">
            {displayItems.map((task, i) => (
              <TaskItem key={task.id} task={task} index={i} isDraggable />
            ))}
            
            {!displayItems.length && (
              <p className="text-muted-foreground text-center py-12">
                Nenhuma tarefa ativa. Use o chat para criar!
              </p>
            )}
          </div>

          {/* Completed Tasks Section */}
          {completedTasks.length > 0 && (
            <Collapsible open={showCompleted} onOpenChange={setShowCompleted}>
              <CollapsibleTrigger asChild>
                <Button 
                  variant="ghost" 
                  className="w-full justify-between p-4 h-auto glass-card rounded-xl hover:bg-muted/30"
                >
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5 text-green-400" />
                    <span className="font-medium">Tarefas Finalizadas</span>
                    <span className="text-sm text-muted-foreground">({completedTasks.length})</span>
                  </div>
                  {showCompleted ? (
                    <ChevronUp className="w-5 h-5 text-muted-foreground" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-muted-foreground" />
                  )}
                </Button>
              </CollapsibleTrigger>
              <CollapsibleContent className="space-y-2 mt-2">
                <AnimatePresence>
                  {completedTasks.map((task, i) => (
                    <TaskItem key={task.id} task={task} index={i} isDraggable={false} />
                  ))}
                </AnimatePresence>
              </CollapsibleContent>
            </Collapsible>
          )}
        </div>
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
