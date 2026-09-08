import React, { useEffect, useRef } from 'react';

/**
 * HeroThermalAtmosphere
 * Micro-atmospheric thermal air current and particle canvas embedded in the Air Temperature hero card.
 * Intelligently modulates particle velocity, thermal wave amplitude, and color palette based on ambient air temperature.
 */
export default function HeroThermalAtmosphere({ temperature = 37.0 }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    let animationId;
    let width = (canvas.width = canvas.parentElement?.clientWidth || 400);
    let height = (canvas.height = canvas.parentElement?.clientHeight || 240);

    const handleResize = () => {
      if (!canvas || !canvas.parentElement) return;
      width = canvas.width = canvas.parentElement.clientWidth;
      height = canvas.height = canvas.parentElement.clientHeight;
    };
    window.addEventListener('resize', handleResize);

    // Thermal parameters derived from temperature
    const isHot = temperature >= 38;
    const isWarm = temperature >= 33 && temperature < 38;
    
    // Palette selection
    const primaryColor = isHot 
      ? 'rgba(255, 69, 0, 0.4)' 
      : isWarm 
        ? 'rgba(255, 167, 38, 0.35)' 
        : 'rgba(56, 189, 248, 0.3)';

    const secondaryColor = isHot 
      ? 'rgba(239, 68, 68, 0.25)' 
      : isWarm 
        ? 'rgba(234, 179, 8, 0.22)' 
        : 'rgba(16, 185, 129, 0.2)';

    const particleCount = isHot ? 45 : isWarm ? 35 : 24;
    const speedMult = isHot ? 1.4 : isWarm ? 1.0 : 0.7;

    const particles = [];
    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        r: 1 + Math.random() * 2.2,
        vy: (0.4 + Math.random() * 0.8) * speedMult,
        vx: (Math.random() - 0.5) * 0.5 * speedMult,
        opacity: 0.15 + Math.random() * 0.45,
        pulseSpeed: 0.02 + Math.random() * 0.03,
        phase: Math.random() * Math.PI * 2
      });
    }

    let time = 0;

    const render = () => {
      time += 0.02 * speedMult;
      ctx.clearRect(0, 0, width, height);

      // 1. Subtle Thermal Wave Shimmer along card floor
      const waveCount = 2;
      for (let w = 0; w < waveCount; w++) {
        ctx.beginPath();
        ctx.moveTo(0, height);
        
        for (let x = 0; x <= width; x += 15) {
          const waveY = height - 25 - (w * 18) + 
            Math.sin(x * 0.015 + time + w * 1.5) * (8 * speedMult) + 
            Math.cos(x * 0.03 - time * 0.5) * 4;
          ctx.lineTo(x, waveY);
        }

        ctx.lineTo(width, height);
        ctx.closePath();
        
        const grad = ctx.createLinearGradient(0, height - 60, 0, height);
        grad.addColorStop(0, w === 0 ? primaryColor : secondaryColor);
        grad.addColorStop(1, 'rgba(255, 255, 255, 0)');
        ctx.fillStyle = grad;
        ctx.fill();
      }

      // 2. Rising Convective Shimmer Micro-Particles
      for (const p of particles) {
        p.y -= p.vy;
        p.x += p.vx + Math.sin(time + p.phase) * 0.3;
        p.phase += p.pulseSpeed;

        // Wrap around when rising past top
        if (p.y < -10) {
          p.y = height + 10;
          p.x = Math.random() * width;
        }

        const currentOpacity = p.opacity * (0.7 + Math.sin(p.phase) * 0.3);
        
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = isHot 
          ? `rgba(255, 122, 24, ${currentOpacity})` 
          : isWarm 
            ? `rgba(251, 191, 36, ${currentOpacity})` 
            : `rgba(56, 189, 248, ${currentOpacity})`;
        ctx.fill();
      }

      animationId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', handleResize);
    };
  }, [temperature]);

  return (
    <canvas 
      ref={canvasRef} 
      className="absolute inset-0 w-full h-full pointer-events-none z-0 rounded-3xl"
      aria-hidden="true"
    />
  );
}
