import { motion } from 'framer-motion'

export default function LogoMark({ className = '' }) {
  return (
    <motion.svg
      viewBox="0 0 128 128"
      role="img"
      aria-label="RudhirSetu"
      initial={false}
      animate={{ y: [0, -1.5, 0] }}
      transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
      className={className}
    >
      <defs>
        <linearGradient id="rs_drop" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#ff4d4d" />
          <stop offset="0.55" stopColor="#ef4444" />
          <stop offset="1" stopColor="#b91c1c" />
        </linearGradient>
        <radialGradient id="rs_shine" cx="30%" cy="18%" r="60%">
          <stop offset="0" stopColor="rgba(255,255,255,0.95)" />
          <stop offset="0.5" stopColor="rgba(255,255,255,0.25)" />
          <stop offset="1" stopColor="rgba(255,255,255,0)" />
        </radialGradient>
        <filter id="rs_soft" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="6" stdDeviation="6" floodColor="rgba(0,0,0,0.25)" />
        </filter>
      </defs>

      {/* Drop body */}
      <path
        filter="url(#rs_soft)"
        d="M66 10c18 20 34 44 34 66 0 21-16 38-36 38S28 97 28 76c0-22 17-46 38-66z"
        fill="url(#rs_drop)"
      />
      <path
        d="M66 14c16 18 30 40 30 60 0 19-14 34-32 34S34 93 34 74c0-20 15-42 32-60z"
        fill="url(#rs_shine)"
        opacity="0.35"
      />

      {/* Cute face */}
      <g>
        <circle cx="50" cy="62" r="12" fill="#1f2937" opacity="0.18" />
        <circle cx="78" cy="62" r="12" fill="#1f2937" opacity="0.18" />

        <circle cx="50" cy="60" r="10" fill="#ffffff" />
        <circle cx="78" cy="60" r="10" fill="#ffffff" />
        <circle cx="50" cy="60" r="6" fill="#4b1d1d" />
        <circle cx="78" cy="60" r="6" fill="#4b1d1d" />
        <circle cx="48" cy="58" r="2" fill="#ffffff" />
        <circle cx="76" cy="58" r="2" fill="#ffffff" />

        <path d="M54 78c6 7 14 7 20 0" fill="none" stroke="#ffffff" strokeWidth="5" strokeLinecap="round" opacity="0.92" />
        <path d="M56 80c5 4 11 4 16 0" fill="none" stroke="#7f1d1d" strokeWidth="3.2" strokeLinecap="round" opacity="0.65" />
      </g>

      {/* Medical plus */}
      <g transform="translate(64 94)">
        <rect x="-14" y="-14" width="28" height="28" rx="7" fill="rgba(255,255,255,0.16)" />
        <path d="M-2 -9h4v7h7v4H2v7h-4V2h-7v-4h7z" fill="#ffffff" opacity="0.95" />
      </g>
    </motion.svg>
  )
}

