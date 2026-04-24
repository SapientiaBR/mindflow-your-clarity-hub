import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import {
  Brain,
  MessageSquare,
  LayoutDashboard,
  Lightbulb,
  CheckSquare,
  FolderKanban,
  Clock,
  Network,
  CalendarDays,
  FileText,
  Target,
  LogOut,
  ChevronsLeft,
  ChevronsRight,
  Search,
  Sparkles,
} from 'lucide-react';
import { useState, useEffect } from 'react';

const workspaceItems = [
  { path: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { path: '/chat', icon: MessageSquare, label: 'Chat IA' },
];

const viewItems = [
  { path: '/tasks', icon: CheckSquare, label: 'Tarefas', badge: 'badge-task' },
  { path: '/ideas', icon: Lightbulb, label: 'Ideias', badge: 'badge-idea' },
  { path: '/goals', icon: Target, label: 'Objetivos', badge: 'badge-goal' },
  { path: '/projects', icon: FolderKanban, label: 'Projetos', badge: 'badge-project' },
  { path: '/notes', icon: FileText, label: 'Notas', badge: 'badge-note' },
  { path: '/events', icon: CalendarDays, label: 'Eventos', badge: 'badge-event' },
];

const toolItems = [
  { path: '/timeline', icon: Clock, label: 'Timeline' },
  { path: '/mindmap', icon: Network, label: 'Mapa Mental' },
];

interface SidebarProps {
  onSearchClick?: () => void;
}

export default function Sidebar({ onSearchClick }: SidebarProps) {
  const location = useLocation();
  const { signOut, user } = useAuth();
  const [collapsed, setCollapsed] = useState(() => {
    const saved = localStorage.getItem('sidebar-collapsed');
    return saved ? JSON.parse(saved) : false;
  });

  useEffect(() => {
    localStorage.setItem('sidebar-collapsed', JSON.stringify(collapsed));
  }, [collapsed]);

  const renderNavGroup = (title: string, items: typeof workspaceItems) => (
    <div className="space-y-0.5">
      {!collapsed && (
        <p className="text-[10px] uppercase tracking-widest text-muted-foreground/60 font-semibold px-3 mb-2">
          {title}
        </p>
      )}
      {items.map((item) => {
        const isActive = location.pathname === item.path;
        const Icon = item.icon;

        return (
          <Link
            key={item.path}
            to={item.path}
            className={cn(
              'group relative flex items-center gap-3 px-3 py-2 rounded-xl transition-all duration-200',
              collapsed && 'justify-center px-2',
              isActive
                ? 'text-primary-foreground'
                : 'text-muted-foreground hover:text-foreground hover:bg-white/[0.04]'
            )}
          >
            {/* Active indicator */}
            {isActive && (
              <motion.div
                layoutId="sidebar-active"
                className="absolute inset-0 active-pill rounded-xl"
                transition={{ type: 'spring', bounce: 0.2, duration: 0.5 }}
              />
            )}

            <Icon className={cn('w-[18px] h-[18px] shrink-0 relative z-10', isActive && 'text-white')} />

            <AnimatePresence>
              {!collapsed && (
                <motion.span
                  initial={{ opacity: 0, width: 0 }}
                  animate={{ opacity: 1, width: 'auto' }}
                  exit={{ opacity: 0, width: 0 }}
                  className={cn(
                    'text-sm font-medium relative z-10 whitespace-nowrap overflow-hidden',
                    isActive && 'text-white'
                  )}
                >
                  {item.label}
                </motion.span>
              )}
            </AnimatePresence>
          </Link>
        );
      })}
    </div>
  );

  return (
    <motion.aside
      initial={{ x: -20, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      className={cn(
        'hidden md:flex flex-col h-screen border-r transition-all duration-300 relative z-50',
        'bg-sidebar border-sidebar-border',
        collapsed ? 'w-[68px]' : 'w-60'
      )}
    >
      {/* Logo */}
      <div className="flex items-center justify-between p-3 border-b border-sidebar-border">
        <Link to="/dashboard" className="flex items-center gap-2.5 min-w-0">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/25 shrink-0">
            <Brain className="w-4.5 h-4.5 text-white" />
          </div>
          <AnimatePresence>
            {!collapsed && (
              <motion.div
                initial={{ opacity: 0, width: 0 }}
                animate={{ opacity: 1, width: 'auto' }}
                exit={{ opacity: 0, width: 0 }}
                className="overflow-hidden"
              >
                <span className="font-display font-bold text-lg gradient-text whitespace-nowrap">
                  MindFlow
                </span>
              </motion.div>
            )}
          </AnimatePresence>
        </Link>
      </div>

      {/* Search */}
      {onSearchClick && (
        <div className="p-2">
          <button
            onClick={onSearchClick}
            className={cn(
              'w-full flex items-center gap-2.5 px-3 py-2 rounded-xl',
              'text-muted-foreground text-sm',
              'bg-white/[0.03] border border-white/[0.06]',
              'hover:bg-white/[0.06] hover:border-white/[0.1] transition-all',
              collapsed && 'justify-center px-2'
            )}
          >
            <Search className="w-4 h-4 shrink-0" />
            {!collapsed && (
              <>
                <span className="flex-1 text-left text-xs">Buscar...</span>
                <kbd className="text-[10px] text-muted-foreground/60 bg-white/5 px-1.5 py-0.5 rounded border border-white/10">
                  ⌘K
                </kbd>
              </>
            )}
          </button>
        </div>
      )}

      {/* Navigation */}
      <nav className="flex-1 p-2 space-y-4 overflow-y-auto scrollbar-thin">
        {renderNavGroup('Workspace', workspaceItems)}
        <div className="h-px bg-sidebar-border mx-2" />
        {renderNavGroup('Views', viewItems)}
        <div className="h-px bg-sidebar-border mx-2" />
        {renderNavGroup('Ferramentas', toolItems)}
      </nav>

      {/* Footer */}
      <div className="p-2 border-t border-sidebar-border space-y-1">
        {/* Collapse toggle */}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className={cn(
            'w-full flex items-center gap-2.5 px-3 py-2 rounded-xl',
            'text-muted-foreground hover:text-foreground hover:bg-white/[0.04] transition-all text-sm',
            collapsed && 'justify-center px-2'
          )}
        >
          {collapsed ? (
            <ChevronsRight className="w-4 h-4" />
          ) : (
            <>
              <ChevronsLeft className="w-4 h-4" />
              <span>Recolher</span>
            </>
          )}
        </button>

        {/* Sign out */}
        <button
          onClick={signOut}
          className={cn(
            'w-full flex items-center gap-2.5 px-3 py-2 rounded-xl',
            'text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-all text-sm',
            collapsed && 'justify-center px-2'
          )}
        >
          <LogOut className="w-4 h-4" />
          {!collapsed && <span>Sair</span>}
        </button>
      </div>
    </motion.aside>
  );
}
