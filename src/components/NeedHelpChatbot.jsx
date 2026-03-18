import { useEffect, useMemo, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { MessageCircle, Send, X } from 'lucide-react'

function botReply(text) {
  const msg = (text || '').toLowerCase()
  if (msg.includes('blood')) {
    return 'For blood requests: go to Find Blood, select blood group, and contact the nearest donors/hospitals. You can also post in Community Hub.'
  }
  if (msg.includes('donor')) {
    return 'To find donors: open Find Blood or Community Hub. If you are a donor, keep your profile updated and post availability in Community.'
  }
  return 'I can help with blood requests, donors, login, or using the app. Tell me what you need.'
}

export default function NeedHelpChatbot() {
  const [isOpen, setIsOpen] = useState(false)
  const [input, setInput] = useState('')
  const [messages, setMessages] = useState(() => [
    { id: 'm0', from: 'bot', text: 'Hi! Ask anything — blood, donor, requests, or navigation.' },
  ])
  const listRef = useRef(null)

  const canSend = useMemo(() => input.trim().length > 0, [input])

  useEffect(() => {
    if (!isOpen) return
    const el = listRef.current
    if (!el) return
    el.scrollTop = el.scrollHeight
  }, [messages, isOpen])

  const send = () => {
    const text = input.trim()
    if (!text) return

    const userMsg = { id: `u-${Date.now()}`, from: 'user', text }
    const reply = { id: `b-${Date.now()}-${Math.random().toString(16).slice(2)}`, from: 'bot', text: botReply(text) }

    setMessages((prev) => [...prev, userMsg, reply])
    setInput('')
  }

  return (
    <>
      {/* Floating Button */}
      <motion.button
        whileTap={{ scale: 0.95 }}
        whileHover={{ scale: 1.03 }}
        onClick={() => setIsOpen(true)}
        className="
          fixed bottom-24 right-4 z-50
          bg-red-500 text-white
          rounded-full px-4 py-3 shadow-lg
          flex items-center justify-center gap-2
        "
        aria-label="Open Need Help chatbot"
      >
        <MessageCircle size={18} />
        <span className="text-sm font-semibold">Need Help</span>
      </motion.button>

      {/* Modal */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Outside click overlay (optional) */}
            <motion.button
              type="button"
              aria-label="Close chatbot"
              className="fixed inset-0 z-40 bg-black/40"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
            />

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 16 }}
              transition={{ type: 'spring', stiffness: 320, damping: 26 }}
              className="
                fixed bottom-24 right-4 z-50
                w-[90%] max-w-sm
                bg-black border border-white/10
                rounded-2xl shadow-xl
                overflow-hidden
              "
              role="dialog"
              aria-modal="true"
              aria-label="Need Help chatbot"
            >
              {/* Header */}
              <div className="flex items-start justify-between gap-3 px-4 py-3 border-b border-white/10 bg-white/5">
                <div>
                  <p className="text-white font-semibold leading-tight">Need Help</p>
                  <p className="text-white/60 text-xs mt-0.5">Ask anything</p>
                </div>
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="h-9 w-9 inline-flex items-center justify-center rounded-xl bg-white/5 border border-white/10 text-white/80 hover:text-white hover:bg-white/10 transition"
                  aria-label="Close"
                >
                  <X size={16} />
                </button>
              </div>

              {/* Body */}
              <div ref={listRef} className="h-64 overflow-y-auto space-y-2 px-3 py-3">
                {messages.map((m) => (
                  <div key={m.id} className={m.from === 'user' ? 'flex justify-end' : 'flex justify-start'}>
                    <div
                      className={[
                        'max-w-[85%] rounded-2xl px-3 py-2 text-sm leading-snug border',
                        m.from === 'user'
                          ? 'bg-red-500/20 border-red-500/30 text-white'
                          : 'bg-white/5 border-white/10 text-white/90',
                      ].join(' ')}
                    >
                      {m.text}
                    </div>
                  </div>
                ))}
              </div>

              {/* Input */}
              <div className="px-3 py-3 border-t border-white/10 bg-white/5">
                <div className="flex items-center gap-2">
                  <input
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') send()
                    }}
                    placeholder="Type your message…"
                    className="flex-1 bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-sm text-white outline-none placeholder:text-white/40 focus:border-red-500/40"
                  />
                  <button
                    type="button"
                    onClick={send}
                    disabled={!canSend}
                    className="bg-red-500 px-3 py-2 rounded-xl text-white disabled:opacity-50 disabled:cursor-not-allowed"
                    aria-label="Send message"
                  >
                    <span className="inline-flex items-center gap-2">
                      <Send size={16} />
                    </span>
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}

