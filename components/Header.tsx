"use client";

import Link from 'next/link';

export default function Header() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-black/30 backdrop-blur-md border-b border-cyan/10">
      <div className="mx-auto max-w-7xl px-6 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3">
          <img src="/logo-akva.svg" alt="АКВА Альянс" className="h-8 w-auto" />
          <span className="hidden sm:inline text-white/90 tracking-wider2">АКВА Альянс</span>
        </Link>
        <nav className="hidden md:flex items-center gap-6 text-sm text-white/80">
          <a href="#about" className="hover:text-white">О нас</a>
          <a href="#services" className="hover:text-white">Услуги</a>
          <a href="#portfolio" className="hover:text-white">Портфолио</a>
          <a href="#contact" className="hover:text-white">Контакты</a>
        </nav>
      </div>
    </header>
  );
}
