import { useEffect, useMemo, useState, type ReactElement } from 'react'

import { Button, CounterBadge, StatsBar, useResponsiveState } from '@games/assets-shared'

import { useSoundEffects, useTamagotchiEngine } from '@/app'
import {
  buildTamagotchiSignalProfile,
  getPetAgeInDays,
  getPetBank,
  VARIANT_IDS,
  type PetState,
} from '@/domain'
import { ActionPanel } from './ActionPanel'
import { ActiveCalls } from './ActiveCalls'
import { DebugModal } from './DebugModal'
import { EngineModal } from './EngineModal'
import { EventHistory } from './EventHistory'
import { GenomeModal } from './GenomeModal'
import { PetView } from './PetView'
import { RelationshipPanel } from './RelationshipPanel'
import { SignalPanel } from './SignalPanel'
import { StatusPanel } from './StatusPanel'
import { MOOD_EMOJIS, STAGE_BADGES, VARIANT_EMOJIS } from './TamagotchiScreen.constants'

import styles from './TamagotchiScreen.module.css'

function getVariantLabel(variantId: (typeof VARIANT_IDS)[number]): string {
  switch (variantId) {
    case 'original':
      return 'Original'
    case 'angel':
      return 'Angel'
    case 'ocean':
      return 'Ocean'
    default:
      return 'Original'
  }
}

function getStageBadgeLabel(stage: PetState['stage']): string {
  const badge = STAGE_BADGES.find((entry) => entry.stage === stage) ?? STAGE_BADGES[0]
  return `${badge.emoji} ${badge.label}`
}

function getMoodEmoji(mood: PetState['mood']): string {
  return (MOOD_EMOJIS.find((entry) => entry.mood === mood) ?? MOOD_EMOJIS[1]).emoji
}

function getVariantEmoji(variantId: (typeof VARIANT_IDS)[number]): string {
  return (VARIANT_EMOJIS.find((entry) => entry.variantId === variantId) ?? VARIANT_EMOJIS[0]).emoji
}

export function TamagotchiApp(): ReactElement {
  const { state, controls } = useTamagotchiEngine('original')
  const responsive = useResponsiveState()
  const { playSound, updateMusic, startMusic } = useSoundEffects()
  const [isDetailsOpen, setIsDetailsOpen] = useState(false)
  const [isDebugOpen, setIsDebugOpen] = useState(false)
  const [isEngineOpen, setIsEngineOpen] = useState(false)

  // Start music on first interaction if not started
  const handleInteraction = (action: string) => {
    startMusic()
    controls.dispatch(action as any)
  }

  // Sound feedback for attention calls
  useEffect(() => {
    if (state.attentionActive) {
      playSound('beep')
    }
  }, [state.attentionActive, playSound])

  const ageDays = useMemo(() => getPetAgeInDays(state), [state])
  const bank = useMemo(() => getPetBank(state), [state])
  const signalProfile = useMemo(() => buildTamagotchiSignalProfile(state), [state])

  // Update dynamic music based on gaming metrics
  useEffect(() => {
    updateMusic(signalProfile.intensity, signalProfile.pressure)
  }, [signalProfile.intensity, signalProfile.pressure, updateMusic])

  return (
    <div className={styles.shell} onClick={() => startMusic()}>
      <main className={styles.board}>
        <section className={styles.petColumn}>
          <PetView state={state} />

          <StatsBar className={styles.heroStats}>
            <CounterBadge label="Age" value={`${ageDays.toFixed(3)}d`} />
            <CounterBadge label="Stage" value={getStageBadgeLabel(state.stage)} tone="player" />
            <CounterBadge label="Mood" value={`${getMoodEmoji(state.mood)} ${state.mood}`} />
            <CounterBadge
              label="Variant"
              value={`${getVariantEmoji(state.variantId)} ${getVariantLabel(state.variantId)}`}
            />
          </StatsBar>

          <ActiveCalls state={state} />

          <div className={styles.utilityButtons}>
            <Button variant="secondary" onClick={() => setIsDetailsOpen(true)}>
              View Genome
            </Button>
            <Button variant="secondary" onClick={() => setIsEngineOpen(true)}>
              Engine Analytics
            </Button>
            <Button variant="secondary" onClick={() => setIsDebugOpen(true)}>
              Debug Engine
            </Button>
          </div>
        </section>

        <section className={styles.rightColumn}>
          <ActionPanel
            state={state}
            controls={{ ...controls, dispatch: handleInteraction } as any}
            isMobile={responsive.isMobile || responsive.isTablet}
          />

          <SignalPanel state={state} bank={bank} profile={signalProfile} />
          <StatusPanel state={state} />
        </section>
      </main>

      {bank && (
        <section className={styles.insights}>
          <RelationshipPanel state={state} bank={bank} />
        </section>
      )}

      <section className={styles.history}>
        <EventHistory history={state.history} />
      </section>

      {isDetailsOpen && (
        <GenomeModal state={state} controls={controls} onClose={() => setIsDetailsOpen(false)} />
      )}

      {isDebugOpen && (
        <DebugModal state={state} controls={controls} onClose={() => setIsDebugOpen(false)} />
      )}

      {isEngineOpen && <EngineModal state={state} onClose={() => setIsEngineOpen(false)} />}
    </div>
  )
}
