import { useCallback, useEffect, useRef, useState } from 'react'

export type TimerStatus = 'idle' | 'running' | 'paused' | 'done'

/**
 * Timer op basis van een eindtijdstempel, zodat hij nauwkeurig blijft bij scrollen
 * of wanneer de browser tabbladen vertraagt.
 */
export function useTimer(minutes: number, onFinish?: () => void) {
  const total = Math.round(minutes * 60)
  const [remaining, setRemaining] = useState(total)
  const [status, setStatus] = useState<TimerStatus>('idle')
  const endRef = useRef(0)
  const finishRef = useRef(onFinish)
  finishRef.current = onFinish

  useEffect(() => {
    if (status !== 'running') return
    const tick = () => {
      const left = Math.max(0, Math.ceil((endRef.current - Date.now()) / 1000))
      setRemaining(left)
      if (left <= 0) {
        setStatus('done')
        finishRef.current?.()
      }
    }
    const id = window.setInterval(tick, 250)
    tick()
    return () => window.clearInterval(id)
  }, [status])

  const start = useCallback(() => {
    const from = status === 'paused' ? remaining : total
    endRef.current = Date.now() + from * 1000
    setRemaining(from)
    setStatus('running')
  }, [status, remaining, total])

  const pause = useCallback(() => {
    setRemaining(Math.max(0, Math.ceil((endRef.current - Date.now()) / 1000)))
    setStatus('paused')
  }, [])

  const reset = useCallback(() => {
    setRemaining(total)
    setStatus('idle')
  }, [total])

  return { remaining, total, status, start, pause, reset, progress: total ? 1 - remaining / total : 0 }
}
