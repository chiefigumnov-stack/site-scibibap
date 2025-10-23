"use client";

import Image from 'next/image';
import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const gallery = [
  '/p1.jpg',
  '/p2.jpg',
  '/p3.jpg',
  '/p4.jpg',
  '/p5.jpg',
];

export default function Portfolio() {
  const sectionRef = useRef<HTMLDivElement | null>(null);
  const trackRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const sectionEl = sectionRef.current;
    const trackEl = trackRef.current;
    if (!sectionEl || !trackEl) return;

    const ctx = gsap.context(() => {
      const totalWidth = trackEl.scrollWidth - window.innerWidth;

      gsap.to(trackEl, {
        x: () => -totalWidth,
        ease: 'none',
        scrollTrigger: {
          trigger: sectionEl,
          start: 'top top',
          end: () => `+=${totalWidth}`,
          scrub: true,
          pin: true,
          anticipatePin: 1,
        },
      });

      trackEl.querySelectorAll('[data-item]').forEach((item, i) => {
        gsap.from(item, {
          opacity: 0,
          y: 30,
          duration: 0.8,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: item as Element,
            start: 'left center',
          },
          delay: i * 0.05,
        });
      });
    }, sectionEl);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="relative bg-black py-24 md:py-32 aqua-noise aqua-grid">
      <div className="container mx-auto px-6 mb-10">
        <h3 className="font-display text-3xl md:text-5xl">Кейсы поставок</h3>
      </div>
      <div ref={trackRef} className="flex gap-6 px-6 will-change-transform">
        {gallery.map((src, idx) => (
          <div key={src} data-item className="relative h-72 md:h-96 min-w-[80vw] md:min-w-[40vw] lg:min-w-[32vw] overflow-hidden rounded-md">
            <Image src={src} alt={`Project ${idx + 1}`} fill className="object-cover" />
          </div>
        ))}
      </div>
    </section>
  );
}
