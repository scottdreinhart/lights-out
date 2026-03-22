import { useI18nContext } from '@/app'
import type { Difficulty, GameMode } from '@/domain'
import { DifficultyToggle, RulesToggle } from '@/ui'
import styles from './QuickGameSettings.module.css'

interface QuickGameSettingsProps {
  difficulty: Difficulty
  mode: GameMode
  onSelectDifficulty: (difficulty: Difficulty) => void
  onSelectMode: (mode: GameMode) => void
}

export function QuickGameSettings({
  difficulty,
  mode,
  onSelectDifficulty,
  onSelectMode,
}: QuickGameSettingsProps) {
  const { t } = useI18nContext()

  return (
    <>
      <div className={styles.sectionLabel}>
        {t('app.quickDifficulty')}
      </div>
      <DifficultyToggle difficulty={difficulty} onSelect={onSelectDifficulty} />

      <div className={styles.sectionLabel}>
        {t('app.quickRules')}
      </div>
      <RulesToggle mode={mode} onSelect={onSelectMode} />
    </>
  )
}
