import { useSyncExternalStore } from 'react'

/** Tiny global store: pages with a dark top section set "dark" so the transparent navbar uses light text. */
let theme = 'light'
const listeners = new Set()

export function setNavTheme(next) {
  if (next === theme) return
  theme = next
  listeners.forEach((l) => l())
}

const subscribe = (l) => {
  listeners.add(l)
  return () => listeners.delete(l)
}

export default function useNavTheme() {
  return useSyncExternalStore(subscribe, () => theme, () => theme)
}
