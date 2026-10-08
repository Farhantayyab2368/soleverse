/**
 * "Add to bag" flourish: a copy of the product image arcs from its card into the bag icon,
 * then the icon pops. Uses the Web Animations API, so it runs outside React renders.
 */
export function flyToCart(sourceEl) {
  if (typeof window === 'undefined' || !sourceEl) return
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
  const target = [...document.querySelectorAll('[data-cart-icon]')].find((el) => el.getClientRects().length > 0)
  if (!target) return

  const from = sourceEl.getBoundingClientRect()
  const to = target.getBoundingClientRect()
  if (!from.width) return

  const ghost = document.createElement('img')
  ghost.src = sourceEl.currentSrc || sourceEl.src
  ghost.alt = ''
  Object.assign(ghost.style, {
    position: 'fixed',
    left: `${from.left}px`,
    top: `${from.top}px`,
    width: `${from.width}px`,
    height: `${from.height}px`,
    objectFit: 'contain',
    zIndex: 200,
    pointerEvents: 'none',
    filter: 'drop-shadow(0 18px 30px rgba(10,10,12,.25))',
  })
  document.body.appendChild(ghost)

  const dx = to.left + to.width / 2 - (from.left + from.width / 2)
  const dy = to.top + to.height / 2 - (from.top + from.height / 2)
  const anim = ghost.animate(
    [
      { transform: 'translate(0,0) scale(1) rotate(0deg)', opacity: 1 },
      { transform: `translate(${dx * 0.45}px, ${dy * 0.45 - 140}px) scale(0.55) rotate(-14deg)`, opacity: 1, offset: 0.5 },
      { transform: `translate(${dx}px, ${dy}px) scale(0.06) rotate(-28deg)`, opacity: 0.3 },
    ],
    { duration: 950, easing: 'cubic-bezier(0.55, 0, 0.45, 1)' },
  )
  anim.onfinish = () => {
    ghost.remove()
    target.animate(
      [{ transform: 'scale(1) rotate(0)' }, { transform: 'scale(1.35) rotate(-10deg)' }, { transform: 'scale(0.95) rotate(6deg)' }, { transform: 'scale(1) rotate(0)' }],
      { duration: 520, easing: 'ease-out' },
    )
  }
}
