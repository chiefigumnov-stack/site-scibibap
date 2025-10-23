"use client";

import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

// Minimal stub data; will be moved to Supabase later
const REGIONS = [
  {
    id: 'RU-SEV',
    name: 'Северо-Запад',
    farms: [
      { name: 'Хозяйство Балтика', capacityTons: 1200, contact: '+7 (812) 000-00-00' },
      { name: 'Ладога Фиш', capacityTons: 800, contact: '+7 (812) 111-11-11' },
    ],
  },
  {
    id: 'RU-UR',
    name: 'Урал',
    farms: [
      { name: 'Урал Рыбпром', capacityTons: 500, contact: '+7 (343) 222-22-22' },
    ],
  },
  {
    id: 'RU-DA',
    name: 'Дальний Восток',
    farms: [
      { name: 'Сахалин Морепродукт', capacityTons: 3000, contact: '+7 (4242) 333-33-33' },
      { name: 'Приморье Аква', capacityTons: 2400, contact: '+7 (423) 444-44-44' },
    ],
  },
];

function prettyCapacity(value: number) {
  return new Intl.NumberFormat('ru-RU').format(value) + ' т/год';
}

export default function Map() {
  const sectionRef = useRef<HTMLDivElement | null>(null);
  const [activeId, setActiveId] = useState<string | null>(null);
  const active = REGIONS.find((r) => r.id === activeId) || REGIONS[0];

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const ctx = gsap.context(() => {
      gsap.from(el.querySelector('.map-card'), {
        y: 30,
        opacity: 0,
        duration: 0.9,
        ease: 'power3.out',
        scrollTrigger: { trigger: el, start: 'top 80%' },
      });
    }, el);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="relative bg-black py-24 md:py-32 aqua-noise">
      <div className="container mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-10 items-start">
        <div className="space-y-4">
          <h3 className="font-display text-3xl md:text-5xl">География поставок</h3>
          <p className="text-white/70 max-w-2xl">Кликните на регион — увидите хозяйства, объёмы и контакты. Позже данные будут подтягиваться из Supabase и обновляться ботом.</p>
          <div className="relative w-full aspect-[4/3] bg-ink/60 rounded-lg overflow-hidden border border-white/10">
            {/* Inline SVG Russia map (simplified) */}
            <svg viewBox="0 0 800 600" className="w-full h-full">
              {/* simplified geo areas; would be replaced by detailed paths */}
              <g>
                <path id="RU-SEV" onClick={() => setActiveId('RU-SEV')} className={`cursor-pointer transition-colors ${activeId === 'RU-SEV' ? 'fill-cyan/40' : 'fill-ink'}`} stroke="#1f2937" d="M120,180 L220,160 L300,190 L280,250 L180,260 Z" />
                <path id="RU-UR" onClick={() => setActiveId('RU-UR')} className={`cursor-pointer transition-colors ${activeId === 'RU-UR' ? 'fill-cyan/40' : 'fill-ink'}`} stroke="#1f2937" d="M320,200 L420,180 L500,210 L480,280 L360,290 Z" />
                <path id="RU-DA" onClick={() => setActiveId('RU-DA')} className={`cursor-pointer transition-colors ${activeId === 'RU-DA' ? 'fill-cyan/40' : 'fill-ink'}`} stroke="#1f2937" d="M540,220 L700,210 L760,250 L740,320 L560,300 Z" />
              </g>
            </svg>
          </div>
        </div>
        <div className="map-card rounded-lg border border-white/10 bg-black/40 p-6 backdrop-blur-sm">
          <h4 className="text-2xl font-semibold text-cyan mb-4">{active.name}</h4>
          <div className="space-y-3">
            {active.farms.map((f) => (
              <div key={f.name} className="flex items-start justify-between gap-4 border-b border-white/10 pb-3">
                <div>
                  <div className="font-medium">{f.name}</div>
                  <div className="text-white/60 text-sm">{f.contact}</div>
                </div>
                <div className="text-white/80">{prettyCapacity(f.capacityTons)}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
