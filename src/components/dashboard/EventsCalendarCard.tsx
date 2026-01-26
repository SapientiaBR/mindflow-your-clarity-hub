import { useState } from 'react';
import { CalendarDays, Clock } from 'lucide-react';
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

  // Get upcoming events (next 2 for compact view)
  const upcomingEvents = events
    .filter(e => e.due_date && new Date(e.due_date) >= new Date())
    .sort((a, b) => new Date(a.due_date!).getTime() - new Date(b.due_date!).getTime())
    .slice(0, 2);

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
      className="relative p-4 rounded-2xl cursor-pointer overflow-hidden h-full flex flex-col
                 bg-gradient-to-br from-orange-50 to-amber-50 hover:from-orange-100 hover:to-amber-100
                 border border-orange-200 shadow-lg shadow-orange-200/50 hover:shadow-xl hover:shadow-orange-300/50
                 transition-all duration-300"
      onClick={() => navigate('/events')}
    >
      {/* Header */}
      <div className="relative flex items-center justify-between mb-3 shrink-0">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-orange-100">
            <CalendarDays className="w-5 h-5 text-orange-600" />
          </div>
          <div>
            <h3 className="text-base font-semibold text-gray-800">📅 Eventos</h3>
            <p className="text-xs text-gray-500">{events.length} eventos</p>
          </div>
        </div>
      </div>

      {/* Calendar - Compact */}
      <div className="relative mb-3 shrink-0" onClick={(e) => e.stopPropagation()}>
        <Calendar
          mode="single"
          selected={selectedDate}
          onSelect={setSelectedDate}
          locale={ptBR}
          modifiers={modifiers}
          modifiersStyles={modifiersStyles}
          className="rounded-lg border border-orange-200 bg-white/70 p-1.5"
          classNames={{
            months: "flex flex-col sm:flex-row space-y-2 sm:space-x-2 sm:space-y-0",
            month: "space-y-1",
            caption: "flex justify-center pt-0.5 relative items-center text-xs",
            caption_label: "text-xs font-medium text-gray-700",
            nav: "space-x-1 flex items-center",
            nav_button: "h-5 w-5 bg-transparent p-0 opacity-50 hover:opacity-100 hover:bg-orange-100 rounded",
            nav_button_previous: "absolute left-0.5",
            nav_button_next: "absolute right-0.5",
            table: "w-full border-collapse",
            head_row: "flex",
            head_cell: "text-gray-500 rounded-md w-7 font-normal text-[0.6rem]",
            row: "flex w-full mt-0.5",
            cell: "h-7 w-7 text-center text-[0.65rem] p-0 relative",
            day: "h-7 w-7 p-0 font-normal text-[0.65rem] hover:bg-orange-100 rounded-full transition-colors",
            day_range_end: "day-range-end",
            day_selected: "bg-orange-500 text-white hover:bg-orange-600",
            day_today: "bg-orange-100 text-orange-700",
            day_outside: "text-gray-300 opacity-50",
            day_disabled: "text-gray-300 opacity-50",
            day_hidden: "invisible",
          }}
        />
      </div>

      {/* Events for selected date */}
      {selectedDateEvents.length > 0 && (
        <div className="relative mb-2 p-2 rounded-lg bg-orange-100/50 border border-orange-200 shrink-0">
          <p className="text-xs text-orange-700 font-medium mb-1">
            {format(selectedDate!, "d 'de' MMMM", { locale: ptBR })}
          </p>
          <div className="space-y-1">
            {selectedDateEvents.slice(0, 2).map((event) => (
              <div key={event.id} className="flex items-center gap-2 text-xs text-gray-700">
                <div className="w-1.5 h-1.5 rounded-full bg-orange-500" />
                <span className="truncate">{event.title || event.content}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Upcoming events - Compact */}
      <div className="relative flex-1 min-h-0 overflow-hidden">
        <p className="text-xs text-gray-500 font-medium mb-1">Próximos Eventos</p>
        <div className="space-y-1.5">
          {upcomingEvents.length === 0 ? (
            <p className="text-xs text-gray-400">Nenhum evento agendado</p>
          ) : (
            upcomingEvents.map((event) => (
              <motion.div
                key={event.id}
                whileHover={{ x: 2 }}
                className="flex items-center gap-2 p-1.5 rounded-lg bg-white/60 border border-orange-100"
              >
                <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-orange-100 flex flex-col items-center justify-center">
                  <span className="text-[8px] text-orange-600 font-medium uppercase">
                    {format(parseISO(event.due_date!), 'MMM', { locale: ptBR })}
                  </span>
                  <span className="text-xs text-orange-700 font-bold leading-none">
                    {format(parseISO(event.due_date!), 'd')}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-gray-700 font-medium truncate">{event.title || event.content}</p>
                  <div className="flex items-center gap-1 text-[10px] text-gray-500">
                    <Clock className="w-2.5 h-2.5" />
                    <span>{format(parseISO(event.due_date!), 'HH:mm')}</span>
                  </div>
                </div>
              </motion.div>
            ))
          )}
        </div>
      </div>
    </motion.div>
  );
}