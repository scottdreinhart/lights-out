import type { SimonRuleConfig } from '@/domain'
import { RULE_VARIANTS } from '@/domain'
import styles from './RulesModal.module.css'

interface RulesModalProps {
  isOpen: boolean
  onClose: () => void
  rules: SimonRuleConfig
  variant: string
}

export function RulesModal({ isOpen, onClose, rules, variant }: RulesModalProps) {
  if (!isOpen) return null

  const variantData = RULE_VARIANTS[variant]

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
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
