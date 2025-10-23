"use client";

import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

// Basic region data + svg path ids; later map to Supabase
type Farm = { name: string; capacityTons: number; contact: string };
type Region = { id: string; name: string; farms: Farm[] };

const REGIONS: Region[] = [
  { id: 'RU-NW', name: 'Северо-Запад', farms: [ { name: 'Ладога Фиш', capacityTons: 800, contact: '+7 (812) 111-11-11' } ] },
  { id: 'RU-C', name: 'Центр', farms: [ { name: 'Волга Аква', capacityTons: 1100, contact: '+7 (495) 222-22-22' } ] },
  { id: 'RU-U', name: 'Урал', farms: [ { name: 'Урал Рыбпром', capacityTons: 500, contact: '+7 (343) 222-22-22' } ] },
  { id: 'RU-SIB', name: 'Сибирь', farms: [ { name: 'Обь Фиш', capacityTons: 900, contact: '+7 (383) 333-33-33' } ] },
  { id: 'RU-FE', name: 'Дальний Восток', farms: [ { name: 'Сахалин Морепродукт', capacityTons: 3000, contact: '+7 (4242) 333-33-33' } ] },
];

function prettyCapacity(value: number) {
  return new Intl.NumberFormat('ru-RU').format(value) + ' т/год';
}

export default function MapFull() {
  const sectionRef = useRef<HTMLDivElement | null>(null);
  const [activeId, setActiveId] = useState<string>('RU-FE');
  const [ripple, setRipple] = useState<{ x: number; y: number; key: number } | null>(null);
  const active = REGIONS.find((r) => r.id === activeId) || REGIONS[0];

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const ctx = gsap.context(() => {
      gsap.from(el.querySelector('.map-panel'), {
        y: 24,
        opacity: 0,
        duration: 1,
        ease: 'power3.out',
        scrollTrigger: { trigger: el, start: 'top 80%' },
      });
    }, el);
    return () => ctx.revert();
  }, []);

  const onRegionClick = (e: React.MouseEvent<SVGPathElement>, id: string) => {
    setActiveId(id);
    const rect = (e.currentTarget.ownerSVGElement as SVGSVGElement).getBoundingClientRect();
    setRipple({ x: e.clientX - rect.left, y: e.clientY - rect.top, key: Date.now() });
  };

  return (
    <section ref={sectionRef} className="relative bg-black py-24 md:py-32 aqua-noise">
      <div className="container mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-10 items-start">
        <div className="space-y-4">
          <h3 className="font-display text-3xl md:text-5xl">Карта поставок по регионам</h3>
          <p className="text-white/70 max-w-2xl">Выберите регион чтобы посмотреть хозяйства, примерные объёмы и контакты. Данные будут приходить из Supabase (интеграция позже).</p>
          <div className="relative w-full aspect-[4/3] bg-ink/60 rounded-lg overflow-hidden border border-white/10">
            <svg viewBox="0 0 1000 600" className="w-full h-full">
              <g stroke="#0b2b3a" strokeWidth="1.2">
                <path id="RU-NW" onClick={(e) => onRegionClick(e, 'RU-NW')} className={`cursor-pointer transition-all duration-300 ${activeId==='RU-NW'?'fill-cyan/40':'fill-ink'} hover:fill-cyan/30`} d="M130,210 L260,180 L330,210 L300,260 L180,280 Z" />
                <path id="RU-C" onClick={(e) => onRegionClick(e, 'RU-C')} className={`cursor-pointer transition-all duration-300 ${activeId==='RU-C'?'fill-cyan/40':'fill-ink'} hover:fill-cyan/30`} d="M340,210 L450,190 L520,220 L500,290 L380,300 Z" />
                <path id="RU-U" onClick={(e) => onRegionClick(e, 'RU-U')} className={`cursor-pointer transition-all duration-300 ${activeId==='RU-U'?'fill-cyan/40':'fill-ink'} hover:fill-cyan/30`} d="M530,220 L620,200 L690,230 L670,300 L560,310 Z" />
                <path id="RU-SIB" onClick={(e) => onRegionClick(e, 'RU-SIB')} className={`cursor-pointer transition-all duration-300 ${activeId==='RU-SIB'?'fill-cyan/40':'fill-ink'} hover:fill-cyan/30`} d="M700,230 L800,210 L870,240 L850,320 L730,330 Z" />
                <path id="RU-FE" onClick={(e) => onRegionClick(e, 'RU-FE')} className={`cursor-pointer transition-all duration-300 ${activeId==='RU-FE'?'fill-cyan/40':'fill-ink'} hover:fill-cyan/30`} d="M880,240 L950,230 L990,260 L970,330 L860,340 Z" />
              </g>
              {ripple && (
                <circle cx={ripple.x} cy={ripple.y} r="6" fill="none" stroke="#22d3ee" strokeWidth="2">
                  <animate attributeName="r" from="6" to="60" dur="1.2s" fill="freeze" />
                  <animate attributeName="opacity" from="0.6" to="0" dur="1.2s" fill="freeze" />
                </circle>
              )}
            </svg>
          </div>
        </div>
        <div className="map-panel relative rounded-lg border border-white/10 bg-black/40 p-6 backdrop-blur-sm">
          <h4 className="text-2xl font-semibold text-cyan mb-4">{active.name}</h4>
          <div className="space-y-3">
            {active.farms.map((f) => (
              <div key={f.name} className="group relative overflow-hidden rounded-md border border-white/10 p-4 bg-ink/60">
                <div className="absolute inset-0 aqua-shimmer opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="font-medium">{f.name}</div>
                    <div className="text-white/60 text-sm">{f.contact}</div>
                  </div>
                  <div className="text-aquamarine font-semibold">{prettyCapacity(f.capacityTons)}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
