import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { BarChart, Bar, AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { TrendingUp } from 'lucide-react';

interface ProductivityChartProps {
  items?: Array<{ created_at?: string; status?: string; type?: string }>;
  isDark?: boolean;
}

export default function ProductivityChart({ items = [], isDark = true }: ProductivityChartProps) {
  const weeklyData = useMemo(() => {
    const now = new Date();
    const days = [];

    for (let i = 6; i >= 0; i--) {
      const date = new Date(now);
      date.setDate(date.getDate() - i);
      const dayStr = date.toISOString().split('T')[0];
      const dayLabel = date.toLocaleDateString('pt-BR', { weekday: 'short' }).replace('.', '');

      const created = items.filter(item => {
        if (!item.created_at) return false;
        return item.created_at.startsWith(dayStr);
      }).length;

      const completed = items.filter(item => {
        if (!item.created_at || item.status !== 'completed') return false;
        return item.created_at.startsWith(dayStr);
      }).length;

      days.push({
        day: dayLabel.charAt(0).toUpperCase() + dayLabel.slice(1),
        criados: created,
        concluídos: completed,
      });
    }

    // If no real data, show placeholder values
    const hasData = days.some(d => d.criados > 0 || d.concluídos > 0);
    if (!hasData) {
      return days.map((d, i) => ({
        ...d,
        criados: [3, 5, 2, 7, 4, 6, 3][i],
        concluídos: [2, 3, 1, 5, 3, 4, 2][i],
      }));
    }

    return days;
  }, [items]);

  const totalCreated = weeklyData.reduce((s, d) => s + d.criados, 0);
  const totalCompleted = weeklyData.reduce((s, d) => s + d.concluídos, 0);
  const completionRate = totalCreated > 0 ? Math.round((totalCompleted / totalCreated) * 100) : 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="glass-card-elevated rounded-2xl p-5 h-full flex flex-col"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-indigo-500/15 flex items-center justify-center">
            <TrendingUp className="w-4 h-4 text-indigo-400" />
          </div>
          <div>
            <h3 className="text-sm font-semibold font-display">Produtividade</h3>
            <p className="text-xs text-muted-foreground">Últimos 7 dias</p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-lg font-bold font-display text-indigo-400">{completionRate}%</p>
          <p className="text-[10px] text-muted-foreground uppercase tracking-wider">taxa conclusão</p>
        </div>
      </div>

      {/* Chart */}
      <div className="flex-1 min-h-0" style={{ minHeight: '120px' }}>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={weeklyData} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="colorCriados" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#818cf8" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#818cf8" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="colorConcluidos" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#34d399" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#34d399" stopOpacity={0} />
              </linearGradient>
            </defs>
            <XAxis
              dataKey="day"
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 10, fill: isDark ? '#6b7280' : '#9ca3af' }}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 10, fill: isDark ? '#6b7280' : '#9ca3af' }}
            />
            <Tooltip
              contentStyle={{
                background: isDark ? 'hsl(222 47% 8%)' : '#fff',
                border: '1px solid hsl(217 33% 20%)',
                borderRadius: '12px',
                fontSize: '12px',
                boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
              }}
              labelStyle={{ color: isDark ? '#e5e7eb' : '#374151', fontWeight: 600 }}
            />
            <Area
              type="monotone"
              dataKey="criados"
              stroke="#818cf8"
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#colorCriados)"
              name="Criados"
            />
            <Area
              type="monotone"
              dataKey="concluídos"
              stroke="#34d399"
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#colorConcluidos)"
              name="Concluídos"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Legend */}
      <div className="flex items-center gap-4 mt-2 pt-2 border-t border-white/5">
        <div className="flex items-center gap-1.5">
          <div className="w-2 h-2 rounded-full bg-indigo-400" />
          <span className="text-xs text-muted-foreground">Criados ({totalCreated})</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-2 h-2 rounded-full bg-emerald-400" />
          <span className="text-xs text-muted-foreground">Concluídos ({totalCompleted})</span>
        </div>
      </div>
    </motion.div>
  );
}
