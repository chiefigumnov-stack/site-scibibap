"use client";

import Image from 'next/image';
import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function Founder() {
  const sectionRef = useRef<HTMLDivElement | null>(null);
  const leftRef = useRef<HTMLDivElement | null>(null);
  const rightRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const ctx = gsap.context(() => {
      gsap.from(leftRef.current, {
        x: -50,
        opacity: 0,
        duration: 1,
        ease: 'power3.out',
        scrollTrigger: { trigger: el, start: 'top 80%' },
      });
      gsap.from(rightRef.current, {
        x: 50,
        opacity: 0,
        duration: 1,
        ease: 'power3.out',
        scrollTrigger: { trigger: el, start: 'top 80%' },
      });
    }, el);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="relative bg-ink py-24 md:py-32">
      <div className="container mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-center px-6">
        <div ref={leftRef} className="relative h-80 md:h-[30rem] w-full overflow-hidden rounded-md">
          <Image src="/founder.jpg" alt="Founder portrait" fill className="object-cover" />
        </div>
        <div ref={rightRef} className="space-y-6">
          <h3 className="font-display text-3xl md:text-5xl">Наш подход</h3>
          <p className="text-white/80">
            «Репутация строится на соблюдении холодовой цепи и точности сроков. Мы отвечаем цифрами»
          </p>
          <p className="text-white/60">— Основатель АКВА Альянс</p>
          <p className="text-white/70">
            Годы в аквакультуре и трейдинге. Широкая сеть поставщиков, контроль качества на каждом этапе,
            прозрачные условия для партнёров.
          </p>
        </div>
      </div>
    </section>
  );
}
