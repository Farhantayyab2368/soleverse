import { Component } from 'react'

/** Catches render errors (e.g. a missing/corrupt 3D model) and shows a fallback instead of crashing the page. */
export default class ErrorBoundary extends Component {
  state = { error: null }

  static getDerivedStateFromError(error) {
    return { error }
  }

  componentDidCatch(error) {
    if (import.meta.env.DEV) console.warn('[SOLEVERSE] Recovered from error:', error?.message ?? error)
    this.props.onError?.(error)
  }

  componentDidUpdate(prev) {
    if (this.state.error && prev.resetKey !== this.props.resetKey) this.setState({ error: null })
  }

  render() {
    if (this.state.error) return this.props.fallback ?? null
    return this.props.children
  }
}
