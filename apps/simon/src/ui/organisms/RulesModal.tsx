import type { SimonRuleConfig } from '@/domain'
import { RULE_VARIANTS } from '@/domain'
import type { MouseEvent } from 'react'
import styles from './RulesModal.module.css'

interface RulesModalProps {
  isOpen: boolean
  onClose: () => void
  rules: SimonRuleConfig
  variant: string
}

export const RulesModal = ({ isOpen, onClose, rules, variant }: RulesModalProps) => {
  if (!isOpen) {
    return null
  }

  const variantData = getVariantData(variant)

  const handleOverlayMouseDown = (event: MouseEvent<HTMLDivElement>) => {
    if (event.target === event.currentTarget) {
      onClose()
    }
  }

  return (
    <div className={styles.overlay} onMouseDown={handleOverlayMouseDown}>
      <div className={styles.modal} role="dialog" aria-modal="true" aria-label="Simon rules">
        <button className={styles.closeButton} onClick={onClose} aria-label="Close rules">
          ✕
        </button>
        <h2 className={styles.title}>{variantData?.name || variant}</h2>
        <p className={styles.description}>{variantData?.description}</p>

        <div className={styles.rulesContent}>
          <h3>Game Rules</h3>
          <ul>
            <li>Simon generates a sequence of colors</li>
            <li>You must repeat the sequence exactly</li>
            <li>Each round, the sequence gets one color longer</li>
            <li>Pressure rises as the timer shrinks and the pattern grows</li>
            <li>Focus tracks how much of the sequence you must hold in memory</li>
            <li>Intensity rises as playback tempo accelerates with difficulty</li>
            <li>If you make a mistake, the game ends</li>
            <li>Beat all {rules.maxSequenceLength} colors to win!</li>
          </ul>

          <h3>Configuration</h3>
          <div className={styles.configGrid}>
            <div className={styles.configItem}>
              <span className={styles.configLabel}>Max Sequence:</span>
              <span className={styles.configValue}>{rules.maxSequenceLength}</span>
            </div>
            <div className={styles.configItem}>
              <span className={styles.configLabel}>Timeout:</span>
              <span className={styles.configValue}>{rules.inputTimeoutMs}ms</span>
            </div>
            <div className={styles.configItem}>
              <span className={styles.configLabel}>Colors:</span>
              <span className={styles.configValue}>{rules.colorCount}</span>
            </div>
            <div className={styles.configItem}>
              <span className={styles.configLabel}>Difficulty:</span>
              <span className={styles.configValue}>{rules.difficultyLevel}/4</span>
            </div>
          </div>
        </div>

        <button className={styles.okButton} onClick={onClose}>
          Got it!
        </button>
      </div>
    </div>
  )
}

function getVariantData(variant: string) {
  switch (variant) {
    case 'CLASSIC':
      return RULE_VARIANTS.CLASSIC
    case 'PLAYER_ADDS':
      return RULE_VARIANTS.PLAYER_ADDS
    case 'TIMED_MODE':
      return RULE_VARIANTS.TIMED_MODE
    case 'MULTIPLAYER':
      return RULE_VARIANTS.MULTIPLAYER
    case 'SIMON_AIR':
      return RULE_VARIANTS.SIMON_AIR
    case 'SIMON_SWIPE':
      return RULE_VARIANTS.SIMON_SWIPE
    default:
      return undefined
  }
}
