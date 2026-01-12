import AppLayout from '@/components/layout/AppLayout';
import { useItems, useUpcomingTasks, useImportantItems } from '@/hooks/useItems';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Flame, Lightbulb, FolderKanban, Activity, CheckCircle2 } from 'lucide-react';
import ParticleBackground from '@/components/dashboard/ParticleBackground';
import DashboardCard from '@/components/dashboard/DashboardCard';

export default function Dashboard() {
  const { items: allItems } = useItems();
  const { data: upcomingTasks } = useUpcomingTasks();
  const { data: importantItems } = useImportantItems();
  
  const ideas = allItems.filter(i => i.type === 'idea').slice(0, 4);
  const projects = allItems.filter(i => i.type === 'project').slice(0, 3);
  const recentNotes = allItems.filter(i => i.type === 'note').slice(0, 5);
  const tasks = allItems.filter(i => i.type === 'task');

  // Count items for each category
  const tasksCount = upcomingTasks?.length || 0;
  const ideasCount = ideas.length;
  const projectsCount = projects.length;
  const notesCount = recentNotes.length;

  return (
    <AppLayout>
      <div className="flex-1 relative overflow-hidden">
        {/* Animated particle background */}
        <ParticleBackground />

        <div className="relative z-10 p-4 md:p-6 overflow-y-auto h-full">
          {/* Header with gradient effect */}
          <motion.header 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <h1 className="text-3xl md:text-4xl font-display font-bold">
              <span className="gradient-text">Dashboard</span>
            </h1>
            <p className="text-muted-foreground mt-1">Sua central de comando mental</p>
          </motion.header>

          {/* Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
            {/* Bloco Agora */}
            <DashboardCard
              title="Agora"
              icon={Flame}
              count={tasksCount}
              gradient="red"
              navigateTo="/tasks"
              delay={0}
            >
              {upcomingTasks?.length ? (
                upcomingTasks.slice(0, 3).map((task, i) => (
                  <motion.div
                    key={task.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 + i * 0.1 }}
                    className="flex items-center gap-3 p-3 rounded-xl bg-background/50 border border-white/5 hover:border-destructive/30 transition-colors group"
                  >
                    <CheckCircle2 className="w-4 h-4 text-muted-foreground group-hover:text-destructive transition-colors" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm truncate">{task.content}</p>
                      {task.due_date && (
                        <p className="text-xs text-muted-foreground">
                          {format(new Date(task.due_date), "dd MMM", { locale: ptBR })}
                        </p>
                      )}
                    </div>
                  </motion.div>
                ))
              ) : (
                <div className="text-center py-4">
                  <p className="text-sm text-muted-foreground">🎉 Tudo em dia!</p>
                </div>
              )}
            </DashboardCard>

            {/* Bloco Ideias */}
            <DashboardCard
              title="Ideias Ativas"
              icon={Lightbulb}
              count={ideasCount}
              gradient="purple"
              navigateTo="/ideas"
              delay={0.1}
            >
              {ideas.length ? (
                ideas.slice(0, 3).map((idea, i) => (
                  <motion.div
                    key={idea.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4 + i * 0.1 }}
                    className="p-3 rounded-xl bg-background/50 border border-white/5 hover:border-mindflow-purple/30 transition-colors"
                  >
                    <p className="text-sm truncate">{idea.content}</p>
                  </motion.div>
                ))
              ) : (
                <div className="text-center py-4">
                  <p className="text-sm text-muted-foreground">💡 Capture sua primeira ideia!</p>
                </div>
              )}
            </DashboardCard>

            {/* Bloco Projetos */}
            <DashboardCard
              title="Projetos"
              icon={FolderKanban}
              count={projectsCount}
              gradient="cyan"
              navigateTo="/projects"
              delay={0.2}
            >
              {projects.length ? (
                projects.slice(0, 2).map((project, i) => (
                  <motion.div
                    key={project.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5 + i * 0.1 }}
                    className="p-3 rounded-xl bg-background/50 border border-white/5 hover:border-mindflow-cyan/30 transition-colors"
                  >
                    <p className="font-medium text-sm truncate">{project.title || project.content}</p>
                    <div className="mt-2 h-1.5 bg-muted rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: '33%' }}
                        transition={{ delay: 0.8, duration: 0.5 }}
                        className="h-full bg-gradient-to-r from-mindflow-cyan to-mindflow-blue rounded-full"
                      />
                    </div>
                  </motion.div>
                ))
              ) : (
                <div className="text-center py-4">
                  <p className="text-sm text-muted-foreground">📁 Crie seu primeiro projeto!</p>
                </div>
              )}
            </DashboardCard>

            {/* Bloco Fluxo */}
            <DashboardCard
              title="Fluxo de Pensamentos"
              icon={Activity}
              count={notesCount}
              gradient="green"
              navigateTo="/timeline"
              delay={0.3}
            >
              {recentNotes.length ? (
                <div className="space-y-1">
                  {recentNotes.slice(0, 3).map((note, i) => (
                    <motion.div
                      key={note.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.6 + i * 0.1 }}
                      className="flex items-start gap-3 p-2 group"
                    >
                      <div className="relative mt-1.5">
                        <div className="w-2 h-2 rounded-full bg-mindflow-green group-hover:animate-glow-pulse" />
                        {i < recentNotes.slice(0, 3).length - 1 && (
                          <div className="absolute top-3 left-1/2 -translate-x-1/2 w-px h-6 bg-gradient-to-b from-mindflow-green/50 to-transparent" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm truncate">{note.content}</p>
                        <p className="text-xs text-muted-foreground">
                          {format(new Date(note.created_at), "dd MMM HH:mm", { locale: ptBR })}
                        </p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-4">
                  <p className="text-sm text-muted-foreground">✨ Registre seus pensamentos!</p>
                </div>
              )}
            </DashboardCard>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
