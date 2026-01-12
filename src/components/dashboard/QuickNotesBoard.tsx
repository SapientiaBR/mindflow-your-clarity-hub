import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { StickyNote, Plus, X, Send } from 'lucide-react';
import { useItems } from '@/hooks/useItems';
import { useNavigate } from 'react-router-dom';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/hooks/useAuth';

const NOTE_COLORS = [
  'from-yellow-400/80 to-amber-500/80',
  'from-pink-400/80 to-rose-500/80',
  'from-cyan-400/80 to-blue-500/80',
  'from-green-400/80 to-emerald-500/80',
  'from-purple-400/80 to-violet-500/80',
  'from-orange-400/80 to-red-500/80',
];

export default function QuickNotesBoard() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { items: notes, createItem, deleteItem } = useItems('note');
  const [newNote, setNewNote] = useState('');
  const [isAdding, setIsAdding] = useState(false);

  const recentNotes = notes?.slice(0, 6) || [];

  const handleAddNote = async () => {
    if (!newNote.trim() || !user) return;
    
    await createItem.mutateAsync({
      content: newNote,
      type: 'note',
    });
    
    setNewNote('');
    setIsAdding(false);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleAddNote();
    }
  };

  const handleDeleteNote = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    deleteItem.mutate(id);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative p-5 rounded-2xl overflow-hidden"
      style={{
        background: 'linear-gradient(145deg, rgba(139, 92, 246, 0.1) 0%, rgba(20, 20, 35, 0.95) 100%)',
        boxShadow: '0 0 30px rgba(139, 92, 246, 0.15), inset 0 1px 0 rgba(255,255,255,0.05)',
        border: '1px solid rgba(139, 92, 246, 0.3)',
      }}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-purple-500/20">
            <StickyNote className="w-5 h-5 text-purple-400" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-foreground">📌 Mural Rápido</h3>
            <p className="text-xs text-muted-foreground">Capture pensamentos rápidos</p>
          </div>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setIsAdding(!isAdding)}
          className="p-2 rounded-lg bg-purple-500/20 border border-purple-500/30 text-purple-300 hover:bg-purple-500/30 transition-colors"
        >
          <Plus className="w-4 h-4" />
        </motion.button>
      </div>

      {/* Quick add input */}
      <AnimatePresence>
        {isAdding && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mb-4 overflow-hidden"
          >
            <div className="flex gap-2">
              <Input
                value={newNote}
                onChange={(e) => setNewNote(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Digite uma nota rápida..."
                className="flex-1 bg-white/5 border-purple-500/30 focus:border-purple-500/50"
                autoFocus
              />
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleAddNote}
                disabled={!newNote.trim()}
                className="p-2 rounded-lg bg-purple-500/30 text-purple-300 hover:bg-purple-500/40 transition-colors disabled:opacity-50"
              >
                <Send className="w-4 h-4" />
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Notes Grid - Post-it style */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        <AnimatePresence mode="popLayout">
          {recentNotes.map((note, index) => {
            const colorClass = NOTE_COLORS[index % NOTE_COLORS.length];
            const rotation = (index % 2 === 0 ? 1 : -1) * (Math.random() * 2 + 1);
            
            return (
              <motion.div
                key={note.id}
                layout
                initial={{ opacity: 0, scale: 0.8, rotate: rotation }}
                animate={{ opacity: 1, scale: 1, rotate: rotation }}
                exit={{ opacity: 0, scale: 0.8 }}
                whileHover={{ scale: 1.05, rotate: 0, zIndex: 10 }}
                className={`relative p-3 rounded-lg bg-gradient-to-br ${colorClass} cursor-pointer group min-h-[80px]`}
                style={{
                  boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
                }}
                onClick={() => navigate('/timeline')}
              >
                {/* Delete button */}
                <motion.button
                  initial={{ opacity: 0 }}
                  whileHover={{ scale: 1.1 }}
                  onClick={(e) => handleDeleteNote(note.id, e)}
                  className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-red-500 text-white opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
                >
                  <X className="w-3 h-3" />
                </motion.button>
                
                {/* Pin decoration */}
                <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-3 h-3 rounded-full bg-red-400 shadow-md" />
                
                <p className="text-sm text-gray-900 font-medium line-clamp-3 mt-1">
                  {note.content}
                </p>
              </motion.div>
            );
          })}
        </AnimatePresence>

        {/* Add new note placeholder */}
        {recentNotes.length < 6 && !isAdding && (
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsAdding(true)}
            className="min-h-[80px] rounded-lg border-2 border-dashed border-purple-500/30 flex items-center justify-center text-purple-400/50 hover:text-purple-400 hover:border-purple-500/50 transition-colors"
          >
            <Plus className="w-6 h-6" />
          </motion.button>
        )}
      </div>

      {/* View all button */}
      {notes && notes.length > 6 && (
        <motion.button
          whileHover={{ scale: 1.02 }}
          onClick={() => navigate('/timeline')}
          className="w-full mt-4 py-2 rounded-lg bg-purple-500/10 text-purple-300 text-sm font-medium hover:bg-purple-500/20 transition-colors"
        >
          Ver todas ({notes.length} notas)
        </motion.button>
      )}

      {/* Empty state */}
      {recentNotes.length === 0 && !isAdding && (
        <div className="text-center py-8">
          <StickyNote className="w-10 h-10 mx-auto mb-3 text-purple-400/30" />
          <p className="text-sm text-muted-foreground mb-3">Seu mural está vazio</p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsAdding(true)}
            className="px-4 py-2 rounded-lg bg-purple-500/20 text-purple-300 text-sm font-medium hover:bg-purple-500/30 transition-colors"
          >
            Adicionar primeira nota
          </motion.button>
        </div>
      )}
    </motion.div>
  );
}
