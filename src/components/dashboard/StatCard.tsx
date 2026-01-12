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
    glow: 'shadow-[0_0_30px_rgba(0,255,255,0.3)]',
    border: 'border-cyan-500/30',
    text: 'text-cyan-400',
    bg: 'bg-cyan-500/10',
    iconBg: 'bg-cyan-500/20',
  },
  magenta: {
    glow: 'shadow-[0_0_30px_rgba(255,0,255,0.3)]',
    border: 'border-pink-500/30',
    text: 'text-pink-400',
    bg: 'bg-pink-500/10',
    iconBg: 'bg-pink-500/20',
  },
  purple: {
    glow: 'shadow-[0_0_30px_rgba(139,92,246,0.3)]',
    border: 'border-purple-500/30',
    text: 'text-purple-400',
    bg: 'bg-purple-500/10',
    iconBg: 'bg-purple-500/20',
  },
  green: {
    glow: 'shadow-[0_0_30px_rgba(16,185,129,0.3)]',
    border: 'border-emerald-500/30',
    text: 'text-emerald-400',
    bg: 'bg-emerald-500/10',
    iconBg: 'bg-emerald-500/20',
  },
  orange: {
    glow: 'shadow-[0_0_30px_rgba(249,115,22,0.3)]',
    border: 'border-orange-500/30',
    text: 'text-orange-400',
    bg: 'bg-orange-500/10',
    iconBg: 'bg-orange-500/20',
  },
  yellow: {
    glow: 'shadow-[0_0_30px_rgba(250,204,21,0.3)]',
    border: 'border-yellow-500/30',
    text: 'text-yellow-400',
    bg: 'bg-yellow-500/10',
    iconBg: 'bg-yellow-500/20',
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
        'relative p-4 rounded-xl border backdrop-blur-xl',
        'bg-black/40 hover:bg-black/50 transition-all duration-300',
        colors.border,
        colors.glow
      )}
    >
      {/* Animated border gradient */}
      <div className="absolute inset-0 rounded-xl opacity-50 overflow-hidden">
        <div 
          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent"
          style={{
            animation: 'shimmer 3s linear infinite',
          }}
        />
      </div>

      <div className="relative flex items-start justify-between">
        <div className="flex-1">
          <motion.div
            className={cn('text-3xl font-bold font-display', colors.text)}
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: delay + 0.2 }}
            style={{
              textShadow: color === 'cyan' ? '0 0 20px rgba(0,255,255,0.5)' :
                         color === 'magenta' ? '0 0 20px rgba(255,0,255,0.5)' :
                         color === 'purple' ? '0 0 20px rgba(139,92,246,0.5)' :
                         color === 'green' ? '0 0 20px rgba(16,185,129,0.5)' :
                         color === 'yellow' ? '0 0 20px rgba(250,204,21,0.5)' :
                         '0 0 20px rgba(249,115,22,0.5)'
            }}
          >
            {value}
          </motion.div>
          <p className="text-xs text-muted-foreground mt-1 uppercase tracking-wider">
            {label}
          </p>
        </div>

        <div className={cn('p-2 rounded-lg', colors.iconBg)}>
          <Icon className={cn('w-5 h-5', colors.text)} />
        </div>
      </div>

      {trend !== undefined && (
        <motion.div 
          className="mt-3 flex items-center gap-1"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: delay + 0.4 }}
        >
          <span className={cn(
            'text-xs font-medium',
            trend >= 0 ? 'text-emerald-400' : 'text-red-400'
          )}>
            {trend >= 0 ? '↑' : '↓'} {Math.abs(trend)}%
          </span>
          <span className="text-xs text-muted-foreground">vs última semana</span>
        </motion.div>
      )}

      {/* Corner accent */}
      <div className={cn(
        'absolute top-0 right-0 w-16 h-16 opacity-20',
        'bg-gradient-to-bl from-current to-transparent rounded-tr-xl'
      )} style={{ color: color === 'cyan' ? '#00FFFF' : color === 'magenta' ? '#FF00FF' : color === 'purple' ? '#8B5CF6' : color === 'green' ? '#10B981' : color === 'yellow' ? '#FACC15' : '#F97316' }} />
    </motion.div>
  );
}
