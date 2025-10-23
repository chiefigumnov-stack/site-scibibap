import type { Metadata } from 'next'
import '../styles/globals.css'

export const metadata: Metadata = {
  title: 'АКВА Альянс — Пространства, создающие ценность',
  description: 'АКВА Альянс: архитектура и пространственные решения с кинематографичным подходом.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="lenis">
      <body className="bg-black text-white antialiased selection:bg-cyan/20 selection:text-white aqua-animated-bg">
        {children}
      </body>
    </html>
  )
}
