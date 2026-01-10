import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
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
  LogOut,
  Menu,
  X,
} from 'lucide-react';
import { useState } from 'react';

const navItems = [
  { path: '/', icon: MessageSquare, label: 'Chat' },
  { path: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { path: '/ideas', icon: Lightbulb, label: 'Ideias' },
  { path: '/tasks', icon: CheckSquare, label: 'Tarefas' },
  { path: '/projects', icon: FolderKanban, label: 'Projetos' },
  { path: '/timeline', icon: Clock, label: 'Timeline' },
  { path: '/mindmap', icon: Network, label: 'Mapa Mental' },
];

export default function Sidebar() {
  const location = useLocation();
  const { signOut } = useAuth();
  const [collapsed, setCollapsed] = useState(false);

  return (
    <motion.aside
      initial={{ x: -20, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      className={cn(
        'hidden md:flex flex-col h-screen bg-sidebar border-r border-sidebar-border transition-all duration-300',
        collapsed ? 'w-20' : 'w-64'
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-sidebar-border">
        <Link to="/" className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-primary flex items-center justify-center">
            <Brain className="w-5 h-5 text-primary-foreground" />
          </div>
          {!collapsed && (
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="font-display font-bold text-xl gradient-text"
            >
              MindFlow
            </motion.span>
          )}
        </Link>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setCollapsed(!collapsed)}
          className="text-sidebar-foreground hover:bg-sidebar-accent"
        >
          {collapsed ? <Menu className="w-5 h-5" /> : <X className="w-5 h-5" />}
        </Button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          const Icon = item.icon;

          return (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200',
                isActive
                  ? 'bg-gradient-primary text-primary-foreground shadow-lg'
                  : 'text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground'
              )}
            >
              <Icon className="w-5 h-5 shrink-0" />
              {!collapsed && (
                <motion.span
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="font-medium"
                >
                  {item.label}
                </motion.span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-sidebar-border">
        <Button
          variant="ghost"
          onClick={signOut}
          className={cn(
            'w-full justify-start gap-3 text-sidebar-foreground hover:bg-sidebar-accent hover:text-destructive',
            collapsed && 'justify-center'
          )}
        >
          <LogOut className="w-5 h-5" />
          {!collapsed && 'Sair'}
        </Button>
      </div>
    </motion.aside>
  );
}
