import { Target, Plus, ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Item } from '@/types';

interface GoalsBarProps {
  goals: Item[];
}

export default function GoalsBar({ goals }: GoalsBarProps) {
  const navigate = useNavigate();

  if (goals.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative mb-6 p-4 rounded-xl border border-purple-500/30 bg-card/50 backdrop-blur-sm"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-purple-500/20">
              <Target className="w-5 h-5 text-purple-400" />
            </div>
            <div>
              <h3 className="text-sm font-medium text-foreground">🎯 Meus Objetivos</h3>
              <p className="text-xs text-muted-foreground">Nenhum objetivo definido ainda</p>
            </div>
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate('/goals')}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-purple-500/20 border border-purple-500/30 text-purple-300 text-sm font-medium hover:bg-purple-500/30 transition-colors"
          >
            <Plus className="w-4 h-4" />
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
      className="relative mb-6 p-4 rounded-xl border border-purple-500/30 bg-card/50 backdrop-blur-sm"
      style={{
        boxShadow: '0 0 20px rgba(139, 92, 246, 0.15), inset 0 1px 0 rgba(255,255,255,0.05)',
      }}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-purple-500/20">
            <Target className="w-5 h-5 text-purple-400" />
          </div>
          <h3 className="text-sm font-medium text-foreground">🎯 Meus Objetivos</h3>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => navigate('/goals')}
          className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-purple-500/20 border border-purple-500/30 text-purple-300 text-xs font-medium hover:bg-purple-500/30 transition-colors"
        >
          <Plus className="w-3 h-3" />
          Novo
        </motion.button>
      </div>

      {/* Goals List - Horizontal Scroll */}
      <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-purple-500/30 scrollbar-track-transparent">
        {goals.slice(0, 5).map((goal, index) => (
          <motion.div
            key={goal.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ scale: 1.02, y: -2 }}
            onClick={() => navigate('/goals')}
            className="flex-shrink-0 min-w-[200px] max-w-[280px] p-3 rounded-lg cursor-pointer
                       bg-gradient-to-br from-purple-500/10 to-transparent
                       border border-purple-500/20 hover:border-purple-500/40
                       transition-all duration-300"
            style={{
              boxShadow: '0 0 15px rgba(139, 92, 246, 0.1)',
            }}
          >
            <div className="flex items-start justify-between gap-2">
              <div className="flex-1 min-w-0">
                <h4 className="text-sm font-medium text-foreground truncate">
                  {goal.title}
                </h4>
                {goal.content && (
                  <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                    {goal.content}
                  </p>
                )}
              </div>
              <div className={`flex-shrink-0 w-2 h-2 rounded-full mt-1.5 ${
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
            className="flex-shrink-0 flex items-center justify-center min-w-[100px] p-3 rounded-lg cursor-pointer
                       bg-purple-500/10 border border-purple-500/20 hover:border-purple-500/40
                       transition-all duration-300"
          >
            <span className="text-xs text-purple-300 font-medium">
              +{goals.length - 5} mais
            </span>
            <ChevronRight className="w-4 h-4 text-purple-300 ml-1" />
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}
