import React, { useEffect, useRef } from 'react';
import { ChemicalElement } from '../../types';

interface BohrAtomModelProps {
  element: ChemicalElement;
}

export const BohrAtomModel: React.FC<BohrAtomModelProps> = ({ element }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationId: number;
    let angle = 0;

    const size = 300;
    canvas.width = size;
    canvas.height = size;
    const centerX = size / 2;
    const centerY = size / 2;

    const shells = element.shells && element.shells.length > 0
      ? element.shells
      : [Math.min(2, element.number), Math.max(0, element.number - 2)].filter(n => n > 0);

    const maxRadius = 120;
    const baseRadius = 35;
    const radiusStep = shells.length > 1 ? (maxRadius - baseRadius) / (shells.length - 1) : 0;

    const render = () => {
      ctx.clearRect(0, 0, size, size);

      // 1. Draw glowing nucleus (Protons & Neutrons)
      const nucleusRadius = 22;
      const gradient = ctx.createRadialGradient(centerX, centerY, 2, centerX, centerY, nucleusRadius);
      gradient.addColorStop(0, '#0284c7');
      gradient.addColorStop(0.7, '#0369a1');
      gradient.addColorStop(1, '#075985');

      ctx.beginPath();
      ctx.arc(centerX, centerY, nucleusRadius, 0, Math.PI * 2);
      ctx.fillStyle = gradient;
      ctx.shadowColor = 'rgba(2, 132, 199, 0.35)';
      ctx.shadowBlur = 10;
      ctx.fill();
      ctx.shadowBlur = 0;

      // Nucleus text (Element symbol + Protons)
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 12px monospace';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(element.symbol, centerX, centerY - 4);
      ctx.font = 'bold 9px sans-serif';
      ctx.fillStyle = '#e0f2fe';
      ctx.fillText(`${element.number}p+`, centerX, centerY + 8);

      // 2. Draw electron shells and orbiting electrons
      shells.forEach((electronCount, shellIdx) => {
        const shellRadius = shells.length === 1 ? 55 : baseRadius + shellIdx * radiusStep;

        // Shell orbit path
        ctx.beginPath();
        ctx.arc(centerX, centerY, shellRadius, 0, Math.PI * 2);
        ctx.strokeStyle = 'rgba(2, 132, 199, 0.35)';
        ctx.lineWidth = 1.2;
        ctx.setLineDash([4, 4]);
        ctx.stroke();
        ctx.setLineDash([]);

        // Orbit speed
        const shellSpeed = (0.015 / (shellIdx + 1)) * (shellIdx % 2 === 0 ? 1 : -1);
        const currentShellAngle = angle * shellSpeed * 60;

        // Draw electrons evenly spaced around the shell
        for (let i = 0; i < electronCount; i++) {
          const electronAngle = currentShellAngle + (i * (Math.PI * 2)) / electronCount;
          const ex = centerX + Math.cos(electronAngle) * shellRadius;
          const ey = centerY + Math.sin(electronAngle) * shellRadius;

          // Electron glow
          ctx.beginPath();
          ctx.arc(ex, ey, 5, 0, Math.PI * 2);
          ctx.fillStyle = '#0284c7';
          ctx.shadowColor = 'rgba(2, 132, 199, 0.5)';
          ctx.shadowBlur = 6;
          ctx.fill();
          ctx.shadowBlur = 0;

          // Electron core dot
          ctx.beginPath();
          ctx.arc(ex, ey, 2.2, 0, Math.PI * 2);
          ctx.fillStyle = '#ffffff';
          ctx.fill();
        }

        // Shell label
        const shellNames = ['K', 'L', 'M', 'N', 'O', 'P', 'Q'];
        ctx.fillStyle = '#475569';
        ctx.font = 'bold 9px monospace';
        ctx.fillText(
          `${shellNames[shellIdx] || ''} (${electronCount}e⁻)`,
          centerX + shellRadius + 2,
          centerY - 3
        );
      });

      angle += 0.02;
      animationId = requestAnimationFrame(render);
    };

    render();

    return () => cancelAnimationFrame(animationId);
  }, [element]);

  return (
    <div className="flex flex-col items-center justify-center p-3 rounded-2xl bg-slate-50 border border-slate-200 shadow-xs">
      <div className="text-[11px] font-bold text-cyan-800 uppercase tracking-wider mb-1 flex items-center gap-1.5">
        <span className="w-2 h-2 rounded-full bg-cyan-600 animate-ping"></span>
        Model Atom Bohr & Orbit Elektron
      </div>
      <canvas ref={canvasRef} className="w-[240px] h-[240px] max-w-full" />
      <div className="flex flex-wrap items-center justify-center gap-2 text-[10px] text-slate-600 mt-2">
        <span className="bg-white px-2 py-0.5 rounded border border-slate-200 shadow-2xs font-semibold">
          Proton: <strong className="text-cyan-700">{element.number}</strong>
        </span>
        <span className="bg-white px-2 py-0.5 rounded border border-slate-200 shadow-2xs font-semibold">
          Neutron: <strong className="text-cyan-700">{Math.round(element.atomicMass - element.number)}</strong>
        </span>
        <span className="bg-white px-2 py-0.5 rounded border border-slate-200 shadow-2xs font-semibold">
          Elektron: <strong className="text-cyan-700">{element.number}</strong>
        </span>
      </div>
    </div>
  );
};
