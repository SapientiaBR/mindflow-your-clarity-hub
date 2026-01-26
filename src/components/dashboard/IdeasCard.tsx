import { motion } from 'framer-motion';
import { Lightbulb } from 'lucide-react';
import DashboardCard from './DashboardCard';
import { Item } from '@/types';

interface IdeasCardProps {
  ideas: Item[];
  ideaCount: number;
}

export default function IdeasCard({ ideas, ideaCount }: IdeasCardProps) {
  return (
    <DashboardCard 
      title="💡 Ideias Ativas" 
      icon={Lightbulb} 
      count={ideaCount}
      gradient="yellow"
      navigateTo="/ideas"
    >
      <div className="space-y-2">
        {ideas.length > 0 ? (
          ideas.slice(0, 3).map((idea, index) => (
            <motion.div 
              key={idea.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 * index }}
              className="p-2 rounded-lg bg-white/60 hover:bg-white/80 transition-colors border border-yellow-100"
            >
              <p className="text-xs text-gray-700 line-clamp-2">
                {idea.content}
              </p>
              <span className="text-xs text-yellow-600 mt-1 inline-block">
                {idea.status === 'raw' ? '💡 Bruta' : idea.status === 'evolving' ? '🌱 Evoluindo' : '🚀 Em progresso'}
              </span>
            </motion.div>
          ))
        ) : (
          <div className="text-center py-4 text-gray-400">
            <Lightbulb className="w-6 h-6 mx-auto mb-2 opacity-50" />
            <p className="text-xs">Capture suas primeiras ideias</p>
          </div>
        )}
      </div>
    </DashboardCard>
  );
}