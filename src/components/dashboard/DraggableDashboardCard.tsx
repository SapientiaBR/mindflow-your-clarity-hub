import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { GripVertical } from 'lucide-react';
import { cn } from '@/lib/utils';

interface DraggableDashboardCardProps {
  id: string;
  index: number;
  onDragStart: (index: number) => void;
  onDragOver: (index: number) => void;
  onDragEnd: () => void;
  isDragging: boolean;
  isDraggedOver: boolean;
  children: React.ReactNode;
}

export default function DraggableDashboardCard({
  id,
  index,
  onDragStart,
  onDragOver,
  onDragEnd,
  isDragging,
  isDraggedOver,
  children,
}: DraggableDashboardCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [isGrabbing, setIsGrabbing] = useState(false);

  const handleDragStart = (e: React.DragEvent<HTMLDivElement>) => {
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', index.toString());
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
      draggable
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={cn(
        'relative group transition-all duration-200',
        isDragging && 'opacity-50 scale-[1.02]',
        isDraggedOver && 'ring-2 ring-primary/50 ring-offset-2 ring-offset-background rounded-2xl',
        isGrabbing ? 'cursor-grabbing' : 'cursor-grab'
      )}
    >
      {/* Drag handle indicator */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ 
          opacity: isHovered && !isDragging ? 1 : 0,
          scale: isHovered && !isDragging ? 1 : 0.8
        }}
        className={cn(
          'absolute -top-2 -right-2 z-20 p-1.5 rounded-lg',
          'bg-primary/90 text-primary-foreground shadow-lg',
          'backdrop-blur-sm border border-white/20',
          'transition-colors duration-200'
        )}
      >
        <GripVertical className="w-4 h-4" />
      </motion.div>

      {/* Drop indicator line */}
      {isDraggedOver && (
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          className="absolute -top-1 left-0 right-0 h-1 bg-primary rounded-full shadow-lg"
        />
      )}

      {children}
    </div>
  );
}
