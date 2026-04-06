/**
 * useIonicToast — Hook for triggering toast notifications.
 *
 * REFACTORED to remove Ionic dependency. Uses simple web-based notifications instead.
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

/**
 * Simple web-based toast notification without Ionic dependency.
 */
function createWebToast(options: ToastOptions): Promise<void> {
  return new Promise((resolve) => {
    if (typeof document === 'undefined') {
      resolve()
      return
    }

    const container = document.createElement('div')
    container.className = `toast toast--${options.color || 'default'} toast--${options.position || 'bottom'}`
    container.style.cssText = `
      position: fixed;
      ${options.position === 'top' ? 'top: 20px' : 'bottom: 20px'};
      left: 50%;
      transform: translateX(-50%);
      background: ${getToastBgColor(options.color)};
      color: white;
      padding: 12px 16px;
      border-radius: 4px;
      font-size: 14px;
      z-index: 9999;
      animation: slideIn 0.3s ease-in-out;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
      max-width: 90%;
      word-wrap: break-word;
    `

    if (options.cssClass) {
      container.className += ` ${options.cssClass}`
    }

    container.textContent = options.message
    document.body.appendChild(container)

    // Add animation styles if not already present
    if (!document.querySelector('#toast-styles')) {
      const style = document.createElement('style')
      style.id = 'toast-styles'
      style.textContent = `
        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateX(-50%) translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateX(-50%) translateY(0);
          }
        }
        @keyframes slideOut {
          from {
            opacity: 1;
            transform: translateX(-50%) translateY(0);
          }
          to {
            opacity: 0;
            transform: translateX(-50%) translateY(20px);
          }
        }
        .toast.fadeOut {
          animation: slideOut 0.3s ease-in-out forwards;
        }
      `
      document.head.appendChild(style)
    }

    // Auto-dismiss
    const duration = options.duration ?? 2000
    const timeout = setTimeout(() => {
      container.classList.add('fadeOut')
      setTimeout(() => {
        container.remove()
        resolve()
      }, 300)
    }, duration)

    // Allow manual dismiss
    container.style.cursor = 'pointer'
    container.addEventListener('click', () => {
      clearTimeout(timeout)
      container.classList.add('fadeOut')
      setTimeout(() => {
        container.remove()
        resolve()
      }, 300)
    })
  })
}

function getToastBgColor(color?: string): string {
  const colorMap: Record<string, string> = {
    danger: '#dc3545',
    error: '#dc3545',
    warning: '#ffc107',
    info: '#17a2b8',
    primary: '#007bff',
    success: '#28a745',
    default: '#333333',
  }
  return colorMap[color || 'default'] || colorMap.default
}

export function useIonicToast() {
  const show = (options: ToastOptions) => {
    return createWebToast(options)
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
      color: 'info',
      icon: 'information-circle',
    })
  }

  const text = (message: string, duration = 1800) => {
    return show({
      message,
      duration,
      cssClass: 'toast--text-only',
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
