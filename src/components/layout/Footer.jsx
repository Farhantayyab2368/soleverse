import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowUpRight, Globe } from 'lucide-react'
import Logo from '../ui/Logo'
import { FacebookIcon, InstagramIcon, TikTokIcon, YouTubeIcon } from '../ui/SocialIcons'

const COLUMNS = [
  {
    title: 'Shop',
    links: [
      { label: 'All Shoes', to: '/shop' },
      { label: 'New Arrivals', to: '/new-arrivals' },
      { label: 'Best Sellers', to: '/shop?sort=rating' },
      { label: 'Collections', to: '/collections' },
    ],
  },
  {
    title: 'Help',
    links: [
      { label: 'Contact', to: '/help#contact' },
      { label: 'Shipping', to: '/help#shipping' },
      { label: 'Returns', to: '/help#returns' },
      { label: 'Size Guide', to: '/help#size-guide' },
      { label: 'FAQ', to: '/help#faq' },
    ],
  },
  {
    title: 'Company',
    links: [
      { label: 'About', to: '/about' },
      { label: 'Careers', to: '/about#careers' },
      { label: 'Sustainability', to: '/about#sustainability' },
    ],
  },
]

const SOCIALS = [
  { label: 'Instagram', href: 'https://www.instagram.com/', Icon: InstagramIcon },
  { label: 'Facebook', href: 'https://www.facebook.com/', Icon: FacebookIcon },
  { label: 'TikTok', href: 'https://www.tiktok.com/', Icon: TikTokIcon },
  { label: 'YouTube', href: 'https://www.youtube.com/', Icon: YouTubeIcon },
]

export default function Footer() {
  return (
    <footer className="relative overflow-hidden bg-ink text-white" aria-labelledby="footer-heading">
      <h2 id="footer-heading" className="sr-only">
        Footer
      </h2>
      <div className="pointer-events-none absolute -top-40 left-1/2 h-80 w-[60rem] -translate-x-1/2 rounded-full bg-volt/20 blur-[120px]" aria-hidden />
      <div className="relative mx-auto max-w-[1440px] px-5 pb-10 pt-20 sm:px-8 lg:px-12">
        <div className="grid gap-14 lg:grid-cols-[1.4fr_2fr]">
          <div className="max-w-sm">
            <Logo light />
            <p className="mt-6 text-white/55">
              Engineered for movement. Designed for your next step. Premium performance footwear, built in 3D and made for real life.
            </p>
            <Link to="/shop" className="group mt-8 inline-flex items-center gap-2 text-sm font-semibold text-white" data-cursor="hover">
              Shop the latest drop
              <ArrowUpRight className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
            </Link>
          </div>

          <div className="grid grid-cols-2 gap-10 sm:grid-cols-4">
            {COLUMNS.map((col) => (
              <nav key={col.title} aria-label={col.title}>
                <h3 className="eyebrow text-white/40">{col.title}</h3>
                <ul className="mt-5 space-y-3">
                  {col.links.map((l) => (
                    <li key={l.label}>
                      <Link to={l.to} className="text-sm text-white/75 transition-colors hover:text-white" data-cursor="hover">
                        {l.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </nav>
            ))}
            <nav aria-label="Follow us">
              <h3 className="eyebrow text-white/40">Follow</h3>
              <ul className="mt-5 space-y-3">
                {SOCIALS.map(({ label, href, Icon }) => (
                  <li key={label}>
                    <a
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group inline-flex items-center gap-2.5 text-sm text-white/75 transition-colors hover:text-white"
                      data-cursor="hover"
                    >
                      <Icon className="h-4 w-4 transition-transform group-hover:scale-110" />
                      {label}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          </div>
        </div>

        <motion.p
          className="display-wide pointer-events-none mt-20 flex select-none justify-center overflow-hidden whitespace-nowrap text-center text-[11.5vw] leading-[0.85] text-white/[0.06] 2xl:text-[10.5rem]"
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.5 }}
          transition={{ staggerChildren: 0.06 }}
          aria-hidden
        >
          {'SOLEVERSE'.split('').map((ch, i) => (
            <motion.span
              key={i}
              className="inline-block"
              variants={{ hidden: { y: '100%', opacity: 0 }, show: { y: '0%', opacity: 1, transition: { duration: 0.9, ease: [0.22, 1, 0.36, 1] } } }}
            >
              {ch}
            </motion.span>
          ))}
        </motion.p>

        <div className="mt-6 flex flex-col items-start justify-between gap-4 border-t border-white/10 pt-8 text-sm text-white/45 sm:flex-row sm:items-center">
          <div>
            <p>© 2026 SOLEVERSE. All Rights Reserved.</p>
            <p className="mt-1 text-xs text-white/30">
              3D sneaker model: “Materials Variants Shoe” by Shopify, licensed under{' '}
              <a href="https://creativecommons.org/licenses/by/4.0/" target="_blank" rel="noopener noreferrer" className="underline hover:text-white/60">
                CC BY 4.0
              </a>
              .
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
            <span className="inline-flex items-center gap-1.5">
              <Globe className="h-4 w-4" /> United States (USD)
            </span>
            <Link to="/help#faq" className="hover:text-white">
              Privacy
            </Link>
            <Link to="/help#faq" className="hover:text-white">
              Terms
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
