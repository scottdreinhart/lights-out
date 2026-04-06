/**
 * Rules Modal Component
 * Displays game rules for the current variant
 */

import type { WarRuleConfig } from '@/domain'
import { RULES_TEXT, RULE_DESCRIPTIONS } from '@/domain'
import React, { useState } from 'react'
import styles from './RulesModal.module.css'

interface RulesModalProps {
  isOpen: boolean
  onClose: () => void
  rules: WarRuleConfig
  variant?: keyof typeof RULES_TEXT
}

export const RulesModal: React.FC<RulesModalProps> = ({
  isOpen,
  onClose,
  rules,
  variant = 'CLASSIC',
}) => {
  if (!isOpen) return null

  const rulesText = RULES_TEXT[variant] ?? RULES_TEXT.CLASSIC
  const description = RULE_DESCRIPTIONS[variant]

  return (
    <div className={styles.overlay} onClick={onClose} role="presentation">
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.header}>
          <h2 className={styles.title}>
            {description?.title ?? 'War Card Game Rules'}
          </h2>
          <button className={styles.closeButton} onClick={onClose} aria-label="Close rules">
            ✕
          </button>
        </div>

        <div className={styles.content}>
          {description && (
            <p className={styles.description}>{description.description}</p>
          )}

          <div className={styles.rulesText}>
            {rulesText.split('\n').map((line, i) => {
              if (line.startsWith('#')) {
                return (
                  <h3 key={i} className={styles.heading}>
                    {line.replace(/^#+\s*/, '')}
                  </h3>
                )
              }
              if (line.startsWith('-')) {
                return (
                  <li key={i} className={styles.listItem}>
                    {line.replace(/^-\s*/, '')}
                  </li>
                )
              }
              if (line.trim().match(/^\d+\./)) {
                return (
                  <li key={i} className={styles.numberedItem}>
                    {line.trim()}
                  </li>
                )
              }
              if (line.trim()) {
                return (
                  <p key={i} className={styles.paragraph}>
                    {line}
                  </p>
                )
              }
              return <div key={i} className={styles.spacer} />
            })}
          </div>
        </div>

        <div className={styles.footer}>
          <button className={styles.button} onClick={onClose}>
            Got it!
          </button>
        </div>
      </div>
    </div>
  )
}
