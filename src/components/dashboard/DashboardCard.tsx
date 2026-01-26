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
  red: 'from-red-50 to-orange-50 hover:from-red-100 hover:to-orange-100',
  purple: 'from-purple-50 to-pink-50 hover:from-purple-100 hover:to-pink-100',
  cyan: 'from-cyan-50 to-blue-50 hover:from-cyan-100 hover:to-blue-100',
  green: 'from-green-50 to-emerald-50 hover:from-green-100 hover:to-emerald-100',
  blue: 'from-blue-50 to-cyan-50 hover:from-blue-100 hover:to-cyan-100',
  yellow: 'from-yellow-50 to-amber-50 hover:from-yellow-100 hover:to-amber-100',
  orange: 'from-orange-50 to-amber-50 hover:from-orange-100 hover:to-amber-100',
};

const shadowClasses = {
  red: 'shadow-lg shadow-red-200/50 hover:shadow-xl hover:shadow-red-300/50',
  purple: 'shadow-lg shadow-purple-200/50 hover:shadow-xl hover:shadow-purple-300/50',
  cyan: 'shadow-lg shadow-cyan-200/50 hover:shadow-xl hover:shadow-cyan-300/50',
  green: 'shadow-lg shadow-green-200/50 hover:shadow-xl hover:shadow-green-300/50',
  blue: 'shadow-lg shadow-blue-200/50 hover:shadow-xl hover:shadow-blue-300/50',
  yellow: 'shadow-lg shadow-yellow-200/50 hover:shadow-xl hover:shadow-yellow-300/50',
  orange: 'shadow-lg shadow-orange-200/50 hover:shadow-xl hover:shadow-orange-300/50',
};

const iconColors = {
  red: 'text-red-600',
  purple: 'text-purple-600',
  cyan: 'text-cyan-600',
  green: 'text-green-600',
  blue: 'text-blue-600',
  yellow: 'text-yellow-600',
  orange: 'text-orange-600',
};

const iconBgColors = {
  red: 'bg-red-100',
  purple: 'bg-purple-100',
  cyan: 'bg-cyan-100',
  green: 'bg-green-100',
  blue: 'bg-blue-100',
  yellow: 'bg-yellow-100',
  orange: 'bg-orange-100',
};

const borderColors = {
  red: 'border-red-200',
  purple: 'border-purple-200',
  cyan: 'border-cyan-200',
  green: 'border-green-200',
  blue: 'border-blue-200',
  yellow: 'border-yellow-200',
  orange: 'border-orange-200',
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
      whileHover={{ scale: 1.02, y: -3 }}
      whileTap={{ scale: 0.98 }}
      onClick={() => navigate(navigateTo)}
      className={`
        relative overflow-hidden cursor-pointer h-full flex flex-col
        bg-gradient-to-br ${gradientClasses[gradient]}
        rounded-2xl p-4
        border ${borderColors[gradient]}
        transition-all duration-300
        ${shadowClasses[gradient]}
        group
      `}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-3 shrink-0">
        <div className="flex items-center gap-3">
          <motion.div
            className={`p-2 rounded-xl ${iconBgColors[gradient]} ${iconColors[gradient]}`}
            whileHover={{ rotate: [0, -10, 10, 0] }}
            transition={{ duration: 0.5 }}
          >
            <Icon className="w-5 h-5" />
          </motion.div>
          <div>
            <h2 className="font-display font-semibold text-base text-gray-800">{title}</h2>
            <div className="flex items-center gap-1 text-xs text-gray-500">
              <AnimatedCounter value={count} className="font-bold text-gray-700" />
              <span>itens</span>
            </div>
          </div>
        </div>
        
        <motion.div
          className="flex items-center gap-1 text-xs text-gray-400 group-hover:text-gray-600 transition-colors"
          initial={{ x: 0 }}
          whileHover={{ x: 5 }}
        >
          <span className="hidden sm:inline">Ver todos</span>
          <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
        </motion.div>
      </div>

      {/* Content - Scrollable if needed */}
      <div className="flex-1 min-h-0 overflow-hidden space-y-2 relative z-10">
        {children}
      </div>

      {/* Decorative elements */}
      <div className="absolute -bottom-10 -right-10 w-32 h-32 rounded-full bg-white/30 blur-2xl group-hover:scale-150 transition-transform duration-700" />
    </motion.div>
  );
}