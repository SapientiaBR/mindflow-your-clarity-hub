import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { GripVertical } from 'lucide-react';
import { cn } from '@/lib/utils';

interface DraggableItemProps {
  id: string;
  index: number;
  onDragStart: (index: number) => void;
  onDragOver: (index: number) => void;
  onDragEnd: () => void;
  isDragging: boolean;
  isDraggedOver: boolean;
  children: React.ReactNode;
  className?: string;
}

export function DraggableItem({
  id,
  index,
  onDragStart,
  onDragOver,
  onDragEnd,
  isDragging,
  isDraggedOver,
  children,
  className
}: DraggableItemProps) {
  const [isGrabbing, setIsGrabbing] = useState(false);
  const itemRef = useRef<HTMLDivElement>(null);

  const handleDragStart = (e: React.DragEvent<HTMLDivElement>) => {
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', id);
    setIsGrabbing(true);
    onDragStart(index);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    onDragOver(index);
  };

  const handleDragEnd = () => {
    setIsGrabbing(false);
    onDragEnd();
  };

  return (
    <div
      ref={itemRef}
      draggable
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
      className={cn(
        "relative group",
        isDragging && "opacity-50",
        isDraggedOver && "before:absolute before:inset-x-0 before:-top-1 before:h-0.5 before:bg-mindflow-purple before:rounded-full",
        isGrabbing && "scale-[1.02]",
        "transition-all duration-200",
        className
      )}
    >
      <div className={cn(
        "flex items-start gap-2",
        isGrabbing && "cursor-grabbing"
      )}>
        <button
          className={cn(
            "mt-3 p-1 rounded opacity-0 group-hover:opacity-100 transition-opacity cursor-grab",
            "hover:bg-white/10 text-muted-foreground hover:text-foreground",
            isGrabbing && "opacity-100 cursor-grabbing"
          )}
          onMouseDown={() => setIsGrabbing(true)}
          onMouseUp={() => setIsGrabbing(false)}
        >
          <GripVertical className="w-4 h-4" />
        </button>
        <div className="flex-1">
          {children}
        </div>
      </div>
    </div>
  );
}
