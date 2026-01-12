import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface CircularProgressProps {
  value: number;
  size?: number;
  strokeWidth?: number;
  color?: 'cyan' | 'magenta' | 'purple' | 'green';
  label?: string;
  delay?: number;
}

const colorStyles = {
  cyan: { stroke: '#00FFFF', glow: 'drop-shadow(0 0 10px rgba(0,255,255,0.6))' },
  magenta: { stroke: '#FF00FF', glow: 'drop-shadow(0 0 10px rgba(255,0,255,0.6))' },
  purple: { stroke: '#8B5CF6', glow: 'drop-shadow(0 0 10px rgba(139,92,246,0.6))' },
  green: { stroke: '#10B981', glow: 'drop-shadow(0 0 10px rgba(16,185,129,0.6))' },
};

export default function CircularProgress({ 
  value, 
  size = 120, 
  strokeWidth = 8,
  color = 'purple',
  label,
  delay = 0
}: CircularProgressProps) {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const strokeDashoffset = circumference - (value / 100) * circumference;
  const colorStyle = colorStyles[color];

  return (
    <motion.div 
      className="relative inline-flex items-center justify-center"
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, delay }}
    >
      <svg
        width={size}
        height={size}
        className="transform -rotate-90"
        style={{ filter: colorStyle.glow }}
      >
        {/* Background circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="rgba(255,255,255,0.1)"
          strokeWidth={strokeWidth}
          fill="none"
        />
        
        {/* Progress circle */}
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={colorStyle.stroke}
          strokeWidth={strokeWidth}
          fill="none"
          strokeLinecap="round"
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset }}
          transition={{ duration: 1.5, delay: delay + 0.2, ease: "easeOut" }}
          style={{
            strokeDasharray: circumference,
          }}
        />
      </svg>
      
      {/* Center content */}
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <motion.span 
          className={cn(
            'text-2xl font-bold font-display',
            color === 'cyan' ? 'text-cyan-400' :
            color === 'magenta' ? 'text-pink-400' :
            color === 'purple' ? 'text-purple-400' :
            'text-emerald-400'
          )}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: delay + 0.5 }}
          style={{
            textShadow: `0 0 15px ${colorStyle.stroke}80`
          }}
        >
          {value}%
        </motion.span>
        {label && (
          <span className="text-[10px] text-muted-foreground uppercase tracking-wider mt-1">
            {label}
          </span>
        )}
      </div>
    </motion.div>
  );
}
