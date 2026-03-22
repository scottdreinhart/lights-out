import React from 'react'

import useCoinFlipAnimation from '../../app/useCoinFlipAnimation.ts'
import OMark from '../atoms/OMark.tsx'
import XMark from '../atoms/XMark.tsx'
import styles from './CoinFlip.module.css'

interface CoinFlipProps {
  onFlipComplete: (isXFirst: boolean) => void
}

export const CoinFlip: React.FC<CoinFlipProps> = ({ onFlipComplete }) => {
  const { isFlipping, result, ready, stopFlip } = useCoinFlipAnimation({
    onComplete: onFlipComplete,
  })

  if (!ready) {
    return null
  }

  return (
    <div className={styles.container}>
      <div className={styles.backdrop} />
      <div className={styles.content}>
        <h2 className={styles.title}>Who goes first?</h2>
        <p className={styles.hint}>{isFlipping ? 'Tap coin to stop' : ''}</p>
        <div
          className={styles.coinWrapper}
          onClick={stopFlip}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              stopFlip()
            }
          }}
          role="button"
          tabIndex={0}
          aria-label="Tap to stop coin flip"
        >
          <div className={isFlipping ? styles.coinFlipping : styles.coinStatic}>
            <div className={styles.coinFace}>
              <XMark className={styles.coinMark} />
            </div>
            <div className={styles.coinBack}>
              <OMark className={styles.coinMark} />
            </div>
          </div>
        </div>
        {result ? (
          <p className={styles.result}>{result === 'X' ? 'You go first!' : 'CPU goes first!'}</p>
        ) : (
          <p className={styles.resultPlaceholder} aria-hidden="true">
            &nbsp;
          </p>
        )}
      </div>
    </div>
  )
}

export default CoinFlip
