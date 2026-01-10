import AppLayout from '@/components/layout/AppLayout';
import { useItems, useUpcomingTasks, useImportantItems } from '@/hooks/useItems';
import { getItemTypeConfig } from '@/types';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Flame, Lightbulb, FolderKanban, Activity } from 'lucide-react';

export default function Dashboard() {
  const { items: allItems } = useItems();
  const { data: upcomingTasks } = useUpcomingTasks();
  const { data: importantItems } = useImportantItems();
  
  const ideas = allItems.filter(i => i.type === 'idea').slice(0, 4);
  const projects = allItems.filter(i => i.type === 'project').slice(0, 3);
  const recentNotes = allItems.filter(i => i.type === 'note').slice(0, 5);

  return (
    <AppLayout>
      <div className="flex-1 p-4 md:p-6 overflow-y-auto">
        <header className="mb-6">
          <h1 className="text-2xl md:text-3xl font-display font-bold gradient-text">Dashboard</h1>
          <p className="text-muted-foreground">Sua visão geral</p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
          {/* Bloco Agora */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-card rounded-2xl p-5">
            <div className="flex items-center gap-2 mb-4">
              <Flame className="w-5 h-5 text-destructive" />
              <h2 className="font-display font-semibold text-lg">Agora</h2>
            </div>
            <div className="space-y-3">
              {upcomingTasks?.length ? upcomingTasks.map(task => (
                <div key={task.id} className="p-3 rounded-xl bg-muted/50 border border-border">
                  <p className="text-sm">{task.content}</p>
                  {task.due_date && <p className="text-xs text-muted-foreground mt-1">{format(new Date(task.due_date), "dd MMM", { locale: ptBR })}</p>}
                </div>
              )) : <p className="text-sm text-muted-foreground">Nenhuma tarefa pendente</p>}
            </div>
          </motion.div>

          {/* Bloco Ideias */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="glass-card rounded-2xl p-5">
            <div className="flex items-center gap-2 mb-4">
              <Lightbulb className="w-5 h-5 text-mindflow-purple" />
              <h2 className="font-display font-semibold text-lg">Ideias Ativas</h2>
            </div>
            <div className="space-y-3">
              {ideas.length ? ideas.map(idea => (
                <div key={idea.id} className="p-3 rounded-xl bg-muted/50 border border-border">
                  <p className="text-sm">{idea.content}</p>
                </div>
              )) : <p className="text-sm text-muted-foreground">Nenhuma ideia ainda</p>}
            </div>
          </motion.div>

          {/* Bloco Projetos */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="glass-card rounded-2xl p-5">
            <div className="flex items-center gap-2 mb-4">
              <FolderKanban className="w-5 h-5 text-mindflow-cyan" />
              <h2 className="font-display font-semibold text-lg">Projetos</h2>
            </div>
            <div className="space-y-3">
              {projects.length ? projects.map(project => (
                <div key={project.id} className="p-3 rounded-xl bg-muted/50 border border-border">
                  <p className="font-medium">{project.title || project.content}</p>
                  <div className="mt-2 h-2 bg-muted rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-primary w-1/3 rounded-full" />
                  </div>
                </div>
              )) : <p className="text-sm text-muted-foreground">Nenhum projeto</p>}
            </div>
          </motion.div>

          {/* Bloco Fluxo */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="glass-card rounded-2xl p-5">
            <div className="flex items-center gap-2 mb-4">
              <Activity className="w-5 h-5 text-mindflow-green" />
              <h2 className="font-display font-semibold text-lg">Fluxo de Pensamentos</h2>
            </div>
            <div className="space-y-2">
              {recentNotes.length ? recentNotes.map(note => (
                <div key={note.id} className="flex items-start gap-2 p-2">
                  <div className="w-2 h-2 rounded-full bg-mindflow-blue mt-2 shrink-0" />
                  <div>
                    <p className="text-sm">{note.content}</p>
                    <p className="text-xs text-muted-foreground">{format(new Date(note.created_at), "dd MMM HH:mm", { locale: ptBR })}</p>
                  </div>
                </div>
              )) : <p className="text-sm text-muted-foreground">Nenhuma anotação</p>}
            </div>
          </motion.div>
        </div>
      </div>
    </AppLayout>
  );
}
