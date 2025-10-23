"use client";

import Image from 'next/image';
import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { motion, Variants } from 'framer-motion';
import { useLenisScroll } from '@/hooks/useLenisScroll';

gsap.registerPlugin(ScrollTrigger);

export default function Hero() {
  useLenisScroll();
  const rootRef = useRef<HTMLDivElement | null>(null);
  const headlineRef = useRef<HTMLHeadingElement | null>(null);
  const subRef = useRef<HTMLParagraphElement | null>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline();
      tl.fromTo(
        rootRef.current,
        { scale: 1.05, opacity: 0 },
        { scale: 1, opacity: 1, duration: 1.2, ease: 'power3.out' }
      )
        .from(
          subRef.current,
          { y: 20, opacity: 0, duration: 0.8, ease: 'power3.out' },
          '-=0.5'
        );

      // parallax for watermark logo
      const wm = document.querySelector('.logo-watermark');
      if (wm) {
        gsap.to(wm, {
          yPercent: 8,
          scale: 1.05,
          ease: 'none',
          scrollTrigger: {
            trigger: rootRef.current,
            start: 'top top',
            end: 'bottom top',
            scrub: true,
          },
        });
      }
    }, rootRef);

    return () => ctx.revert();
  }, []);

  const containerVariants: Variants = {
    animate: {
      transition: {
        staggerChildren: 0.045,
      },
    },
  };

  const letterVariants: Variants = {
    initial: { opacity: 0, y: 24, rotateX: 15, skewY: 2 },
    animate: {
      opacity: 1,
      y: 0,
      rotateX: 0,
      skewY: 0,
      transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] },
    },
  };

  const words = ['Создаём', 'ценность', 'через', 'пространство'];

  return (
    <section ref={rootRef} className="relative h-[100svh] w-full bg-black overflow-hidden aqua-noise">
      <Image
        src="/hero.jpg"
        alt="Водная текстура"
        fill
        priority
        className="object-cover opacity-70"
      />
      <div className="relative z-10 h-full flex flex-col items-center justify-center text-center px-6 ocean-gradient">
        <div className="flex items-center gap-4 mb-6">
          <img src="/logo-akva.jpg" alt="АКВА Альянс" className="h-10 w-auto rounded-sm" />
        </div>
        <motion.h1
          ref={headlineRef}
          className="font-display text-5xl md:text-7xl lg:text-8xl tracking-tight max-w-6xl leading-[0.95]"
          variants={containerVariants}
          initial="initial"
          animate="animate"
        >
          {words.map((word, wi) => (
            <span key={wi} className="inline-block mr-3">
              {Array.from(word).map((ch, i) => (
                <motion.span
                  key={`${wi}-${i}`}
                  variants={letterVariants}
                  style={{ display: 'inline-block', willChange: 'transform' }}
                  className={wi === 1 ? 'text-gold' : ''}
                >
                  {ch}
                </motion.span>
              ))}
            </span>
          ))}
        </motion.h1>
        <p ref={subRef} className="mt-6 max-w-3xl text-lg md:text-xl text-white/80">
          We craft transformative environments that elevate brands and experiences.
        </p>
        <motion.a
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.98 }}
          href="#about"
          className="mt-10 inline-flex items-center gap-2 rounded-full border border-gold px-8 py-3 text-sm tracking-wider2 text-gold hover:text-black hover:bg-gold transition-colors"
        >
          Explore Our Work
        </motion.a>
      </div>
      <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-black/60 to-black/10" />
      <div className="absolute inset-0 pointer-events-none logo-watermark" />
    </section>
  );
}
