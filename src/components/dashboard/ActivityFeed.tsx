import { motion } from 'framer-motion';
import { FileText, CheckSquare, Lightbulb, Target, CalendarDays, FolderKanban, Zap } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface ActivityItem {
  id: string;
  type: string;
  content: string;
  created_at?: string;
  status?: string;
}

interface ActivityFeedProps {
  items?: ActivityItem[];
  isDark?: boolean;
}

const typeConfig: Record<string, { icon: typeof FileText; color: string; label: string }> = {
  note: { icon: FileText, color: 'text-blue-400', label: 'Nota' },
  task: { icon: CheckSquare, color: 'text-emerald-400', label: 'Tarefa' },
  idea: { icon: Lightbulb, color: 'text-purple-400', label: 'Ideia' },
  goal: { icon: Target, color: 'text-pink-400', label: 'Objetivo' },
  event: { icon: CalendarDays, color: 'text-orange-400', label: 'Evento' },
  project: { icon: FolderKanban, color: 'text-cyan-400', label: 'Projeto' },
};

export default function ActivityFeed({ items = [], isDark = true }: ActivityFeedProps) {
  const recentItems = [...items]
    .filter(i => i.created_at)
    .sort((a, b) => new Date(b.created_at!).getTime() - new Date(a.created_at!).getTime())
    .slice(0, 8);

  // Placeholder when no data
  const placeholderItems = [
    { id: '1', type: 'task', content: 'Revisar relatório semanal', created_at: new Date(Date.now() - 1000 * 60 * 30).toISOString(), status: 'active' },
    { id: '2', type: 'idea', content: 'Nova feature de automação', created_at: new Date(Date.now() - 1000 * 60 * 90).toISOString(), status: 'raw' },
    { id: '3', type: 'note', content: 'Anotações da reunião de produto', created_at: new Date(Date.now() - 1000 * 60 * 180).toISOString(), status: 'active' },
    { id: '4', type: 'goal', content: 'Lançar MVP até sexta-feira', created_at: new Date(Date.now() - 1000 * 60 * 360).toISOString(), status: 'active' },
    { id: '5', type: 'event', content: 'Call com investidores', created_at: new Date(Date.now() - 1000 * 60 * 720).toISOString(), status: 'active' },
  ];

  const displayItems = recentItems.length > 0 ? recentItems : placeholderItems;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
      className="glass-card-elevated rounded-2xl p-5 h-full flex flex-col"
    >
      {/* Header */}
      <div className="flex items-center gap-2 mb-4">
        <div className="w-8 h-8 rounded-lg bg-amber-500/15 flex items-center justify-center">
          <Zap className="w-4 h-4 text-amber-400" />
        </div>
        <div>
          <h3 className="text-sm font-semibold font-display">Atividade Recente</h3>
          <p className="text-xs text-muted-foreground">{displayItems.length} itens recentes</p>
        </div>
      </div>

      {/* Feed */}
      <div className="flex-1 min-h-0 overflow-y-auto space-y-1 pr-1">
        {displayItems.map((item, i) => {
          const config = typeConfig[item.type] || typeConfig.note;
          const Icon = config.icon;
          const timeAgo = item.created_at
            ? formatDistanceToNow(new Date(item.created_at), { addSuffix: true, locale: ptBR })
            : '';

          return (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.05 }}
              className="flex items-start gap-3 p-2.5 rounded-xl hover:bg-white/[0.03] transition-colors group cursor-default"
            >
              {/* Timeline dot */}
              <div className="relative flex flex-col items-center mt-0.5">
                <div className={`w-7 h-7 rounded-lg flex items-center justify-center ${config.color} bg-current/10`}
                  style={{ background: `hsl(var(--muted) / 0.5)` }}
                >
                  <Icon className={`w-3.5 h-3.5 ${config.color}`} />
                </div>
                {i < displayItems.length - 1 && (
                  <div className="w-px h-full bg-white/5 mt-1 min-h-[8px]" />
                )}
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <p className="text-sm text-foreground/90 truncate leading-tight">
                  {item.content}
                </p>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className={`text-[10px] font-medium uppercase tracking-wider ${config.color}`}>
                    {config.label}
                  </span>
                  <span className="text-[10px] text-muted-foreground">{timeAgo}</span>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
}
