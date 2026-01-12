import { motion } from 'framer-motion';
import { Plus, Maximize2, ZoomIn, ZoomOut, RotateCcw, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface MindMapToolbarProps {
  onAddNode: () => void;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onFitView: () => void;
  onAutoLayout: () => void;
}

export default function MindMapToolbar({
  onAddNode,
  onZoomIn,
  onZoomOut,
  onFitView,
  onAutoLayout,
}: MindMapToolbarProps) {
  const tools = [
    { icon: Plus, label: 'Adicionar Ideia', onClick: onAddNode, primary: true },
    { icon: ZoomIn, label: 'Zoom In', onClick: onZoomIn },
    { icon: ZoomOut, label: 'Zoom Out', onClick: onZoomOut },
    { icon: Maximize2, label: 'Centralizar', onClick: onFitView },
    { icon: Sparkles, label: 'Auto-organizar', onClick: onAutoLayout },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="absolute bottom-4 left-1/2 -translate-x-1/2 z-50"
    >
      <div className="flex items-center gap-2 p-2 rounded-2xl bg-card/90 backdrop-blur-xl border border-white/10 shadow-2xl">
        <TooltipProvider delayDuration={200}>
          {tools.map((tool, index) => (
            <Tooltip key={tool.label}>
              <TooltipTrigger asChild>
                <motion.div
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Button
                    variant={tool.primary ? 'default' : 'ghost'}
                    size="icon"
                    onClick={tool.onClick}
                    className={`
                      ${tool.primary 
                        ? 'bg-gradient-to-r from-mindflow-purple to-mindflow-blue hover:opacity-90' 
                        : 'hover:bg-white/10'
                      }
                      transition-all duration-200
                    `}
                  >
                    <tool.icon className="w-4 h-4" />
                  </Button>
                </motion.div>
              </TooltipTrigger>
              <TooltipContent side="top" className="bg-card border-white/10">
                <p>{tool.label}</p>
              </TooltipContent>
            </Tooltip>
          ))}
        </TooltipProvider>
      </div>
    </motion.div>
  );
}
