import { useCallback, useEffect, useRef, useState } from 'react'
import { predictDonor } from '../ai/donorPrediction'

/**
 * Custom hook — runs AI prediction for the current donor profile.
 * Returns { prediction, loading, error, refresh }.
 *
 * • Caches result in-memory; only re-runs when `profile` reference changes.
 * • Debounced (300 ms) to avoid hammering the model on rapid updates.
 */
export default function useDonorPrediction(profile) {
  const [prediction, setPrediction] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const timerRef = useRef(null)
  const mountedRef = useRef(true)

  const run = useCallback(async () => {
    if (!profile) {
      setLoading(false)
      return
    }
    setLoading(true)
    setError(null)
    try {
      const result = await predictDonor(profile)
      if (mountedRef.current) {
        setPrediction(result)
      }
    } catch (err) {
      console.error('[AI] prediction failed:', err)
      if (mountedRef.current) setError(err)
    } finally {
      if (mountedRef.current) setLoading(false)
    }
  }, [profile])

  // Debounced auto-run when profile changes
  useEffect(() => {
    if (timerRef.current) clearTimeout(timerRef.current)
    timerRef.current = setTimeout(run, 300)
    return () => clearTimeout(timerRef.current)
  }, [run])

  // Cleanup
  useEffect(() => {
    mountedRef.current = true
    return () => { mountedRef.current = false }
  }, [])

  /** Force a re-prediction (e.g. after profile save). */
  const refresh = useCallback(() => run(), [run])

  return { prediction, loading, error, refresh }
}
