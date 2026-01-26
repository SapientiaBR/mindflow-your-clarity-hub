import { motion } from 'framer-motion';
import { Clock, Target } from 'lucide-react';
import DashboardCard from './DashboardCard';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Item } from '@/types';

interface TasksCardProps {
  tasks: Item[] | undefined;
  taskCount: number;
  isDark?: boolean;
}

export default function TasksCard({ tasks, taskCount, isDark = false }: TasksCardProps) {
  // Show more tasks to fill the card - up to 8
  const displayTasks = tasks?.slice(0, 8) || [];
  
  return (
    <DashboardCard 
      title="✅ Tarefas" 
      icon={Clock} 
      count={taskCount}
      gradient="green"
      navigateTo="/tasks"
      isDark={isDark}
    >
      <div className="space-y-2">
        {displayTasks.length > 0 ? (
          displayTasks.map((task, index) => (
            <motion.div 
              key={task.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.05 * index }}
              className={`p-2 rounded-lg transition-colors ${
                isDark 
                  ? 'bg-green-800/40 hover:bg-green-800/60 border border-green-700/50' 
                  : 'bg-white hover:bg-green-50 border border-green-200'
              }`}
            >
              <div className="flex items-start gap-2">
                <div className={`w-2 h-2 rounded-full shrink-0 mt-1.5 ${isDark ? 'bg-green-400' : 'bg-green-500'}`} />
                <div className="flex-1 min-w-0">
                  <p className={`text-xs whitespace-normal break-words leading-snug line-clamp-2 ${isDark ? 'text-gray-100' : 'text-gray-700'}`}>
                    {task.content}
                  </p>
                  {task.due_date && (
                    <span className={`text-xs mt-1 inline-block ${isDark ? 'text-green-300' : 'text-gray-500'}`}>
                      {format(new Date(task.due_date), 'dd MMM', { locale: ptBR })}
                    </span>
                  )}
                </div>
              </div>
            </motion.div>
          ))
        ) : (
          <div className={`text-center py-4 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
            <Target className="w-6 h-6 mx-auto mb-2 opacity-50" />
            <p className="text-xs">Nenhuma tarefa pendente</p>
          </div>
        )}
      </div>
    </DashboardCard>
  );
}