"use client";

import { useEffect, useRef, useState } from 'react';

export default function CursorSpotlight() {
  const [pos, setPos] = useState({ x: -9999, y: -9999 });
  const target = useRef({ x: -9999, y: -9999 });
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      target.current.x = e.clientX;
      target.current.y = e.clientY;
    };

    const animate = () => {
      setPos((p) => {
        const lerp = 0.12;
        const nx = p.x + (target.current.x - p.x) * lerp;
        const ny = p.y + (target.current.y - p.y) * lerp;
        return { x: nx, y: ny };
      });
      rafRef.current = requestAnimationFrame(animate);
    };
    rafRef.current = requestAnimationFrame(animate);

    window.addEventListener('mousemove', onMove);
    return () => {
      window.removeEventListener('mousemove', onMove);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  const radialSize = 260; // px

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        left: 0,
        top: 0,
        pointerEvents: 'none',
        zIndex: 8,
        mixBlendMode: 'screen',
        background: `radial-gradient(${radialSize}px ${radialSize}px at ${pos.x}px ${pos.y}px, rgba(34,211,238,0.18), rgba(0,0,0,0) 60%)`,
      }}
    />
  );
}
