/**
 * useIonicToast — Hook for triggering Ionic toast notifications.
 *
 * Perfect replacement for custom toast implementations.
 *
 * Features:
 * - Text, error, warning, info variants
 * - Auto-dismiss after duration
 * - Touch-safe positioning
 * - Platform-aware stack positioning
 * - Keyboard accessible
 *
 * Usage:
 * const toast = useIonicToast()
 *
 * toast.error('Something went wrong')
 * toast.warning('Be careful!')
 * toast.info('FYI')
 * toast.text('Saved')
 *
 * Or with custom options:
 * toast.show({
 *   message: 'Custom message',
 *   duration: 3000,
 *   position: 'bottom',
 *   color: 'success',
 * })
 */

import { useIonToast } from '@ionic/react'

export interface ToastOptions {
  message: string
  duration?: number
  position?: 'top' | 'middle' | 'bottom'
  color?: string
  icon?: string
  cssClass?: string
  buttons?: Array<{
    text: string
    role?: 'cancel' | 'default'
    handler?: () => void
  }>
}

export function useIonicToast() {
  const [presentToast] = useIonToast()

  const show = async (options: ToastOptions) => {
    await presentToast({
      message: options.message,
      duration: options.duration ?? 2000,
      position: options.position ?? 'bottom',
      color: options.color,
      icon: options.icon,
      buttons: options.buttons,
      cssClass: ['ionic-toast', options.cssClass].filter(Boolean).join(' '),
    })
  }

  const error = (message: string, duration = 3000) => {
    return show({
      message,
      duration,
      color: 'danger',
      icon: 'alert-circle',
    })
  }

  const warning = (message: string, duration = 2500) => {
    return show({
      message,
      duration,
      color: 'warning',
      icon: 'warning',
    })
  }

  const info = (message: string, duration = 2000) => {
    return show({
      message,
      duration,
      color: 'primary',
      icon: 'information-circle',
    })
  }

  const text = (message: string, duration = 1800) => {
    return show({
      message,
      duration,
      cssClass: 'ionic-toast--text-only',
    })
  }

  return {
    show,
    error,
    warning,
    info,
    text,
  }
}
