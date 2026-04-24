import { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  DndContext,
  closestCorners,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  DragOverEvent,
} from '@dnd-kit/core';
import {
  SortableContext,
  verticalListSortingStrategy,
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { useDroppable } from '@dnd-kit/core';
import { Plus, GripVertical, Clock, Star, Tag } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Item } from '@/types';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface KanbanColumn {
  id: string;
  title: string;
  color: string;
  dotColor: string;
  statuses: string[];
}

const COLUMNS: KanbanColumn[] = [
  { id: 'backlog', title: 'Backlog', color: 'text-gray-400', dotColor: 'bg-gray-400', statuses: ['backlog'] },
  { id: 'todo', title: 'A Fazer', color: 'text-blue-400', dotColor: 'bg-blue-400', statuses: ['active', 'raw'] },
  { id: 'in_progress', title: 'Em Progresso', color: 'text-amber-400', dotColor: 'bg-amber-400', statuses: ['in_progress'] },
  { id: 'done', title: 'Concluído', color: 'text-emerald-400', dotColor: 'bg-emerald-400', statuses: ['completed'] },
];

interface KanbanBoardProps {
  items: Item[];
  onUpdateItem: (id: string, updates: Partial<Item>) => void;
  onCreateItem: (content: string, status: string) => void;
  onEditItem: (item: Item) => void;
}

