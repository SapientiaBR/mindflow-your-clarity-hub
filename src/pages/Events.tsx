import { useState } from 'react';
import AppLayout from '@/components/layout/AppLayout';
import { useItems } from '@/hooks/useItems';
import { motion } from 'framer-motion';
import { ItemActions } from '@/components/items/ItemActions';
import { ItemEditModal } from '@/components/items/ItemEditModal';
import { TagBadge } from '@/components/tags/TagBadge';
import { Item } from '@/types';
import { Star, CalendarDays, Clock, MapPin } from 'lucide-react';
import { Calendar } from '@/components/ui/calendar';
import { format, isSameDay, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export default function Events() {
  const { items, updateItem, deleteItem } = useItems('event');
  const [editingItem, setEditingItem] = useState<Item | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());

  const handleSave = (id: string, updates: Partial<Item>) => {
    updateItem.mutate({ id, ...updates });
  };

  const handleDelete = (id: string) => {
    deleteItem.mutate(id);
  };

  const handleToggleImportant = (id: string, isImportant: boolean) => {
    updateItem.mutate({ id, is_important: isImportant });
  };

  // Get dates that have events
  const eventDates = items
    .filter(e => e.due_date)
    .map(e => parseISO(e.due_date!));

  // Get events for selected date
  const selectedDateEvents = selectedDate
    ? items.filter(e => e.due_date && isSameDay(parseISO(e.due_date), selectedDate))
    : [];

  // Upcoming events
  const upcomingEvents = items
    .filter(e => e.due_date && new Date(e.due_date) >= new Date())
    .sort((a, b) => new Date(a.due_date!).getTime() - new Date(b.due_date!).getTime());

  // Past events
  const pastEvents = items
    .filter(e => e.due_date && new Date(e.due_date) < new Date())
    .sort((a, b) => new Date(b.due_date!).getTime() - new Date(a.due_date!).getTime());

  const modifiers = {
    hasEvent: eventDates,
  };

  const modifiersStyles = {
    hasEvent: {
      backgroundColor: 'rgba(249, 115, 22, 0.3)',
      borderRadius: '50%',
    },
  };

  return (
    <AppLayout>
      <div className="flex-1 p-4 md:p-6 overflow-y-auto">
        <header className="mb-6">
          <h1 className="text-2xl md:text-3xl font-display font-bold gradient-text">📅 Eventos</h1>
          <p className="text-muted-foreground">Gerencie seus compromissos e reuniões</p>
        </header>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Calendar Section */}
          <div className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass-card rounded-2xl p-4"
              style={{
                boxShadow: '0 0 30px rgba(249, 115, 22, 0.15)',
                border: '1px solid rgba(249, 115, 22, 0.3)',
              }}
            >
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={setSelectedDate}
                locale={ptBR}
                modifiers={modifiers}
                modifiersStyles={modifiersStyles}
                className="rounded-lg border border-orange-500/20 bg-background/50 p-2"
                classNames={{
                  months: "flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0",
                  month: "space-y-4",
                  caption: "flex justify-center pt-1 relative items-center",
                  caption_label: "text-sm font-medium text-orange-300",
                  nav: "space-x-1 flex items-center",
                  nav_button: "h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100 hover:bg-orange-500/20 rounded",
                  nav_button_previous: "absolute left-1",
                  nav_button_next: "absolute right-1",
                  table: "w-full border-collapse space-y-1",
                  head_row: "flex",
                  head_cell: "text-muted-foreground rounded-md w-9 font-normal text-[0.8rem]",
                  row: "flex w-full mt-2",
                  cell: "h-9 w-9 text-center text-sm p-0 relative",
                  day: "h-9 w-9 p-0 font-normal hover:bg-orange-500/20 rounded-full transition-colors",
                  day_range_end: "day-range-end",
                  day_selected: "bg-orange-500 text-white hover:bg-orange-600",
                  day_today: "bg-accent text-accent-foreground",
                  day_outside: "text-muted-foreground opacity-50",
                  day_disabled: "text-muted-foreground opacity-50",
                  day_hidden: "invisible",
                }}
              />

              {/* Selected date events */}
              {selectedDateEvents.length > 0 && (
                <div className="mt-4 p-3 rounded-lg bg-orange-500/10 border border-orange-500/20">
                  <p className="text-sm text-orange-300 font-medium mb-2">
                    {format(selectedDate!, "d 'de' MMMM", { locale: ptBR })}
                  </p>
                  <div className="space-y-2">
                    {selectedDateEvents.map((event) => (
                      <div 
                        key={event.id} 
                        className="flex items-center gap-2 text-sm text-foreground cursor-pointer hover:text-orange-300 transition-colors"
                        onClick={() => setEditingItem(event)}
                      >
                        <div className="w-2 h-2 rounded-full bg-orange-400" />
                        <span className="truncate">{event.title || event.content}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
          </div>

          {/* Events List Section */}
          <div className="lg:col-span-2 space-y-6">
            {/* Upcoming Events */}
            <div>
              <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                <CalendarDays className="w-5 h-5 text-orange-400" />
                Próximos Eventos ({upcomingEvents.length})
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {upcomingEvents.map((event, i) => (
                  <motion.div 
                    key={event.id} 
                    initial={{ opacity: 0, y: 20 }} 
                    animate={{ opacity: 1, y: 0 }} 
                    transition={{ delay: i * 0.05 }} 
                    className="glass-card rounded-2xl p-4 hover-scale group cursor-pointer transition-all hover:border-orange-500/30 relative"
                    style={{
                      boxShadow: '0 0 20px rgba(249, 115, 22, 0.1)',
                      border: '1px solid rgba(249, 115, 22, 0.2)',
                    }}
                    onClick={() => setEditingItem(event)}
                  >
                    {/* Important indicator */}
                    {event.is_important && (
                      <Star className="absolute top-3 right-3 w-4 h-4 text-yellow-400 fill-yellow-400" />
                    )}
                    
                    <div className="flex gap-3">
                      {/* Date box */}
                      {event.due_date && (
                        <div className="flex-shrink-0 w-14 h-14 rounded-lg bg-orange-500/20 flex flex-col items-center justify-center">
                          <span className="text-xs text-orange-400 font-medium uppercase">
                            {format(parseISO(event.due_date), 'MMM', { locale: ptBR })}
                          </span>
                          <span className="text-xl text-orange-300 font-bold leading-none">
                            {format(parseISO(event.due_date), 'd')}
                          </span>
                        </div>
                      )}
                      
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-foreground truncate">
                          {event.title || event.content}
                        </h3>
                        {event.content && event.title && (
                          <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
                            {event.content}
                          </p>
                        )}
                        {event.due_date && (
                          <div className="flex items-center gap-2 mt-2 text-xs text-muted-foreground">
                            <Clock className="w-3 h-3" />
                            <span>{format(parseISO(event.due_date), 'HH:mm')}</span>
                          </div>
                        )}
                      </div>
                    </div>
                    
                    {/* Tags */}
                    {event.tags && event.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-3">
                        {event.tags.map((tag, idx) => (
                          <TagBadge key={idx} tag={tag} size="sm" />
                        ))}
                      </div>
                    )}
                    
                    <div className="flex items-center justify-end mt-3">
                      <ItemActions
                        item={event}
                        onEdit={setEditingItem}
                        onDelete={handleDelete}
                        onToggleImportant={handleToggleImportant}
                      />
                    </div>
                  </motion.div>
                ))}
                
                {upcomingEvents.length === 0 && (
                  <div className="col-span-full text-center py-8 text-muted-foreground">
                    <CalendarDays className="w-12 h-12 mx-auto mb-3 opacity-30" />
                    <p>Nenhum evento futuro agendado</p>
                  </div>
                )}
              </div>
            </div>

            {/* Past Events */}
            {pastEvents.length > 0 && (
              <div>
                <h2 className="text-lg font-semibold text-foreground/60 mb-4">
                  Eventos Passados ({pastEvents.length})
                </h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {pastEvents.slice(0, 4).map((event, i) => (
                    <motion.div 
                      key={event.id} 
                      initial={{ opacity: 0 }} 
                      animate={{ opacity: 0.7 }} 
                      className="glass-card rounded-xl p-3 cursor-pointer transition-all hover:opacity-100"
                      onClick={() => setEditingItem(event)}
                    >
                      <div className="flex items-center gap-3">
                        {event.due_date && (
                          <div className="text-xs text-muted-foreground">
                            {format(parseISO(event.due_date), "dd MMM", { locale: ptBR })}
                          </div>
                        )}
                        <span className="text-sm text-foreground/70 truncate">
                          {event.title || event.content}
                        </span>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <ItemEditModal
        item={editingItem}
        isOpen={!!editingItem}
        onClose={() => setEditingItem(null)}
        onSave={handleSave}
        onDelete={handleDelete}
      />
    </AppLayout>
  );
}
