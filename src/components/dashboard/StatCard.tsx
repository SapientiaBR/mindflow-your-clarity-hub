import { motion } from 'framer-motion';
import { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StatCardProps {
  icon: LucideIcon;
  value: number;
  label: string;
  trend?: number;
  color: 'cyan' | 'magenta' | 'purple' | 'green' | 'orange' | 'yellow';
  delay?: number;
  isDark?: boolean;
}

const lightColorClasses = {
  cyan: {
    bg: 'bg-gradient-to-br from-cyan-100 to-blue-100',
    border: 'border-cyan-300',
    shadow: 'shadow-cyan-300/60',
    text: 'text-cyan-600',
    iconBg: 'bg-cyan-200',
  },
  magenta: {
    bg: 'bg-gradient-to-br from-pink-100 to-rose-100',
    border: 'border-pink-300',
    shadow: 'shadow-pink-300/60',
    text: 'text-pink-600',
    iconBg: 'bg-pink-200',
  },
  purple: {
    bg: 'bg-gradient-to-br from-purple-100 to-violet-100',
    border: 'border-purple-300',
    shadow: 'shadow-purple-300/60',
    text: 'text-purple-600',
    iconBg: 'bg-purple-200',
  },
  green: {
    bg: 'bg-gradient-to-br from-green-100 to-emerald-100',
    border: 'border-green-300',
    shadow: 'shadow-green-300/60',
    text: 'text-green-600',
    iconBg: 'bg-green-200',
  },
  orange: {
    bg: 'bg-gradient-to-br from-orange-100 to-amber-100',
    border: 'border-orange-300',
    shadow: 'shadow-orange-300/60',
    text: 'text-orange-600',
    iconBg: 'bg-orange-200',
  },
  yellow: {
    bg: 'bg-gradient-to-br from-yellow-100 to-amber-100',
    border: 'border-yellow-300',
    shadow: 'shadow-yellow-300/60',
    text: 'text-yellow-600',
    iconBg: 'bg-yellow-200',
  },
};

const darkColorClasses = {
  cyan: {
    bg: 'bg-gradient-to-br from-cyan-900/80 to-blue-900/80',
    border: 'border-cyan-700/50',
    shadow: 'shadow-cyan-900/50',
    text: 'text-cyan-300',
    iconBg: 'bg-cyan-800/50',
  },
  magenta: {
    bg: 'bg-gradient-to-br from-pink-900/80 to-rose-900/80',
    border: 'border-pink-700/50',
    shadow: 'shadow-pink-900/50',
    text: 'text-pink-300',
    iconBg: 'bg-pink-800/50',
  },
  purple: {
    bg: 'bg-gradient-to-br from-purple-900/80 to-violet-900/80',
    border: 'border-purple-700/50',
    shadow: 'shadow-purple-900/50',
    text: 'text-purple-300',
    iconBg: 'bg-purple-800/50',
  },
  green: {
    bg: 'bg-gradient-to-br from-green-900/80 to-emerald-900/80',
    border: 'border-green-700/50',
    shadow: 'shadow-green-900/50',
    text: 'text-green-300',
    iconBg: 'bg-green-800/50',
  },
  orange: {
    bg: 'bg-gradient-to-br from-orange-900/80 to-amber-900/80',
    border: 'border-orange-700/50',
    shadow: 'shadow-orange-900/50',
    text: 'text-orange-300',
    iconBg: 'bg-orange-800/50',
  },
  yellow: {
    bg: 'bg-gradient-to-br from-yellow-900/80 to-amber-900/80',
    border: 'border-yellow-700/50',
    shadow: 'shadow-yellow-900/50',
    text: 'text-yellow-300',
    iconBg: 'bg-yellow-800/50',
  },
};

export default function StatCard({ icon: Icon, value, label, trend, color, delay = 0, isDark = false }: StatCardProps) {
  const colorClasses = isDark ? darkColorClasses : lightColorClasses;
  const colors = colorClasses[color];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.5, delay }}
      whileHover={{ scale: 1.02, y: -2 }}
      className={cn(
        'relative p-3 rounded-xl border-2',
        'transition-all duration-300',
        colors.bg,
        colors.border,
        `shadow-lg ${colors.shadow} hover:shadow-xl`
      )}
    >
      <div className="relative flex items-start justify-between">
        <div className="flex-1">
          <motion.div
            className={cn('text-2xl font-bold font-display', colors.text)}
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: delay + 0.2 }}
          >
            {value}
          </motion.div>
          <p className={cn('text-[10px] mt-0.5 uppercase tracking-wider leading-tight', isDark ? 'text-gray-300' : 'text-gray-600')}>
            {label}
          </p>
        </div>

        <div className={cn('p-1.5 rounded-lg', colors.iconBg)}>
          <Icon className={cn('w-4 h-4', colors.text)} />
        </div>
      </div>

      {trend !== undefined && (
        <motion.div 
          className="mt-2 flex items-center gap-1"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: delay + 0.4 }}
        >
          <span className={cn(
            'text-[10px] font-medium',
            trend >= 0 ? 'text-green-600' : 'text-red-600'
          )}>
            {trend >= 0 ? '↑' : '↓'} {Math.abs(trend)}%
          </span>
          <span className={cn('text-[10px]', isDark ? 'text-gray-400' : 'text-gray-500')}>vs última semana</span>
        </motion.div>
      )}
    </motion.div>
  );
}