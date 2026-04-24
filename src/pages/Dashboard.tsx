import { useState, useMemo, ReactNode, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  rectSortingStrategy,
} from '@dnd-kit/sortable';
import { CheckCircle2, Lightbulb, FolderKanban, FileText, RotateCcw, Sun, Moon, Plus } from 'lucide-react';
import AppLayout from '@/components/layout/AppLayout';
import { useItems, useUpcomingTasks, useGoals, useEvents } from '@/hooks/useItems';
import DraggableDashboardCard from '@/components/dashboard/DraggableDashboardCard';
import StatCard from '@/components/dashboard/StatCard';
import GoalsBar from '@/components/dashboard/GoalsBar';
import EventsCalendarCard from '@/components/dashboard/EventsCalendarCard';
import QuickNotesBoard from '@/components/dashboard/QuickNotesBoard';
import TasksCard from '@/components/dashboard/TasksCard';
import IdeasCard from '@/components/dashboard/IdeasCard';
import ProjectsCard from '@/components/dashboard/ProjectsCard';
import ProductivityChart from '@/components/dashboard/ProductivityChart';
import ActivityFeed from '@/components/dashboard/ActivityFeed';
import { QuickAddModal } from '@/components/dashboard/QuickAddModal';
import { useDashboardLayout, DashboardCardId } from '@/hooks/useDashboardLayout';
import { useDashboardTheme } from '@/hooks/useDashboardTheme';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

