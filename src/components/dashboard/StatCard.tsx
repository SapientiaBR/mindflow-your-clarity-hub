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
}

const colorClasses = {
  cyan: {
    bg: 'bg-gradient-to-br from-cyan-50 to-blue-50',
    border: 'border-cyan-200',
    shadow: 'shadow-cyan-200/50',
    text: 'text-cyan-600',
    iconBg: 'bg-cyan-100',
  },
  magenta: {
    bg: 'bg-gradient-to-br from-pink-50 to-rose-50',
    border: 'border-pink-200',
    shadow: 'shadow-pink-200/50',
    text: 'text-pink-600',
    iconBg: 'bg-pink-100',
  },
  purple: {
    bg: 'bg-gradient-to-br from-purple-50 to-violet-50',
    border: 'border-purple-200',
    shadow: 'shadow-purple-200/50',
    text: 'text-purple-600',
    iconBg: 'bg-purple-100',
  },
  green: {
    bg: 'bg-gradient-to-br from-green-50 to-emerald-50',
    border: 'border-green-200',
    shadow: 'shadow-green-200/50',
    text: 'text-green-600',
    iconBg: 'bg-green-100',
  },
  orange: {
    bg: 'bg-gradient-to-br from-orange-50 to-amber-50',
    border: 'border-orange-200',
    shadow: 'shadow-orange-200/50',
    text: 'text-orange-600',
    iconBg: 'bg-orange-100',
  },
  yellow: {
    bg: 'bg-gradient-to-br from-yellow-50 to-amber-50',
    border: 'border-yellow-200',
    shadow: 'shadow-yellow-200/50',
    text: 'text-yellow-600',
    iconBg: 'bg-yellow-100',
  },
};

export default function StatCard({ icon: Icon, value, label, trend, color, delay = 0 }: StatCardProps) {
  const colors = colorClasses[color];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.5, delay }}
      whileHover={{ scale: 1.02, y: -2 }}
      className={cn(
        'relative p-3 rounded-xl border',
        'transition-all duration-300',
        colors.bg,
        colors.border,
        `shadow-md ${colors.shadow} hover:shadow-lg`
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
          <p className="text-[10px] text-gray-500 mt-0.5 uppercase tracking-wider leading-tight">
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
          <span className="text-[10px] text-gray-400">vs última semana</span>
        </motion.div>
      )}
    </motion.div>
  );
}