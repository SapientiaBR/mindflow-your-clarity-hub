import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import {
  MessageSquare,
  LayoutDashboard,
  Lightbulb,
  CheckSquare,
  Network,
  CalendarDays,
} from 'lucide-react';

const navItems = [
  { path: '/', icon: MessageSquare, label: 'Chat' },
  { path: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { path: '/ideas', icon: Lightbulb, label: 'Ideias' },
  { path: '/tasks', icon: CheckSquare, label: 'Tarefas' },
  { path: '/events', icon: CalendarDays, label: 'Eventos' },
  { path: '/mindmap', icon: Network, label: 'Mapa' },
];

export default function MobileNav() {
  const location = useLocation();

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-sidebar/95 backdrop-blur-xl border-t border-sidebar-border z-50 safe-area-bottom">
      <div className="flex items-center justify-around py-2 px-4">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          const Icon = item.icon;

          return (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                'flex flex-col items-center gap-1 py-2 px-4 rounded-xl transition-all duration-200',
                isActive
                  ? 'text-primary'
                  : 'text-muted-foreground'
              )}
            >
              <div
                className={cn(
                  'p-2 rounded-xl transition-all duration-200',
                  isActive && 'bg-primary/20'
                )}
              >
                <Icon className="w-5 h-5" />
              </div>
              <span className="text-xs font-medium">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
