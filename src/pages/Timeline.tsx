import { useState } from 'react';
import AppLayout from '@/components/layout/AppLayout';
import { useItems } from '@/hooks/useItems';
import { getItemTypeConfig, Item } from '@/types';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { ItemActions } from '@/components/items/ItemActions';
import { ItemEditModal } from '@/components/items/ItemEditModal';
import { TagBadge } from '@/components/tags/TagBadge';
import { Star } from 'lucide-react';

export default function Timeline() {
  const { items, updateItem, deleteItem } = useItems();
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

  return (
    <AppLayout>
      <div className="flex-1 p-4 md:p-6 overflow-y-auto">
        <header className="mb-6">
          <h1 className="text-2xl md:text-3xl font-display font-bold gradient-text">🕓 Linha do Tempo</h1>
          <p className="text-muted-foreground">Histórico de todos os seus registros</p>
        </header>
        
        <div className="max-w-2xl mx-auto">
          {items.map((item, i) => {
            const config = getItemTypeConfig(item.type);
            
            return (
              <motion.div 
                key={item.id} 
                initial={{ opacity: 0, x: -20 }} 
                animate={{ opacity: 1, x: 0 }} 
                transition={{ delay: i * 0.03 }} 
                className="flex gap-4 pb-6"
              >
                <div className="flex flex-col items-center">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${config.bgClass} border`}>
                    <span>{config.icon}</span>
                  </div>
                  {i < items.length - 1 && <div className="flex-1 w-px bg-border mt-2" />}
                </div>
                
                <div 
                  className="flex-1 glass-card rounded-xl p-4 group cursor-pointer transition-all hover:border-mindflow-purple/30"
                  onClick={() => setEditingItem(item)}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className={`text-xs px-2 py-0.5 rounded-full ${config.bgClass}`}>
                        {config.label}
                      </span>
                      {item.is_important && (
                        <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
                      )}
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-muted-foreground">
                        {format(new Date(item.created_at), "dd MMM HH:mm", { locale: ptBR })}
                      </span>
                      
                      <ItemActions
                        item={item}
                        onEdit={setEditingItem}
                        onDelete={handleDelete}
                        onToggleImportant={handleToggleImportant}
                      />
                    </div>
                  </div>
                  
                  <p className="text-sm">{item.content}</p>
                  
                  {/* Tags */}
                  {item.tags && item.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-2">
                      {item.tags.map((tag, idx) => (
                        <TagBadge key={idx} tag={tag} size="sm" />
                      ))}
                    </div>
                  )}
                </div>
              </motion.div>
            );
          })}
          
          {!items.length && (
            <p className="text-muted-foreground text-center py-12">
              Nenhum registro ainda.
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
