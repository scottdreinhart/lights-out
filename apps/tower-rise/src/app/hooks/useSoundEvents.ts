import type { SoundEvent } from '@/domain'
import { audioManager } from '@/infrastructure/audio/audio-manager'
import { useEffect, useRef } from 'react'

export function useSoundEvents(events: SoundEvent[]) {
  const processedRef = useRef<Set<number>>(new Set())

  useEffect(() => {
    for (const event of events) {
      if (processedRef.current.has(event.id)) {
        continue
      }
      audioManager.play(event.type)
      processedRef.current.add(event.id)
    }
  }, [events])
}
