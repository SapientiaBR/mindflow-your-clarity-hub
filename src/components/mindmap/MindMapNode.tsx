import { memo } from 'react';
import { Handle, Position, NodeProps } from '@xyflow/react';
import { motion } from 'framer-motion';
import { Lightbulb, Edit3, Trash2, Link } from 'lucide-react';

export interface MindMapNodeData {
  label: string;
  content: string;
  status?: string;
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
  onConnect?: (id: string) => void;
  [key: string]: unknown;
}

function MindMapNode({ id, data, selected }: NodeProps) {
  const nodeData = data as MindMapNodeData;

  return (
    <motion.div
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      whileHover={{ scale: 1.05 }}
      className={`
        relative group cursor-pointer
        min-w-[180px] max-w-[250px]
        ${selected ? 'z-50' : 'z-10'}
      `}
    >
      {/* Glow effect */}
      <div className={`
        absolute -inset-2 rounded-2xl blur-xl transition-opacity duration-300
        bg-gradient-to-r from-mindflow-purple/40 to-mindflow-blue/40
        ${selected ? 'opacity-100' : 'opacity-0 group-hover:opacity-60'}
      `} />

      {/* Main node */}
      <div className={`
        relative
        bg-gradient-to-br from-card via-card to-mindflow-purple/10
        backdrop-blur-xl
        rounded-2xl
        border-2 transition-all duration-300
        ${selected 
          ? 'border-mindflow-purple shadow-[0_0_30px_-5px_hsl(var(--mindflow-purple)/0.6)]' 
          : 'border-white/10 hover:border-mindflow-purple/50'
        }
        p-4
      `}>
        {/* Header */}
        <div className="flex items-center gap-2 mb-2">
          <div className="p-1.5 rounded-lg bg-mindflow-purple/20">
            <Lightbulb className="w-4 h-4 text-mindflow-purple" />
          </div>
          <span className="text-xs text-muted-foreground font-medium uppercase tracking-wide">
            Ideia
          </span>
        </div>

        {/* Content */}
        <p className="text-sm font-medium leading-relaxed">
          {nodeData.label}
        </p>

        {/* Action buttons - show on hover */}
        <div className="absolute -top-2 -right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-all duration-200 scale-90 group-hover:scale-100">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={(e) => {
              e.stopPropagation();
              nodeData.onEdit?.(id);
            }}
            className="p-1.5 rounded-lg bg-mindflow-blue text-white shadow-lg"
          >
            <Edit3 className="w-3 h-3" />
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={(e) => {
              e.stopPropagation();
              nodeData.onConnect?.(id);
            }}
            className="p-1.5 rounded-lg bg-mindflow-purple text-white shadow-lg"
          >
            <Link className="w-3 h-3" />
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={(e) => {
              e.stopPropagation();
              nodeData.onDelete?.(id);
            }}
            className="p-1.5 rounded-lg bg-destructive text-white shadow-lg"
          >
            <Trash2 className="w-3 h-3" />
          </motion.button>
        </div>

        {/* Status indicator */}
        <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-8 h-1 rounded-full bg-gradient-to-r from-mindflow-purple to-mindflow-blue" />
      </div>

      {/* Connection handles */}
      <Handle
        type="target"
        position={Position.Left}
        className="!w-3 !h-3 !bg-mindflow-purple !border-2 !border-card transition-all hover:!scale-125"
      />
      <Handle
        type="source"
        position={Position.Right}
        className="!w-3 !h-3 !bg-mindflow-blue !border-2 !border-card transition-all hover:!scale-125"
      />
    </motion.div>
  );
}

export default memo(MindMapNode);
