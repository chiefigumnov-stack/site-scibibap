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
      const tl = gsap.timeline({
        defaults: { ease: 'power3.out' },
        scrollTrigger: { trigger: el, start: 'top 75%' },
      });
      cardsRef.current.forEach((card, index) => {
        if (!card) return;
        tl.fromTo(
          card,
          { y: 50, opacity: 0, rotateX: 8, transformOrigin: '50% 100%' },
          { y: 0, opacity: 1, rotateX: 0, duration: 0.7 },
          index * 0.08
        );
        tl.to(card, { y: -6, duration: 0.6, ease: 'sine.inOut' }, index * 0.08 + 0.3);
        tl.to(card, { y: 0, duration: 0.6, ease: 'sine.inOut' }, index * 0.08 + 0.6);
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
