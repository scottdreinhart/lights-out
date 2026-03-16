import React from 'react'

import styles from './SeriesSelector.module.css'

const SERIES_OPTIONS = [
  { value: 0, label: 'Free' },
  { value: 3, label: 'Bo3' },
  { value: 5, label: 'Bo5' },
  { value: 7, label: 'Bo7' },
] as const

interface SeriesSelectorProps {
  seriesLength: number
  onSelect: (value: number) => void
}

const SeriesSelector = React.memo<SeriesSelectorProps>(({ seriesLength, onSelect }) => (
  <div className={styles.root} role="group" aria-label="Series mode">
    {SERIES_OPTIONS.map(({ value, label }) => (
      <button
        key={value}
        type="button"
        className={`${styles.option}${seriesLength === value ? ` ${styles.active}` : ''}`}
        onClick={seriesLength !== value ? () => onSelect(value) : undefined}
        aria-pressed={seriesLength === value}
      >
        {label}
      </button>
    ))}
  </div>
))

SeriesSelector.displayName = 'SeriesSelector'

export default SeriesSelector
