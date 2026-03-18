import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { fetchHospitalVerification } from '../lib/blockchainVerification'

export default function BlockchainBadge({ hospitalAddress }) {
  const [loading, setLoading] = useState(false)
  const [verified, setVerified] = useState(false)
  const [badgeId, setBadgeId] = useState(null)

  useEffect(() => {
    let active = true
    if (!hospitalAddress) {
      setVerified(false)
      setBadgeId(null)
      return
    }

    ;(async () => {
      setLoading(true)
      try {
        const res = await fetchHospitalVerification(hospitalAddress)
        if (!active) return
        setVerified(Boolean(res.verified))
        setBadgeId(res.badgeId ?? null)
      } finally {
        if (active) setLoading(false)
      }
    })()

    return () => {
      active = false
    }
  }, [hospitalAddress])

  if (!hospitalAddress) {
    return (
      <span className="inline-flex items-center px-3 py-1 rounded-full text-[11px] font-semibold bg-white/5 text-white/40 border border-white/10">
        On-chain status: wallet not linked
      </span>
    )
  }

  if (loading) {
    return (
      <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-[11px] font-semibold bg-white/5 text-white/50 border border-white/10">
        <span className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" />
        Checking blockchain status…
      </span>
    )
  }

  if (verified) {
    return (
      <motion.span
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-[11px] font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-400/60 shadow-[0_0_20px_rgba(16,185,129,0.6)]"
        title="Verified on-chain by admin"
      >
        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
        Blockchain Verified
        {badgeId != null && (
          <span className="text-emerald-200/70 text-[10px]">· Badge #{badgeId}</span>
        )}
      </motion.span>
    )
  }

  return (
    <span
      className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-[11px] font-semibold bg-red-500/10 text-red-300 border border-red-400/40"
      title="Not yet approved on-chain"
    >
      <span className="w-2 h-2 rounded-full bg-red-400" />
      Not Blockchain Verified
    </span>
  )
}

