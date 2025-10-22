"use client";

import Image from 'next/image';
import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function About() {
  const sectionRef = useRef<HTMLDivElement | null>(null);
  const leftRef = useRef<HTMLDivElement | null>(null);
  const rightRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const ctx = gsap.context(() => {
      gsap.from(leftRef.current, {
        x: -80,
        opacity: 0,
        duration: 1,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: el,
          start: 'top 80%',
        },
      });
      gsap.from(rightRef.current, {
        x: 80,
        opacity: 0,
        duration: 1,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: el,
          start: 'top 80%',
        },
      });
    }, el);
    return () => ctx.revert();
  }, []);

  return (
    <section id="about" ref={sectionRef} className="relative bg-black py-24 md:py-32">
      <div className="container mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-center px-6">
        <div ref={leftRef} className="space-y-6">
          <h2 className="font-display text-3xl md:text-5xl">Design That Performs</h2>
          <p className="text-white/80">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer euismod, nunc eget aliquet
            pulvinar, ligula nunc finibus augue, nec facilisis ex massa in lorem. We balance aesthetics and
            performance to create unforgettable spaces.
          </p>
          <p className="text-white/60">
            Our multidisciplinary team works across architecture, brand environments, and experiential design.
          </p>
        </div>
        <div ref={rightRef} className="relative h-80 md:h-[28rem] w-full">
          <Image src="/about.jpg" alt="About visual" fill className="object-cover rounded-md" />
        </div>
      </div>
    </section>
  );
}
