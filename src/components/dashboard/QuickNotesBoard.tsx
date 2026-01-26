import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { StickyNote, Plus, X, Send } from 'lucide-react';
import { useItems } from '@/hooks/useItems';
import { useNavigate } from 'react-router-dom';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/hooks/useAuth';

const NOTE_COLORS = [
  'from-yellow-300 to-amber-400',
  'from-pink-300 to-rose-400',
  'from-cyan-300 to-blue-400',
  'from-green-300 to-emerald-400',
  'from-purple-300 to-violet-400',
  'from-orange-300 to-red-400',
];

export default function QuickNotesBoard() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { items: notes, createItem, deleteItem } = useItems('note');
  const [newNote, setNewNote] = useState('');
  const [isAdding, setIsAdding] = useState(false);

  const recentNotes = notes?.slice(0, 4) || [];

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
      className="relative p-4 rounded-2xl overflow-hidden h-full flex flex-col
                 bg-gradient-to-br from-purple-50 to-pink-50 hover:from-purple-100 hover:to-pink-100
                 border border-purple-200 shadow-lg shadow-purple-200/50 hover:shadow-xl hover:shadow-purple-300/50
                 transition-all duration-300"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-3 shrink-0">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-purple-100">
            <StickyNote className="w-5 h-5 text-purple-600" />
          </div>
          <div>
            <h3 className="text-base font-semibold text-gray-800">📌 Mural Rápido</h3>
            <p className="text-xs text-gray-500">Capture pensamentos rápidos</p>
          </div>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setIsAdding(!isAdding)}
          className="p-2 rounded-lg bg-purple-100 border border-purple-200 text-purple-600 hover:bg-purple-200 transition-colors"
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
            className="mb-3 overflow-hidden shrink-0"
          >
            <div className="flex gap-2">
              <Input
                value={newNote}
                onChange={(e) => setNewNote(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Digite uma nota rápida..."
                className="flex-1 bg-white/70 border-purple-200 focus:border-purple-400"
                autoFocus
              />
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleAddNote}
                disabled={!newNote.trim()}
                className="p-2 rounded-lg bg-purple-200 text-purple-700 hover:bg-purple-300 transition-colors disabled:opacity-50"
              >
                <Send className="w-4 h-4" />
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Notes Grid - Post-it style - Compact */}
      <div className="flex-1 min-h-0 overflow-hidden">
        <div className="grid grid-cols-2 gap-2 h-full">
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
                  whileHover={{ scale: 1.03, rotate: 0, zIndex: 10 }}
                  className={`relative p-2 rounded-lg bg-gradient-to-br ${colorClass} cursor-pointer group min-h-[60px]`}
                  style={{
                    boxShadow: '0 3px 8px rgba(0,0,0,0.15)',
                  }}
                  onClick={() => navigate('/timeline')}
                >
                  {/* Delete button */}
                  <motion.button
                    initial={{ opacity: 0 }}
                    whileHover={{ scale: 1.1 }}
                    onClick={(e) => handleDeleteNote(note.id, e)}
                    className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-red-500 text-white opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
                  >
                    <X className="w-2.5 h-2.5" />
                  </motion.button>
                  
                  {/* Pin decoration */}
                  <div className="absolute -top-0.5 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-red-400 shadow-sm" />
                  
                  <p className="text-[11px] text-gray-800 font-medium line-clamp-3 mt-1">
                    {note.content}
                  </p>
                </motion.div>
              );
            })}
          </AnimatePresence>

          {/* Add new note placeholder */}
          {recentNotes.length < 4 && !isAdding && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsAdding(true)}
              className="min-h-[60px] rounded-lg border-2 border-dashed border-purple-300 flex items-center justify-center text-purple-400 hover:text-purple-600 hover:border-purple-400 transition-colors"
            >
              <Plus className="w-5 h-5" />
            </motion.button>
          )}
        </div>
      </div>

      {/* View all button */}
      {notes && notes.length > 4 && (
        <motion.button
          whileHover={{ scale: 1.02 }}
          onClick={() => navigate('/timeline')}
          className="w-full mt-2 py-1.5 rounded-lg bg-purple-100 text-purple-700 text-xs font-medium hover:bg-purple-200 transition-colors shrink-0"
        >
          Ver todas ({notes.length} notas)
        </motion.button>
      )}

      {/* Empty state */}
      {recentNotes.length === 0 && !isAdding && (
        <div className="text-center py-4 flex-1 flex flex-col items-center justify-center">
          <StickyNote className="w-8 h-8 mx-auto mb-2 text-purple-300" />
          <p className="text-xs text-gray-500 mb-2">Seu mural está vazio</p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsAdding(true)}
            className="px-3 py-1.5 rounded-lg bg-purple-100 text-purple-700 text-xs font-medium hover:bg-purple-200 transition-colors"
          >
            Adicionar primeira nota
          </motion.button>
        </div>
      )}
    </motion.div>
  );
}