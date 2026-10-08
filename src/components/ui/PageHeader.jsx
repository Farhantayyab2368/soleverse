import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { ChevronRight } from 'lucide-react'
import { cn } from '../../utils/format'

const ease = [0.22, 1, 0.36, 1]

export default function PageHeader({ eyebrow, title, description, crumbs = [], dark = false, children, className }) {
  return (
    <header className={cn('relative overflow-hidden pt-32 sm:pt-36', dark ? 'noise bg-ink pb-20 text-white' : 'pb-10', className)}>
      {dark && <div className="pointer-events-none absolute -right-40 -top-40 h-[34rem] w-[34rem] rounded-full bg-volt/25 blur-[120px]" aria-hidden />}
      <div className="relative mx-auto max-w-[1440px] px-5 sm:px-8 lg:px-12">
        {crumbs.length > 0 && (
          <nav aria-label="Breadcrumb" className="mb-6">
            <ol className={cn('flex flex-wrap items-center gap-1.5 text-sm', dark ? 'text-white/50' : 'text-mist')}>
              <li>
                <Link to="/" className={dark ? 'hover:text-white' : 'hover:text-ink'}>
                  Home
                </Link>
              </li>
              {crumbs.map((c, i) => (
                <li key={c.label} className="flex items-center gap-1.5">
                  <ChevronRight className="h-3.5 w-3.5" aria-hidden />
                  {c.to && i < crumbs.length - 1 ? (
                    <Link to={c.to} className={dark ? 'hover:text-white' : 'hover:text-ink'}>
                      {c.label}
                    </Link>
                  ) : (
                    <span aria-current="page" className={dark ? 'text-white' : 'text-ink'}>
                      {c.label}
                    </span>
                  )}
                </li>
              ))}
            </ol>
          </nav>
        )}
        {eyebrow && (
          <motion.p initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, ease }} className={cn('eyebrow mb-4 flex items-center gap-3', dark ? 'text-volt-glow' : 'text-volt')}>
            <span className="h-px w-8 bg-current" /> {eyebrow}
          </motion.p>
        )}
        <h1 className="display-wide overflow-hidden pb-1 text-[2.8rem] sm:text-7xl lg:text-[6.5rem]">
          <motion.span className="block" initial={{ y: '100%' }} animate={{ y: 0 }} transition={{ duration: 0.9, ease, delay: 0.05 }}>
            {title}
          </motion.span>
        </h1>
        {description && (
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease, delay: 0.2 }}
            className={cn('mt-5 max-w-xl text-lg leading-relaxed', dark ? 'text-white/60' : 'text-steel')}
          >
            {description}
          </motion.p>
        )}
        {children}
      </div>
    </header>
  )
}
