import { Target, Plus, ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Item } from '@/types';

interface GoalsBarProps {
  goals: Item[];
  isDark?: boolean;
}

export default function GoalsBar({ goals, isDark = false }: GoalsBarProps) {
  const navigate = useNavigate();

  if (goals.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className={`relative p-3 rounded-xl border-2 shadow-md ${
          isDark 
            ? 'border-purple-700/50 bg-gradient-to-br from-purple-900/80 to-pink-900/80 shadow-purple-900/30' 
            : 'border-purple-300 bg-gradient-to-br from-purple-100 to-pink-100 shadow-purple-300/40'
        }`}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-lg ${isDark ? 'bg-purple-800/50 text-purple-300' : 'bg-purple-200 text-purple-600'}`}>
              <Target className="w-4 h-4" />
            </div>
            <div>
              <h3 className={`text-sm font-medium ${isDark ? 'text-white' : 'text-gray-800'}`}>🎯 Meus Objetivos</h3>
              <p className={`text-xs ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>Nenhum objetivo definido ainda</p>
            </div>
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate('/goals')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border text-xs font-medium transition-colors ${
              isDark 
                ? 'bg-purple-800/50 border-purple-600/50 text-purple-200 hover:bg-purple-700/50' 
                : 'bg-purple-200 border-purple-300 text-purple-700 hover:bg-purple-300'
            }`}
          >
            <Plus className="w-3 h-3" />
            Adicionar Objetivo
          </motion.button>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`relative p-3 rounded-xl border-2 shadow-md ${
        isDark 
          ? 'border-purple-700/50 bg-gradient-to-br from-purple-900/80 to-pink-900/80 shadow-purple-900/30' 
          : 'border-purple-300 bg-gradient-to-br from-purple-100 to-pink-100 shadow-purple-300/40'
      }`}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-3">
          <div className={`p-1.5 rounded-lg ${isDark ? 'bg-purple-800/50 text-purple-300' : 'bg-purple-200 text-purple-600'}`}>
            <Target className="w-4 h-4" />
          </div>
          <h3 className={`text-sm font-medium ${isDark ? 'text-white' : 'text-gray-800'}`}>🎯 Meus Objetivos</h3>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => navigate('/goals')}
          className={`flex items-center gap-1 px-2 py-1 rounded-lg border text-xs font-medium transition-colors ${
            isDark 
              ? 'bg-purple-800/50 border-purple-600/50 text-purple-200 hover:bg-purple-700/50' 
              : 'bg-purple-200 border-purple-300 text-purple-700 hover:bg-purple-300'
          }`}
        >
          <Plus className="w-3 h-3" />
          Novo
        </motion.button>
      </div>

      {/* Goals List - Horizontal Scroll */}
      <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-thin scrollbar-thumb-purple-300 scrollbar-track-transparent">
        {goals.slice(0, 5).map((goal, index) => (
          <motion.div
            key={goal.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ scale: 1.02, y: -1 }}
            onClick={() => navigate('/goals')}
            className={`flex-shrink-0 min-w-[160px] max-w-[220px] p-2 rounded-lg cursor-pointer
                       border transition-all duration-300 shadow-sm ${
                         isDark 
                           ? 'bg-purple-800/40 hover:bg-purple-800/60 border-purple-600/50 hover:border-purple-500/50' 
                           : 'bg-white hover:bg-purple-50 border-purple-200 hover:border-purple-300'
                       }`}
          >
            <div className="flex items-start justify-between gap-2">
              <div className="flex-1 min-w-0">
                <h4 className={`text-xs font-medium truncate ${isDark ? 'text-white' : 'text-gray-800'}`}>
                  {goal.title}
                </h4>
                {goal.content && (
                  <p className={`text-[10px] mt-0.5 line-clamp-1 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                    {goal.content}
                  </p>
                )}
              </div>
              <div className={`flex-shrink-0 w-2 h-2 rounded-full mt-0.5 ${
                goal.priority === 'high' ? 'bg-red-400' :
                goal.priority === 'medium' ? 'bg-yellow-400' :
                'bg-green-400'
              }`} />
            </div>
          </motion.div>
        ))}

        {goals.length > 5 && (
          <motion.div
            whileHover={{ scale: 1.05 }}
            onClick={() => navigate('/goals')}
            className={`flex-shrink-0 flex items-center justify-center min-w-[80px] p-2 rounded-lg cursor-pointer
                       border transition-all duration-300 ${
                         isDark 
                           ? 'bg-purple-800/30 border-purple-600/50 hover:border-purple-500/50' 
                           : 'bg-purple-100/50 border-purple-200 hover:border-purple-300'
                       }`}
          >
            <span className={`text-xs font-medium ${isDark ? 'text-purple-200' : 'text-purple-700'}`}>
              +{goals.length - 5}
            </span>
            <ChevronRight className={`w-3 h-3 ml-0.5 ${isDark ? 'text-purple-200' : 'text-purple-700'}`} />
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}