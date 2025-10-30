"use client";

import Link from 'next/link';
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

export default function Header() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 8);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 border-b transition-all duration-300 ${
      scrolled
        ? 'bg-black/60 backdrop-blur-lg border-cyan/20 shadow-[0_10px_30px_-15px_rgba(0,0,0,0.8)]'
        : 'bg-black/30 backdrop-blur-md border-cyan/10'
    }`}>
      <div className="mx-auto max-w-7xl px-6 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3 group">
          <motion.img
            src="/logo-akva.svg"
            alt="АКВА Альянс"
            className="h-8 w-auto transition-[filter] duration-300 will-change-transform drop-shadow-[0_0_0_rgba(34,211,238,0)] group-hover:drop-shadow-[0_0_18px_rgba(34,211,238,0.35)]"
            whileHover={{ scale: 1.06, rotate: 0.2 }}
            whileTap={{ scale: 0.98 }}
            transition={{ type: 'spring', stiffness: 320, damping: 20 }}
          />
          <span className="hidden sm:inline text-white/90 tracking-wider2 group-hover:text-white transition-colors">АКВА Альянс</span>
        </Link>
        <nav className="hidden md:flex items-center gap-6 text-sm text-white/80">
          <a href="#about" className="relative hover:text-white transition-colors after:absolute after:left-0 after:-bottom-1 after:h-[2px] after:w-0 after:bg-cyan/60 after:transition-[width] after:duration-300 hover:after:w-full">О нас</a>
          <a href="#services" className="relative hover:text-white transition-colors after:absolute after:left-0 after:-bottom-1 after:h-[2px] after:w-0 after:bg-cyan/60 after:transition-[width] after:duration-300 hover:after:w-full">Услуги</a>
          <a href="#portfolio" className="relative hover:text-white transition-colors after:absolute after:left-0 after:-bottom-1 after:h-[2px] after:w-0 after:bg-cyan/60 after:transition-[width] after:duration-300 hover:after:w-full">Портфолио</a>
          <a href="#contact" className="relative hover:text-white transition-colors after:absolute after:left-0 after:-bottom-1 after:h-[2px] after:w-0 after:bg-cyan/60 after:transition-[width] after:duration-300 hover:after:w-full">Контакты</a>
        </nav>
      </div>
    </header>
  );
}
