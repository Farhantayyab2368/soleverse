import { useShop } from '../../context/ShopContext'
import { GoogleIcon } from './SocialIcons'

/** Visual placeholder — Google sign-in is not configured in this demo. */
export default function GoogleButton() {
  const { notify } = useShop()
  return (
    <>
      <button
        type="button"
        onClick={() => notify('Google sign-in isn’t configured in this demo')}
        className="flex h-12 w-full items-center justify-center gap-3 rounded-full border border-ink/10 bg-white text-sm font-semibold transition hover:border-ink"
        data-cursor="hover"
      >
        <GoogleIcon className="h-5 w-5" /> Continue with Google
      </button>
      <div className="my-7 flex items-center gap-4 text-xs uppercase tracking-[0.2em] text-mist">
        <span className="h-px flex-1 bg-fog" /> or <span className="h-px flex-1 bg-fog" />
      </div>
    </>
  )
}
