import type { PetState } from '@/domain'
import { getPetAfterlife } from '@/domain'
import { useMemo, type ReactElement } from 'react'
import { FACE_PROFILES, type FaceProfile } from './TamagotchiScreen.constants'
import styles from './TamagotchiScreen.module.css'

interface PetViewProps {
  state: PetState
}

type GazeMode = 'scan' | 'out-up' | 'out-down'
const OUT_UP_MOODS = new Set<PetState['mood']>(['curious', 'playful', 'delighted'])
const OUT_DOWN_MOODS = new Set<PetState['mood']>([
  'hungry',
  'very-hungry',
  'needy',
  'anxious',
  'exhausted',
  'sleeping',
])

function getFaceProfile(state: PetState): FaceProfile {
  const afterlife = getPetAfterlife(state)

  if (afterlife.phase === 'tombstone') {
    return FACE_PROFILES.tombstone as FaceProfile
  }

  if (state.stage === 'departed' || afterlife.phase === 'memorial' || state.lifecycle.isDeparted) {
    return FACE_PROFILES.departed as FaceProfile
  }

  if (state.sicknessCount > 0) {
    return FACE_PROFILES.sick as FaceProfile
  }

  if (state.attentionActive) {
    if (state.calls.some((call) => !call.resolved && call.type === 'hunger')) {
      return FACE_PROFILES['very-hungry'] as FaceProfile
    }

    if (state.calls.some((call) => !call.resolved && call.type === 'effort')) {
      return FACE_PROFILES.anxious as FaceProfile
    }
  }

  return FACE_PROFILES[state.mood] ?? (FACE_PROFILES.content as FaceProfile)
}

function getGazeMode(state: PetState): GazeMode {
  if (OUT_UP_MOODS.has(state.mood)) {
    return 'out-up'
  }
  if (OUT_DOWN_MOODS.has(state.mood)) {
    return 'out-down'
  }
  return 'scan'
}

export function PetView({ state }: PetViewProps): ReactElement {
  const face = useMemo(() => getFaceProfile(state), [state])
  const gaze = useMemo(() => getGazeMode(state), [state])
  const hasUrgentCall = useMemo(
    () =>
      state.attentionActive &&
      state.calls.some((c) => !c.resolved && (c.type === 'hunger' || c.type === 'sickness')),
    [state.attentionActive, state.calls],
  )

  const isDire = state.lifecycle.isDeparted || state.sicknessCount > 2
  const isWarning = state.sicknessCount > 0 || hasUrgentCall

  const viewClass = [
    styles.petView,
    gaze === 'scan' ? styles.gazeScan : gaze === 'out-up' ? styles.gazeOutUp : styles.gazeOutDown,
    isDire ? styles.stateDire : isWarning ? styles.stateWarning : '',
  ].join(' ')

  return (
    <div className={viewClass}>
      <div className={styles.shellGlow} />
      {state.attentionActive && <div className={styles.attentionPulse} />}

      <div className={styles.petFace}>
        <div className={styles.faceFrame}>
          <div className={styles.eye}>
            <span
              className={styles.eyeGlyph}
              style={{ transform: `translate(${face.leftEye.x}px, ${face.leftEye.y}px)` }}
            >
              {face.leftEyeGlyph}
            </span>
          </div>
          <div className={styles.eye}>
            <span
              className={styles.eyeGlyph}
              style={{ transform: `translate(${face.rightEye.x}px, ${face.rightEye.y}px)` }}
            >
              {face.rightEyeGlyph}
            </span>
          </div>
          <div className={styles.mouth}>{face.mouth}</div>
        </div>
      </div>

      <div className={styles.petCaption}>{state.name}</div>
      <div className={styles.petSubcaption}>
        {state.mood.charAt(0).toUpperCase() + state.mood.slice(1)}
      </div>
    </div>
  )
}
