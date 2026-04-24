import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { motion } from 'framer-motion';
import { GripVertical } from 'lucide-react';
import { cn } from '@/lib/utils';

interface DraggableDashboardCardProps {
  id: string;
  children: React.ReactNode;
}

export default function DraggableDashboardCard({ id, children }: DraggableDashboardCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const style = {
    transform: CSS.Translate.toString(transform),
    transition,
    zIndex: isDragging ? 50 : undefined,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        'relative group h-full',
        isDragging && 'opacity-50 scale-[0.98]'
      )}
    >
      {/* Drag handle */}
      <button
        {...attributes}
        {...listeners}
        className={cn(
          'absolute -top-2 -right-2 z-20 p-1.5 rounded-lg',
          'bg-primary/90 text-primary-foreground shadow-lg',
          'backdrop-blur-sm border border-white/20',
          'opacity-0 group-hover:opacity-100 transition-all duration-200 hover:scale-110',
          'cursor-grab active:cursor-grabbing',
          'focus:outline-none focus:ring-2 focus:ring-primary/50'
        )}
        aria-label="Arrastar card"
      >
        <GripVertical className="w-4 h-4" />
      </button>

      {children}
    </div>
  );
}
