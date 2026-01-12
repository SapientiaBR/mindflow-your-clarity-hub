import { ReactNode } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, LucideIcon } from 'lucide-react';
import AnimatedCounter from './AnimatedCounter';

interface DashboardCardProps {
  title: string;
  icon: LucideIcon;
  count: number;
  gradient: 'red' | 'purple' | 'cyan' | 'green' | 'blue' | 'yellow' | 'orange';
  navigateTo: string;
  delay?: number;
  children: ReactNode;
}

const gradientClasses = {
  red: 'from-destructive/20 to-mindflow-orange/20 hover:from-destructive/30 hover:to-mindflow-orange/30',
  purple: 'from-mindflow-purple/20 to-mindflow-pink/20 hover:from-mindflow-purple/30 hover:to-mindflow-pink/30',
  cyan: 'from-mindflow-cyan/20 to-mindflow-blue/20 hover:from-mindflow-cyan/30 hover:to-mindflow-blue/30',
  green: 'from-mindflow-green/20 to-accent/20 hover:from-mindflow-green/30 hover:to-accent/30',
  blue: 'from-mindflow-blue/20 to-mindflow-cyan/20 hover:from-mindflow-blue/30 hover:to-mindflow-cyan/30',
  yellow: 'from-mindflow-yellow/20 to-amber-500/20 hover:from-mindflow-yellow/30 hover:to-amber-500/30',
  orange: 'from-mindflow-orange/20 to-amber-500/20 hover:from-mindflow-orange/30 hover:to-amber-500/30',
};

const glowClasses = {
  red: 'hover:shadow-[0_0_60px_-15px_hsl(var(--destructive)/0.5)]',
  purple: 'hover:shadow-[0_0_60px_-15px_hsl(var(--mindflow-purple)/0.5)]',
  cyan: 'hover:shadow-[0_0_60px_-15px_hsl(var(--mindflow-cyan)/0.5)]',
  green: 'hover:shadow-[0_0_60px_-15px_hsl(var(--mindflow-green)/0.5)]',
  blue: 'hover:shadow-[0_0_60px_-15px_hsl(var(--mindflow-blue)/0.5)]',
  yellow: 'hover:shadow-[0_0_60px_-15px_hsl(var(--mindflow-yellow)/0.5)]',
  orange: 'hover:shadow-[0_0_60px_-15px_hsl(var(--mindflow-orange)/0.5)]',
};

const iconColors = {
  red: 'text-destructive',
  purple: 'text-mindflow-purple',
  cyan: 'text-mindflow-cyan',
  green: 'text-mindflow-green',
  blue: 'text-mindflow-blue',
  yellow: 'text-mindflow-yellow',
  orange: 'text-mindflow-orange',
};

const borderGradients = {
  red: 'before:bg-gradient-to-r before:from-destructive before:to-mindflow-orange',
  purple: 'before:bg-gradient-to-r before:from-mindflow-purple before:to-mindflow-pink',
  cyan: 'before:bg-gradient-to-r before:from-mindflow-cyan before:to-mindflow-blue',
  green: 'before:bg-gradient-to-r before:from-mindflow-green before:to-accent',
  blue: 'before:bg-gradient-to-r before:from-mindflow-blue before:to-mindflow-cyan',
  yellow: 'before:bg-gradient-to-r before:from-mindflow-yellow before:to-amber-500',
  orange: 'before:bg-gradient-to-r before:from-mindflow-orange before:to-amber-500',
};

export default function DashboardCard({
  title,
  icon: Icon,
  count,
  gradient,
  navigateTo,
  delay = 0,
  children,
}: DashboardCardProps) {
  const navigate = useNavigate();

  return (
    <motion.div
      initial={{ opacity: 0, y: 30, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ delay, duration: 0.5, type: 'spring', stiffness: 100 }}
      whileHover={{ scale: 1.02, y: -5 }}
      whileTap={{ scale: 0.98 }}
      onClick={() => navigate(navigateTo)}
      className={`
        relative overflow-hidden cursor-pointer
        bg-gradient-to-br ${gradientClasses[gradient]}
        backdrop-blur-xl rounded-2xl p-5
        border border-white/10
        transition-all duration-300
        ${glowClasses[gradient]}
        group
      `}
    >
      {/* Animated gradient border */}
      <div
        className={`
          absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500
          before:absolute before:inset-0 before:rounded-2xl before:p-[1px]
          ${borderGradients[gradient]}
          before:animate-gradient-rotate
          before:-z-10
        `}
      />

      {/* Pulse effect on hover */}
      <div className="absolute inset-0 rounded-2xl bg-white/5 opacity-0 group-hover:opacity-100 group-hover:animate-pulse-fast transition-opacity" />

      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <motion.div
            className={`p-2.5 rounded-xl bg-background/50 ${iconColors[gradient]}`}
            whileHover={{ rotate: [0, -10, 10, 0] }}
            transition={{ duration: 0.5 }}
          >
            <Icon className="w-5 h-5" />
          </motion.div>
          <div>
            <h2 className="font-display font-semibold text-lg">{title}</h2>
            <div className="flex items-center gap-1 text-sm text-muted-foreground">
              <AnimatedCounter value={count} className="font-bold text-foreground" />
              <span>itens</span>
            </div>
          </div>
        </div>
        
        <motion.div
          className="flex items-center gap-1 text-xs text-muted-foreground group-hover:text-foreground transition-colors"
          initial={{ x: 0 }}
          whileHover={{ x: 5 }}
        >
          <span className="hidden sm:inline">Ver todos</span>
          <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
        </motion.div>
      </div>

      {/* Content */}
      <div className="space-y-2 relative z-10">
        {children}
      </div>

      {/* Decorative elements */}
      <div className="absolute -bottom-10 -right-10 w-32 h-32 rounded-full bg-gradient-to-br from-white/5 to-transparent blur-2xl group-hover:scale-150 transition-transform duration-700" />
    </motion.div>
  );
}
