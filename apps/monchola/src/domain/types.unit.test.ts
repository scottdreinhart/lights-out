/**
 * monchola — domain types unit tests.
 * Domain is scaffolded; tests verify shared type contracts.
 */

import { describe, expect, it } from 'vitest'
import type { ColorTheme, ThemeSettings } from './types'

describe('monchola domain types', () => {
  describe('ColorTheme', () => {
    it('accepts a valid color theme', () => {
      const theme: ColorTheme = { id: 'sunset', label: 'Sunset', accent: '#f97316' }
      expect(theme.id).toBe('sunset')
      expect(theme.label).toBe('Sunset')
      expect(theme.accent).toMatch(/^#[0-9a-f]{6}/i)
    })

    it('id and label are distinct fields', () => {
      const theme: ColorTheme = { id: 'a', label: 'Label A', accent: '#ffffff' }
      expect(theme.id).not.toBe(theme.label)
    })
  })

  describe('ThemeSettings', () => {
    it('accepts dark mode', () => {
      const settings: ThemeSettings = { colorTheme: 'sunset', mode: 'dark', colorblind: 'none' }
      expect(settings.mode).toBe('dark')
    })

    it('accepts light mode', () => {
      const settings: ThemeSettings = { colorTheme: 'default', mode: 'light', colorblind: 'none' }
      expect(settings.mode).toBe('light')
    })

    it('stores colorblind preference', () => {
      const settings: ThemeSettings = {
        colorTheme: 'default',
        mode: 'dark',
        colorblind: 'protanopia',
      }
      expect(settings.colorblind).toBe('protanopia')
    })
  })
})
