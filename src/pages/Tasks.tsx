import AppLayout from '@/components/layout/AppLayout';
import { useItems } from '@/hooks/useItems';
import { motion } from 'framer-motion';
import { Checkbox } from '@/components/ui/checkbox';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export default function Tasks() {
  const { items, updateItem } = useItems('task');

  const toggleTask = (id: string, completed: boolean) => {
    updateItem.mutate({ id, status: completed ? 'completed' : 'active' });
  };

  return (
    <AppLayout>
      <div className="flex-1 p-4 md:p-6 overflow-y-auto">
        <header className="mb-6">
          <h1 className="text-2xl md:text-3xl font-display font-bold gradient-text">✅ Tarefas</h1>
          <p className="text-muted-foreground">Suas tarefas organizadas</p>
        </header>
        <div className="space-y-3 max-w-2xl">
          {items.map((task, i) => (
            <motion.div key={task.id} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }} className={`glass-card rounded-xl p-4 flex items-start gap-3 ${task.status === 'completed' ? 'opacity-60' : ''}`}>
              <Checkbox checked={task.status === 'completed'} onCheckedChange={(c) => toggleTask(task.id, !!c)} className="mt-1" />
              <div className="flex-1">
                <p className={`${task.status === 'completed' ? 'line-through text-muted-foreground' : ''}`}>{task.content}</p>
                {task.due_date && <p className="text-xs text-muted-foreground mt-1">{format(new Date(task.due_date), "dd MMM yyyy", { locale: ptBR })}</p>}
              </div>
              <span className={`text-xs px-2 py-1 rounded-full priority-${task.priority || 'medium'} bg-current/20`}>{task.priority || 'medium'}</span>
            </motion.div>
          ))}
          {!items.length && <p className="text-muted-foreground text-center py-12">Nenhuma tarefa. Use o chat para criar!</p>}
        </div>
      </div>
    </AppLayout>
  );
}
