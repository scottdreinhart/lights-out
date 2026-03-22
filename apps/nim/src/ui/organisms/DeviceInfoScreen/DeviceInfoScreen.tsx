/**
 * Device Info Screen — Shows platform and device information
 * Accessible from hamburger menu
 */

import { useEffect, useState } from 'react'
import { usePlatform } from '@/app'
import { useResponsiveState } from '@games/app-hook-utils'
import type { DeviceInfo as CapacitorDeviceInfo } from '@capacitor/device'
import styles from './DeviceInfoScreen.module.css'

interface DisplayInfo {
  label: string
  value: string
}

export const DeviceInfoScreen = () => {
  const { platform, isCapacitor, isElectron } = usePlatform()
  const responsive = useResponsiveState()
  const [deviceInfo, setDeviceInfo] = useState<CapacitorDeviceInfo | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!isCapacitor) return

    const loadDeviceInfo = async () => {
      setLoading(true)
      setError(null)
      try {
        const { Device } = await import('@capacitor/device')
        const info = await Device.getInfo()
        setDeviceInfo(info)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load device info')
      } finally {
        setLoading(false)
      }
    }

    loadDeviceInfo()
  }, [isCapacitor])

  const platformInfo: DisplayInfo[] = [
    [
      { label: 'Runtime', value: isElectron ? 'Electron' : isCapacitor ? 'Capacitor' : 'Browser' },
    ],
    [
      {
        label: 'Platform',
        value:
          platform === 'capacitor-android'
            ? 'Android'
            : platform === 'capacitor-ios'
              ? 'iOS'
              : platform === 'electron'
                ? 'Electron'
                : 'Web',
      },
    ],
    [{ label: 'User Agent', value: navigator.userAgent.substring(0, 80) }],
  ].flat()

  const deviceDisplayInfo: DisplayInfo[] = deviceInfo
    ? [
        { label: 'Device Model', value: deviceInfo.model || 'Unknown' },
        { label: 'OS Version', value: deviceInfo.osVersion || 'Unknown' },
        {
          label: 'Manufacturer',
          value: (deviceInfo.manufacturer as unknown as string) || 'Unknown',
        },
        {
          label: 'Real Device',
          value: deviceInfo.isVirtual ? 'No (Virtual)' : 'Yes',
        },
      ]
    : []

  const allInfo = [...platformInfo, ...deviceDisplayInfo]

  return (
    <div
      className={styles.root}
      style={{
        padding: responsive.contentDensity === 'compact' ? '1rem' : '1.5rem',
        gap: responsive.contentDensity === 'spacious' ? '2rem' : '1.5rem',
      }}
    >
      <div>
        <h2 className={styles.title}>Device Information</h2>
        <p className={styles.subtitle}>Platform and device details</p>
      </div>

      {loading && (
        <div className={styles.state}>
          <p>Loading device info...</p>
        </div>
      )}

      {error && (
        <div className={styles.state} style={{ color: 'var(--color-danger, #d32f2f)' }}>
          <p>Error: {error}</p>
        </div>
      )}

      {!loading && !error && (
        <div className={styles.infoList}>
          {allInfo.map((item, idx) => (
            <div key={idx} className={styles.infoItem}>
              <div className={styles.infoLabel}>{item.label}</div>
              <div className={styles.infoValue}>{item.value}</div>
            </div>
          ))}
        </div>
      )}

      <div className={styles.note}>
        <p>
          <small>💡 This information helps debug platform-specific issues.</small>
        </p>
      </div>
    </div>
  )
}
