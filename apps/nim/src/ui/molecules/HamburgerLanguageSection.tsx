import { useI18nContext } from '@/app'
import type { Locale } from '@/domain'
import { cx } from '@/ui'
import styles from './HamburgerSettingsSections.module.css'

interface HamburgerLanguageSectionProps {
  locale: Locale
  onSelectLocale: (locale: Locale) => void
}

export function HamburgerLanguageSection({
  locale,
  onSelectLocale,
}: HamburgerLanguageSectionProps) {
  const { t } = useI18nContext()

  return (
    <section className={styles.hamburgerSection}>
      <h3 className={styles.hamburgerSectionTitle}>{t('settings.language')}</h3>
      <div className={styles.hamburgerLocaleRow} role="radiogroup" aria-label={t('settings.language')}>
        <button
          type="button"
          className={cx(styles.hamburgerLocaleBtn, locale === 'en' && styles.hamburgerLocaleBtnActive)}
          role="radio"
          aria-checked={locale === 'en'}
          aria-label={`${t('settings.locale.en')} (USA)`}
          onClick={() => onSelectLocale('en')}
        >
          <span className={styles.hamburgerLocaleFlagPair} aria-hidden="true">
            <span className={cx('fi', 'fis', 'fi-us', styles.hamburgerFlagIcon)} />
          </span>
        </button><button
          type="button"
          className={cx(styles.hamburgerLocaleBtn, locale === 'es' && styles.hamburgerLocaleBtnActive)}
          role="radio"
          aria-checked={locale === 'es'}
          aria-label={`${t('settings.locale.es')} (Spain)`}
          onClick={() => onSelectLocale('es')}
        >
          <span className={styles.hamburgerLocaleFlagPair} aria-hidden="true">
            <span className={cx('fi', 'fis', 'fi-es', styles.hamburgerFlagIcon)} />
          </span>
        </button><button
          type="button"
          className={cx(styles.hamburgerLocaleBtn, locale === 'de' && styles.hamburgerLocaleBtnActive)}
          role="radio"
          aria-checked={locale === 'de'}
          aria-label={t('settings.locale.de')}
          onClick={() => onSelectLocale('de')}
        >
          <span className={styles.hamburgerLocaleFlagPair} aria-hidden="true">
            <span className={cx('fi', 'fis', 'fi-de', styles.hamburgerFlagIcon)} />
          </span>
        </button><button
          type="button"
          className={cx(styles.hamburgerLocaleBtn, locale === 'fr' && styles.hamburgerLocaleBtnActive)}
          role="radio"
          aria-checked={locale === 'fr'}
          aria-label={t('settings.locale.fr')}
          onClick={() => onSelectLocale('fr')}
        >
          <span className={styles.hamburgerLocaleFlagPair} aria-hidden="true">
            <span className={cx('fi', 'fis', 'fi-fr', styles.hamburgerFlagIcon)} />
          </span>
        </button><button
          type="button"
          className={cx(styles.hamburgerLocaleBtn, locale === 'ko' && styles.hamburgerLocaleBtnActive)}
          role="radio"
          aria-checked={locale === 'ko'}
          aria-label={t('settings.locale.ko')}
          onClick={() => onSelectLocale('ko')}
        >
          <span className={styles.hamburgerLocaleFlagPair} aria-hidden="true">
            <span className={cx('fi', 'fis', 'fi-kr', styles.hamburgerFlagIcon)} />
          </span>
        </button><button
          type="button"
          className={cx(styles.hamburgerLocaleBtn, locale === 'ja' && styles.hamburgerLocaleBtnActive)}
          role="radio"
          aria-checked={locale === 'ja'}
          aria-label={t('settings.locale.ja')}
          onClick={() => onSelectLocale('ja')}
        >
          <span className={styles.hamburgerLocaleFlagPair} aria-hidden="true">
            <span className={cx('fi', 'fis', 'fi-jp', styles.hamburgerFlagIcon)} />
          </span>
        </button>
      </div>
    </section>
  )
}
