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
  isDark?: boolean;
}

// Light theme - solid vibrant colors
const lightGradientClasses = {
  red: 'bg-gradient-to-br from-red-100 to-orange-100',
  purple: 'bg-gradient-to-br from-purple-100 to-pink-100',
  cyan: 'bg-gradient-to-br from-cyan-100 to-blue-100',
  green: 'bg-gradient-to-br from-green-100 to-emerald-100',
  blue: 'bg-gradient-to-br from-blue-100 to-cyan-100',
  yellow: 'bg-gradient-to-br from-yellow-100 to-amber-100',
  orange: 'bg-gradient-to-br from-orange-100 to-amber-100',
};

// Dark theme - rich dark colors
const darkGradientClasses = {
  red: 'bg-gradient-to-br from-red-900/80 to-orange-900/80',
  purple: 'bg-gradient-to-br from-purple-900/80 to-pink-900/80',
  cyan: 'bg-gradient-to-br from-cyan-900/80 to-blue-900/80',
  green: 'bg-gradient-to-br from-green-900/80 to-emerald-900/80',
  blue: 'bg-gradient-to-br from-blue-900/80 to-cyan-900/80',
  yellow: 'bg-gradient-to-br from-yellow-900/80 to-amber-900/80',
  orange: 'bg-gradient-to-br from-orange-900/80 to-amber-900/80',
};

const lightShadowClasses = {
  red: 'shadow-lg shadow-red-300/60 hover:shadow-xl hover:shadow-red-400/60',
  purple: 'shadow-lg shadow-purple-300/60 hover:shadow-xl hover:shadow-purple-400/60',
  cyan: 'shadow-lg shadow-cyan-300/60 hover:shadow-xl hover:shadow-cyan-400/60',
  green: 'shadow-lg shadow-green-300/60 hover:shadow-xl hover:shadow-green-400/60',
  blue: 'shadow-lg shadow-blue-300/60 hover:shadow-xl hover:shadow-blue-400/60',
  yellow: 'shadow-lg shadow-yellow-300/60 hover:shadow-xl hover:shadow-yellow-400/60',
  orange: 'shadow-lg shadow-orange-300/60 hover:shadow-xl hover:shadow-orange-400/60',
};

const darkShadowClasses = {
  red: 'shadow-lg shadow-red-900/50 hover:shadow-xl hover:shadow-red-800/50',
  purple: 'shadow-lg shadow-purple-900/50 hover:shadow-xl hover:shadow-purple-800/50',
  cyan: 'shadow-lg shadow-cyan-900/50 hover:shadow-xl hover:shadow-cyan-800/50',
  green: 'shadow-lg shadow-green-900/50 hover:shadow-xl hover:shadow-green-800/50',
  blue: 'shadow-lg shadow-blue-900/50 hover:shadow-xl hover:shadow-blue-800/50',
  yellow: 'shadow-lg shadow-yellow-900/50 hover:shadow-xl hover:shadow-yellow-800/50',
  orange: 'shadow-lg shadow-orange-900/50 hover:shadow-xl hover:shadow-orange-800/50',
};

const lightIconColors = {
  red: 'text-red-600 bg-red-200',
  purple: 'text-purple-600 bg-purple-200',
  cyan: 'text-cyan-600 bg-cyan-200',
  green: 'text-green-600 bg-green-200',
  blue: 'text-blue-600 bg-blue-200',
  yellow: 'text-yellow-600 bg-yellow-200',
  orange: 'text-orange-600 bg-orange-200',
};

const darkIconColors = {
  red: 'text-red-300 bg-red-800/50',
  purple: 'text-purple-300 bg-purple-800/50',
  cyan: 'text-cyan-300 bg-cyan-800/50',
  green: 'text-green-300 bg-green-800/50',
  blue: 'text-blue-300 bg-blue-800/50',
  yellow: 'text-yellow-300 bg-yellow-800/50',
  orange: 'text-orange-300 bg-orange-800/50',
};

const lightBorderColors = {
  red: 'border-red-300',
  purple: 'border-purple-300',
  cyan: 'border-cyan-300',
  green: 'border-green-300',
  blue: 'border-blue-300',
  yellow: 'border-yellow-300',
  orange: 'border-orange-300',
};

const darkBorderColors = {
  red: 'border-red-700/50',
  purple: 'border-purple-700/50',
  cyan: 'border-cyan-700/50',
  green: 'border-green-700/50',
  blue: 'border-blue-700/50',
  yellow: 'border-yellow-700/50',
  orange: 'border-orange-700/50',
};

export default function DashboardCard({
  title,
  icon: Icon,
  count,
  gradient,
  navigateTo,
  delay = 0,
  children,
  isDark = false,
}: DashboardCardProps) {
  const navigate = useNavigate();

  const gradientClasses = isDark ? darkGradientClasses : lightGradientClasses;
  const shadowClasses = isDark ? darkShadowClasses : lightShadowClasses;
  const iconColors = isDark ? darkIconColors : lightIconColors;
  const borderColors = isDark ? darkBorderColors : lightBorderColors;

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
        ${gradientClasses[gradient]}
        rounded-2xl p-4
        border-2 ${borderColors[gradient]}
        transition-all duration-300
        ${shadowClasses[gradient]}
        group
      `}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-3 shrink-0">
        <div className="flex items-center gap-3">
          <motion.div
            className={`p-2 rounded-xl ${iconColors[gradient]}`}
            whileHover={{ rotate: [0, -10, 10, 0] }}
            transition={{ duration: 0.5 }}
          >
            <Icon className="w-5 h-5" />
          </motion.div>
          <div>
            <h2 className={`font-display font-semibold text-base ${isDark ? 'text-white' : 'text-gray-800'}`}>{title}</h2>
            <div className={`flex items-center gap-1 text-xs ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
              <AnimatedCounter value={count} className={`font-bold ${isDark ? 'text-white' : 'text-gray-800'}`} />
              <span>itens</span>
            </div>
          </div>
        </div>
        
        <motion.div
          className={`flex items-center gap-1 text-xs ${isDark ? 'text-gray-400 group-hover:text-white' : 'text-gray-500 group-hover:text-gray-700'} transition-colors`}
          initial={{ x: 0 }}
          whileHover={{ x: 5 }}
        >
          <span className="hidden sm:inline">Ver todos</span>
          <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
        </motion.div>
      </div>

      {/* Content - Scrollable if needed */}
      <div className="flex-1 min-h-0 overflow-y-auto space-y-2 relative z-10">
        {children}
      </div>

      {/* Decorative elements */}
      <div className={`absolute -bottom-10 -right-10 w-32 h-32 rounded-full ${isDark ? 'bg-white/10' : 'bg-white/50'} blur-2xl group-hover:scale-150 transition-transform duration-700`} />
    </motion.div>
  );
}