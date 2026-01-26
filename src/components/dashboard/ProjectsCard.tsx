import { motion } from 'framer-motion';
import { FolderKanban } from 'lucide-react';
import DashboardCard from './DashboardCard';
import { Item } from '@/types';

interface ProjectsCardProps {
  projects: Item[];
  projectCount: number;
  isDark?: boolean;
}

export default function ProjectsCard({ projects, projectCount, isDark = false }: ProjectsCardProps) {
  // Show more projects to fill the card - up to 6
  const displayProjects = projects.slice(0, 6);
  
  return (
    <DashboardCard 
      title="📁 Projetos" 
      icon={FolderKanban} 
      count={projectCount}
      gradient="cyan"
      navigateTo="/projects"
      isDark={isDark}
    >
      <div className="space-y-2">
        {displayProjects.length > 0 ? (
          displayProjects.map((project, index) => (
            <motion.div 
              key={project.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.05 * index }}
              className={`p-2 rounded-lg transition-colors ${
                isDark 
                  ? 'bg-cyan-800/40 hover:bg-cyan-800/60 border border-cyan-700/50' 
                  : 'bg-white hover:bg-cyan-50 border border-cyan-200'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className={`text-xs font-medium truncate ${isDark ? 'text-gray-100' : 'text-gray-700'}`}>
                  {project.title || project.content}
                </span>
                <span className={`text-xs font-medium ${isDark ? 'text-cyan-300' : 'text-cyan-600'}`}>
                  {project.progress || 0}%
                </span>
              </div>
              <div className={`h-1.5 rounded-full overflow-hidden ${isDark ? 'bg-cyan-900/50' : 'bg-gray-200'}`}>
                <motion.div 
                  className="h-full bg-gradient-to-r from-cyan-400 to-blue-400 rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${project.progress || 0}%` }}
                  transition={{ duration: 1, delay: 0.1 * index }}
                />
              </div>
            </motion.div>
          ))
        ) : (
          <div className={`text-center py-4 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
            <FolderKanban className="w-6 h-6 mx-auto mb-2 opacity-50" />
            <p className="text-xs">Crie seu primeiro projeto</p>
          </div>
        )}
      </div>
    </DashboardCard>
  );
}