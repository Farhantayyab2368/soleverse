import { forwardRef } from 'react'
import { Link } from 'react-router-dom'
import { motion, useMotionValue, useSpring } from 'framer-motion'
import { ArrowRight, Loader2 } from 'lucide-react'
import { cn } from '../../utils/format'

const variants = {
  primary: 'bg-ink text-white hover:bg-charcoal shadow-[0_10px_30px_-12px_rgb(10_10_12/0.6)]',
  accent: 'bg-volt text-white hover:bg-volt-deep shadow-[0_12px_32px_-10px_rgb(47_107_255/0.7)]',
  light: 'bg-white text-ink hover:bg-paper shadow-[0_10px_30px_-12px_rgb(0_0_0/0.35)]',
  outline: 'border border-ink/15 text-ink hover:border-ink hover:bg-ink hover:text-white',
  'outline-light': 'border border-white/25 text-white hover:border-white hover:bg-white hover:text-ink',
  glass: 'glass-dark border border-white/10 text-white hover:bg-white/15',
  ghost: 'text-ink hover:bg-ink/5',
}

const sizes = {
  sm: 'h-10 px-4 text-sm gap-2',
  md: 'h-12 px-6 text-sm gap-2.5',
  lg: 'h-14 px-8 text-[0.95rem] gap-3',
  icon: 'h-11 w-11 justify-center',
}

const MotionLink = motion.create(Link)

/** Polymorphic button: renders <Link> with `to`, <a> with `href`, otherwise <button>. */
const Button = forwardRef(function Button(
  { variant = 'primary', size = 'md', to, href, arrow = false, loading = false, magnetic = size === 'lg', className, children, style, ...props },
  ref,
) {
  const classes = cn(
    'group relative inline-flex select-none items-center justify-center rounded-full font-semibold tracking-tight',
    'transition-[background-color,color,border-color,box-shadow] duration-300 ease-[var(--ease-premium)]',
    'disabled:opacity-50 disabled:pointer-events-none',
    variants[variant],
    sizes[size],
    className,
  )
  // magnetic pull toward the cursor (mouse only)
  const mx = useSpring(useMotionValue(0), { stiffness: 260, damping: 18, mass: 0.4 })
  const my = useSpring(useMotionValue(0), { stiffness: 260, damping: 18, mass: 0.4 })
  const magnet = magnetic
    ? {
        onPointerMove: (e) => {
          if (e.pointerType !== 'mouse') return
          const r = e.currentTarget.getBoundingClientRect()
          mx.set((e.clientX - (r.left + r.width / 2)) * 0.22)
          my.set((e.clientY - (r.top + r.height / 2)) * 0.32)
        },
        onPointerLeave: () => {
          mx.set(0)
          my.set(0)
        },
      }
    : {}
  const filled = ['primary', 'accent', 'light'].includes(variant)

  const content = (
    <>
      {filled && (
        <span className="pointer-events-none absolute inset-0 overflow-hidden rounded-full" aria-hidden>
          <span className="absolute inset-y-0 -left-1/3 w-1/4 -translate-x-full -skew-x-12 bg-gradient-to-r from-transparent via-white/35 to-transparent transition-transform duration-[900ms] ease-[var(--ease-premium)] group-hover:translate-x-[620%]" />
        </span>
      )}
      {loading && <Loader2 className="h-4 w-4 animate-spin" aria-hidden />}
      <span className="relative inline-flex items-center gap-2">{children}</span>
      {arrow && (
        <ArrowRight
          className="h-4 w-4 transition-transform duration-300 ease-[var(--ease-premium)] group-hover:translate-x-1"
          aria-hidden
        />
      )}
    </>
  )
  const motionProps = {
    whileHover: { scale: 1.02 },
    whileTap: { scale: 0.97 },
    transition: { type: 'spring', stiffness: 400, damping: 25 },
    style: magnetic ? { x: mx, y: my, ...style } : style,
    ...magnet,
  }

  if (to) {
    return (
      <MotionLink ref={ref} to={to} className={classes} data-cursor="hover" {...motionProps} {...props}>
        {content}
      </MotionLink>
    )
  }
  if (href) {
    return (
      <motion.a ref={ref} href={href} className={classes} data-cursor="hover" {...motionProps} {...props}>
        {content}
      </motion.a>
    )
  }
  return (
    <motion.button ref={ref} type="button" className={classes} data-cursor="hover" disabled={loading || props.disabled} {...motionProps} {...props}>
      {content}
    </motion.button>
  )
})

export default Button
