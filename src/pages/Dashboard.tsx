import { motion } from 'framer-motion';
import { CheckCircle2, Lightbulb, FolderKanban, FileText, TrendingUp, Clock, Target } from 'lucide-react';
import AppLayout from '@/components/layout/AppLayout';
import { useItems, useUpcomingTasks, useImportantItems, useGoals, useEvents } from '@/hooks/useItems';
import DashboardCard from '@/components/dashboard/DashboardCard';
import ParticleBackground from '@/components/dashboard/ParticleBackground';
import TechGridBackground from '@/components/dashboard/TechGridBackground';
import StatCard from '@/components/dashboard/StatCard';
import GoalsBar from '@/components/dashboard/GoalsBar';
import EventsCalendarCard from '@/components/dashboard/EventsCalendarCard';
import QuickNotesBoard from '@/components/dashboard/QuickNotesBoard';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export default function Dashboard() {
  const { items } = useItems();
  const { data: upcomingTasks } = useUpcomingTasks();
  const { data: importantItems } = useImportantItems();
  const { data: goals } = useGoals();
  const { data: events } = useEvents();

  // Filter and count items
  const tasks = items?.filter(item => item.type === 'task') || [];
  const pendingTasks = tasks.filter(t => t.status !== 'completed').length;

  const ideas = items?.filter(item => item.type === 'idea') || [];
  const rawIdeas = ideas.filter(i => i.status === 'raw').length;
  
  const projects = items?.filter(item => item.type === 'project') || [];
  const activeProjects = projects.filter(p => p.status === 'active' || p.status === 'in_progress').length;
  
  const notes = items?.filter(item => item.type === 'note') || [];
  const recentNotes = notes.slice(0, 4);

  const taskCount = pendingTasks;
  const ideaCount = ideas.length;
  const projectCount = activeProjects;
  const noteCount = notes.length;

  return (
    <AppLayout>
      <div className="relative min-h-screen overflow-y-auto pb-20 md:pb-6">
        {/* Layered backgrounds - using absolute instead of fixed to not cover sidebar */}
        <div className="fixed inset-0 bg-gradient-to-br from-background via-background to-purple-950/20 pointer-events-none" />
        <div className="fixed inset-0 pointer-events-none">
          <TechGridBackground />
        </div>
        <div className="fixed inset-0 pointer-events-none">
          <ParticleBackground />
        </div>

        {/* Content */}
        <div className="relative z-10 p-4 md:p-6 space-y-4 md:space-y-6">
          {/* Header - Compact */}
          <motion.header 
            className="flex items-center gap-3 py-2"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <h1 className="text-xl font-display font-semibold text-foreground/80">
              Dashboard
            </h1>
          </motion.header>

          {/* Goals Bar - Fixed at top */}
          <GoalsBar goals={goals || []} />

          {/* Stats Row - 4 cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-4">
            <StatCard
              icon={CheckCircle2}
              value={pendingTasks}
              label="✅ Tarefas Pendentes"
              trend={12}
              color="green"
              delay={0.1}
            />
            <StatCard
              icon={FolderKanban}
              value={activeProjects}
              label="📁 Projetos Ativos"
              trend={5}
              color="cyan"
              delay={0.2}
            />
            <StatCard
              icon={Lightbulb}
              value={rawIdeas}
              label="💡 Ideias para Desenvolver"
              trend={-3}
              color="yellow"
              delay={0.3}
            />
            <StatCard
              icon={FileText}
              value={noteCount}
              label="📝 Notas Criadas"
              color="magenta"
              delay={0.4}
            />
          </div>

          {/* Main Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            {/* Tarefas */}
            <DashboardCard 
              title="✅ Tarefas" 
              icon={Clock} 
              count={taskCount}
              gradient="green"
              navigateTo="/tasks"
            >
              <div className="space-y-2">
                {upcomingTasks && upcomingTasks.length > 0 ? (
                  upcomingTasks.slice(0, 4).map((task, index) => (
                    <motion.div 
                      key={task.id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.1 * index }}
                      className="flex items-center justify-between p-2 md:p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors border border-white/5"
                    >
                      <div className="flex items-center gap-2 md:gap-3">
                        <div className="w-2 h-2 rounded-full bg-cyan-400 shadow-[0_0_8px_rgba(0,255,255,0.6)] shrink-0" />
                        <span className="text-xs md:text-sm text-foreground/90">
                          {task.content}
                        </span>
                      </div>
                      {task.due_date && (
                        <span className="text-xs text-muted-foreground whitespace-nowrap ml-2">
                          {format(new Date(task.due_date), 'dd MMM', { locale: ptBR })}
                        </span>
                      )}
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

            {/* Ideas */}
            <DashboardCard 
              title="💡 Ideias Ativas" 
              icon={Lightbulb} 
              count={ideaCount}
              gradient="yellow"
              navigateTo="/ideas"
            >
              <div className="space-y-2">
                {ideas.length > 0 ? (
                  ideas.slice(0, 3).map((idea, index) => (
                    <motion.div 
                      key={idea.id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.1 * index }}
                      className="p-2 md:p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors border border-white/5"
                    >
                      <p className="text-xs md:text-sm text-foreground/90 line-clamp-2">
                        {idea.content}
                      </p>
                      <span className="text-xs text-purple-400 mt-1 inline-block">
                        {idea.status === 'raw' ? '💡 Bruta' : idea.status === 'evolving' ? '🌱 Evoluindo' : '🚀 Em progresso'}
                      </span>
                    </motion.div>
                  ))
                ) : (
                  <div className="text-center py-4 text-muted-foreground">
                    <Lightbulb className="w-6 h-6 mx-auto mb-2 opacity-50" />
                    <p className="text-xs md:text-sm">Capture suas primeiras ideias</p>
                  </div>
                )}
              </div>
            </DashboardCard>

            {/* Events Calendar - Right side */}
            <EventsCalendarCard events={events || []} />

            {/* Projects */}
            <DashboardCard 
              title="📁 Projetos" 
              icon={FolderKanban} 
              count={projectCount}
              gradient="cyan"
              navigateTo="/projects"
            >
              <div className="space-y-2">
                {projects.length > 0 ? (
                  projects.slice(0, 4).map((project, index) => (
                    <motion.div 
                      key={project.id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.1 * index }}
                      className="p-2 md:p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors border border-white/5"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs md:text-sm font-medium text-foreground/90 truncate">
                          {project.title || project.content}
                        </span>
                        <span className="text-xs text-emerald-400">
                          {project.progress || 0}%
                        </span>
                      </div>
                      <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                        <motion.div 
                          className="h-full bg-gradient-to-r from-emerald-500 to-cyan-500 rounded-full"
                          initial={{ width: 0 }}
                          animate={{ width: `${project.progress || 0}%` }}
                          transition={{ duration: 1, delay: 0.2 * index }}
                        />
                      </div>
                    </motion.div>
                  ))
                ) : (
                  <div className="text-center py-4 text-muted-foreground">
                    <FolderKanban className="w-6 h-6 mx-auto mb-2 opacity-50" />
                    <p className="text-xs md:text-sm">Crie seu primeiro projeto</p>
                  </div>
                )}
              </div>
            </DashboardCard>

            {/* Quick Notes Board */}
            <QuickNotesBoard />
          </div>

          {/* Important Items Section */}
          {importantItems && importantItems.length > 0 && (
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              className="mt-8"
            >
              <div className="flex items-center gap-2 mb-4">
                <TrendingUp className="w-5 h-5 text-pink-400" />
                <h2 className="text-lg font-display font-semibold text-foreground">Prioridades</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {importantItems.slice(0, 3).map((item, index) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.9 + index * 0.1 }}
                    className="p-4 rounded-xl bg-gradient-to-br from-pink-500/10 to-purple-500/10 border border-pink-500/20 hover:border-pink-500/40 transition-all"
                  >
                    <div className="flex items-start gap-3">
                      <div className="w-2 h-2 rounded-full bg-pink-400 shadow-[0_0_8px_rgba(236,72,153,0.6)] mt-2" />
                      <div>
                        <p className="text-sm text-foreground/90">{item.content}</p>
                        <span className="text-xs text-muted-foreground capitalize">{item.type}</span>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.section>
          )}
        </div>
      </div>
    </AppLayout>
  );
}
