import { motion } from 'framer-motion'
import { Feather, Gauge, Leaf, Waves } from 'lucide-react'
import { staggerChild, staggerParent } from '../ui/Reveal'
import CountUp from '../ui/CountUp'

const FEATURES = [
  { icon: Feather, title: 'Lightweight', text: 'Ultra-light construction for everyday movement.', stat: '238g' },
  { icon: Waves, title: 'Comfort', text: 'Engineered cushioning for all-day comfort.', stat: '12mm' },
  { icon: Gauge, title: 'Performance', text: 'Designed for speed, stability and control.', stat: '84%' },
  { icon: Leaf, title: 'Sustainable', text: 'Made with responsibly sourced materials.', stat: '62%' },
]

const WORDS = ['Lightweight', 'Responsive', 'Engineered in 3D', 'Sustainable', 'Built to move', 'Step into the future']

export function Marquee() {
  const row = [...WORDS, ...WORDS]
  return (
    <div className="overflow-hidden border-y border-ink/5 bg-white py-5" aria-hidden>
      <div className="flex w-max animate-marquee gap-10">
        {row.map((w, i) => (
          <span key={i} className="display flex items-center gap-10 whitespace-nowrap text-2xl text-ink/80 sm:text-3xl">
            {w}
            <span className="h-2 w-2 rounded-full bg-volt" />
          </span>
        ))}
      </div>
    </div>
  )
}

export default function FeatureHighlights() {
  return (
    <section className="mx-auto max-w-[1440px] px-5 py-24 sm:px-8 lg:px-12 lg:py-32" aria-label="Why STRIDEVOLT">
      <motion.ul
        className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4"
        variants={staggerParent}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.2 }}
      >
        {FEATURES.map(({ icon: Icon, title, text, stat }, i) => (
          <motion.li
            key={title}
            variants={staggerChild}
            whileHover={{ y: -6 }}
            transition={{ type: 'spring', stiffness: 300, damping: 22 }}
            className="group relative overflow-hidden rounded-[28px] bg-white p-7 shadow-[0_1px_0_rgb(0_0_0/0.04)] transition-shadow duration-500 hover:shadow-lift"
          >
            <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-volt/0 blur-3xl transition-colors duration-700 group-hover:bg-volt/20" aria-hidden />
            <div className="flex items-start justify-between">
              <span className="grid h-14 w-14 place-items-center rounded-2xl bg-paper text-ink transition-all duration-500 group-hover:rotate-[-8deg] group-hover:bg-ink group-hover:text-white">
                <Icon className="h-6 w-6" strokeWidth={1.6} />
              </span>
              <span className="font-mono text-xs text-mist">0{i + 1}</span>
            </div>
            <p className="display mt-10 text-4xl text-ink/[0.08] transition-colors duration-500 group-hover:text-volt/25">
              <CountUp value={stat} />
            </p>
            <h3 className="display mt-1 text-2xl">{title}</h3>
            <p className="mt-3 leading-relaxed text-steel">{text}</p>
          </motion.li>
        ))}
      </motion.ul>
    </section>
  )
}
