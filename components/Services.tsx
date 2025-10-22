"use client";

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const services = [
  {
    title: 'Spatial Strategy',
    description: 'Research-driven planning that aligns brand, business, and user needs.',
  },
  {
    title: 'Experience Design',
    description: 'Immersive environments and touchpoints with cinematic detail and flow.',
  },
  {
    title: 'Architecture',
    description: 'From concept to execution, form meets function with precision.',
  },
  {
    title: 'Production',
    description: 'Technical direction, fabrication, and on-site delivery at scale.',
  },
];

export default function Services() {
  const sectionRef = useRef<HTMLDivElement | null>(null);
  const cardsRef = useRef<HTMLDivElement[] | null[]>([]);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const ctx = gsap.context(() => {
      cardsRef.current.forEach((card, index) => {
        if (!card) return;
        gsap.fromTo(
          card,
          { y: 40, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.9,
            ease: 'power3.out',
            delay: index * 0.08,
            scrollTrigger: {
              trigger: el,
              start: 'top 75%',
            },
          }
        );
      });
    }, el);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="relative bg-ink py-24 md:py-32">
      <div className="container mx-auto px-6">
        <h3 className="font-display text-3xl md:text-5xl mb-12">Services</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {services.map((s, i) => (
            <div
              key={s.title}
              ref={(el: HTMLDivElement | null) => {
                cardsRef.current[i] = el;
              }}
              className="group relative rounded-lg border border-white/10 bg-black/40 p-6 backdrop-blur-sm overflow-hidden"
            >
              <div className="absolute -inset-y-10 -left-10 right-1/2 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity">
                <div className="gold-gradient w-40 h-40 rounded-full blur-3xl" />
              </div>
              <h4 className="text-xl font-semibold text-gold">{s.title}</h4>
              <p className="mt-3 text-white/80">{s.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
