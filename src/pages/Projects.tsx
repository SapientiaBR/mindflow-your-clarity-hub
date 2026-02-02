import { useState } from 'react';
import AppLayout from '@/components/layout/AppLayout';
import { useItems } from '@/hooks/useItems';
import { motion } from 'framer-motion';
import { ItemActions } from '@/components/items/ItemActions';
import { ItemEditModal } from '@/components/items/ItemEditModal';
import { TagBadge } from '@/components/tags/TagBadge';
import { Item } from '@/types';
import { Star, FolderOpen } from 'lucide-react';

export default function Projects() {
  const { items, updateItem, deleteItem } = useItems('project');
  const [editingItem, setEditingItem] = useState<Item | null>(null);

  const handleSave = async (id: string, updates: Partial<Item>) => {
    await updateItem.mutateAsync({ id, ...updates });
  };

  const handleDelete = (id: string) => {
    deleteItem.mutate(id);
  };

  const handleToggleImportant = (id: string, isImportant: boolean) => {
    updateItem.mutate({ id, is_important: isImportant });
  };

  const getProgressColor = (progress: number) => {
    if (progress >= 80) return 'from-green-500 to-emerald-400';
    if (progress >= 50) return 'from-blue-500 to-cyan-400';
    if (progress >= 25) return 'from-yellow-500 to-orange-400';
    return 'from-gray-500 to-gray-400';
  };

  return (
    <AppLayout>
      <div className="flex-1 p-4 md:p-6 overflow-y-auto">
        <header className="mb-6">
          <h1 className="text-2xl md:text-3xl font-display font-bold gradient-text">📁 Projetos</h1>
          <p className="text-muted-foreground">Clique em um projeto para editar</p>
        </header>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {items.map((project, i) => {
            const progress = project.progress || 0;
            
            return (
              <motion.div 
                key={project.id} 
                initial={{ opacity: 0, y: 20 }} 
                animate={{ opacity: 1, y: 0 }} 
                transition={{ delay: i * 0.05 }} 
                className="glass-card rounded-2xl p-6 hover-scale group cursor-pointer transition-all hover:border-mindflow-purple/30 relative"
                onClick={() => setEditingItem(project)}
              >
                {/* Icon */}
                <FolderOpen className="absolute top-4 right-4 w-6 h-6 text-mindflow-cyan/30" />
                
                {/* Important indicator */}
                {project.is_important && (
                  <Star className="absolute top-4 left-4 w-4 h-4 text-yellow-400 fill-yellow-400" />
                )}
                
                <h3 className="font-display font-semibold text-lg mb-2 pr-8">
                  {project.title || project.content}
                </h3>
                
                <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                  {project.content}
                </p>
                
                {/* Tags */}
                {project.tags && project.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1 mb-4">
                    {project.tags.map((tag, idx) => (
                      <TagBadge key={idx} tag={tag} size="sm" />
                    ))}
                  </div>
                )}
                
                {/* Progress bar */}
                <div className="mb-2">
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <motion.div 
                      className={`h-full bg-gradient-to-r ${getProgressColor(progress)} rounded-full`}
                      initial={{ width: 0 }}
                      animate={{ width: `${progress}%` }}
                      transition={{ duration: 0.5, delay: i * 0.1 }}
                    />
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <p className="text-xs text-muted-foreground">
                    {progress}% concluído
                  </p>
                  
                  <ItemActions
                    item={project}
                    onEdit={setEditingItem}
                    onDelete={handleDelete}
                    onToggleImportant={handleToggleImportant}
                  />
                </div>
              </motion.div>
            );
          })}
          
          {!items.length && (
            <p className="text-muted-foreground col-span-full text-center py-12">
              Nenhum projeto. Use o chat para criar!
            </p>
          )}
        </div>
      </div>

      <ItemEditModal
        item={editingItem}
        isOpen={!!editingItem}
        onClose={() => setEditingItem(null)}
        onSave={handleSave}
        onDelete={handleDelete}
      />
    </AppLayout>
  );
}
