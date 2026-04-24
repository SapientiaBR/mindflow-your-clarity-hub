import { Target, Plus, ChevronRight, Star } from 'lucide-react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Item } from '@/types';
import { cn } from '@/lib/utils';

interface GoalsBarProps {
  goals: Item[];
  isDark?: boolean;
}

// SVG circular progress ring
function ProgressRing({ progress, size = 48, strokeWidth = 3, className }: {
  progress: number;
  size?: number;
  strokeWidth?: number;
  className?: string;
}) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (progress / 100) * circumference;

  return (
    <svg width={size} height={size} className={cn('transform -rotate-90', className)}>
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        stroke="currentColor"
        strokeWidth={strokeWidth}
        className="text-white/10"
      />
      <motion.circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        className="stroke-purple-500"
        initial={{ strokeDashoffset: circumference }}
        animate={{ strokeDashoffset: offset }}
        transition={{ duration: 1, ease: 'easeOut' }}
        style={{ strokeDasharray: circumference }}
      />
    </svg>
  );
}

const statusConfig: Record<string, { label: string; color: string; ring: string }> = {
  active: { label: '🎯 Ativo', color: 'text-purple-400', ring: 'stroke-purple-500' },
  in_progress: { label: '🚀 Em progresso', color: 'text-blue-400', ring: 'stroke-blue-500' },
  completed: { label: '🏆 Alcançado', color: 'text-emerald-400', ring: 'stroke-emerald-500' },
  archived: { label: '📦 Arquivado', color: 'text-gray-400', ring: 'stroke-gray-500' },
};

export default function GoalsBar({ goals, isDark = false }: GoalsBarProps) {
  const navigate = useNavigate();

  if (goals.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className={`relative p-4 rounded-xl border-2 shadow-md flex items-center justify-between ${
          isDark 
            ? 'border-purple-700/50 bg-gradient-to-br from-purple-900/40 to-pink-900/20 shadow-purple-900/30' 
            : 'border-purple-300 bg-gradient-to-br from-purple-100 to-pink-50 shadow-purple-300/40'
        }`}
      >
        <div className="flex items-center gap-3">
          <div className={`p-3 rounded-xl ${isDark ? 'bg-purple-800/50 text-purple-300' : 'bg-purple-200 text-purple-600'}`}>
            <Target className="w-6 h-6" />
          </div>
          <div>
            <h3 className={`text-lg font-bold font-display ${isDark ? 'text-white' : 'text-gray-800'}`}>🎯 Qual seu próximo grande objetivo?</h3>
            <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Defina metas para manter o foco.</p>
          </div>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => navigate('/goals')}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-purple-500 to-pink-500 text-white font-medium shadow-lg hover:shadow-xl transition-all"
        >
          <Plus className="w-4 h-4" />
          Criar Meta
        </motion.button>
      </motion.div>
    );
  }

  // Active goals first
  const activeGoals = goals.filter(g => g.status !== 'archived').sort((a, b) => {
    if (a.status === 'in_progress' && b.status !== 'in_progress') return -1;
    if (b.status === 'in_progress' && a.status !== 'in_progress') return 1;
    return 0;
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`relative p-4 rounded-xl border-2 shadow-md flex flex-col gap-3 ${
        isDark 
          ? 'border-purple-700/50 bg-gradient-to-br from-purple-900/20 to-pink-900/10 shadow-purple-900/30' 
          : 'border-purple-300 bg-gradient-to-br from-purple-50 to-pink-50 shadow-purple-300/40'
      }`}
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Target className={`w-5 h-5 ${isDark ? 'text-purple-400' : 'text-purple-600'}`} />
          <h3 className={`font-display font-bold text-lg ${isDark ? 'text-white' : 'text-gray-800'}`}>
            Foco Principal
          </h3>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => navigate('/goals')}
          className={`flex items-center gap-1 px-3 py-1.5 rounded-lg border text-xs font-medium transition-colors ${
            isDark 
              ? 'bg-purple-800/50 border-purple-600/50 text-purple-200 hover:bg-purple-700/50' 
              : 'bg-purple-200 border-purple-300 text-purple-700 hover:bg-purple-300'
          }`}
        >
          Ver todas <ChevronRight className="w-3 h-3" />
        </motion.button>
      </div>

      {/* Goals List */}
      <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-purple-500/50 scrollbar-track-transparent snap-x">
        {activeGoals.slice(0, 4).map((goal, index) => {
          const progress = goal.status === 'completed' ? 100
            : goal.status === 'in_progress' ? 60
            : goal.status === 'active' ? 25
            : 0;
          
          const status = statusConfig[goal.status] || statusConfig.active;

          return (
            <motion.div
              key={goal.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.02, y: -2 }}
              onClick={() => navigate('/goals')}
              className={`snap-start flex-shrink-0 w-[260px] p-3 rounded-xl cursor-pointer border-l-4 transition-all duration-300 shadow-sm relative overflow-hidden group ${
                isDark 
                  ? 'bg-card/80 hover:bg-card border-l-purple-500 border-t border-r border-b border-white/5' 
                  : 'bg-white hover:bg-purple-50/50 border-l-purple-500 border-t border-r border-b border-purple-100'
              }`}
            >
              {/* Subtle background glow on hover */}
              <div className="absolute inset-0 bg-gradient-to-r from-purple-500/0 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity" />

              {goal.is_important && (
                <Star className="absolute top-2 right-2 w-4 h-4 text-yellow-400 fill-yellow-400 z-10" />
              )}

              <div className="flex items-center gap-3 relative z-10">
                <div className="relative shrink-0">
                  <ProgressRing progress={progress} size={46} strokeWidth={4} />
                  <span className={`absolute inset-0 flex items-center justify-center text-[10px] font-bold ${isDark ? 'text-white' : 'text-gray-800'}`}>
                    {progress}%
                  </span>
                </div>
                
                <div className="flex-1 min-w-0">
                  <h4 className={`text-sm font-semibold truncate ${isDark ? 'text-white' : 'text-gray-800'}`} title={goal.title || ''}>
                    {goal.title || 'Sem título'}
                  </h4>
                  <span className={cn('text-[10px] px-2 py-0.5 rounded-full inline-block mt-1 bg-current/10', status.color)}>
                    {status.label}
                  </span>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
}