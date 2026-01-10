import AppLayout from '@/components/layout/AppLayout';
import { useItems } from '@/hooks/useItems';
import { motion } from 'framer-motion';

export default function Ideas() {
  const { items } = useItems('idea');

  return (
    <AppLayout>
      <div className="flex-1 p-4 md:p-6 overflow-y-auto">
        <header className="mb-6">
          <h1 className="text-2xl md:text-3xl font-display font-bold gradient-text">💡 Ideias</h1>
          <p className="text-muted-foreground">Suas ideias em evolução</p>
        </header>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {items.map((idea, i) => (
            <motion.div key={idea.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} className="glass-card rounded-2xl p-5 hover-scale">
              <p className="text-foreground mb-3">{idea.content}</p>
              <span className="text-xs px-2 py-1 rounded-full bg-mindflow-purple/20 text-mindflow-purple">{idea.status}</span>
            </motion.div>
          ))}
          {!items.length && <p className="text-muted-foreground col-span-full text-center py-12">Nenhuma ideia ainda. Use o chat para criar!</p>}
        </div>
      </div>
    </AppLayout>
  );
}
