import { describe, expect, it } from 'vitest'
import {
  POWER_UP_ACTIVATION_REQUIREMENTS,
  POWER_UP_EARNING_RATES,
  POWER_UP_EFFECTS,
  POWER_UP_INVENTORY_LIMITS,
  POWER_UP_RARITIES,
} from './constants'

describe('Power Bingo Constants', () => {
  describe('POWER_UP_EARNING_RATES', () => {
    it('defines earning rate for easy difficulty', () => {
      expect(POWER_UP_EARNING_RATES.easy).toBeDefined()
      expect(typeof POWER_UP_EARNING_RATES.easy).toBe('number')
    })

    it('defines earning rate for medium difficulty', () => {
      expect(POWER_UP_EARNING_RATES.medium).toBeDefined()
      expect(typeof POWER_UP_EARNING_RATES.medium).toBe('number')
    })

    it('defines earning rate for hard difficulty', () => {
      expect(POWER_UP_EARNING_RATES.hard).toBeDefined()
      expect(typeof POWER_UP_EARNING_RATES.hard).toBe('number')
    })

    it('defines earning rate for expert difficulty', () => {
      expect(POWER_UP_EARNING_RATES.expert).toBeDefined()
      expect(typeof POWER_UP_EARNING_RATES.expert).toBe('number')
    })

    it('earning rates increase with difficulty (harder = fewer power-ups)', () => {
      expect(POWER_UP_EARNING_RATES.easy).toBeLessThanOrEqual(POWER_UP_EARNING_RATES.medium)
      expect(POWER_UP_EARNING_RATES.medium).toBeLessThanOrEqual(POWER_UP_EARNING_RATES.hard)
      expect(POWER_UP_EARNING_RATES.hard).toBeLessThanOrEqual(POWER_UP_EARNING_RATES.expert)
    })

    it('all earning rates are positive', () => {
      Object.values(POWER_UP_EARNING_RATES).forEach((rate) => {
        expect(rate).toBeGreaterThan(0)
      })
    })
  })

  describe('POWER_UP_EFFECTS', () => {
    it('defines effect configurations for all power-ups', () => {
      expect(POWER_UP_EFFECTS).toBeDefined()
      expect(POWER_UP_EFFECTS.autoMark).toBeDefined()
      expect(POWER_UP_EFFECTS.instantPattern).toBeDefined()
      expect(POWER_UP_EFFECTS.doublePoints).toBeDefined()
      expect(POWER_UP_EFFECTS.shield).toBeDefined()
      expect(POWER_UP_EFFECTS.timeExtend).toBeDefined()
    })

    it('autoMark effect has required properties', () => {
      expect(POWER_UP_EFFECTS.autoMark.quantity).toBeGreaterThan(0)
      expect(POWER_UP_EFFECTS.autoMark.pointReduction).toBeDefined()
      expect(POWER_UP_EFFECTS.autoMark.cooldown).toBeDefined()
    })

    it('instantPattern effect has required properties', () => {
      expect(POWER_UP_EFFECTS.instantPattern.quantity).toBeGreaterThan(0)
      expect(POWER_UP_EFFECTS.instantPattern.pointReduction).toBeDefined()
      expect(POWER_UP_EFFECTS.instantPattern.cooldown).toBeDefined()
    })

    it('doublePoints effect has multiplier', () => {
      expect(POWER_UP_EFFECTS.doublePoints.multiplier).toBeGreaterThan(1)
      expect(POWER_UP_EFFECTS.doublePoints.duration).toBeGreaterThan(0)
    })

    it('shield effect has penalty reduction', () => {
      expect(POWER_UP_EFFECTS.shield.penaltyReduction).toBeGreaterThan(0)
    })

    it('timeExtend effect adds seconds', () => {
      expect(POWER_UP_EFFECTS.timeExtend.secondsAdded).toBeGreaterThan(0)
    })
  })

  describe('POWER_UP_INVENTORY_LIMITS', () => {
    it('defines maximum inventory for each power-up type', () => {
      expect(POWER_UP_INVENTORY_LIMITS).toBeDefined()
      expect(POWER_UP_INVENTORY_LIMITS.autoMark).toBeGreaterThan(0)
      expect(POWER_UP_INVENTORY_LIMITS.instantPattern).toBeGreaterThan(0)
      expect(POWER_UP_INVENTORY_LIMITS.doublePoints).toBeGreaterThan(0)
      expect(POWER_UP_INVENTORY_LIMITS.shield).toBeGreaterThan(0)
      expect(POWER_UP_INVENTORY_LIMITS.timeExtend).toBeGreaterThan(0)
    })

    it('all inventory limits are positive integers', () => {
      Object.values(POWER_UP_INVENTORY_LIMITS).forEach((limit) => {
        expect(typeof limit).toBe('number')
        expect(limit).toBeGreaterThan(0)
        expect(Number.isInteger(limit)).toBe(true)
      })
    })
  })

  describe('POWER_UP_RARITIES', () => {
    it('defines rarity and weight for all power-ups', () => {
      expect(POWER_UP_RARITIES).toBeDefined()
      expect(POWER_UP_RARITIES.autoMark).toBeDefined()
      expect(POWER_UP_RARITIES.instantPattern).toBeDefined()
      expect(POWER_UP_RARITIES.doublePoints).toBeDefined()
      expect(POWER_UP_RARITIES.shield).toBeDefined()
      expect(POWER_UP_RARITIES.timeExtend).toBeDefined()
    })

    it('all weights are positive integers', () => {
      Object.values(POWER_UP_RARITIES).forEach((rarity) => {
        expect(rarity.weight).toBeGreaterThan(0)
        expect(Number.isInteger(rarity.weight)).toBe(true)
      })
    })

    it('rarity strings are valid', () => {
      const validRarities = ['common', 'uncommon', 'rare']
      Object.values(POWER_UP_RARITIES).forEach((rarity) => {
        expect(validRarities).toContain(rarity.rarity)
      })
    })
  })

  describe('POWER_UP_ACTIVATION_REQUIREMENTS', () => {
    it('defines activation rules for all power-ups', () => {
      expect(POWER_UP_ACTIVATION_REQUIREMENTS).toBeDefined()
      expect(POWER_UP_ACTIVATION_REQUIREMENTS.autoMark).toBeDefined()
      expect(POWER_UP_ACTIVATION_REQUIREMENTS.instantPattern).toBeDefined()
      expect(POWER_UP_ACTIVATION_REQUIREMENTS.doublePoints).toBeDefined()
      expect(POWER_UP_ACTIVATION_REQUIREMENTS.shield).toBeDefined()
      expect(POWER_UP_ACTIVATION_REQUIREMENTS.timeExtend).toBeDefined()
    })

    it('all minimum pattern progress values are non-negative', () => {
      Object.values(POWER_UP_ACTIVATION_REQUIREMENTS).forEach((req) => {
        expect(req.minimumPatternProgress).toBeGreaterThanOrEqual(0)
      })
    })
  })
})
