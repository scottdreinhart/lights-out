import { useI18nContext } from '@/app'
import { useResponsiveState } from '@games/app-hook-utils'
import type { GameStats } from '@/domain'
import { cx } from '@/ui'

import styles from './MainMenu.module.css'

interface MainMenuProps {
  isMobile: boolean
  stats: GameStats
  onPlay: () => void
  onPlayLocal: () => void
}

export function MainMenu({ isMobile, stats, onPlay, onPlayLocal }: MainMenuProps) {
  const responsive = useResponsiveState()
  const { t } = useI18nContext()

  // Determine layout variant based on device class
  const layoutVariant = responsive.isMobile ? 'mobile' : responsive.isTablet ? 'tablet' : 'desktop'

  return (
    <div
      className={cx(
        styles.root,
        styles[`root${layoutVariant.charAt(0).toUpperCase() + layoutVariant.slice(1)}`],
        isMobile && styles.rootMobile, // Legacy fallback
      )}
    >
      <h1 className={styles.title}>{t('mainMenu.title')}</h1>
      <p
        className={styles.subtitle}
        style={{
          fontSize: responsive.contentDensity === 'compact' ? '0.85rem' : '0.95rem',
        }}
      >
        {t('mainMenu.subtitle')}
      </p>

      {(stats.wins > 0 || stats.losses > 0) && (
        <div
          className={styles.statsRow}
          style={{
            gap: responsive.contentDensity === 'compact' ? '1rem' : '2rem',
            marginTop: responsive.contentDensity === 'compact' ? '1rem' : '2rem',
            flexDirection: responsive.isMobile ? 'row' : 'row',
            justifyContent: 'center',
          }}
        >
          <div className={styles.statItem}>
            <span
              className={styles.statValue}
              style={{
                fontSize: responsive.contentDensity === 'compact' ? '1.2rem' : '1.4rem',
              }}
            >
              {stats.wins}
            </span>
            <span className={styles.statLabel}>{t('mainMenu.wins')}</span>
          </div>
          <div className={styles.statItem}>
            <span
              className={styles.statValue}
              style={{
                fontSize: responsive.contentDensity === 'compact' ? '1.2rem' : '1.4rem',
              }}
            >
              {stats.losses}
            </span>
            <span className={styles.statLabel}>{t('mainMenu.losses')}</span>
          </div>
          <div className={styles.statItem}>
            <span
              className={styles.statValue}
              style={{
                fontSize: responsive.contentDensity === 'compact' ? '1.2rem' : '1.4rem',
              }}
            >
              {stats.bestStreak}
            </span>
            <span className={styles.statLabel}>{t('mainMenu.bestStreak')}</span>
          </div>
        </div>
      )}

      <div
        className={styles.buttons}
        style={{
          flexDirection: responsive.isDesktop ? 'row' : 'column',
          gap: responsive.contentDensity === 'compact' ? '0.75rem' : '1rem',
          maxWidth: responsive.isDesktop ? '100%' : '320px',
        }}
      >
        <button
          className={styles.primaryBtn}
          onClick={onPlay}
          style={{
            padding: responsive.contentDensity === 'compact' ? '0.9rem' : '1.2rem',
            fontSize: responsive.contentDensity === 'compact' ? '1rem' : '1.2rem',
            flex: responsive.isDesktop ? 1 : 'none',
          }}
        >
          {t('mainMenu.playVsAi')}
        </button>
        <button
          className={styles.secondaryBtn}
          onClick={onPlayLocal}
          style={{
            padding: responsive.contentDensity === 'compact' ? '0.9rem' : '1.2rem',
            fontSize: responsive.contentDensity === 'compact' ? '1rem' : '1.2rem',
            flex: responsive.isDesktop ? 1 : 'none',
          }}
        >
          {t('mainMenu.twoPlayer')}
        </button>
      </div>

      <p
        className={styles.hint}
        style={{
          marginTop: responsive.contentDensity === 'spacious' ? '3rem' : '2rem',
          fontSize: responsive.contentDensity === 'compact' ? '0.8rem' : '0.9rem',
        }}
      >
        {t('mainMenu.hintLine1')}
        <br />
        {t('mainMenu.hintLine2')}
      </p>
    </div>
  )
}
