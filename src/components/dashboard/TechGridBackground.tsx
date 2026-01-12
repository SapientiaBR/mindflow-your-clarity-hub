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

    const gridSize = 40;
    let scanLineY = 0;
    const scanSpeed = 0.5;

    // Glowing points at intersections
    interface GlowPoint {
      x: number;
      y: number;
      intensity: number;
      maxIntensity: number;
      speed: number;
    }

    const glowPoints: GlowPoint[] = [];
    
    const initGlowPoints = () => {
      glowPoints.length = 0;
      for (let x = gridSize; x < canvas.width; x += gridSize * 2) {
        for (let y = gridSize; y < canvas.height; y += gridSize * 2) {
          if (Math.random() > 0.7) {
            glowPoints.push({
              x,
              y,
              intensity: Math.random(),
              maxIntensity: 0.3 + Math.random() * 0.4,
              speed: 0.01 + Math.random() * 0.02,
            });
          }
        }
      }
    };

    initGlowPoints();

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw grid lines
      ctx.strokeStyle = 'rgba(139, 92, 246, 0.08)';
      ctx.lineWidth = 1;

      // Vertical lines
      for (let x = 0; x <= canvas.width; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvas.height);
        ctx.stroke();
      }

      // Horizontal lines
      for (let y = 0; y <= canvas.height; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
        ctx.stroke();
      }

      // Draw glowing points
      glowPoints.forEach((point) => {
        point.intensity += point.speed;
        if (point.intensity > point.maxIntensity || point.intensity < 0) {
          point.speed = -point.speed;
        }

        const gradient = ctx.createRadialGradient(
          point.x, point.y, 0,
          point.x, point.y, 15
        );
        gradient.addColorStop(0, `rgba(0, 255, 255, ${point.intensity})`);
        gradient.addColorStop(0.5, `rgba(139, 92, 246, ${point.intensity * 0.5})`);
        gradient.addColorStop(1, 'transparent');

        ctx.beginPath();
        ctx.arc(point.x, point.y, 15, 0, Math.PI * 2);
        ctx.fillStyle = gradient;
        ctx.fill();
      });

      // Draw scan line
      scanLineY += scanSpeed;
      if (scanLineY > canvas.height) {
        scanLineY = 0;
      }

      const scanGradient = ctx.createLinearGradient(0, scanLineY - 30, 0, scanLineY + 30);
      scanGradient.addColorStop(0, 'transparent');
      scanGradient.addColorStop(0.5, 'rgba(0, 255, 255, 0.1)');
      scanGradient.addColorStop(1, 'transparent');

      ctx.fillStyle = scanGradient;
      ctx.fillRect(0, scanLineY - 30, canvas.width, 60);

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
      style={{ opacity: 0.8 }}
    />
  );
}
