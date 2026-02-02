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
import { CalendarIcon, Trash2, Clock, Bell, X, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from '@/hooks/use-toast';
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
  onSave: (id: string, updates: Partial<Item>) => Promise<void> | void;
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
  const [hour, setHour] = useState('09');
  const [minute, setMinute] = useState('00');
  const [reminderDate, setReminderDate] = useState<Date | undefined>();
  const [reminderHour, setReminderHour] = useState('09');
  const [reminderMinute, setReminderMinute] = useState('00');
  const [progress, setProgress] = useState(0);
  const [showDeleteAlert, setShowDeleteAlert] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (item) {
      setContent(item.content || '');
      setTitle(item.title || '');
      setTags(item.tags || []);
      setIsImportant(item.is_important || false);
      setPriority(item.priority || 'medium');
      setStatus(item.status || 'active');
      if (item.due_date) {
        const date = new Date(item.due_date);
        setDueDate(date);
        setHour(date.getHours().toString().padStart(2, '0'));
        setMinute(date.getMinutes().toString().padStart(2, '0'));
      } else {
        setDueDate(undefined);
        setHour('09');
        setMinute('00');
      }
      if (item.reminder_at) {
        const date = new Date(item.reminder_at);
        setReminderDate(date);
        setReminderHour(date.getHours().toString().padStart(2, '0'));
        setReminderMinute(date.getMinutes().toString().padStart(2, '0'));
      } else {
        setReminderDate(undefined);
        setReminderHour('09');
        setReminderMinute('00');
      }
      setProgress(item.progress || 0);
    }
  }, [item]);

  const handleSave = async () => {
    if (!item || isSaving) return;
    
    setIsSaving(true);
    
    const updates: Partial<Item> = {
      content,
      tags,
      is_important: isImportant,
    };

    if (item.type === 'task' || item.type === 'event') {
      if (dueDate) {
        const combined = new Date(dueDate);
        combined.setHours(parseInt(hour), parseInt(minute), 0, 0);
        updates.due_date = combined.toISOString();
      } else {
        updates.due_date = null;
      }
    }

    // Reminder for tasks and events
    if (item.type === 'task' || item.type === 'event') {
      if (reminderDate) {
        const combined = new Date(reminderDate);
        combined.setHours(parseInt(reminderHour), parseInt(reminderMinute), 0, 0);
        updates.reminder_at = combined.toISOString();
      } else {
        updates.reminder_at = null;
      }
    }

    if (item.type === 'task') {
      updates.priority = priority as any;
    }

    if (item.type === 'idea') {
      updates.status = status as any;
    }

    if (item.type === 'project' || item.type === 'event') {
      updates.title = title;
    }

    if (item.type === 'project') {
      updates.progress = progress;
    }

    try {
      await onSave(item.id, updates);
      toast({
        title: "Salvo com sucesso!",
        description: "As alterações foram aplicadas.",
      });
      onClose();
    } catch (error) {
      console.error('Erro ao salvar:', error);
      toast({
        title: "Erro ao salvar",
        description: "Não foi possível salvar as alterações. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = () => {
    if (item && onDelete) {
      onDelete(item.id);
      setShowDeleteAlert(false);
      onClose();
    }
  };

  const clearReminder = () => {
    setReminderDate(undefined);
    setReminderHour('09');
    setReminderMinute('00');
  };

  if (!item) return null;

  return (
    <>
      <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
        <DialogContent className="max-w-lg bg-card/95 backdrop-blur-xl border-white/10 max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              {item.type === 'task' && '✅ Editar Tarefa'}
              {item.type === 'event' && '📅 Editar Evento'}
              {item.type === 'idea' && '💡 Editar Ideia'}
              {item.type === 'project' && '📁 Editar Projeto'}
              {!['task', 'idea', 'project', 'event'].includes(item.type) && '📝 Editar Item'}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4 py-4">
            {/* Title for projects and events */}
            {(item.type === 'project' || item.type === 'event') && (
              <div className="space-y-2">
                <Label>Título</Label>
                <Input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder={item.type === 'project' ? "Nome do projeto" : "Nome do evento"}
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

            {/* Task-specific priority field */}
            {item.type === 'task' && (
              <div className="space-y-2">
                <Label>Prioridade</Label>
                <Select value={priority} onValueChange={setPriority}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-popover">
                    <SelectItem value="low">🟢 Baixa</SelectItem>
                    <SelectItem value="medium">🟡 Média</SelectItem>
                    <SelectItem value="high">🟠 Alta</SelectItem>
                    <SelectItem value="urgent">🔴 Urgente</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}

            {/* Date and time fields for tasks and events */}
            {(item.type === 'task' || item.type === 'event') && (
              <div className="space-y-2">
                <Label>{item.type === 'event' ? 'Data e Horário' : 'Prazo (Deadline)'}</Label>
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
                      {dueDate ? (
                        <>
                          {format(dueDate, "PPP", { locale: ptBR })}
                          <Clock className="ml-2 h-4 w-4" />
                          <span className="ml-1">{hour}:{minute}</span>
                        </>
                      ) : (
                        "Selecionar data"
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0 bg-popover" align="start">
                    <Calendar
                      mode="single"
                      selected={dueDate}
                      onSelect={setDueDate}
                      locale={ptBR}
                      className="pointer-events-auto"
                    />
                    <div className="border-t border-border p-3">
                      <Label className="text-xs text-muted-foreground mb-2 block">Horário</Label>
                      <div className="flex items-center gap-2">
                        <Select value={hour} onValueChange={setHour}>
                          <SelectTrigger className="w-20">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent className="bg-popover">
                            {Array.from({ length: 24 }, (_, i) => i.toString().padStart(2, '0')).map(h => (
                              <SelectItem key={h} value={h}>{h}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <span className="text-muted-foreground">:</span>
                        <Select value={minute} onValueChange={setMinute}>
                          <SelectTrigger className="w-20">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent className="bg-popover">
                            {['00', '05', '10', '15', '20', '25', '30', '35', '40', '45', '50', '55'].map(m => (
                              <SelectItem key={m} value={m}>{m}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </PopoverContent>
                </Popover>
              </div>
            )}

            {/* Reminder field for tasks and events */}
            {(item.type === 'task' || item.type === 'event') && (
              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  <Bell className="w-4 h-4 text-orange-400" />
                  Lembrete
                </Label>
                <div className="flex gap-2">
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "flex-1 justify-start text-left font-normal",
                          !reminderDate && "text-muted-foreground"
                        )}
                      >
                        <Bell className="mr-2 h-4 w-4" />
                        {reminderDate ? (
                          <>
                            {format(reminderDate, "dd/MM/yyyy", { locale: ptBR })}
                            <Clock className="ml-2 h-4 w-4" />
                            <span className="ml-1">{reminderHour}:{reminderMinute}</span>
                          </>
                        ) : (
                          "Definir lembrete"
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0 bg-popover" align="start">
                      <Calendar
                        mode="single"
                        selected={reminderDate}
                        onSelect={setReminderDate}
                        locale={ptBR}
                        className="pointer-events-auto"
                      />
                      <div className="border-t border-border p-3">
                        <Label className="text-xs text-muted-foreground mb-2 block">Horário do lembrete</Label>
                        <div className="flex items-center gap-2">
                          <Select value={reminderHour} onValueChange={setReminderHour}>
                            <SelectTrigger className="w-20">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent className="bg-popover">
                              {Array.from({ length: 24 }, (_, i) => i.toString().padStart(2, '0')).map(h => (
                                <SelectItem key={h} value={h}>{h}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <span className="text-muted-foreground">:</span>
                          <Select value={reminderMinute} onValueChange={setReminderMinute}>
                            <SelectTrigger className="w-20">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent className="bg-popover">
                              {['00', '05', '10', '15', '20', '25', '30', '35', '40', '45', '50', '55'].map(m => (
                                <SelectItem key={m} value={m}>{m}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    </PopoverContent>
                  </Popover>
                  {reminderDate && (
                    <Button 
                      variant="ghost" 
                      size="icon"
                      onClick={clearReminder}
                      className="shrink-0"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </div>
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
            <Button variant="outline" onClick={onClose} disabled={isSaving}>Cancelar</Button>
            <Button onClick={handleSave} disabled={isSaving}>
              {isSaving && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              {isSaving ? 'Salvando...' : 'Salvar'}
            </Button>
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
