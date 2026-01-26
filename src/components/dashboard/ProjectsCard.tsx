import { motion } from 'framer-motion';
import { FolderKanban } from 'lucide-react';
import DashboardCard from './DashboardCard';
import { Item } from '@/types';

interface ProjectsCardProps {
  projects: Item[];
  projectCount: number;
}

export default function ProjectsCard({ projects, projectCount }: ProjectsCardProps) {
  return (
    <DashboardCard 
      title="📁 Projetos" 
      icon={FolderKanban} 
      count={projectCount}
      gradient="cyan"
      navigateTo="/projects"
    >
      <div className="space-y-2">
        {projects.length > 0 ? (
          projects.slice(0, 3).map((project, index) => (
            <motion.div 
              key={project.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 * index }}
              className="p-2 rounded-lg bg-white/60 hover:bg-white/80 transition-colors border border-cyan-100"
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-medium text-gray-700 truncate">
                  {project.title || project.content}
                </span>
                <span className="text-xs text-cyan-600 font-medium">
                  {project.progress || 0}%
                </span>
              </div>
              <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                <motion.div 
                  className="h-full bg-gradient-to-r from-cyan-400 to-blue-400 rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${project.progress || 0}%` }}
                  transition={{ duration: 1, delay: 0.2 * index }}
                />
              </div>
            </motion.div>
          ))
        ) : (
          <div className="text-center py-4 text-gray-400">
            <FolderKanban className="w-6 h-6 mx-auto mb-2 opacity-50" />
            <p className="text-xs">Crie seu primeiro projeto</p>
          </div>
        )}
      </div>
    </DashboardCard>
  );
}