export default function Dashboard() {
  const { items } = useItems();
  const { data: upcomingTasks } = useUpcomingTasks();
  const { data: goals } = useGoals();
  const { data: events } = useEvents();
  const { toast } = useToast();
  const [quickAddOpen, setQuickAddOpen] = useState(false);

  // Theme
  const { theme, toggleTheme, isDark, isLoaded: themeLoaded } = useDashboardTheme();

  // Layout with dnd-kit
  const { cardOrder, setCardOrder, resetToDefault, isLoaded } = useDashboardLayout();
  const [activeId, setActiveId] = useState<string | null>(null);

  // Keyboard shortcut ⌘+N
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'n') {
        e.preventDefault();
        setQuickAddOpen(true);
      }
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, []);

  // Sensors
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } })
  );

  // Stats
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

  // Card components
  const cardComponents: Record<DashboardCardId, ReactNode> = useMemo(() => ({
    tasks: <TasksCard tasks={upcomingTasks} taskCount={taskCount} isDark={isDark} />,
    ideas: <IdeasCard ideas={ideas} ideaCount={ideaCount} isDark={isDark} />,
    events: <EventsCalendarCard events={events || []} isDark={isDark} />,
    projects: <ProjectsCard projects={projects} projectCount={projectCount} isDark={isDark} />,
    notes: <QuickNotesBoard isDark={isDark} />,
  }), [upcomingTasks, taskCount, ideas, ideaCount, events, projects, projectCount, isDark]);

  // DnD handlers
  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    setActiveId(null);
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = cardOrder.indexOf(active.id as DashboardCardId);
    const newIndex = cardOrder.indexOf(over.id as DashboardCardId);
    const newOrder = arrayMove(cardOrder, oldIndex, newIndex);
    setCardOrder(newOrder);

    toast({
      title: "Layout atualizado!",
      description: "Sua preferência foi salva.",
    });
  };

  const handleResetLayout = () => {
    resetToDefault();
    toast({ title: "Layout restaurado!", description: "Dashboard voltou ao layout padrão." });
  };

  const handleToggleTheme = () => {
    toggleTheme();
    toast({ title: isDark ? "Tema claro ativado" : "Tema escuro ativado", description: "Sua preferência foi salva." });
  };

  if (!isLoaded || !themeLoaded) {
    return (
      <AppLayout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse" />
            <div className="w-2 h-2 rounded-full bg-purple-500 animate-pulse" style={{ animationDelay: '0.15s' }} />
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" style={{ animationDelay: '0.3s' }} />
          </div>
        </div>
      </AppLayout>
    );
  }

  // Greeting
  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Bom dia' : hour < 18 ? 'Boa tarde' : 'Boa noite';

  return (
    <AppLayout>
      <div className={`relative h-[calc(100vh-2rem)] md:h-screen flex flex-col overflow-hidden transition-colors duration-300 ${
        isDark ? 'bg-background' : 'bg-gray-50'
      }`}>
        {/* Subtle gradient mesh background */}
        <div className="fixed inset-0 pointer-events-none z-0">
          <div className={`absolute inset-0 transition-opacity duration-500 ${isDark ? 'opacity-100' : 'opacity-0'}`}>
            <div className="absolute top-0 right-1/4 w-96 h-96 rounded-full bg-indigo-500/[0.04] blur-[100px]" />
            <div className="absolute bottom-1/4 left-1/4 w-96 h-96 rounded-full bg-purple-500/[0.03] blur-[100px]" />
            <div className="absolute top-1/2 right-0 w-64 h-64 rounded-full bg-emerald-500/[0.02] blur-[80px]" />
          </div>
        </div>

        {/* Content */}
        <div className="relative z-10 p-4 md:p-6 flex flex-col h-full gap-4 overflow-y-auto">
          {/* Header */}
          <motion.header
            className="flex items-center justify-between gap-3 shrink-0"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <div>
              <h1 className="text-xl md:text-2xl font-display font-bold">
                {greeting} <span className="gradient-text">✨</span>
              </h1>
              <p className="text-xs text-muted-foreground mt-0.5">
                {new Date().toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long' })}
              </p>
            </div>
            <div className="flex items-center gap-1.5">
              {/* Quick Add */}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setQuickAddOpen(true)}
                className="gap-1.5 text-muted-foreground hover:text-foreground"
              >
                <Plus className="w-4 h-4" />
                <span className="hidden sm:inline">Novo</span>
                <kbd className="hidden md:inline-flex h-5 items-center gap-0.5 rounded border border-white/10 bg-white/5 px-1.5 text-[10px] text-muted-foreground">
                  ⌘N
                </kbd>
              </Button>
              {/* Theme */}
              <Button
                variant="ghost"
                size="icon"
                onClick={handleToggleTheme}
                className="text-muted-foreground hover:text-foreground w-8 h-8"
              >
                {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
              </Button>
              {/* Reset Layout */}
              <Button
                variant="ghost"
                size="icon"
                onClick={handleResetLayout}
                className="text-muted-foreground hover:text-foreground w-8 h-8"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </Button>
            </div>
          </motion.header>

          {/* Goals Bar */}
          <div className="shrink-0">
            <GoalsBar goals={goals || []} isDark={isDark} />
          </div>

          {/* Stats Row */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-3 shrink-0">
            <StatCard icon={CheckCircle2} value={pendingTasks} label="Tarefas Pendentes" trend={12} color="green" delay={0.1} isDark={isDark} />
            <StatCard icon={FolderKanban} value={activeProjects} label="Projetos Ativos" trend={5} color="cyan" delay={0.15} isDark={isDark} />
            <StatCard icon={Lightbulb} value={rawIdeas} label="Ideias Novas" trend={-3} color="purple" delay={0.2} isDark={isDark} />
            <StatCard icon={FileText} value={noteCount} label="Notas Criadas" color="magenta" delay={0.25} isDark={isDark} />
          </div>

          {/* Charts Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 shrink-0" style={{ minHeight: '220px' }}>
            <ProductivityChart items={items} isDark={isDark} />
            <ActivityFeed items={items} isDark={isDark} />
          </div>

          {/* Draggable Cards Grid */}
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
          >
            <SortableContext items={cardOrder} strategy={rectSortingStrategy}>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pb-24 md:pb-4">
                {cardOrder.map((cardId) => (
                  <DraggableDashboardCard key={cardId} id={cardId}>
                    {cardComponents[cardId]}
                  </DraggableDashboardCard>
                ))}
              </div>
            </SortableContext>

            <DragOverlay>
              {activeId ? (
                <div className="drag-overlay rounded-2xl">
                  {cardComponents[activeId as DashboardCardId]}
                </div>
              ) : null}
            </DragOverlay>
          </DndContext>
        </div>
      </div>

      {/* Quick Add Modal */}
      <QuickAddModal isOpen={quickAddOpen} onClose={() => setQuickAddOpen(false)} />

      {/* Mobile FAB */}
      <motion.button
        className="fab-button md:hidden"
        onClick={() => setQuickAddOpen(true)}
        whileTap={{ scale: 0.9 }}
        aria-label="Criar novo item"
      >
        <Plus className="w-6 h-6 text-white" />
      </motion.button>
    </AppLayout>
  );
}