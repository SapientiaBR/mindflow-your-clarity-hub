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

interface QuickNotesBoardProps {
  isDark?: boolean;
}

export default function QuickNotesBoard({ isDark = false }: QuickNotesBoardProps) {
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
      className={`relative p-4 rounded-2xl overflow-hidden h-full flex flex-col
                 border-2 transition-all duration-300 ${
                   isDark 
                     ? 'bg-gradient-to-br from-purple-900/80 to-pink-900/80 border-purple-700/50 shadow-lg shadow-purple-900/50 hover:shadow-xl hover:shadow-purple-800/50' 
                     : 'bg-gradient-to-br from-purple-100 to-pink-100 border-purple-300 shadow-lg shadow-purple-300/60 hover:shadow-xl hover:shadow-purple-400/60'
                 }`}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-3 shrink-0">
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded-lg ${isDark ? 'bg-purple-800/50 text-purple-300' : 'bg-purple-200 text-purple-600'}`}>
            <StickyNote className="w-5 h-5" />
          </div>
          <div>
            <h3 className={`text-base font-semibold ${isDark ? 'text-white' : 'text-gray-800'}`}>📌 Mural Rápido</h3>
            <p className={`text-xs ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>Capture pensamentos rápidos</p>
          </div>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setIsAdding(!isAdding)}
          className={`p-2 rounded-lg border transition-colors ${
            isDark 
              ? 'bg-purple-800/50 border-purple-600/50 text-purple-300 hover:bg-purple-700/50' 
              : 'bg-purple-200 border-purple-300 text-purple-600 hover:bg-purple-300'
          }`}
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
                className={`flex-1 ${isDark ? 'bg-purple-900/50 border-purple-600/50 text-white placeholder:text-gray-400' : 'bg-white border-purple-200'}`}
                autoFocus
              />
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleAddNote}
                disabled={!newNote.trim()}
                className={`p-2 rounded-lg transition-colors disabled:opacity-50 ${
                  isDark 
                    ? 'bg-purple-700/50 text-purple-200 hover:bg-purple-600/50' 
                    : 'bg-purple-200 text-purple-700 hover:bg-purple-300'
                }`}
              >
                <Send className="w-4 h-4" />
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Notes Grid */}
      <div className="flex-1 min-h-0 overflow-hidden">
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2 h-full">
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
                  className={`relative p-2 rounded-lg bg-gradient-to-br ${colorClass} cursor-pointer group min-h-[50px]`}
                  style={{
                    boxShadow: '0 3px 8px rgba(0,0,0,0.2)',
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
                  
                  <p className="text-[10px] text-gray-800 font-medium line-clamp-3 mt-1">
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
              className={`min-h-[50px] rounded-lg border-2 border-dashed flex items-center justify-center transition-colors ${
                isDark 
                  ? 'border-purple-600/50 text-purple-400 hover:text-purple-300 hover:border-purple-500/50' 
                  : 'border-purple-300 text-purple-400 hover:text-purple-600 hover:border-purple-400'
              }`}
            >
              <Plus className="w-5 h-5" />
            </motion.button>
          )}
        </div>
      </div>

      {/* View all button */}
      {notes && notes.length > 6 && (
        <motion.button
          whileHover={{ scale: 1.02 }}
          onClick={() => navigate('/timeline')}
          className={`w-full mt-2 py-1.5 rounded-lg text-xs font-medium transition-colors shrink-0 ${
            isDark 
              ? 'bg-purple-800/50 text-purple-200 hover:bg-purple-700/50' 
              : 'bg-purple-200 text-purple-700 hover:bg-purple-300'
          }`}
        >
          Ver todas ({notes.length} notas)
        </motion.button>
      )}

      {/* Empty state */}
      {recentNotes.length === 0 && !isAdding && (
        <div className="text-center py-4 flex-1 flex flex-col items-center justify-center">
          <StickyNote className={`w-8 h-8 mx-auto mb-2 ${isDark ? 'text-purple-400' : 'text-purple-300'}`} />
          <p className={`text-xs mb-2 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Seu mural está vazio</p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsAdding(true)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
              isDark 
                ? 'bg-purple-800/50 text-purple-200 hover:bg-purple-700/50' 
                : 'bg-purple-200 text-purple-700 hover:bg-purple-300'
            }`}
          >
            Adicionar primeira nota
          </motion.button>
        </div>
      )}
    </motion.div>
  );
}