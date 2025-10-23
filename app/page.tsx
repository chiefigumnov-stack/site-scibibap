import Hero from '@/components/Hero'
import About from '@/components/About'
import Services from '@/components/Services'
import Portfolio from '@/components/Portfolio'
import Founder from '@/components/Founder'
import Contact from '@/components/Contact'
 
import dynamic from 'next/dynamic'

const Preloader = dynamic(() => import('@/components/Preloader'), { ssr: false })
const Map = dynamic(() => import('@/components/MapRussia'), { ssr: false })

export default function Page() {
  return (
    <main className="relative">
      <Preloader />
      <Hero />
      <About />
      <Services />
      <Portfolio />
      <Map />
      <Founder />
      <Contact />
    </main>
  )
}
