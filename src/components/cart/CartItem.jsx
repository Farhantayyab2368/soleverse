import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Trash2 } from 'lucide-react'
import ProductImage from '../product/ProductImage'
import QuantityPicker from '../ui/QuantityPicker'
import { useShop } from '../../context/ShopContext'
import { colorName } from '../../data/customizer'
import { formatPrice } from '../../utils/format'

export default function CartItem({ item, onNavigate, compact = false }) {
  const { updateQty, updateSize, removeFromCart } = useShop()
  const { product, colorway, custom } = item
  const imgProduct = custom ? { ...product, colors: [{ ...colorway, name: 'Custom', colors: custom }] } : product
  const colorLabel = custom ? `Custom · ${colorName(custom.main)} / ${colorName(custom.accent)}` : colorway.name

  return (
    <motion.li
      layout
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: 40, transition: { duration: 0.25 } }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      className="flex gap-4 py-5"
    >
      <Link
        to={`/product/${product.id}`}
        onClick={onNavigate}
        className={`relative shrink-0 overflow-hidden rounded-2xl bg-gradient-to-b from-white to-[#ecece7] ${compact ? 'h-24 w-24' : 'h-28 w-28 sm:h-36 sm:w-36'}`}
      >
        <ProductImage product={imgProduct} colorIndex={custom ? 0 : item.colorIndex} view="side" size="sm" className="absolute inset-1.5" />
      </Link>
      <div className="flex min-w-0 flex-1 flex-col">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <Link to={`/product/${product.id}`} onClick={onNavigate} className="font-semibold tracking-tight hover:text-volt">
              {product.name}
              {custom && <span className="ml-1.5 rounded-full bg-volt/10 px-2 py-0.5 text-[0.65rem] font-bold uppercase tracking-wider text-volt">Custom</span>}
            </Link>
            <p className="mt-0.5 truncate text-sm text-steel">{colorLabel}</p>
          </div>
          <p className="shrink-0 font-semibold">{formatPrice(item.lineTotal)}</p>
        </div>

        <div className="mt-2 flex items-center gap-2 text-sm text-steel">
          <label htmlFor={`size-${item.key}`} className="sr-only">
            Size
          </label>
          <select
            id={`size-${item.key}`}
            value={item.size}
            onChange={(e) => updateSize(item.key, Number(e.target.value))}
            className="rounded-full border border-fog bg-white py-1 pl-3 pr-7 text-sm font-medium text-ink focus:border-volt focus:outline-none"
          >
            {product.sizes.map((s) => (
              <option key={s} value={s} disabled={product.soldOut.includes(s)}>
                EU {s}
                {product.soldOut.includes(s) ? ' — sold out' : ''}
              </option>
            ))}
          </select>
          {item.qty > 1 && <span className="text-xs">{formatPrice(item.unitPrice)} each</span>}
        </div>

        <div className="mt-auto flex items-center justify-between pt-3">
          <QuantityPicker size="sm" value={item.qty} onChange={(q) => updateQty(item.key, q)} label={`Quantity for ${product.name}`} />
          <button
            onClick={() => removeFromCart(item.key)}
            className="inline-flex items-center gap-1.5 rounded-full px-2 py-1 text-sm text-steel transition hover:bg-red-50 hover:text-red-600"
            aria-label={`Remove ${product.name} from bag`}
          >
            <Trash2 className="h-4 w-4" /> <span className="hidden sm:inline">Remove</span>
          </button>
        </div>
      </div>
    </motion.li>
  )
}
