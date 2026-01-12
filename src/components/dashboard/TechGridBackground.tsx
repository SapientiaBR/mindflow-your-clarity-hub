import { useEffect, useRef } from 'react';

export default function TechGridBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

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

    // Floating bubbles/orbs
    interface Orb {
      x: number;
      y: number;
      radius: number;
      color: string;
      speed: number;
      angle: number;
    }

    const orbs: Orb[] = [];
    const orbColors = [
      'rgba(250, 204, 21, 0.15)',   // yellow
      'rgba(251, 146, 60, 0.12)',   // orange
      'rgba(244, 114, 182, 0.12)', // pink
      'rgba(139, 92, 246, 0.15)',   // purple
      'rgba(34, 211, 238, 0.12)',   // cyan
      'rgba(74, 222, 128, 0.10)',   // green
    ];

    // Initialize orbs
    for (let i = 0; i < 8; i++) {
      orbs.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        radius: Math.random() * 150 + 100,
        color: orbColors[i % orbColors.length],
        speed: Math.random() * 0.3 + 0.1,
        angle: Math.random() * Math.PI * 2,
      });
    }

    // Wave parameters
    let time = 0;

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      time += 0.01;

      // Draw soft flowing waves
      for (let w = 0; w < 3; w++) {
        ctx.beginPath();
        ctx.moveTo(0, canvas.height / 2);
        
        for (let x = 0; x <= canvas.width; x += 10) {
          const y = canvas.height / 2 + 
            Math.sin(x * 0.005 + time + w) * 50 +
            Math.sin(x * 0.01 + time * 1.5 + w) * 30 +
            (w - 1) * 100;
          ctx.lineTo(x, y);
        }
        
        ctx.lineTo(canvas.width, canvas.height);
        ctx.lineTo(0, canvas.height);
        ctx.closePath();
        
        const gradient = ctx.createLinearGradient(0, 0, canvas.width, 0);
        if (w === 0) {
          gradient.addColorStop(0, 'rgba(139, 92, 246, 0.08)');
          gradient.addColorStop(0.5, 'rgba(244, 114, 182, 0.08)');
          gradient.addColorStop(1, 'rgba(251, 146, 60, 0.08)');
        } else if (w === 1) {
          gradient.addColorStop(0, 'rgba(34, 211, 238, 0.06)');
          gradient.addColorStop(0.5, 'rgba(74, 222, 128, 0.06)');
          gradient.addColorStop(1, 'rgba(250, 204, 21, 0.06)');
        } else {
          gradient.addColorStop(0, 'rgba(251, 113, 133, 0.05)');
          gradient.addColorStop(0.5, 'rgba(192, 132, 252, 0.05)');
          gradient.addColorStop(1, 'rgba(163, 230, 53, 0.05)');
        }
        
        ctx.fillStyle = gradient;
        ctx.fill();
      }

      // Draw and animate orbs
      orbs.forEach((orb) => {
        // Move orb in a gentle circular/wandering path
        orb.angle += orb.speed * 0.02;
        orb.x += Math.cos(orb.angle) * orb.speed;
        orb.y += Math.sin(orb.angle * 0.7) * orb.speed * 0.5;

        // Keep orbs on screen with soft wrapping
        if (orb.x < -orb.radius) orb.x = canvas.width + orb.radius;
        if (orb.x > canvas.width + orb.radius) orb.x = -orb.radius;
        if (orb.y < -orb.radius) orb.y = canvas.height + orb.radius;
        if (orb.y > canvas.height + orb.radius) orb.y = -orb.radius;

        // Draw soft gradient orb
        const gradient = ctx.createRadialGradient(
          orb.x, orb.y, 0,
          orb.x, orb.y, orb.radius
        );
        gradient.addColorStop(0, orb.color);
        gradient.addColorStop(0.5, orb.color.replace(/[\d.]+\)$/, '0.05)'));
        gradient.addColorStop(1, 'transparent');

        ctx.beginPath();
        ctx.arc(orb.x, orb.y, orb.radius, 0, Math.PI * 2);
        ctx.fillStyle = gradient;
        ctx.fill();
      });

      // Draw subtle dotted pattern (less rigid than grid)
      ctx.fillStyle = 'rgba(255, 255, 255, 0.03)';
      const dotSpacing = 60;
      for (let x = 0; x < canvas.width; x += dotSpacing) {
        for (let y = 0; y < canvas.height; y += dotSpacing) {
          // Offset every other row for organic feel
          const offsetX = (Math.floor(y / dotSpacing) % 2) * (dotSpacing / 2);
          ctx.beginPath();
          ctx.arc(x + offsetX, y, 1.5, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none"
      style={{ opacity: 0.9 }}
    />
  );
}
