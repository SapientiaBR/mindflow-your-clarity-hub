import { useState } from 'react';
import { CalendarDays, Clock, MapPin } from 'lucide-react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Calendar } from '@/components/ui/calendar';
import { Item } from '@/types';
import { format, isSameDay, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface EventsCalendarCardProps {
  events: Item[];
}

export default function EventsCalendarCard({ events }: EventsCalendarCardProps) {
  const navigate = useNavigate();
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());

  // Get dates that have events
  const eventDates = events
    .filter(e => e.due_date)
    .map(e => parseISO(e.due_date!));

  // Get events for selected date
  const selectedDateEvents = selectedDate
    ? events.filter(e => e.due_date && isSameDay(parseISO(e.due_date), selectedDate))
    : [];

  // Get upcoming events (next 5)
  const upcomingEvents = events
    .filter(e => e.due_date && new Date(e.due_date) >= new Date())
    .sort((a, b) => new Date(a.due_date!).getTime() - new Date(b.due_date!).getTime())
    .slice(0, 5);

  // Custom modifier for days with events
  const modifiers = {
    hasEvent: eventDates,
  };

  const modifiersStyles = {
    hasEvent: {
      backgroundColor: 'rgba(249, 115, 22, 0.2)',
      borderRadius: '50%',
    },
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.01 }}
      className="relative p-5 rounded-2xl cursor-pointer overflow-hidden h-full"
      style={{
        background: 'linear-gradient(145deg, rgba(249, 115, 22, 0.1) 0%, rgba(20, 20, 35, 0.95) 100%)',
        boxShadow: '0 0 30px rgba(249, 115, 22, 0.15), inset 0 1px 0 rgba(255,255,255,0.05)',
        border: '1px solid rgba(249, 115, 22, 0.3)',
      }}
      onClick={() => navigate('/events')}
    >
      {/* Glow effect */}
      <div 
        className="absolute inset-0 opacity-20 pointer-events-none"
        style={{
          background: 'radial-gradient(circle at 30% 20%, rgba(249, 115, 22, 0.3) 0%, transparent 50%)',
        }}
      />

      {/* Header */}
      <div className="relative flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-orange-500/20">
            <CalendarDays className="w-5 h-5 text-orange-400" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-foreground">📅 Eventos</h3>
            <p className="text-xs text-muted-foreground">{events.length} eventos</p>
          </div>
        </div>
      </div>

      {/* Calendar */}
      <div className="relative mb-4" onClick={(e) => e.stopPropagation()}>
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
            month: "space-y-2",
            caption: "flex justify-center pt-1 relative items-center text-sm",
            caption_label: "text-sm font-medium text-orange-300",
            nav: "space-x-1 flex items-center",
            nav_button: "h-6 w-6 bg-transparent p-0 opacity-50 hover:opacity-100 hover:bg-orange-500/20 rounded",
            nav_button_previous: "absolute left-1",
            nav_button_next: "absolute right-1",
            table: "w-full border-collapse",
            head_row: "flex",
            head_cell: "text-muted-foreground rounded-md w-8 font-normal text-[0.7rem]",
            row: "flex w-full mt-1",
            cell: "h-8 w-8 text-center text-xs p-0 relative",
            day: "h-8 w-8 p-0 font-normal text-xs hover:bg-orange-500/20 rounded-full transition-colors",
            day_range_end: "day-range-end",
            day_selected: "bg-orange-500 text-white hover:bg-orange-600",
            day_today: "bg-accent text-accent-foreground",
            day_outside: "text-muted-foreground opacity-50",
            day_disabled: "text-muted-foreground opacity-50",
            day_hidden: "invisible",
          }}
        />
      </div>

      {/* Events for selected date */}
      {selectedDateEvents.length > 0 && (
        <div className="relative mb-4 p-3 rounded-lg bg-orange-500/10 border border-orange-500/20">
          <p className="text-xs text-orange-300 font-medium mb-2">
            {format(selectedDate!, "d 'de' MMMM", { locale: ptBR })}
          </p>
          <div className="space-y-2">
            {selectedDateEvents.map((event) => (
              <div key={event.id} className="flex items-center gap-2 text-xs text-foreground">
                <div className="w-1.5 h-1.5 rounded-full bg-orange-400" />
                <span className="truncate">{event.title || event.content}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Upcoming events */}
      <div className="relative space-y-2">
        <p className="text-xs text-muted-foreground font-medium">Próximos Eventos</p>
        <div className="max-h-[150px] overflow-y-auto space-y-2">
          {upcomingEvents.length === 0 ? (
            <p className="text-xs text-muted-foreground/50">Nenhum evento agendado</p>
          ) : (
            <>
              {upcomingEvents.slice(0, 3).map((event) => (
                <motion.div
                  key={event.id}
                  whileHover={{ x: 4 }}
                  className="flex items-center gap-3 p-2 rounded-lg bg-background/30 border border-orange-500/10"
                >
                  <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-orange-500/20 flex flex-col items-center justify-center">
                    <span className="text-[10px] text-orange-400 font-medium uppercase">
                      {format(parseISO(event.due_date!), 'MMM', { locale: ptBR })}
                    </span>
                    <span className="text-sm text-orange-300 font-bold leading-none">
                      {format(parseISO(event.due_date!), 'd')}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-foreground font-medium truncate">{event.title || event.content}</p>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Clock className="w-3 h-3" />
                      <span>{format(parseISO(event.due_date!), 'HH:mm')}</span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </>
          )}
        </div>
      </div>
    </motion.div>
  );
}
