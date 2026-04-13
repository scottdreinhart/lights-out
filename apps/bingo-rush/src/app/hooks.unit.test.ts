/**
 * Unit tests for bingo-rush hooks constants and logic
 */

import { describe, expect, it } from 'vitest'
import { EXTENSION_SECONDS, GLOBAL_TIMERS, MAX_EXTENSIONS } from '../domain'

describe('useGlobalTimer Constants', () => {
  describe('GLOBAL_TIMERS', () => {
    it('defines easy difficulty timer', () => {
      expect(GLOBAL_TIMERS.easy).toBe(300) // 5 minutes
    })

    it('defines medium difficulty timer', () => {
      expect(GLOBAL_TIMERS.medium).toBe(180) // 3 minutes
    })

    it('defines hard difficulty timer', () => {
      expect(GLOBAL_TIMERS.hard).toBe(90) // 1.5 minutes
    })

    it('defines expert difficulty timer', () => {
      expect(GLOBAL_TIMERS.expert).toBe(45) // 45 seconds
    })

    it('difficulty timers decrease in order', () => {
      expect(GLOBAL_TIMERS.expert).toBeLessThan(GLOBAL_TIMERS.hard)
      expect(GLOBAL_TIMERS.hard).toBeLessThan(GLOBAL_TIMERS.medium)
      expect(GLOBAL_TIMERS.medium).toBeLessThan(GLOBAL_TIMERS.easy)
    })
  })

  describe('EXTENSION_SECONDS', () => {
    it('provides correct extension time', () => {
      expect(EXTENSION_SECONDS).toBe(20) // Each extension adds 20 seconds
    })

    it('is positive', () => {
      expect(EXTENSION_SECONDS).toBeGreaterThan(0)
    })
  })

  describe('MAX_EXTENSIONS', () => {
    it('limits extensions to safe value', () => {
      expect(MAX_EXTENSIONS).toBe(3)
    })

    it('is greater than 0', () => {
      expect(MAX_EXTENSIONS).toBeGreaterThan(0)
    })

    it('max extension time is reasonable', () => {
      const maxExtensionTime = MAX_EXTENSIONS * EXTENSION_SECONDS
      expect(maxExtensionTime).toBe(60) // Max 60 seconds total from extensions
    })
  })

  describe('Timer Calculations', () => {
    it('easy difficulty provides longest timer', () => {
      expect(GLOBAL_TIMERS.easy >= GLOBAL_TIMERS.medium).toBe(true)
    })

    it('expert difficulty provides shortest timer', () => {
      expect(GLOBAL_TIMERS.expert <= GLOBAL_TIMERS.medium).toBe(true)
    })

    it('total max bonus time is less than easy timer', () => {
      const maxBonus = MAX_EXTENSIONS * EXTENSION_SECONDS
      const easyDuration = GLOBAL_TIMERS.easy
      expect(maxBonus).toBeLessThan(easyDuration)
    })
  })
})
