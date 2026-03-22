import { useI18nContext } from '@/app'
import { cx } from '@/ui'

import styles from './LoadingScreen.module.css'

export function LoadingScreen() {
  const { t } = useI18nContext()

  return (
    <div className={styles.root} role="status" aria-live="polite" aria-atomic="true">
      <div className={styles.logo}>
        <div className={styles.coinStack}>
          <div className={styles.coin} />
          <div className={styles.coin} />
          <div className={styles.coin} />
        </div>
      </div>
      <h2 className={cx(styles.text)}>{t('loading.text')}</h2>
    </div>
  )
}
