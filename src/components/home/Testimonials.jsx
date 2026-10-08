import { useCallback, useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { ChevronLeft, ChevronRight, Quote } from 'lucide-react'
import Stars from '../ui/Stars'
import Reveal from '../ui/Reveal'
import AnimatedText from '../ui/AnimatedText'
import CountUp from '../ui/CountUp'
import { testimonials } from '../../data/testimonials'
import { cn } from '../../utils/format'

export default function Testimonials() {
  const [[index, dir], setState] = useState([0, 1])
  const [paused, setPaused] = useState(false)
  const go = useCallback((d) => setState(([i]) => [(i + d + testimonials.length) % testimonials.length, d]), [])

  useEffect(() => {
    if (paused) return
    const id = setInterval(() => go(1), 6500)
    return () => clearInterval(id)
  }, [paused, go])

  const t = testimonials[index]

  return (
    <section
      className="mx-auto max-w-[1440px] px-5 py-24 sm:px-8 lg:px-12 lg:py-32"
      aria-roledescription="carousel"
      aria-label="Customer reviews"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
    >
      <div className="grid gap-12 lg:grid-cols-[1fr_2fr] lg:gap-20">
        <div>
          <Reveal>
            <p className="eyebrow flex items-center gap-3 text-volt">
              <span className="h-px w-8 bg-current" /> Reviews
            </p>
          </Reveal>
          <h2 className="display mt-4 text-[2.4rem] sm:text-5xl">
            <AnimatedText text="Loved by every step" />
          </h2>
          <Reveal delay={0.1} className="mt-8 flex items-center gap-4">
            <p className="display text-6xl">
              <CountUp value="4.8" />
            </p>
            <div>
              <Stars rating={4.8} size={16} />
              <p className="mt-1 text-sm text-steel">From 12,400+ verified reviews</p>
            </div>
          </Reveal>
          <div className="mt-10 flex gap-2">
            <button onClick={() => go(-1)} className="grid h-12 w-12 place-items-center rounded-full border border-ink/10 bg-white transition hover:bg-ink hover:text-white" aria-label="Previous review" data-cursor="hover">
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button onClick={() => go(1)} className="grid h-12 w-12 place-items-center rounded-full border border-ink/10 bg-white transition hover:bg-ink hover:text-white" aria-label="Next review" data-cursor="hover">
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
        </div>

        <div className="relative min-h-[340px] overflow-hidden rounded-[32px] bg-white p-8 shadow-soft sm:p-12">
          <Quote className="absolute right-8 top-8 h-20 w-20 text-volt/10" strokeWidth={1} aria-hidden />
          <AnimatePresence mode="wait" custom={dir}>
            <motion.figure
              key={index}
              custom={dir}
              initial={{ opacity: 0, x: dir * 40 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: dir * -40 }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              aria-roledescription="slide"
              aria-label={`${index + 1} of ${testimonials.length}`}
            >
              <Stars rating={t.rating} size={18} />
              <blockquote className="mt-6 text-2xl font-medium leading-snug tracking-tight sm:text-[2rem]">“{t.quote}”</blockquote>
              <figcaption className="mt-8 flex items-center gap-4">
                <span className="grid h-12 w-12 place-items-center rounded-full bg-gradient-to-br from-volt to-volt-deep font-semibold text-white" aria-hidden>
                  {t.name.split(' ').map((n) => n[0]).join('')}
                </span>
                <span>
                  <span className="block font-semibold">— {t.name}</span>
                  <span className="block text-sm text-steel">{t.role}</span>
                </span>
              </figcaption>
            </motion.figure>
          </AnimatePresence>
          <div className="absolute bottom-8 right-8 flex gap-1.5 sm:bottom-12 sm:right-12">
            {testimonials.map((_, i) => (
              <button
                key={i}
                onClick={() => setState([i, i > index ? 1 : -1])}
                aria-label={`Show review ${i + 1}`}
                aria-current={i === index}
                className={cn('h-1.5 rounded-full transition-all duration-500', i === index ? 'w-8 bg-ink' : 'w-1.5 bg-ink/15 hover:bg-ink/30')}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
