"use client";

import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';

export default function Preloader() {
  const [done, setDone] = useState(false);
  const rootRef = useRef<HTMLDivElement | null>(null);
  const logoRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const el = rootRef.current;
    const logo = logoRef.current;
    if (!el || !logo) return;
    const tl = gsap.timeline({
      defaults: { ease: 'power3.out' },
      onComplete: () => setDone(true),
    });

    tl.set(el, { pointerEvents: 'auto' })
      .fromTo(logo, { scale: 0.8, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.9 })
      .to(logo, { scale: 1.06, duration: 0.6 })
      .to(el, { opacity: 0, duration: 0.8 }, '-=0.2')
      .set(el, { display: 'none' });
  }, []);

  if (done) return null;

  return (
    <div ref={rootRef} className="fixed inset-0 z-[100] bg-black flex items-center justify-center">
      <div ref={logoRef} className="flex items-center gap-3">
        <img src="/logo-akva.svg" alt="АКВА Альянс" className="h-8 w-auto" />
        <span className="text-gold text-xl tracking-wider2">АКВА Альянс</span>
      </div>
    </div>
  );
}
