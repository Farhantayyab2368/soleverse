import { useEffect, useState } from 'react'
import { getCachedShoeImageSafe, loadShoeImage } from '../utils/shoeImages'

/**
 * Returns { src, status } for a studio render of a product colourway & view.
 * status: 'loading' | 'ready' | 'error'
 */
export default function useShoeImage({ style, colors, view, size = 'lg', enabled = true }) {
  const key = `${style}|${colors.main}|${colors.sole}|${colors.lace}|${colors.accent}|${view}|${size}`
  const [state, setState] = useState(() => {
    const hit = getCachedShoeImageSafe({ style, colors, view, size })
    return hit ? { key, src: hit, status: 'ready' } : { key, src: null, status: 'loading' }
  })

  useEffect(() => {
    if (!enabled) return
    let alive = true
    const hit = getCachedShoeImageSafe({ style, colors, view, size })
    if (hit) {
      setState({ key, src: hit, status: 'ready' })
      return
    }
    loadShoeImage({ style, colors, view, size })
      .then((src) => alive && setState({ key, src, status: 'ready' }))
      .catch(() => alive && setState({ key, src: null, status: 'error' }))
    return () => {
      alive = false
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key, enabled])

  // While a new key is loading keep showing the previous image (smooth colourway swaps)
  return state.key === key ? state : { ...state, status: state.src ? 'stale' : 'loading' }
}
