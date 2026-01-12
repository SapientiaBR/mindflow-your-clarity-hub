import { motion } from 'framer-motion';
import { Area, AreaChart, ResponsiveContainer } from 'recharts';

interface MiniChartProps {
  data: number[];
  color?: 'cyan' | 'magenta' | 'purple' | 'green';
  height?: number;
}

const colorGradients = {
  cyan: { start: '#00FFFF', end: '#00FFFF00' },
  magenta: { start: '#FF00FF', end: '#FF00FF00' },
  purple: { start: '#8B5CF6', end: '#8B5CF600' },
  green: { start: '#10B981', end: '#10B98100' },
};

export default function MiniChart({ data, color = 'purple', height = 40 }: MiniChartProps) {
  const chartData = data.map((value, index) => ({ value, index }));
  const gradientId = `gradient-${color}-${Math.random().toString(36).substr(2, 9)}`;
  const colors = colorGradients[color];

  return (
    <motion.div 
      className="w-full"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      style={{ height }}
    >
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={chartData} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={colors.start} stopOpacity={0.4} />
              <stop offset="100%" stopColor={colors.end} stopOpacity={0} />
            </linearGradient>
          </defs>
          <Area
            type="monotone"
            dataKey="value"
            stroke={colors.start}
            strokeWidth={2}
            fill={`url(#${gradientId})`}
            isAnimationActive={true}
            animationDuration={1500}
          />
        </AreaChart>
      </ResponsiveContainer>
    </motion.div>
  );
}
