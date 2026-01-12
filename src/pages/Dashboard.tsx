import { motion } from 'framer-motion';
import { CheckCircle2, Lightbulb, FolderKanban, FileText, TrendingUp, Clock, Zap, Target } from 'lucide-react';
import AppLayout from '@/components/layout/AppLayout';
import { useItems, useUpcomingTasks, useImportantItems, useGoals, useEvents } from '@/hooks/useItems';
import DashboardCard from '@/components/dashboard/DashboardCard';
import ParticleBackground from '@/components/dashboard/ParticleBackground';
import TechGridBackground from '@/components/dashboard/TechGridBackground';
import StatCard from '@/components/dashboard/StatCard';
import MiniChart from '@/components/dashboard/MiniChart';
import GoalsBar from '@/components/dashboard/GoalsBar';
import EventsCalendarCard from '@/components/dashboard/EventsCalendarCard';
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

  // Sample data for mini charts (in real app, calculate from actual data)
  const taskTrendData = [3, 5, 4, 7, 6, 8, pendingTasks];
  const ideaTrendData = [2, 4, 3, 5, 7, 6, ideas.length];

  const taskCount = pendingTasks;
  const ideaCount = ideas.length;
  const projectCount = activeProjects;
  const noteCount = notes.length;

  return (
    <AppLayout>
      <div className="relative min-h-screen overflow-hidden">
        {/* Layered backgrounds - using absolute instead of fixed to not cover sidebar */}
        <div className="absolute inset-0 bg-gradient-to-br from-background via-background to-purple-950/20" />
        <div className="absolute inset-0">
          <TechGridBackground />
        </div>
        <div className="absolute inset-0">
          <ParticleBackground />
        </div>

        {/* Content */}
        <div className="relative z-10 p-6 space-y-6">
          {/* Header */}
          <motion.header 
            className="text-center py-4"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-purple-500/10 border border-purple-500/20 mb-4"
            >
              <Zap className="w-4 h-4 text-purple-400" />
              <span className="text-xs text-purple-300 uppercase tracking-wider">Central de Controle</span>
            </motion.div>
            
            <h1 className="text-4xl md:text-5xl font-display font-bold bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              Dashboard
            </h1>
            <p className="text-muted-foreground mt-2">
              Sua visão completa de produtividade
            </p>
          </motion.header>

          {/* Goals Bar - Fixed at top */}
          <GoalsBar goals={goals || []} />

          {/* Stats Row - 4 cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <StatCard
              icon={CheckCircle2}
              value={pendingTasks}
              label="Tarefas Pendentes"
              trend={12}
              color="orange"
              delay={0.1}
            />
            <StatCard
              icon={FolderKanban}
              value={activeProjects}
              label="Projetos Ativos"
              trend={5}
              color="cyan"
              delay={0.2}
            />
            <StatCard
              icon={Lightbulb}
              value={rawIdeas}
              label="Ideias para Desenvolver"
              trend={-3}
              color="magenta"
              delay={0.3}
            />
            <StatCard
              icon={FileText}
              value={noteCount}
              label="Notas Criadas"
              color="green"
              delay={0.4}
            />
          </div>

          {/* Main Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Upcoming Tasks */}
            <DashboardCard 
              title="Agora" 
              icon={Clock} 
              count={taskCount}
              gradient="blue"
              navigateTo="/tasks"
            >
              <div className="space-y-3">
                {upcomingTasks && upcomingTasks.length > 0 ? (
                  upcomingTasks.slice(0, 4).map((task, index) => (
                    <motion.div 
                      key={task.id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.1 * index }}
                      className="flex items-center justify-between p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors border border-white/5"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-2 h-2 rounded-full bg-cyan-400 shadow-[0_0_8px_rgba(0,255,255,0.6)]" />
                        <span className="text-sm text-foreground/90 truncate max-w-[200px]">
                          {task.content}
                        </span>
                      </div>
                      {task.due_date && (
                        <span className="text-xs text-muted-foreground">
                          {format(new Date(task.due_date), 'dd MMM', { locale: ptBR })}
                        </span>
                      )}
                    </motion.div>
                  ))
                ) : (
                  <div className="text-center py-6 text-muted-foreground">
                    <Target className="w-8 h-8 mx-auto mb-2 opacity-50" />
                    <p className="text-sm">Nenhuma tarefa pendente</p>
                  </div>
                )}
              </div>
              
              {/* Mini trend chart */}
              <div className="mt-4 pt-4 border-t border-white/5">
                <p className="text-xs text-muted-foreground mb-2">Tendência semanal</p>
                <MiniChart data={taskTrendData} color="cyan" height={50} />
              </div>
            </DashboardCard>

            {/* Events Calendar */}
            <EventsCalendarCard events={events || []} />

            {/* Ideas */}
            <DashboardCard 
              title="Ideias Ativas" 
              icon={Lightbulb} 
              count={ideaCount}
              gradient="purple"
              navigateTo="/ideas"
            >
              <div className="space-y-3">
                {ideas.length > 0 ? (
                  ideas.slice(0, 4).map((idea, index) => (
                    <motion.div 
                      key={idea.id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.1 * index }}
                      className="p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors border border-white/5"
                    >
                      <p className="text-sm text-foreground/90 line-clamp-2">
                        {idea.content}
                      </p>
                      <span className="text-xs text-purple-400 mt-1 inline-block">
                        {idea.status === 'raw' ? '💡 Bruta' : idea.status === 'evolving' ? '🌱 Evoluindo' : '🚀 Em progresso'}
                      </span>
                    </motion.div>
                  ))
                ) : (
                  <div className="text-center py-6 text-muted-foreground">
                    <Lightbulb className="w-8 h-8 mx-auto mb-2 opacity-50" />
                    <p className="text-sm">Capture suas primeiras ideias</p>
                  </div>
                )}
              </div>

              {/* Mini trend chart */}
              <div className="mt-4 pt-4 border-t border-white/5">
                <p className="text-xs text-muted-foreground mb-2">Criação de ideias</p>
                <MiniChart data={ideaTrendData} color="magenta" height={50} />
              </div>
            </DashboardCard>

            {/* Projects */}
            <DashboardCard 
              title="Projetos" 
              icon={FolderKanban} 
              count={projectCount}
              gradient="green"
              navigateTo="/projects"
            >
              <div className="space-y-3">
                {projects.length > 0 ? (
                  projects.slice(0, 4).map((project, index) => (
                    <motion.div 
                      key={project.id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.1 * index }}
                      className="p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors border border-white/5"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-foreground/90 truncate">
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
                  <div className="text-center py-6 text-muted-foreground">
                    <FolderKanban className="w-8 h-8 mx-auto mb-2 opacity-50" />
                    <p className="text-sm">Crie seu primeiro projeto</p>
                  </div>
                )}
              </div>
            </DashboardCard>

            {/* Recent Notes */}
            <DashboardCard 
              title="Fluxo de Pensamentos" 
              icon={FileText} 
              count={noteCount}
              gradient="cyan"
              navigateTo="/timeline"
            >
              <div className="space-y-3">
                {recentNotes.length > 0 ? (
                  recentNotes.map((note, index) => (
                    <motion.div 
                      key={note.id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.1 * index }}
                      className="p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors border border-white/5"
                    >
                      <p className="text-sm text-foreground/90 line-clamp-2">
                        {note.content}
                      </p>
                      <span className="text-xs text-muted-foreground mt-1 inline-block">
                        {format(new Date(note.created_at), "dd MMM 'às' HH:mm", { locale: ptBR })}
                      </span>
                    </motion.div>
                  ))
                ) : (
                  <div className="text-center py-6 text-muted-foreground">
                    <FileText className="w-8 h-8 mx-auto mb-2 opacity-50" />
                    <p className="text-sm">Suas notas aparecerão aqui</p>
                  </div>
                )}
              </div>
            </DashboardCard>
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
