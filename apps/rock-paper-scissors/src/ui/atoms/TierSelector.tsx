import type { GameTier } from '@/domain'
import { GAME_TIERS, TIER_DESCRIPTIONS, TIER_LABELS } from '@/domain'
import './TierSelector.css'

interface TierSelectorProps {
  selectedTier: GameTier
  onSelectTier: (tier: GameTier) => void
  disabled?: boolean
}

export function TierSelector({ selectedTier, onSelectTier, disabled = false }: TierSelectorProps) {
  return (
    <div className="tier-selector">
      <h2>Choose Game Length</h2>
      <div className="tier-grid">
        {GAME_TIERS.map((tier) => (
          <button
            key={tier}
            className={`tier-button ${selectedTier === tier ? 'selected' : ''}`}
            onClick={() => onSelectTier(tier)}
            disabled={disabled}
          >
            <div className="tier-label">{TIER_LABELS[tier]}</div>
            <div className="tier-description">{TIER_DESCRIPTIONS[tier]}</div>
          </button>
        ))}
      </div>
    </div>
  )
}
