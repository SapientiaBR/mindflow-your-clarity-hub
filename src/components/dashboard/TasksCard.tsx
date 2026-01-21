import { motion } from 'framer-motion';
import { Clock, Target } from 'lucide-react';
import DashboardCard from './DashboardCard';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Item } from '@/types';

interface TasksCardProps {
  tasks: Item[] | undefined;
  taskCount: number;
}

export default function TasksCard({ tasks, taskCount }: TasksCardProps) {
  return (
    <DashboardCard 
      title="✅ Tarefas" 
      icon={Clock} 
      count={taskCount}
      gradient="green"
      navigateTo="/tasks"
    >
      <div className="space-y-2">
        {tasks && tasks.length > 0 ? (
          tasks.slice(0, 4).map((task, index) => (
            <motion.div 
              key={task.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 * index }}
              className="p-2 md:p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors border border-border/30"
            >
              <div className="flex items-start gap-2 md:gap-3">
                <div className="w-2 h-2 rounded-full bg-primary shadow-lg shrink-0 mt-1.5" />
                <div className="flex-1 min-w-0">
                  <p className="text-xs md:text-sm text-foreground/90 whitespace-normal break-words leading-snug">
                    {task.content}
                  </p>
                  {task.due_date && (
                    <span className="text-xs text-muted-foreground mt-1 inline-block">
                      {format(new Date(task.due_date), 'dd MMM', { locale: ptBR })}
                    </span>
                  )}
                </div>
              </div>
            </motion.div>
          ))
        ) : (
          <div className="text-center py-4 text-muted-foreground">
            <Target className="w-6 h-6 mx-auto mb-2 opacity-50" />
            <p className="text-xs md:text-sm">Nenhuma tarefa pendente</p>
          </div>
        )}
      </div>
    </DashboardCard>
  );
}
