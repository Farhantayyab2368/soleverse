import { motion } from 'framer-motion'
import { TechScene } from '../three/Lazy3D'
import Reveal from '../ui/Reveal'
import AnimatedText from '../ui/AnimatedText'

const STEPS = [
  { n: '01', title: 'Scanned', text: '40,000+ foot scans shape every last we build.' },
  { n: '02', title: 'Simulated', text: 'Every foam density is stress-tested in 3D before a sample exists.' },
  { n: '03', title: 'Tested', text: '1,200 km of real-world wear testing per model.' },
]

export default function TechSection() {
  return (
    <section className="noise relative overflow-hidden bg-ink py-24 text-white lg:py-32" aria-labelledby="tech-title">
      <div className="pointer-events-none absolute left-1/2 top-1/2 h-[40rem] w-[60rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-volt/20 blur-[140px]" aria-hidden />
      <div className="relative mx-auto max-w-[1440px] px-5 sm:px-8 lg:px-12">
        <div className="grid gap-10 lg:grid-cols-[1.4fr_1fr] lg:items-end">
          <div>
            <Reveal>
              <p className="eyebrow flex items-center gap-3 text-volt-glow">
                <span className="h-px w-8 bg-current" /> SOLEVERSE Technology
              </p>
            </Reveal>
            <h2 id="tech-title" className="display mt-4 text-[2.4rem] sm:text-6xl xl:text-[4.6rem]">
              <AnimatedText text="Designed in 3D." className="block" />
              <AnimatedText text="Built for real life." className="block text-white/35" delay={0.25} />
            </h2>
          </div>
          <Reveal delay={0.1}>
            <p className="max-w-lg text-lg leading-relaxed text-white/60 lg:ml-auto">
              Every SOLEVERSE shoe begins as a digital twin. We sculpt, simulate and refine each component in 3D — from the
              density of the foam to the flex of the mesh — before a single physical sample is made.
            </p>
          </Reveal>
        </div>

        <div className="relative mt-12 h-[460px] sm:h-[560px] lg:h-[640px]" data-cursor="drag">
          <div className="absolute inset-x-[10%] bottom-[8%] h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" aria-hidden />
          <TechScene />
        </div>

        <motion.ol
          className="mt-6 grid gap-px overflow-hidden rounded-[28px] bg-white/10 sm:grid-cols-3"
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.3 }}
          variants={{ show: { transition: { staggerChildren: 0.1 } } }}
        >
          {STEPS.map((s) => (
            <motion.li key={s.n} variants={{ hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } }} className="bg-ink/90 p-7">
              <p className="font-mono text-xs text-volt-glow">{s.n}</p>
              <p className="display mt-3 text-2xl">{s.title}</p>
              <p className="mt-2 text-sm leading-relaxed text-white/55">{s.text}</p>
            </motion.li>
          ))}
        </motion.ol>
      </div>
    </section>
  )
}
