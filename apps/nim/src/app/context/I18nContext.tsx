import { DEFAULT_LOCALE, type Locale, type TranslationKey, translate } from '@/domain'
import { load, save } from '@/infrastructure/storage'
import type { ReactNode } from 'react'
import { createContext, useCallback, useContext, useMemo, useState } from 'react'

const STORAGE_KEY = 'app-locale'

interface I18nContextValue {
  locale: Locale
  setLocale: (locale: Locale) => void
  t: (key: TranslationKey, params?: Record<string, string | number>) => string
}

const I18nContext = createContext<I18nContextValue | null>(null)

const isLocale = (value: unknown): value is Locale =>
  value === 'en' ||
  value === 'es' ||
  value === 'de' ||
  value === 'fr' ||
  value === 'ko' ||
  value === 'ja'

export function I18nProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>(() => {
    const stored = load<string>(STORAGE_KEY, DEFAULT_LOCALE)
    if (isLocale(stored)) {
      return stored
    }
    return DEFAULT_LOCALE
  })

  const setLocale = useCallback((nextLocale: Locale) => {
    setLocaleState(nextLocale)
    save(STORAGE_KEY, nextLocale)
  }, [])

  const t = useCallback(
    (key: TranslationKey, params?: Record<string, string | number>) => {
      return translate(locale, key, params)
    },
    [locale],
  )

  const value = useMemo(
    () => ({
      locale,
      setLocale,
      t,
    }),
    [locale, setLocale, t],
  )

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>
}

export function useI18nContext(): I18nContextValue {
  const context = useContext(I18nContext)
  if (!context) {
    throw new Error('useI18nContext must be used within a <I18nProvider>')
  }
  return context
}
