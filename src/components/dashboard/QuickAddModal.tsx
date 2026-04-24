import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, X, FileText, CheckSquare, Lightbulb, Target, CalendarDays, FolderKanban } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useItems } from '@/hooks/useItems';
import { useToast } from '@/hooks/use-toast';

const itemTypes = [
  { type: 'note', icon: FileText, label: 'Nota', color: 'text-mindflow-blue', bg: 'bg-mindflow-blue/10 hover:bg-mindflow-blue/20' },
  { type: 'task', icon: CheckSquare, label: 'Tarefa', color: 'text-mindflow-green', bg: 'bg-mindflow-green/10 hover:bg-mindflow-green/20' },
  { type: 'idea', icon: Lightbulb, label: 'Ideia', color: 'text-mindflow-purple', bg: 'bg-mindflow-purple/10 hover:bg-mindflow-purple/20' },
  { type: 'goal', icon: Target, label: 'Objetivo', color: 'text-mindflow-pink', bg: 'bg-mindflow-pink/10 hover:bg-mindflow-pink/20' },
  { type: 'event', icon: CalendarDays, label: 'Evento', color: 'text-mindflow-orange', bg: 'bg-mindflow-orange/10 hover:bg-mindflow-orange/20' },
  { type: 'project', icon: FolderKanban, label: 'Projeto', color: 'text-mindflow-cyan', bg: 'bg-mindflow-cyan/10 hover:bg-mindflow-cyan/20' },
] as const;

type ItemType = typeof itemTypes[number]['type'];

interface QuickAddModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function QuickAddModal({ isOpen, onClose }: QuickAddModalProps) {
  const [selectedType, setSelectedType] = useState<ItemType | null>(null);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { createItem } = useItems();
  const { toast } = useToast();

  const handleSubmit = async () => {
    if (!selectedType || !content.trim()) return;
    setIsSubmitting(true);
    try {
      await createItem.mutateAsync({
        type: selectedType,
        title: title.trim() || undefined,
        content: content.trim(),
        status: selectedType === 'task' ? 'active' : selectedType === 'idea' ? 'raw' : 'active',
      });
      toast({
        title: 'Criado!',
        description: `${itemTypes.find(t => t.type === selectedType)?.label} adicionado(a) com sucesso.`,
      });
      handleReset();
      onClose();
    } catch {
      toast({
        title: 'Erro',
        description: 'Não foi possível criar o item.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setSelectedType(null);
    setTitle('');
    setContent('');
  };

  const handleClose = () => {
    handleReset();
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="glass-card-elevated border-white/10 sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="font-display text-lg flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center">
              <Plus className="w-4 h-4 text-white" />
            </div>
            Criar Novo
          </DialogTitle>
        </DialogHeader>

        <AnimatePresence mode="wait">
          {!selectedType ? (
            <motion.div
              key="type-select"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              className="grid grid-cols-3 gap-2 pt-2"
            >
              {itemTypes.map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.type}
                    onClick={() => setSelectedType(item.type)}
                    className={`flex flex-col items-center gap-2 p-4 rounded-xl border border-transparent transition-all duration-200 ${item.bg}`}
                  >
                    <Icon className={`w-6 h-6 ${item.color}`} />
                    <span className="text-xs font-medium text-foreground/80">{item.label}</span>
                  </button>
                );
              })}
            </motion.div>
          ) : (
            <motion.div
              key="form"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              className="space-y-3 pt-2"
            >
              {/* Type indicator */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setSelectedType(null)}
                  className="p-1.5 rounded-lg hover:bg-muted transition-colors"
                >
                  <X className="w-4 h-4 text-muted-foreground" />
                </button>
                {(() => {
                  const typeConfig = itemTypes.find(t => t.type === selectedType);
                  if (!typeConfig) return null;
                  const Icon = typeConfig.icon;
                  return (
                    <span className={`flex items-center gap-1.5 text-sm font-medium ${typeConfig.color}`}>
                      <Icon className="w-4 h-4" />
                      {typeConfig.label}
                    </span>
                  );
                })()}
              </div>

              <Input
                placeholder="Título (opcional)"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="bg-muted/50 border-white/5 focus:border-primary/50"
                autoFocus
              />

              <Textarea
                placeholder="Descreva..."
                value={content}
                onChange={(e) => setContent(e.target.value)}
                rows={3}
                className="bg-muted/50 border-white/5 focus:border-primary/50 resize-none"
              />

              <div className="flex gap-2 justify-end pt-1">
                <Button variant="ghost" size="sm" onClick={handleClose}>
                  Cancelar
                </Button>
                <Button
                  size="sm"
                  onClick={handleSubmit}
                  disabled={!content.trim() || isSubmitting}
                  className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white hover:from-indigo-600 hover:to-purple-600"
                >
                  {isSubmitting ? 'Criando...' : 'Criar'}
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </DialogContent>
    </Dialog>
  );
}

export function QuickAddFab() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <motion.button
        className="fab-button md:hidden"
        onClick={() => setIsOpen(true)}
        whileTap={{ scale: 0.9 }}
        aria-label="Criar novo item"
      >
        <Plus className="w-6 h-6 text-white" />
      </motion.button>
      <QuickAddModal isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </>
  );
}
