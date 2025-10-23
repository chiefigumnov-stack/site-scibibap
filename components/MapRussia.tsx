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

function project([lon, lat]: [number, number], w: number, h: number) {
  // Equirectangular projection (placeholder); for better accuracy use mercator via d3-geo in future
  const x = ((lon + 180) / 360) * w;
  const y = ((90 - lat) / 180) * h;
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

  const width = 1000;
  const height = 600;
  const active: Region | null = activeName && STUB[activeName] ? STUB[activeName] : null;

  return (
    <section ref={sectionRef} className="relative bg-black py-24 md:py-32 aqua-noise">
      <div className="container mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-10 items-start">
        <div className="space-y-4">
          <h3 className="font-display text-3xl md:text-5xl">Карта России (точная геометрия)</h3>
          <p className="text-white/70 max-w-2xl">Кликайте по регионам — справа появится информация по хозяйствам. Позже данные подтянем из Supabase.</p>
          <div className="relative w-full aspect-[5/3] bg-ink/60 rounded-lg overflow-hidden border border-white/10">
            <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-full">
              {geo?.features.map((f, idx) => {
                const name = (f.properties.name as string) || `Region ${idx}`;
                if (f.geometry.type === 'Polygon') {
                  const d = pathFromPolygon([f.geometry.coordinates as any], width, height);
                  return (
                    <path key={idx} d={d} onClick={() => setActiveName(name)} className={`cursor-pointer transition-all duration-300 ${activeName===name? 'fill-cyan/40' : 'fill-ink'} hover:fill-cyan/30`} stroke="#0b2b3a" strokeWidth={1} />
                  );
                } else if (f.geometry.type === 'MultiPolygon') {
                  const d = (f.geometry.coordinates as any[])
                    .map((poly) => pathFromPolygon([poly as any], width, height))
                    .join(' ');
                  return (
                    <path key={idx} d={d} onClick={() => setActiveName(name)} className={`cursor-pointer transition-all duration-300 ${activeName===name? 'fill-cyan/40' : 'fill-ink'} hover:fill-cyan/30`} stroke="#0b2b3a" strokeWidth={1} />
                  );
                }
                return null;
              })}
            </svg>
          </div>
        </div>
        <div className="map-panel relative rounded-lg border border-white/10 bg-black/40 p-6 backdrop-blur-sm min-h-[16rem]">
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
