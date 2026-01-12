import { useState } from 'react';
import AppLayout from '@/components/layout/AppLayout';
import { useItems } from '@/hooks/useItems';
import { motion } from 'framer-motion';
import { ItemActions } from '@/components/items/ItemActions';
import { ItemEditModal } from '@/components/items/ItemEditModal';
import { TagBadge } from '@/components/tags/TagBadge';
import { Item } from '@/types';
import { Star, Target, Trophy } from 'lucide-react';

export default function Goals() {
  const { items, updateItem, deleteItem } = useItems('goal');
  const [editingItem, setEditingItem] = useState<Item | null>(null);

  const handleSave = (id: string, updates: Partial<Item>) => {
    updateItem.mutate({ id, ...updates });
  };

  const handleDelete = (id: string) => {
    deleteItem.mutate(id);
  };

  const handleToggleImportant = (id: string, isImportant: boolean) => {
    updateItem.mutate({ id, is_important: isImportant });
  };

  const getStatusConfig = (status: string | undefined) => {
    switch (status) {
      case 'active': return { label: '🎯 Ativo', color: 'bg-purple-500/20 text-purple-400' };
      case 'in_progress': return { label: '🚀 Em progresso', color: 'bg-blue-500/20 text-blue-400' };
      case 'completed': return { label: '🏆 Alcançado', color: 'bg-green-500/20 text-green-400' };
      case 'archived': return { label: '📦 Arquivado', color: 'bg-gray-500/20 text-gray-400' };
      default: return { label: status || 'ativo', color: 'bg-purple-500/20 text-purple-400' };
    }
  };

  const getPriorityConfig = (priority: string | undefined) => {
    switch (priority) {
      case 'urgent': return { label: 'Urgente', color: 'bg-red-500/30 text-red-300' };
      case 'high': return { label: 'Alta', color: 'bg-orange-500/30 text-orange-300' };
      case 'medium': return { label: 'Média', color: 'bg-yellow-500/30 text-yellow-300' };
      case 'low': return { label: 'Baixa', color: 'bg-green-500/30 text-green-300' };
      default: return null;
    }
  };

  return (
    <AppLayout>
      <div className="flex-1 p-4 md:p-6 overflow-y-auto">
        <header className="mb-6">
          <h1 className="text-2xl md:text-3xl font-display font-bold gradient-text">🎯 Objetivos</h1>
          <p className="text-muted-foreground">Acompanhe suas metas e conquistas</p>
        </header>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {items.map((goal, i) => {
            const statusConfig = getStatusConfig(goal.status);
            const priorityConfig = getPriorityConfig(goal.priority);
            
            return (
              <motion.div 
                key={goal.id} 
                initial={{ opacity: 0, y: 20 }} 
                animate={{ opacity: 1, y: 0 }} 
                transition={{ delay: i * 0.05 }} 
                className="glass-card rounded-2xl p-5 hover-scale group cursor-pointer transition-all hover:border-purple-500/30 relative"
                style={{
                  boxShadow: '0 0 20px rgba(139, 92, 246, 0.1)',
                  border: '1px solid rgba(139, 92, 246, 0.2)',
                }}
                onClick={() => setEditingItem(goal)}
              >
                {/* Decorative icon */}
                <Target className="absolute top-3 right-3 w-5 h-5 text-purple-400/30" />
                
                {/* Important indicator */}
                {goal.is_important && (
                  <Star className="absolute top-3 left-3 w-4 h-4 text-yellow-400 fill-yellow-400" />
                )}
                
                {/* Title */}
                {goal.title && (
                  <h3 className="text-lg font-semibold text-foreground mb-2 pr-6">{goal.title}</h3>
                )}
                
                {/* Content */}
                <p className="text-foreground/80 mb-3 text-sm">{goal.content}</p>
                
                {/* Tags */}
                {goal.tags && goal.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1 mb-3">
                    {goal.tags.map((tag, idx) => (
                      <TagBadge key={idx} tag={tag} size="sm" />
                    ))}
                  </div>
                )}
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className={`text-xs px-2 py-1 rounded-full ${statusConfig.color}`}>
                      {statusConfig.label}
                    </span>
                    {priorityConfig && (
                      <span className={`text-xs px-2 py-1 rounded-full ${priorityConfig.color}`}>
                        {priorityConfig.label}
                      </span>
                    )}
                  </div>
                  
                  <ItemActions
                    item={goal}
                    onEdit={setEditingItem}
                    onDelete={handleDelete}
                    onToggleImportant={handleToggleImportant}
                  />
                </div>
              </motion.div>
            );
          })}
          
          {!items.length && (
            <div className="col-span-full text-center py-12">
              <Trophy className="w-16 h-16 mx-auto mb-4 text-purple-400/30" />
              <p className="text-muted-foreground">
                Nenhum objetivo ainda. Use o chat para criar!
              </p>
            </div>
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