// Sortable card inside a column
function SortableKanbanCard({ item, onEdit }: { item: Item; onEdit: (item: Item) => void }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: item.id,
    data: { type: 'card', item },
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const priorityColors: Record<string, string> = {
    urgent: 'border-l-red-500',
    high: 'border-l-orange-500',
    medium: 'border-l-yellow-500',
    low: 'border-l-emerald-500',
  };

  return (
    <motion.div
      ref={setNodeRef}
      style={style}
      layout
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: isDragging ? 0.5 : 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      className={cn(
        'glass-card rounded-xl p-3 cursor-pointer group border-l-2 transition-all',
        priorityColors[item.priority || ''] || 'border-l-transparent',
        isDragging && 'ring-2 ring-primary/30'
      )}
      onClick={() => onEdit(item)}
    >
      {/* Drag handle + content */}
      <div className="flex items-start gap-2">
        <button
          {...attributes}
          {...listeners}
          className="mt-0.5 opacity-0 group-hover:opacity-60 hover:opacity-100 transition-opacity cursor-grab active:cursor-grabbing"
          onClick={(e) => e.stopPropagation()}
        >
          <GripVertical className="w-3.5 h-3.5 text-muted-foreground" />
        </button>

        <div className="flex-1 min-w-0">
          <p className={cn(
            'text-sm leading-snug',
            item.status === 'completed' && 'line-through text-muted-foreground'
          )}>
            {item.content}
          </p>

          <div className="flex items-center gap-2 mt-2 flex-wrap">
            {item.is_important && (
              <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
            )}
            {item.due_date && (
              <span className="flex items-center gap-1 text-[10px] text-muted-foreground">
                <Clock className="w-2.5 h-2.5" />
                {format(new Date(item.due_date), 'dd MMM', { locale: ptBR })}
              </span>
            )}
            {item.priority && (
              <span className={cn(
                'text-[10px] px-1.5 py-0.5 rounded-full',
                item.priority === 'urgent' && 'bg-red-500/20 text-red-400',
                item.priority === 'high' && 'bg-orange-500/20 text-orange-400',
                item.priority === 'medium' && 'bg-yellow-500/20 text-yellow-400',
                item.priority === 'low' && 'bg-emerald-500/20 text-emerald-400',
              )}>
                {item.priority}
              </span>
            )}
            {item.tags && item.tags.length > 0 && (
              <span className="flex items-center gap-0.5 text-[10px] text-muted-foreground">
                <Tag className="w-2.5 h-2.5" />
                {item.tags.length}
              </span>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

// Droppable column
function KanbanColumnComponent({
  column,
  items,
  onEdit,
  onCreateItem,
}: {
  column: KanbanColumn;
  items: Item[];
  onEdit: (item: Item) => void;
  onCreateItem: (content: string, status: string) => void;
}) {
  const [isAdding, setIsAdding] = useState(false);
  const [newContent, setNewContent] = useState('');

  const { setNodeRef, isOver } = useDroppable({
    id: column.id,
    data: { type: 'column', column },
  });

  const handleAdd = () => {
    if (!newContent.trim()) return;
    const status = column.statuses[0];
    onCreateItem(newContent.trim(), status);
    setNewContent('');
    setIsAdding(false);
  };

  return (
    <div
      ref={setNodeRef}
      className={cn(
        'kanban-column flex flex-col h-full min-h-[200px] transition-all',
        isOver && 'drop-target'
      )}
    >
      {/* Column header */}
      <div className="flex items-center justify-between mb-3 px-1">
        <div className="flex items-center gap-2">
          <div className={cn('w-2 h-2 rounded-full', column.dotColor)} />
          <h3 className={cn('text-sm font-semibold font-display', column.color)}>
            {column.title}
          </h3>
          <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-white/5 text-muted-foreground font-medium">
            {items.length}
          </span>
        </div>
        <button
          onClick={() => setIsAdding(true)}
          className="p-1 rounded-md hover:bg-white/5 text-muted-foreground hover:text-foreground transition-colors"
        >
          <Plus className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Cards */}
      <SortableContext items={items.map(i => i.id)} strategy={verticalListSortingStrategy}>
        <div className="flex-1 space-y-2 overflow-y-auto min-h-0 pr-1">
          <AnimatePresence>
            {items.map((item) => (
              <SortableKanbanCard key={item.id} item={item} onEdit={onEdit} />
            ))}
          </AnimatePresence>
        </div>
      </SortableContext>

      {/* Add card */}
      {isAdding ? (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="mt-2"
        >
          <Input
            value={newContent}
            onChange={(e) => setNewContent(e.target.value)}
            placeholder="Descreva a tarefa..."
            className="bg-muted/50 border-white/5 text-sm"
            autoFocus
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleAdd();
              if (e.key === 'Escape') setIsAdding(false);
            }}
          />
          <div className="flex gap-1.5 mt-1.5">
            <Button size="sm" className="h-7 text-xs" onClick={handleAdd}>Adicionar</Button>
            <Button size="sm" variant="ghost" className="h-7 text-xs" onClick={() => setIsAdding(false)}>Cancelar</Button>
          </div>
        </motion.div>
      ) : (
        <button
          onClick={() => setIsAdding(true)}
          className="mt-2 w-full p-2 rounded-lg border border-dashed border-white/10 text-xs text-muted-foreground hover:text-foreground hover:border-white/20 transition-colors text-center"
        >
          + Adicionar card
        </button>
      )}
    </div>
  );
}

export default function KanbanBoard({ items, onUpdateItem, onCreateItem, onEditItem }: KanbanBoardProps) {
  const [activeId, setActiveId] = useState<string | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } })
  );

  // Group items by column
  const columnItems = useMemo(() => {
    const grouped: Record<string, Item[]> = {};
    COLUMNS.forEach(col => {
      grouped[col.id] = items.filter(item =>
        col.statuses.includes(item.status || 'active')
      );
    });
    return grouped;
  }, [items]);

  const activeItem = activeId ? items.find(i => i.id === activeId) : null;

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string);
  };

  const handleDragOver = (event: DragOverEvent) => {
    // Handle moving between columns during drag
  };

  const handleDragEnd = (event: DragEndEvent) => {
    setActiveId(null);
    const { active, over } = event;
    if (!over) return;

    const activeItem = items.find(i => i.id === active.id);
    if (!activeItem) return;

    // Dropped on column
    const targetColumn = COLUMNS.find(c => c.id === over.id);
    if (targetColumn) {
      const newStatus = targetColumn.statuses[0];
      if (activeItem.status !== newStatus) {
        onUpdateItem(activeItem.id, { status: newStatus as Item['status'] });
      }
      return;
    }

    // Dropped on card — find which column that card belongs to
    const overItem = items.find(i => i.id === over.id);
    if (overItem) {
      const overColumn = COLUMNS.find(c => c.statuses.includes(overItem.status || 'active'));
      if (overColumn) {
        const newStatus = overColumn.statuses[0];
        if (activeItem.status !== newStatus) {
          onUpdateItem(activeItem.id, { status: newStatus as Item['status'] });
        }
      }
    }
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 h-full">
        {COLUMNS.map((column) => (
          <KanbanColumnComponent
            key={column.id}
            column={column}
            items={columnItems[column.id] || []}
            onEdit={onEditItem}
            onCreateItem={onCreateItem}
          />
        ))}
      </div>

      <DragOverlay>
        {activeItem ? (
          <div className="drag-overlay glass-card rounded-xl p-3 max-w-xs">
            <p className="text-sm">{activeItem.content}</p>
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}
