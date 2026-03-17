import React from 'react'

function DefaultFallback({ error, onReload }) {
  return (
    <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center px-6">
      <div className="w-full max-w-md glass rounded-2xl border border-white/10 p-6">
        <h1 className="text-white font-semibold text-lg">Something went wrong.</h1>
        <p className="mt-2 text-white/60 text-sm">Please refresh the page.</p>

        {error?.message ? (
          <pre className="mt-4 max-h-40 overflow-auto rounded-xl bg-black/40 border border-white/10 p-3 text-xs text-white/60 whitespace-pre-wrap">
            {error.message}
          </pre>
        ) : null}

        <div className="mt-5 flex gap-3">
          <button
            type="button"
            onClick={onReload}
            className="flex-1 min-h-[44px] rounded-xl bg-[#ef4444] px-4 py-2.5 text-sm font-semibold text-white shadow-[0_10px_25px_rgba(239,68,68,0.25)] transition-transform duration-200 active:scale-[0.98]"
          >
            Reload
          </button>
          <button
            type="button"
            onClick={() => onReload(true)}
            className="flex-1 min-h-[44px] rounded-xl border border-white/15 bg-white/5 px-4 py-2.5 text-sm font-semibold text-white/90 transition-colors duration-200 hover:bg-white/10 active:bg-white/15"
          >
            Hard reload
          </button>
        </div>
      </div>
    </div>
  )
}

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error }
  }

  componentDidCatch(error, info) {
    // Always log so production black screens become debuggable.
    // eslint-disable-next-line no-console
    console.error('[ErrorBoundary] caught error', error, info)
  }

  render() {
    if (this.state.hasError) {
      const Fallback = this.props.fallback
      const onReload = (hard = false) => {
        if (hard) window.location.reload()
        else window.location.href = window.location.href
      }
      if (Fallback) return <Fallback error={this.state.error} onReload={onReload} />
      return <DefaultFallback error={this.state.error} onReload={onReload} />
    }
    return this.props.children
  }
}

