import { useState, useMemo, ReactNode } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, Lightbulb, FolderKanban, FileText, TrendingUp, RotateCcw } from 'lucide-react';
import AppLayout from '@/components/layout/AppLayout';
import { useItems, useUpcomingTasks, useImportantItems, useGoals, useEvents } from '@/hooks/useItems';
import DraggableDashboardCard from '@/components/dashboard/DraggableDashboardCard';
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
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="animate-pulse text-muted-foreground">Carregando...</div>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="relative h-[calc(100vh-2rem)] flex flex-col bg-gray-50 overflow-hidden">
        {/* Clean white/light background */}
        <div className="fixed inset-0 bg-gradient-to-br from-gray-50 via-white to-gray-100 pointer-events-none z-0" />

        {/* Content - Flex container to fill viewport */}
        <div className="relative z-10 p-4 md:p-6 flex flex-col h-full gap-4">
          {/* Header - Compact with Reset Button */}
          <motion.header 
            className="flex items-center justify-between gap-3 shrink-0"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <h1 className="text-xl font-display font-semibold text-gray-800">
              Dashboard
            </h1>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleResetLayout}
              className="text-gray-500 hover:text-gray-700 gap-2"
            >
              <RotateCcw className="w-4 h-4" />
              <span className="hidden sm:inline">Resetar Layout</span>
            </Button>
          </motion.header>

          {/* Goals Bar - Fixed at top */}
          <div className="shrink-0">
            <GoalsBar goals={goals || []} />
          </div>

          {/* Stats Row - 4 cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-4 shrink-0">
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

          {/* Main Grid - Draggable Cards - Fills remaining space */}
          <div className="flex-1 min-h-0 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 items-stretch">
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
        </div>
      </div>
    </AppLayout>
  );
}