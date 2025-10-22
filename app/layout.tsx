import type { Metadata } from 'next'
import '../styles/globals.css'

export const metadata: Metadata = {
  title: 'Luxury Space — Cinematic Studio',
  description: 'Creating value through space. A cinematic, luxury one-page experience.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="lenis">
      <body className="bg-black text-white antialiased selection:bg-lux-gold/20 selection:text-white">
        {children}
      </body>
    </html>
  )
}
