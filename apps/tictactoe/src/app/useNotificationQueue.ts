import { useCallback, useRef, useState } from 'react'

import type { Notification } from '@/domain'

const DEFAULT_DURATION = 10000

interface UseNotificationQueueReturn {
  current: Notification | null
  enqueue: (notification: {
    message: string
    variant?: string
    duration?: number
    hasAction?: boolean
  }) => void
  dismiss: () => void
  clear: () => void
  updateCurrent: (updates: Partial<Notification>) => void
}

const useNotificationQueue = (): UseNotificationQueueReturn => {
  const [queue, setQueue] = useState<Notification[]>([])
  const idRef = useRef(0)

  const enqueue = useCallback(
    ({
      message,
      variant = 'info',
      duration = DEFAULT_DURATION,
      hasAction = false,
    }: {
      message: string
      variant?: string
      duration?: number
      hasAction?: boolean
    }) => {
      idRef.current += 1
      const id = idRef.current
      setQueue((prev) => [...prev, { id, message, variant, duration, hasAction }])
    },
    [],
  )

  const dismiss = useCallback(() => {
    setQueue((prev) => prev.slice(1))
  }, [])

  const clear = useCallback(() => {
    setQueue([])
  }, [])

  const updateCurrent = useCallback((updates: Partial<Notification>) => {
    setQueue((prev) => {
      if (prev.length === 0) {
        return prev
      }
      const head = prev[0]
      if (!head) {
        return prev
      }
      const rest = prev.slice(1)
      const updated: Notification = {
        id: updates.id ?? head.id,
        message: updates.message ?? head.message,
        variant: updates.variant ?? head.variant,
        duration: updates.duration ?? head.duration,
        hasAction: updates.hasAction ?? head.hasAction,
      }
      return [updated, ...rest]
    })
  }, [])

  const current = queue[0] ?? null

  return { current, enqueue, dismiss, clear, updateCurrent }
}

export default useNotificationQueue
