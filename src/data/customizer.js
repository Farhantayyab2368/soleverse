export const CUSTOM_COLORS = [
  { name: 'Black', hex: '#121316' },
  { name: 'White', hex: '#f4f4f0' },
  { name: 'Red', hex: '#e5322d' },
  { name: 'Blue', hex: '#2f6bff' },
  { name: 'Green', hex: '#22a565' },
  { name: 'Orange', hex: '#ff6a1a' },
]

export const CUSTOM_ZONES = [
  { key: 'main', label: 'Upper' },
  { key: 'sole', label: 'Sole' },
  { key: 'lace', label: 'Laces & lining' },
  { key: 'accent', label: 'Stripes & heel tab' },
]

export const PRESETS = [
  { name: 'Volt', colors: { main: '#f4f4f0', sole: '#f4f4f0', lace: '#121316', accent: '#2f6bff' } },
  { name: 'Phantom', colors: { main: '#121316', sole: '#121316', lace: '#121316', accent: '#2f6bff' } },
  { name: 'Ember', colors: { main: '#ff6a1a', sole: '#f4f4f0', lace: '#f4f4f0', accent: '#121316' } },
  { name: 'Racing', colors: { main: '#e5322d', sole: '#f4f4f0', lace: '#f4f4f0', accent: '#121316' } },
]

export const CUSTOM_BASE_ID = 'aero-x1'
export const CUSTOM_UPCHARGE = 20

export const colorName = (hex) =>
  CUSTOM_COLORS.find((c) => c.hex.toLowerCase() === hex?.toLowerCase())?.name ?? 'Custom'
