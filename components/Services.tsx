"use client";

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const services = [
  {
    title: 'Трейдинг рыбы',
    description: 'Оптовые поставки охлаждённой и замороженной рыбы. Контролируем качество и сроки.',
  },
  {
    title: 'Корма для аквакультуры',
    description: 'Подбор и поставки кормов под ваш цикл выращивания. Документы и логистика.',
  },
  {
    title: 'Логистика и холодовая цепь',
    description: 'Температурный режим по всей цепочке. Проверенные перевозчики и склады.',
  },
  {
    title: 'Консалтинг и аудит',
    description: 'Помогаем оптимизировать закупки, хранение и качество сырья.',
  },
];

export default function Services() {
  const sectionRef = useRef<HTMLDivElement | null>(null);
  const cardsRef = useRef<HTMLDivElement[] | null[]>([]);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
      cardsRef.current.forEach((card, index) => {
        if (!card) return;
        tl.fromTo(
          card,
          { y: 80, opacity: 0, rotateX: 12, rotateY: -6, transformOrigin: '50% 100%' },
          { y: 0, opacity: 1, rotateX: 0, rotateY: 0, duration: 0.9 },
          index * 0.12
        );
      });
      ScrollTrigger.create({
        trigger: el,
        start: 'top 75%',
        animation: tl,
        once: true,
      });
    }, el);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="relative bg-ink py-24 md:py-32 aqua-noise">
      <div className="container mx-auto px-6">
        <h3 className="font-display text-3xl md:text-5xl mb-12">Услуги</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {services.map((s, i) => (
            <div
              key={s.title}
              ref={(el: HTMLDivElement | null) => {
                cardsRef.current[i] = el;
              }}
              className="group relative rounded-2xl border border-cyan/15 bg-gradient-to-br from-ink/70 to-navy/60 p-6 backdrop-blur-md overflow-hidden"
            >
              <div className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity">
                <div className="absolute -left-16 top-1/2 -translate-y-1/2 w-64 h-64 rounded-full blur-3xl" style={{ background: 'radial-gradient(circle, rgba(34,211,238,.18) 0%, transparent 70%)' }} />
              </div>
              <div className="relative">
                <div className="inline-flex items-center gap-2 rounded-full border border-cyan/20 px-3 py-1 text-xs text-cyan/90 bg-black/30">Аквакультура</div>
                <h4 className="mt-4 text-xl font-semibold text-cyan/90">{s.title}</h4>
                <p className="mt-3 text-white/80">{s.description}</p>
              </div>
              <div className="absolute right-4 bottom-4 text-white/50 text-xs">Подробнее →</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
