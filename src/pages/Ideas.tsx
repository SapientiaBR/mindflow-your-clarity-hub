import { useState } from 'react';
import AppLayout from '@/components/layout/AppLayout';
import { useItems } from '@/hooks/useItems';
import { motion } from 'framer-motion';
import { ItemActions } from '@/components/items/ItemActions';
import { ItemEditModal } from '@/components/items/ItemEditModal';
import { TagBadge } from '@/components/tags/TagBadge';
import { Item } from '@/types';
import { Star, Sparkles } from 'lucide-react';

export default function Ideas() {
  const { items, updateItem, deleteItem } = useItems('idea');
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
      case 'raw': return { label: '💭 Crua', color: 'bg-gray-500/20 text-gray-400' };
      case 'evolving': return { label: '🌱 Evoluindo', color: 'bg-green-500/20 text-green-400' };
      case 'in_progress': return { label: '🚀 Em progresso', color: 'bg-blue-500/20 text-blue-400' };
      case 'completed': return { label: '✅ Completada', color: 'bg-purple-500/20 text-purple-400' };
      default: return { label: status || 'raw', color: 'bg-mindflow-purple/20 text-mindflow-purple' };
    }
  };

  return (
    <AppLayout>
      <div className="flex-1 p-4 md:p-6 overflow-y-auto">
        <header className="mb-6">
          <h1 className="text-2xl md:text-3xl font-display font-bold gradient-text">💡 Ideias</h1>
          <p className="text-muted-foreground">Clique em uma ideia para editar</p>
        </header>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {items.map((idea, i) => {
            const statusConfig = getStatusConfig(idea.status);
            
            return (
              <motion.div 
                key={idea.id} 
                initial={{ opacity: 0, y: 20 }} 
                animate={{ opacity: 1, y: 0 }} 
                transition={{ delay: i * 0.05 }} 
                className="glass-card rounded-2xl p-5 hover-scale group cursor-pointer transition-all hover:border-mindflow-purple/30 relative"
                onClick={() => setEditingItem(idea)}
              >
                {/* Decorative sparkle */}
                <Sparkles className="absolute top-3 right-3 w-5 h-5 text-mindflow-purple/30" />
                
                {/* Important indicator */}
                {idea.is_important && (
                  <Star className="absolute top-3 left-3 w-4 h-4 text-yellow-400 fill-yellow-400" />
                )}
                
                <p className="text-foreground mb-3 pr-6">{idea.content}</p>
                
                {/* Tags */}
                {idea.tags && idea.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1 mb-3">
                    {idea.tags.map((tag, idx) => (
                      <TagBadge key={idx} tag={tag} size="sm" />
                    ))}
                  </div>
                )}
                
                <div className="flex items-center justify-between">
                  <span className={`text-xs px-2 py-1 rounded-full ${statusConfig.color}`}>
                    {statusConfig.label}
                  </span>
                  
                  <ItemActions
                    item={idea}
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
              Nenhuma ideia ainda. Use o chat para criar!
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
