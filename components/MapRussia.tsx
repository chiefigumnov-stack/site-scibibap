"use client";

import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Simple GeoJSON renderer using <path> converted on the fly
// NOTE: This is a lightweight approximation and not a full GIS engine. For production, consider topojson and projection libs.

gsap.registerPlugin(ScrollTrigger);

type Farm = { name: string; capacityTons: number; contact: string };
type Region = { id: string; name: string; farms: Farm[] };

type GeoFeature = {
  type: 'Feature';
  properties: { name?: string; id?: string; [key: string]: any };
  geometry: { type: string; coordinates: any };
};

type GeoJSON = { type: 'FeatureCollection'; features: GeoFeature[] };

const STUB: Record<string, Region> = {
  'Saint Petersburg City': { id: 'RU-NW', name: 'Санкт‑Петербург', farms: [{ name: 'Балтика', capacityTons: 1200, contact: '+7 (812) 000-00-00' }]},
  'Sakhalin Oblast': { id: 'RU-FE', name: 'Сахалин', farms: [{ name: 'Сахалин Морепродукт', capacityTons: 3000, contact: '+7 (4242) 333-33-33' }]},
};

function prettyCapacity(value: number) {
  return new Intl.NumberFormat('ru-RU').format(value) + ' т/год';
}

function project([rawLon, rawLat]: [number, number], w: number, h: number) {
  // Web Mercator-like projection with longitude wrap
  let lon = rawLon;
  const lat = Math.max(-85, Math.min(85, rawLat)); // clamp to avoid infinity
  if (lon > 180) lon -= 360;
  if (lon < -180) lon += 360;
  const x = ((lon + 180) / 360) * w;
  const phi = (lat * Math.PI) / 180;
  const mercY = Math.log(Math.tan(Math.PI / 4 + phi / 2));
  const y = (1 - mercY / Math.PI) * (h / 2);
  return [x, y];
}

function pathFromPolygon(coords: number[][][], w: number, h: number) {
  return coords
    .map((ring) =>
      ring
        .map((pt, i) => {
          const [x, y] = project(pt as any, w, h);
          return `${i === 0 ? 'M' : 'L'}${x.toFixed(2)},${y.toFixed(2)}`;
        })
        .join(' ') + ' Z'
    )
    .join(' ');
}

export default function MapRussia() {
  const sectionRef = useRef<HTMLDivElement | null>(null);
  const [geo, setGeo] = useState<GeoJSON | null>(null);
  const [activeName, setActiveName] = useState<string | null>(null);
  const [hoverName, setHoverName] = useState<string | null>(null);
  const [vp, setVp] = useState({ x: 0, y: 0, k: 1 });

  useEffect(() => {
    fetch('/data/russia.geojson')
      .then((r) => r.json())
      .then((j) => setGeo(j as GeoJSON))
      .catch(() => setGeo(null));
  }, []);

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

  const width = 1600;
  const height = 900;
  const active: Region | null = activeName && STUB[activeName] ? STUB[activeName] : null;

  return (
    <section ref={sectionRef} className="relative bg-black py-24 md:py-32 aqua-noise">
      <div className="container mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
        <div className="space-y-4 order-2 lg:order-1">
          <h3 className="font-display text-3xl md:text-5xl">Карта России (точная геометрия)</h3>
          <p className="text-white/70 max-w-2xl">Кликайте по регионам — справа появится информация по хозяйствам. Позже данные подтянем из Supabase.</p>
          <div className="relative w-full aspect-[16/9] bg-ink/60 rounded-2xl overflow-hidden border border-cyan/15 shadow-xl">
            <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-full" onWheel={(e)=>{
              e.preventDefault();
              const delta = -Math.sign(e.deltaY) * 0.1;
              setVp((p)=>({ ...p, k: Math.max(0.6, Math.min(3, p.k + delta)) }));
            }} onMouseDown={(e)=>{
              const startX=e.clientX, startY=e.clientY; const start=vp;
              const onMove=(ev:MouseEvent)=>{ setVp((p)=>({ ...p, x: start.x + (ev.clientX-startX), y: start.y + (ev.clientY-startY) })); };
              const onUp=()=>{ window.removeEventListener('mousemove', onMove); window.removeEventListener('mouseup', onUp); };
              window.addEventListener('mousemove', onMove); window.addEventListener('mouseup', onUp);
            }}>
              <g transform={`translate(${vp.x} ${vp.y}) scale(${vp.k})`}>
              {geo?.features.map((f, idx) => {
                const name = (f.properties.name as string) || `Region ${idx}`;
                if (f.geometry.type === 'Polygon') {
                  const coords = f.geometry.coordinates as unknown as number[][][]; // rings
                  const d = pathFromPolygon(coords, width, height);
                  const isActive = activeName===name; const isHover = hoverName===name;
                  return (
                    <path key={idx} d={d} onClick={() => setActiveName(name)} onMouseEnter={()=>setHoverName(name)} onMouseLeave={()=>setHoverName(null)} className={`cursor-pointer transition-all duration-200 ${isActive? 'fill-cyan/40' : isHover? 'fill-cyan/25' : 'fill-ink'}`} stroke={isActive? '#22d3ee' : isHover? '#1db8c8' : '#0b2b3a'} strokeWidth={isActive? 2 : 1} fillRule="evenodd" />
                  );
                } else if (f.geometry.type === 'MultiPolygon') {
                  const polys = f.geometry.coordinates as unknown as number[][][][]; // polygons->rings
                  const d = polys.map((poly) => pathFromPolygon(poly as unknown as number[][][], width, height)).join(' ');
                  const isActive = activeName===name; const isHover = hoverName===name;
                  return (
                    <path key={idx} d={d} onClick={() => setActiveName(name)} onMouseEnter={()=>setHoverName(name)} onMouseLeave={()=>setHoverName(null)} className={`cursor-pointer transition-all duration-200 ${isActive? 'fill-cyan/40' : isHover? 'fill-cyan/25' : 'fill-ink'}`} stroke={isActive? '#22d3ee' : isHover? '#1db8c8' : '#0b2b3a'} strokeWidth={isActive? 2 : 1} fillRule="evenodd" />
                  );
                }
                return null;
              })}
              </g>
            </svg>
            {hoverName && (
              <div className="pointer-events-none absolute left-2 top-2 rounded-md bg-black/70 border border-cyan/20 px-3 py-1 text-sm text-cyan">
                {hoverName}
              </div>
            )}
          </div>
        </div>
        <div className="map-panel relative rounded-2xl border border-cyan/15 bg-black/40 p-6 backdrop-blur-md min-h-[20rem] order-1 lg:order-2">
          <h4 className="text-2xl font-semibold text-cyan mb-2">{active ? active.name : 'Выберите регион'}</h4>
          {active ? (
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
          ) : (
            <div className="text-white/60">Наведите курсор и кликните по региону на карте.</div>
          )}
        </div>
      </div>
    </section>
  );
}
