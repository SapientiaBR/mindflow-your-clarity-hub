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
  isDark?: boolean;
}

export default function EventsCalendarCard({ events, isDark = false }: EventsCalendarCardProps) {
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

  // Get upcoming events
  const upcomingEvents = events
    .filter(e => e.due_date && new Date(e.due_date) >= new Date())
    .sort((a, b) => new Date(a.due_date!).getTime() - new Date(b.due_date!).getTime())
    .slice(0, 3);

  // Custom modifier for days with events
  const modifiers = {
    hasEvent: eventDates,
  };

  const modifiersStyles = {
    hasEvent: {
      backgroundColor: isDark ? 'rgba(249, 115, 22, 0.4)' : 'rgba(249, 115, 22, 0.3)',
      borderRadius: '50%',
    },
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.01 }}
      className={`relative p-4 rounded-2xl cursor-pointer overflow-hidden h-full flex flex-col
                 border-2 transition-all duration-300 ${
                   isDark 
                     ? 'bg-gradient-to-br from-orange-900/80 to-amber-900/80 border-orange-700/50 shadow-lg shadow-orange-900/50 hover:shadow-xl hover:shadow-orange-800/50' 
                     : 'bg-gradient-to-br from-orange-100 to-amber-100 border-orange-300 shadow-lg shadow-orange-300/60 hover:shadow-xl hover:shadow-orange-400/60'
                 }`}
      onClick={() => navigate('/events')}
    >
      {/* Header */}
      <div className="relative flex items-center justify-between mb-3 shrink-0">
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded-lg ${isDark ? 'bg-orange-800/50 text-orange-300' : 'bg-orange-200 text-orange-600'}`}>
            <CalendarDays className="w-5 h-5" />
          </div>
          <div>
            <h3 className={`text-base font-semibold ${isDark ? 'text-white' : 'text-gray-800'}`}>📅 Eventos</h3>
            <p className={`text-xs ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>{events.length} eventos</p>
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
          className={`rounded-lg border p-1.5 ${isDark ? 'border-orange-700/50 bg-orange-900/30' : 'border-orange-200 bg-white'}`}
          classNames={{
            months: "flex flex-col sm:flex-row space-y-2 sm:space-x-2 sm:space-y-0",
            month: "space-y-1",
            caption: "flex justify-center pt-0.5 relative items-center text-xs",
            caption_label: `text-xs font-medium ${isDark ? 'text-orange-200' : 'text-gray-700'}`,
            nav: "space-x-1 flex items-center",
            nav_button: `h-5 w-5 bg-transparent p-0 opacity-50 hover:opacity-100 rounded ${isDark ? 'hover:bg-orange-700/50' : 'hover:bg-orange-100'}`,
            nav_button_previous: "absolute left-0.5",
            nav_button_next: "absolute right-0.5",
            table: "w-full border-collapse",
            head_row: "flex",
            head_cell: `rounded-md w-7 font-normal text-[0.6rem] ${isDark ? 'text-orange-300' : 'text-gray-500'}`,
            row: "flex w-full mt-0.5",
            cell: "h-7 w-7 text-center text-[0.65rem] p-0 relative",
            day: `h-7 w-7 p-0 font-normal text-[0.65rem] rounded-full transition-colors ${isDark ? 'hover:bg-orange-700/50 text-gray-200' : 'hover:bg-orange-100 text-gray-700'}`,
            day_range_end: "day-range-end",
            day_selected: `${isDark ? 'bg-orange-600 text-white hover:bg-orange-500' : 'bg-orange-500 text-white hover:bg-orange-600'}`,
            day_today: `${isDark ? 'bg-orange-800/50 text-orange-200' : 'bg-orange-100 text-orange-700'}`,
            day_outside: `opacity-50 ${isDark ? 'text-gray-500' : 'text-gray-300'}`,
            day_disabled: `opacity-50 ${isDark ? 'text-gray-500' : 'text-gray-300'}`,
            day_hidden: "invisible",
          }}
        />
      </div>

      {/* Events for selected date */}
      {selectedDateEvents.length > 0 && (
        <div className={`relative mb-2 p-2 rounded-lg shrink-0 ${isDark ? 'bg-orange-800/40 border border-orange-700/50' : 'bg-orange-200/50 border border-orange-300'}`}>
          <p className={`text-xs font-medium mb-1 ${isDark ? 'text-orange-200' : 'text-orange-700'}`}>
            {format(selectedDate!, "d 'de' MMMM", { locale: ptBR })}
          </p>
          <div className="space-y-1">
            {selectedDateEvents.slice(0, 2).map((event) => (
              <div key={event.id} className={`flex items-center gap-2 text-xs ${isDark ? 'text-gray-200' : 'text-gray-700'}`}>
                <div className="w-1.5 h-1.5 rounded-full bg-orange-500" />
                <span className="truncate">{event.title || event.content}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Upcoming events */}
      <div className="relative flex-1 min-h-0 overflow-hidden">
        <p className={`text-xs font-medium mb-1 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>Próximos Eventos</p>
        <div className="space-y-1.5">
          {upcomingEvents.length === 0 ? (
            <p className={`text-xs ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>Nenhum evento agendado</p>
          ) : (
            upcomingEvents.map((event) => (
              <motion.div
                key={event.id}
                whileHover={{ x: 2 }}
                className={`flex items-center gap-2 p-1.5 rounded-lg ${isDark ? 'bg-orange-800/40 border border-orange-700/50' : 'bg-white border border-orange-200'}`}
              >
                <div className={`flex-shrink-0 w-8 h-8 rounded-lg flex flex-col items-center justify-center ${isDark ? 'bg-orange-800/50' : 'bg-orange-100'}`}>
                  <span className={`text-[8px] font-medium uppercase ${isDark ? 'text-orange-300' : 'text-orange-600'}`}>
                    {format(parseISO(event.due_date!), 'MMM', { locale: ptBR })}
                  </span>
                  <span className={`text-xs font-bold leading-none ${isDark ? 'text-orange-200' : 'text-orange-700'}`}>
                    {format(parseISO(event.due_date!), 'd')}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className={`text-xs font-medium truncate ${isDark ? 'text-gray-100' : 'text-gray-700'}`}>{event.title || event.content}</p>
                  <div className={`flex items-center gap-1 text-[10px] ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
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