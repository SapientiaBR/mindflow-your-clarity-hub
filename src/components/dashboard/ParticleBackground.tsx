import { useEffect, useRef } from 'react';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  opacity: number;
  color: string;
  hue: number;
}

// More vibrant and fun colors
const COLORS = [
  'rgba(250, 204, 21, 0.7)',   // yellow
  'rgba(251, 146, 60, 0.6)',   // orange
  'rgba(244, 114, 182, 0.6)',  // pink
  'rgba(163, 230, 53, 0.5)',   // lime green
  'rgba(34, 211, 238, 0.6)',   // cyan
  'rgba(192, 132, 252, 0.6)',  // purple
  'rgba(74, 222, 128, 0.5)',   // green
  'rgba(251, 113, 133, 0.6)',  // rose
];

export default function ParticleBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const animationRef = useRef<number>();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resizeCanvas = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Initialize particles - more particles with varied sizes
    const particleCount = 100;
    particlesRef.current = Array.from({ length: particleCount }, () => {
      const hue = Math.random() * 360;
      return {
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 1.2,
        vy: (Math.random() - 0.5) * 1.2,
        size: Math.random() * 4 + 1,
        opacity: Math.random() * 0.7 + 0.3,
        color: COLORS[Math.floor(Math.random() * COLORS.length)],
        hue,
      };
    });

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particlesRef.current.forEach((particle) => {
        // Update position with slight wave motion
        particle.x += particle.vx + Math.sin(Date.now() * 0.001 + particle.hue) * 0.3;
        particle.y += particle.vy + Math.cos(Date.now() * 0.001 + particle.hue) * 0.2;

        // Wrap around edges
        if (particle.x < 0) particle.x = canvas.width;
        if (particle.x > canvas.width) particle.x = 0;
        if (particle.y < 0) particle.y = canvas.height;
        if (particle.y > canvas.height) particle.y = 0;

        // Draw particle with pulsing effect
        const pulse = Math.sin(Date.now() * 0.003 + particle.hue) * 0.3 + 1;
        const currentSize = particle.size * pulse;

        ctx.beginPath();
        ctx.arc(particle.x, particle.y, currentSize, 0, Math.PI * 2);
        ctx.fillStyle = particle.color;
        ctx.fill();

        // Draw colorful glow
        const gradient = ctx.createRadialGradient(
          particle.x, particle.y, 0,
          particle.x, particle.y, currentSize * 4
        );
        gradient.addColorStop(0, particle.color);
        gradient.addColorStop(0.5, particle.color.replace(/[\d.]+\)$/, '0.2)'));
        gradient.addColorStop(1, 'transparent');
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, currentSize * 4, 0, Math.PI * 2);
        ctx.fillStyle = gradient;
        ctx.fill();
      });

      // Draw colorful connections between nearby particles
      particlesRef.current.forEach((p1, i) => {
        particlesRef.current.slice(i + 1).forEach((p2) => {
          const dx = p1.x - p2.x;
          const dy = p1.y - p2.y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < 120) {
            const opacity = 0.25 * (1 - distance / 120);
            // Create gradient connection between particles
            const gradient = ctx.createLinearGradient(p1.x, p1.y, p2.x, p2.y);
            gradient.addColorStop(0, p1.color.replace(/[\d.]+\)$/, `${opacity})`));
            gradient.addColorStop(1, p2.color.replace(/[\d.]+\)$/, `${opacity})`));
            
            ctx.beginPath();
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = gradient;
            ctx.lineWidth = 1;
            ctx.stroke();
          }
        });
      });

      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none"
      style={{ opacity: 0.8 }}
    />
  );
}
