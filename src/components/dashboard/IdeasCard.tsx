import { motion } from 'framer-motion';
import { Lightbulb } from 'lucide-react';
import DashboardCard from './DashboardCard';
import { Item } from '@/types';

interface IdeasCardProps {
  ideas: Item[];
  ideaCount: number;
  isDark?: boolean;
}

export default function IdeasCard({ ideas, ideaCount, isDark = false }: IdeasCardProps) {
  // Show more ideas to fill the card - up to 6
  const displayIdeas = ideas.slice(0, 6);
  
  return (
    <DashboardCard 
      title="💡 Ideias Ativas" 
      icon={Lightbulb} 
      count={ideaCount}
      gradient="yellow"
      navigateTo="/ideas"
      isDark={isDark}
    >
      <div className="space-y-2">
        {displayIdeas.length > 0 ? (
          displayIdeas.map((idea, index) => (
            <motion.div 
              key={idea.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.05 * index }}
              className={`p-2 rounded-lg transition-colors ${
                isDark 
                  ? 'bg-yellow-800/40 hover:bg-yellow-800/60 border border-yellow-700/50' 
                  : 'bg-white hover:bg-yellow-50 border border-yellow-200'
              }`}
            >
              <p className={`text-xs line-clamp-2 ${isDark ? 'text-gray-100' : 'text-gray-700'}`}>
                {idea.content}
              </p>
              <span className={`text-xs mt-1 inline-block ${isDark ? 'text-yellow-300' : 'text-yellow-600'}`}>
                {idea.status === 'raw' ? '💡 Bruta' : idea.status === 'evolving' ? '🌱 Evoluindo' : '🚀 Em progresso'}
              </span>
            </motion.div>
          ))
        ) : (
          <div className={`text-center py-4 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
            <Lightbulb className="w-6 h-6 mx-auto mb-2 opacity-50" />
            <p className="text-xs">Capture suas primeiras ideias</p>
          </div>
        )}
      </div>
    </DashboardCard>
  );
}