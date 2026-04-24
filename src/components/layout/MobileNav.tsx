import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import {
  LayoutDashboard,
  CheckSquare,
  Lightbulb,
  FileText,
  CalendarDays,
  MessageSquare,
} from 'lucide-react';

const navItems = [
  { path: '/', icon: LayoutDashboard, label: 'Home' },
  { path: '/tasks', icon: CheckSquare, label: 'Tarefas' },
  { path: '/ideas', icon: Lightbulb, label: 'Ideias' },
  { path: '/notes', icon: FileText, label: 'Notas' },
  { path: '/events', icon: CalendarDays, label: 'Eventos' },
  { path: '/chat', icon: MessageSquare, label: 'Chat' },
];

export default function MobileNav() {
  const location = useLocation();

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-sidebar/95 backdrop-blur-xl border-t border-sidebar-border z-50">
      <div className="flex items-center justify-around py-1.5 px-2">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path ||
            (item.path === '/' && location.pathname === '/dashboard');
          const Icon = item.icon;

          return (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                'flex flex-col items-center gap-0.5 py-1.5 px-2 rounded-xl transition-all duration-200 min-w-[48px]',
                isActive
                  ? 'text-primary'
                  : 'text-muted-foreground'
              )}
            >
              <div
                className={cn(
                  'p-1.5 rounded-lg transition-all duration-200',
                  isActive && 'bg-primary/15 shadow-sm shadow-primary/20'
                )}
              >
                <Icon className="w-4.5 h-4.5" />
              </div>
              <span className="text-[10px] font-medium leading-tight">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
