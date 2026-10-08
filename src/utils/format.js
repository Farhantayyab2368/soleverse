/** Pakistani Rupees, e.g. "Rs 35,999". */
export const formatPrice = (value) =>
  new Intl.NumberFormat('en-PK', { style: 'currency', currency: 'PKR', maximumFractionDigits: 0 }).format(Math.round(value))

export const formatNumber = (n) => new Intl.NumberFormat('en-US').format(n)

export const cn = (...classes) => classes.filter(Boolean).join(' ')

export const orderNumber = () =>
  `SV-${Date.now().toString(36).toUpperCase().slice(-4)}${Math.floor(1000 + Math.random() * 9000)}`

export const isEmail = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim())
