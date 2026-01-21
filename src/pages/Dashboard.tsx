import { useState, useMemo, ReactNode } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, Lightbulb, FolderKanban, FileText, TrendingUp, RotateCcw } from 'lucide-react';
import AppLayout from '@/components/layout/AppLayout';
import { useItems, useUpcomingTasks, useImportantItems, useGoals, useEvents } from '@/hooks/useItems';
import DraggableDashboardCard from '@/components/dashboard/DraggableDashboardCard';
import ParticleBackground from '@/components/dashboard/ParticleBackground';
import TechGridBackground from '@/components/dashboard/TechGridBackground';
import StatCard from '@/components/dashboard/StatCard';
import GoalsBar from '@/components/dashboard/GoalsBar';
import EventsCalendarCard from '@/components/dashboard/EventsCalendarCard';
import QuickNotesBoard from '@/components/dashboard/QuickNotesBoard';
import TasksCard from '@/components/dashboard/TasksCard';
import IdeasCard from '@/components/dashboard/IdeasCard';
import ProjectsCard from '@/components/dashboard/ProjectsCard';
import { useDashboardLayout, DashboardCardId } from '@/hooks/useDashboardLayout';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

export default function Dashboard() {
  const { items } = useItems();
  const { data: upcomingTasks } = useUpcomingTasks();
  const { data: importantItems } = useImportantItems();
  const { data: goals } = useGoals();
  const { data: events } = useEvents();
  const { toast } = useToast();

  // Drag-and-drop state
  const { cardOrder, moveCard, resetToDefault, isLoaded } = useDashboardLayout();
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);

  // Filter and count items
  const tasks = items?.filter(item => item.type === 'task') || [];
  const pendingTasks = tasks.filter(t => t.status !== 'completed').length;

  const ideas = items?.filter(item => item.type === 'idea') || [];
  const rawIdeas = ideas.filter(i => i.status === 'raw').length;
  
  const projects = items?.filter(item => item.type === 'project') || [];
  const activeProjects = projects.filter(p => p.status === 'active' || p.status === 'in_progress').length;
  
  const notes = items?.filter(item => item.type === 'note') || [];
  const noteCount = notes.length;

  const taskCount = pendingTasks;
  const ideaCount = ideas.length;
  const projectCount = activeProjects;

  // Card components map
  const cardComponents: Record<DashboardCardId, ReactNode> = useMemo(() => ({
    tasks: <TasksCard tasks={upcomingTasks} taskCount={taskCount} />,
    ideas: <IdeasCard ideas={ideas} ideaCount={ideaCount} />,
    events: <EventsCalendarCard events={events || []} />,
    projects: <ProjectsCard projects={projects} projectCount={projectCount} />,
    notes: <QuickNotesBoard />,
  }), [upcomingTasks, taskCount, ideas, ideaCount, events, projects, projectCount]);

  // Drag handlers
  const handleDragStart = (index: number) => {
    setDraggedIndex(index);
  };

  const handleDragOver = (index: number) => {
    if (draggedIndex !== null && draggedIndex !== index) {
      setDragOverIndex(index);
    }
  };

  const handleDragEnd = () => {
    if (draggedIndex !== null && dragOverIndex !== null && draggedIndex !== dragOverIndex) {
      moveCard(draggedIndex, dragOverIndex);
      toast({
        title: "Layout atualizado!",
        description: "Sua preferência foi salva.",
      });
    }
    setDraggedIndex(null);
    setDragOverIndex(null);
  };

  const handleResetLayout = () => {
    resetToDefault();
    toast({
      title: "Layout restaurado!",
      description: "Dashboard voltou ao layout padrão.",
    });
  };

  if (!isLoaded) {
    return (
      <AppLayout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-pulse text-muted-foreground">Carregando...</div>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="relative min-h-screen overflow-y-auto pb-20 md:pb-6">
        {/* Layered backgrounds - z-0 to stay behind sidebar */}
        <div className="fixed inset-0 bg-gradient-to-br from-background via-background to-primary/5 pointer-events-none z-0" />
        <div className="fixed inset-0 pointer-events-none z-0">
          <TechGridBackground />
        </div>
        <div className="fixed inset-0 pointer-events-none z-0">
          <ParticleBackground />
        </div>

        {/* Content */}
        <div className="relative z-10 p-4 md:p-6 space-y-4 md:space-y-6">
          {/* Header - Compact with Reset Button */}
          <motion.header 
            className="flex items-center justify-between gap-3 py-2"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <h1 className="text-xl font-display font-semibold text-foreground/80">
              Dashboard
            </h1>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleResetLayout}
              className="text-muted-foreground hover:text-foreground gap-2"
            >
              <RotateCcw className="w-4 h-4" />
              <span className="hidden sm:inline">Resetar Layout</span>
            </Button>
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

          {/* Main Grid - Draggable Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 items-start auto-rows-min">
            {cardOrder.map((cardId, index) => (
              <DraggableDashboardCard
                key={cardId}
                id={cardId}
                index={index}
                onDragStart={handleDragStart}
                onDragOver={handleDragOver}
                onDragEnd={handleDragEnd}
                isDragging={draggedIndex === index}
                isDraggedOver={dragOverIndex === index}
              >
                {cardComponents[cardId]}
              </DraggableDashboardCard>
            ))}
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
                <TrendingUp className="w-5 h-5 text-primary" />
                <h2 className="text-lg font-display font-semibold text-foreground">Prioridades</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {importantItems.slice(0, 3).map((item, index) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.9 + index * 0.1 }}
                    className="p-4 rounded-xl bg-gradient-to-br from-primary/10 to-accent/10 border border-primary/20 hover:border-primary/40 transition-all"
                  >
                    <div className="flex items-start gap-3">
                      <div className="w-2 h-2 rounded-full bg-primary shadow-lg mt-2" />
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
