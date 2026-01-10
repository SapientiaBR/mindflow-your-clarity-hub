import AppLayout from '@/components/layout/AppLayout';
import { useItems } from '@/hooks/useItems';
import { motion } from 'framer-motion';

export default function Projects() {
  const { items } = useItems('project');

  return (
    <AppLayout>
      <div className="flex-1 p-4 md:p-6 overflow-y-auto">
        <header className="mb-6">
          <h1 className="text-2xl md:text-3xl font-display font-bold gradient-text">📁 Projetos</h1>
          <p className="text-muted-foreground">Seus projetos em andamento</p>
        </header>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {items.map((project, i) => (
            <motion.div key={project.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} className="glass-card rounded-2xl p-6 hover-scale">
              <h3 className="font-display font-semibold text-lg mb-2">{project.title || project.content}</h3>
              <p className="text-sm text-muted-foreground mb-4">{project.content}</p>
              <div className="h-2 bg-muted rounded-full overflow-hidden">
                <div className="h-full bg-gradient-primary w-1/3 rounded-full" />
              </div>
              <p className="text-xs text-muted-foreground mt-2">33% concluído</p>
            </motion.div>
          ))}
          {!items.length && <p className="text-muted-foreground col-span-full text-center py-12">Nenhum projeto. Use o chat para criar!</p>}
        </div>
      </div>
    </AppLayout>
  );
}
