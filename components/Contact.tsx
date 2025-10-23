"use client";

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function Contact() {
  const sectionRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const ctx = gsap.context(() => {
      gsap.from(el.querySelector('form'), {
        y: 40,
        opacity: 0,
        duration: 1,
        ease: 'power3.out',
        scrollTrigger: { trigger: el, start: 'top 85%' },
      });
    }, el);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="relative bg-black py-24 md:py-32 aqua-noise aqua-grid">
      <div className="container mx-auto px-6 max-w-3xl">
        <h3 className="font-display text-3xl md:text-5xl mb-10">Свяжитесь с нами</h3>
        <form className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input className="bg-ink/60 border border-white/10 rounded-md p-3 outline-none focus:border-cyan" placeholder="Name" />
            <input className="bg-ink/60 border border-white/10 rounded-md p-3 outline-none focus:border-cyan" placeholder="Email" />
          </div>
          <input className="w-full bg-ink/60 border border-white/10 rounded-md p-3 outline-none focus:border-cyan" placeholder="Компания" />
          <textarea className="w-full bg-ink/60 border border-white/10 rounded-md p-3 outline-none focus:border-cyan" placeholder="Ваш запрос: рыба, корма, объёмы, сроки" rows={5} />
          <button className="mt-4 rounded-full border border-cyan/40 px-8 py-3 text-sm tracking-wider2 text-cyan hover:text-black hover:bg-cyan/80 transition-colors">Отправить</button>
        </form>
      </div>
    </section>
  );
}
