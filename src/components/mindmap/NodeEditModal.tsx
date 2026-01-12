import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Lightbulb, Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

interface NodeEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: { content: string }) => void;
  initialContent?: string;
  mode: 'create' | 'edit';
}

export default function NodeEditModal({
  isOpen,
  onClose,
  onSave,
  initialContent = '',
  mode,
}: NodeEditModalProps) {
  const [content, setContent] = useState(initialContent);

  const handleSave = () => {
    if (content.trim()) {
      onSave({ content: content.trim() });
      setContent('');
      onClose();
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-md"
          >
            <div className="relative bg-card border border-white/10 rounded-2xl shadow-2xl overflow-hidden">
              {/* Gradient decoration */}
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-mindflow-purple via-mindflow-blue to-mindflow-green" />

              {/* Header */}
              <div className="flex items-center justify-between p-4 border-b border-white/10">
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-xl bg-mindflow-purple/20">
                    <Lightbulb className="w-5 h-5 text-mindflow-purple" />
                  </div>
                  <h3 className="font-display font-semibold text-lg">
                    {mode === 'create' ? 'Nova Ideia' : 'Editar Ideia'}
                  </h3>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={onClose}
                  className="hover:bg-white/10"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>

              {/* Content */}
              <div className="p-4 space-y-4">
                <div>
                  <label className="text-sm text-muted-foreground mb-2 block">
                    Descreva sua ideia
                  </label>
                  <Textarea
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="O que você está pensando?"
                    className="min-h-[120px] resize-none bg-muted/50 border-white/10 focus:border-mindflow-purple"
                    autoFocus
                  />
                </div>
              </div>

              {/* Footer */}
              <div className="flex items-center justify-end gap-2 p-4 border-t border-white/10 bg-muted/30">
                <Button variant="ghost" onClick={onClose}>
                  Cancelar
                </Button>
                <Button
                  onClick={handleSave}
                  disabled={!content.trim()}
                  className="bg-gradient-to-r from-mindflow-purple to-mindflow-blue hover:opacity-90"
                >
                  <Save className="w-4 h-4 mr-2" />
                  {mode === 'create' ? 'Criar' : 'Salvar'}
                </Button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
