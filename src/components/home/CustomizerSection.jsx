import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Check, Shuffle, ShoppingBag, RotateCcw } from 'lucide-react'
import { ThreeDShoeViewer } from '../three/Lazy3D'
import ColorSelector from '../product/ColorSelector'
import Button from '../ui/Button'
import SectionHeading from '../ui/SectionHeading'
import { useShop } from '../../context/ShopContext'
import { getProduct } from '../../data/products'
import { CUSTOM_BASE_ID, CUSTOM_COLORS, CUSTOM_UPCHARGE, CUSTOM_ZONES, PRESETS, colorName } from '../../data/customizer'
import { cn, formatPrice } from '../../utils/format'

const START = PRESETS[0].colors

export default function CustomizerSection() {
  const { addToCart } = useShop()
  const [colors, setColors] = useState(START)
  const [added, setAdded] = useState(false)
  const base = getProduct(CUSTOM_BASE_ID)

  const setZone = (zone, hex) => setColors((c) => ({ ...c, [zone]: hex }))
  const randomize = () => {
    const pick = () => CUSTOM_COLORS[Math.floor(Math.random() * CUSTOM_COLORS.length)].hex
    setColors({ main: pick(), sole: pick(), lace: pick(), accent: pick() })
  }
  const activePreset = PRESETS.find((p) => Object.keys(p.colors).every((k) => p.colors[k] === colors[k]))?.name

  const addCustom = () => {
    addToCart(base, { custom: colors, size: 42 })
    setAdded(true)
    setTimeout(() => setAdded(false), 1800)
  }

  return (
    <section id="explore-3d" className="scroll-mt-20 bg-white py-24 lg:py-32" aria-labelledby="customizer-title">
      <div className="mx-auto max-w-[1440px] px-5 sm:px-8 lg:px-12">
        <SectionHeading
          eyebrow="3D Customizer"
          id="customizer-title" title="Make it yours"
          description="Spin it, zoom it, design it. Choose colours for every zone and watch your Aero X1 update in real time."
        />

        <div className="mt-14 grid gap-6 lg:grid-cols-[1.45fr_1fr]">
          <div className="relative h-[440px] overflow-hidden rounded-[32px] bg-[radial-gradient(ellipse_at_50%_35%,#ffffff_0%,#efefea_55%,#e4e4df_100%)] sm:h-[540px] lg:h-[620px]">
            <p className="display-wide text-outline-dark pointer-events-none absolute inset-x-0 top-[38%] select-none text-center text-[22vw] lg:text-[12vw]" aria-hidden>
              Aero X1
            </p>
            <ThreeDShoeViewer colors={colors} style="jogger" />
          </div>

          <div className="flex flex-col rounded-[32px] bg-paper p-6 sm:p-8">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="eyebrow text-mist">Aero X1 Custom</p>
                <p className="display mt-2 text-3xl">{formatPrice(base.price + CUSTOM_UPCHARGE)}</p>
              </div>
              <div className="flex gap-2">
                <button onClick={randomize} className="grid h-11 w-11 place-items-center rounded-full bg-white shadow-soft transition hover:rotate-12" aria-label="Randomise colours" title="Randomise" data-cursor="hover">
                  <Shuffle className="h-4 w-4" />
                </button>
                <button onClick={() => setColors(START)} className="grid h-11 w-11 place-items-center rounded-full bg-white shadow-soft transition hover:-rotate-45" aria-label="Reset colours" title="Reset" data-cursor="hover">
                  <RotateCcw className="h-4 w-4" />
                </button>
              </div>
            </div>

            <div className="mt-6">
              <p className="mb-3 text-sm font-semibold">Presets</p>
              <div className="flex flex-wrap gap-2">
                {PRESETS.map((p) => (
                  <button
                    key={p.name}
                    onClick={() => setColors(p.colors)}
                    aria-pressed={activePreset === p.name}
                    className={cn(
                      'flex items-center gap-2 rounded-full border px-3 py-2 text-sm font-medium transition',
                      activePreset === p.name ? 'border-ink bg-ink text-white' : 'border-ink/10 bg-white hover:border-ink',
                    )}
                  >
                    <span className="h-4 w-4 rounded-full ring-1 ring-black/10" style={{ background: `linear-gradient(135deg, ${p.colors.main} 50%, ${p.colors.accent} 50%)` }} />
                    {p.name}
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-7 space-y-6 border-t border-ink/5 pt-7">
              {CUSTOM_ZONES.map((zone) => (
                <ColorSelector
                  key={zone.key}
                  label={zone.label}
                  options={CUSTOM_COLORS}
                  value={colors[zone.key]}
                  onChange={(hex) => setZone(zone.key, hex)}
                  byHex
                  size="sm"
                />
              ))}
            </div>

            <div className="mt-8 rounded-2xl bg-white p-4 text-sm">
              <p className="font-semibold">Your design</p>
              <p className="mt-1 text-steel">
                {CUSTOM_ZONES.map((z) => `${z.label}: ${colorName(colors[z.key])}`).join(' · ')}
              </p>
            </div>

            <Button onClick={addCustom} variant={added ? 'accent' : 'primary'} size="lg" className="mt-6 w-full">
              <AnimatePresence mode="wait" initial={false}>
                <motion.span key={added ? 'y' : 'n'} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} className="flex items-center gap-2">
                  {added ? <Check className="h-4 w-4" /> : <ShoppingBag className="h-4 w-4" />}
                  {added ? 'Added to bag' : 'Add custom pair to bag'}
                </motion.span>
              </AnimatePresence>
            </Button>
            <p className="mt-3 text-center text-xs text-mist">Made to order · Ships in 10–14 days · Default size EU 42 (editable in bag)</p>
          </div>
        </div>
      </div>
    </section>
  )
}
