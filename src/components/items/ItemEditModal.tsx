import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { TagInput } from '@/components/tags/TagInput';
import { Item, ItemType } from '@/types';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { CalendarIcon, Trash2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface ItemEditModalProps {
  item: Item | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (id: string, updates: Partial<Item>) => void;
  onDelete?: (id: string) => void;
}

export function ItemEditModal({ item, isOpen, onClose, onSave, onDelete }: ItemEditModalProps) {
  const [content, setContent] = useState('');
  const [title, setTitle] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [isImportant, setIsImportant] = useState(false);
  const [priority, setPriority] = useState<string>('medium');
  const [status, setStatus] = useState<string>('active');
  const [dueDate, setDueDate] = useState<Date | undefined>();
  const [progress, setProgress] = useState(0);
  const [showDeleteAlert, setShowDeleteAlert] = useState(false);

  useEffect(() => {
    if (item) {
      setContent(item.content || '');
      setTitle(item.title || '');
      setTags(item.tags || []);
      setIsImportant(item.is_important || false);
      setPriority(item.priority || 'medium');
      setStatus(item.status || 'active');
      setDueDate(item.due_date ? new Date(item.due_date) : undefined);
      setProgress(item.progress || 0);
    }
  }, [item]);

  const handleSave = () => {
    if (!item) return;
    
    const updates: Partial<Item> = {
      content,
      tags,
      is_important: isImportant,
    };

    if (item.type === 'task') {
      updates.priority = priority as any;
      updates.due_date = dueDate?.toISOString();
    }

    if (item.type === 'idea') {
      updates.status = status as any;
    }

    if (item.type === 'project') {
      updates.title = title;
      updates.progress = progress;
    }

    onSave(item.id, updates);
    onClose();
  };

  const handleDelete = () => {
    if (item && onDelete) {
      onDelete(item.id);
      setShowDeleteAlert(false);
      onClose();
    }
  };

  if (!item) return null;

  return (
    <>
      <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
        <DialogContent className="max-w-lg bg-card/95 backdrop-blur-xl border-white/10">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              {item.type === 'task' && '✅ Editar Tarefa'}
              {item.type === 'idea' && '💡 Editar Ideia'}
              {item.type === 'project' && '📁 Editar Projeto'}
              {!['task', 'idea', 'project'].includes(item.type) && '📝 Editar Item'}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4 py-4">
            {/* Title for projects */}
            {item.type === 'project' && (
              <div className="space-y-2">
                <Label>Título</Label>
                <Input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Nome do projeto"
                />
              </div>
            )}

            {/* Content */}
            <div className="space-y-2">
              <Label>Conteúdo</Label>
              <Textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Descreva..."
                rows={3}
              />
            </div>

            {/* Tags */}
            <div className="space-y-2">
              <Label>Tags</Label>
              <TagInput tags={tags} onChange={setTags} />
            </div>

            {/* Important switch */}
            <div className="flex items-center justify-between">
              <Label>Marcar como importante</Label>
              <Switch checked={isImportant} onCheckedChange={setIsImportant} />
            </div>

            {/* Task-specific fields */}
            {item.type === 'task' && (
              <>
                <div className="space-y-2">
                  <Label>Prioridade</Label>
                  <Select value={priority} onValueChange={setPriority}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">🟢 Baixa</SelectItem>
                      <SelectItem value="medium">🟡 Média</SelectItem>
                      <SelectItem value="high">🟠 Alta</SelectItem>
                      <SelectItem value="urgent">🔴 Urgente</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Data de Vencimento</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !dueDate && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {dueDate ? format(dueDate, "PPP", { locale: ptBR }) : "Selecionar data"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={dueDate}
                        onSelect={setDueDate}
                        locale={ptBR}
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </>
            )}

            {/* Idea-specific fields */}
            {item.type === 'idea' && (
              <div className="space-y-2">
                <Label>Status</Label>
                <Select value={status} onValueChange={setStatus}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="raw">💭 Crua</SelectItem>
                    <SelectItem value="evolving">🌱 Evoluindo</SelectItem>
                    <SelectItem value="in_progress">🚀 Em progresso</SelectItem>
                    <SelectItem value="completed">✅ Completada</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}

            {/* Project-specific fields */}
            {item.type === 'project' && (
              <div className="space-y-2">
                <Label>Progresso: {progress}%</Label>
                <Slider
                  value={[progress]}
                  onValueChange={([value]) => setProgress(value)}
                  max={100}
                  step={5}
                  className="py-2"
                />
              </div>
            )}
          </div>

          <DialogFooter className="flex gap-2">
            {onDelete && (
              <Button 
                variant="destructive" 
                size="sm"
                onClick={() => setShowDeleteAlert(true)}
                className="mr-auto"
              >
                <Trash2 className="w-4 h-4 mr-1" />
                Excluir
              </Button>
            )}
            <Button variant="outline" onClick={onClose}>Cancelar</Button>
            <Button onClick={handleSave}>Salvar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={showDeleteAlert} onOpenChange={setShowDeleteAlert}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Tem certeza?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta ação não pode ser desfeita. O item será permanentemente excluído.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
