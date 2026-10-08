import Reveal from './Reveal'
import AnimatedText from './AnimatedText'
import { cn } from '../../utils/format'

export default function SectionHeading({ eyebrow, title, id, description, align = 'left', light = false, action, className }) {
  return (
    <div
      className={cn(
        'flex flex-col gap-6 md:flex-row md:items-end md:justify-between',
        align === 'center' && 'md:flex-col md:items-center text-center',
        className,
      )}
    >
      <div className={cn('max-w-2xl', align === 'center' && 'mx-auto')}>
        {eyebrow && (
          <Reveal>
            <p className={cn('eyebrow mb-4 flex items-center gap-3', align === 'center' && 'justify-center', light ? 'text-volt-glow' : 'text-volt')}>
              <span className="h-px w-8 bg-current" aria-hidden />
              {eyebrow}
            </p>
          </Reveal>
        )}
        <h2 id={id} className={cn('display text-[2.4rem] sm:text-5xl lg:text-[4rem]', light ? 'text-white' : 'text-ink')}>
          {typeof title === 'string' ? <AnimatedText text={title} delay={0.05} /> : title}
        </h2>
        {description && (
          <Reveal delay={0.1}>
            <p className={cn('mt-5 max-w-xl text-base leading-relaxed sm:text-lg', light ? 'text-white/60' : 'text-steel', align === 'center' && 'mx-auto')}>
              {description}
            </p>
          </Reveal>
        )}
      </div>
      {action && <Reveal delay={0.15}>{action}</Reveal>}
    </div>
  )
}
