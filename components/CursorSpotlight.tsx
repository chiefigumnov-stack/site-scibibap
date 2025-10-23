"use client";

import { useEffect, useState } from 'react';

export default function CursorSpotlight() {
  const [pos, setPos] = useState({ x: -9999, y: -9999 });

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      setPos({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', onMove);
    return () => window.removeEventListener('mousemove', onMove);
  }, []);

  return (
    <div
      style={{
        left: 0,
        top: 0,
        position: 'fixed',
        pointerEvents: 'none',
        inset: 0,
        zIndex: 5,
        background: `radial-gradient(220px 220px at ${pos.x}px ${pos.y}px, rgba(34,211,238,0.16), rgba(0,0,0,0) 60%)`,
      }}
    />
  );
}
