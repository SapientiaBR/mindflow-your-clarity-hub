import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useItems } from '@/hooks/useItems';
import { ItemType, ITEM_TYPES, getItemTypeConfig } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Send, Plus, X, CalendarIcon, Clock } from 'lucide-react';
import AppLayout from '@/components/layout/AppLayout';
import { useParentItems, getParentItemsByType, getParentDisplayName } from '@/hooks/useParentItems';
import { SelectGroup, SelectLabel } from '@/components/ui/select';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { cn } from '@/lib/utils';

export default function Chat() {
  const [message, setMessage] = useState('');
  const [selectedType, setSelectedType] = useState<ItemType>('note');
  const [showTypeMenu, setShowTypeMenu] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [selectedHour, setSelectedHour] = useState('09');
  const [selectedMinute, setSelectedMinute] = useState('00');
  const [selectedParentId, setSelectedParentId] = useState<string | null>(null);
  const { items, createItem } = useItems();
  const { data: parentItems = [] } = useParentItems();
  const groupedParents = getParentItemsByType(parentItems);
  const { toast } = useToast();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [items]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;

    try {
      let eventDateTime: string | undefined;
      if (selectedType === 'event' && selectedDate) {
        const combined = new Date(selectedDate);
        combined.setHours(parseInt(selectedHour), parseInt(selectedMinute), 0, 0);
        eventDateTime = combined.toISOString();
      }

      await createItem.mutateAsync({
        type: selectedType,
        content: message.trim(),
        ...(eventDateTime && { due_date: eventDateTime }),
        ...(selectedType === 'task' && selectedParentId && { parent_id: selectedParentId }),
      });
      
      const typeConfig = getItemTypeConfig(selectedType);
      toast({
        title: `${typeConfig.icon} Salvo como ${typeConfig.label}`,
        duration: 2000,
      });
      setMessage('');
      setSelectedDate(undefined);
      setSelectedHour('09');
      setSelectedMinute('00');
      setSelectedParentId(null);
    } catch (error) {
      toast({
        title: 'Erro ao salvar',
        description: 'Tente novamente.',
        variant: 'destructive',
      });
    }
  };

  const currentTypeConfig = getItemTypeConfig(selectedType);

  return (
    <AppLayout>
      <div className="flex flex-col h-full overflow-hidden">
        {/* Header */}
        <header className="shrink-0 p-4 border-b border-border">
          <h1 className="text-2xl font-display font-bold gradient-text">Chat</h1>
          <p className="text-sm text-muted-foreground">Registre seus pensamentos rapidamente</p>
        </header>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          <AnimatePresence>
            {[...items].reverse().map((item) => {
              const config = getItemTypeConfig(item.type);
              return (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="flex justify-end"
                >
                  <div className="max-w-[80%] md:max-w-[60%]">
                    <div className="glass-card rounded-2xl rounded-br-md p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <span className={`text-sm px-2 py-0.5 rounded-full border ${config.bgClass}`}>
                          {config.icon} {config.label}
                        </span>
                      </div>
                      <p className="text-foreground">{item.content}</p>
                      {item.due_date && item.type === 'event' && (
                        <div className="flex items-center gap-2 text-xs text-orange-400 mt-2">
                          <div className="flex items-center gap-1">
                            <CalendarIcon className="w-3 h-3" />
                            {format(new Date(item.due_date), "dd/MM/yyyy", { locale: ptBR })}
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {format(new Date(item.due_date), "HH:mm", { locale: ptBR })}
                          </div>
                        </div>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground mt-1 text-right">
                      {format(new Date(item.created_at), "HH:mm", { locale: ptBR })}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
          <div ref={messagesEndRef} />
        </div>

        {/* Input area with relative container for popup */}
        <div className="relative shrink-0">
          {/* Type selector popup */}
          <AnimatePresence>
            {showTypeMenu && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className="absolute bottom-full left-4 right-4 md:left-4 md:right-auto md:w-80 mb-2 glass-card rounded-2xl p-4 z-50"
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="font-medium">Selecione o tipo</span>
                  <Button variant="ghost" size="icon" onClick={() => setShowTypeMenu(false)}>
                    <X className="w-4 h-4" />
                  </Button>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  {ITEM_TYPES.map((type) => (
                    <button
                      key={type.type}
                      onClick={() => {
                        setSelectedType(type.type);
                        setShowTypeMenu(false);
                        if (type.type !== 'event') {
                          setSelectedDate(undefined);
                        }
                      }}
                      className={`flex items-center gap-2 p-3 rounded-xl border transition-all ${
                        selectedType === type.type
                          ? `${type.bgClass} border-current`
                          : 'border-border hover:bg-muted'
                      }`}
                    >
                      <span className="text-xl">{type.icon}</span>
                      <span className="text-sm font-medium">{type.label}</span>
                    </button>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Input form */}
          <form onSubmit={handleSubmit} className="p-4 border-t border-border bg-background/80 backdrop-blur-xl">
            <div className="flex items-center gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowTypeMenu(!showTypeMenu)}
                className={`shrink-0 ${currentTypeConfig.bgClass} border-current`}
              >
                <span className="text-lg mr-1">{currentTypeConfig.icon}</span>
                <span className="hidden sm:inline">{currentTypeConfig.label}</span>
                <Plus className="w-4 h-4 ml-1 sm:hidden" />
              </Button>
              
              {/* Date picker - aparece apenas para eventos */}
              {selectedType === 'event' && (
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      type="button"
                      variant="outline"
                      className={cn(
                        "shrink-0 justify-start text-left",
                        !selectedDate && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4 text-orange-400" />
                      <span className="hidden sm:inline">
                        {selectedDate 
                          ? format(selectedDate, "dd/MM/yyyy", { locale: ptBR })
                          : "Data"
                        }
                      </span>
                      <span className="sm:hidden">
                        {selectedDate 
                          ? format(selectedDate, "dd/MM", { locale: ptBR })
                          : "📅"
                        }
                      </span>
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0 bg-popover" align="start">
                    <Calendar
                      mode="single"
                      selected={selectedDate}
                      onSelect={setSelectedDate}
                      locale={ptBR}
                      className="pointer-events-auto"
                    />
                    <div className="border-t border-border p-3">
                      <Label className="text-xs text-muted-foreground mb-2 block">Horário</Label>
                      <div className="flex items-center gap-2">
                        <Select value={selectedHour} onValueChange={setSelectedHour}>
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
                        <Select value={selectedMinute} onValueChange={setSelectedMinute}>
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
              )}

              {/* Parent link selector for tasks */}
              {selectedType === 'task' && (
                <Select value={selectedParentId || 'none'} onValueChange={(v) => setSelectedParentId(v === 'none' ? null : v)}>
                  <SelectTrigger className="shrink-0 w-auto max-w-[140px]">
                    <SelectValue placeholder="🔗 Vincular" />
                  </SelectTrigger>
                  <SelectContent className="bg-popover">
                    <SelectItem value="none">Nenhum</SelectItem>
                    {groupedParents.projects.length > 0 && (
                      <SelectGroup>
                        <SelectLabel>📁 Projetos</SelectLabel>
                        {groupedParents.projects.map(p => (
                          <SelectItem key={p.id} value={p.id}>
                            {getParentDisplayName(p)}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    )}
                    {groupedParents.ideas.length > 0 && (
                      <SelectGroup>
                        <SelectLabel>💡 Ideias</SelectLabel>
                        {groupedParents.ideas.map(p => (
                          <SelectItem key={p.id} value={p.id}>
                            {getParentDisplayName(p)}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    )}
                    {groupedParents.events.length > 0 && (
                      <SelectGroup>
                        <SelectLabel>📅 Eventos</SelectLabel>
                        {groupedParents.events.map(p => (
                          <SelectItem key={p.id} value={p.id}>
                            {getParentDisplayName(p)}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    )}
                  </SelectContent>
                </Select>
              )}

              <Input
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Digite seu pensamento..."
                className="flex-1 bg-muted/50"
              />
              <Button type="submit" disabled={!message.trim() || createItem.isPending} className="bg-gradient-primary">
                <Send className="w-4 h-4" />
              </Button>
            </div>
          </form>
        </div>
      </div>
    </AppLayout>
  );
}
