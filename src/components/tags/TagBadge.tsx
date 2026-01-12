import { X } from 'lucide-react';
import { cn } from '@/lib/utils';

export const TAG_COLORS = [
  { name: 'red', bg: 'bg-red-500/20', text: 'text-red-400', border: 'border-red-500/30' },
  { name: 'orange', bg: 'bg-orange-500/20', text: 'text-orange-400', border: 'border-orange-500/30' },
  { name: 'yellow', bg: 'bg-yellow-500/20', text: 'text-yellow-400', border: 'border-yellow-500/30' },
  { name: 'green', bg: 'bg-green-500/20', text: 'text-green-400', border: 'border-green-500/30' },
  { name: 'blue', bg: 'bg-blue-500/20', text: 'text-blue-400', border: 'border-blue-500/30' },
  { name: 'purple', bg: 'bg-purple-500/20', text: 'text-purple-400', border: 'border-purple-500/30' },
  { name: 'pink', bg: 'bg-pink-500/20', text: 'text-pink-400', border: 'border-pink-500/30' },
  { name: 'cyan', bg: 'bg-cyan-500/20', text: 'text-cyan-400', border: 'border-cyan-500/30' },
] as const;

export type TagColor = typeof TAG_COLORS[number]['name'];

export interface ParsedTag {
  name: string;
  color: TagColor;
}

export function parseTag(tag: string): ParsedTag {
  const [name, color] = tag.split(':');
  const validColor = TAG_COLORS.find(c => c.name === color);
  return {
    name: name || tag,
    color: validColor ? color as TagColor : 'blue'
  };
}

export function stringifyTag(name: string, color: TagColor): string {
  return `${name}:${color}`;
}

export function getTagColorClasses(color: TagColor) {
  return TAG_COLORS.find(c => c.name === color) || TAG_COLORS[4]; // default blue
}

interface TagBadgeProps {
  tag: string;
  onRemove?: () => void;
  className?: string;
  size?: 'sm' | 'md';
}

export function TagBadge({ tag, onRemove, className, size = 'sm' }: TagBadgeProps) {
  const { name, color } = parseTag(tag);
  const colorClasses = getTagColorClasses(color);
  
  return (
    <span 
      className={cn(
        'inline-flex items-center gap-1 rounded-full border',
        colorClasses.bg,
        colorClasses.text,
        colorClasses.border,
        size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-3 py-1 text-sm',
        className
      )}
    >
      {name}
      {onRemove && (
        <button 
          onClick={(e) => {
            e.stopPropagation();
            onRemove();
          }}
          className="hover:bg-white/10 rounded-full p-0.5 transition-colors"
        >
          <X className="w-3 h-3" />
        </button>
      )}
    </span>
  );
}
